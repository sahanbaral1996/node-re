"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsforce_1 = require("jsforce");
const config_1 = __importDefault(require("config"));
exports.default = async () => {
    try {
        const salesforceConection = new jsforce_1.Connection({
            oauth2: {
                loginUrl: config_1.default.salesforce.loginUrl,
                clientId: config_1.default.salesforce.clientId,
                clientSecret: config_1.default.salesforce.clientSecret,
            },
        });
        await salesforceConection.login(config_1.default.salesforce.username, config_1.default.salesforce.password);
        return salesforceConection;
    }
    catch (error) {
        throw new Error(error);
    }
};
