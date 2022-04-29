"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomEventEmitter = void 0;
const events_1 = __importDefault(require("events"));
const customer_1 = require("subscribers/customer");
class CustomEventEmitter extends events_1.default {
}
exports.CustomEventEmitter = CustomEventEmitter;
exports.default = () => {
    const customerEventEmitter = new CustomEventEmitter();
    customer_1.initializeCustomerEvents({ eventEmitter: customerEventEmitter });
    return customerEventEmitter;
};
