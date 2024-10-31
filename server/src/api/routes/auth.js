const router = require('express').Router();
const {
  userController,
      } = require('../controllers');

const {
  successResponseGenerator,
  httpErrorGenerator,
  authUtils,
  mailUtils,
} = require('../../utils');

const appResponse = require('../../utils/app-response');

const {
  passport
} = require('../middlewares');

const {
  validator: {
    checks: {
      CREDENTIALS,
      SIGNUP_CHECK,
      EMAIL_CHECK,
      PASSWORD_CHECK,
    },
    validateRequest,
  },
} = require('../middlewares');

const {
  HTTP_ERROR_MESSAGES,
  HTTP_SUCCESS_MESSAGES
} = require('../constants/messages')

const { PASSWORD_RESET_MAIL } = require('../../api/constants/mail');

/**
 * @description Route to login users with email and password.
 * @param {string} email
 * @param {string} password
 */

router.post('/login',
  CREDENTIALS,
  validateRequest,
  passport.authenticate('local', {
    session: false,
  }),
  async (req, res, next) => {
    try {
      const { user } = req;
      const checkUser = await userController.checkIfUserExists({ id: req.user.id });
    
      const token = await user.getJwtToken();
        
      await userController.addSessionHistory({userId:checkUser.id, token })

      return res.status(200).json(successResponseGenerator({
        accessToken: token,
        userInfo: {
          id: checkUser.id,
          name: checkUser.first_name +" "+ checkUser.last_name ,
          email: checkUser.email,
        },
      }));
    } catch (error) {
      return res.status(500).json(createResponse({
        returnCode: 1,
        errorCode: 'SYSTEM_ERROR',
        errorMessage: error.sqlMessage || error.message,
        errorMeta: error.stack
    }));    
    }
  });

router.post('/signup', 
  SIGNUP_CHECK, 
  validateRequest,
  async (req, res, next) => {
  try {
      const { email, password, first_name, last_name} = req.body;
      const userExists = await userController.checkIfUserExists({ email });

      if (userExists) return next(httpErrorGenerator(400, HTTP_ERROR_MESSAGES.EMAIL_IN_USE));

      const user = await userController.createUserWithCredentials({ email, first_name, last_name, password });

      const token = await user.getJwtToken();

      // const role = await user.getRole();

      return res.status(200).json(
          successResponseGenerator({
              userInfo: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
              },
              accessToken: token,
              // role,
          }),
      );
  } catch (error) {
    return res.status(500).json(createResponse({
      returnCode: 1,
      errorCode: 'SYSTEM_ERROR',
      errorMessage: error.sqlMessage || error.message,
      errorMeta: error.stack
  }));    
  }
});

/**
 * @description Used to send the password reset email.
 * @param {String} email The email to be sent the password reset link.
 */
router.post('/forgot-password',
  EMAIL_CHECK,
  validateRequest,
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const userExists = await userController.checkIfUserExists({ email });
      if (!userExists) return next(httpErrorGenerator(400, HTTP_ERROR_MESSAGES.USER_NOT_FOUND));

      const token = authUtils.generateJWT({id:userExists.id});

      await userController.addSessionHistory({userId:userExists.id, token });

      const toAddress = userExists.email;
      const subject = 'Password reset request.';
      console.log(token)
      const body = PASSWORD_RESET_MAIL(userExists.first_name, token);

      await mailUtils.send(toAddress, subject, body, null, true);

      return res.status(200).json(
        successResponseGenerator(null, HTTP_SUCCESS_MESSAGES.SUCCESS),
      );
    } catch (error) {
      return res.status(500).json(createResponse({
        returnCode: 1,
        errorCode: 'SYSTEM_ERROR',
        errorMessage: error.sqlMessage || error.message,
        errorMeta: error.stack
    }));
    }
  });

/**
 * @description Used to reset the password.
 * @param {String} password
 */
router.post('/reset-password',
  PASSWORD_CHECK,
  validateRequest,
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { password } = req.body;
      await userController.updatePassword(req.user.id, password);

      const token = req.headers.authorization.split(' ')[1];

      await userController.inactiveSession({userId: req.user.id, token});

      return res.status(200).json(successResponseGenerator(
        null,
        HTTP_SUCCESS_MESSAGES.PASSWORD_UPDATED,
      ));
    } catch (error) {
      return res.status(500).json(createResponse({
        returnCode: 1,
        errorCode: 'SYSTEM_ERROR',
        errorMessage: error.sqlMessage || error.message,
        errorMeta: error.stack
    }));
   }
});


/**
 * @description API to logout users.
 */
router.post  ('/logout',
passport.authenticate('jwt', { session: false }),
async (req, res, next) => {
  try {
  
   const token = req.headers.authorization.split(' ')[1];

   await userController.inactiveSession({userId: req.user.id, token})

   return res.status(200).json(successResponseGenerator(null, 'Logged out.'));

  } catch (error) {
   return res.status(500).json(createResponse({
     returnCode: 1,
     errorCode: 'SYSTEM_ERROR',
     errorMessage: error.sqlMessage || error.message,
     errorMeta: error.stack
   }));   
  }
});


 function createResponse(info) {
  return appResponse.createResponse({
      data: info.data,
      returnCode: info.returnCode || 0,
      error: {
          message: info.errorMessage,
          code: info.errorCode,
          meta: info.errorMeta
      }
  });
}

module.exports = router;