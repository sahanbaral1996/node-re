"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSnakeCase = void 0;
const ramda_1 = require("ramda");
const toSnakeCase = (input) => input.replace(/([A-Z])/g, x => ramda_1.concat('_', x.toLowerCase()));
exports.toSnakeCase = toSnakeCase;
