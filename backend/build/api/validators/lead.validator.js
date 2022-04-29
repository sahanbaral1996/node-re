"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLeadByAdminValidator = exports.updateLeadValidator = exports.createLeadValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createLeadValidator = joi_1.default.object({
    email: joi_1.default.string().min(6).email().required(),
    state: joi_1.default.string().optional(),
});
exports.updateLeadValidator = joi_1.default.object({
    dob: joi_1.default.string().required(),
    phone: joi_1.default.string().allow(''),
    state: joi_1.default.string().required(),
    newsletter: joi_1.default.boolean().required(),
    noppToa: joi_1.default.boolean().optional(),
}).concat(exports.createLeadValidator);
exports.createLeadByAdminValidator = joi_1.default.object({
    dob: joi_1.default.date().required(),
    newsletter: joi_1.default.boolean().required(),
    noppToa: joi_1.default.boolean().required(),
    state: joi_1.default.string().required(),
    firstName: joi_1.default.string().min(2).label('First Name').required(),
    lastName: joi_1.default.string().min(2).label('Last Name').required(),
}).concat(exports.createLeadValidator);
