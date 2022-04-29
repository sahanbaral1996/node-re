"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = __importDefault(require("./Error"));
class AlreadyExistsException extends Error_1.default {
    constructor(object, message = 'Already Exists') {
        super(message);
        this.object = object;
    }
}
exports.default = AlreadyExistsException;
