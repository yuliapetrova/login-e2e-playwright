// @ts-check

/**
 * Shared behaviour for all page objects.
 * Each page object knows its own path and the flash message banner
 * that the-internet.herokuapp.com shows on several pages.
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {string} path Path relative to baseURL.
   */
  constructor(page, path) {
    this.page = page;
    this.path = path;
    this.flashMessage = page.locator('#flash');
    this.flashCloseButton = this.flashMessage.getByRole('link', { name: 'Close' });
  }

  /** Navigate directly to this page. */
  async open() {
    await this.page.goto(this.path);
  }

  /** Close the flash message banner with its (x) control. */
  async dismissFlash() {
    await this.flashCloseButton.click();
  }
}

module.exports = { BasePage };
