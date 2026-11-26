// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { messages } = require('../../../test-data/users');

test.describe('Login - extra scenarios', () => {
  test('Empty username and empty password', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login('', '');

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.flashMessage).toContainText(messages.invalidUsername);
  });
});
