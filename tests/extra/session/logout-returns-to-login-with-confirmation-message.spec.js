// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { messages } = require('../../../test-data/users');

test.describe('Login - extra scenarios', () => {
  test(
    'Logout returns to login with confirmation message',
    { tag: ['@regression'] },
    async ({ page, loginViaApi, loginPage, secureAreaPage }) => {
      await loginViaApi();
      await secureAreaPage.open();
      await expect(secureAreaPage.heading).toBeVisible();

      await secureAreaPage.logout();

      await expect(page).toHaveURL(loginPage.urlPattern);
      await expect.soft(loginPage.flashMessage).toContainText(messages.logoutSuccess);
      await expect.soft(loginPage.loginButton).toBeVisible();
    },
  );
});
