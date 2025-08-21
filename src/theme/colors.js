// Tailwind CSS compatible theme configuration for Grid Puzzle Game
// Extends Tailwind's default color palette with puzzle-specific colors

// Puzzle game color palette - designed for cognitive gameplay
export const puzzleColors = {
  // Primary blue (puzzle theme) - modern vibrant blue palette
  puzzle: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Main puzzle color - more vibrant
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // Game mode colors
  mode: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',  // Remove mode (orange)
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },

  // Success/correct colors (emerald green)
  correct: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',  // Success color
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  },

  // Error/wrong colors (modern red) 
  wrong: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // Error color
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },

  // Warning/caution colors (amber)
  caution: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Warning color
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Confirm mode (purple)
  confirm: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',  // Confirm mode color
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
};

// Modern game state semantic mapping with improved contrast
export const gameTheme = {
  // Game modes
  modes: {
    remove: 'mode-500',      // Orange for remove mode
    confirm: 'confirm-500',  // Purple for confirm mode
  },

  // Cell states with better contrast
  cells: {
    default: 'slate-50',
    hover: 'slate-100',
    active: 'puzzle-500',
    removed: 'wrong-50',
    error: 'wrong-500',
    core: 'puzzle-600',
    border: 'slate-200',
  },

  // Lifeline states with enhanced visibility
  lifelines: {
    full: 'correct-600',    // Darker green (3 lifelines)
    medium: 'caution-600',  // Darker amber (2 lifelines)  
    low: 'wrong-600',       // Darker red (1 lifeline)
    empty: 'slate-500',     // Darker gray (0 lifelines)
  },

  // Status indicators with better contrast
  status: {
    playing: 'puzzle-700',
    won: 'correct-600',
    lost: 'wrong-600',
    setup: 'slate-600',
  },

  // Interactive elements with improved accessibility
  buttons: {
    primary: 'puzzle-600',
    secondary: 'slate-600', 
    success: 'correct-600',
    danger: 'wrong-600',
    warning: 'caution-600',
  },

  // Text colors with higher contrast ratios
  text: {
    primary: 'slate-950',
    secondary: 'slate-700',
    muted: 'slate-500',
    success: 'correct-800',
    error: 'wrong-800',
    warning: 'caution-800',
    info: 'puzzle-800',
    onDark: 'slate-100',
  },

  // Background colors with modern gradients support
  backgrounds: {
    primary: 'white',
    secondary: 'slate-50',
    tertiary: 'slate-100',
    grid: 'slate-50',
    card: 'white',
    overlay: 'slate-900/50',
    gradient: 'gradient-to-br from-slate-50 to-slate-100',
  },

  // Enhanced dark mode with better contrast
  dark: {
    text: {
      primary: 'slate-50',
      secondary: 'slate-200',
      muted: 'slate-400',
      success: 'correct-400',
      error: 'wrong-400',
      warning: 'caution-400',
      info: 'puzzle-400',
    },
    backgrounds: {
      primary: 'slate-950',
      secondary: 'slate-900', 
      tertiary: 'slate-800',
      grid: 'slate-900',
      card: 'slate-800',
      overlay: 'slate-100/10',
      gradient: 'gradient-to-br from-slate-900 to-slate-950',
    },
    cells: {
      default: 'slate-700',
      hover: 'slate-600',
      border: 'slate-600',
    },
    buttons: {
      primary: 'puzzle-500',
      secondary: 'slate-500',
      success: 'correct-500',
      danger: 'wrong-500',
      warning: 'caution-500',
    },
  },
};

export default puzzleColors;