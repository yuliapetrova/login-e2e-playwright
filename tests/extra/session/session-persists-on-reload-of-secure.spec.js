// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { validUser } = require('../../../test-data/users');

test.describe('Login - extra scenarios', () => {
  test('Session persists on reload of /secure', async ({ page, loginPage, secureAreaPage }) => {
    await loginPage.open();
    await loginPage.login(validUser.username, validUser.password);
    await expect(secureAreaPage.heading).toBeVisible();

    await page.reload();

    await expect(page).toHaveURL(/\/secure$/);
    await expect(secureAreaPage.heading).toBeVisible();
  });
});
