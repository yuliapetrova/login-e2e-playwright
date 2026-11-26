// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../fixtures/fixtures');
const { validUser, messages } = require('../../test-data/users');

test.describe('Login - required scenarios', () => {
  test('Successful login with valid credentials', async ({ page, loginPage, secureAreaPage }) => {
    await loginPage.open();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    await loginPage.login(validUser.username, validUser.password);

    await expect(page).toHaveURL(/\/secure$/);
    await expect(secureAreaPage.flashMessage).toContainText(messages.loginSuccess);
    await expect(secureAreaPage.heading).toBeVisible();
    await expect(secureAreaPage.welcomeText).toBeVisible();
    await expect(secureAreaPage.logoutButton).toBeVisible();
  });
});
