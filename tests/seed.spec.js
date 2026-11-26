// @ts-check
// Seed test for Playwright Test Agents (planner, generator, healer).
// The agents run this test to prepare the browser, then use it as the
// template for every generated test. It shows the project conventions:
// JavaScript, the custom fixtures, and page objects instead of raw selectors.
const { test, expect } = require('../fixtures/fixtures');

test.describe('Seed', () => {
  test('seed', async ({ loginPage }) => {
    await loginPage.open();
    await expect(loginPage.heading).toBeVisible();
  });
});
