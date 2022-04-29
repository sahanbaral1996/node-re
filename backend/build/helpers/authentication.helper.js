"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDataFromToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const container_1 = __importDefault(require("container"));
const getUserDataFromToken = async (idToken) => {
    const jwksClient = container_1.default.resolve('jwksClient');
    const logger = container_1.default.resolve('logger');
    function getKey(header, callback) {
        jwksClient.getSigningKey(header.kid, function (err, key) {
            const signingKey = key;
            const signingPublicKey = signingKey.rsaPublicKey;
            callback(null, signingPublicKey);
        });
    }
    return await new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(idToken, getKey, function (err, decodedIdToken) {
            if (!err) {
                logger.info('decoded id token');
                resolve(decodedIdToken);
            }
            else {
                logger.error(err);
                reject(err);
            }
        });
    });
};
exports.getUserDataFromToken = getUserDataFromToken;
