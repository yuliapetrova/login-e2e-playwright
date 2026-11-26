// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { validUser, messages } = require('../../../test-data/users');

test.describe('Login - extra scenarios', () => {
  test('Secure area is inaccessible after logout', async ({ page, loginPage, secureAreaPage }) => {
    await loginPage.open();
    await loginPage.login(validUser.username, validUser.password);
    await expect(secureAreaPage.heading).toBeVisible();
    await secureAreaPage.logout();
    await expect(loginPage.flashMessage).toContainText(messages.logoutSuccess);

    await secureAreaPage.open();

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.flashMessage).toContainText(messages.loginRequired);
  });
});
