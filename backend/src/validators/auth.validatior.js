import { body, validationResult } from 'express-validator';

async function validateResult(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
}

export const registerUserValidationRules = [
  body('username')
    .isString()
    .withMessage('username must be a string')
    .notEmpty()
    .withMessage('username must not be empty')
    .isLength({ min: 4, max: 16 })
    .withMessage('username must be between 4 and 16 characters'),

  body('email')
    .notEmpty()
    .withMessage('email must not be empty')
    .isEmail()
    .withMessage('inavlid email adddress'),

  body('password')
    .notEmpty()
    .withMessage('password must not be empty')
    .isLength({ min: 6, max: 16 })
    .withMessage('password must be between 6 and 16 characters'),

  validateResult,
];

export const loginUserValidationRules = [
  body('username')
    .optional()
    .isString()
    .withMessage('username must be a string')
    .notEmpty()
    .withMessage('username must not be empty')
    .isLength({ min: 4, max: 16 })
    .withMessage('username must be between 4 and 16 characters'),

  body('email')
    .optional()
    .notEmpty()
    .withMessage('email must not be empty')
    .isEmail()
    .withMessage('inavlid email adddress'),

  body('password').notEmpty().withMessage('password must not be empty'),

  validateResult,
];
