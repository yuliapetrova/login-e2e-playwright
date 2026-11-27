// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../fixtures/fixtures');
const { validUser, messages, invalidUsername } = require('../../test-data/users');

test.describe('Login - required scenarios', () => {
  test(
    'TC2 Invalid username with valid password is rejected',
    { tag: ['@smoke'] },
    async ({ page, loginPage, secureAreaPage }) => {
      await loginPage.open();
      await expect(loginPage.heading).toBeVisible();

      await loginPage.login(invalidUsername, validUser.password);

      await expect(page).toHaveURL(loginPage.urlPattern);
      await expect.soft(loginPage.flashMessage).toContainText(messages.invalidUsername);
      await expect.soft(loginPage.loginButton).toBeVisible();
      await expect.soft(secureAreaPage.heading).toBeHidden();
    },
  );
});
