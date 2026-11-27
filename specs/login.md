# Login Feature Test Plan

## Application Overview

Test plan for the login feature of https://the-internet.herokuapp.com/login: the login page, the secure area (/secure) it leads to, and logout. Valid credentials: tomsmith / SuperSecretPassword!.

Conventions for every test generated from this plan:

- JavaScript (CommonJS), never TypeScript. Files are *.spec.js and start with `// @ts-check`.
- Import `test` and `expect` from fixtures/fixtures.js, never from @playwright/test.
- Use the `loginPage` and `secureAreaPage` fixtures (pages/LoginPage.js, pages/SecureAreaPage.js, pages/BasePage.js). No raw selectors in tests; missing elements or actions are added to the page objects (flashMessage, dismissFlash, usernameInput, passwordInput, loginButton, login, loginWithEnter, heading, welcomeText, logoutButton, logout).
- Credentials (validUser), invalid values, hostile inputs (hostileInputs.sqlInjection, hostileInputs.xss) and expected messages (messages.loginSuccess, invalidUsername, invalidPassword, logoutSuccess, loginRequired) come from test-data/users.js. Nothing is hardcoded in tests.
- Web-first assertions only (await expect(locator)...). No waitForTimeout, no networkidle.
- Every test is independent and starts from a fresh state (fresh browser context, not logged in).
- Each generated test keeps the header comments `// spec: specs/login.md` and `// seed: tests/seed.spec.js`.
- Seed file: tests/seed.spec.js. Required tests go in tests/required/, extra tests in tests/extra/.

Observed on the live site during exploration: any failed login stays on /login with a flash message; message is "Your username is invalid!" when the username is unknown/empty/altered, and "Your password is invalid!" when the username is exactly tomsmith but the password is wrong or empty. Password input has type=password. Unauthenticated /secure redirects to /login with "You must login to view the secure area!". The flash message is removed from the DOM shortly after its close control is clicked (short animation, so use auto-retrying assertions).

## Test Scenarios

### 1. Login - required scenarios

**Seed:** `tests/seed.spec.js`

#### 1.1. TC1 Successful login with valid username and password

**File:** `tests/required/successful-login-with-valid-credentials.spec.js`

**Steps:**

1. Open /login via loginPage.open() - expect: Login Page heading is visible
2. Call loginPage.login(validUser.username, validUser.password) - expect: URL is /secure - expect: Flash message contains messages.loginSuccess - expect: secureAreaPage.heading and welcomeText are visible - expect: secureAreaPage.logoutButton is visible

#### 1.2. TC2 Invalid username with valid password is rejected

**File:** `tests/required/invalid-username-with-valid-password.spec.js`

**Steps:**

1. Open /login and call loginPage.login(invalidUsername, validUser.password) - expect: URL remains /login - expect: Flash message contains messages.invalidUsername - expect: Login form is still visible - expect: Logout link is not present

#### 1.3. TC3 Valid username with invalid password is rejected

**File:** `tests/required/valid-username-with-invalid-password.spec.js`

**Steps:**

1. Open /login and call loginPage.login(validUser.username, invalidPassword) - expect: URL remains /login - expect: Flash message contains messages.invalidPassword - expect: Login form is still visible - expect: Logout link is not present

### 2. Login - extra scenarios

**Seed:** `tests/seed.spec.js`

#### 2.1. Empty username and empty password

**File:** `tests/extra/form/empty-username-and-empty-password.spec.js`

**Steps:**

1. Open /login, leave both fields empty, click Login - expect: URL remains /login - expect: Flash message contains messages.invalidUsername (observed: username message, not a password message)

#### 2.2. Valid username with empty password

**File:** `tests/extra/form/valid-username-with-empty-password.spec.js`

**Steps:**

1. Open /login, login with validUser.username and an empty password - expect: URL remains /login - expect: Flash message contains messages.invalidPassword

#### 2.3. Empty username with valid password

**File:** `tests/extra/form/empty-username-with-valid-password.spec.js`

**Steps:**

1. Open /login, login with an empty username and validUser.password - expect: URL remains /login - expect: Flash message contains messages.invalidUsername

#### 2.4. Username is case sensitive

**File:** `tests/extra/form/username-is-case-sensitive.spec.js`

**Steps:**

1. Open /login, login with validUser.username upper-cased and validUser.password - expect: URL remains /login - expect: Flash message contains messages.invalidUsername or messages.invalidPassword (the live site answered with the password message on 2026-11-26 and the username message from 2026-11-27, so either is accepted) - expect: Not logged in

#### 2.5. Password is case sensitive

**File:** `tests/extra/form/password-is-case-sensitive.spec.js`

**Steps:**

1. Open /login, login with validUser.username and validUser.password lower-cased - expect: URL remains /login - expect: Flash message contains messages.invalidPassword

#### 2.6. Username with leading and trailing whitespace is rejected

**File:** `tests/extra/form/username-with-leading-and-trailing-whitespace-is-rejected.spec.js`

**Steps:**

1. Open /login, login with ' ' + validUser.username + ' ' and validUser.password - expect: URL remains /login - expect: Flash message contains messages.invalidUsername (observed) - expect: Not logged in

#### 2.7. Password field masks input

**File:** `tests/extra/form/password-field-masks-input.spec.js`

**Steps:**

1. Open /login and fill the password field with validUser.password - expect: passwordInput has attribute type=password - expect: Typed value is not shown as plain text

#### 2.8. Submit login with Enter key

**File:** `tests/extra/form/submit-login-with-enter-key.spec.js`

**Steps:**

1. Open /login and call loginPage.loginWithEnter(validUser.username, validUser.password) - expect: URL is /secure - expect: Flash message contains messages.loginSuccess - expect: Secure Area heading is visible

#### 2.9. Dismiss flash message

**File:** `tests/extra/form/dismiss-flash-message.spec.js`

**Steps:**

1. Trigger a failed login so the flash message is shown - expect: Flash message is visible
2. Call loginPage.dismissFlash() (click the x control) - expect: Flash message is hidden (removed from the page; use auto-retrying toBeHidden because of a short close animation) - expect: Login form remains usable

#### 2.10. SQL injection-like input is rejected

**File:** `tests/extra/security/sql-injection-like-input-is-rejected.spec.js`

**Steps:**

1. Open /login, login with hostileInputs.sqlInjection as username and any non-valid password - expect: URL remains /login - expect: Flash message contains messages.invalidUsername - expect: Not logged in
2. Repeat with hostileInputs.sqlInjection as the password and valid username - expect: Flash message contains messages.invalidPassword (optional variant)

#### 2.11. XSS-like input is rejected and not executed

**File:** `tests/extra/security/xss-like-input-is-rejected-and-not-executed.spec.js`

**Steps:**

1. Register a page 'dialog' listener that records any dialog, then login with hostileInputs.xss as username and a non-valid password - expect: URL remains /login - expect: Flash message contains messages.invalidUsername - expect: No alert dialog was raised - expect: Script text is not rendered as an active element in the flash message

#### 2.12. Logout returns to login with confirmation message

**File:** `tests/extra/session/logout-returns-to-login-with-confirmation-message.spec.js`

**Steps:**

1. Log in with validUser, then call secureAreaPage.logout() - expect: URL is /login - expect: Flash message contains messages.logoutSuccess - expect: Login form is visible

#### 2.13. Accessing /secure while logged out redirects to login

**File:** `tests/extra/session/accessing-secure-while-logged-out-redirects-to-login.spec.js`

**Steps:**

1. In a fresh context, open /secure via secureAreaPage.open() - expect: URL is /login - expect: Flash message contains messages.loginRequired - expect: Secure Area heading is not shown

#### 2.14. Secure area is inaccessible after logout

**File:** `tests/extra/session/secure-area-is-inaccessible-after-logout.spec.js`

**Steps:**

1. Log in, log out, then open /secure - expect: URL is /login - expect: Flash message contains messages.loginRequired

#### 2.15. Back button after logout does not allow new secure actions

**File:** `tests/extra/session/back-button-after-logout-does-not-allow-new-secure-actions.spec.js`

**Steps:**

1. Log in, log out, then navigate back in history - expect: Observed: Chromium and Firefox show a cached /secure page (heading visible); WebKit asks the server and lands on /login with messages.loginRequired. Neither is asserted.
2. Reload the page - expect: URL is /login - expect: Login Page heading is visible - expect: Secure Area heading is not visible - note: messages.loginRequired is shown only once, so after the reload it is present in Chromium and Firefox but not in WebKit, and is not asserted

#### 2.16. Session persists on reload of /secure

**File:** `tests/extra/session/session-persists-on-reload-of-secure.spec.js`

**Steps:**

1. Log in, then reload the page - expect: URL stays /secure - expect: Secure Area heading and Logout link are visible

#### 2.17. Visiting /login while logged in still shows login page

**File:** `tests/extra/session/visiting-login-while-logged-in-still-shows-login-page.spec.js`

**Steps:**

1. Log in, then open /login via loginPage.open() - expect: URL is /login (no redirect) - expect: Normal login form (username, password, Login button) is visible
2. Open /secure afterwards - expect: URL is /secure and Secure Area heading is visible (session is still active)

### 3. Login - API status codes

**Seed:** `tests/seed.spec.js`

Checked at the HTTP level with the `authApi` fixture, which never follows redirects. Endpoints and codes come from `test-data/api.js`. All tests live in `tests/extra/api/auth-status-codes.spec.js`. Each test starts with fresh cookies.

#### 3.1. Login page returns 200

1. GET /login - expect: status 200

#### 3.2. Valid credentials answer 303 to the secure area

1. POST /authenticate with validUser - expect: status 303 - expect: Location path is /secure

#### 3.3. Invalid username answers 303 back to login

1. POST /authenticate with invalidUsername and validUser.password - expect: status 303 - expect: Location path is /login

#### 3.4. Invalid password answers 303 back to login

1. POST /authenticate with validUser.username and invalidPassword - expect: status 303 - expect: Location path is /login

#### 3.5. Secure area returns 200 when logged in

1. POST /authenticate with validUser, then GET /secure - expect: status 200

#### 3.6. Secure area answers 302 to login when logged out

1. GET /secure with no session - expect: status 302 - expect: Location path is /login

#### 3.7. Logout answers 302 to login and ends the session

1. Log in, then GET /logout - expect: status 302 - expect: Location path is /login
2. GET /secure - expect: status 302 - expect: Location path is /login

### 4. Login - network check in the UI

#### 4.1. Login request answers 303 to the secure area

**File:** `tests/extra/session/login-request-answers-303-to-secure.spec.js`

**Steps:**

1. Open /login, start waiting for the POST /authenticate response with loginPage.waitForAuthenticateResponse(), then log in with validUser - expect: status 303 - expect: Location path is /secure - expect: URL is /secure and Secure Area heading is visible
