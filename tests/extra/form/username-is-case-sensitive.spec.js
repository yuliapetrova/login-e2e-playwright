// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { validUser, messages } = require('../../../test-data/users');

test.describe('Login - extra scenarios', () => {
  test('Username is case sensitive', async ({ page, loginPage, secureAreaPage }) => {
    await loginPage.open();
    await loginPage.login(validUser.username.toUpperCase(), validUser.password);

    // Observed on the live site: the username lookup ignores case, but the
    // login is still refused and the site reports the password as invalid.
    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.flashMessage).toContainText(messages.invalidPassword);
    await expect(secureAreaPage.heading).toBeHidden();
  });
});
