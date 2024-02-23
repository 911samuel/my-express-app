import { body } from 'express-validator';

const storeValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
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
  body('profilePicture').optional().isURL().withMessage('Profile picture must be a valid URL'),
];

const loginValidationRules = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const createCommentValidationRules = [
  body('content').trim().notEmpty().withMessage('Comment content is required'),
  body('author').trim().notEmpty().withMessage('Author name is required'),
];

export { storeValidationRules, updateValidationRules, registerValidationRules, loginValidationRules, createCommentValidationRules };