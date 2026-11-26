// @ts-check

/** Server endpoints used by the login flow, relative to baseURL. */
const endpoints = {
  login: '/login',
  authenticate: '/authenticate',
  secure: '/secure',
  logout: '/logout',
};

/**
 * HTTP status codes the server returns in the login flow.
 * The form follows the post/redirect/get pattern, so a submitted login
 * answers 303 See Other in both the success and failure cases,
 * never 401.
 */
const statusCodes = {
  ok: 200,
  found: 302,
  seeOther: 303,
};

module.exports = { endpoints, statusCodes };
