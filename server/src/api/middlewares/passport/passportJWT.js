const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { JWT_SECRET } = require('../../constants');
const { userController } = require('../../controllers');

let opts = {
  passReqToCallback: true,
};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = JWT_SECRET;

/**
 * @description JWT strategy common to all users. Validates the token.
 */
const strategy = new JwtStrategy(opts, (async (req,payload,done) => {
  try {

      const token = req.headers.authorization.split(' ')[1];

      const user = await userController.checkIfUserExists({
      id: payload.id,
      });

      if (!user) {
      return done(new Error('User not logged in.'),null)
    }
    const existingToken = await userController.fetchToken({userId: payload.id,token, })

    if (!existingToken || Object.entries(existingToken).length === 0 || !(existingToken.active_flag)) {
      console.log(`Invalid token for user:: ${payload.id}`);
      return done(new Error(('User Logged out'),null))
    }

    if(existingToken.active_flag == 0){
       console.log(`Inactive user: ${payload.id}`);
       return done(new Error('User inactivated!'),null)
    }
    
    //  const currentUserRole = user.Role ? user.Role.name: '';

    // if(existingToken.role !== currentUserRole){
    //    return done(new Error('User role has been changed. Please login again'),null)
    // }
    

    return done(null, user);
  } catch (error) { 
    return done(error);
  }
}));

module.exports = strategy;
