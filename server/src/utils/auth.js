/**
 * @description  Place to put shared logic
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SALT_ROUNDS, JWT_SECRET } = require('../api/constants');

const hashPassword = async (password) => bcrypt.hash(password, 10 || process.env.SALT_ROUNDS );
const comparePassword = async (password, hash) => bcrypt.compare(password, hash);
const generateJWT = (data) => jwt.sign(data, JWT_SECRET, {
  issuer: 'Himalaya',
  expiresIn: '2h',
});

module.exports = {
  hashPassword,
  generateJWT,
  comparePassword,
};
