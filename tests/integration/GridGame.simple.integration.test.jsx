import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GridGame from '../../src/components/GridGame';
import * as GameLogic from '../../src/utils/GameLogic';

// Mock the GameLogic module
vi.mock('../../src/utils/GameLogic', () => ({
  generatePuzzle: vi.fn(),
  validateSolution: vi.fn(),
}));

describe('GridGame Integration Tests - Core Flows', () => {
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
    it('should manage complete game state transitions', () => {
      render(<GridGame />);

      // Initial state - Setup phase
      expect(screen.getByTestId('start-game-btn')).toBeInTheDocument();
      expect(screen.queryByTestId('mode-toggle-btn')).not.toBeInTheDocument();

      // Transition to playing state
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      expect(screen.getByTestId('mode-toggle-btn')).toBeInTheDocument();
      expect(screen.getByTestId('cell-0-0')).toBeInTheDocument();
      expect(GameLogic.generatePuzzle).toHaveBeenCalledWith('easy');
    });

    it('should preserve marked cells across mode changes', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));

      // Mark cells
      const cell1 = screen.getByTestId('cell-0-1');
      const cell2 = screen.getByTestId('cell-1-0');
      
      fireEvent.click(cell1);
      fireEvent.click(cell2);
      
      expect(cell1).toHaveClass('bg-red-200');
      expect(cell2).toHaveClass('bg-red-200');

      // Switch modes
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      expect(screen.getByText('CONFIRM')).toBeInTheDocument();
      
      // Cells should still be marked
      expect(cell1).toHaveClass('bg-red-200');
      expect(cell2).toHaveClass('bg-red-200');

      // Switch back
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      expect(screen.getByText('REMOVE')).toBeInTheDocument();
      
      // Cells should still be marked
      expect(cell1).toHaveClass('bg-red-200');
      expect(cell2).toHaveClass('bg-red-200');
    });

    it('should handle difficulty selection state', () => {
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
    it('should handle full user interaction workflow', () => {
      render(<GridGame />);

      // Phase 1: Setup
      fireEvent.click(screen.getByTestId('difficulty-hard'));
      fireEvent.click(screen.getByTestId('start-game-btn'));

      // Phase 2: Playing - Remove mode
      expect(screen.getByText('REMOVE')).toBeInTheDocument();
      
      const cell = screen.getByTestId('cell-0-1');
      fireEvent.click(cell);
      expect(cell).toHaveClass('bg-red-200');

      // Phase 3: Playing - Confirm mode
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      expect(screen.getByText('CONFIRM')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Confirm Solution' })).toBeInTheDocument();

      // Phase 4: Solution confirmation
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      expect(GameLogic.validateSolution).toHaveBeenCalled();
    });

    it('should handle component communication between UI elements', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));

      // GameStatus and GameControls should be synchronized
      expect(screen.getByText('REMOVE')).toBeInTheDocument();
      
      // Mode change should update both
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      expect(screen.getByText('CONFIRM')).toBeInTheDocument();
      
      // Game controls should show appropriate buttons
      expect(screen.getByRole('button', { name: 'Confirm Solution' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Switch to Remove' })).toBeInTheDocument();
    });
  });

  describe('✅ Game Flow (Setup → Playing → Won/Lost)', () => {
    it('should complete winning game flow', () => {
      GameLogic.validateSolution.mockReturnValue(true);
      
      render(<GridGame />);

      // Setup → Playing
      expect(screen.getByTestId('start-game-btn')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('start-game-btn'));

      // Playing phase
      expect(screen.getByTestId('mode-toggle-btn')).toBeInTheDocument();
      expect(screen.queryByText('Congratulations!')).not.toBeInTheDocument();

      // Make moves and confirm
      fireEvent.click(screen.getByTestId('cell-0-1'));
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));

      // Won state
      expect(screen.getByText('Congratulations!')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Play Again' })).toBeInTheDocument();
      expect(screen.queryByTestId('mode-toggle-btn')).not.toBeInTheDocument();

      // Back to setup
      fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));
      expect(screen.getByTestId('start-game-btn')).toBeInTheDocument();
      expect(screen.queryByText('Congratulations!')).not.toBeInTheDocument();
    });

    it('should complete losing game flow', () => {
      GameLogic.validateSolution.mockReturnValue(false);
      
      render(<GridGame />);

      // Setup → Playing → Lost
      fireEvent.click(screen.getByTestId('start-game-btn'));
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));

      // Lost state
      expect(screen.getByText('Game Over')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();

      // Back to setup
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

      // First cycle - win
      GameLogic.validateSolution.mockReturnValue(true);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));

      // Second cycle - lose  
      GameLogic.validateSolution.mockReturnValue(false);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));

      expect(GameLogic.generatePuzzle).toHaveBeenCalledTimes(2);
      expect(gameCount).toBe(2);
    });

    it('should reset game state between cycles', () => {
      render(<GridGame />);

      // First game - mark cells and win
      fireEvent.click(screen.getByTestId('start-game-btn'));
      const cell = screen.getByTestId('cell-0-1');
      fireEvent.click(cell);
      expect(cell).toHaveClass('bg-red-200');

      GameLogic.validateSolution.mockReturnValue(true);
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));

      // Start new game
      fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));
      fireEvent.click(screen.getByTestId('start-game-btn'));

      // State should be reset
      const newCell = screen.getByTestId('cell-0-1');
      expect(newCell).not.toHaveClass('bg-red-200');
      expect(screen.getByText('REMOVE')).toBeInTheDocument();
    });
  });

  describe('✅ Lifeline System', () => {
    it('should handle lifeline mechanics correctly', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));

      // Should start with 3 lifelines (check by finding the specific lifeline display)
      const lifelineSpan = screen.getByText('Lifelines:').nextSibling;
      expect(lifelineSpan.textContent).toBe('3');

      // Click non-core position - no lifeline loss
      fireEvent.click(screen.getByTestId('cell-0-1'));
      expect(lifelineSpan.textContent).toBe('3');

      // Click core position - lose lifeline
      fireEvent.click(screen.getByTestId('cell-0-0'));
      expect(lifelineSpan.textContent).toBe('2');
      expect(screen.getByTestId('cell-0-0')).toHaveClass('bg-red-200');
    });

    it('should end game when lifelines reach zero', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));

      // Lose all lifelines by clicking core positions
      fireEvent.click(screen.getByTestId('cell-0-0')); // 3->2
      fireEvent.click(screen.getByTestId('cell-1-1')); // 2->1
      fireEvent.click(screen.getByTestId('cell-2-2')); // 1->0

      // Should be game over
      expect(screen.getByText('Game Over')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();

      // Should not be able to interact with grid
      const cell = screen.getByTestId('cell-0-1');
      fireEvent.click(cell);
      expect(cell).not.toHaveClass('bg-red-200');
    });

    it('should reset lifelines on new game', () => {
      render(<GridGame />);

      // Start game and lose lifelines
      fireEvent.click(screen.getByTestId('start-game-btn'));
      fireEvent.click(screen.getByTestId('cell-0-0'));
      
      const lifelineSpan = screen.getByText('Lifelines:').nextSibling;
      expect(lifelineSpan.textContent).toBe('2');

      // Win and restart
      GameLogic.validateSolution.mockReturnValue(true);
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));
      fireEvent.click(screen.getByTestId('start-game-btn'));

      // Should have full lifelines again
      const newLifelineSpan = screen.getByText('Lifelines:').nextSibling;
      expect(newLifelineSpan.textContent).toBe('3');
    });

    it('should handle lifeline system with cell unmarking', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));

      const lifelineSpan = screen.getByText('Lifelines:').nextSibling;
      const coreCell = screen.getByTestId('cell-0-0');

      // Mark core cell (lose lifeline)
      fireEvent.click(coreCell);
      expect(lifelineSpan.textContent).toBe('2');
      expect(coreCell).toHaveClass('bg-red-200');

      // Unmark cell (lifeline not restored)
      fireEvent.click(coreCell);
      expect(lifelineSpan.textContent).toBe('2');
      expect(coreCell).not.toHaveClass('bg-red-200');

      // Mark again (lose another lifeline)
      fireEvent.click(coreCell);
      expect(lifelineSpan.textContent).toBe('1');
      expect(coreCell).toHaveClass('bg-red-200');
    });
  });

  describe('Integration Reliability Tests', () => {
    it('should handle rapid user interactions consistently', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));

      const cell = screen.getByTestId('cell-0-1');
      const modeBtn = screen.getByTestId('mode-toggle-btn');

      // Rapid interactions
      for (let i = 0; i < 5; i++) {
        fireEvent.click(cell);
        fireEvent.click(modeBtn);
        fireEvent.click(modeBtn);
      }

      // Should maintain consistent state
      expect(screen.getByText('REMOVE')).toBeInTheDocument();
      expect(cell).toHaveClass('bg-red-200');
    });

    it('should maintain data integrity across complex interactions', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));

      // Complex interaction sequence
      fireEvent.click(screen.getByTestId('cell-0-1')); // Mark non-core
      fireEvent.click(screen.getByTestId('cell-0-0')); // Mark core (lose lifeline)
      fireEvent.click(screen.getByTestId('mode-toggle-btn')); // Switch mode
      fireEvent.click(screen.getByTestId('cell-1-0')); // Mark another in confirm mode
      fireEvent.click(screen.getByTestId('mode-toggle-btn')); // Switch back

      // Verify state consistency
      expect(screen.getByTestId('cell-0-1')).toHaveClass('bg-red-200');
      expect(screen.getByTestId('cell-0-0')).toHaveClass('bg-red-200');
      expect(screen.getByTestId('cell-1-0')).toHaveClass('bg-red-200');
      
      const lifelineSpan = screen.getByText('Lifelines:').nextSibling;
      expect(lifelineSpan.textContent).toBe('2');
    });

    it('should handle GameLogic integration correctly', () => {
      render(<GridGame />);

      // Track calls to GameLogic
      fireEvent.click(screen.getByTestId('start-game-btn'));
      expect(GameLogic.generatePuzzle).toHaveBeenCalledTimes(1);
      expect(GameLogic.generatePuzzle).toHaveBeenCalledWith('easy');

      // Mark cells and validate
      fireEvent.click(screen.getByTestId('cell-0-1'));
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));

      expect(GameLogic.validateSolution).toHaveBeenCalledTimes(1);
      expect(GameLogic.validateSolution).toHaveBeenCalledWith(
        mockPuzzle.grid,
        mockPuzzle.targets,
        new Set(['0,1'])
      );
    });
  });
});