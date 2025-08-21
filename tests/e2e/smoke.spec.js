import { test, expect } from '@playwright/test';

test.describe('Smoke Test', () => {
  test('should load the application successfully', async ({ page }) => {
    await page.goto('/');
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/smoke-test.png', fullPage: true });
    
    // Basic page load test
    await expect(page).toHaveTitle(/Grid.*Puzzle.*Game|Vite \+ React/);
    
    // Check if the main heading exists
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    
    // Log page content for debugging
    const content = await page.content();
    console.log('Page title:', await page.title());
    console.log('Page URL:', page.url());
    console.log('Main heading text:', await heading.textContent().catch(() => 'Not found'));
    
    // Check for any errors in console
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a bit for any potential errors
    await page.waitForTimeout(2000);
    
    if (errors.length > 0) {
      console.log('Console errors:', errors);
    }
    
    // Basic interaction test - just check if Start Game button exists
    const startButton = page.locator('button').filter({ hasText: 'Start Game' });
    console.log('Start Game button visible:', await startButton.isVisible());
  });
});