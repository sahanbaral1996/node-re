"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const awilix_1 = require("awilix");
const container_1 = __importDefault(require("container"));
const logger_1 = __importDefault(require("./logger"));
exports.default = async ({ salesforceConnection, cognitoClient, jwksClientInstance, chargeBeeConnection, customEventEmitter, }) => {
    container_1.default.register({
        salesforceConnection: awilix_1.asValue(salesforceConnection),
    });
    container_1.default.register({
        cognitoClient: awilix_1.asValue(cognitoClient),
    });
    container_1.default.register({
        logger: awilix_1.asValue(logger_1.default),
    });
    container_1.default.register({
        chargebee: awilix_1.asValue(chargeBeeConnection),
    });
    container_1.default.register({
        jwksClient: awilix_1.asValue(jwksClientInstance),
    });
    container_1.default.register({
        customEventEmitter: awilix_1.asValue(customEventEmitter),
    });
};
