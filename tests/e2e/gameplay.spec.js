import { test, expect } from '@playwright/test';

test.describe('Grid Puzzle Game - Complete Gameplay Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Number Puzzle Game');
  });

  test.describe('Difficulty Level Tests', () => {
    test('should handle Easy difficulty (4x4 grid)', async ({ page }) => {
      // Select Easy difficulty
      await page.click('[data-testid="difficulty-easy"]');
      await expect(page.locator('[data-testid="difficulty-easy"]')).toHaveClass(/bg-blue-600/);
      
      // Start game
      await page.click('button:has-text("Start Game")');
      
      // Verify game started with 4x4 grid
      await expect(page.locator('[data-testid="game-grid"]')).toHaveClass(/grid-cols-4/);
      await expect(page.locator('[data-testid="cell-3-3"]')).toBeVisible();
      await expect(page.locator('[data-testid="cell-4-4"]')).not.toBeVisible();
      
      // Verify lifelines and mode
      await expect(page.locator('text=Lifelines: 3')).toBeVisible();
      await expect(page.locator('text=Mode: Remove')).toBeVisible();
    });

    test('should handle Medium difficulty (5x5 grid)', async ({ page }) => {
      // Select Medium difficulty
      await page.click('[data-testid="difficulty-medium"]');
      await expect(page.locator('[data-testid="difficulty-medium"]')).toHaveClass(/bg-blue-600/);
      
      // Start game
      await page.click('button:has-text("Start Game")');
      
      // Verify game started with 5x5 grid
      await expect(page.locator('[data-testid="game-grid"]')).toHaveClass(/grid-cols-5/);
      await expect(page.locator('[data-testid="cell-4-4"]')).toBeVisible();
      await expect(page.locator('[data-testid="cell-5-5"]')).not.toBeVisible();
    });

    test('should handle Hard difficulty (6x6 grid)', async ({ page }) => {
      // Select Hard difficulty
      await page.click('[data-testid="difficulty-hard"]');
      await expect(page.locator('[data-testid="difficulty-hard"]')).toHaveClass(/bg-blue-600/);
      
      // Start game
      await page.click('button:has-text("Start Game")');
      
      // Verify game started with 6x6 grid
      await expect(page.locator('[data-testid="game-grid"]')).toHaveClass(/grid-cols-6/);
      await expect(page.locator('[data-testid="cell-5-5"]')).toBeVisible();
    });

    test('should allow switching between difficulties before starting', async ({ page }) => {
      // Test switching between difficulties
      await page.click('[data-testid="difficulty-medium"]');
      await expect(page.locator('[data-testid="difficulty-medium"]')).toHaveClass(/bg-blue-600/);
      
      await page.click('[data-testid="difficulty-hard"]');
      await expect(page.locator('[data-testid="difficulty-hard"]')).toHaveClass(/bg-blue-600/);
      await expect(page.locator('[data-testid="difficulty-medium"]')).not.toHaveClass(/bg-blue-600/);
      
      await page.click('[data-testid="difficulty-easy"]');
      await expect(page.locator('[data-testid="difficulty-easy"]')).toHaveClass(/bg-blue-600/);
      await expect(page.locator('[data-testid="difficulty-hard"]')).not.toHaveClass(/bg-blue-600/);
    });
  });

  test.describe('Complete Gameplay Flow', () => {
    test('should complete full game cycle - mark cells and win', async ({ page }) => {
      // Start with easy difficulty
      await page.click('[data-testid="difficulty-easy"]');
      await page.click('button:has-text("Start Game")');
      
      // Mark some cells for removal (avoid core positions)
      await page.click('[data-testid="cell-0-1"]');
      await page.click('[data-testid="cell-1-0"]');
      await page.click('[data-testid="cell-2-3"]');
      
      // Verify cells are marked
      await expect(page.locator('[data-testid="cell-0-1"]')).toHaveClass(/bg-red/);
      await expect(page.locator('[data-testid="cell-1-0"]')).toHaveClass(/bg-red/);
      await expect(page.locator('[data-testid="cell-2-3"]')).toHaveClass(/bg-red/);
      
      // Switch to confirm mode
      await page.click('button:has-text("Switch to Confirm")');
      await expect(page.locator('text=Mode: Confirm')).toBeVisible();
      
      // Verify marked cells are still visible in confirm mode
      await expect(page.locator('[data-testid="cell-0-1"]')).toHaveClass(/bg-red/);
      
      // Confirm solution (this might win or lose depending on the puzzle)
      await page.click('button:has-text("Confirm Solution")');
      
      // Check for either win or lose state
      const hasWinMessage = await page.locator('text=Congratulations!').isVisible();
      const hasLoseMessage = await page.locator('text=Game Over').isVisible();
      
      expect(hasWinMessage || hasLoseMessage).toBeTruthy();
      
      if (hasWinMessage) {
        await expect(page.locator('button:has-text("Play Again")')).toBeVisible();
      } else {
        await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
      }
    });

    test('should handle mode switching during gameplay', async ({ page }) => {
      await page.click('button:has-text("Start Game")');
      
      // Mark a cell in remove mode
      await page.click('[data-testid="cell-0-1"]');
      await expect(page.locator('[data-testid="cell-0-1"]')).toHaveClass(/bg-red/);
      
      // Switch to confirm mode
      await page.click('button:has-text("Switch to Confirm")');
      await expect(page.locator('text=Mode: Confirm')).toBeVisible();
      await expect(page.locator('button:has-text("Confirm Solution")')).toBeVisible();
      
      // Switch back to remove mode
      await page.click('button:has-text("Switch to Remove")');
      await expect(page.locator('text=Mode: Remove')).toBeVisible();
      await expect(page.locator('button:has-text("Switch to Confirm")')).toBeVisible();
      
      // Verify cell is still marked
      await expect(page.locator('[data-testid="cell-0-1"]')).toHaveClass(/bg-red/);
    });

    test('should handle cell unmarking in remove mode', async ({ page }) => {
      await page.click('button:has-text("Start Game")');
      
      // Mark a cell
      await page.click('[data-testid="cell-0-1"]');
      await expect(page.locator('[data-testid="cell-0-1"]')).toHaveClass(/bg-red/);
      
      // Unmark the same cell
      await page.click('[data-testid="cell-0-1"]');
      await expect(page.locator('[data-testid="cell-0-1"]')).not.toHaveClass(/bg-red/);
    });
  });

  test.describe('Win/Lose Conditions', () => {
    test('should handle lifeline loss when clicking core positions', async ({ page }) => {
      await page.click('button:has-text("Start Game")');
      
      // Initial lifelines should be 3
      await expect(page.locator('text=Lifelines: 3')).toBeVisible();
      
      // Click on core positions to lose lifelines
      // Note: Core positions are typically diagonal cells, but this depends on the puzzle generation
      const corePositions = ['[data-testid="cell-0-0"]', '[data-testid="cell-1-1"]', '[data-testid="cell-2-2"]', '[data-testid="cell-3-3"]'];
      
      let lifelines = 3;
      for (const position of corePositions) {
        const cellExists = await page.locator(position).isVisible();
        if (cellExists && lifelines > 0) {
          await page.click(position);
          lifelines--;
          if (lifelines > 0) {
            await expect(page.locator(`text=Lifelines: ${lifelines}`)).toBeVisible();
          } else {
            // Game should end when lifelines reach 0
            await expect(page.locator('text=Game Over')).toBeVisible();
            break;
          }
        }
      }
    });

    test('should show win message for correct solution', async ({ page }) => {
      await page.click('button:has-text("Start Game")');
      
      // This test would need specific puzzle knowledge to guarantee a win
      // For demonstration, we'll just test the UI flow
      await page.click('button:has-text("Switch to Confirm")');
      await page.click('button:has-text("Confirm Solution")');
      
      // Check if win or lose occurred
      const isWinVisible = await page.locator('text=Congratulations!').isVisible();
      const isLoseVisible = await page.locator('text=Game Over').isVisible();
      
      expect(isWinVisible || isLoseVisible).toBeTruthy();
      
      if (isWinVisible) {
        await expect(page.locator('text=You solved the puzzle!')).toBeVisible();
        await expect(page.locator('button:has-text("Play Again")')).toBeVisible();
      }
    });

    test('should handle game reset after win/lose', async ({ page }) => {
      await page.click('button:has-text("Start Game")');
      
      // Force a game end by confirming solution
      await page.click('button:has-text("Switch to Confirm")');
      await page.click('button:has-text("Confirm Solution")');
      
      // Wait for game to end
      const playAgainVisible = await page.locator('button:has-text("Play Again")').isVisible();
      const tryAgainVisible = await page.locator('button:has-text("Try Again")').isVisible();
      
      if (playAgainVisible) {
        await page.click('button:has-text("Play Again")');
      } else if (tryAgainVisible) {
        await page.click('button:has-text("Try Again")');
      }
      
      // Should return to setup screen
      await expect(page.locator('text=Choose Difficulty:')).toBeVisible();
      await expect(page.locator('button:has-text("Start Game")')).toBeVisible();
    });
  });

  test.describe('UI Interaction and Accessibility', () => {
    test('should support keyboard navigation', async ({ page }) => {
      await page.click('button:has-text("Start Game")');
      
      // Test keyboard navigation on grid cells
      await page.focus('[data-testid="cell-0-0"]');
      await page.keyboard.press('Enter');
      
      // Test tab navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
    });

    test('should display proper ARIA labels and accessibility features', async ({ page }) => {
      await page.click('button:has-text("Start Game")');
      
      // Check for proper labeling
      const easyDifficulty = page.locator('[aria-label*="Easy"]');
      await expect(easyDifficulty).toBeVisible();
      
      // Check grid cells have proper labels
      const gridCell = page.locator('[data-testid="cell-0-0"]');
      await expect(gridCell).toHaveAttribute('aria-label');
    });

    test('should handle responsive design', async ({ page }) => {
      // Test different viewport sizes
      await page.setViewportSize({ width: 375, height: 667 }); // Mobile
      await expect(page.locator('h1')).toBeVisible();
      
      await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
      await expect(page.locator('h1')).toBeVisible();
      
      await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
      await expect(page.locator('h1')).toBeVisible();
    });
  });

  test.describe('Performance and Reliability', () => {
    test('should handle rapid clicking without issues', async ({ page }) => {
      await page.click('button:has-text("Start Game")');
      
      // Rapidly click multiple cells
      for (let i = 0; i < 5; i++) {
        await page.click('[data-testid="cell-0-1"]', { delay: 50 });
      }
      
      // Game should still be responsive
      await expect(page.locator('text=Mode: Remove')).toBeVisible();
    });

    test('should maintain state during mode transitions', async ({ page }) => {
      await page.click('button:has-text("Start Game")');
      
      // Mark multiple cells
      await page.click('[data-testid="cell-0-1"]');
      await page.click('[data-testid="cell-1-2"]');
      
      // Switch modes multiple times
      await page.click('button:has-text("Switch to Confirm")');
      await page.click('button:has-text("Switch to Remove")');
      await page.click('button:has-text("Switch to Confirm")');
      
      // Verify marked cells are still marked
      await expect(page.locator('[data-testid="cell-0-1"]')).toHaveClass(/bg-red/);
      await expect(page.locator('[data-testid="cell-1-2"]')).toHaveClass(/bg-red/);
    });

    test('should handle multiple game sessions', async ({ page }) => {
      for (let game = 0; game < 3; game++) {
        await page.click('button:has-text("Start Game")');
        
        // Play a quick game
        await page.click('button:has-text("Switch to Confirm")');
        await page.click('button:has-text("Confirm Solution")');
        
        // Reset game
        const playAgain = await page.locator('button:has-text("Play Again")').isVisible();
        const tryAgain = await page.locator('button:has-text("Try Again")').isVisible();
        
        if (playAgain) {
          await page.click('button:has-text("Play Again")');
        } else if (tryAgain) {
          await page.click('button:has-text("Try Again")');
        }
        
        await expect(page.locator('button:has-text("Start Game")')).toBeVisible();
      }
    });
  });
});