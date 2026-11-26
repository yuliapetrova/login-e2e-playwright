// @ts-check
const { endpoints } = require('../test-data/api');

/**
 * HTTP-level client for the login flow, used to check status codes and
 * redirects without a browser. Redirects are never followed, so each
 * response is the server's direct answer. Cookies persist between calls
 * within one test, so a login carries over to later requests.
 */
class AuthApi {
  /** @param {import('@playwright/test').APIRequestContext} request */
  constructor(request) {
    this.request = request;
  }

  async openLogin() {
    return this.request.get(endpoints.login, { maxRedirects: 0 });
  }

  /**
   * Submit the login form.
   * @param {string} username
   * @param {string} password
   */
  async authenticate(username, password) {
    return this.request.post(endpoints.authenticate, {
      form: { username, password },
      maxRedirects: 0,
    });
  }

  async openSecure() {
    return this.request.get(endpoints.secure, { maxRedirects: 0 });
  }

  async logout() {
    return this.request.get(endpoints.logout, { maxRedirects: 0 });
  }
}

module.exports = { AuthApi };
