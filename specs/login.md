# Login Feature Test Plan

## Application Overview

Test plan for https://the-internet.herokuapp.com/login, the secure area (/secure) and logout. Conventions: JavaScript CommonJS, *.spec.js starting with `// @ts-check`; import test/expect from fixtures/fixtures.js; use loginPage and secureAreaPage fixtures (no raw selectors in tests; add missing elements/actions to page objects); credentials (validUser, invalidUsername, invalidPassword) and messages (loginSuccess, invalidUsername, invalidPassword, logoutSuccess, loginRequired) come from test-data/users.js; web-first assertions only, no waitForTimeout/networkidle. Every scenario is independent and starts from a fresh browser context on /login. Seed: tests/seed.spec.js. Each generated test keeps the header comments `// spec: specs/login.md` and `// seed: tests/seed.spec.js`. Observed on live site: success -> /secure with 'You logged into a secure area!'; wrong username (incl. empty both, empty username, leading/trailing spaces, SQL/XSS-like) -> 'Your username is invalid!'; valid username with wrong/empty/wrong-case password, or upper-case username with valid password -> 'Your password is invalid!'; logout -> /login with 'You logged out of the secure area!'; anonymous /secure -> /login with 'You must login to view the secure area!'; password field type=password; Enter key submits.

## Test Scenarios

### 1. Login - required scenarios

**Seed:** `tests/seed.spec.js`

#### 1.1. Successful login with valid credentials

**File:** `tests/required/successful-login-with-valid-credentials.spec.js`

**Steps:**

1. Header: // spec: specs/login.md ; // seed: tests/seed.spec.js. Starting from fresh state, open /login (loginPage). - expect: Login page displays with username field, password field and Login button
2. Enter validUser.username and validUser.password, click Login. - expect: URL is /secure - expect: Flash message contains messages.loginSuccess - expect: Heading 'Secure Area' is visible - expect: Text 'Welcome to the Secure Area. When you are done click logout below.' is visible - expect: Logout button/link is visible

#### 1.2. Invalid username with valid password

**File:** `tests/required/invalid-username-with-valid-password.spec.js`

**Steps:**

1. Header: // spec: specs/login.md ; // seed: tests/seed.spec.js. Open /login from fresh state. - expect: Login form shown
2. Enter invalidUsername and validUser.password, click Login. - expect: URL remains /login - expect: Flash message contains messages.invalidUsername - expect: Login form still visible; no Secure Area content

#### 1.3. Valid username with invalid password

**File:** `tests/required/valid-username-with-invalid-password.spec.js`

**Steps:**

1. Header: // spec: specs/login.md ; // seed: tests/seed.spec.js. Open /login from fresh state. - expect: Login form shown
2. Enter validUser.username and invalidPassword, click Login. - expect: URL remains /login - expect: Flash message contains messages.invalidPassword - expect: Login form still visible; no Secure Area content

### 2. Login - extra scenarios

**Seed:** `tests/seed.spec.js`

#### 2.1. Empty username and empty password

**File:** `tests/extra/form/empty-username-and-empty-password.spec.js`

**Steps:**

1. Header: // spec: specs/login.md ; // seed: tests/seed.spec.js. Open /login, leave both fields empty, click Login. - expect: URL remains /login - expect: Flash message contains messages.invalidUsername

#### 2.2. Valid username with empty password

**File:** `tests/extra/form/valid-username-with-empty-password.spec.js`

**Steps:**

1. Open /login, enter validUser.username only, click Login. - expect: URL remains /login - expect: Flash message contains messages.invalidPassword

#### 2.3. Empty username with valid password

**File:** `tests/extra/form/empty-username-with-valid-password.spec.js`

**Steps:**

1. Open /login, enter validUser.password only, click Login. - expect: URL remains /login - expect: Flash message contains messages.invalidUsername

#### 2.4. Username is case sensitive

**File:** `tests/extra/form/username-is-case-sensitive.spec.js`

**Steps:**

1. Open /login, enter validUser.username in upper case with validUser.password, click Login. - expect: URL remains /login - expect: Flash message contains messages.invalidPassword (verified on the live site: the username lookup ignores case, but the login is still refused) - expect: Secure Area content is not visible

#### 2.5. Password is case sensitive

**File:** `tests/extra/form/password-is-case-sensitive.spec.js`

**Steps:**

1. Open /login, enter validUser.username and validUser.password in lower case, click Login. - expect: URL remains /login - expect: Flash message contains messages.invalidPassword

#### 2.6. Username with leading and trailing whitespace is rejected

**File:** `tests/extra/form/username-with-leading-and-trailing-whitespace-is-rejected.spec.js`

**Steps:**

1. Open /login, enter validUser.username surrounded by spaces with valid password, click Login. - expect: URL remains /login - expect: Flash message contains messages.invalidUsername

#### 2.7. SQL injection-like input is rejected

**File:** `tests/extra/security/sql-injection-like-input-is-rejected.spec.js`

**Steps:**

1. Open /login, enter "' OR 1=1 --" as username and any password, click Login. - expect: URL remains /login - expect: Flash message contains messages.invalidUsername - expect: No access to /secure

#### 2.8. XSS-like input is rejected and not executed

**File:** `tests/extra/security/xss-like-input-is-rejected-and-not-executed.spec.js`

**Steps:**

1. Open /login, register a dialog listener, enter '<script>alert(1)</script>' as username and any password, click Login. - expect: URL remains /login - expect: Flash message contains messages.invalidUsername - expect: No dialog appeared; the script text is not rendered as executable markup

#### 2.9. Password field masks input

**File:** `tests/extra/form/password-field-masks-input.spec.js`

**Steps:**

1. Open /login, type a value into the password field. - expect: Password input has type 'password' so characters are masked

#### 2.10. Submit login with Enter key

**File:** `tests/extra/form/submit-login-with-enter-key.spec.js`

**Steps:**

1. Open /login, fill valid credentials, press Enter in the password field. - expect: URL is /secure - expect: Flash message contains messages.loginSuccess

#### 2.11. Dismiss flash message

**File:** `tests/extra/form/dismiss-flash-message.spec.js`

**Steps:**

1. Trigger an invalid login to show the error flash, click the close (x) control on the message. - expect: Error message is no longer visible (to be confirmed during generation: live check showed the element remained in the DOM, so assert on visibility, and add a page-object helper if needed) - expect: User remains on /login

#### 2.12. Logout returns to login with confirmation message

**File:** `tests/extra/session/logout-returns-to-login-with-confirmation-message.spec.js`

**Steps:**

1. Log in with valid credentials (fresh context), then click Logout in secureAreaPage. - expect: URL is /login - expect: Flash message contains messages.logoutSuccess - expect: Login form is visible

#### 2.13. Accessing /secure while logged out redirects to login

**File:** `tests/extra/session/accessing-secure-while-logged-out-redirects-to-login.spec.js`

**Steps:**

1. In a fresh context, navigate directly to /secure. - expect: URL is /login - expect: Flash message contains messages.loginRequired - expect: Secure Area content is not visible

#### 2.14. Secure area is inaccessible after logout

**File:** `tests/extra/session/secure-area-is-inaccessible-after-logout.spec.js`

**Steps:**

1. Log in, log out, then navigate directly to /secure. - expect: URL is /login - expect: Flash message contains messages.loginRequired

#### 2.15. Back button after logout does not allow new secure actions

**File:** `tests/extra/session/back-button-after-logout-does-not-allow-new-secure-actions.spec.js`

**Steps:**

1. Log in, log out, then use browser Back. - expect: Observed live: Back shows the cached /secure page. Assert the session is invalid by reloading the page: URL becomes /login with messages.loginRequired

#### 2.16. Session persists on reload of /secure

**File:** `tests/extra/session/session-persists-on-reload-of-secure.spec.js`

**Steps:**

1. Log in, reload /secure. - expect: URL stays /secure and Secure Area heading is visible

#### 2.17. Visiting /login while logged in still shows login page

**File:** `tests/extra/session/visiting-login-while-logged-in-still-shows-login-page.spec.js`

**Steps:**

1. Log in, then navigate to /login. (Behaviour not verified; record the actual behaviour as the assertion during generation.) - expect: Page renders without error and the user can still reach /secure
