"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
require('dotenv').config({ path: '.env' });
const authController = {
    register: async (req, res, next) => {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { firstname, lastname, email, password, role, avatar } = req.body;
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const newUser = new user_1.default({
                firstname,
                lastname,
                email,
                password: hashedPassword,
                role,
                avatar,
            });
            const savedUser = await newUser.save();
            const token = jsonwebtoken_1.default.sign({ _id: savedUser._id }, process.env.LOGIN_SECRET || 'I0H1A9G2sam', { expiresIn: '1d' });
            if (!token) {
                throw new Error('Failed to generate token');
            }
            return res.status(200).json({
                message: 'Registration successful',
                token,
            });
        }
        catch (error) {
            console.error('Error in Register:', error);
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { email, password } = req.body;
            console.log(email + " " + password);
            const user = await user_1.default.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.LOGIN_SECRET || 'I0H1A9G2sam', { expiresIn: '1d' });
            if (!token) {
                throw new Error('Failed to generate token');
            }
            return res.status(200).json({
                message: 'Login successful',
                token,
            });
        }
        catch (error) {
            next(error);
        }
    },
};
exports.default = authController;
