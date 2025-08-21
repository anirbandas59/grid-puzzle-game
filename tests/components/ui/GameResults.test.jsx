import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GameResults from '../../../src/components/ui/GameResults';

describe('GameResults Component', () => {
  const mockProps = {
    onPlayAgain: vi.fn(),
    onTryAgain: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Win State', () => {
    it('should display congratulations message for win', () => {
      render(<GameResults status="won" {...mockProps} />);
      
      expect(screen.getByText('Congratulations!')).toBeInTheDocument();
      expect(screen.getByText('You solved the puzzle!')).toBeInTheDocument();
    });

    it('should show Play Again button for win state', () => {
      render(<GameResults status="won" {...mockProps} />);
      
      expect(screen.getByRole('button', { name: 'Play Again' })).toBeInTheDocument();
    });

    it('should call onPlayAgain when Play Again is clicked', () => {
      render(<GameResults status="won" {...mockProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));
      
      expect(mockProps.onPlayAgain).toHaveBeenCalledTimes(1);
    });

    it('should not show Try Again button for win state', () => {
      render(<GameResults status="won" {...mockProps} />);
      
      expect(screen.queryByRole('button', { name: 'Try Again' })).not.toBeInTheDocument();
    });

    it('should display win celebration emoji', () => {
      render(<GameResults status="won" {...mockProps} />);
      
      expect(screen.getByText('🎉')).toBeInTheDocument();
    });
  });

  describe('Lose State', () => {
    it('should display game over message for loss', () => {
      render(<GameResults status="lost" {...mockProps} />);
      
      expect(screen.getByText('Game Over')).toBeInTheDocument();
      expect(screen.getByText('Better luck next time!')).toBeInTheDocument();
    });

    it('should show Try Again button for lose state', () => {
      render(<GameResults status="lost" {...mockProps} />);
      
      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    });

    it('should call onTryAgain when Try Again is clicked', () => {
      render(<GameResults status="lost" {...mockProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
      
      expect(mockProps.onTryAgain).toHaveBeenCalledTimes(1);
    });

    it('should not show Play Again button for lose state', () => {
      render(<GameResults status="lost" {...mockProps} />);
      
      expect(screen.queryByRole('button', { name: 'Play Again' })).not.toBeInTheDocument();
    });

    it('should display lose emoji', () => {
      render(<GameResults status="lost" {...mockProps} />);
      
      expect(screen.getByText('😢')).toBeInTheDocument();
    });
  });

  describe('Component Visibility', () => {
    it('should not render anything for non-terminal states', () => {
      const { container } = render(<GameResults status="playing" {...mockProps} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('should not render anything for setup state', () => {
      const { container } = render(<GameResults status="setup" {...mockProps} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('should not render anything for undefined status', () => {
      const { container } = render(<GameResults {...mockProps} />);
      
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Styling and Layout', () => {
    it('should have proper container classes for win state', () => {
      render(<GameResults status="won" {...mockProps} />);
      
      const container = screen.getByText('Congratulations!').parentElement;
      expect(container).toHaveClass('text-center', 'p-6', 'bg-green-50', 'rounded-lg');
    });

    it('should have proper container classes for lose state', () => {
      render(<GameResults status="lost" {...mockProps} />);
      
      const container = screen.getByText('Game Over').parentElement;
      expect(container).toHaveClass('text-center', 'p-6', 'bg-red-50', 'rounded-lg');
    });

    it('should style Play Again button correctly', () => {
      render(<GameResults status="won" {...mockProps} />);
      
      const button = screen.getByRole('button', { name: 'Play Again' });
      expect(button).toHaveClass('bg-green-500', 'hover:bg-green-600', 'text-white');
    });

    it('should style Try Again button correctly', () => {
      render(<GameResults status="lost" {...mockProps} />);
      
      const button = screen.getByRole('button', { name: 'Try Again' });
      expect(button).toHaveClass('bg-red-500', 'hover:bg-red-600', 'text-white');
    });

    it('should have large emoji size', () => {
      render(<GameResults status="won" {...mockProps} />);
      
      const emoji = screen.getByText('🎉');
      expect(emoji).toHaveClass('text-6xl');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure for win', () => {
      render(<GameResults status="won" {...mockProps} />);
      
      expect(screen.getByRole('heading', { level: 2, name: 'Congratulations!' })).toBeInTheDocument();
    });

    it('should have proper heading structure for loss', () => {
      render(<GameResults status="lost" {...mockProps} />);
      
      expect(screen.getByRole('heading', { level: 2, name: 'Game Over' })).toBeInTheDocument();
    });

    it('should have accessible button labels', () => {
      render(<GameResults status="won" {...mockProps} />);
      
      const button = screen.getByRole('button', { name: 'Play Again' });
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should support keyboard navigation', () => {
      render(<GameResults status="lost" {...mockProps} />);
      
      const button = screen.getByRole('button', { name: 'Try Again' });
      
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter' });
      
      expect(mockProps.onTryAgain).toHaveBeenCalledTimes(1);
    });

    it('should have proper ARIA attributes for results container', () => {
      render(<GameResults status="won" {...mockProps} />);
      
      const container = screen.getByRole('region', { name: 'Game Results' });
      expect(container).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle multiple rapid clicks gracefully', () => {
      render(<GameResults status="won" {...mockProps} />);
      
      const button = screen.getByRole('button', { name: 'Play Again' });
      
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(mockProps.onPlayAgain).toHaveBeenCalledTimes(3);
    });

    it('should maintain button functionality after status changes', () => {
      const { rerender } = render(<GameResults status="won" {...mockProps} />);
      
      rerender(<GameResults status="lost" {...mockProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
      
      expect(mockProps.onTryAgain).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing onPlayAgain handler gracefully', () => {
      const propsWithoutHandler = { ...mockProps, onPlayAgain: undefined };
      
      expect(() => {
        render(<GameResults status="won" {...propsWithoutHandler} />);
      }).not.toThrow();
    });

    it('should handle missing onTryAgain handler gracefully', () => {
      const propsWithoutHandler = { ...mockProps, onTryAgain: undefined };
      
      expect(() => {
        render(<GameResults status="lost" {...propsWithoutHandler} />);
      }).not.toThrow();
    });

    it('should handle invalid status values gracefully', () => {
      expect(() => {
        render(<GameResults status="invalid" {...mockProps} />);
      }).not.toThrow();
    });

    it('should handle null status gracefully', () => {
      expect(() => {
        render(<GameResults status={null} {...mockProps} />);
      }).not.toThrow();
    });
  });

  describe('Component State Transitions', () => {
    it('should transition from win to hidden state', () => {
      const { rerender } = render(<GameResults status="won" {...mockProps} />);
      
      expect(screen.getByText('Congratulations!')).toBeInTheDocument();
      
      rerender(<GameResults status="playing" {...mockProps} />);
      
      expect(screen.queryByText('Congratulations!')).not.toBeInTheDocument();
    });

    it('should transition from lose to win state', () => {
      const { rerender } = render(<GameResults status="lost" {...mockProps} />);
      
      expect(screen.getByText('Game Over')).toBeInTheDocument();
      
      rerender(<GameResults status="won" {...mockProps} />);
      
      expect(screen.getByText('Congratulations!')).toBeInTheDocument();
      expect(screen.queryByText('Game Over')).not.toBeInTheDocument();
    });
  });
});