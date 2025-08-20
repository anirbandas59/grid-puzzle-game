import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GridGame from '../../src/components/GridGame';
import * as GameLogic from '../../src/utils/GameLogic';

// Mock the GameLogic module
vi.mock('../../src/utils/GameLogic', () => ({
  generatePuzzle: vi.fn(),
  validateSolution: vi.fn(),
}));

describe('GridGame Component - Core Functionality', () => {
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

  describe('✅ Individual Component Rendering', () => {
    it('should render main title', () => {
      render(<GridGame />);
      expect(screen.getByText('Number Puzzle Game')).toBeInTheDocument();
    });

    it('should render difficulty selection interface', () => {
      render(<GridGame />);
      expect(screen.getByTestId('difficulty-easy')).toBeInTheDocument();
      expect(screen.getByTestId('difficulty-medium')).toBeInTheDocument();
      expect(screen.getByTestId('difficulty-hard')).toBeInTheDocument();
      expect(screen.getByTestId('start-game-btn')).toBeInTheDocument();
    });

    it('should render game grid after starting', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      expect(screen.getByTestId('cell-0-0')).toBeInTheDocument();
      expect(screen.getByTestId('cell-3-3')).toBeInTheDocument();
    });

    it('should render game status elements', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      expect(screen.getAllByText('3')).toHaveLength(1); // Lifeline count
      expect(screen.getByText('REMOVE')).toBeInTheDocument();
    });

    it('should render mode toggle controls', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      expect(screen.getByTestId('mode-toggle-btn')).toBeInTheDocument();
    });
  });

  describe('✅ User Interactions', () => {
    it('should handle difficulty selection clicks', () => {
      render(<GridGame />);
      
      fireEvent.click(screen.getByTestId('difficulty-medium'));
      expect(screen.getByTestId('difficulty-medium')).toHaveClass('bg-blue-600');
      
      fireEvent.click(screen.getByTestId('start-game-btn'));
      expect(GameLogic.generatePuzzle).toHaveBeenCalledWith('medium');
    });

    it('should handle cell clicks and mark cells', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      const cell = screen.getByTestId('cell-0-1');
      fireEvent.click(cell);
      
      expect(cell).toHaveClass('bg-red-200');
    });

    it('should handle mode changes', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      expect(screen.getByText('REMOVE')).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      expect(screen.getByText('CONFIRM')).toBeInTheDocument();
    });

    it('should handle solution confirmation', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      
      expect(screen.getByRole('button', { name: 'Confirm Solution' })).toBeInTheDocument();
      
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      expect(GameLogic.validateSolution).toHaveBeenCalled();
    });
  });

  describe('✅ Props Handling and State Updates', () => {
    it('should maintain state when switching modes', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      // Mark a cell
      const cell = screen.getByTestId('cell-0-1');
      fireEvent.click(cell);
      expect(cell).toHaveClass('bg-red-200');
      
      // Switch modes
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      
      // Cell should still be marked
      expect(cell).toHaveClass('bg-red-200');
    });

    it('should update game state when puzzle is generated', () => {
      render(<GridGame />);
      
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      // Should call generatePuzzle with default difficulty
      expect(GameLogic.generatePuzzle).toHaveBeenCalledWith('easy');
      
      // Should display grid values from mock
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('9')).toBeInTheDocument();
    });

    it('should handle win/lose state transitions', () => {
      GameLogic.validateSolution.mockReturnValue(true);
      
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      
      expect(screen.getByText('Congratulations!')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Play Again' })).toBeInTheDocument();
    });

    it('should reset to setup when play again is clicked', () => {
      GameLogic.validateSolution.mockReturnValue(true);
      
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      
      fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));
      
      // Should be back to setup
      expect(screen.getByTestId('start-game-btn')).toBeInTheDocument();
    });
  });

  describe('✅ Accessibility Features', () => {
    it('should have proper button labels and roles', () => {
      render(<GridGame />);
      
      expect(screen.getByRole('button', { name: 'Start Game' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '4x4 Grid' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '5x5 Grid' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '6x6 Grid' })).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<GridGame />);
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Number Puzzle Game');
      
      fireEvent.click(screen.getByTestId('start-game-btn'));
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('How to Play:');
    });

    it('should have data-testid attributes for interactive elements', () => {
      render(<GridGame />);
      
      expect(screen.getByTestId('difficulty-easy')).toBeInTheDocument();
      expect(screen.getByTestId('start-game-btn')).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      expect(screen.getByTestId('mode-toggle-btn')).toBeInTheDocument();
      expect(screen.getByTestId('cell-0-0')).toBeInTheDocument();
    });

    it('should provide clear visual feedback for user actions', () => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      const cell = screen.getByTestId('cell-0-1');
      
      // Initial state
      expect(cell).toHaveClass('bg-white');
      
      // After clicking
      fireEvent.click(cell);
      expect(cell).toHaveClass('bg-red-200');
      
      // Should have line-through for removed cells
      expect(cell).toHaveClass('line-through');
    });

    it('should maintain keyboard accessibility', () => {
      render(<GridGame />);
      
      const startButton = screen.getByTestId('start-game-btn');
      expect(startButton.tagName).toBe('BUTTON');
      
      fireEvent.click(startButton);
      
      const modeButton = screen.getByTestId('mode-toggle-btn');
      expect(modeButton.tagName).toBe('BUTTON');
    });
  });
});