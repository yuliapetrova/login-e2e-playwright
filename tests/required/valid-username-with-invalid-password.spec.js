// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../fixtures/fixtures');
const { validUser, invalidPassword, messages } = require('../../test-data/users');

test.describe('Login - required scenarios', () => {
  test('Valid username with invalid password', async ({ page, loginPage, secureAreaPage }) => {
    await loginPage.open();
    await expect(loginPage.heading).toBeVisible();

    await loginPage.login(validUser.username, invalidPassword);

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.flashMessage).toContainText(messages.invalidPassword);
    await expect(loginPage.loginButton).toBeVisible();
    await expect(secureAreaPage.heading).toBeHidden();
  });
});
