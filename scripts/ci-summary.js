// @ts-check
// Turns Playwright's JSON report into a Markdown summary for the GitHub
// Actions run page. Usage: node scripts/ci-summary.js reports/results.json
const fs = require('fs');

const [reportPath = 'reports/results.json'] = process.argv.slice(2);
if (!fs.existsSync(reportPath)) {
  console.log('No Playwright JSON report found, so there is no summary.');
  process.exit(0);
}

/** @type {any} */
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

/** @type {Map<string, { passed: number, failed: number, flaky: number, skipped: number }>} */
const byProject = new Map();
/** @type {string[]} */
const failures = [];

/**
 * Walk nested suites and count each test's final outcome per project.
 * @param {any} suite
 * @param {string[]} titles
 */
const walk = (suite, titles) => {
  const path = suite.title ? [...titles, suite.title] : titles;
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests ?? []) {
      const project = t.projectName || 'default';
      const row = byProject.get(project) ?? { passed: 0, failed: 0, flaky: 0, skipped: 0 };
      if (t.status === 'expected') row.passed += 1;
      else if (t.status === 'flaky') row.flaky += 1;
      else if (t.status === 'skipped') row.skipped += 1;
      else {
        row.failed += 1;
        failures.push(`- **${project}**: ${[...path.slice(1), spec.title].join(' › ')}`);
      }
      byProject.set(project, row);
    }
  }
  for (const child of suite.suites ?? []) walk(child, path);
};
for (const suite of report.suites ?? []) walk(suite, []);

const lines = [
  '## Playwright results',
  '',
  '| Project | Passed | Failed | Flaky | Skipped |',
  '| --- | --- | --- | --- | --- |',
  ...[...byProject].map(
    ([project, r]) => `| ${project} | ${r.passed} | ${r.failed} | ${r.flaky} | ${r.skipped} |`,
  ),
];
if (failures.length) lines.push('', '### Failed tests', '', ...failures);

const output = lines.join('\n') + '\n';
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, output);
console.log(output);
