import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GridGame from '../../src/components/GridGame';
import * as GameLogic from '../../src/utils/GameLogic';

// Mock the GameLogic module
vi.mock('../../src/utils/GameLogic', () => ({
  generatePuzzle: vi.fn(),
  validateSolution: vi.fn(),
}));

describe('GridGame Component', () => {
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
    GameLogic.validateSolution.mockReturnValue(true);
  });

  describe('Initial Rendering', () => {
    it('should render the main game title', () => {
      render(<GridGame />);
      expect(screen.getByText('Number Puzzle Game')).toBeInTheDocument();
    });

    it('should start in setup mode', () => {
      render(<GridGame />);
      expect(screen.getByText('Choose difficulty and Play!')).toBeInTheDocument();
    });

    it('should render difficulty selector with all options', () => {
      render(<GridGame />);
      expect(screen.getByTestId('difficulty-easy')).toBeInTheDocument();
      expect(screen.getByTestId('difficulty-medium')).toBeInTheDocument();
      expect(screen.getByTestId('difficulty-hard')).toBeInTheDocument();
    });

    it('should have Easy difficulty selected by default', () => {
      render(<GridGame />);
      expect(screen.getByTestId('difficulty-easy')).toHaveClass('bg-blue-600');
    });

    it('should show start game button', () => {
      render(<GridGame />);
      expect(screen.getByRole('button', { name: 'Start Game' })).toBeInTheDocument();
    });
  });

  describe('Game Setup and Initialization', () => {
    it('should change difficulty when button is clicked', () => {
      render(<GridGame />);
      
      const mediumOption = screen.getByTestId('difficulty-medium');
      fireEvent.click(mediumOption);
      
      expect(mediumOption).toHaveClass('bg-blue-600');
      expect(screen.getByTestId('difficulty-easy')).not.toHaveClass('bg-blue-600');
    });

    it('should generate puzzle with correct difficulty when starting game', () => {
      render(<GridGame />);
      
      // Select medium difficulty
      fireEvent.click(screen.getByTestId('difficulty-medium'));
      
      // Start game
      fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));
      
      expect(GameLogic.generatePuzzle).toHaveBeenCalledWith('medium');
    });

    it('should transition to playing state after starting game', () => {
      render(<GridGame />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));
      
      // Should now show game grid and controls
      expect(screen.getByText('Lifelines: 3')).toBeInTheDocument();
      expect(screen.getByText('Mode: Remove')).toBeInTheDocument();
    });

    it('should display the generated grid', () => {
      render(<GridGame />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));
      
      // Check for some grid values
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('9')).toBeInTheDocument();
    });

    it('should display target sums', () => {
      render(<GridGame />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));
      
      // Check for target values
      expect(screen.getByText('10')).toBeInTheDocument(); // First row target
      expect(screen.getByText('19')).toBeInTheDocument(); // First col target
    });
  });

  describe('Game Interactions', () => {
    beforeEach(() => {
      render(<GridGame />);
      fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));
    });

    it('should toggle cell removal when clicked in remove mode', () => {
      // Find a grid cell and click it
      const gridCell = screen.getByTestId('cell-0-1'); // Non-core position
      
      fireEvent.click(gridCell);
      
      // Cell should now be marked for removal (have specific styling)
      expect(gridCell).toHaveClass('bg-red-200');
      
      // Click again to unmark
      fireEvent.click(gridCell);
      expect(gridCell).not.toHaveClass('bg-red-200');
    });

    it('should reduce lifelines when core position is clicked', () => {
      // Click on a core position (0,0)
      const coreCell = screen.getByTestId('cell-0-0');
      
      fireEvent.click(coreCell);
      
      expect(screen.getByText('Lifelines: 2')).toBeInTheDocument();
    });

    it('should end game when lifelines reach zero', () => {
      // Click core positions 3 times to lose all lifelines
      const coreCell = screen.getByTestId('cell-0-0');
      
      fireEvent.click(coreCell); // 2 lifelines
      fireEvent.click(coreCell); // Unmark
      fireEvent.click(coreCell); // 2 lifelines
      fireEvent.click(coreCell); // Unmark  
      fireEvent.click(coreCell); // 2 lifelines
      
      // Click different core positions
      fireEvent.click(screen.getByTestId('cell-1-1')); // 1 lifeline
      fireEvent.click(screen.getByTestId('cell-2-2')); // 0 lifelines
      
      expect(screen.getByText('Game Over')).toBeInTheDocument();
    });

    it('should switch modes when toggle button is clicked', () => {
      expect(screen.getByText('Mode: Remove')).toBeInTheDocument();
      
      fireEvent.click(screen.getByRole('button', { name: 'Switch to Confirm' }));
      
      expect(screen.getByText('Mode: Confirm')).toBeInTheDocument();
    });

    it('should show confirm solution button in confirm mode', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Switch to Confirm' }));
      
      expect(screen.getByRole('button', { name: 'Confirm Solution' })).toBeInTheDocument();
    });

    it('should validate solution when confirm button is clicked', () => {
      // Mark some cells for removal first
      fireEvent.click(screen.getByTestId('cell-0-1'));
      fireEvent.click(screen.getByTestId('cell-1-0'));
      
      // Switch to confirm mode
      fireEvent.click(screen.getByRole('button', { name: 'Switch to Confirm' }));
      
      // Confirm solution
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      
      expect(GameLogic.validateSolution).toHaveBeenCalled();
    });

    it('should show win message when solution is correct', () => {
      GameLogic.validateSolution.mockReturnValue(true);
      
      // Switch to confirm and validate
      fireEvent.click(screen.getByRole('button', { name: 'Switch to Confirm' }));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      
      expect(screen.getByText('Congratulations!')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Play Again' })).toBeInTheDocument();
    });

    it('should show lose message when solution is incorrect', () => {
      GameLogic.validateSolution.mockReturnValue(false);
      
      // Switch to confirm and validate
      fireEvent.click(screen.getByRole('button', { name: 'Switch to Confirm' }));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      
      expect(screen.getByText('Game Over')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    });
  });

  describe('Game Reset and Restart', () => {
    it('should reset to setup when Play Again is clicked', () => {
      render(<GridGame />);
      
      // Start and win a game
      fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));
      GameLogic.validateSolution.mockReturnValue(true);
      fireEvent.click(screen.getByRole('button', { name: 'Switch to Confirm' }));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      
      // Click Play Again
      fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));
      
      // Should be back to setup
      expect(screen.getByText('Choose Difficulty:')).toBeInTheDocument();
    });

    it('should reset to setup when Try Again is clicked', () => {
      render(<GridGame />);
      
      // Start and lose a game
      fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));
      GameLogic.validateSolution.mockReturnValue(false);
      fireEvent.click(screen.getByRole('button', { name: 'Switch to Confirm' }));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      
      // Click Try Again
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
      
      // Should be back to setup
      expect(screen.getByText('Choose Difficulty:')).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('should maintain marked cells when switching modes', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));
      
      // Mark a cell
      const cell = screen.getByTestId('cell-0-1');
      fireEvent.click(cell);
      expect(cell).toHaveClass('bg-red-100');
      
      // Switch to confirm mode
      fireEvent.click(screen.getByRole('button', { name: 'Switch to Confirm' }));
      
      // Cell should still be marked
      expect(cell).toHaveClass('bg-red-100');
    });

    it('should prevent cell clicks when game is over', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));
      
      // End the game by losing all lifelines
      fireEvent.click(screen.getByTestId('cell-0-0')); // Core position
      fireEvent.click(screen.getByTestId('cell-1-1')); // Core position  
      fireEvent.click(screen.getByTestId('cell-2-2')); // Core position
      
      // Try to click another cell - should not respond
      const cell = screen.getByTestId('cell-0-1');
      fireEvent.click(cell);
      expect(cell).not.toHaveClass('bg-red-100');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for difficulty selection', () => {
      render(<GridGame />);
      
      expect(screen.getByLabelText('Easy (4x4)')).toBeInTheDocument();
      expect(screen.getByLabelText('Medium (5x5)')).toBeInTheDocument();
      expect(screen.getByLabelText('Hard (6x6)')).toBeInTheDocument();
    });

    it('should have accessible button labels', () => {
      render(<GridGame />);
      
      expect(screen.getByRole('button', { name: 'Start Game' })).toBeInTheDocument();
      
      fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));
      
      expect(screen.getByRole('button', { name: 'Switch to Confirm' })).toBeInTheDocument();
    });

    it('should provide keyboard navigation for grid cells', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));
      
      const cell = screen.getByTestId('cell-0-0');
      expect(cell).toHaveAttribute('tabindex', '0');
    });
  });
});