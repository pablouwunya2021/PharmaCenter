if (process.env.JEST_WORKER_ID) {
  // Evita que Jest ejecute este archivo (Playwright lo ejecuta con su runner).
  module.exports = {};
} else {
  const { test, expect } = require('@playwright/test');
  const { percySnapshot } = require('@percy/playwright');

  test('snapshot visual de TodoMVC home', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByText('todos')).toBeVisible(); // sanity check
    await percySnapshot(page, 'TodoMVC - Home');
  });
}
