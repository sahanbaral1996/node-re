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
exports.validateCustomer = void 0;
const AlreadyExistsException_1 = __importDefault(require("api/exceptions/AlreadyExistsException"));
const ConstraintViolationException_1 = __importDefault(require("api/exceptions/ConstraintViolationException"));
const Error_1 = __importDefault(require("api/exceptions/Error"));
const http_status_codes_1 = require("http-status-codes");
const validationService = __importStar(require("services/validation.service"));
const validateCustomer = async (req, res, next) => {
    try {
        await validationService.validateCustomer(req.query);
        return res.status(http_status_codes_1.StatusCodes.OK).send();
    }
    catch (error) {
        if (error instanceof ConstraintViolationException_1.default) {
            next(new Error_1.default(error.message, http_status_codes_1.StatusCodes.NOT_ACCEPTABLE));
        }
        else if (error instanceof AlreadyExistsException_1.default) {
            next(new Error_1.default(error.message, http_status_codes_1.StatusCodes.CONFLICT));
        }
        next(error);
    }
};
exports.validateCustomer = validateCustomer;
