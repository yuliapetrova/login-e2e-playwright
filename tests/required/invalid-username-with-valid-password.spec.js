// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../fixtures/fixtures');
const { validUser, invalidUsername, messages } = require('../../test-data/users');

test.describe('Login - required scenarios', () => {
  test('Invalid username with valid password', async ({ page, loginPage, secureAreaPage }) => {
    await loginPage.open();
    await expect(loginPage.heading).toBeVisible();

    await loginPage.login(invalidUsername, validUser.password);

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.flashMessage).toContainText(messages.invalidUsername);
    await expect(loginPage.loginButton).toBeVisible();
    await expect(secureAreaPage.heading).toBeHidden();
  });
});
