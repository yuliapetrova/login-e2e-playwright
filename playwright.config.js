// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const isCI = !!process.env.CI;

// The seed test only prepares the browser for the Playwright Test Agents and
// adds no coverage, so normal runs skip it. The agents' MCP server sets
// PLAYWRIGHT_AGENTS in .mcp.json so they can still run it.
const runSeed = !!process.env.PLAYWRIGHT_AGENTS;
const seedTests = '**/seed.spec.js';

// API tests need no browser, so they run once in their own project.
const apiTests = '**/extra/api/**/*.spec.js';

// Browser projects skip the API tests, and the seed test unless the agents run.
const browserIgnore = runSeed ? [apiTests] : [apiTests, seedTests];

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
  // In CI, the GitHub reporter annotates failures on the code, and the JSON
  // and JUnit files feed the run summary and any other CI tooling.
  reporter: isCI
    ? [
        ['list'],
        ['github'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'reports/results.json' }],
        ['junit', { outputFile: 'reports/junit.xml' }],
      ]
    : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: process.env.BASE_URL || 'https://the-internet.herokuapp.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 20_000,
  },

  projects: [
    { name: 'api', testMatch: apiTests },
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testIgnore: browserIgnore },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testIgnore: browserIgnore },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testIgnore: browserIgnore },
  ],
});
