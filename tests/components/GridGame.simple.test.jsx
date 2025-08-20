import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GridGame from '../../src/components/GridGame';
import * as GameLogic from '../../src/utils/GameLogic';

// Mock the GameLogic module
vi.mock('../../src/utils/GameLogic', () => ({
  generatePuzzle: vi.fn(),
  validateSolution: vi.fn(),
}));

describe('GridGame Component - Simplified Tests', () => {
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
    it('should render the main title', () => {
      render(<GridGame />);
      expect(screen.getByText('Number Puzzle Game')).toBeInTheDocument();
    });

    it('should render difficulty selection buttons', () => {
      render(<GridGame />);
      expect(screen.getByTestId('difficulty-easy')).toBeInTheDocument();
      expect(screen.getByTestId('difficulty-medium')).toBeInTheDocument();
      expect(screen.getByTestId('difficulty-hard')).toBeInTheDocument();
    });

    it('should show start game button', () => {
      render(<GridGame />);
      expect(screen.getByTestId('start-game-btn')).toBeInTheDocument();
    });
  });

  describe('Game Flow', () => {
    it('should start game when button is clicked', () => {
      render(<GridGame />);
      
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      expect(GameLogic.generatePuzzle).toHaveBeenCalledWith('easy');
    });

    it('should change difficulty before starting', () => {
      render(<GridGame />);
      
      fireEvent.click(screen.getByTestId('difficulty-medium'));
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      expect(GameLogic.generatePuzzle).toHaveBeenCalledWith('medium');
    });

    it('should show game grid after starting', () => {
      render(<GridGame />);
      
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      // Should show grid cells
      expect(screen.getByTestId('cell-0-0')).toBeInTheDocument();
      expect(screen.getByTestId('cell-3-3')).toBeInTheDocument();
    });

    it('should show lifelines after starting', () => {
      render(<GridGame />);
      
      fireEvent.click(screen.getByTestId('start-game-btn'));
      
      expect(screen.getByText('Lifelines:')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    beforeEach(() => {
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
    });

    it('should handle cell clicks', () => {
      const cell = screen.getByTestId('cell-0-1');
      
      fireEvent.click(cell);
      
      // Should mark the cell
      expect(cell).toHaveClass('bg-red-200');
    });

    it('should toggle mode when button is clicked', () => {
      expect(screen.getByText('REMOVE')).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      
      expect(screen.getByText('CONFIRM')).toBeInTheDocument();
    });

    it('should validate solution in confirm mode', () => {
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      
      expect(GameLogic.validateSolution).toHaveBeenCalled();
    });
  });

  describe('Win/Lose States', () => {
    it('should show win message when puzzle is solved', () => {
      GameLogic.validateSolution.mockReturnValue(true);
      
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      
      expect(screen.getByText('Congratulations!')).toBeInTheDocument();
    });

    it('should show lose message when solution is wrong', () => {
      GameLogic.validateSolution.mockReturnValue(false);
      
      render(<GridGame />);
      fireEvent.click(screen.getByTestId('start-game-btn'));
      fireEvent.click(screen.getByTestId('mode-toggle-btn'));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      
      expect(screen.getByText('Game Over')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button labels', () => {
      render(<GridGame />);
      
      expect(screen.getByRole('button', { name: 'Start Game' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '4x4 Grid' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '5x5 Grid' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '6x6 Grid' })).toBeInTheDocument();
    });

    it('should have proper heading structure', () => {
      render(<GridGame />);
      
      expect(screen.getByRole('heading', { level: 1, name: 'Number Puzzle Game' })).toBeInTheDocument();
    });
  });
});