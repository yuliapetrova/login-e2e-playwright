// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { validUser } = require('../../../test-data/users');
const { endpoints, statusCodes } = require('../../../test-data/api');

test.describe('Login - extra scenarios', () => {
  test(
    'Login request answers 303 to the secure area',
    { tag: ['@regression'] },
    async ({ page, loginPage, secureAreaPage }) => {
      await loginPage.open();

      const authenticate = loginPage.waitForAuthenticateResponse();
      await loginPage.login(validUser.username, validUser.password);
      const response = await authenticate;

      expect(response.status()).toBe(statusCodes.seeOther);
      expect(new URL(response.headers()['location']).pathname).toBe(endpoints.secure);
      await expect(page).toHaveURL(secureAreaPage.urlPattern);
      await expect(secureAreaPage.heading).toBeVisible();
    },
  );
});
