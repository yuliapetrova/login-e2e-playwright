// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const isCI = !!process.env.CI;

/**
 * Playwright configuration.
 * See https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  // The demo site is hosted on Heroku and can be slow, so allow retries in CI only.
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: process.env.BASE_URL || 'https://the-internet.herokuapp.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 20_000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
