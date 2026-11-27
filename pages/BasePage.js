// @ts-check
const { test } = require('@playwright/test');

/**
 * Shared behaviour for all page objects.
 * Each page object knows its own path and the flash message banner
 * that the-internet.herokuapp.com shows on several pages.
 * Actions run as named, boxed steps, so the HTML report and traces read
 * like the test plan and errors point at the line in the test.
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {string} path Path relative to baseURL.
   */
  constructor(page, path) {
    this.page = page;
    this.path = path;
    /** Matches this page's URL, for `await expect(page).toHaveURL(...)`. */
    this.urlPattern = new RegExp(`${path.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}$`);
    this.flashMessage = page.locator('#flash');
    this.flashCloseButton = this.flashMessage.getByRole('link', { name: 'Close' });
  }

  /**
   * Run an action as a named step in the report.
   * @template T
   * @param {string} title
   * @param {() => Promise<T>} body
   * @returns {Promise<T>}
   */
  step(title, body) {
    return test.step(title, body, { box: true });
  }

  /** Navigate directly to this page. */
  async open() {
    await this.step(`Open ${this.path}`, async () => {
      await this.page.goto(this.path);
    });
  }

  /** Close the flash message banner with its (x) control. */
  async dismissFlash() {
    await this.step('Close the flash message', async () => {
      await this.flashCloseButton.click();
    });
  }
}

module.exports = { BasePage };
