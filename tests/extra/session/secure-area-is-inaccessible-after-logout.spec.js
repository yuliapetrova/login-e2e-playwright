// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { messages } = require('../../../test-data/users');

test.describe('Login - extra scenarios', () => {
  test(
    'Secure area is inaccessible after logout',
    { tag: ['@regression'] },
    async ({ page, loginViaApi, loginPage, secureAreaPage }) => {
      await loginViaApi();
      await secureAreaPage.open();
      await expect(secureAreaPage.heading).toBeVisible();
      await secureAreaPage.logout();
      await expect(loginPage.flashMessage).toContainText(messages.logoutSuccess);

      await secureAreaPage.open();

      await expect(page).toHaveURL(loginPage.urlPattern);
      await expect(loginPage.flashMessage).toContainText(messages.loginRequired);
    },
  );
});
