# SDET Take-Home: Login Test Automation

Automated UI tests for the login page of
[the-internet.herokuapp.com](https://the-internet.herokuapp.com/login),
built with [Playwright](https://playwright.dev/) and JavaScript.

[![Playwright Tests](https://github.com/yuliapetrova/login-e2e-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/yuliapetrova/login-e2e-playwright/actions/workflows/playwright.yml)

**Latest test report:** https://yuliapetrova.github.io/login-e2e-playwright/

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (developed on Node 22)
- npm (comes with Node.js)
- Internet access to reach the application under test

## Setup

```bash
git clone <repository-url>
cd login-e2e-playwright
npm ci
npx playwright install
```

`npx playwright install` downloads the Chromium, Firefox and WebKit browsers.

## Running the tests

| Command                 | What it does                                             |
| ----------------------- | -------------------------------------------------------- |
| `npm test`              | Runs every test in Chromium, Firefox and WebKit          |
| `npm run test:required` | Runs only the three required test cases                  |
| `npm run test:extra`    | Runs only the additional test cases                      |
| `npm run test:chromium` | Runs every test in Chromium only                         |
| `npm run test:headed`   | Runs in Chromium with a visible browser window           |
| `npm run test:shuffle`  | Repeats each test 3 times in parallel to check stability |
| `npm run report`        | Opens the HTML report from the last run                  |
| `npm run lint`          | Checks the code with ESLint and formatting with Prettier |
| `npm run lint:fix`      | Fixes lint and formatting problems where it can          |
| `npm run format`        | Formats the code with Prettier                           |

A single test can be run by name, for example:

```bash
npx playwright test -g "TC1"
```

### Configuration

| Variable         | Default                              | Purpose                |
| ---------------- | ------------------------------------ | ---------------------- |
| `BASE_URL`       | `https://the-internet.herokuapp.com` | Application under test |
| `LOGIN_USERNAME` | `tomsmith`                           | Valid username         |
| `LOGIN_PASSWORD` | `SuperSecretPassword!`               | Valid password         |

## Project structure

```
login-e2e-playwright/
├── pages/                    Page objects
│   ├── BasePage.js           Shared navigation and flash message locator
│   ├── LoginPage.js          /login page
│   └── SecureAreaPage.js     /secure page shown after login
├── api/
│   └── AuthApi.js            HTTP client for status code checks
├── fixtures/
│   └── fixtures.js           Injects page objects and the API client into tests
├── test-data/
│   ├── users.js              Credentials, hostile inputs and expected messages
│   └── api.js                Endpoints and expected status codes
├── specs/
│   └── login.md              Test plan the tests are built from
├── tests/
│   ├── seed.spec.js          Starting point for the Playwright agents
│   ├── required/             The three test cases from the assignment
│   └── extra/                Additional coverage beyond the assignment
├── .github/workflows/        GitHub Actions pipeline
├── playwright.config.js      Browsers, timeouts, retries, reporting
└── eslint.config.js          Lint rules
```

## Test cases

### Required (`tests/required`)

| ID  | Scenario                         | Checks                                                                   |
| --- | -------------------------------- | ------------------------------------------------------------------------ |
| TC1 | Valid username and password      | Redirect to `/secure`, success message, Secure Area heading, Logout link |
| TC2 | Invalid username, valid password | "Your username is invalid!" error, user stays on `/login`                |
| TC3 | Valid username, invalid password | "Your password is invalid!" error, user stays on `/login`                |

### Extra (`tests/extra`)

- **Form behaviour (`form/`).** Empty fields, wrong letter case and surrounding spaces are rejected with the right message. The password field masks input, the form submits with the Enter key, and the flash message can be closed.
- **Hostile input (`security/`).** SQL injection and XSS style inputs are rejected, and the script never runs.
- **Session behaviour (`session/`).** Logout returns to the login page. The secure area is not reachable before login, after logout, or by pressing Back after logout. The session survives a reload. The login request answers 303 to the secure area.
- **API status codes (`api/`).** Without a browser, each endpoint returns the expected code and redirect target:

| Request                             | Code | Redirects to |
| ----------------------------------- | ---- | ------------ |
| Open `/login`                       | 200  |              |
| Submit valid credentials            | 303  | `/secure`    |
| Submit invalid username or password | 303  | `/login`     |
| Open `/secure` while logged in      | 200  |              |
| Open `/secure` while logged out     | 302  | `/login`     |
| Log out                             | 302  | `/login`     |

A failed login answers 303, not 401. The form follows the post/redirect/get pattern, so this is expected, and the tests pin it down.

`tests/seed.spec.js` is not part of the coverage, so normal runs skip it. The Playwright Test Agents run it to set up the browser and copy its conventions when they plan, generate or fix tests. Their MCP server sets `PLAYWRIGHT_AGENTS=1` in `.mcp.json`, which brings the seed test back into scope. To run it by hand, use `PLAYWRIGHT_AGENTS=1 npx playwright test tests/seed.spec.js`.

## Design decisions

- **Page Object Model.** Selectors and page actions live in page classes, so a UI change is fixed in one place and tests read like test steps.
- **Accessible locators.** Elements are found by role and label, the way a user finds them. This is Playwright's recommended approach and is more stable than CSS paths.
- **Fixtures for page objects.** Tests receive ready page objects as arguments. This removes setup boilerplate and is the idiomatic Playwright way to share setup.
- **Independent tests.** Each test gets a fresh browser context and logs in on its own. Tests run fully in parallel and in any order.
- **Web-first assertions.** All checks use Playwright's auto-retrying `expect`, never fixed waits. This keeps the tests stable when the Heroku host is slow.
- **Several checks per scenario.** A login is judged by URL, message text, message type and page content together, so a partial failure is not missed.
- **API checks next to UI checks.** Status codes are asserted at the HTTP level, where they are fast and precise. One UI test also watches the real login request, tying the browser flow to the server's answer. Error responses are not mocked, because the site has no client-side error handling to exercise.
- **Externalised data and config.** Credentials and expected messages live in one data file and can be overridden with environment variables.
- **Debugging support.** Failed tests keep a screenshot and video. Retried tests in CI keep a full trace.
- **CI.** GitHub Actions lints the code and runs all tests in three browsers on every push and pull request. Each run on `main` publishes the HTML report to GitHub Pages, including when tests fail.

## Extending this for a larger project

- Log in through an API call or saved storage state, so tests that need a logged-in user skip the UI login.
- Tag tests such as `@smoke` and `@regression`, and run different sets at different pipeline stages.
- Add per-environment config files for dev, staging and production.
- Shard the suite across CI machines as it grows.
- Load secrets from the CI secret store instead of defaults in code.
- Add accessibility checks with axe-core and visual comparison with Playwright screenshots.
- Move to TypeScript for type safety as the codebase and team grow.
