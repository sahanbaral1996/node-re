"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix_1 = require("awilix");
const container = awilix_1.createContainer({
    injectionMode: awilix_1.InjectionMode.PROXY,
});
exports.default = container;
