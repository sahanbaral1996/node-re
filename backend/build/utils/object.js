"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCamelCaseObjectFromNameValuePairs = exports.toCamelKeys = exports.toSnakeCaseAttrs = exports.toSnakeCaseAttrNameValuePairs = exports.renameKeys = void 0;
const ramda_1 = require("ramda");
const camelcase_keys_1 = __importDefault(require("camelcase-keys"));
const string_1 = require("./string");
/**
 *
 * @param {Object} keysMap
 * @param {Object} inputObject
 */
exports.renameKeys = ramda_1.curry((keysMap, inputObject) => ramda_1.reduce((acc, key) => ramda_1.assoc(keysMap[key] || key, inputObject[key], acc), {}, ramda_1.keys(inputObject)));
exports.toSnakeCaseAttrNameValuePairs = ramda_1.compose(ramda_1.map(([key, value]) => ({ Name: string_1.toSnakeCase(key), Value: `${value}` })), ramda_1.toPairs);
exports.toSnakeCaseAttrs = ramda_1.compose(ramda_1.fromPairs, ramda_1.map(([key, value]) => [string_1.toSnakeCase(key), value]), ramda_1.toPairs);
function toCamelKeys(input) {
    return camelcase_keys_1.default(input, { deep: true });
}
exports.toCamelKeys = toCamelKeys;
function toCamelCaseObjectFromNameValuePairs(pairs) {
    const output = {};
    pairs.reduce((accumulator, { Name, Value }) => {
        accumulator[Name] = Value;
        return accumulator;
    }, output);
    return camelcase_keys_1.default(output);
}
exports.toCamelCaseObjectFromNameValuePairs = toCamelCaseObjectFromNameValuePairs;
