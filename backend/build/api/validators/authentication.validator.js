"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationIssueValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.authenticationIssueValidator = joi_1.default.object({
    email: joi_1.default.string().optional().email(),
});
