// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { validUser } = require('../../../test-data/users');

test.describe('Login - accessibility', () => {
  test(
    'Login page has no WCAG A or AA violations',
    { tag: ['@regression', '@a11y'] },
    async ({ loginPage, makeAxeBuilder }) => {
      await loginPage.open();
      await expect(loginPage.heading).toBeVisible();

      const results = await makeAxeBuilder().analyze();

      expect(results.violations).toEqual([]);
    },
  );

  test(
    'Login page with an error message has no WCAG A or AA violations',
    { tag: ['@regression', '@a11y'] },
    async ({ loginPage, makeAxeBuilder }) => {
      await loginPage.open();
      await loginPage.login(validUser.username, '');
      await expect(loginPage.flashMessage).toBeVisible();

      const results = await makeAxeBuilder().analyze();

      expect(results.violations).toEqual([]);
    },
  );

  test(
    'Secure area has no WCAG A or AA violations',
    { tag: ['@regression', '@a11y'] },
    async ({ loginViaApi, secureAreaPage, makeAxeBuilder }) => {
      await loginViaApi();
      await secureAreaPage.open();
      await expect(secureAreaPage.heading).toBeVisible();

      const results = await makeAxeBuilder().analyze();

      expect(results.violations).toEqual([]);
    },
  );
});
