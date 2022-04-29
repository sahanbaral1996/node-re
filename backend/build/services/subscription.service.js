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
exports.updateSubscriptionPrice = exports.addAddonChargeOnSubscription = exports.reactivateSubscription = exports.retreiveSubscription = exports.estimateSubscription = exports.setupSubscription = void 0;
const common_constants_1 = require("constants/salesforce/common.constants");
const app_constants_1 = require("constants/app.constants");
const cognito_constants_1 = require("constants/cognito.constants");
const ramda_1 = require("ramda");
const app_constants_2 = require("constants/app.constants");
const container_1 = __importDefault(require("container"));
const user_service_1 = __importDefault(require("./cognito/user.service"));
const salesforceService = __importStar(require("services/salesforce/account.service"));
const chargebeeSubscriptionService = __importStar(require("./chargebee/subscription.service"));
const chargebeeCustomerService = __importStar(require("./chargebee/customer.service"));
const chargbeeEstimateService = __importStar(require("./chargebee/estimate.service"));
const salesforceAddOnOrderService = __importStar(require("./salesforce/addOnOrder.service"));
const OperationException_1 = __importDefault(require("api/exceptions/OperationException"));
const subscription_helper_1 = require("helpers/subscription.helper");
const AlreadyExistsException_1 = __importDefault(require("api/exceptions/AlreadyExistsException"));
const chargebee_constants_1 = require("constants/chargebee.constants");
const contact_types_1 = require("types/salesforce/contact.types");
const ConstraintViolationException_1 = __importDefault(require("api/exceptions/ConstraintViolationException"));
const estimate_types_1 = require("types/chargebee/estimate.types");
const config_1 = __importDefault(require("config"));
async function setupSubscription(details, accountId, customerId) {
    const accountDetail = await salesforceService.findAccountByAccountId(accountId);
    let existingCustomerId = customerId;
    if (!existingCustomerId) {
        const existingCustomer = await chargebeeCustomerService.retrieveCustomerByEmail(accountDetail.email);
        if (existingCustomer) {
            existingCustomerId = existingCustomer.customer.id;
        }
    }
    if (existingCustomerId) {
        const subscription = await chargebeeSubscriptionService.retrieveSubscriptionForCustomer(existingCustomerId);
        if (subscription) {
            throw new AlreadyExistsException_1.default(chargebee_constants_1.CHARGBEE_CUSTOMER, 'Customer Already Exists');
        }
        else {
            await chargebeeCustomerService.deleteCustomer(existingCustomerId);
        }
    }
    const { addOnConfigurationIds = [], activeAddOnIds = [] } = details;
    if (addOnConfigurationIds.length !== activeAddOnIds.length) {
        throw new ConstraintViolationException_1.default(chargebee_constants_1.CHARGEBEE_SUBSCRIPTION, 'Product Configurations and Addons should be equal');
    }
    const subscriptionResponse = await chargebeeSubscriptionService.createSubscription(details, accountDetail);
    const subscription = subscriptionResponse.subscription;
    const customer = subscriptionResponse.customer;
    const email = accountDetail.email;
    try {
        const userService = user_service_1.default();
        const results = await Promise.allSettled([
            userService.assignCognitoUserToGroup({
                email,
                groupName: cognito_constants_1.CUSTOMER_USER_GROUP,
            }),
            userService.updateCognitoUserInPool(email, [
                {
                    Name: cognito_constants_1.CUSTOM_CUSTOMER_REFERENCE_ID,
                    Value: customer.id,
                },
            ]),
            salesforceService.updateAccount({
                accountId,
                chargebeeCustomerId: subscriptionResponse.customer.id,
                phone: subscriptionResponse.customer.phone,
                isSameAsShippingAddress: details.isSameAsShippingAddress,
                status: contact_types_1.ContactStatus.BillingInformation,
            }),
            salesforceAddOnOrderService.createAddOnOrders(accountId, addOnConfigurationIds),
        ]);
        const hasError = !!results.filter(result => result.status === app_constants_1.PROMISE_REJECTED).length;
        if (hasError) {
            const [assignCognitoUserToGroupResult, updateCognitoUserInPoolResult, updateAccountResult, createAddOnOrdersResult,] = results;
            const rollbacks = [];
            if (assignCognitoUserToGroupResult.status === app_constants_1.PROMISE_FULFILLED) {
                rollbacks.push(userService.assignCognitoUserToGroup({ email, groupName: cognito_constants_1.PERSON_USER_GROUP }));
            }
            if (updateCognitoUserInPoolResult.status === app_constants_1.PROMISE_FULFILLED) {
                rollbacks.push(userService.updateCognitoUserInPool(email, [
                    {
                        Name: cognito_constants_1.CUSTOM_CUSTOMER_REFERENCE_ID,
                        Value: customer.id,
                    },
                ]));
            }
            if (updateAccountResult.status === app_constants_1.PROMISE_FULFILLED) {
                rollbacks.push(salesforceService.updateAccount({ accountId, chargebeeCustomerId: '', phone: '' }));
            }
            if (createAddOnOrdersResult.status === app_constants_1.PROMISE_FULFILLED) {
                const recordIds = createAddOnOrdersResult.value.map(({ id }) => id);
                rollbacks.push(salesforceAddOnOrderService.deleteAddOnOrders(recordIds));
            }
            await Promise.all(rollbacks);
            if (assignCognitoUserToGroupResult.status === app_constants_1.PROMISE_REJECTED) {
                throw new OperationException_1.default([assignCognitoUserToGroupResult.reason.message], cognito_constants_1.COGNITO_USER, common_constants_1.UPDATE_OPERATION);
            }
            if (updateCognitoUserInPoolResult.status === app_constants_1.PROMISE_REJECTED) {
                throw new OperationException_1.default([updateCognitoUserInPoolResult.reason.message], cognito_constants_1.COGNITO_USER, common_constants_1.UPDATE_OPERATION);
            }
            if (updateAccountResult.status === app_constants_1.PROMISE_REJECTED) {
                throw updateAccountResult.reason;
            }
        }
    }
    catch (error) {
        await Promise.all([
            chargebeeSubscriptionService.deleteSubscription(subscription.id),
            chargebeeCustomerService.deleteCustomer(customer.id),
        ]);
        throw error;
    }
}
exports.setupSubscription = setupSubscription;
async function estimateSubscription(details) {
    const [addOnEstimate, recurringEstimate] = await Promise.all([
        chargbeeEstimateService.estimate(details),
        chargbeeEstimateService.estimate({ ...details, isAddonExcluded: true }),
    ]);
    const { invoiceEstimate } = addOnEstimate.estimate;
    const { nextInvoiceEstimate } = recurringEstimate.estimate;
    const estimates = {
        invoiceEstimate: invoiceEstimate ? subscription_helper_1.formatEstimate(invoiceEstimate) : undefined,
        nextInvoiceEstimate: nextInvoiceEstimate ? subscription_helper_1.formatEstimate(nextInvoiceEstimate) : undefined,
    };
    if (estimates.invoiceEstimate) {
        estimates.invoiceEstimate.lineItems = subscription_helper_1.filterLineItemsByEntityId(estimates.invoiceEstimate.lineItems, config_1.default.chargebee.addonId);
    }
    if (estimates.nextInvoiceEstimate) {
        estimates.nextInvoiceEstimate.lineItems = subscription_helper_1.filterLineItemsByEntityType(estimates.nextInvoiceEstimate.lineItems, estimate_types_1.LineItemEntityTypes.Plan);
    }
    return estimates;
}
exports.estimateSubscription = estimateSubscription;
function retreiveSubscription(customerId) {
    return chargebeeSubscriptionService.retrieveSubscriptionForCustomer(customerId);
}
exports.retreiveSubscription = retreiveSubscription;
async function reactivateSubscription(chargebeeCustomerId) {
    const chargebee = container_1.default.resolve(app_constants_2.CHARGEBEE_TOKEN);
    const account = await salesforceService.findAccountIdByChargeBeeId(chargebeeCustomerId);
    const accountHead = ramda_1.head(account.records);
    if (!accountHead) {
        return {};
    }
    const subList = await new Promise((resolve, reject) => {
        chargebee.subscription.list({ customer_id: { is: chargebeeCustomerId } }).request((err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
    const subHead = ramda_1.head(subList.list);
    if (!subHead) {
        return {};
    }
    const subscriptionId = subHead.subscription.id;
    const responseSubs = await new Promise((resolve, reject) => {
        chargebee.subscription.reactivate(subscriptionId).request((err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
    return { responseSubs };
}
exports.reactivateSubscription = reactivateSubscription;
const addAddonChargeOnSubscription = async (email, orderType) => {
    const existingCustomer = await chargebeeCustomerService.retrieveCustomerByEmail(email);
    if (existingCustomer) {
        const result = chargebeeSubscriptionService.incurChargeOnSubscription(existingCustomer.customer.id, orderType);
        return result;
    }
    else {
        return {};
    }
};
exports.addAddonChargeOnSubscription = addAddonChargeOnSubscription;
async function updateSubscriptionPrice(price) {
    let offset = '';
    const allSubscriptions = [];
    do {
        const { subscriptions, nextOffset } = await chargebeeSubscriptionService.listSubscription(offset);
        allSubscriptions.push(...subscriptions);
        offset = nextOffset;
    } while (!!offset);
    const subscriptionsToUpdate = allSubscriptions.map(({ subscription }) => chargebeeSubscriptionService.updateSubscription(subscription.id, { price }));
    const results = await Promise.allSettled(subscriptionsToUpdate);
    const failedResults = results.filter(result => result.status === app_constants_1.PROMISE_REJECTED);
    const hasFailed = !!failedResults.length;
    if (hasFailed) {
        const errors = failedResults.map(failedResult => failedResult.reason.message);
        throw new OperationException_1.default(errors, chargebee_constants_1.CHARGEBEE_SUBSCRIPTION, common_constants_1.UPDATE_OPERATION);
    }
    return {
        results: results,
        count: allSubscriptions.length,
    };
}
exports.updateSubscriptionPrice = updateSubscriptionPrice;
