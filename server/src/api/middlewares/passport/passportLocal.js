const LocalStrategy = require('passport-local').Strategy;
const { userController } = require('../../controllers');
const {
 MESSAGES: {
    HTTP_ERROR_MESSAGES,
  },
} = require('../../constants');
const {

   httpErrorGenerator,
} = require('../../../utils');
const res = require('express/lib/response');

/**
 * @description Local strategy. Common to everyone using it.
 */
const strategy = new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
  try {
    const userExists = await userController.checkIfUserExists({
      email,
    });
    if (!userExists)return done(new Error(HTTP_ERROR_MESSAGES.EMAIL_INVALID),null);
    
    const user = await userController.getUserWithCredentials(userExists.id);
    if (user.is_locked) return done(httpErrorGenerator(401, HTTP_ERROR_MESSAGES.ACCOUNT_LOCKED));
    const checkPassword = await user.Credential.comparePassword(password);
    
    if (!checkPassword) {
      return done(httpErrorGenerator(401, "Password is incorrect"));
    }
    return done(null, user);
  } catch (error) {
    // LOG.error(error);
    return done(error);
  }
});

module.exports = strategy;
