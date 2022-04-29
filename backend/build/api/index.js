"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_route_1 = __importDefault(require("./routes/account.route"));
const customer_route_1 = __importDefault(require("./routes/customer.route"));
const chargebee_route_1 = __importDefault(require("./routes/chargebee.route"));
const lead_route_1 = __importDefault(require("./routes/lead.route"));
const authentication_route_1 = __importDefault(require("./routes/authentication.route"));
const person_route_1 = __importDefault(require("./routes/person.route"));
const analytics_route_1 = __importDefault(require("./routes/analytics.route"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
// guaranteed to get dependencies
exports.default = () => {
    const app = express_1.Router();
    account_route_1.default(app);
    customer_route_1.default(app);
    chargebee_route_1.default(app);
    lead_route_1.default(app);
    authentication_route_1.default(app);
    person_route_1.default(app);
    analytics_route_1.default(app);
    admin_route_1.default(app);
    return app;
};
