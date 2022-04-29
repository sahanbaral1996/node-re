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
exports.fbPixelConversion = void 0;
const Error_1 = __importDefault(require("api/exceptions/Error"));
const http_status_codes_1 = require("http-status-codes");
const analyticsService = __importStar(require("services/analytics.service"));
const fbPixelConversion = async (req, res, next) => {
    try {
        const { remoteAddress } = req.connection;
        const { ['user-agent']: userAgent } = req.headers;
        const pixelPayload = req.body;
        if (!remoteAddress && !userAgent) {
            throw new Error_1.default('Bad request', http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const data = await analyticsService.fbPixelConversion(pixelPayload, remoteAddress, userAgent);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            data,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.fbPixelConversion = fbPixelConversion;
