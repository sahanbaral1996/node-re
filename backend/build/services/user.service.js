"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserByAdmin = void 0;
const AlreadyExistsException_1 = __importDefault(require("api/exceptions/AlreadyExistsException"));
const OperationException_1 = __importDefault(require("api/exceptions/OperationException"));
const app_constants_1 = require("constants/app.constants");
const cognito_constants_1 = require("constants/cognito.constants");
const common_constants_1 = require("constants/salesforce/common.constants");
const user_service_1 = __importDefault(require("services/cognito/user.service"));
const createUserByAdmin = async (details) => {
    const { email, firstName, lastName } = details;
    try {
        const userService = user_service_1.default();
        const existingUser = await userService.getCognitoUserInPoolByEmail(email);
        if (existingUser) {
            throw new AlreadyExistsException_1.default(cognito_constants_1.COGNITO_USER, 'User already exists');
        }
        const user = await userService.createCognitoUserInPool({
            email,
            accountReferenceId: '',
            firstName,
            lastName,
            haveMessageActionSuppressed: false,
        });
        const results = await Promise.allSettled([
            userService.assignCognitoUserToGroup({ email, groupName: cognito_constants_1.ADMIN_USER_GROUP }),
            userService.verifyUserEmail(email),
        ]);
        const hasFailed = !!results.filter(result => result.status === app_constants_1.PROMISE_REJECTED).length;
        if (hasFailed) {
            await userService.deleteCognitoUser(email);
            const [assignCognitoUserToGroupResult, verifyUserEmailResult] = results;
            if (assignCognitoUserToGroupResult.status === app_constants_1.PROMISE_REJECTED) {
                throw new OperationException_1.default(assignCognitoUserToGroupResult.reason, cognito_constants_1.COGNITO_USER, common_constants_1.UPDATE_OPERATION);
            }
            if (verifyUserEmailResult.status === app_constants_1.PROMISE_REJECTED) {
                throw new OperationException_1.default(verifyUserEmailResult.reason, cognito_constants_1.COGNITO_USER, common_constants_1.UPDATE_OPERATION);
            }
        }
        return user;
    }
    catch (error) {
        throw error;
    }
};
exports.createUserByAdmin = createUserByAdmin;
