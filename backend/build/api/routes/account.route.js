"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const celebrate_1 = require("celebrate");
const authentication_1 = __importDefault(require("api/middlewares/authentication"));
const accountController = __importStar(require("api/controllers/account.controller"));
const account_validator_1 = require("api/validators/account.validator");
const route = express_1.Router();
const upload = multer_1.default({});
exports.default = (app) => {
    app.use('/account', route);
    route.post('/:id/upload-attachments', upload.fields([
        {
            name: 'selfies',
            maxCount: 5,
        },
        {
            name: 'shelfies',
            maxCount: 5,
        },
    ]), celebrate_1.celebrate({
        [celebrate_1.Segments.PARAMS]: account_validator_1.uploadAttachmentParamValidator,
    }), accountController.uploadAttachments);
    route.post('/upload-attachment', authentication_1.default, upload.single('attachment'), celebrate_1.celebrate({
        [celebrate_1.Segments.BODY]: account_validator_1.uploadAttachmentBodyValidator,
    }), accountController.uploadAttachment);
    route.post('/attachment', authentication_1.default, upload.single('attachment'), celebrate_1.celebrate({
        [celebrate_1.Segments.BODY]: account_validator_1.uploadAttachmentBodyValidator,
    }), accountController.attachmentUpload);
    route.post('/attach-photo', authentication_1.default, celebrate_1.celebrate({
        [celebrate_1.Segments.BODY]: account_validator_1.attachImageValidator,
    }), accountController.attachImages);
    route.get('/detail', authentication_1.default, accountController.getAccountDetails);
    route.post('/status', authentication_1.default, accountController.updateStatus);
};
