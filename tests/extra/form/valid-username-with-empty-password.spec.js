// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { validUser, messages } = require('../../../test-data/users');

test.describe('Login - extra scenarios', () => {
  test('Valid username with empty password', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(validUser.username, '');

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.flashMessage).toContainText(messages.invalidPassword);
  });
});
