"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = __importDefault(require("./Error"));
class OperationException extends Error_1.default {
    constructor(messages = ['Operation Exception'], object, operation) {
        const combinedMessage = messages.join();
        super(combinedMessage);
        this.message = combinedMessage;
        this.object = object;
        this.operation = operation;
    }
}
exports.default = OperationException;
