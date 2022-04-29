"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webToCaseValidator = exports.caseValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.caseValidator = joi_1.default.object({
    description: joi_1.default.string().required(),
});
exports.webToCaseValidator = joi_1.default.object({
    description: joi_1.default.string().required(),
    selfies: joi_1.default.array().items(joi_1.default.string()).optional(),
});
