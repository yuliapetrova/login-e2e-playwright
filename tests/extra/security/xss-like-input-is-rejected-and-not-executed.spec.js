// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { hostileInputs, invalidPassword, messages } = require('../../../test-data/users');

test.describe('Login - extra scenarios', () => {
  test('XSS-like input is rejected and not executed', async ({ page, loginPage }) => {
    /** @type {string[]} */
    const dialogs = [];
    page.on('dialog', async (dialog) => {
      dialogs.push(dialog.message());
      await dialog.dismiss();
    });

    await loginPage.open();
    await loginPage.login(hostileInputs.xss, invalidPassword);

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.flashMessage).toContainText(messages.invalidUsername);
    await expect(loginPage.flashMessage).not.toContainText(hostileInputs.xss);
    expect(dialogs).toEqual([]);
  });
});
