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

    // Chromium and Firefox show a cached copy of /secure on Back. WebKit asks
    // the server instead and is redirected to /login straight away. Reloading
    // asks the server in every browser. The "You must login" message is shown
    // only once, so it is gone after the reload in WebKit and is not asserted.
    await page.goBack();
    await page.reload();

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.heading).toBeVisible();
    await expect(secureAreaPage.heading).toBeHidden();
  });
});
