// @ts-check
const { BasePage } = require('./BasePage');
const { endpoints } = require('../test-data/api');

/** Page object for /login. */
class LoginPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page, '/login');
    this.heading = page.getByRole('heading', { name: 'Login Page' });
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  /**
   * Fill in the form and submit it.
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Fill in the form and submit it by pressing Enter in the password field.
   * @param {string} username
   * @param {string} password
   */
  async loginWithEnter(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.passwordInput.press('Enter');
  }

  /**
   * Start waiting for the server's answer to the login form.
   * Call it before submitting, then await the returned promise.
   * @returns {Promise<import('@playwright/test').Response>}
   */
  waitForAuthenticateResponse() {
    return this.page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' && new URL(response.url()).pathname === endpoints.authenticate,
    );
  }
}

module.exports = { LoginPage };
