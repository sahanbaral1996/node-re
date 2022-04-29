"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const config_1 = __importDefault(require("config"));
exports.default = () => {
    const client = new client_cognito_identity_provider_1.CognitoIdentityProvider({
        region: config_1.default.cognito.region,
        credentials: {
            accessKeyId: config_1.default.cognito.accessKeyId,
            secretAccessKey: config_1.default.cognito.secretAccessKey,
        },
    });
    return client;
};
