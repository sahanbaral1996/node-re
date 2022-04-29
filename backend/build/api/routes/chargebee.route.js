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
const Validate_1 = __importDefault(require("api/middlewares/Validate"));
const authentication_1 = __importDefault(require("api/middlewares/authentication"));
const chargebeeController = __importStar(require("api/controllers/chargebee.controller"));
const chargbeeSubscriptionController = __importStar(require("api/controllers/subscription.controller"));
const chargebee_validator_1 = require("api/validators/chargebee.validator");
const route = express_1.Router();
exports.default = (app) => {
    app.use('/chargebee', route);
    route.post('/customer', Validate_1.default(chargebee_validator_1.customerValidator), chargebeeController.register);
    route.post('/generate-url', authentication_1.default, Validate_1.default(chargebee_validator_1.hostedPageValidator), chargebeeController.hostedPage);
    route.post('/customer-portal-session', authentication_1.default, chargebeeController.customerPortal);
    route.post('/reactivate-subscription', authentication_1.default, chargbeeSubscriptionController.reactivateSubscription);
};
