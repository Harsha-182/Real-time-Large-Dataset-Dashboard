/**
 * @description  This file is called an entry file for passport folder.
 */
const passport = require('passport');
const LocalStrategy = require('./passportLocal');
const JwtStrategy = require('./passportJWT');

passport.use(LocalStrategy);
passport.use(JwtStrategy);

module.exports = {
  passport,
};

