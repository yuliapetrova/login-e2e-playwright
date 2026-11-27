// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { invalidLogins } = require('../../../test-data/users');

/**
 * Matches any of the given texts.
 * @param {string[]} texts
 */
const anyOf = (texts) =>
  new RegExp(texts.map((text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'));

// One test per row of invalidLogins in test-data/users.js.
test.describe('Login - extra scenarios', () => {
  for (const { name, username, password, expectedMessages } of invalidLogins) {
    test(name, { tag: ['@regression'] }, async ({ page, loginPage, secureAreaPage }) => {
      await loginPage.open();
      await loginPage.login(username, password);

      await expect(page).toHaveURL(loginPage.urlPattern);
      await expect.soft(loginPage.flashMessage).toContainText(anyOf(expectedMessages));
      await expect.soft(secureAreaPage.heading).toBeHidden();
    });
  }
});
