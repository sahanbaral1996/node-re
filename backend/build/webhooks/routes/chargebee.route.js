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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chargebeeController = __importStar(require("webhooks/controller/chargebee.controller"));
const route = express_1.Router();
exports.default = (webhook) => {
    webhook.use('/chargebee', route);
    route.post('/customer/Order/reactivate', chargebeeController.reactivateSubscription);
    /**
     * add this to chargebee webhook to migrate price for existing subscriptions
     * remove from chargebee webhook when migration is complete
     *  */
    route.post('/customer/subscription/price', chargebeeController.updatePlanForSubscription);
    /**
     * This webhook incurs a addon for oral meds if prescribed by dermatologists
     */
    route.post('/customer/subscription/adddon', chargebeeController.incurAddonChargeOnSubscription);
};
