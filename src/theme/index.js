// Main theme configuration for Grid Puzzle Game
// Integrates with Tailwind CSS v4

import { puzzleColors, gameTheme } from './colors.js';
import { typography } from './typography.js';

// Tailwind config extension for custom colors
export const tailwindTheme = {
  extend: {
    colors: {
      ...puzzleColors,
    },
    fontFamily: {
      sans: typography.fonts.primary,
      mono: typography.fonts.mono,
    },
    fontSize: {
      'game-title': [typography.fontSize['3xl'], {
        fontWeight: typography.fontWeight.bold,
        lineHeight: typography.lineHeight.tight,
        letterSpacing: typography.letterSpacing.tight,
      }],
      'grid-number': [typography.fontSize.lg, {
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.tight,
      }],
      'target-number': [typography.fontSize.base, {
        fontWeight: typography.fontWeight.bold,
        lineHeight: typography.lineHeight.tight,
      }],
      'button-text': [typography.fontSize.sm, {
        fontWeight: typography.fontWeight.medium,
        letterSpacing: typography.letterSpacing.wide,
      }],
    },
    spacing: {
      'grid-cell': '3rem',      // 48px for grid cells
      'grid-gap': '1px',        // Minimal gap between cells
      'game-section': '1.5rem', // 24px between game sections
    },
    borderRadius: {
      'game': '0.75rem',        // Enhanced game element radius
      'game-lg': '1rem',        // Large game elements
      'cell': '0.5rem',         // Grid cells
    },
    boxShadow: {
      'game-card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      'game-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      'game-active': '0 2px 4px rgba(0, 0, 0, 0.1)',
      'game-glow': '0 0 20px rgba(59, 130, 246, 0.3)',
      'cell-hover': '0 8px 25px rgba(0, 0, 0, 0.15)',
    },
    animation: {
      'shake': 'shake 0.5s ease-in-out',
      'bounce-gentle': 'bounce 1s ease-out',
      'fade-in': 'fadeIn 0.3s ease-out',
      'scale-up': 'scaleUp 0.15s ease-out',
    },
    keyframes: {
      shake: {
        '0%, 100%': { transform: 'translateX(0)' },
        '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
        '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
      },
      fadeIn: {
        from: { opacity: '0', transform: 'translateY(10px)' },
        to: { opacity: '1', transform: 'translateY(0)' },
      },
      scaleUp: {
        from: { transform: 'scale(0.95)' },
        to: { transform: 'scale(1)' },
      },
    },
  },
};

// Theme helper functions
export const getThemeClass = (category, state, isDark = false) => {
  if (isDark && gameTheme.dark[category]?.[state]) {
    return gameTheme.dark[category][state];
  }
  return gameTheme[category]?.[state] || state;
};

export const getTextClass = (type, isDark = false) => {
  return `text-${getThemeClass('text', type, isDark)}`;
};

export const getBackgroundClass = (type, isDark = false) => {
  return `bg-${getThemeClass('backgrounds', type, isDark)}`;
};

export const getButtonClass = (variant, isDark = false) => {
  const baseClasses = 'px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50';
  const colorClass = `bg-${getThemeClass('buttons', variant, isDark)} text-white hover:opacity-90`;
  const focusClass = `focus:ring-${getThemeClass('buttons', variant, isDark)}`;
  return `${baseClasses} ${colorClass} ${focusClass}`;
};

export const getCellClass = (state, isDark = false) => {
  const baseClasses = 'w-grid-cell h-grid-cell border-2 flex items-center justify-center text-grid-number transition-all duration-300 rounded-lg shadow-sm hover:shadow-md';
  const stateClass = `bg-${getThemeClass('cells', state, isDark)}`;
  const borderClass = `border-${getThemeClass('cells', 'border', isDark)}`;
  return `${baseClasses} ${stateClass} ${borderClass}`;
};

export const getLifelineClass = (count) => {
  const state = count >= 3 ? 'full' : count === 2 ? 'medium' : count === 1 ? 'low' : 'empty';
  return `text-${getThemeClass('lifelines', state)}`;
};

export const getModeClass = (mode) => {
  return `text-${getThemeClass('modes', mode)}`;
};

// Export all theme elements
export {
  puzzleColors,
  gameTheme,
  typography,
};

export default {
  colors: puzzleColors,
  theme: gameTheme,
  typography,
  tailwindTheme,
  getThemeClass,
  getTextClass,
  getBackgroundClass,
  getButtonClass,
  getCellClass,
  getLifelineClass,
  getModeClass,
};