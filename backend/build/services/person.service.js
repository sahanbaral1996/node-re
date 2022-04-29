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
exports.createPersonByAdmin = exports.createPerson = void 0;
const ramda_1 = require("ramda");
const user_service_1 = __importDefault(require("services/cognito/user.service"));
const leadService = __importStar(require("services/salesforce/lead.service"));
const assessmentService = __importStar(require("./salesforce/assessment.service"));
const accountService = __importStar(require("services/salesforce/account.service"));
const recordTypeService = __importStar(require("services/salesforce/recordType.service"));
const salesforceAssessmentService = __importStar(require("./salesforce/assessment.service"));
const subscriptionService = __importStar(require("services/subscription.service"));
const contact_types_1 = require("types/salesforce/contact.types");
const customer_constants_1 = require("constants/customer.constants");
const cognito_constants_1 = require("constants/cognito.constants");
const common_constants_1 = require("constants/salesforce/common.constants");
const app_constants_1 = require("constants/app.constants");
const OperationException_1 = __importDefault(require("api/exceptions/OperationException"));
const salesforce_helpers_1 = require("../helpers/salesforce.helpers");
const AlreadyExistsException_1 = __importDefault(require("api/exceptions/AlreadyExistsException"));
const checkDuplicateEmail = async (email) => {
    try {
        const accountRecordResponse = await accountService.findRecordIdByEmail(email);
        if (accountRecordResponse.totalSize > 0) {
            throw new Error(`Person account for ${email} is already created`);
        }
    }
    catch (error) {
        throw error;
    }
};
const createPerson = async (userDetails) => {
    try {
        const { email, leadId, assessment } = userDetails;
        const userService = user_service_1.default();
        await checkDuplicateEmail(email);
        const lead = await leadService.findLeadById(leadId);
        const { firstName, lastName, iagreetoNoPPandTOA: noppToa, iagreetoreceivefrequentmarketing: newsletter, dOB: dob, phone, homeState: state, } = ramda_1.compose(salesforce_helpers_1.getCamelCasedObject)(lead);
        const { Id: recordTypeId } = await recordTypeService.findRecordTypeFromDeveloperName(customer_constants_1.CUSTOMER_RECORD_DEVELOPER_NAME);
        const accountId = await accountService.createAccount({
            firstName,
            lastName,
            email,
            phone,
            recordTypeId: recordTypeId || '',
            leadId,
            status: contact_types_1.ContactStatus.Assessment,
            noppToa,
            newsletter,
            state,
        });
        let assessmentId;
        try {
            assessmentId = await assessmentService.createAssessment({
                email,
                dob,
                accountId,
                ...assessment,
            });
        }
        catch (error) {
            await accountService.deleteAccount(accountId);
            throw new Error(error.message);
        }
        const attributes = [
            {
                Name: cognito_constants_1.CUSTOM_ACCOUNT_REFERENCE_ID,
                Value: accountId,
            },
        ];
        const results = await Promise.allSettled([
            userService.assignCognitoUserToGroup({
                email,
                groupName: cognito_constants_1.PERSON_USER_GROUP,
            }),
            userService.updateCognitoUserInPool(email, attributes),
        ]);
        const rollbacks = [];
        const hasRejected = !!results.filter(result => result.status === app_constants_1.PROMISE_REJECTED).length;
        if (hasRejected) {
            const [assignCognitoUserToGroup, updateCognitoUserInPool] = results;
            if (assignCognitoUserToGroup.status === app_constants_1.PROMISE_FULFILLED) {
                const previousValues = {
                    email,
                    groupName: cognito_constants_1.LEAD_USER_GROUP,
                };
                rollbacks.push(userService.assignCognitoUserToGroup(previousValues));
            }
            if (updateCognitoUserInPool.status === app_constants_1.PROMISE_FULFILLED) {
                const prevAttributes = [
                    {
                        Name: cognito_constants_1.CUSTOM_ACCOUNT_REFERENCE_ID,
                        Value: leadId,
                    },
                ];
                rollbacks.push(userService.updateCognitoUserInPool(email, prevAttributes));
            }
            rollbacks.push(...[salesforceAssessmentService.deleteAssessment(assessmentId), accountService.deleteAccount(accountId)]);
            await Promise.all(rollbacks);
            if (assignCognitoUserToGroup.status === app_constants_1.PROMISE_REJECTED) {
                throw new OperationException_1.default([assignCognitoUserToGroup.reason.message], cognito_constants_1.COGNITO_USER, common_constants_1.UPDATE_OPERATION);
            }
            if (updateCognitoUserInPool.status === app_constants_1.PROMISE_REJECTED) {
                throw new OperationException_1.default([updateCognitoUserInPool.reason.message], cognito_constants_1.COGNITO_USER, common_constants_1.UPDATE_OPERATION);
            }
        }
        return {
            accountId,
            assessmentId,
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.createPerson = createPerson;
const createPersonByAdmin = async (details) => {
    const { leadId, ...rest } = details;
    const userService = user_service_1.default();
    const { email, firstName, lastName, dOB, id: existingLeadId, ...leadDetails } = await leadService.findLeadById(leadId);
    const existingCognitoUser = await userService.getCognitoUserInPoolByEmail(email);
    if (existingCognitoUser) {
        throw new AlreadyExistsException_1.default(cognito_constants_1.COGNITO_USER, 'User already exists');
    }
    let accountId;
    let cognitoUser;
    try {
        const { Id: recordTypeId } = await recordTypeService.findRecordTypeFromDeveloperName(customer_constants_1.CUSTOMER_RECORD_DEVELOPER_NAME);
        const createdAccountId = await accountService.createAccount({
            firstName: firstName,
            lastName: lastName,
            email,
            dob: dOB,
            phone: '',
            recordTypeId: recordTypeId || '',
            leadId: existingLeadId,
            noppToa: leadDetails.iagreetoNoPPandTOA,
            newsletter: leadDetails.iagreetoreceivefrequentmarketing,
            state: rest.billingAddress.state,
            isInPersonSignUp: true,
        });
        accountId = createdAccountId;
        cognitoUser = await userService.createCognitoUserInPool({
            email,
            firstName: firstName,
            lastName: lastName,
            accountReferenceId: createdAccountId,
            haveMessageActionSuppressed: false,
        });
        const results = await Promise.allSettled([
            userService.assignCognitoUserToGroup({
                email,
                groupName: cognito_constants_1.PERSON_USER_GROUP,
            }),
            userService.assignCognitoUserToGroup({
                email,
                groupName: cognito_constants_1.LEAD_USER_GROUP,
            }),
            userService.verifyUserEmail(email),
        ]);
        const hasFailed = !!results.filter(result => result.status === app_constants_1.PROMISE_REJECTED).length;
        if (hasFailed) {
            const [assignCognitoUserToPersonGroupResult, assignCognitoUserToLeadGroupResult, verifyUserEmailResult] = results;
            if (assignCognitoUserToPersonGroupResult.status === app_constants_1.PROMISE_REJECTED) {
                throw assignCognitoUserToPersonGroupResult.reason;
            }
            if (assignCognitoUserToLeadGroupResult.status === app_constants_1.PROMISE_REJECTED) {
                throw assignCognitoUserToLeadGroupResult.reason;
            }
            if (verifyUserEmailResult.status === app_constants_1.PROMISE_REJECTED) {
                throw verifyUserEmailResult.reason;
            }
        }
        await subscriptionService.setupSubscription(rest, createdAccountId, '');
        await accountService.updateAccount({ accountId, status: contact_types_1.ContactStatus.InPersonDone });
        return {
            accountId,
        };
    }
    catch (error) {
        const rollbacks = [];
        if (cognitoUser) {
            rollbacks.push(userService.deleteCognitoUser(email));
        }
        if (accountId) {
            rollbacks.push(accountService.deleteAccount(accountId));
        }
        await Promise.all(rollbacks);
        throw error;
    }
};
exports.createPersonByAdmin = createPersonByAdmin;
