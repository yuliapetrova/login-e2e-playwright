// @ts-check
const js = require('@eslint/js');
const globals = require('globals');
const playwright = require('eslint-plugin-playwright');

module.exports = [
  { ignores: ['node_modules/', 'playwright-report/', 'test-results/'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs', globals: { ...globals.node } },
  },
  {
    files: ['tests/**/*.js'],
    ...playwright.configs['flat/recommended'],
  },
];
