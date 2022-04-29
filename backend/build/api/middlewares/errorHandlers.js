"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OperationException_1 = __importDefault(require("api/exceptions/OperationException"));
const http_status_codes_1 = require("http-status-codes");
const container_1 = __importDefault(require("container"));
const app_constants_1 = require("constants/app.constants");
const SubscriptionException_1 = __importDefault(require("api/exceptions/SubscriptionException"));
const AlreadyExistsException_1 = __importDefault(require("api/exceptions/AlreadyExistsException"));
/*eslint-disable */
const errorHandler = (err, req, res, next) => {
    const logger = container_1.default.resolve(app_constants_1.LOGGER_TOKEN);
    logger.error(err.stack);
    if (err instanceof OperationException_1.default) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: `${err.message}`,
            operation: {
                object: err.object,
                type: err.operation,
            },
        });
    }
    else if (err instanceof SubscriptionException_1.default) {
        return res.status(err.code || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: err.code || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: err.message,
            operation: err.operation,
        });
    }
    else if (err instanceof AlreadyExistsException_1.default) {
        return res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
            code: http_status_codes_1.StatusCodes.CONFLICT,
            message: err.message,
            object: err.object,
        });
    }
    return res
        .status(err.code || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ code: err.code || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: err.message });
};
exports.default = errorHandler;
