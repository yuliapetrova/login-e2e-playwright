// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { hostileInputs, invalidPassword, messages } = require('../../../test-data/users');

test.describe('Login - extra scenarios', () => {
  test('SQL injection-like input is rejected', async ({ page, loginPage, secureAreaPage }) => {
    await loginPage.open();
    await loginPage.login(hostileInputs.sqlInjection, invalidPassword);

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.flashMessage).toContainText(messages.invalidUsername);
    await expect(secureAreaPage.heading).toBeHidden();
  });
});
