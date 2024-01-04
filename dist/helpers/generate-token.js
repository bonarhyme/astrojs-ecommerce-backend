"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id) => {
    const JWT_SECRET = process.env.JWT_SECRET || '';
    return jsonwebtoken_1.default.sign({ id }, JWT_SECRET, {
        expiresIn: '365d',
    });
};
exports.generateToken = generateToken;
