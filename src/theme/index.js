// Coffee Shop App Design System
export const Colors = {
  // Rich Coffee Palette
  primary: '#38220F',          // Dark roasted espresso
  primaryDark: '#231407',      // Deep black roast
  primaryLight: '#533824',     // Medium roast brown
  accent: '#A06A3B',           // Warm caramel
  accentGold: '#D4A373',       // Golden crema
  accentLight: '#E6CCB2',      // Frothy milk foam
  
  // Backgrounds & Surfaces
  background: '#FAF5EE',       // Warm organic cream
  backgroundSubtle: '#F4EAE0', // Soft beige
  card: '#FFFFFF',             // Clean white card
  cardSecondary: '#F7EFE5',    // Latte card tint
  surface: '#FFFFFF',
  
  // Borders & Dividers
  border: '#EADDCF',           // Delicate warm line
  borderLight: '#F3E8DC',
  
  // Text Colors
  textPrimary: '#2B1A0E',      // Deep roast text
  textSecondary: '#7A6453',    // Warm mocha text
  textMuted: '#A39182',        // Light frothy gray
  textOnDark: '#FAF5EE',       // Cream text on dark buttons
  
  // UI Status & Badges
  star: '#E69500',             // Golden amber stars
  success: '#386641',          // Matcha green
  successLight: '#E8F5E9',
  error: '#BC4749',            // Warm berry red
  errorLight: '#FFEBEE',
  warning: '#F4A261',
  
  // Overlay
  overlay: 'rgba(35, 20, 7, 0.65)',
};

export const Typography = {
  // Font sizes
  hero: 28,
  titleLarge: 24,
  titleMedium: 20,
  titleSmall: 18,
  bodyLarge: 16,
  bodyMedium: 14,
  bodySmall: 12,
  caption: 11,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 26,
  full: 999,
};

export const Shadows = {
  small: {
    shadowColor: '#38220F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  medium: {
    shadowColor: '#38220F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  large: {
    shadowColor: '#38220F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
};
