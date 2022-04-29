"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserValidator = joi_1.default.object({
    email: joi_1.default.string().min(2).label('Email').required().email(),
    firstName: joi_1.default.string().min(2).label('First Name').required(),
    lastName: joi_1.default.string().min(2).label('Last Name').required(),
});
