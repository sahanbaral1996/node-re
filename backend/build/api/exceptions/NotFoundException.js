"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = __importDefault(require("./Error"));
class NotFoundException extends Error_1.default {
    constructor(message = 'Not Found') {
        super(message);
    }
}
exports.default = NotFoundException;
