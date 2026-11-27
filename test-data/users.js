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

/**
 * Invalid logins that must be refused on the login page, one row per case.
 * Each row lists every message the site may show for it. The upper-case
 * username row allows both, because the live site answered with the
 * password message on 2026-11-26 and the username message from 2026-11-27.
 * To add a case, add a row.
 *
 * @type {{ name: string, username: string, password: string, expectedMessages: string[] }[]}
 */
const invalidLogins = [
  {
    name: 'Empty username and empty password',
    username: '',
    password: '',
    expectedMessages: [messages.invalidUsername],
  },
  {
    name: 'Valid username with empty password',
    username: validUser.username,
    password: '',
    expectedMessages: [messages.invalidPassword],
  },
  {
    name: 'Empty username with valid password',
    username: '',
    password: validUser.password,
    expectedMessages: [messages.invalidUsername],
  },
  {
    name: 'Username is case sensitive',
    username: validUser.username.toUpperCase(),
    password: validUser.password,
    expectedMessages: [messages.invalidUsername, messages.invalidPassword],
  },
  {
    name: 'Password is case sensitive',
    username: validUser.username,
    password: validUser.password.toLowerCase(),
    expectedMessages: [messages.invalidPassword],
  },
  {
    name: 'Username with leading and trailing whitespace is rejected',
    username: `  ${validUser.username}  `,
    password: validUser.password,
    expectedMessages: [messages.invalidUsername],
  },
  {
    name: 'SQL injection-like input is rejected',
    username: hostileInputs.sqlInjection,
    password: invalidPassword,
    expectedMessages: [messages.invalidUsername],
  },
];

module.exports = {
  validUser,
  invalidUsername,
  invalidPassword,
  hostileInputs,
  messages,
  invalidLogins,
};
