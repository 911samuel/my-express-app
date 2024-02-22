import { body } from 'express-validator';

const storeValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
];

const updateValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
];

export { storeValidationRules, updateValidationRules };