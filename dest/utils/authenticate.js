"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Missing Authorization Header' });
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, 'I0H1A9G2sam');
        req.user = decodedToken;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Invalid Token' });
    }
};
exports.default = authenticate;
