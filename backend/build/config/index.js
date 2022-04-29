"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFound = dotenv_1.default.config();
if (envFound.error) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
exports.default = {
    /**
     * Server PORT
     */
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    cors: {
        apiAccessibleDomain: process.env.API_ACCESSABLE_DOMAIN || '*',
    },
    salesforce: {
        loginUrl: process.env.SALESFORCE_LOGIN_URL || '',
        clientId: process.env.SALESFORCE_CLIENT_ID || '',
        clientSecret: process.env.SALESFORCE_CLIENT_SECRET || '',
        username: process.env.SALESFORCE_USERNAME || '',
        password: process.env.SALESFORCE_PASSWORD || '',
        webtocaseQuequeId: process.env.SALESFORCE_WEB_TO_CASE_QUEQUE_ID,
    },
    api: {
        prefix: '/api',
    },
    webhook: {
        prefix: '/webhook',
    },
    zapier: {
        endPoint: process.env.ZAPIER_END_POINT || '',
    },
    /**
     * Used by winston logger
     */
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },
    /**
     * Used by AWS Cognito
     */
    cognito: {
        accessKeyId: process.env.AWS_COGNITO_ACCESS_KEY || '',
        secretAccessKey: process.env.AWS_COGNITO_SECRET_ACCESS_KEY || '',
        region: process.env.AWS_COGNITO_USER_POOL_REGION || '',
        userPoolId: process.env.AWS_COGNITO_USER_POOL_ID || '',
        staticPassword: process.env.AWS_COGNITO_STATIC_USER_PASSWORD || '',
        userPoolClientId: process.env.AWS_COGNITO_USER_POOL_CLIENT_ID || '',
    },
    chargebee: {
        site: process.env.CHARGEBEE_SITE || '',
        apiKey: process.env.CHARGEBEE_API_KEY || '',
        addonId: process.env.CHARGEBEE_ADDON_ID || '',
        subscriptionPlanId: process.env.CHARGEBEE_SUBSCRIPTION_PLAN_ID || '',
    },
    sentry: {
        dsn: process.env.SENTRY_DSN,
    },
    facebook: {
        pixel_id: process.env.FACEBOOK_PIXEL_ID || '',
        access_token: process.env.FACEBOOK_PIXEL_ACCESS_TOKEN || '',
    },
};
