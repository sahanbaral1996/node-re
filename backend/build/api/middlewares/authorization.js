"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorizedAdmin = void 0;
const http_status_codes_1 = require("http-status-codes");
const Error_1 = __importDefault(require("api/exceptions/Error"));
const lang_1 = __importDefault(require("lang"));
const cognito_constants_1 = require("constants/cognito.constants");
function isAuthorized(req, res, next) {
    const currentUser = req.currentUser;
    const customerId = currentUser.id;
    if (req.params.customerId === customerId) {
        return next();
    }
    return next(new Error_1.default(lang_1.default.invalidToken, http_status_codes_1.StatusCodes.UNAUTHORIZED));
}
function isAuthorizedAdmin(req, res, next) {
    const currentUser = req.currentUser;
    if (currentUser.groups.length === 1 && currentUser.groups.includes(cognito_constants_1.ADMIN_USER_GROUP)) {
        return next();
    }
    return next(new Error_1.default(lang_1.default.invalidToken, http_status_codes_1.StatusCodes.UNAUTHORIZED));
}
exports.isAuthorizedAdmin = isAuthorizedAdmin;
exports.default = isAuthorized;
