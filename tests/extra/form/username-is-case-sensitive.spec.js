// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { validUser, messages } = require('../../../test-data/users');

test.describe('Login - extra scenarios', () => {
  test('Username is case sensitive', async ({ page, loginPage, secureAreaPage }) => {
    await loginPage.open();
    await loginPage.login(validUser.username.toUpperCase(), validUser.password);

    // The live site has answered this case both ways: "Your password is
    // invalid!" on 2026-11-26 and "Your username is invalid!" from 2026-11-27.
    // Either error proves the login is refused, which is what this test checks.
    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.flashMessage).toContainText(
      new RegExp(`${messages.invalidUsername}|${messages.invalidPassword}`),
    );
    await expect(secureAreaPage.heading).toBeHidden();
  });
});
