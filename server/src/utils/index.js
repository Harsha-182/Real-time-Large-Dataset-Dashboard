/**
 * @description  This file is called an entry file for utils folder.
 */
const httpError = require('http-errors');
const authUtils = require('./auth');
const logUtils = require('./logger');
const mailUtils = require('./mail')

module.exports = {
  authUtils,
  successResponseGenerator: (data, message = 'Success') => ({
    responseCode: 2000,
    message,
    ...data,
  }),
  httpErrorGenerator: (code = 500, message) => httpError(code, message, {
    expose: process.env.NODE_ENV === 'development',
  }),
  logUtils,
  mailUtils
};

