"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const config_1 = __importDefault(require("config"));
exports.default = () => {
    const jwksClientInstance = jwks_rsa_1.default({
        strictSsl: true,
        jwksUri: `https://cognito-idp.${config_1.default.cognito.region}.amazonaws.com/${config_1.default.cognito.userPoolId}/.well-known/jwks.json`,
        requestHeaders: {},
        timeout: 30000,
    });
    return jwksClientInstance;
};
