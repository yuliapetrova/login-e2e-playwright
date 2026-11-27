// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { validUser, invalidUsername, invalidPassword } = require('../../../test-data/users');
const { endpoints, statusCodes } = require('../../../test-data/api');

/**
 * Path of a redirect target, taken from the Location header.
 * @param {import('@playwright/test').APIResponse} response
 */
const redirectPath = (response) => new URL(response.headers()['location']).pathname;

test.describe('Login - API status codes', () => {
  test('Login page returns 200', { tag: ['@api', '@regression'] }, async ({ authApi }) => {
    const response = await authApi.openLogin();

    expect(response.status()).toBe(statusCodes.ok);
  });

  test(
    'Valid credentials answer 303 to the secure area',
    { tag: ['@api', '@regression'] },
    async ({ authApi }) => {
      const response = await authApi.authenticate(validUser.username, validUser.password);

      expect(response.status()).toBe(statusCodes.seeOther);
      expect(redirectPath(response)).toBe(endpoints.secure);
    },
  );

  test(
    'Invalid username answers 303 back to login',
    { tag: ['@api', '@regression'] },
    async ({ authApi }) => {
      const response = await authApi.authenticate(invalidUsername, validUser.password);

      expect(response.status()).toBe(statusCodes.seeOther);
      expect(redirectPath(response)).toBe(endpoints.login);
    },
  );

  test(
    'Invalid password answers 303 back to login',
    { tag: ['@api', '@regression'] },
    async ({ authApi }) => {
      const response = await authApi.authenticate(validUser.username, invalidPassword);

      expect(response.status()).toBe(statusCodes.seeOther);
      expect(redirectPath(response)).toBe(endpoints.login);
    },
  );

  test('Secure area returns 200 when logged in', { tag: ['@api', '@regression'] }, async ({ authApi }) => {
    await authApi.authenticate(validUser.username, validUser.password);

    const response = await authApi.openSecure();

    expect(response.status()).toBe(statusCodes.ok);
  });

  test(
    'Secure area answers 302 to login when logged out',
    { tag: ['@api', '@regression'] },
    async ({ authApi }) => {
      const response = await authApi.openSecure();

      expect(response.status()).toBe(statusCodes.found);
      expect(redirectPath(response)).toBe(endpoints.login);
    },
  );

  test(
    'Logout answers 302 to login and ends the session',
    { tag: ['@api', '@regression'] },
    async ({ authApi }) => {
      await authApi.authenticate(validUser.username, validUser.password);

      const logout = await authApi.logout();
      expect(logout.status()).toBe(statusCodes.found);
      expect(redirectPath(logout)).toBe(endpoints.login);

      const secure = await authApi.openSecure();
      expect(secure.status()).toBe(statusCodes.found);
      expect(redirectPath(secure)).toBe(endpoints.login);
    },
  );
});
