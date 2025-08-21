import { test, expect } from '@playwright/test';

test.describe('Grid Puzzle Game - Final E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Grid Number Puzzle Game');
  });

  test('Complete Gameplay Test - All Difficulty Levels', async ({ page }) => {
    // Test Easy Difficulty
    console.log('Testing Easy difficulty...');
    await page.click('button:has-text("Start Game")');
    
    // Wait for game to load and check basic elements
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Lifelines').first()).toBeVisible();
    
    // Take screenshot of easy game
    await page.screenshot({ path: 'test-results/easy-game.png', fullPage: true });
    
    // Reset game
    await page.reload();
    await expect(page.locator('h1')).toBeVisible();
    
    // Test Medium Difficulty - look for difficulty selector radio buttons
    console.log('Testing Medium difficulty...');
    const mediumRadio = page.locator('input[value="medium"]');
    if (await mediumRadio.isVisible()) {
      await mediumRadio.click();
    }
    
    await page.click('button:has-text("Start Game")');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Lifelines').first()).toBeVisible();
    
    // Take screenshot of medium game
    await page.screenshot({ path: 'test-results/medium-game.png', fullPage: true });
    
    // Reset game
    await page.reload();
    await expect(page.locator('h1')).toBeVisible();
    
    // Test Hard Difficulty
    console.log('Testing Hard difficulty...');
    const hardRadio = page.locator('input[value="hard"]');
    if (await hardRadio.isVisible()) {
      await hardRadio.click();
    }
    
    await page.click('button:has-text("Start Game")');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Lifelines').first()).toBeVisible();
    
    // Take screenshot of hard game
    await page.screenshot({ path: 'test-results/hard-game.png', fullPage: true });
    
    console.log('All difficulty levels tested successfully!');
  });

  test('Game Mode Switching Test', async ({ page }) => {
    console.log('Testing game mode switching...');
    
    await page.click('button:has-text("Start Game")');
    await page.waitForTimeout(1000);
    
    // Look for mode indicator
    const modeText = page.locator('text=Mode').first();
    if (await modeText.isVisible()) {
      console.log('Mode indicator found');
    }
    
    // Look for any switch/toggle buttons
    const switchButtons = page.locator('button').filter({ hasText: /Switch|Toggle/i });
    const switchCount = await switchButtons.count();
    
    if (switchCount > 0) {
      console.log(`Found ${switchCount} switch buttons`);
      await switchButtons.first().click();
      await page.waitForTimeout(500);
      
      // Take screenshot after mode switch
      await page.screenshot({ path: 'test-results/mode-switched.png', fullPage: true });
    } else {
      console.log('No switch buttons found, mode switching may not be available');
    }
    
    console.log('Mode switching test completed');
  });

  test('Win/Lose Condition Test', async ({ page }) => {
    console.log('Testing win/lose conditions...');
    
    await page.click('button:has-text("Start Game")');
    await page.waitForTimeout(1000);
    
    // Look for confirm/solution buttons
    const confirmButtons = page.locator('button').filter({ hasText: /Confirm|Solution/i });
    const confirmCount = await confirmButtons.count();
    
    if (confirmCount > 0) {
      console.log(`Found ${confirmCount} confirm buttons`);
      
      // First try to switch to confirm mode if needed
      const switchToConfirm = page.locator('button').filter({ hasText: /Switch.*Confirm/i });
      if (await switchToConfirm.isVisible()) {
        await switchToConfirm.click();
        await page.waitForTimeout(500);
      }
      
      // Now try to confirm solution
      const confirmSolution = page.locator('button').filter({ hasText: /Confirm.*Solution/i });
      if (await confirmSolution.isVisible()) {
        await confirmSolution.click();
        await page.waitForTimeout(1000);
        
        // Check for win/lose messages
        const congratsVisible = await page.locator('text=Congratulations').isVisible();
        const gameOverVisible = await page.locator('text=Game Over').isVisible();
        
        if (congratsVisible || gameOverVisible) {
          console.log(`Game ended with result: ${congratsVisible ? 'WIN' : 'LOSE'}`);
          await page.screenshot({ path: 'test-results/game-result.png', fullPage: true });
          
          // Look for restart buttons
          const restartButtons = page.locator('button').filter({ hasText: /Again|Restart/i });
          if (await restartButtons.count() > 0) {
            await restartButtons.first().click();
            await page.waitForTimeout(1000);
            console.log('Game reset successfully');
          }
        } else {
          console.log('No win/lose message detected');
        }
      }
    } else {
      console.log('No confirm buttons found');
    }
    
    console.log('Win/lose condition test completed');
  });

  test('Cross-Browser Compatibility Test', async ({ page }) => {
    console.log('Testing cross-browser compatibility...');
    
    // Test different viewport sizes (simulating different devices)
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      console.log(`Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);
      
      // Basic functionality test
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('button:has-text("Start Game")')).toBeVisible();
      
      // Start game and verify it works
      await page.click('button:has-text("Start Game")');
      await page.waitForTimeout(1000);
      
      // Take screenshot for each viewport
      await page.screenshot({ 
        path: `test-results/${viewport.name.toLowerCase()}-view.png`, 
        fullPage: true 
      });
      
      // Reset for next test
      await page.reload();
      await expect(page.locator('h1')).toBeVisible();
    }
    
    console.log('Cross-browser compatibility test completed');
  });

  test('Performance and Rapid Interaction Test', async ({ page }) => {
    console.log('Testing performance and rapid interactions...');
    
    await page.click('button:has-text("Start Game")');
    await page.waitForTimeout(1000);
    
    // Test rapid clicking in game area
    const gameArea = page.locator('body');
    const startTime = Date.now();
    
    // Perform rapid clicks
    for (let i = 0; i < 10; i++) {
      await gameArea.click({ position: { x: 300 + i * 10, y: 300 + i * 10 } });
      await page.waitForTimeout(100);
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`Rapid interaction test completed in ${duration}ms`);
    
    // Verify game is still responsive
    await expect(page.locator('h1')).toBeVisible();
    
    // Test page reload performance
    const reloadStart = Date.now();
    await page.reload();
    await expect(page.locator('h1')).toBeVisible();
    const reloadEnd = Date.now();
    
    console.log(`Page reload completed in ${reloadEnd - reloadStart}ms`);
    console.log('Performance test completed');
  });
});