// utils/theme.ts
import { Colors, Fonts, Radius, SpacingFunction, Theme } from '../types/theme';

export const colors: Colors = {
  bg: "#F3F4FF",
  card: "#FFFFFF",
  text: "#111827",
  subtext: "#6B7280",
  border: "#E6E8F2",
  link: "#4F46E5",
  accent: "#34D399",
  primaryGradient: ["#7C3AED", "#5B6BFF"],
};

export const radius: Radius = { 
  sm: 8, 
  md: 12, 
  lg: 20, 
  xl: 24 
};

export const spacing: SpacingFunction = (n: number): number => 4 * n; // spacing(3) = 12

export const fonts: Fonts = { 
  title: 22, 
  subtitle: 18,
  body: 16, 
  caption: 12 
};

// Complete theme object
export const theme: Theme = {
  colors,
  radius,
  spacing,
  fonts,
};

export default theme;

