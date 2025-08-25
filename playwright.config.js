module.exports = {
  testDir: './tests',
  testMatch: ['**/tests/e2e/**/*.spec.js', '**/tests/visual/**/*.spec.js'],
  testIgnore: [
    '**/tests/frontend/**',
    '**/tests/api/**',
    '**/backend/**/*.test.js',
    '**/pharmacenter/**/*.test.jsx'
  ],
  timeout: 30000,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...require('@playwright/test').devices['Desktop Chrome'] },
    },
  ],
};
