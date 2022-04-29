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
exports.createPersonByAdmin = exports.createPerson = void 0;
const personService = __importStar(require("services/person.service"));
const http_status_codes_1 = require("http-status-codes");
const lang_1 = __importDefault(require("lang"));
const createPerson = async (req, res, next) => {
    try {
        const { email, salesforceReferenceId: leadId } = req.currentUser;
        const assessment = req.body;
        const userDetails = {
            email,
            leadId,
            assessment,
        };
        const personData = await personService.createPerson(userDetails);
        res.json({ data: personData });
    }
    catch (error) {
        next(error);
    }
};
exports.createPerson = createPerson;
const createPersonByAdmin = async (req, res, next) => {
    try {
        await personService.createPersonByAdmin(req.body);
        res.json({
            code: http_status_codes_1.StatusCodes.OK,
            message: lang_1.default.createPersonByAdminSuccess,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createPersonByAdmin = createPersonByAdmin;
