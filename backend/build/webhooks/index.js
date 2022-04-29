"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chargebee_route_1 = __importDefault(require("./routes/chargebee.route"));
const salesforce_route_1 = __importDefault(require("./routes/salesforce.route"));
// guaranteed to get dependencies
exports.default = () => {
    const webhooks = express_1.Router();
    chargebee_route_1.default(webhooks);
    salesforce_route_1.default(webhooks);
    return webhooks;
};
