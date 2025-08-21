import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GridGame from '../../src/components/GridGame';
import * as GameLogic from '../../src/utils/GameLogic';

// Mock the GameLogic module
vi.mock('../../src/utils/GameLogic', () => ({
  generatePuzzle: vi.fn(),
  validateSolution: vi.fn(),
}));

describe('GridGame Integration Tests', () => {
  // Test data for different scenarios
  const mockPuzzleEasy = {
    grid: [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 1, 2, 3],
      [4, 5, 6, 7]
    ],
    targets: {
      rows: [10, 26, 15, 22],
      cols: [19, 14, 18, 22]
    },
    corePositions: new Set(['0,0', '1,1', '2,2', '3,3'])
  };

  const mockPuzzleMedium = {
    grid: Array(5).fill().map((_, i) => 
      Array(5).fill().map((_, j) => i * 5 + j + 1)
    ),
    targets: {
      rows: [15, 40, 65, 90, 115],
      cols: [75, 80, 85, 90, 95]
    },
    corePositions: new Set(['0,0', '1,1', '2,2', '3,3', '4,4'])
  };

  beforeEach(() => {
    vi.clearAllMocks();
    GameLogic.generatePuzzle.mockReturnValue(mockPuzzleEasy);
    GameLogic.validateSolution.mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('✅ Game State Management', () => {
    it('should maintain proper initial state', () => {
      render(<GridGame />);

      // Initial state should be 'setup'
      expect(screen.getByTestId('start-game-btn')).toBeInTheDocument();
      expect(screen.getByTestId('difficulty-easy')).toHaveClass('bg-blue-600');
      
      // Game elements should not be visible
      expect(screen.queryByTestId('mode-toggle-btn')).not.toBeInTheDocument();
      expect(screen.queryByTestId('cell-0-0')).not.toBeInTheDocument();
    });

    it('should transition to playing state with correct initial values', () => {
      render(<GridGame />);
      
      fireEvent.click(screen.getByTestId('start-game-btn'));

      // Should be in playing state
      expect(screen.getByTestId('mode-toggle-btn')).toBeInTheDocument();
      expect(screen.getByTestId('cell-0-0')).toBeInTheDocument();
      
      // Should have initial game values
      expect(screen.getByText('3')).toBeInTheDocument(); // 3 lifelines
      expect(screen.getByText('REMOVE')).toBeInTheDocument(); // Remove mode
      
      // Should generate puzzle with correct difficulty
      expect(GameLogic.generatePuzzle).toHaveBeenCalledWith('easy');
    });

    it('should preserve difficulty selection across state changes', () => {
      render(<GridGame />);
      
      // Change to medium difficulty
      fireEvent.click(screen.getByTestId('difficulty-medium'));
      expect(screen.getByTestId('difficulty-medium')).toHaveClass('bg-blue-600');
      
      // Start game
      fireEvent.click(screen.getByTestId('start-game-btn'));
      expect(GameLogic.generatePuzzle).toHaveBeenCalledWith('medium');
    });

    it('should manage marked cells state correctly', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));

      const cell1 = screen.getByTestId('cell-0-1');
      const cell2 = screen.getByTestId('cell-1-0');
      
      // Mark first cell
      fireEvent.click(cell1);
      expect(cell1).toHaveClass('bg-red-200');
      
      // Mark second cell
      fireEvent.click(cell2);
      expect(cell1).toHaveClass('bg-red-200');
      expect(cell2).toHaveClass('bg-red-200');
      
      // Unmark first cell
      fireEvent.click(cell1);
      expect(cell1).not.toHaveClass('bg-red-200');
      expect(cell2).toHaveClass('bg-red-200'); // Second should still be marked
    });

    it('should maintain state when switching modes', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));

      // Mark some cells
      const cell1 = screen.getByTestId('cell-0-1');
      const cell2 = screen.getByTestId('cell-1-0');
      fireEvent.click(cell1);
      fireEvent.click(cell2);
      
      expect(cell1).toHaveClass('bg-red-200');
      expect(cell2).toHaveClass('bg-red-200');
      
      // Switch to confirm mode
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      expect(screen.getByText('CONFIRM')).toBeInTheDocument();
      
      // Marked cells should still be marked
      expect(cell1).toHaveClass('bg-red-200');
      expect(cell2).toHaveClass('bg-red-200');
      
      // Switch back to remove mode
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      expect(screen.getByText('REMOVE')).toBeInTheDocument();
      
      // Marked cells should still be marked
      expect(cell1).toHaveClass('bg-red-200');
      expect(cell2).toHaveClass('bg-red-200');
    });

    it('should handle rapid state changes correctly', () => {
      render(<GridGame />);
      
      // Rapid difficulty changes
      fireEvent.click(screen.getByTestId('difficulty-medium'));
      fireEvent.click(screen.getByTestId('difficulty-hard'));
      fireEvent.click(screen.getByTestId('difficulty-easy'));
      
      expect(screen.getByTestId('difficulty-easy')).toHaveClass('bg-blue-600');
      
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      // Rapid mode changes
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      
      expect(screen.getByText('CONFIRM')).toBeInTheDocument();
    });
  });

  describe('✅ Component Interaction', () => {
    it('should handle full user interaction flow', () => {
      render(<GridGame />);
      
      // Step 1: Select difficulty
      fireEvent.click(screen.getByTestId('difficulty-hard'));
      expect(screen.getByTestId('difficulty-hard')).toHaveClass('bg-blue-600');
      
      // Step 2: Start game
      fireEvent.click(screen.getByTestId('start-game-btn'));
      expect(GameLogic.generatePuzzle).toHaveBeenCalledWith('hard');
      
      // Step 3: Interact with grid
      const cell = screen.getByTestId('cell-0-1');
      fireEvent.click(cell);
      expect(cell).toHaveClass('bg-red-200');
      
      // Step 4: Switch to confirm mode
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      expect(screen.getByText('CONFIRM')).toBeInTheDocument();
      
      // Step 5: Confirm solution
      const confirmBtn = screen.getByRole('button', { name: 'Confirm Solution' });
      expect(confirmBtn).toBeInTheDocument();
      
      fireEvent.click(confirmBtn);
      expect(GameLogic.validateSolution).toHaveBeenCalled();
    });

    it('should prevent cell interaction when in confirm mode but allow marking', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      const cell = screen.getByTestId('cell-0-1');
      
      // Mark cell in remove mode
      fireEvent.click(cell);
      expect(cell).toHaveClass('bg-red-200');
      
      // Switch to confirm mode
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      
      // Cell should still be marked and clickable for unmarking
      expect(cell).toHaveClass('bg-red-200');
      fireEvent.click(cell);
      expect(cell).not.toHaveClass('bg-red-200'); // Should be able to unmark
    });

    it('should handle grid interactions with different grid sizes', () => {
      // Test with medium difficulty (5x5)
      GameLogic.generatePuzzle.mockReturnValue(mockPuzzleMedium);
      
      render(<GridGame />);
      
      fireEvent.click(screen.getByTestId('difficulty-medium'));
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      // Should have 5x5 grid
      expect(screen.getByTestId('cell-0-0')).toBeInTheDocument();
      expect(screen.getByTestId('cell-4-4')).toBeInTheDocument();
      expect(screen.queryByTestId('cell-5-5')).not.toBeInTheDocument();
      
      // Should be able to interact with all cells
      const cornerCell = screen.getByTestId('cell-4-4');
      fireEvent.click(cornerCell);
      expect(cornerCell).toHaveClass('bg-red-200');
    });

    it('should handle target display updates', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      // Should display target values from mock data
      expect(screen.getByTestId('target-row-10')).toHaveTextContent('10');
      expect(screen.getByTestId('target-column-19')).toHaveTextContent('19');
      expect(screen.getByTestId('target-row-22')).toHaveTextContent('22');
      expect(screen.getByTestId('target-column-22')).toHaveTextContent('22');
    });

    it('should handle component communication correctly', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      // GameStatus should reflect current lifelines
      expect(screen.getByText('3')).toBeInTheDocument();
      
      // GameControls should show current mode
      expect(screen.getByText('REMOVE')).toBeInTheDocument();
      
      // Mode toggle should update GameControls
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      expect(screen.getByText('CONFIRM')).toBeInTheDocument();
      
      // Should show confirm button in confirm mode
      expect(screen.getByRole('button', { name: 'Confirm Solution' })).toBeInTheDocument();
    });
  });

  describe('✅ Game Flow (Setup → Playing → Won/Lost)', () => {
    it('should complete full winning game flow', () => {
      GameLogic.validateSolution.mockReturnValue(true);
      
      render(<GridGame />);
      
      // Setup phase
      expect(screen.getByTestId('start-game-btn')).toBeInTheDocument();
      expect(screen.queryByTestId('mode-toggle-btn')).not.toBeInTheDocument();
      
      // Start game -> Playing phase
      fireEvent.click(screen.getByTestId('start-game-btn'));
      expect(screen.getByTestId('mode-toggle-btn')).toBeInTheDocument();
      expect(screen.getByText('REMOVE')).toBeInTheDocument();
      expect(screen.queryByText('Congratulations!')).not.toBeInTheDocument();
      
      // Make some moves
      fireEvent.click(screen.getByTestId('cell-0-1'));
      fireEvent.click(screen.getByTestId('cell-1-0'));
      
      // Switch to confirm mode and win
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      
      // Won phase
      expect(screen.getByText('Congratulations!')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Play Again' })).toBeInTheDocument();
      expect(screen.queryByTestId('mode-toggle-btn')).not.toBeInTheDocument();
      
      // Reset to setup
      fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));
      expect(screen.getByTestId('start-game-btn')).toBeInTheDocument();
      expect(screen.queryByText('Congratulations!')).not.toBeInTheDocument();
    });

    it('should complete full losing game flow', () => {
      GameLogic.validateSolution.mockReturnValue(false);
      
      render(<GridGame />);
      
      // Setup -> Playing
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      // Make moves and lose
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      
      // Lost phase
      expect(screen.getByText('Game Over')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
      
      // Reset to setup
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
      expect(screen.getByTestId('start-game-btn')).toBeInTheDocument();
    });

    it('should handle multiple complete game cycles', () => {
      let gameCount = 0;
      GameLogic.generatePuzzle.mockImplementation(() => {
        gameCount++;
        return { ...mockPuzzleEasy };
      });
      
      render(<GridGame />);
      
      // First game cycle (win)
      GameLogic.validateSolution.mockReturnValue(true);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));
      
      // Second game cycle (lose)
      GameLogic.validateSolution.mockReturnValue(false);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
      
      // Should have generated 2 puzzles
      expect(GameLogic.generatePuzzle).toHaveBeenCalledTimes(2);
      expect(gameCount).toBe(2);
    });

    it('should maintain game state isolation between cycles', () => {
      render(<GridGame />);
      
      // First game - mark some cells
      fireEvent.click(screen.getByTestId('start-game-btn'));
      fireEvent.click(screen.getByTestId('cell-0-1'));
      expect(screen.getByTestId('cell-0-1')).toHaveClass('bg-red-200');
      
      // Complete game
      GameLogic.validateSolution.mockReturnValue(true);
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      
      // Start new game
      fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      // Cells should be reset (not marked)
      expect(screen.getByTestId('cell-0-1')).not.toHaveClass('bg-red-200');
      expect(screen.getByText('3')).toBeInTheDocument(); // Lifelines reset
      expect(screen.getByText('REMOVE')).toBeInTheDocument(); // Mode reset
    });

    it('should handle game flow with different difficulties', () => {
      render(<GridGame />);
      
      // Easy game
      fireEvent.click(screen.getByTestId('start-game-btn'));
      expect(GameLogic.generatePuzzle).toHaveBeenCalledWith('easy');
      
      // Complete and restart with medium
      GameLogic.validateSolution.mockReturnValue(true);
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));
      
      // Change to medium and start
      fireEvent.click(screen.getByTestId('difficulty-medium'));
      fireEvent.click(screen.getByTestId('start-game-btn'));
      expect(GameLogic.generatePuzzle).toHaveBeenCalledWith('medium');
    });
  });

  describe('✅ Lifeline System', () => {
    it('should start with correct number of lifelines', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should reduce lifelines when core position is clicked', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      // Click a core position (0,0)
      fireEvent.click(screen.getByTestId('cell-0-0'));
      
      // Should reduce to 2 lifelines
      expect(screen.getByText('2')).toBeInTheDocument();
      
      // Cell should still be marked (but player loses lifeline)
      expect(screen.getByTestId('cell-0-0')).toHaveClass('bg-red-200');
    });

    it('should not reduce lifelines for non-core positions', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      // Click a non-core position (0,1)
      fireEvent.click(screen.getByTestId('cell-0-1'));
      
      // Should still have 3 lifelines
      expect(screen.getByText('3')).toBeInTheDocument();
      
      // Cell should be marked
      expect(screen.getByTestId('cell-0-1')).toHaveClass('bg-red-200');
    });

    it('should handle multiple core position clicks', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      // Click first core position (0,0)
      fireEvent.click(screen.getByTestId('cell-0-0'));
      expect(screen.getByText('2')).toBeInTheDocument();
      
      // Click second core position (1,1)
      fireEvent.click(screen.getByTestId('cell-1-1'));
      expect(screen.getByText('1')).toBeInTheDocument();
      
      // Click third core position (2,2)
      fireEvent.click(screen.getByTestId('cell-2-2'));
      expect(screen.getByText('0')).toBeInTheDocument();
      
      // Should now show game over
      expect(screen.getByText('Game Over')).toBeInTheDocument();
    });

    it('should end game when lifelines reach zero', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      // Lose all lifelines
      fireEvent.click(screen.getByTestId('cell-0-0')); // Core: 3->2
      fireEvent.click(screen.getByTestId('cell-1-1')); // Core: 2->1  
      fireEvent.click(screen.getByTestId('cell-2-2')); // Core: 1->0
      
      // Should be in lost state
      expect(screen.getByText('Game Over')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
      
      // Should not be able to interact with grid
      const cell = screen.getByTestId('cell-0-1');
      fireEvent.click(cell);
      expect(cell).not.toHaveClass('bg-red-200'); // Should not respond
    });

    it('should handle lifeline system with unmarking core positions', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      // Click core position to mark it (lose lifeline)
      fireEvent.click(screen.getByTestId('cell-0-0'));
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByTestId('cell-0-0')).toHaveClass('bg-red-200');
      
      // Click again to unmark (should not restore lifeline)
      fireEvent.click(screen.getByTestId('cell-0-0'));
      expect(screen.getByText('2')).toBeInTheDocument(); // Still 2
      expect(screen.getByTestId('cell-0-0')).not.toHaveClass('bg-red-200');
      
      // Mark it again (should lose another lifeline)
      fireEvent.click(screen.getByTestId('cell-0-0'));
      expect(screen.getByText('1')).toBeInTheDocument(); // Now 1
    });

    it('should reset lifelines when starting new game', () => {
      render(<GridGame />);
      
      // Start game and lose some lifelines
      fireEvent.click(screen.getByTestId('start-game-btn'));
      fireEvent.click(screen.getByTestId('cell-0-0')); // Lose 1 lifeline
      expect(screen.getByText('2')).toBeInTheDocument();
      
      // Win the game
      GameLogic.validateSolution.mockReturnValue(true);
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      
      // Start new game
      fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      // Should have full lifelines again
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should handle lifeline edge cases', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      // Test rapid clicking on same core position
      const coreCell = screen.getByTestId('cell-0-0');
      
      fireEvent.click(coreCell); // Mark, lose lifeline: 3->2
      fireEvent.click(coreCell); // Unmark, lifelines stay: 2
      fireEvent.click(coreCell); // Mark again, lose lifeline: 2->1
      
      expect(screen.getByText('1')).toBeInTheDocument();
      
      // Test mixing core and non-core clicks
      fireEvent.click(screen.getByTestId('cell-0-1')); // Non-core, lifelines stay
      expect(screen.getByText('1')).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('cell-1-1')); // Core, lose final lifeline: 1->0
      expect(screen.getByText('Game Over')).toBeInTheDocument();
    });
  });

  describe('Integration Edge Cases', () => {
    it('should handle invalid game states gracefully', () => {
      // Mock generatePuzzle to return invalid data
      GameLogic.generatePuzzle.mockReturnValue({
        grid: [],
        targets: { rows: [], cols: [] },
        corePositions: new Set()
      });
      
      expect(() => {
        render(<GridGame />);
        fireEvent.click(screen.getByTestId('start-game-btn'));
      }).not.toThrow();
    });

    it('should handle GameLogic errors gracefully', () => {
      GameLogic.generatePuzzle.mockImplementation(() => {
        throw new Error('Puzzle generation failed');
      });
      
      expect(() => {
        render(<GridGame />);
        fireEvent.click(screen.getByTestId('start-game-btn'));
      }).not.toThrow();
    });

    it('should handle validation errors gracefully', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      GameLogic.validateSolution.mockImplementation(() => {
        throw new Error('Validation failed');
      });
      
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      
      expect(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      }).not.toThrow();
    });

    it('should maintain consistency under rapid user interactions', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      // Rapid interactions
      for (let i = 0; i < 10; i++) {
        fireEvent.click(screen.getByTestId('cell-0-1'));
        fireEvent.click(screen.getByTestId('mode-toggle-btn'));
        fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      }
      
      // Should still be in consistent state
      expect(screen.getByText('REMOVE')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });
});