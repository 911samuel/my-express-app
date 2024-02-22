"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateValidationRules = exports.storeValidationRules = void 0;
const express_validator_1 = require("express-validator");
const storeValidationRules = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('author').notEmpty().withMessage('Author is required'),
];
exports.storeValidationRules = storeValidationRules;
const updateValidationRules = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('author').notEmpty().withMessage('Author is required'),
];
exports.updateValidationRules = updateValidationRules;
