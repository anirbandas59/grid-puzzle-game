import { test, expect, devices } from '@playwright/test';

test.describe('Cross-Browser Compatibility Tests', () => {
  const browsers = ['chromium', 'firefox', 'webkit'];

  browsers.forEach(browserName => {
    test.describe(`${browserName} browser tests`, () => {
      test(`should load and function correctly in ${browserName}`, async ({ page, browserName: currentBrowser }) => {
        // Skip if not the current browser being tested
        if (currentBrowser !== browserName && browserName !== 'chromium') {
          test.skip();
        }

        await page.goto('/');
        
        // Basic functionality test
        await expect(page.locator('h1')).toContainText('Number Puzzle Game');
        await expect(page.locator('button:has-text("Start Game")')).toBeVisible();
        
        // Test difficulty selection
        await page.click('[data-testid="difficulty-medium"]');
        await expect(page.locator('[data-testid="difficulty-medium"]')).toHaveClass(/bg-blue-600/);
        
        // Start game and verify grid renders
        await page.click('button:has-text("Start Game")');
        await expect(page.locator('[data-testid="game-grid"]')).toBeVisible();
        await expect(page.locator('text=Lifelines: 3')).toBeVisible();
        
        // Test cell interaction
        await page.click('[data-testid="cell-0-1"]');
        await expect(page.locator('[data-testid="cell-0-1"]')).toHaveClass(/bg-red/);
        
        // Test mode switching
        await page.click('button:has-text("Switch to Confirm")');
        await expect(page.locator('text=Mode: Confirm')).toBeVisible();
      });
    });
  });

  test.describe('Mobile Browser Tests', () => {
    test('should work on mobile Safari', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPhone 12']
      });
      const page = await context.newPage();
      
      await page.goto('/');
      
      // Test mobile-specific interactions
      await expect(page.locator('h1')).toBeVisible();
      await page.click('button:has-text("Start Game")');
      
      // Test touch interactions
      await page.tap('[data-testid="cell-0-0"]');
      await expect(page.locator('[data-testid="game-grid"]')).toBeVisible();
      
      await context.close();
    });

    test('should work on mobile Chrome', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['Pixel 5']
      });
      const page = await context.newPage();
      
      await page.goto('/');
      
      await expect(page.locator('h1')).toBeVisible();
      await page.click('[data-testid="difficulty-hard"]');
      await page.click('button:has-text("Start Game")');
      
      // Verify 6x6 grid works on mobile
      await expect(page.locator('[data-testid="game-grid"]')).toHaveClass(/grid-cols-6/);
      
      await context.close();
    });
  });

  test.describe('Tablet Browser Tests', () => {
    test('should work on iPad', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPad Pro']
      });
      const page = await context.newPage();
      
      await page.goto('/');
      
      await expect(page.locator('h1')).toBeVisible();
      await page.click('button:has-text("Start Game")');
      
      // Test grid interactions on tablet
      await page.click('[data-testid="cell-1-1"]');
      await page.click('[data-testid="cell-2-2"]');
      
      await expect(page.locator('text=Mode: Remove')).toBeVisible();
      
      await context.close();
    });
  });

  test.describe('Browser Feature Compatibility', () => {
    test('should handle CSS Grid support', async ({ page }) => {
      await page.goto('/');
      await page.click('button:has-text("Start Game")');
      
      // Check if CSS Grid is properly applied
      const gridElement = page.locator('[data-testid="game-grid"]');
      await expect(gridElement).toHaveCSS('display', 'grid');
    });

    test('should handle modern JavaScript features', async ({ page }) => {
      await page.goto('/');
      
      // Test that ES6+ features work (Set, Map, etc.)
      await page.click('button:has-text("Start Game")');
      await page.click('[data-testid="cell-0-1"]');
      
      // If the app uses Set for tracking marked cells, this should work
      await expect(page.locator('[data-testid="cell-0-1"]')).toHaveClass(/bg-red/);
    });

    test('should handle local storage if used', async ({ page }) => {
      await page.goto('/');
      
      // Check if the page loads without localStorage errors
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      await page.click('button:has-text("Start Game")');
      
      // Should not have localStorage-related errors
      expect(errors.filter(error => error.includes('localStorage'))).toHaveLength(0);
    });
  });

  test.describe('Performance Across Browsers', () => {
    test('should load quickly on all browsers', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await expect(page.locator('h1')).toBeVisible();
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should handle rapid interactions without lag', async ({ page }) => {
      await page.goto('/');
      await page.click('button:has-text("Start Game")');
      
      const startTime = Date.now();
      
      // Rapidly click multiple cells
      for (let i = 0; i < 10; i++) {
        await page.click(`[data-testid="cell-${i % 4}-${(i + 1) % 4}"]`, { timeout: 1000 });
      }
      
      const interactionTime = Date.now() - startTime;
      
      // Should handle 10 rapid clicks within 2 seconds
      expect(interactionTime).toBeLessThan(2000);
    });
  });

  test.describe('Browser-Specific Edge Cases', () => {
    test('should handle browser back/forward navigation', async ({ page }) => {
      await page.goto('/');
      await page.click('button:has-text("Start Game")');
      
      // Go back
      await page.goBack();
      await expect(page.locator('h1')).toBeVisible();
      
      // Go forward
      await page.goForward();
      // Game state might be lost, should show setup again
      await expect(page.locator('button:has-text("Start Game")')).toBeVisible();
    });

    test('should handle page refresh during game', async ({ page }) => {
      await page.goto('/');
      await page.click('button:has-text("Start Game")');
      await page.click('[data-testid="cell-0-1"]');
      
      // Refresh page
      await page.reload();
      
      // Should return to initial state
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('button:has-text("Start Game")')).toBeVisible();
    });

    test('should handle window resize', async ({ page }) => {
      await page.goto('/');
      await page.click('button:has-text("Start Game")');
      
      // Test different window sizes
      await page.setViewportSize({ width: 400, height: 600 });
      await expect(page.locator('[data-testid="game-grid"]')).toBeVisible();
      
      await page.setViewportSize({ width: 1200, height: 800 });
      await expect(page.locator('[data-testid="game-grid"]')).toBeVisible();
      
      // Game should still be functional
      await page.click('[data-testid="cell-0-1"]');
      await expect(page.locator('[data-testid="cell-0-1"]')).toHaveClass(/bg-red/);
    });
  });
});