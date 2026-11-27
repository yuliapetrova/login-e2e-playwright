// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { validUser } = require('../../../test-data/users');

test.describe('Login - extra scenarios', () => {
  test('Password field masks input', { tag: ['@regression'] }, async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.typePassword(validUser.password);

    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });
});
