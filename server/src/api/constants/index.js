/**
 * @constant
 * @description This file holds the constant values.
 * Unless they are overriden by environment variables.
 */
const MESSAGES = require('./messages');
const ROLES = require('./roles');

require('dotenv').config();

const PASSWORD_RESET_REDIRECT_URL = process.env.PASSWORD_RESET_REDIRECT_URL || process.env.BACKEND_HOST+'/#resetpassword'

module.exports = {
  SALT_ROUNDS: process.env.SALT_ROUNDS || 10,
  JWT_SECRET: process.env.JWT_SECRET || '097d6a54e7a6af9601abf6bf085c70b80d3f05b1',
  MESSAGES,
  ROLES,
  PASSWORD_RESET_REDIRECT_URL,
};
