/**
 * @module
 * @description User controller. Has all the user related functionality.
 */

const Sequelize = require('sequelize');

const { Op } = Sequelize;
const {
 User,
 Credential, 
 SessionHistory, 
} = require('../../db/models');

const { v4: uuidv4 } = require('uuid');


const createUserWithCredentials = async ({
  email, first_name, last_name, role, password
}) => {
  const userDetails = {
    email,
    first_name,
    last_name,
    password,
    role,
    // role_id: roleId,
  };
  // if (!roleId) {
  //   const defaultRole = await Role.findOne({
  //     where: {
  //       name: 'user',
  //     },
  //   });
  //   userDetails.role_id = defaultRole.id;
  // }
  if (userDetails.password) {
    return User.create({
      ...userDetails,
      id: uuidv4(),
      Credential: {
        id: uuidv4(),
        password,
      },
    }, {
      include: [Credential],
    });
  }
  return User.create({
    ...userDetails,
  });
};

/**
 * @async
 * @description Used to find a user by the condition sepcified in the query object.
 * @param {Object} query - The query to find the user by.
 * @returns {Promise} Promise object representing the user defined by the search query.
 */
const checkIfUserExists = async (query) => User.findOne({

  where: {
    ...query,
  },
  attributes: ['id', 'first_name', 'last_name', 'email', 'role'],

});

/**
 * @async
 * @description Returns a user object along with the credentials.
 * @param {string} userId - UUID representing the user's id.
 * @returns {Promise} Promise object representing the user and his credentials.
 */
const getUserWithCredentials = async (userId) => User.findOne({
  where: {
    id: userId,
  },
  include: [Credential],
});

 /**
 * @async
 * @description Fetch the token in session history.
 * @param {STRING} userId Id of the user whose session token needs to be inactive.
 * @param {String} token existing token.
 */
const fetchToken = async({userId, token}) => {
 return await SessionHistory.findOne({
   where: {
     [Op.and]:[
       {user_id: userId},
       {access_token: token}
     ]    },
   attributes: ['id', 'active_flag']
 })
}

/**
* @async
* @description Used to add the token to session history.
* @param {String} userId Id of the user whose session token  needs to be stored.
* @param {String} token New token.
* @param {String} role User role
*/
  const addSessionHistory = async ({userId, token}) => {
    return await SessionHistory.create({
     id: uuidv4(),
     user_id: userId,
     access_token: token,
   })
}

/**
* @async
* @description Used to update the users password.
* @param {String} userId Id of the user whose password needs to be changed.
* @param {String} password New password.
*/
const updatePassword = async (userId, password) => {
 const userWithCredentials = await getUserWithCredentials(userId);
 return userWithCredentials.Credential.update({
   password,
 });
};

 /**
  * @async
  * @description Used to find a token by the condition sepcified in the query object.
  * @param {Object} query - The query to find the user by.
  * @param {String} token token to be inactive 
  */
 const inactiveSession = async({userId, token}) => {
  return await SessionHistory.update({
   active_flag: 0
  },{
   where: {
     [Op.and]:[
       {user_id: userId},
       {access_token: token}
     ]

   }
  })
}


 module.exports = {
  createUserWithCredentials,
  checkIfUserExists,
  getUserWithCredentials,
  fetchToken,
  addSessionHistory,
  updatePassword,
  inactiveSession,
};
