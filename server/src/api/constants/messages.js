/**
 * @constant
 * @description Common response messages.
 */
const HTTP_SUCCESS_MESSAGES = {
    SUCCESS: 'Success',
    PASSWORD_RESET_MAIL: 'Password reset mail sent.',
    PASSWORD_UPDATED: 'Password updated.',
    PROFILE_UPDATED: 'User Profile updated.',
    USER_UNLOCKED: 'User unlocked',
    USER_PRIORITIES_UPDATED: "User's notification priorities have been updated.",
    CLAIM_CREATED: 'Claim created successfully',
    DRAFT_UPDATED:'Draft updated successfully'
  };
  
  const HTTP_ERROR_MESSAGES = {
    EMAIL_IN_USE: 'email already in use.',
    USER_NOT_FOUND: 'User not found',
    UNAUTHORIZED: 'Unauthorized',
    ACCOUNT_LOCKED: 'Account locked. Please contact admin.',
    UNABLE_TO_GET_USER: 'Unable to get user.',
    CANNOT_DETERMINE_EMAIL: 'Unable to determine the users email',
    UNABLET_TO_ADD_USER: 'Unable to add user.',
    EMAIL_REQUIRED: 'Email is required.',
    EMAIL_INVALID: 'Email is invalid.',
    PASSWORD_REQUIRED: 'Password is required.',
    CONFIRMATION_REQUIRED: 'Confirm password required.',
    CONFIRMATION_NO_MATCH: 'Password confirmation does not match password',
    PASSWORD_MIN_LENGTH: 'Password should be atleast 8 character.',
    PASSWORD_ALPHANUMERIC: 'Should be a mix of letters and numbers.',
    NAME_REQUIRED: 'Name is required.',
    FIRST_NAME_REQUIRED: 'Firstname is required.',
    LAST_NAME_REQUIRED: 'Lastname is required.',
    INVALID_NAME: 'Name is invalid.',
    INVALID_PASSWORD: 'Incorrect password',
    PASSWORD_SAME: 'New password cannot be the same as the old password.',
    INVALID_ROLE: 'Role not valids',
    INVALID_TOKEN: 'Token is invalid',
    NOT_ALLOWED: 'You are not allowed to perform this operation.',
    USER_PRIORITY_NOT_EXIST: 'User Priority for notification does not exist.',
    BILL_DETAILS_REQUIRED:'Bill details required',
    REIMBURSEMENT_TYPE_REQUIRED: 'Reimbursement type is required',
    BILL_INVOIVE_REQUIRED: 'Invoice required',
    BILL_AMOUNT_REQUIRED: 'Bill amount required',
    NUMBER_OF_BILLS_REQUIRED: 'Number of Bills required',
    USER_NAME_REQUIRED: "Username required",

    PASSWORD_MAX_LENGTH: 'Password must be at least 10 characters long',
    PASSWORD_LENGTH: 'Password must contain at least one number',
    PASSWORD_WITH_UPPERCASE: 'Password must contain at least one uppercase letter',
    PASSWORD_WITH_LOWERCASE: 'Password must contain at least one lowercase letter',
    PASSWORD_WITH_SPECIAL_CHAR: 'Password must contain at least one special character'

  };
  
  module.exports = {
    HTTP_ERROR_MESSAGES,
    HTTP_SUCCESS_MESSAGES,
  };
  