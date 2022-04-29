"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeName = exports.customerValidation = exports.changeEmail = exports.changePassword = exports.createCustomer = exports.eligibilityAndAcceptance = exports.selfiesQuery = exports.userValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const common_validator_1 = require("./common.validator");
exports.userValidator = joi_1.default.object({
    email: joi_1.default.string().min(2).label('Email').required().email(),
    dob: joi_1.default.string().label('Date of birth').required(),
});
exports.selfiesQuery = common_validator_1.dateRangeValidator;
exports.eligibilityAndAcceptance = joi_1.default.object({
    dob: joi_1.default.date().required(),
    newsletter: joi_1.default.boolean().required(),
    noppToa: joi_1.default.boolean().required(),
    state: joi_1.default.string().required(),
});
exports.createCustomer = joi_1.default.object({
    password: joi_1.default.string()
        .pattern(/^(?=.*[a-z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-“!@#%&\/,><\’:;|_~`])\S{8,99}$/)
        .message('Password must contain at least 8 characters, a number, a special character and at least one lowercase letter')
        .required(),
    email: joi_1.default.string().email().min(6).label('Email').required(),
}).concat(exports.eligibilityAndAcceptance);
exports.changePassword = joi_1.default.object({
    oldPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string()
        .pattern(/^(?=.*[a-z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-“!@#%&\/,><\’:;|_~`])\S{8,99}$/)
        .message('Password must contain at least 8 characters, a number, a special character and at least one lowercase letter')
        .required(),
});
exports.changeEmail = joi_1.default.object({
    email: joi_1.default.string().min(6).label('Email').required().email(),
});
exports.customerValidation = joi_1.default.object({
    email: joi_1.default.string().email().optional(),
    dob: joi_1.default.string().optional(),
});
exports.changeName = joi_1.default.object({
    firstName: joi_1.default.string().min(2).label('First Name').required(),
    lastName: joi_1.default.string().min(2).label('Last Name').required(),
});
