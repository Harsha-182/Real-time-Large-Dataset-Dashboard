const validator = require('./validator');
const passport = require('./passport');
const httpErrorHandler = require('./httpErrorHandler');
const rbac = require('./rbac');

module.exports = {
    validator,
    httpErrorHandler,
    ...passport,
    rbac,
}
