"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const container_1 = __importDefault(require("container"));
const authentication_constants_1 = require("constants/authentication.constants");
const Error_1 = __importDefault(require("api/exceptions/Error"));
const http_status_codes_1 = require("http-status-codes");
const lang_1 = __importDefault(require("lang"));
const cognito_constants_1 = require("constants/cognito.constants");
const validateToken = async (req, res, next) => {
    try {
        const jwksClient = container_1.default.resolve('jwksClient');
        function getKey(header, callback) {
            jwksClient.getSigningKey(header.kid, function (err, key) {
                const signingKey = key;
                const signingPublicKey = signingKey.rsaPublicKey;
                callback(null, signingPublicKey);
            });
        }
        const authorization = req.header(authentication_constants_1.AUTHORIZATION_HEADER);
        const idTokenHeader = req.header(authentication_constants_1.ID_TOKEN_HEADER);
        if (!!authorization && !!idTokenHeader) {
            const [, accessToken] = authorization.split('Bearer ');
            const [, idToken] = idTokenHeader.split('ID ');
            await new Promise((resolve, reject) => {
                jsonwebtoken_1.default.verify(accessToken, getKey, function (err, decodedAccessToken) {
                    if (!err) {
                        resolve(decodedAccessToken);
                    }
                    else {
                        reject(err);
                    }
                });
            });
            const decodedIdToken = await new Promise((resolve, reject) => {
                jsonwebtoken_1.default.verify(idToken, getKey, function (err, decodedIdToken) {
                    if (!err) {
                        resolve(decodedIdToken);
                    }
                    else {
                        reject(err);
                    }
                });
            });
            const salesforceReferenceId = decodedIdToken[cognito_constants_1.CUSTOM_ACCOUNT_REFERENCE_ID]
                ? decodedIdToken[cognito_constants_1.CUSTOM_ACCOUNT_REFERENCE_ID]
                : decodedIdToken[cognito_constants_1.CUSTOM_SALESFORCE_ID_ATTRIBUTE];
            const chargebeeReferenceId = decodedIdToken[cognito_constants_1.CUSTOM_CUSTOMER_REFERENCE_ID]
                ? decodedIdToken[cognito_constants_1.CUSTOM_CUSTOMER_REFERENCE_ID]
                : decodedIdToken[cognito_constants_1.CUSTOM_CHARGEBEE_ID_ATTRIBUTE];
            req.currentUser = {
                id: decodedIdToken[cognito_constants_1.CUSTOMER_COGNITO_USER_NAME],
                email: decodedIdToken.email,
                salesforceReferenceId,
                chargebeeReferenceId,
                groups: decodedIdToken[cognito_constants_1.CUSTOMER_COGNITO_GROUP],
                shouldMigrate: !!decodedIdToken[cognito_constants_1.CUSTOM_SALESFORCE_ID_ATTRIBUTE] && !decodedIdToken[cognito_constants_1.CUSTOM_ACCOUNT_REFERENCE_ID],
            };
            return next();
        }
        throw new Error('Custom Headers are undefined');
    }
    catch (error) {
        next(new Error_1.default(lang_1.default.tokenExpired, http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
};
exports.default = validateToken;
