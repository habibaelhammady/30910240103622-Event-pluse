module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*-test.js', '**/test/**/*-test.ts'],
  collectCoverageFrom: [
    'routes/**/*.js',
    'controllers/**/*.js',
    'models/**/*.js',
    'utiles/**/*.js',
    '!node_modules/**'
  ],
  testTimeout: 10000
};
