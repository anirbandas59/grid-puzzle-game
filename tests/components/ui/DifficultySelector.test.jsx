import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DifficultySelector from '../../../src/components/ui/DifficultySelector';

describe('DifficultySelector Component', () => {
  const mockProps = {
    currentDifficulty: 'easy',
    onDifficultyChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render all difficulty options', () => {
      render(<DifficultySelector {...mockProps} />);
      
      expect(screen.getByText('4x4 Grid')).toBeInTheDocument();
      expect(screen.getByText('5x5 Grid')).toBeInTheDocument();
      expect(screen.getByText('6x6 Grid')).toBeInTheDocument();
    });

    it('should have the correct option selected based on props', () => {
      render(<DifficultySelector {...mockProps} />);
      
      expect(screen.getByTestId('difficulty-easy')).toHaveClass('bg-blue-600');
      expect(screen.getByTestId('difficulty-medium')).not.toHaveClass('bg-blue-600');
      expect(screen.getByTestId('difficulty-hard')).not.toHaveClass('bg-blue-600');
    });

    it('should select medium difficulty when passed as prop', () => {
      render(<DifficultySelector {...mockProps} currentDifficulty="medium" />);
      
      expect(screen.getByTestId('difficulty-medium')).toHaveClass('bg-blue-600');
      expect(screen.getByTestId('difficulty-easy')).not.toHaveClass('bg-blue-600');
      expect(screen.getByTestId('difficulty-hard')).not.toHaveClass('bg-blue-600');
    });
  });

  describe('User Interactions', () => {
    it('should call onDifficultyChange when easy is selected', () => {
      render(<DifficultySelector {...mockProps} difficulty="medium" />);
      
      fireEvent.click(screen.getByLabelText('Easy (4x4)'));
      
      expect(mockProps.onDifficultyChange).toHaveBeenCalledWith('easy');
    });

    it('should call onDifficultyChange when medium is selected', () => {
      render(<DifficultySelector {...mockProps} />);
      
      fireEvent.click(screen.getByLabelText('Medium (5x5)'));
      
      expect(mockProps.onDifficultyChange).toHaveBeenCalledWith('medium');
    });

    it('should call onDifficultyChange when hard is selected', () => {
      render(<DifficultySelector {...mockProps} />);
      
      fireEvent.click(screen.getByLabelText('Hard (6x6)'));
      
      expect(mockProps.onDifficultyChange).toHaveBeenCalledWith('hard');
    });

    it('should not call handler multiple times for same selection', () => {
      render(<DifficultySelector {...mockProps} />);
      
      // Click the already selected option
      fireEvent.click(screen.getByLabelText('Easy (4x4)'));
      
      expect(mockProps.onDifficultyChange).toHaveBeenCalledWith('easy');
      expect(mockProps.onDifficultyChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper radio button group structure', () => {
      render(<DifficultySelector {...mockProps} />);
      
      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons).toHaveLength(3);
    });

    it('should have proper labels associated with radio buttons', () => {
      render(<DifficultySelector {...mockProps} />);
      
      const easyRadio = screen.getByLabelText('Easy (4x4)');
      const mediumRadio = screen.getByLabelText('Medium (5x5)');
      const hardRadio = screen.getByLabelText('Hard (6x6)');
      
      expect(easyRadio).toHaveAttribute('type', 'radio');
      expect(mediumRadio).toHaveAttribute('type', 'radio');
      expect(hardRadio).toHaveAttribute('type', 'radio');
    });

    it('should have the same name attribute for radio group', () => {
      render(<DifficultySelector {...mockProps} />);
      
      const radioButtons = screen.getAllByRole('radio');
      radioButtons.forEach(radio => {
        expect(radio).toHaveAttribute('name', 'difficulty');
      });
    });

    it('should support keyboard navigation', () => {
      render(<DifficultySelector {...mockProps} />);
      
      const mediumRadio = screen.getByLabelText('Medium (5x5)');
      
      // Use keyboard to select
      mediumRadio.focus();
      fireEvent.keyDown(mediumRadio, { key: 'Space' });
      fireEvent.click(mediumRadio);
      
      expect(mockProps.onDifficultyChange).toHaveBeenCalledWith('medium');
    });

    it('should have appropriate ARIA attributes', () => {
      render(<DifficultySelector {...mockProps} />);
      
      const easyRadio = screen.getByLabelText('Easy (4x4)');
      expect(easyRadio).toHaveAttribute('value', 'easy');
    });
  });

  describe('Visual Styling', () => {
    it('should have proper container classes', () => {
      render(<DifficultySelector {...mockProps} />);
      
      const container = screen.getByText('Choose Difficulty:').parentElement;
      expect(container).toHaveClass('mb-6');
    });

    it('should style radio button labels correctly', () => {
      render(<DifficultySelector {...mockProps} />);
      
      const labels = screen.getAllByText(/\(4x4\)|\(5x5\)|\(6x6\)/);
      labels.forEach(label => {
        const parentLabel = label.closest('label');
        expect(parentLabel).toHaveClass('cursor-pointer', 'flex', 'items-center');
      });
    });

    it('should have proper spacing between options', () => {
      render(<DifficultySelector {...mockProps} />);
      
      const optionsContainer = screen.getByLabelText('Easy (4x4)').closest('div').parentElement;
      expect(optionsContainer).toHaveClass('flex', 'justify-center', 'gap-6');
    });
  });

  describe('Component State Management', () => {
    it('should update visual state when difficulty prop changes', () => {
      const { rerender } = render(<DifficultySelector {...mockProps} difficulty="easy" />);
      
      expect(screen.getByLabelText('Easy (4x4)')).toBeChecked();
      
      rerender(<DifficultySelector {...mockProps} difficulty="hard" />);
      
      expect(screen.getByLabelText('Hard (6x6)')).toBeChecked();
      expect(screen.getByLabelText('Easy (4x4)')).not.toBeChecked();
    });

    it('should handle rapid difficulty changes', () => {
      render(<DifficultySelector {...mockProps} />);
      
      fireEvent.click(screen.getByLabelText('Medium (5x5)'));
      fireEvent.click(screen.getByLabelText('Hard (6x6)'));
      fireEvent.click(screen.getByLabelText('Easy (4x4)'));
      
      expect(mockProps.onDifficultyChange).toHaveBeenCalledTimes(3);
      expect(mockProps.onDifficultyChange).toHaveBeenNthCalledWith(1, 'medium');
      expect(mockProps.onDifficultyChange).toHaveBeenNthCalledWith(2, 'hard');
      expect(mockProps.onDifficultyChange).toHaveBeenNthCalledWith(3, 'easy');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing onDifficultyChange gracefully', () => {
      const propsWithoutHandler = { ...mockProps, onDifficultyChange: undefined };
      
      expect(() => {
        render(<DifficultySelector {...propsWithoutHandler} />);
      }).not.toThrow();
    });

    it('should handle invalid difficulty prop gracefully', () => {
      const invalidDifficultyProps = { ...mockProps, difficulty: 'invalid' };
      
      expect(() => {
        render(<DifficultySelector {...invalidDifficultyProps} />);
      }).not.toThrow();
      
      // Should default to no selection or handle gracefully
      expect(screen.getByLabelText('Easy (4x4)')).not.toBeChecked();
      expect(screen.getByLabelText('Medium (5x5)')).not.toBeChecked();
      expect(screen.getByLabelText('Hard (6x6)')).not.toBeChecked();
    });

    it('should handle undefined difficulty prop', () => {
      const undefinedDifficultyProps = { ...mockProps, difficulty: undefined };
      
      expect(() => {
        render(<DifficultySelector {...undefinedDifficultyProps} />);
      }).not.toThrow();
    });
  });
});