/**
 * Official NAFA Marché Connect Branding System
 * Phase 1 - Visual Identity
 */

export const NAFA_COLORS = {
  // Primary palette - Trust & Growth
  primary: {
    dark: '#1a472a',    // Deep forest green - Primary brand color
    main: '#0d7c5f',    // Rich green - Main interactions
    light: '#1da084',   // Lighter green - Hover states
    lighter: '#e8f5f1', // Very light green - Backgrounds
  },

  // Accent palette - Energy & Optimism
  accent: {
    gold: '#fdb913',    // Bright gold - Highlights
    orange: '#f59e0b',  // Warm orange - Secondary accents
    light: '#fef3c7',   // Light amber - Soft backgrounds
  },

  // Neutral palette - Text & Structure
  neutral: {
    black: '#0f0f0f',
    dark: '#2d2d2d',
    medium: '#666666',
    light: '#f5f5f5',
    lighter: '#f9f9f9',
    white: '#ffffff',
  },

  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#0d7c5f',

  // Dark mode
  dark: {
    bg: '#0a1a14',
    surface: '#1a2b24',
    text: '#e8f5f1',
    border: '#2d4a3f',
  },
};

export const NAFA_TYPOGRAPHY = {
  // Font families
  primary: 'Segoe UI, Roboto, Poppins, -apple-system, BlinkMacSystemFont, sans-serif',
  mono: 'Menlo, Monaco, Courier New, monospace',

  // Font sizes (rem = 16px base)
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 40,
  },

  // Font weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Predefined text styles
  styles: {
    // Headings
    h1: {
      fontFamily: 'Segoe UI, Poppins, sans-serif',
      fontSize: 32,
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    h2: {
      fontFamily: 'Segoe UI, Poppins, sans-serif',
      fontSize: 28,
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: -0.3,
    },
    h3: {
      fontFamily: 'Segoe UI, Roboto, sans-serif',
      fontSize: 24,
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: -0.2,
    },
    h4: {
      fontFamily: 'Segoe UI, Roboto, sans-serif',
      fontSize: 20,
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: 0,
    },

    // Body text
    body: {
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: 0,
    },
    bodySmall: {
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 0.2,
    },
    caption: {
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      fontSize: 12,
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: 0.3,
    },

    // Buttons
    button: {
      fontFamily: 'Segoe UI, Roboto, sans-serif',
      fontSize: 16,
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: 0.5,
    },

    // Labels
    label: {
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: 0.2,
    },
  },
};

export const NAFA_SPACING = {
  // Base spacing unit: 4px
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 56,
  '5xl': 64,
};

export const NAFA_BORDER_RADIUS = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const NAFA_SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const NAFA_TRANSITIONS = {
  fast: 200,
  base: 300,
  slow: 500,
};
