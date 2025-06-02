/** lint-staged.config.js */
module.exports = {
  // Client files
  'client/src/**/*.{js,ts,tsx,jsx}': [
    'prettier --write --no-error-on-unmatched-pattern',
    'eslint --fix',
  ],
  'client/src/**/*.{json,css,md}': ['prettier --write --no-error-on-unmatched-pattern'],

  // API files
  'api/src/**/*.{js,ts}': [
    'prettier --write --no-error-on-unmatched-pattern',
    'eslint --fix',
  ],
};