import { body } from 'express-validator';

const storeValidationRules = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('author').notEmpty().withMessage('Author is required').trim(),
];


const updateValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
];

const registerValidationRules = [
  body('firstname').notEmpty().withMessage('First name is required'),
  body('lastname').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('avatar').optional().isURL().withMessage('Profile picture must be a valid URL'),
];

const loginValidationRules = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const commentValidationRules = [
  body('content').trim().notEmpty().withMessage('Comment content is required')
];

export { storeValidationRules, updateValidationRules, registerValidationRules, loginValidationRules, commentValidationRules };