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

| Command                   | What it does                                                    |
| ------------------------- | --------------------------------------------------------------- |
| `npm test`                | Runs every test: API tests once, UI tests in all three browsers |
| `npm run test:required`   | Runs only the three required test cases                         |
| `npm run test:extra`      | Runs only the additional test cases                             |
| `npm run test:chromium`   | Runs the API tests and the UI tests in Chromium only            |
| `npm run test:smoke`      | Runs tests tagged `@smoke`: the three required cases            |
| `npm run test:regression` | Runs tests tagged `@regression`: all additional coverage        |
| `npm run test:api`        | Runs only the API status code tests, without a browser          |
| `npm run test:a11y`       | Runs only the accessibility checks                              |
| `npm run test:headed`     | Runs in Chromium with a visible browser window                  |
| `npm run test:shuffle`    | Repeats each test 3 times in parallel to check stability        |
| `npm run report`          | Opens the HTML report from the last run                         |
| `npm run lint`            | Checks the code with ESLint and formatting with Prettier        |
| `npm run lint:fix`        | Fixes lint and formatting problems where it can                 |
| `npm run format`          | Formats the code with Prettier                                  |

A single test can be run by name, for example:

```bash
npx playwright test -g "TC1"
```

A pre-commit hook lints and formats staged files, so style problems never reach CI. `npm ci` installs it.

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
│   ├── BasePage.js           Navigation, URL pattern, flash message, named steps
│   ├── LoginPage.js          /login page
│   └── SecureAreaPage.js     /secure page shown after login
├── api/
│   └── AuthApi.js            HTTP client for status codes and API login
├── fixtures/
│   └── fixtures.js           Page objects, API client, API login, accessibility scanner
├── test-data/
│   ├── users.js              Credentials, hostile inputs, messages, invalid login table
│   ├── api.js                Endpoints and expected status codes
│   └── accessibility.js      WCAG rule sets to check
├── specs/
│   └── login.md              Test plan the tests are built from
├── tests/
│   ├── seed.spec.js          Starting point for the Playwright agents
│   ├── required/             The three test cases from the assignment
│   └── extra/                Additional coverage beyond the assignment
├── scripts/
│   └── ci-summary.js         Results table for the GitHub Actions run page
├── .github/
│   ├── workflows/            CI pipeline and report publishing
│   └── dependabot.yml        Weekly dependency update pull requests
├── .husky/pre-commit         Lints staged files before each commit
├── playwright.config.js      Projects, timeouts, retries, reporters
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

All additional tests are tagged `@regression`.

- **Form behaviour (`form/`).** One data-driven test refuses seven invalid logins: empty fields, wrong letter case, surrounding spaces and an SQL injection style input. Each case is a row in `test-data/users.js`, so adding a case means adding a row. Other tests check that the password field masks input, the form submits with the Enter key, and the flash message can be closed.
- **Hostile input (`security/`).** An XSS style input is rejected, and the script never runs.
- **Session behaviour (`session/`).** Logout returns to the login page. The secure area is not reachable before login, after logout, or by pressing Back after logout. The session survives a reload. The login request answers 303 to the secure area.
- **Accessibility (`accessibility/`).** The login page, the login page with an error, and the secure area have no WCAG 2.1 A or AA violations, checked with axe-core. Tagged `@a11y`.
- **API status codes (`api/`).** Without a browser, each endpoint returns the expected code and redirect target. Tagged `@api`:

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
- **Readable reports.** Page-object actions run as named steps, such as "Log in as tomsmith", so the HTML report and traces read like the test plan. Step titles never show the password.
- **URLs owned by page objects.** Each page object exposes a URL pattern built from the endpoint list, so no test hardcodes a path.
- **API login for setup.** Tests that only need a logged-in starting point log in over HTTP, which shares the session cookie with the browser. The form login stays covered by TC1, and the session tests run faster.
- **Data-driven negative cases.** Invalid logins live in one table, which keeps one test body for seven cases and makes the expected message for each case easy to review.
- **Tags.** `@smoke` marks the required cases and `@regression` the rest, with `@api` and `@a11y` for those groups, so CI or a developer can run any subset.
- **Independent tests.** Each test gets a fresh browser context and logs in on its own. Tests run fully in parallel and in any order.
- **Web-first assertions.** All checks use Playwright's auto-retrying `expect`, never fixed waits. This keeps the tests stable when the Heroku host is slow.
- **Several checks per scenario, reported together.** A login is judged by URL, message text and page content. After the key check, the rest are soft assertions, so a report shows every missing piece at once.
- **API checks next to UI checks.** Status codes are asserted at the HTTP level, where they are fast and precise. One UI test also watches the real login request, tying the browser flow to the server's answer. Error responses are not mocked, because the site has no client-side error handling to exercise.
- **Externalised data and config.** Credentials and expected messages live in one data file and can be overridden with environment variables.
- **Debugging support.** Failed tests keep a screenshot and video. Retried tests in CI keep a full trace.
- **API tests run once.** They need no browser, so they have their own project instead of running in each browser.
- **CI.** GitHub Actions lints the code and runs all tests on every push, on every pull request, and nightly. The nightly run catches changes on the live demo site. Failures are annotated on the code, each run page shows a results table, and JUnit XML is kept for other tools. Each run on `main` publishes the HTML report to GitHub Pages, including when tests fail. Dependabot proposes dependency updates weekly.

## Extending this for a larger project

- Add per-environment config files for dev, staging and production.
- Shard the suite across CI machines as it grows, and merge the shard reports into one.
- Load secrets from the CI secret store instead of defaults in code.
- Keep a history of published reports per run instead of only the latest.
- Add visual comparison with Playwright screenshots against a stable environment.
- Move to TypeScript for type safety as the codebase and team grow.
