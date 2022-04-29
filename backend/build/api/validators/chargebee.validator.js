"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostedPageValidator = exports.customerValidator = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * customer validator
 */
exports.customerValidator = joi_1.default.object({
    firstName: joi_1.default.string().min(2).label('First Name').required(),
    lastName: joi_1.default.string().min(2).label('Last Name').required(),
    email: joi_1.default.string().min(6).label('Email').required().email(),
    phone: joi_1.default.string().allow(''),
});
/**
 * hosted page validator
 */
exports.hostedPageValidator = joi_1.default.object({
    planId: joi_1.default.string().min(2).label('Plan').required(),
    customerId: joi_1.default.string().min(2).label('Customer').required(),
});
