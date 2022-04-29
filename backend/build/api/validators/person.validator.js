"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPersonByAdminValidator = exports.createPersonValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const assessment_validator_1 = require("./assessment.validator");
const subscription_validator_1 = require("./subscription.validator");
exports.createPersonValidator = assessment_validator_1.assessment.concat(assessment_validator_1.otcMedication);
exports.createPersonByAdminValidator = joi_1.default.object({
    leadId: joi_1.default.string().required(),
}).concat(subscription_validator_1.createSubscriptionValidator);
