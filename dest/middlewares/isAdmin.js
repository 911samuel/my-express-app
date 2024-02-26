"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
require('dotenv').config();
const isAdmin = async (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    console.log("Token in isAdmin:", token);
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.LOGIN_SECRET || 'I0H1A9G2sam');
        console.log("Decoded Token in isAdmin:", decoded);
        const user = await user_1.default.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized: User is not an admin' });
        }
        next();
    }
    catch (error) {
        console.error("Error in isAdmin middleware:", error);
        return res.status(401).json({ message: 'Invalid token', error: error });
    }
};
exports.default = isAdmin;
