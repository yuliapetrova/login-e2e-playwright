// @ts-check
const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { SecureAreaPage } = require('../pages/SecureAreaPage');
const { AuthApi } = require('../api/AuthApi');

/**
 * Custom fixtures that hand ready-made page objects and the API client
 * to each test.
 * Every test gets a fresh browser context, so tests share no state
 * and can run in any order or in parallel.
 *
 * @typedef {{ loginPage: LoginPage, secureAreaPage: SecureAreaPage, authApi: AuthApi }} PageFixtures
 */
const test = base.test.extend(
  /** @type {import('@playwright/test').Fixtures<PageFixtures>} */ ({
    loginPage: async ({ page }, use) => {
      await use(new LoginPage(page));
    },
    secureAreaPage: async ({ page }, use) => {
      await use(new SecureAreaPage(page));
    },
    authApi: async ({ request }, use) => {
      await use(new AuthApi(request));
    },
  }),
);

module.exports = { test, expect: base.expect };
