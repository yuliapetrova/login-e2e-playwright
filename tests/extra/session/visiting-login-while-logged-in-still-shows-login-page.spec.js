// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');

test.describe('Login - extra scenarios', () => {
  test(
    'Visiting /login while logged in still shows login page',
    { tag: ['@regression'] },
    async ({ page, loginViaApi, loginPage, secureAreaPage }) => {
      await loginViaApi();
      await secureAreaPage.open();
      await expect(secureAreaPage.heading).toBeVisible();

      // Observed on the live site: /login renders normally and the session is kept.
      await loginPage.open();
      await expect(page).toHaveURL(loginPage.urlPattern);
      await expect(loginPage.heading).toBeVisible();

      await secureAreaPage.open();
      await expect(page).toHaveURL(secureAreaPage.urlPattern);
      await expect(secureAreaPage.heading).toBeVisible();
    },
  );
});
