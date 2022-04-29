"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cognitoUserServiceFactory = void 0;
const config_1 = __importDefault(require("config"));
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const generate_password_1 = require("generate-password");
const container_1 = __importDefault(require("container"));
const cognito_constants_1 = require("constants/cognito.constants");
const app_constants_1 = require("constants/app.constants");
function cognitoUserServiceFactory() {
    const cognitoClient = container_1.default.resolve(app_constants_1.COGNITO_TOKEN);
    const userPoolId = config_1.default.cognito.userPoolId;
    const clientId = config_1.default.cognito.userPoolClientId;
    const temporaryPassword = generate_password_1.generate({
        length: 16,
        numbers: true,
        uppercase: true,
        lowercase: true,
        symbols: true,
        strict: true,
    });
    const createCognitoUserInPool = async (cognitoUserDetails) => {
        const { email, accountReferenceId, firstName = '', lastName = '', haveMessageActionSuppressed = true, } = cognitoUserDetails;
        const adminCreateUserCommandInput = {
            UserPoolId: userPoolId,
            Username: email,
            ...(haveMessageActionSuppressed ? { MessageAction: 'SUPPRESS' } : null),
            TemporaryPassword: temporaryPassword,
            UserAttributes: [
                {
                    Name: cognito_constants_1.COGNITO_USER_LAST_NAME,
                    Value: lastName,
                },
                {
                    Name: cognito_constants_1.COGNITO_USER_FIRST_NAME,
                    Value: firstName,
                },
                {
                    Name: cognito_constants_1.CUSTOM_ACCOUNT_REFERENCE_ID,
                    Value: accountReferenceId,
                },
            ],
        };
        const adminCreateUserCommand = new client_cognito_identity_provider_1.AdminCreateUserCommand(adminCreateUserCommandInput);
        const response = await cognitoClient.send(adminCreateUserCommand);
        return {
            ...response,
            temporaryPassword,
        };
    };
    const assignCognitoUserToGroup = (cognitoAssignUserGroupDetails) => {
        const { email, groupName } = cognitoAssignUserGroupDetails;
        const adminAdduserToGroupCommandInput = {
            UserPoolId: userPoolId,
            GroupName: groupName,
            Username: email,
        };
        const adminAddUserToGroupCommand = new client_cognito_identity_provider_1.AdminAddUserToGroupCommand(adminAdduserToGroupCommandInput);
        return cognitoClient.send(adminAddUserToGroupCommand);
    };
    const loginCognitoUser = async (credentials) => {
        const { email, password, temporaryPassword } = credentials;
        const adminInitiateAuthCommandInput = {
            AuthFlow: client_cognito_identity_provider_1.AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
            ClientId: clientId,
            UserPoolId: userPoolId,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: temporaryPassword,
            },
        };
        const adminInitiateAuthCommand = new client_cognito_identity_provider_1.AdminInitiateAuthCommand(adminInitiateAuthCommandInput);
        const initialAuthResponse = await cognitoClient.send(adminInitiateAuthCommand);
        const adminRespondToAuthChallengeCommand = new client_cognito_identity_provider_1.AdminRespondToAuthChallengeCommand({
            ChallengeName: client_cognito_identity_provider_1.ChallengeNameType.NEW_PASSWORD_REQUIRED,
            ClientId: clientId,
            UserPoolId: userPoolId,
            ChallengeResponses: {
                USERNAME: email,
                NEW_PASSWORD: password,
            },
            Session: initialAuthResponse.Session,
        });
        const adminRespondToAuthChallengeResponse = await cognitoClient.send(adminRespondToAuthChallengeCommand);
        return {
            accessToken: adminRespondToAuthChallengeResponse.AuthenticationResult?.AccessToken,
            expiresIn: adminRespondToAuthChallengeResponse.AuthenticationResult?.ExpiresIn,
            idToken: adminRespondToAuthChallengeResponse.AuthenticationResult?.IdToken,
            refreshToken: adminRespondToAuthChallengeResponse.AuthenticationResult?.RefreshToken,
        };
    };
    const deleteCognitoUser = (username) => {
        const adminDeleteUserCommandInput = {
            UserPoolId: userPoolId,
            Username: username,
        };
        const adminDeleteUserCommand = new client_cognito_identity_provider_1.AdminDeleteUserCommand(adminDeleteUserCommandInput);
        return cognitoClient.send(adminDeleteUserCommand);
    };
    const verifyUserEmail = (email) => {
        const adminVerifyEmail = {
            UserPoolId: userPoolId,
            Username: email,
            UserAttributes: [
                {
                    Name: cognito_constants_1.CUSTOMER_EMAIL_VERIFIED_ATTRIBUTE,
                    Value: 'true',
                },
            ],
        };
        const adminVerifyEmailCommand = new client_cognito_identity_provider_1.AdminUpdateUserAttributesCommand(adminVerifyEmail);
        return cognitoClient.send(adminVerifyEmailCommand);
    };
    const updateCognitoUserInPool = (email, attributes) => {
        const input = {
            UserPoolId: userPoolId,
            Username: email,
            UserAttributes: attributes,
        };
        const command = new client_cognito_identity_provider_1.AdminUpdateUserAttributesCommand(input);
        return cognitoClient.send(command);
    };
    const changePassword = details => {
        const input = {
            AccessToken: details.accessToken,
            PreviousPassword: details.previousPassword,
            ProposedPassword: details.proposedPassword,
        };
        const command = new client_cognito_identity_provider_1.ChangePasswordCommand(input);
        return cognitoClient.send(command);
    };
    const getCognitoUserInPoolByEmail = async (email) => {
        try {
            const adminGetUserCommandInput = {
                Username: email,
                UserPoolId: userPoolId,
            };
            const command = new client_cognito_identity_provider_1.AdminGetUserCommand(adminGetUserCommandInput);
            return await cognitoClient.send(command);
        }
        catch (error) {
            if (error.name === 'UserNotFoundException') {
                return null;
            }
            else {
                throw error;
            }
        }
    };
    return {
        createCognitoUserInPool,
        assignCognitoUserToGroup,
        loginCognitoUser,
        deleteCognitoUser,
        verifyUserEmail,
        updateCognitoUserInPool,
        changePassword,
        getCognitoUserInPoolByEmail,
    };
}
exports.cognitoUserServiceFactory = cognitoUserServiceFactory;
exports.default = cognitoUserServiceFactory;
