// Typography system for Grid Puzzle Game
// Tailwind CSS compatible typography configuration

export const typography = {
  // Font families (Tailwind compatible)
  fonts: {
    primary: [
      'system-ui',
      '-apple-system', 
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ],
    mono: [
      'ui-monospace',
      '"JetBrains Mono"',
      'Menlo',
      'Monaco',
      'Consolas',
      '"Liberation Mono"',
      '"Courier New"',
      'monospace',
    ],
  },

  // Font sizes with improved scale for modern design
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px  
    base: '1rem',       // 16px - increased from 0.875rem for better readability
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },

  // Line heights (Tailwind compatible)
  lineHeight: {
    tight: '1.25',
    snug: '1.375', 
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Font weights (Tailwind compatible) 
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500', 
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Letter spacing (Tailwind compatible)
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em', 
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// Enhanced Tailwind utility class mapping with better contrast
export const textStyles = {
  // Game title - large, bold, high contrast
  gameTitle: 'text-4xl font-bold text-puzzle-800 tracking-tight drop-shadow-sm',
  
  // Section headings with improved contrast
  heading: 'text-2xl font-semibold text-slate-900',
  subheading: 'text-xl font-medium text-slate-800',
  
  // Body text with better readability
  body: 'text-base text-slate-700 leading-relaxed',
  bodyMuted: 'text-sm text-slate-600',
  
  // Button text with enhanced visibility
  button: 'text-sm font-semibold tracking-wide text-white drop-shadow-sm',
  buttonLarge: 'text-base font-semibold tracking-wide text-white drop-shadow-sm',
  buttonSecondary: 'text-sm font-medium tracking-wide text-slate-700',
  
  // Game specific with improved contrast
  gridNumber: 'text-xl font-bold font-mono leading-tight text-slate-800',
  targetNumber: 'text-lg font-bold font-mono leading-tight text-puzzle-700 drop-shadow-sm',
  
  // Status and feedback with higher contrast
  status: 'text-lg font-semibold',
  success: 'text-base font-semibold text-correct-700',
  error: 'text-base font-semibold text-wrong-700', 
  warning: 'text-base font-semibold text-caution-700',
  info: 'text-base font-semibold text-puzzle-700',
  
  // Instructions and help with better readability
  instructions: 'text-sm text-slate-700 leading-relaxed',
  caption: 'text-xs text-slate-600 font-medium',
  
  // Interactive elements with smooth transitions
  link: 'text-puzzle-700 hover:text-puzzle-800 transition-all duration-200 font-medium underline-offset-4 hover:underline',
  
  // Enhanced dark mode with proper contrast
  dark: {
    gameTitle: 'dark:text-puzzle-200 dark:drop-shadow-lg',
    heading: 'dark:text-slate-100',
    subheading: 'dark:text-slate-200',
    body: 'dark:text-slate-200',
    bodyMuted: 'dark:text-slate-300',
    gridNumber: 'dark:text-slate-100',
    targetNumber: 'dark:text-puzzle-300 dark:drop-shadow-md',
    instructions: 'dark:text-slate-200',
    caption: 'dark:text-slate-300',
    link: 'dark:text-puzzle-300 dark:hover:text-puzzle-200',
    button: 'dark:text-white dark:drop-shadow-md',
    buttonSecondary: 'dark:text-slate-200',
  },
};

export default typography;