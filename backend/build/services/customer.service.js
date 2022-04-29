"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReview = exports.updateName = exports.addAddon = exports.deleteAddon = exports.getAllAddonOrder = exports.changePassword = exports.update = exports.approveOrder = exports.declineOrder = exports.getOrderReviewDetails = exports.createCustomerCase = exports.updateBillingAndShippingAddress = exports.getAssessment = exports.saveReassessment = exports.getCustomerInformation = exports.createCustomer = void 0;
const ramda_1 = require("ramda");
const salesforceOrderService = __importStar(require("./salesforce/order.service"));
const salesforceOrderItemService = __importStar(require("./salesforce/orderItem.service"));
const salesforceDocumentService = __importStar(require("./salesforce/document.service"));
const salesforceCaseService = __importStar(require("./salesforce/case.service"));
const salesforceAddonService = __importStar(require("./salesforce/addOnOrder.service"));
const salesforceAssessmentService = __importStar(require("./salesforce/assessment.service"));
const addonService = __importStar(require("services/salesforce/addOnOrder.service"));
const chargebeeSubscriptionService = __importStar(require("./chargebee/subscription.service"));
const salesforce_helpers_1 = require("../helpers/salesforce.helpers");
const order_types_1 = require("types/salesforce/order.types");
const cognito_constants_1 = require("constants/cognito.constants");
const chargebeeService = __importStar(require("services/chargebee/customer.service"));
const accountService = __importStar(require("services/salesforce/account.service"));
const caseService = __importStar(require("services/salesforce/case.service"));
const user_service_1 = __importDefault(require("./cognito/user.service"));
const leadService = __importStar(require("services/salesforce/lead.service"));
const assessment_constants_1 = require("constants/salesforce/assessment.constants");
const container_1 = __importDefault(require("container"));
const Error_1 = __importDefault(require("api/exceptions/Error"));
const userAccountService = __importStar(require("services/account.service"));
const lang_1 = __importDefault(require("lang"));
const object_1 = require("utils/object");
const NotFoundException_1 = __importDefault(require("api/exceptions/NotFoundException"));
const AlreadyExistsException_1 = __importDefault(require("api/exceptions/AlreadyExistsException"));
const app_constants_1 = require("constants/app.constants");
const OperationException_1 = __importDefault(require("api/exceptions/OperationException"));
const common_constants_1 = require("constants/salesforce/common.constants");
const lead_types_1 = require("types/salesforce/lead.types");
const events_1 = require("subscribers/events");
const contact_types_1 = require("types/salesforce/contact.types");
const review_service_1 = require("./salesforce/review.service");
const createCustomer = async (createCustomerDTO) => {
    const userService = user_service_1.default();
    const { email, password, ...rest } = createCustomerDTO;
    const existingCognitoUser = await userService.getCognitoUserInPoolByEmail(createCustomerDTO.email);
    if (existingCognitoUser) {
        throw new AlreadyExistsException_1.default(cognito_constants_1.COGNITO_USER, 'User already exists');
    }
    const existingLead = await leadService.findLeadByEmail(email);
    let leadId;
    let cognitoUserDetails;
    if (existingLead && existingLead.id) {
        leadId = existingLead.id;
        await leadService.updateLead({ id: leadId, leadDetails: { email, ...rest } });
    }
    else {
        const createdLead = await leadService.createLead({
            email,
            ...rest,
            lastName: app_constants_1.ANONYMOUS_LAST_NAME_PLACEHOLDER,
        });
        leadId = createdLead.id;
    }
    try {
        cognitoUserDetails = await userService.createCognitoUserInPool({
            email,
            lastName: app_constants_1.ANONYMOUS_LAST_NAME_PLACEHOLDER,
            accountReferenceId: leadId,
        });
        await userService.assignCognitoUserToGroup({
            email: createCustomerDTO.email,
            groupName: cognito_constants_1.LEAD_USER_GROUP,
        });
        await userService.verifyUserEmail(email);
        const response = await userService.loginCognitoUser({
            email,
            password: password,
            temporaryPassword: cognitoUserDetails.temporaryPassword,
        });
        return response;
    }
    catch (error) {
        const rollbacks = [userService.deleteCognitoUser(email)];
        if (existingLead && existingLead.id) {
            rollbacks.push(leadService.deleteLead(leadId));
        }
        await Promise.all(rollbacks);
        throw error;
    }
};
exports.createCustomer = createCustomer;
const getCustomerInformation = async (salesforceId, groupNames, currentUser) => {
    try {
        if (currentUser.shouldMigrate) {
            const customEventEmitter = container_1.default.resolve(app_constants_1.CUSTOM_EVENT_EMITTER_TOKEN);
            customEventEmitter.emit(events_1.customerEvents.getCustomerInformation, { user: currentUser });
        }
        if (groupNames.includes(cognito_constants_1.ADMIN_USER_GROUP)) {
            return {
                email: currentUser.email,
                isAdmin: true,
                status: contact_types_1.ContactStatus.Active,
            };
        }
        else if (groupNames.includes(cognito_constants_1.CUSTOMER_USER_GROUP) || groupNames.includes(cognito_constants_1.PERSON_USER_GROUP)) {
            const accountResponse = await accountService.findAccountByAccountId(salesforceId);
            const orders = await salesforceOrderService.findAllOrders(salesforceId);
            const trialOrder = await salesforceOrderService.findTrailOrder(salesforceId, [
                order_types_1.OrderStatus.PendingApproval,
                order_types_1.OrderStatus.OnHold,
            ]);
            const order = await salesforceOrderService.findSingleOrder(salesforceId);
            let physician;
            if (order && order.physician) {
                physician = await accountService.findPhysicianDetail(order.physician);
            }
            const addonOrders = await salesforceAddonService.findUserAddonOrders(salesforceId);
            const hasOrder = !!orders.length;
            return {
                ...salesforce_helpers_1.getCamelCasedObject(accountResponse),
                hasOrder,
                physician: physician ? physician.name : '',
                addons: addonOrders,
                trialOrderStatus: trialOrder ? trialOrder.status : '',
            };
        }
        const leadResponse = await leadService.findLeadById(salesforceId);
        return {
            ...leadResponse,
            leadId: leadResponse.id,
            hasOrder: false,
            trialOrderStatus: '',
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getCustomerInformation = getCustomerInformation;
const saveReassessment = async (accountId, reassessmentDTO) => {
    try {
        const recordTypeRecords = await accountService.getRecordType(assessment_constants_1.RECURRING_ASSESSMENT);
        const recordType = ramda_1.compose(ramda_1.head, salesforce_helpers_1.getRecords)(recordTypeRecords);
        const recordTypeId = recordType.Id;
        const reassessment = salesforce_helpers_1.reassessmentDTOtoSalesforceParams(reassessmentDTO);
        const accountResponse = await salesforceAssessmentService.saveReassessment(accountId, reassessment, recordTypeId);
        const imageUploadResponse = await salesforceDocumentService.linkMultipleDocuments({
            accountId,
            documentIds: reassessmentDTO.selfies,
        });
        return {
            ...accountResponse,
            selfies: imageUploadResponse,
        };
    }
    catch (error) {
        throw error;
    }
};
exports.saveReassessment = saveReassessment;
const getAssessment = async (accountId) => {
    try {
        const response = await salesforceAssessmentService.getAsessmentDetail(accountId);
        return { response };
    }
    catch (error) {
        throw error;
    }
};
exports.getAssessment = getAssessment;
const updateBillingAndShippingAddress = async (attributes) => {
    try {
        const accountData = await accountService.findByEmail(attributes.content.customer.email);
        const accountId = accountData.Id || '';
        const { customer, subscription = {} } = attributes.content;
        const response = await accountService.updateBillingAndShipping(accountId, {
            billingAddress: customer.billing_address || null,
            shippingAddress: subscription.shipping_address || null,
        });
        return response;
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.updateBillingAndShippingAddress = updateBillingAndShippingAddress;
const createCustomerCase = async ({ description, selfies, accountId, }) => {
    try {
        const caseResponse = await caseService.createCase({ description, accountId });
        let selfiesResponse = [];
        if (selfies?.length) {
            selfiesResponse = await salesforceDocumentService.linkMultipleDocuments({
                accountId,
                documentIds: selfies,
            });
        }
        return {
            caseResponse,
            selfiesResponse,
        };
    }
    catch (error) {
        throw error;
    }
};
exports.createCustomerCase = createCustomerCase;
const getOrderReviewDetails = async (accountId) => {
    const logger = container_1.default.resolve('logger');
    try {
        const order = await salesforceOrderService.findTrailOrder(accountId, [
            order_types_1.OrderStatus.PendingApproval,
            order_types_1.OrderStatus.OnHold,
        ]);
        const { skinConditions } = await userAccountService.getAccountDetails(accountId);
        if (!order?.id) {
            throw new Error_1.default('No pending approval or on hold order found.');
        }
        const orderItems = await salesforceOrderItemService.findOrderItemsByOrderId(order.id);
        const firstOrderItem = ramda_1.head(orderItems);
        logger.info(`Latest order successfully fetched for ${accountId}`);
        const orderReviewDetails = {
            productName: firstOrderItem?.fullName,
            ...ramda_1.compose(ramda_1.pick([
                'status',
                'id',
                'aTPWhatarewetreating',
                'aTPYourRX',
                'aTPLetsgetstarted',
                'aTPLifestylefactorstoconsider',
                'effectiveDate',
                'endDate',
                'aTPWhenToUseYourDocent',
                'aTPApplication',
                'aTPDosandDonts',
                'aTPGoodtoKnows',
                'aTPWhentouseyourDocentRich',
                'aTPYourWash',
                'aTPYourOralMedication',
                'aTPYourSpotTreatment',
            ]), salesforce_helpers_1.getCamelCasedObject)(order),
            goals: salesforce_helpers_1.getIndividualGoals(order),
        };
        const groupedOrderItems = {};
        const mappedOrderItems = [{}];
        orderItems.forEach(item => {
            const key = salesforce_helpers_1.camelize(item['productFamily']);
            if (!(key in groupedOrderItems)) {
                groupedOrderItems[key] = [];
            }
            groupedOrderItems[key].push(item);
        });
        for (const key in groupedOrderItems) {
            mappedOrderItems.push({
                startDate: orderReviewDetails.effectiveDate,
                endDate: orderReviewDetails.endDate,
                productFamily: key,
                products: groupedOrderItems[key],
            });
        }
        return {
            skinConditions,
            orderReviewDetails,
            orderItems: mappedOrderItems,
        };
    }
    catch (error) {
        logger.error(error);
        throw new Error(error.message);
    }
};
exports.getOrderReviewDetails = getOrderReviewDetails;
const declineOrder = async ({ orderId, description, accountId, }) => {
    const order = await salesforceOrderService.findOrderById(orderId);
    if (order && order.status === order_types_1.OrderStatus.PendingApproval) {
        await Promise.all([
            salesforceOrderService.updateOrder({ id: orderId, status: order_types_1.OrderStatus.OnHold }),
            salesforceCaseService.createCase({
                description,
                accountId,
            }),
        ]);
    }
    else {
        throw new NotFoundException_1.default(`Order with status ${order_types_1.OrderStatus.OnHold} with Id ${orderId} not found`);
    }
};
exports.declineOrder = declineOrder;
const approveOrder = async (orderId) => {
    try {
        const res = await salesforceOrderService.approveOrder(orderId);
        if (!res.success) {
            throw new Error_1.default(lang_1.default.orderUpdateFailed);
        }
        return {
            message: lang_1.default.approvedOrder,
        };
    }
    catch (error) {
        throw error;
    }
};
exports.approveOrder = approveOrder;
const update = async (user, details) => {
    const logger = container_1.default.resolve('logger');
    const chargebeeReferenceId = user.chargebeeReferenceId;
    const salesforceReferenceId = user.salesforceReferenceId;
    try {
        const userService = user_service_1.default();
        const existingUser = await userService.getCognitoUserInPoolByEmail(details.email);
        if (existingUser) {
            throw new AlreadyExistsException_1.default(cognito_constants_1.COGNITO_USER, 'User already exists');
        }
        const userDetails = details;
        const attributes = object_1.toSnakeCaseAttrNameValuePairs({
            ...userDetails,
            ...(details.email ? { emailVerified: true } : null),
        });
        await Promise.all([
            chargebeeService.update(chargebeeReferenceId, details),
            accountService.updateAccount({
                accountId: salesforceReferenceId,
                email: details.email,
            }),
        ]);
        const result = await userService.updateCognitoUserInPool(user.email, attributes);
        return result;
    }
    catch (error) {
        logger.error(`Error when updating email to ${details.email}, reverting back to ${user.email}`);
        await Promise.all([
            chargebeeService.update(chargebeeReferenceId, { email: user.email }),
            accountService.updateAccount({
                accountId: salesforceReferenceId,
                email: user.email,
            }),
        ]);
        throw error;
    }
};
exports.update = update;
const changePassword = async (details) => {
    try {
        const userService = user_service_1.default();
        return await userService.changePassword({
            accessToken: details.accessToken,
            previousPassword: details.oldPassword,
            proposedPassword: details.newPassword,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.changePassword = changePassword;
const getAllAddonOrder = async () => {
    try {
        const groupedData = {};
        const addonOrders = await addonService.findAddonOrders();
        const addonIds = addonOrders.map(({ id }) => id);
        // fetch images for products
        const images = await salesforceDocumentService.findAddonImages(addonIds);
        // map images to addon orders
        for (let index = 0; index < addonOrders.length; index++) {
            for (const image of images) {
                if (addonOrders[index]['id'] === image['firstPublishLocationId']) {
                    const { id, contentDocumentId, createdDate, srcUrl } = image;
                    addonOrders[index]['photos'] = { id, createdDate, srcUrl, contentDocumentId };
                }
            }
        }
        // group addon orders based on product family
        addonOrders.forEach(item => {
            if (!(item['productCategory'] in groupedData)) {
                groupedData[item['productCategory']] = [];
            }
            groupedData[item['productCategory']].push(item);
        });
        return groupedData;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllAddonOrder = getAllAddonOrder;
/**
 *
 * @param addonId[]: Addon Order Record Ids
 * @param customerId
 * @returns
 */
const deleteAddon = async (addonId, chargebeeId, salesforceId) => {
    const addonData = await addonService.findUserAddonOrders(salesforceId);
    if (!addonData) {
        throw new OperationException_1.default(['No Addon Order Found!'], common_constants_1.ADD_ON_ORDER, common_constants_1.READ_OPERATION);
    }
    const results = await Promise.allSettled([addonService.deleteAddOnOrders(addonId)]);
    const [deleteAddonResult] = results;
    if (deleteAddonResult.status === app_constants_1.PROMISE_FULFILLED) {
        const subData = await chargebeeSubscriptionService.retrieveSubscriptionForCustomer(chargebeeId);
        const [subscriptionUpdateResult] = await Promise.allSettled([
            chargebeeSubscriptionService.updateAddonOnSubscription(subData.subscription.id, {
                addons: [],
                end_of_term: true,
                replace_addon_list: true,
            }),
        ]);
        if (subscriptionUpdateResult.status == app_constants_1.PROMISE_REJECTED) {
            /**
             * Rolling back the operations.
             */
            await Promise.allSettled([addonService.createAddOnOrders(salesforceId, addonId)]);
            console.log(subscriptionUpdateResult);
            throw new OperationException_1.default([subscriptionUpdateResult.reason.message], common_constants_1.ADD_ON_ORDER, common_constants_1.UPDATE_OPERATION);
        }
        return {
            addonId,
        };
    }
    else {
        throw new OperationException_1.default([deleteAddonResult.reason.message], common_constants_1.ADD_ON_ORDER, common_constants_1.DELETE_OPERATION);
    }
};
exports.deleteAddon = deleteAddon;
/**
 *
 * @param addonIds: Product Configuration Ids
 * @param salesforceReferenceId
 * @param chargebeeReferenceId
 * @returns: addonIds
 */
const addAddon = async (addonIds, salesforceReferenceId, chargebeeReferenceId) => {
    const results = await Promise.allSettled([addonService.createAddOnOrders(salesforceReferenceId, addonIds)]);
    const [addOrderResult] = results;
    if (addOrderResult.status == app_constants_1.PROMISE_FULFILLED) {
        const subData = await chargebeeSubscriptionService.retrieveSubscriptionForCustomer(chargebeeReferenceId);
        console.log(subData);
        if (subData?.subscription?.hasScheduledChanges) {
            await chargebeeSubscriptionService.deleteScheduledChanges(subData.subscription.id);
        }
        const [chargebeeResult] = await Promise.allSettled([
            chargebeeSubscriptionService.incurChargeOnSubscription(chargebeeReferenceId, ''),
        ]);
        if (chargebeeResult.status == app_constants_1.PROMISE_REJECTED) {
            const ids = addOrderResult.value.map(({ id }) => id);
            await Promise.allSettled([addonService.deleteAddOnOrders(ids)]);
            throw new OperationException_1.default([chargebeeResult.reason.message], common_constants_1.ACCOUNT, common_constants_1.CREATE_OPERATION);
        }
        return {
            addOrderResult,
        };
    }
    else {
        throw new OperationException_1.default([addOrderResult.reason.message], common_constants_1.ACCOUNT, common_constants_1.CREATE_OPERATION);
    }
};
exports.addAddon = addAddon;
const updateName = async (email, referenceId, details) => {
    const userService = user_service_1.default();
    const attributes = object_1.toSnakeCaseAttrNameValuePairs({
        givenName: details.firstName,
        familyName: details.lastName,
    });
    const userDetails = await userService.getCognitoUserInPoolByEmail(email);
    if (!userDetails) {
        throw new NotFoundException_1.default('Cognito User not found');
    }
    const results = await Promise.allSettled([
        leadService.updateLead({
            id: referenceId,
            leadDetails: {
                ...details,
                status: lead_types_1.LeadStatus.Complete,
            },
        }),
        userService.updateCognitoUserInPool(email, attributes),
    ]);
    const hasFailed = !!results.filter(result => result.status === app_constants_1.PROMISE_REJECTED).length;
    if (hasFailed) {
        const previousName = {
            firstName: '',
            lastName: '',
        };
        userDetails.UserAttributes?.reduce((accumulator, { Name, Value }) => {
            if (Name === cognito_constants_1.COGNITO_USER_FIRST_NAME) {
                accumulator.firstName = Value || '';
            }
            else if (Name === cognito_constants_1.COGNITO_USER_LAST_NAME) {
                accumulator.lastName = Value || '';
            }
            return accumulator;
        }, previousName);
        const [updateLeadResult, updateCognitoUserInPoolResult] = results;
        const rollbacks = [];
        if (updateLeadResult.status === app_constants_1.PROMISE_FULFILLED) {
            rollbacks.push(leadService.updateLead({ id: referenceId, leadDetails: previousName }));
        }
        if (updateCognitoUserInPoolResult.status === app_constants_1.PROMISE_FULFILLED) {
            const previousAttributes = object_1.toSnakeCaseAttrNameValuePairs({
                givenName: details.firstName,
                familyName: details.lastName,
            });
            rollbacks.push(userService.updateCognitoUserInPool(email, previousAttributes));
        }
        await Promise.all(rollbacks);
        if (updateLeadResult.status === app_constants_1.PROMISE_REJECTED) {
            throw new OperationException_1.default([updateLeadResult.reason.message], common_constants_1.LEAD, common_constants_1.UPDATE_OPERATION);
        }
        if (updateCognitoUserInPoolResult.status === app_constants_1.PROMISE_REJECTED) {
            throw new OperationException_1.default([updateCognitoUserInPoolResult.reason.message], cognito_constants_1.COGNITO_USER, common_constants_1.UPDATE_OPERATION);
        }
    }
    return {
        id: referenceId,
        ...details,
    };
};
exports.updateName = updateName;
const addReview = async (accountId, review) => {
    const results = await Promise.allSettled([review_service_1.createReview(accountId, review)]);
    const [addReviewResult] = results;
    let pictureResponse = [];
    if (review.picture?.length && addReviewResult.value) {
        pictureResponse = await salesforceDocumentService.linkMultipleDocuments({
            accountId: addReviewResult.value.id,
            documentIds: review.picture,
        });
    }
    return {
        addReviewResult,
        pictureResponse,
    };
};
exports.addReview = addReview;
