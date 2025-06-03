/** lint-staged.config.js */
module.exports = {
  // Client files
  'client/src/**/*.{js,ts,tsx,jsx}': [
    'npm --prefix client run prettier:staged',
    'npm --prefix client run lint:staged',
  ],
  'client/src/**/*.{json,css,md}': ['npm --prefix client run prettier:staged'],

  // API files
  'api/src/**/*.{js,ts}': [
    'npm --prefix api run prettier:staged',
    'npm --prefix api run lint:staged',
  ],
};