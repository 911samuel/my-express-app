"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentValidationRules = exports.loginValidationRules = exports.registerValidationRules = exports.updateValidationRules = exports.storeValidationRules = void 0;
const express_validator_1 = require("express-validator");
const storeValidationRules = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required').trim(),
    (0, express_validator_1.body)('author').notEmpty().withMessage('Author is required').trim(),
];
exports.storeValidationRules = storeValidationRules;
const updateValidationRules = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('author').notEmpty().withMessage('Author is required'),
];
exports.updateValidationRules = updateValidationRules;
const registerValidationRules = [
    (0, express_validator_1.body)('firstname').notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastname').notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email address'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('avatar').optional().isURL().withMessage('Profile picture must be a valid URL'),
];
exports.registerValidationRules = registerValidationRules;
const loginValidationRules = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email address'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];
exports.loginValidationRules = loginValidationRules;
const commentValidationRules = [
    (0, express_validator_1.body)('content').trim().notEmpty().withMessage('Comment content is required')
];
exports.commentValidationRules = commentValidationRules;
