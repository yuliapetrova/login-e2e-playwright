// @ts-check

/**
 * Test data for login scenarios.
 * Valid credentials can be overridden with environment variables so that
 * real secrets never need to be committed for other environments.
 */
const validUser = {
  username: process.env.LOGIN_USERNAME || 'tomsmith',
  password: process.env.LOGIN_PASSWORD || 'SuperSecretPassword!',
};

const invalidUsername = 'invalidUser';
const invalidPassword = 'WrongPassword!';

/** Hostile inputs that must be rejected as ordinary invalid usernames. */
const hostileInputs = {
  sqlInjection: "' OR 1=1 --",
  xss: '<script>alert(1)</script>',
};

/** Exact flash messages shown by the application. */
const messages = {
  loginSuccess: 'You logged into a secure area!',
  invalidUsername: 'Your username is invalid!',
  invalidPassword: 'Your password is invalid!',
  logoutSuccess: 'You logged out of the secure area!',
  loginRequired: 'You must login to view the secure area!',
};

module.exports = { validUser, invalidUsername, invalidPassword, hostileInputs, messages };
