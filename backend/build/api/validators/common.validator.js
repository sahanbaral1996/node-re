"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateRangeValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.dateRangeValidator = joi_1.default.object({
    startDate: joi_1.default.number(),
    endDate: joi_1.default.number(),
});
