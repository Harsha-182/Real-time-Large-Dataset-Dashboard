/**
 * @module Validators
 */

const { validationResult } = require('express-validator');
const checks = require('./checks');

/**
 * @description Used to validate requests.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const parsedErrors = errors.array().map((e) => ({ value: e.value, message: e.msg }));
    return res.status(400).json({ errors: parsedErrors });
  }
  return next();
};

module.exports = {
  validateRequest,
  checks,
};
