const { httpErrorGenerator } = require('../../utils');

/**
 * @param {Array} roles List of the allowed roles.
 * Checkks whether the user has any of the given roles. Denies access if the role is not present.
 */
const allowedRoles = (roles) => (req, res, next) => {
  const allowAccess = roles.find((role) => role === req.user.Role.name);
  if (allowAccess) {
    next();
  } else {
    next(httpErrorGenerator(401));
  }
};

module.exports = {
  allowedRoles,
};
