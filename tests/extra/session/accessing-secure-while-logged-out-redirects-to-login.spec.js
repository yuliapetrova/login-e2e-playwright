// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { messages } = require('../../../test-data/users');

test.describe('Login - extra scenarios', () => {
  test(
    'Accessing /secure while logged out redirects to login',
    { tag: ['@regression'] },
    async ({ page, loginPage, secureAreaPage }) => {
      await secureAreaPage.open();

      await expect(page).toHaveURL(loginPage.urlPattern);
      await expect.soft(loginPage.flashMessage).toContainText(messages.loginRequired);
      await expect.soft(secureAreaPage.heading).toBeHidden();
    },
  );
});
