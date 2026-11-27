// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../fixtures/fixtures');
const { validUser, messages } = require('../../test-data/users');

test.describe('Login - required scenarios', () => {
  test(
    'TC1 Successful login with valid username and password',
    { tag: ['@smoke'] },
    async ({ page, loginPage, secureAreaPage }) => {
      await loginPage.open();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();

      await loginPage.login(validUser.username, validUser.password);

      await expect(page).toHaveURL(secureAreaPage.urlPattern);
      // Soft checks report every missing piece of the secure area, not just the first.
      await expect.soft(secureAreaPage.flashMessage).toContainText(messages.loginSuccess);
      await expect.soft(secureAreaPage.heading).toBeVisible();
      await expect.soft(secureAreaPage.welcomeText).toBeVisible();
      await expect.soft(secureAreaPage.logoutButton).toBeVisible();
    },
  );
});
