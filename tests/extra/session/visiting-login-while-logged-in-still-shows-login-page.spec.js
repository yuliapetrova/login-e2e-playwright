// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { validUser } = require('../../../test-data/users');

test.describe('Login - extra scenarios', () => {
  test('Visiting /login while logged in still shows login page', async ({
    page,
    loginPage,
    secureAreaPage,
  }) => {
    await loginPage.open();
    await loginPage.login(validUser.username, validUser.password);
    await expect(secureAreaPage.heading).toBeVisible();

    // Observed on the live site: /login renders normally and the session is kept.
    await loginPage.open();
    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.heading).toBeVisible();

    await secureAreaPage.open();
    await expect(page).toHaveURL(/\/secure$/);
    await expect(secureAreaPage.heading).toBeVisible();
  });
});
