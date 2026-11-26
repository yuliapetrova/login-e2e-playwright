// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { invalidUsername, invalidPassword, messages } = require('../../../test-data/users');

test.describe('Login - extra scenarios', () => {
  test('Dismiss flash message', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(invalidUsername, invalidPassword);
    await expect(loginPage.flashMessage).toContainText(messages.invalidUsername);

    await loginPage.dismissFlash();

    await expect(loginPage.flashMessage).toBeHidden();
    await expect(page).toHaveURL(/\/login$/);
  });
});
