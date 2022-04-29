"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressFile = void 0;
const sharp_1 = __importDefault(require("sharp"));
const compressFile = async (file) => {
    const imgBuffer = await sharp_1.default(file.buffer).rotate().png({ quality: 20 }).toBuffer();
    return imgBuffer;
};
exports.compressFile = compressFile;
