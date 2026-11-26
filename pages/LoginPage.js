// @ts-check
const { BasePage } = require('./BasePage');

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
}

module.exports = { LoginPage };
