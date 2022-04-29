"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBeforeDate = exports.isBetweenDates = void 0;
const date_fns_1 = require("date-fns");
const isAfter_1 = __importDefault(require("date-fns/isAfter"));
const isBefore_1 = __importDefault(require("date-fns/isBefore"));
const isBetweenDates = (start, end, inBetween) => (isAfter_1.default(inBetween, start) || date_fns_1.isSameDay(inBetween, start)) && (isBefore_1.default(inBetween, end) || date_fns_1.isSameDay(inBetween, end));
exports.isBetweenDates = isBetweenDates;
const isBeforeDate = (input, beforeDate) => isBefore_1.default(beforeDate, input);
exports.isBeforeDate = isBeforeDate;
