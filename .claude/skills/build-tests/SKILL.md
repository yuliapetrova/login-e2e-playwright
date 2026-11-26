---
name: build-tests
description: Build Playwright tests with the planner, generator and healer agents, pausing for human review of the test plan and of the generated code. Use only when the user types /build-tests.
argument-hint: <feature or URL, scope, and any credentials or notes>
disable-model-invocation: true
---

# Build tests with human review

Build tests for: $ARGUMENTS

If that line is empty, ask the user what feature, URL and scope to cover, then stop.

Run the phases below in order. The two review gates are hard stops: end your turn and wait
for the user's reply. Never continue past a gate on your own, even in auto mode. Everything
in CLAUDE.md applies to every file written in every phase.

## Phase 0: Prepare

1. Read CLAUDE.md, README.md, `pages/`, `fixtures/fixtures.js`, `test-data/users.js` and
   `tests/seed.spec.js`.
2. The project is not under git, so take a snapshot for later diffs. Copy `specs/`, `tests/`,
   `pages/` and `test-data/` into `<scratchpad>/build-tests-snapshot/`. Use the scratchpad
   directory from the system prompt.
3. If `specs/` already holds a plan for this feature, tell the user it will be replaced and
   that the snapshot keeps the old copy.

## Phase 1: Plan

1. Run the `playwright-test-planner` agent. It starts with no chat history, so its prompt must
   contain the feature, URL, scope, credentials, seed file `tests/seed.spec.js`, the target
   plan file in `specs/`, and the CLAUDE.md conventions. Ask it to give every scenario a
   target file under `tests/required/` or `tests/extra/`, and to report behaviour it observed
   that differs from what the user expected.
2. When it finishes, read the saved plan yourself. Check that every scenario has steps,
   expectations and a target file.

### Gate 1: Review the test cases

Show the user:

- the path to the plan file,
- a numbered table of scenarios with title, target file and the key expectation,
- anything the planner flagged as unverified or surprising.

Then ask the user to review the plan and choose one of these:

- **Approve** all scenarios.
- **Approve some**, listing the scenario numbers to build.
- **Request changes**, described in chat. Apply them to the plan yourself, or re-run the
  planner for larger changes, then show Gate 1 again.
- **Edit the file** themselves, then reply when done. Re-read the plan and show Gate 1 again.

End your turn here. Build only the scenarios the user approved.

## Phase 2: Generate

1. Run one `playwright-test-generator` agent per approved scenario. Independent scenarios can
   run in parallel. Each prompt carries the test suite name, test name, target file, seed file
   and the scenario's steps and expectations copied from the plan, in the format the agent's
   description shows.
2. The generator writes raw `page.*` calls and cannot edit page objects. After all generators
   finish, refactor every generated file to meet CLAUDE.md yourself:
   - `// @ts-check` first, then the `// spec:` and `// seed:` headers,
   - `test` and `expect` from `fixtures/fixtures.js`,
   - page-object fixtures instead of raw selectors, adding missing elements or actions to
     the right file in `pages/`,
   - credentials, inputs and messages from `test-data/users.js`, adding new values there,
   - web-first assertions only, with no `waitForTimeout` and no `networkidle`.
3. Run `npm run lint:fix`, then `npm run lint`, and fix anything it still reports.
4. Run the new tests once with `npx playwright test --project=chromium <files>`. Do not fix
   failures yet. Record the results for the gate.

### Gate 2: Review the code

Show the user:

- every new or changed file as a clickable link, grouped as tests, page objects and test data,
- the diff against the snapshot for `pages/` and `test-data/`, in a fenced code block,
- the lint result and the test results, with the error line for each failure,
- any place where the generated code departs from the approved plan, and why.

Then ask the user to review the code and choose one of these:

- **Approve**, and go on to Phase 3.
- **Request changes**, described in chat or as edits they make. Apply them, rerun lint and
  the tests, then show Gate 2 again.
- **Drop** listed tests. Delete those files, then show Gate 2 again.

End your turn here.

## Phase 3: Heal and verify

1. If every test passed at Gate 2, skip to step 4.
2. Run the `playwright-test-healer` agent on the failing files only. Tell it to follow
   CLAUDE.md, to keep page-object fixtures, and to put any new locator in `pages/`, not in
   the test.
3. When it finishes, diff the test files against the Gate 2 versions. The healer is told to
   make tests pass, so it may hide a real application bug. Ask the user before keeping any of
   these changes:
   - a changed expected value, message or URL,
   - a removed or weakened assertion,
   - a `test.fixme()` or `test.skip()`.
     Show each one as a short before and after snippet with the healer's reason. Selector and
     timing fixes need no approval but are listed in the recap. If anything needs approval,
     end your turn and wait. Apply the user's decisions, and update the plan when an
     expectation changed.
4. Run both checks from CLAUDE.md:

   ```
   npm run lint
   npx playwright test --project=chromium
   ```

   Both must pass. If a test fails that the healer already worked on, report it instead of
   looping. Optionally run `npm run test:shuffle` to confirm the tests are independent.

## Recap

Finish with:

- a table of tests built, with file and result,
- page-object and test-data changes,
- healer changes and the user's decision on each,
- plan corrections made because the live site behaved differently,
- anything left failing or marked fixme, and why.
