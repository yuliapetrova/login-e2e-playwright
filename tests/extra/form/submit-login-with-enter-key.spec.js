// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { validUser, messages } = require('../../../test-data/users');

test.describe('Login - extra scenarios', () => {
  test('Submit login with Enter key', async ({ page, loginPage, secureAreaPage }) => {
    await loginPage.open();
    await loginPage.loginWithEnter(validUser.username, validUser.password);

    await expect(page).toHaveURL(/\/secure$/);
    await expect(secureAreaPage.flashMessage).toContainText(messages.loginSuccess);
  });
});
