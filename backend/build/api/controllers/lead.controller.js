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
exports.fetchLeadByAdmin = exports.updateLeadByAdmin = exports.createLeadByAdmin = exports.createLead = void 0;
const http_status_codes_1 = require("http-status-codes");
const lang_1 = __importDefault(require("lang"));
const leadService = __importStar(require("services/lead.service"));
const createLead = async (req, res, next) => {
    try {
        const leadDetails = req.body;
        const data = await leadService.createLead(leadDetails);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: lang_1.default.leadCreated,
            data,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createLead = createLead;
const createLeadByAdmin = async (req, res, next) => {
    try {
        const leadDetails = req.body;
        const data = await leadService.createLeadByAdmin(leadDetails);
        return res.json({
            code: http_status_codes_1.StatusCodes.OK,
            data,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createLeadByAdmin = createLeadByAdmin;
const updateLeadByAdmin = async (req, res, next) => {
    try {
        const leadDetails = req.body;
        const { leadId } = req.params;
        const data = await leadService.updateLead(leadId, leadDetails);
        return res.json({
            code: http_status_codes_1.StatusCodes.OK,
            data,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateLeadByAdmin = updateLeadByAdmin;
const fetchLeadByAdmin = async (req, res, next) => {
    try {
        const { leadId } = req.params;
        const data = await leadService.findLeadById(leadId);
        return res.json({
            code: http_status_codes_1.StatusCodes.OK,
            data,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.fetchLeadByAdmin = fetchLeadByAdmin;
