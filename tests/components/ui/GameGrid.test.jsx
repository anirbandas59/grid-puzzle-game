import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GameGrid from '../../../src/components/ui/GameGrid';

describe('GameGrid Component', () => {
  const mockProps = {
    grid: [
      [1, 2, 3],
      [4, 5, 6], 
      [7, 8, 9]
    ],
    targets: {
      rows: [6, 15, 24],
      cols: [12, 15, 18]
    },
    markedForRemoval: new Set(['0,1', '1,2']),
    onCellClick: vi.fn(),
    mode: 'remove'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Grid Rendering', () => {
    it('should render all grid cells with correct values', () => {
      render(<GameGrid {...mockProps} />);
      
      // Check that all numbers are rendered
      for (let i = 1; i <= 9; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }
    });

    it('should render target sums for rows and columns', () => {
      render(<GameGrid {...mockProps} />);
      
      // Check row targets
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('24')).toBeInTheDocument();
      
      // Check column targets
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('18')).toBeInTheDocument();
    });

    it('should apply correct grid layout classes', () => {
      render(<GameGrid {...mockProps} />);
      
      const gridContainer = screen.getByTestId('game-grid');
      expect(gridContainer).toHaveClass('grid', 'grid-cols-3', 'gap-1');
    });

    it('should render with correct data-testid attributes', () => {
      render(<GameGrid {...mockProps} />);
      
      expect(screen.getByTestId('cell-0-0')).toBeInTheDocument();
      expect(screen.getByTestId('cell-1-1')).toBeInTheDocument();
      expect(screen.getByTestId('cell-2-2')).toBeInTheDocument();
    });
  });

  describe('Cell Interactions', () => {
    it('should call onCellClick when cell is clicked', () => {
      render(<GameGrid {...mockProps} />);
      
      const cell = screen.getByTestId('cell-1-1');
      fireEvent.click(cell);
      
      expect(mockProps.onCellClick).toHaveBeenCalledWith(1, 1);
    });

    it('should handle multiple cell clicks', () => {
      render(<GameGrid {...mockProps} />);
      
      fireEvent.click(screen.getByTestId('cell-0-0'));
      fireEvent.click(screen.getByTestId('cell-2-2'));
      
      expect(mockProps.onCellClick).toHaveBeenCalledWith(0, 0);
      expect(mockProps.onCellClick).toHaveBeenCalledWith(2, 2);
      expect(mockProps.onCellClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Visual States', () => {
    it('should highlight cells marked for removal', () => {
      render(<GameGrid {...mockProps} />);
      
      // Cells (0,1) and (1,2) should be marked
      expect(screen.getByTestId('cell-0-1')).toHaveClass('bg-red-100');
      expect(screen.getByTestId('cell-1-2')).toHaveClass('bg-red-100');
      
      // Other cells should not be marked
      expect(screen.getByTestId('cell-0-0')).not.toHaveClass('bg-red-100');
    });

    it('should show different styling in confirm mode', () => {
      render(<GameGrid {...mockProps} mode="confirm" />);
      
      // In confirm mode, marked cells should have different styling
      expect(screen.getByTestId('cell-0-1')).toHaveClass('bg-red-100');
    });

    it('should handle empty markedForRemoval set', () => {
      render(<GameGrid {...mockProps} markedForRemoval={new Set()} />);
      
      // No cells should be marked
      expect(screen.getByTestId('cell-0-0')).not.toHaveClass('bg-red-100');
      expect(screen.getByTestId('cell-1-1')).not.toHaveClass('bg-red-100');
    });
  });

  describe('Accessibility', () => {
    it('should have proper tabindex for keyboard navigation', () => {
      render(<GameGrid {...mockProps} />);
      
      const cells = screen.getAllByRole('button');
      cells.forEach(cell => {
        expect(cell).toHaveAttribute('tabindex', '0');
      });
    });

    it('should have appropriate ARIA labels for grid cells', () => {
      render(<GameGrid {...mockProps} />);
      
      const cell = screen.getByTestId('cell-0-0');
      expect(cell).toHaveAttribute('aria-label', 'Cell at row 1, column 1, value 1');
    });

    it('should indicate marked cells in ARIA labels', () => {
      render(<GameGrid {...mockProps} />);
      
      const markedCell = screen.getByTestId('cell-0-1');
      expect(markedCell).toHaveAttribute('aria-label', 'Cell at row 1, column 2, value 2, marked for removal');
    });

    it('should support keyboard interaction', () => {
      render(<GameGrid {...mockProps} />);
      
      const cell = screen.getByTestId('cell-0-0');
      fireEvent.keyDown(cell, { key: 'Enter' });
      
      expect(mockProps.onCellClick).toHaveBeenCalledWith(0, 0);
    });

    it('should support space key for activation', () => {
      render(<GameGrid {...mockProps} />);
      
      const cell = screen.getByTestId('cell-1-1');
      fireEvent.keyDown(cell, { key: ' ' });
      
      expect(mockProps.onCellClick).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('Different Grid Sizes', () => {
    it('should handle 4x4 grid correctly', () => {
      const fourByFourProps = {
        ...mockProps,
        grid: Array(4).fill().map((_, i) => 
          Array(4).fill().map((_, j) => i * 4 + j + 1)
        ),
        targets: {
          rows: [10, 26, 42, 58],
          cols: [40, 44, 48, 52]
        }
      };
      
      render(<GameGrid {...fourByFourProps} />);
      
      expect(screen.getByTestId('game-grid')).toHaveClass('grid-cols-4');
      expect(screen.getByTestId('cell-3-3')).toBeInTheDocument();
    });

    it('should handle 6x6 grid correctly', () => {
      const sixBySixProps = {
        ...mockProps,
        grid: Array(6).fill().map((_, i) => 
          Array(6).fill().map((_, j) => i * 6 + j + 1)
        ),
        targets: {
          rows: Array(6).fill(21),
          cols: Array(6).fill(91)
        }
      };
      
      render(<GameGrid {...sixBySixProps} />);
      
      expect(screen.getByTestId('game-grid')).toHaveClass('grid-cols-6');
      expect(screen.getByTestId('cell-5-5')).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    it('should handle missing onCellClick gracefully', () => {
      const propsWithoutHandler = { ...mockProps, onCellClick: undefined };
      
      expect(() => {
        render(<GameGrid {...propsWithoutHandler} />);
      }).not.toThrow();
    });

    it('should handle empty grid array', () => {
      const emptyGridProps = { ...mockProps, grid: [] };
      
      render(<GameGrid {...emptyGridProps} />);
      
      // Should not crash and should render empty state
      expect(screen.queryByTestId('cell-0-0')).not.toBeInTheDocument();
    });
  });
});