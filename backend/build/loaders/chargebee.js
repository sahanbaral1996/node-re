"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chargebee_typescript_1 = require("chargebee-typescript");
const config_1 = __importDefault(require("config"));
exports.default = async () => {
    try {
        const chargebee = new chargebee_typescript_1.ChargeBee();
        chargebee.configure({ site: config_1.default.chargebee.site, api_key: config_1.default.chargebee.apiKey });
        return chargebee;
    }
    catch (error) {
        throw new Error(error);
    }
};
