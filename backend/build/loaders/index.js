"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("./express"));
const salesforce_1 = __importDefault(require("./salesforce"));
const chargebee_1 = __importDefault(require("./chargebee"));
const cognito_1 = __importDefault(require("./cognito"));
const dependencyInjectors_1 = __importDefault(require("./dependencyInjectors"));
const logger_1 = __importDefault(require("./logger"));
const jwks_1 = __importDefault(require("./jwks"));
const events_1 = __importDefault(require("./events"));
exports.default = async ({ expressApp }) => {
    const salesforceConnection = await salesforce_1.default();
    logger_1.default.info('✌️  Salesforce connection loaded');
    const cognitoClient = cognito_1.default();
    logger_1.default.info('✌️  Cognito client loaded');
    const jwksClientInstance = jwks_1.default();
    logger_1.default.info('✌️  JWKS client loaded');
    const chargeBeeConnection = await chargebee_1.default();
    logger_1.default.info('✌️  Chargebee client loaded');
    const customEventEmitter = events_1.default();
    logger_1.default.info('✌️  Custom Event Emitter loaded');
    dependencyInjectors_1.default({
        salesforceConnection,
        cognitoClient,
        chargeBeeConnection,
        jwksClientInstance,
        customEventEmitter,
    });
    logger_1.default.info('✌️  Dependency Injector loaded');
    await express_1.default({ app: expressApp });
    logger_1.default.info('✌️  Express loaded');
};
