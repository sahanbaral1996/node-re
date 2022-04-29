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
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const authentication_1 = __importDefault(require("api/middlewares/authentication"));
const personController = __importStar(require("api/controllers/person.controller"));
const leadController = __importStar(require("api/controllers/lead.controller"));
const userController = __importStar(require("api/controllers/user.controller"));
const person_validator_1 = require("api/validators/person.validator");
const lead_validator_1 = require("api/validators/lead.validator");
const user_validator_1 = require("api/validators/user.validator");
const authorization_1 = require("api/middlewares/authorization");
const privateAuthenticationRouter = express_1.Router();
const publicRouter = express_1.Router();
exports.default = (app) => {
    app.use('/admin', publicRouter);
    app.use('/admin', authentication_1.default, authorization_1.isAuthorizedAdmin, privateAuthenticationRouter);
    privateAuthenticationRouter.post('/person', celebrate_1.celebrate({ [celebrate_1.Segments.BODY]: person_validator_1.createPersonByAdminValidator }), personController.createPersonByAdmin);
    privateAuthenticationRouter.post('/lead', celebrate_1.celebrate({ [celebrate_1.Segments.BODY]: lead_validator_1.createLeadByAdminValidator }), leadController.createLeadByAdmin);
    privateAuthenticationRouter.put('/lead/:leadId', celebrate_1.celebrate({ [celebrate_1.Segments.BODY]: lead_validator_1.createLeadByAdminValidator }), leadController.updateLeadByAdmin);
    privateAuthenticationRouter.get('/lead/:leadId', leadController.fetchLeadByAdmin);
    // do not push this public api to production
    publicRouter.post('/user', celebrate_1.celebrate({ [celebrate_1.Segments.BODY]: user_validator_1.createUserValidator }), userController.createUserByAdmin);
};
