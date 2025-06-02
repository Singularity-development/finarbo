/** lint-staged.config.js */
module.exports = {
  // Client files
  'client/src/**/*.{js,ts,tsx,jsx}': [
    'npm --prefix client run prettier:format',
    'npm --prefix client run lint',
  ],
  'client/src/**/*.{json,css,md}': ['npm --prefix client run prettier:format'],

  // API files
  'api/src/**/*.{js,ts}': [
    'npm --prefix api run prettier:format',
    'npm --prefix api run lint',
  ],
};