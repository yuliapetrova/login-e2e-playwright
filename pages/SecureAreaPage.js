// @ts-check
const { BasePage } = require('./BasePage');

/** Page object for /secure, the area shown after a successful login. */
class SecureAreaPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page, '/secure');
    this.heading = page.getByRole('heading', { name: 'Secure Area', exact: true });
    this.welcomeText = page.getByText('Welcome to the Secure Area. When you are done click logout below.');
    this.logoutButton = page.getByRole('link', { name: 'Logout' });
  }

  async logout() {
    await this.logoutButton.click();
  }
}

module.exports = { SecureAreaPage };
