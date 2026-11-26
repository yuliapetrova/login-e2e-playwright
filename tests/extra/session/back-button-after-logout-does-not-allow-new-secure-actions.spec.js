// @ts-check
// spec: specs/login.md
// seed: tests/seed.spec.js
const { test, expect } = require('../../../fixtures/fixtures');
const { validUser, messages } = require('../../../test-data/users');

test.describe('Login - extra scenarios', () => {
  test('Back button after logout does not allow new secure actions', async ({
    page,
    loginPage,
    secureAreaPage,
  }) => {
    await loginPage.open();
    await loginPage.login(validUser.username, validUser.password);
    await expect(secureAreaPage.heading).toBeVisible();
    await secureAreaPage.logout();
    await expect(loginPage.flashMessage).toContainText(messages.logoutSuccess);

    // Back may show a cached copy of /secure, so reload to ask the server.
    await page.goBack();
    await page.reload();

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.flashMessage).toContainText(messages.loginRequired);
    await expect(secureAreaPage.heading).toBeHidden();
  });
});
