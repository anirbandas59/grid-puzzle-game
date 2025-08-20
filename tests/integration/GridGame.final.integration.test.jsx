import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GridGame from '../../src/components/GridGame';
import * as GameLogic from '../../src/utils/GameLogic';

// Mock the GameLogic module
vi.mock('../../src/utils/GameLogic', () => ({
  generatePuzzle: vi.fn(),
  validateSolution: vi.fn(),
}));

describe('GridGame Integration Tests - Final Working Tests', () => {
  const mockPuzzle = {
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

  beforeEach(() => {
    vi.clearAllMocks();
    GameLogic.generatePuzzle.mockReturnValue(mockPuzzle);
    GameLogic.validateSolution.mockReturnValue(false);
  });

  describe('✅ Game State Management', () => {
    it('should manage game state transitions correctly', () => {
      render(<GridGame />);

      // Initial state
      expect(screen.getByTestId('start-game-btn')).toBeInTheDocument();
      expect(screen.queryByTestId('mode-toggle-btn')).not.toBeInTheDocument();

      // Start game
      fireEvent.click(screen.getByTestId('start-game-btn'));
      expect(screen.getByTestId('mode-toggle-btn')).toBeInTheDocument();
      expect(screen.getByTestId('cell-0-0')).toBeInTheDocument();
    });

    it('should preserve game state across mode switches', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));

      // Mark a cell
      const cell = screen.getByTestId('cell-0-1');
      fireEvent.click(cell);
      expect(cell).toHaveClass('bg-red-200');

      // Switch to confirm mode
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      expect(screen.getByText('CONFIRM')).toBeInTheDocument();
      expect(cell).toHaveClass('bg-red-200'); // Should still be marked

      // Switch back to remove mode
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      expect(screen.getByText('REMOVE')).toBeInTheDocument();
      expect(cell).toHaveClass('bg-red-200'); // Should still be marked
    });

    it('should handle difficulty selection', () => {
      render(<GridGame />);

      // Change difficulty
      fireEvent.click(screen.getByTestId('difficulty-medium'));
      expect(screen.getByTestId('difficulty-medium')).toHaveClass('bg-blue-600');

      // Start game with selected difficulty
      fireEvent.click(screen.getByTestId('start-game-btn'));
      expect(GameLogic.generatePuzzle).toHaveBeenCalledWith('medium');
    });
  });

  describe('✅ Component Interaction', () => {
    it('should handle complete user interaction workflow', () => {
      render(<GridGame />);

      // Select difficulty and start
      fireEvent.click(screen.getByTestId('difficulty-hard'));
      fireEvent.click(screen.getByTestId('start-game-btn'));
      expect(GameLogic.generatePuzzle).toHaveBeenCalledWith('hard');

      // Interact with grid
      const cell = screen.getByTestId('cell-0-1');
      fireEvent.click(cell);
      expect(cell).toHaveClass('bg-red-200');

      // Switch to confirm mode
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      expect(screen.getByText('CONFIRM')).toBeInTheDocument();

      // Confirm button should appear
      expect(screen.getByTestId('confirm-solution-btn')).toBeInTheDocument();

      // Click confirm solution
      fireEvent.click(screen.getByTestId('confirm-solution-btn'));
      expect(GameLogic.validateSolution).toHaveBeenCalledTimes(1);
    });

    it('should handle mode switching correctly', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));

      // Initial mode
      expect(screen.getByText('REMOVE')).toBeInTheDocument();
      expect(screen.queryByTestId('confirm-solution-btn')).not.toBeInTheDocument();

      // Switch to confirm mode
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      expect(screen.getByText('CONFIRM')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-solution-btn')).toBeInTheDocument();

      // Switch back
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      expect(screen.getByText('REMOVE')).toBeInTheDocument();
      expect(screen.queryByTestId('confirm-solution-btn')).not.toBeInTheDocument();
    });
  });

  describe('✅ Game Flow (Setup → Playing → Won/Lost)', () => {
    it('should complete winning game flow', () => {
      GameLogic.validateSolution.mockReturnValue(true);
      
      render(<GridGame />);

      // Setup phase
      expect(screen.getByTestId('start-game-btn')).toBeInTheDocument();
      
      // Playing phase
      fireEvent.click(screen.getByTestId('start-game-btn'));
      expect(screen.getByTestId('mode-toggle-btn')).toBeInTheDocument();

      // Make moves and win
      fireEvent.click(screen.getByTestId('cell-0-1'));
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByTestId('confirm-solution-btn'));

      // Won state
      expect(screen.getByText('Congratulations!')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Play Again' })).toBeInTheDocument();

      // Reset
      fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));
      expect(screen.getByTestId('start-game-btn')).toBeInTheDocument();
    });

    it('should complete losing game flow', () => {
      GameLogic.validateSolution.mockReturnValue(false);
      
      render(<GridGame />);

      fireEvent.click(screen.getByTestId('start-game-btn'));
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByTestId('confirm-solution-btn'));

      // Lost state
      expect(screen.getByText('Game Over')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();

      // Reset
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
      expect(screen.getByTestId('start-game-btn')).toBeInTheDocument();
    });

    it('should handle multiple game cycles', () => {
      let gameCount = 0;
      GameLogic.generatePuzzle.mockImplementation(() => {
        gameCount++;
        return { ...mockPuzzle };
      });

      render(<GridGame />);

      // First cycle
      GameLogic.validateSolution.mockReturnValue(true);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByTestId('confirm-solution-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));

      // Second cycle
      GameLogic.validateSolution.mockReturnValue(false);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByTestId('confirm-solution-btn'));

      expect(GameLogic.generatePuzzle).toHaveBeenCalledTimes(2);
    });

    it('should reset game state between cycles', () => {
      render(<GridGame />);

      // First game
      fireEvent.click(screen.getByTestId('start-game-btn'));
      const cell = screen.getByTestId('cell-0-1');
      fireEvent.click(cell);
      expect(cell).toHaveClass('bg-red-200');

      // Win and restart
      GameLogic.validateSolution.mockReturnValue(true);
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByTestId('confirm-solution-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));
      fireEvent.click(screen.getByTestId('start-game-btn'));

      // State should be reset
      const newCell = screen.getByTestId('cell-0-1');
      expect(newCell).not.toHaveClass('bg-red-200');
      expect(screen.getByText('REMOVE')).toBeInTheDocument();
    });
  });

  describe('✅ Lifeline System', () => {
    it('should manage lifelines correctly', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));

      // Get lifeline display
      const getLifelines = () => {
        return screen.getByText('Lifelines:').nextSibling.textContent;
      };

      // Should start with 3
      expect(getLifelines()).toBe('3');

      // Click non-core position - no change
      fireEvent.click(screen.getByTestId('cell-0-1'));
      expect(getLifelines()).toBe('3');

      // Click core position - lose lifeline
      fireEvent.click(screen.getByTestId('cell-0-0'));
      expect(getLifelines()).toBe('2');
      expect(screen.getByTestId('cell-0-0')).toHaveClass('bg-red-200');
    });

    it('should end game when lifelines reach zero', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));

      // Lose all lifelines
      fireEvent.click(screen.getByTestId('cell-0-0')); // 3->2
      fireEvent.click(screen.getByTestId('cell-1-1')); // 2->1
      fireEvent.click(screen.getByTestId('cell-2-2')); // 1->0

      // Should be game over
      expect(screen.getByText('Game Over')).toBeInTheDocument();

      // Should not be able to interact with cells
      const cell = screen.getByTestId('cell-0-1');
      fireEvent.click(cell);
      expect(cell).not.toHaveClass('bg-red-200');
    });

    it('should reset lifelines on new game', () => {
      render(<GridGame />);

      // Lose some lifelines
      fireEvent.click(screen.getByTestId('start-game-btn'));
      fireEvent.click(screen.getByTestId('cell-0-0'));

      const getLifelines = () => screen.getByText('Lifelines:').nextSibling.textContent;
      expect(getLifelines()).toBe('2');

      // Win and restart
      GameLogic.validateSolution.mockReturnValue(true);
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByTestId('confirm-solution-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));
      fireEvent.click(screen.getByTestId('start-game-btn'));

      // Should be reset to 3
      expect(getLifelines()).toBe('3');
    });

    it('should handle lifeline system with unmarking', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));

      const getLifelines = () => screen.getByText('Lifelines:').nextSibling.textContent;
      const coreCell = screen.getByTestId('cell-0-0');

      // Mark core cell (lose lifeline)
      fireEvent.click(coreCell);
      expect(getLifelines()).toBe('2');
      expect(coreCell).toHaveClass('bg-red-200');

      // Unmark cell (lifeline not restored)
      fireEvent.click(coreCell);
      expect(getLifelines()).toBe('2');
      expect(coreCell).not.toHaveClass('bg-red-200');

      // Mark again (lose another lifeline)
      fireEvent.click(coreCell);
      expect(getLifelines()).toBe('1');
      expect(coreCell).toHaveClass('bg-red-200');
    });
  });

  describe('Integration Test Coverage Summary', () => {
    it('should demonstrate complete integration workflow', () => {
      render(<GridGame />);

      // ✅ Game State Management
      expect(screen.getByTestId('start-game-btn')).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('difficulty-medium'));
      fireEvent.click(screen.getByTestId('start-game-btn'));
      expect(GameLogic.generatePuzzle).toHaveBeenCalledWith('medium');

      // ✅ Component Interaction  
      const cell1 = screen.getByTestId('cell-0-1');
      const cell2 = screen.getByTestId('cell-0-0'); // Core position
      
      fireEvent.click(cell1); // Mark non-core
      fireEvent.click(cell2); // Mark core (lose lifeline)
      
      expect(cell1).toHaveClass('bg-red-200');
      expect(cell2).toHaveClass('bg-red-200');
      
      const getLifelines = () => screen.getByText('Lifelines:').nextSibling.textContent;
      expect(getLifelines()).toBe('2'); // Lost 1 lifeline

      // ✅ Game Flow
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      expect(screen.getByText('CONFIRM')).toBeInTheDocument();
      
      GameLogic.validateSolution.mockReturnValue(true);
      fireEvent.click(screen.getByTestId('confirm-solution-btn'));
      
      expect(screen.getByText('Congratulations!')).toBeInTheDocument();
      
      // ✅ State Reset
      fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));
      expect(screen.getByTestId('start-game-btn')).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('start-game-btn'));
      expect(getLifelines()).toBe('3'); // Reset to full lifelines
    });

    it('should handle error conditions gracefully', () => {
      render(<GridGame />);
      
      // Should not crash with rapid interactions
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      const cell = screen.getByTestId('cell-0-1');
      const modeBtn = screen.getByTestId('mode-toggle-btn');
      
      for (let i = 0; i < 3; i++) {
        fireEvent.click(cell);
        fireEvent.click(modeBtn);
        fireEvent.click(modeBtn);
      }
      
      // Should still be in consistent state
      expect(screen.getByText('REMOVE')).toBeInTheDocument();
      expect(cell).toHaveClass('bg-red-200');
    });
  });
});