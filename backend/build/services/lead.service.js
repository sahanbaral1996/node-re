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
exports.findLeadById = exports.createLeadByAdmin = exports.updateLead = exports.createLead = void 0;
const salesforceLeadService = __importStar(require("services/salesforce/lead.service"));
const user_service_1 = __importDefault(require("services/cognito/user.service"));
const AlreadyExistsException_1 = __importDefault(require("api/exceptions/AlreadyExistsException"));
const common_constants_1 = require("constants/salesforce/common.constants");
const app_constants_1 = require("constants/app.constants");
const cognito_constants_1 = require("constants/cognito.constants");
const createLead = async (createLeadDetails) => {
    const userService = user_service_1.default();
    const [existingUser, existingLead] = await Promise.all([
        userService.getCognitoUserInPoolByEmail(createLeadDetails.email),
        salesforceLeadService.findLeadByEmail(createLeadDetails.email),
    ]);
    if (existingUser) {
        throw new AlreadyExistsException_1.default(cognito_constants_1.COGNITO_USER, 'User already exists');
    }
    if (existingLead) {
        throw new AlreadyExistsException_1.default(common_constants_1.LEAD, 'Lead already exists');
    }
    const { email, lastName = app_constants_1.ANONYMOUS_LAST_NAME_PLACEHOLDER, firstName, state } = createLeadDetails;
    return salesforceLeadService.createLead({ email, lastName, firstName, state });
};
exports.createLead = createLead;
const updateLead = (id, updateLeadDetails) => {
    return salesforceLeadService.updateLead({ id, leadDetails: updateLeadDetails });
};
exports.updateLead = updateLead;
const createLeadByAdmin = async (details) => {
    const { email, ...rest } = details;
    const userService = user_service_1.default();
    const [existingUser, existingLead] = await Promise.all([
        userService.getCognitoUserInPoolByEmail(details.email),
        salesforceLeadService.findLeadByEmail(details.email),
    ]);
    if (existingUser) {
        throw new AlreadyExistsException_1.default(cognito_constants_1.COGNITO_USER, 'User already exists');
    }
    if (existingLead) {
        return salesforceLeadService.updateLead({ id: existingLead.id, leadDetails: details });
    }
    return salesforceLeadService.createLead({ email, ...rest });
};
exports.createLeadByAdmin = createLeadByAdmin;
const findLeadById = (id) => {
    return salesforceLeadService.findLeadById(id);
};
exports.findLeadById = findLeadById;
