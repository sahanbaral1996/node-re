"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthIssue = void 0;
const lang_1 = __importDefault(require("lang"));
const account_service_1 = require("services/salesforce/account.service");
const getAuthIssue = async (email) => {
    const account = await account_service_1.findByEmail(email);
    if (account && account.Id) {
        return lang_1.default.invalidEmailPassword;
    }
    return lang_1.default.newLead;
};
exports.getAuthIssue = getAuthIssue;
