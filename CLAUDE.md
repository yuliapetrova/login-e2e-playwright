# Project conventions for AI agents

This project uses Playwright Test Agents (`.claude/agents/`) with the
`playwright-test` MCP server (`.mcp.json`).

## Conventions every generated or healed test must follow

- Language is **JavaScript (CommonJS)**, never TypeScript. Files end in `.spec.js` and start with `// @ts-check`.
- Import `test` and `expect` from `fixtures/fixtures.js`, never from `@playwright/test`.
- Use the page objects from `pages/` through fixtures (`loginPage`, `secureAreaPage`). Do not put raw selectors in tests.
- For HTTP-level checks, use the `authApi` fixture from `api/AuthApi.js`. Take endpoints and status codes from `test-data/api.js`.
  If a test needs an element or action that is missing, add it to the right page object.
- Take credentials and expected messages from `test-data/users.js`. Do not hardcode them in tests.
- Use web-first assertions (`await expect(locator)...`). No `waitForTimeout`, no `networkidle`.
- Every test is independent and starts from a fresh state.
- The seed file is `tests/seed.spec.js`.

## Where files go

- Test plans: `specs/`
- The three required assignment tests: `tests/required/`
- All additional tests: `tests/extra/`
- Keep the header comments `// spec: ...` and `// seed: ...` in generated tests.

## Checks before finishing

Run `npm run lint` and `npx playwright test --project=chromium`. Both must pass.
