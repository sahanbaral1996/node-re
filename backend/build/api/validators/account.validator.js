"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachImageValidator = exports.uploadAttachmentParamValidator = exports.uploadAttachmentBodyValidator = exports.attachmentValidator = void 0;
const document_constants_1 = require("constants/salesforce/document.constants");
const joi_1 = __importDefault(require("joi"));
/**
 * Attachment Validator
 */
exports.attachmentValidator = joi_1.default.object({
    selfies: joi_1.default.any().label('selfies').required(),
    shelfies: joi_1.default.any().label('shelfies').required(),
});
exports.uploadAttachmentBodyValidator = joi_1.default.object({
    prefix: joi_1.default.string().valid(document_constants_1.SELFIE_PREFIX, document_constants_1.SHELFIE_PREFIX).required(),
});
exports.uploadAttachmentParamValidator = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.attachImageValidator = joi_1.default.object({
    selfies: joi_1.default.array().min(1).items(joi_1.default.string()),
});
