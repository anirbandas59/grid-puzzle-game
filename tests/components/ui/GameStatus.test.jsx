import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GameStatus from '../../../src/components/ui/GameStatus';

describe('GameStatus Component', () => {
  describe('Lifelines Display', () => {
    it('should display full lifelines correctly', () => {
      render(<GameStatus lifelines={3} />);
      
      expect(screen.getByText('Lifelines: 3')).toBeInTheDocument();
    });

    it('should display reduced lifelines', () => {
      render(<GameStatus lifelines={1} />);
      
      expect(screen.getByText('Lifelines: 1')).toBeInTheDocument();
    });

    it('should display zero lifelines', () => {
      render(<GameStatus lifelines={0} />);
      
      expect(screen.getByText('Lifelines: 0')).toBeInTheDocument();
    });

    it('should handle negative lifelines gracefully', () => {
      render(<GameStatus lifelines={-1} />);
      
      expect(screen.getByText('Lifelines: -1')).toBeInTheDocument();
    });
  });

  describe('Visual Indicators', () => {
    it('should show hearts for full lifelines', () => {
      render(<GameStatus lifelines={3} />);
      
      const hearts = screen.getAllByText('❤️');
      expect(hearts).toHaveLength(3);
    });

    it('should show correct number of hearts for remaining lifelines', () => {
      render(<GameStatus lifelines={1} />);
      
      const hearts = screen.getAllByText('❤️');
      const brokenHearts = screen.getAllByText('💔');
      
      expect(hearts).toHaveLength(1);
      expect(brokenHearts).toHaveLength(2);
    });

    it('should show all broken hearts when no lifelines remain', () => {
      render(<GameStatus lifelines={0} />);
      
      const brokenHearts = screen.getAllByText('💔');
      expect(brokenHearts).toHaveLength(3);
      
      expect(screen.queryByText('❤️')).not.toBeInTheDocument();
    });
  });

  describe('Component Styling', () => {
    it('should have proper container classes', () => {
      render(<GameStatus lifelines={2} />);
      
      const container = screen.getByText('Lifelines: 2').parentElement;
      expect(container).toHaveClass('mb-4', 'text-center');
    });

    it('should apply warning styles when lifelines are low', () => {
      render(<GameStatus lifelines={1} />);
      
      const lifelineText = screen.getByText('Lifelines: 1');
      expect(lifelineText).toHaveClass('text-red-600', 'font-semibold');
    });

    it('should apply critical styles when no lifelines remain', () => {
      render(<GameStatus lifelines={0} />);
      
      const lifelineText = screen.getByText('Lifelines: 0');
      expect(lifelineText).toHaveClass('text-red-800', 'font-bold');
    });

    it('should use normal styles when lifelines are sufficient', () => {
      render(<GameStatus lifelines={3} />);
      
      const lifelineText = screen.getByText('Lifelines: 3');
      expect(lifelineText).toHaveClass('text-gray-800', 'font-medium');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for screen readers', () => {
      render(<GameStatus lifelines={2} />);
      
      const statusElement = screen.getByLabelText('Game status: 2 lifelines remaining');
      expect(statusElement).toBeInTheDocument();
    });

    it('should indicate critical state to screen readers', () => {
      render(<GameStatus lifelines={0} />);
      
      const statusElement = screen.getByLabelText('Game status: No lifelines remaining - Game over');
      expect(statusElement).toBeInTheDocument();
    });

    it('should have proper role attribute', () => {
      render(<GameStatus lifelines={1} />);
      
      const statusElement = screen.getByRole('status');
      expect(statusElement).toBeInTheDocument();
    });

    it('should provide alternative text for visual indicators', () => {
      render(<GameStatus lifelines={2} />);
      
      // Hearts should have screen reader friendly content
      const heartContainer = screen.getByText('❤️❤️💔');
      expect(heartContainer).toHaveAttribute('aria-label', '2 out of 3 lifelines remaining');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined lifelines', () => {
      expect(() => {
        render(<GameStatus />);
      }).not.toThrow();
    });

    it('should handle null lifelines', () => {
      expect(() => {
        render(<GameStatus lifelines={null} />);
      }).not.toThrow();
    });

    it('should handle string lifelines', () => {
      expect(() => {
        render(<GameStatus lifelines="2" />);
      }).not.toThrow();
    });

    it('should handle very high lifeline counts', () => {
      render(<GameStatus lifelines={10} />);
      
      expect(screen.getByText('Lifelines: 10')).toBeInTheDocument();
      // Should still show max 3 hearts for visual clarity
      const hearts = screen.getAllByText('❤️');
      expect(hearts.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Component Updates', () => {
    it('should update display when lifelines change', () => {
      const { rerender } = render(<GameStatus lifelines={3} />);
      
      expect(screen.getByText('Lifelines: 3')).toBeInTheDocument();
      
      rerender(<GameStatus lifelines={1} />);
      
      expect(screen.getByText('Lifelines: 1')).toBeInTheDocument();
    });

    it('should update visual indicators when lifelines decrease', () => {
      const { rerender } = render(<GameStatus lifelines={3} />);
      
      expect(screen.getAllByText('❤️')).toHaveLength(3);
      
      rerender(<GameStatus lifelines={1} />);
      
      expect(screen.getAllByText('❤️')).toHaveLength(1);
      expect(screen.getAllByText('💔')).toHaveLength(2);
    });

    it('should handle rapid lifeline changes', () => {
      const { rerender } = render(<GameStatus lifelines={3} />);
      
      rerender(<GameStatus lifelines={2} />);
      rerender(<GameStatus lifelines={1} />);
      rerender(<GameStatus lifelines={0} />);
      
      expect(screen.getByText('Lifelines: 0')).toBeInTheDocument();
      expect(screen.getAllByText('💔')).toHaveLength(3);
    });
  });

  describe('Performance', () => {
    it('should not unnecessarily re-render with same props', () => {
      const { rerender } = render(<GameStatus lifelines={2} />);
      
      const originalElement = screen.getByText('Lifelines: 2');
      
      rerender(<GameStatus lifelines={2} />);
      
      expect(screen.getByText('Lifelines: 2')).toBe(originalElement);
    });
  });
});