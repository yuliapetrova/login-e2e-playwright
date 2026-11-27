// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');

test.describe('Login - extra scenarios', () => {
  test(
    'Session persists on reload of /secure',
    { tag: ['@regression'] },
    async ({ page, loginViaApi, secureAreaPage }) => {
      await loginViaApi();
      await secureAreaPage.open();
      await expect(secureAreaPage.heading).toBeVisible();

      await page.reload();

      await expect(page).toHaveURL(secureAreaPage.urlPattern);
      await expect(secureAreaPage.heading).toBeVisible();
    },
  );
});
