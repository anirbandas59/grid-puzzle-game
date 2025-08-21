import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GameControls from '../../../src/components/ui/GameControls';

describe('GameControls Component', () => {
  const mockProps = {
    mode: 'remove',
    onModeToggle: vi.fn(),
    onConfirmSolution: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Remove Mode', () => {
    it('should display current mode correctly', () => {
      render(<GameControls {...mockProps} />);
      
      expect(screen.getByText('Mode: Remove')).toBeInTheDocument();
    });

    it('should show switch to confirm button in remove mode', () => {
      render(<GameControls {...mockProps} />);
      
      expect(screen.getByRole('button', { name: 'Switch to Confirm' })).toBeInTheDocument();
    });

    it('should call onModeToggle when switch button is clicked', () => {
      render(<GameControls {...mockProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Switch to Confirm' }));
      
      expect(mockProps.onModeToggle).toHaveBeenCalledTimes(1);
    });

    it('should not show confirm solution button in remove mode', () => {
      render(<GameControls {...mockProps} />);
      
      expect(screen.queryByRole('button', { name: 'Confirm Solution' })).not.toBeInTheDocument();
    });
  });

  describe('Confirm Mode', () => {
    const confirmModeProps = { ...mockProps, mode: 'confirm' };

    it('should display confirm mode correctly', () => {
      render(<GameControls {...confirmModeProps} />);
      
      expect(screen.getByText('Mode: Confirm')).toBeInTheDocument();
    });

    it('should show switch to remove button in confirm mode', () => {
      render(<GameControls {...confirmModeProps} />);
      
      expect(screen.getByRole('button', { name: 'Switch to Remove' })).toBeInTheDocument();
    });

    it('should show confirm solution button in confirm mode', () => {
      render(<GameControls {...confirmModeProps} />);
      
      expect(screen.getByRole('button', { name: 'Confirm Solution' })).toBeInTheDocument();
    });

    it('should call onConfirmSolution when confirm button is clicked', () => {
      render(<GameControls {...confirmModeProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Solution' }));
      
      expect(mockProps.onConfirmSolution).toHaveBeenCalledTimes(1);
    });

    it('should call onModeToggle when switch button is clicked in confirm mode', () => {
      render(<GameControls {...confirmModeProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Switch to Remove' }));
      
      expect(mockProps.onModeToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Button Styling', () => {
    it('should have proper CSS classes for mode toggle button', () => {
      render(<GameControls {...mockProps} />);
      
      const toggleButton = screen.getByRole('button', { name: 'Switch to Confirm' });
      expect(toggleButton).toHaveClass('bg-blue-500', 'hover:bg-blue-600', 'text-white');
    });

    it('should have proper CSS classes for confirm solution button', () => {
      render(<GameControls {...mockProps} mode="confirm" />);
      
      const confirmButton = screen.getByRole('button', { name: 'Confirm Solution' });
      expect(confirmButton).toHaveClass('bg-green-500', 'hover:bg-green-600', 'text-white');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button labels', () => {
      render(<GameControls {...mockProps} />);
      
      expect(screen.getByRole('button', { name: 'Switch to Confirm' })).toHaveAttribute('type', 'button');
    });

    it('should support keyboard navigation', () => {
      render(<GameControls {...mockProps} />);
      
      const button = screen.getByRole('button', { name: 'Switch to Confirm' });
      expect(button).toHaveAttribute('tabindex');
    });

    it('should have proper ARIA attributes for confirm mode', () => {
      render(<GameControls {...mockProps} mode="confirm" />);
      
      const confirmButton = screen.getByRole('button', { name: 'Confirm Solution' });
      expect(confirmButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Component Layout', () => {
    it('should have proper container classes', () => {
      render(<GameControls {...mockProps} />);
      
      const container = screen.getByText('Mode: Remove').parentElement;
      expect(container).toHaveClass('mb-4', 'text-center');
    });

    it('should arrange buttons correctly in confirm mode', () => {
      render(<GameControls {...mockProps} mode="confirm" />);
      
      const toggleButton = screen.getByRole('button', { name: 'Switch to Remove' });
      const confirmButton = screen.getByRole('button', { name: 'Confirm Solution' });
      
      expect(toggleButton).toBeInTheDocument();
      expect(confirmButton).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing onModeToggle gracefully', () => {
      const propsWithoutHandler = { ...mockProps, onModeToggle: undefined };
      
      expect(() => {
        render(<GameControls {...propsWithoutHandler} />);
      }).not.toThrow();
    });

    it('should handle missing onConfirmSolution gracefully', () => {
      const propsWithoutHandler = { ...mockProps, mode: 'confirm', onConfirmSolution: undefined };
      
      expect(() => {
        render(<GameControls {...propsWithoutHandler} />);
      }).not.toThrow();
    });

    it('should handle invalid mode gracefully', () => {
      const invalidModeProps = { ...mockProps, mode: 'invalid' };
      
      expect(() => {
        render(<GameControls {...invalidModeProps} />);
      }).not.toThrow();
    });
  });
});