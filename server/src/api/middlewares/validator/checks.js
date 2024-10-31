const { body, query } = require('express-validator');
const { HTTP_ERROR_MESSAGES } = require('../../constants/messages');

const EMAIL_CHECK = body('email')
  .exists()
  .withMessage(HTTP_ERROR_MESSAGES.EMAIL_REQUIRED)
  .bail()
  .escape()
  .normalizeEmail()
  .isEmail()
  .withMessage(HTTP_ERROR_MESSAGES.EMAIL_INVALID);

const CREDENTIALS = [
  EMAIL_CHECK,
  body('password')
    .exists()
    .withMessage(HTTP_ERROR_MESSAGES.PASSWORD_REQUIRED)
    .not()
    .isEmpty()
    .withMessage(HTTP_ERROR_MESSAGES.PASSWORD_REQUIRED),
];

const PASSWORD_CHECK = [
  body('password')
    .isLength({ min: 10 }).withMessage(HTTP_ERROR_MESSAGES.PASSWORD_MAX_LENGTH)
    .matches(/\d/).withMessage(HTTP_ERROR_MESSAGES.PASSWORD_LENGTH)
    .matches(/[A-Z]/).withMessage(HTTP_ERROR_MESSAGES.PASSWORD_WITH_UPPERCASE)
    .matches(/[a-z]/).withMessage(HTTP_ERROR_MESSAGES.PASSWORD_WITH_LOWERCASE)
    .matches(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/).withMessage(HTTP_ERROR_MESSAGES.PASSWORD_WITH_SPECIAL_CHAR),

  body('confirmPassword')
    .exists()
    .withMessage(HTTP_ERROR_MESSAGES.CONFIRMATION_REQUIRED)
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(HTTP_ERROR_MESSAGES.CONFIRMATION_NO_MATCH);
      }
      return true;
    }),
]
const SIGNUP_CHECK = [
  EMAIL_CHECK,
  PASSWORD_CHECK,
];

module.exports = {
  CREDENTIALS,
  SIGNUP_CHECK,
  EMAIL_CHECK,
  PASSWORD_CHECK
};