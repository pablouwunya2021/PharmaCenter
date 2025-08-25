const { test, expect } = require('@playwright/test');

test('agrega un todo en TodoMVC', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  await page.getByPlaceholder('What needs to be done?').fill('Comprar aspirina');
  await page.keyboard.press('Enter');
  await expect(page.locator('.todo-list li label')).toHaveText('Comprar aspirina');
});
