"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
const ramda_1 = require("ramda");
function getToken(prefix, value) {
    return ramda_1.compose(ramda_1.last, ramda_1.split(`${prefix} `))(value);
}
exports.getToken = getToken;
