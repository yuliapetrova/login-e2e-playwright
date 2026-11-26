// @ts-check
const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { SecureAreaPage } = require('../pages/SecureAreaPage');

/**
 * Custom fixtures that hand ready-made page objects to each test.
 * Every test gets a fresh browser context, so tests share no state
 * and can run in any order or in parallel.
 *
 * @typedef {{ loginPage: LoginPage, secureAreaPage: SecureAreaPage }} PageFixtures
 */
const test = base.test.extend(
  /** @type {import('@playwright/test').Fixtures<PageFixtures>} */ ({
    loginPage: async ({ page }, use) => {
      await use(new LoginPage(page));
    },
    secureAreaPage: async ({ page }, use) => {
      await use(new SecureAreaPage(page));
    },
  }),
);

module.exports = { test, expect: base.expect };
