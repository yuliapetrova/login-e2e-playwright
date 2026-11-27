// @ts-check
const base = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');
const { LoginPage } = require('../pages/LoginPage');
const { SecureAreaPage } = require('../pages/SecureAreaPage');
const { AuthApi } = require('../api/AuthApi');
const { validUser } = require('../test-data/users');
const { endpoints, statusCodes } = require('../test-data/api');
const { wcagTags } = require('../test-data/accessibility');

/**
 * Custom fixtures that hand ready-made page objects, the API client and
 * helpers to each test. Every test gets a fresh browser context, so tests
 * share no state and can run in any order or in parallel.
 *
 * @typedef {{
 *   loginPage: LoginPage,
 *   secureAreaPage: SecureAreaPage,
 *   authApi: AuthApi,
 *   loginViaApi: (user?: { username: string, password: string }) => Promise<void>,
 *   makeAxeBuilder: () => AxeBuilder,
 * }} PageFixtures
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
    // Logs in over HTTP through the page's own request context, so the
    // session cookie is shared with the browser. Tests that only need a
    // logged-in starting point use this instead of the login form, which
    // TC1 already covers.
    loginViaApi: async ({ page }, use) => {
      await use(async (user = validUser) => {
        await base.test.step(`Log in as "${user.username}" through the API`, async () => {
          const response = await new AuthApi(page.request).authenticate(user.username, user.password);
          base.expect(response.status()).toBe(statusCodes.seeOther);
          base.expect(new URL(response.headers()['location']).pathname).toBe(endpoints.secure);
        });
      });
    },
    // Accessibility scanner limited to the WCAG 2.1 A and AA rules.
    makeAxeBuilder: async ({ page }, use) => {
      await use(() => new AxeBuilder({ page }).withTags(wcagTags));
    },
  }),
);

module.exports = { test, expect: base.expect };
