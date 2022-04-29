"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCustomerEvents = void 0;
const events_1 = require("./events");
const user_service_1 = require("services/cognito/user.service");
const cognito_constants_1 = require("constants/cognito.constants");
const object_1 = require("utils/object");
const logger_1 = require("loaders/logger");
function initializeCustomerEvents({ eventEmitter }) {
    eventEmitter.on(events_1.customerEvents.getCustomerInformation, async ({ user }) => {
        try {
            const userService = user_service_1.cognitoUserServiceFactory();
            const existingUser = await userService.getCognitoUserInPoolByEmail(user.email);
            if (existingUser && existingUser.UserAttributes) {
                const existingUserAttributes = object_1.toCamelCaseObjectFromNameValuePairs(existingUser.UserAttributes);
                if (!existingUserAttributes[cognito_constants_1.CUSTOM_ACCOUNT_REFERENCE_ID] &&
                    !existingUserAttributes[cognito_constants_1.CUSTOM_CUSTOMER_REFERENCE_ID]) {
                    const attributes = [
                        {
                            Name: cognito_constants_1.CUSTOM_ACCOUNT_REFERENCE_ID,
                            Value: user.salesforceReferenceId,
                        },
                        {
                            Name: cognito_constants_1.CUSTOM_CUSTOMER_REFERENCE_ID,
                            Value: user.chargebeeReferenceId,
                        },
                    ];
                    userService.updateCognitoUserInPool(user.email, attributes);
                }
            }
        }
        catch (error) {
            logger_1.sentryCaptureExceptions(error);
        }
    });
}
exports.initializeCustomerEvents = initializeCustomerEvents;
