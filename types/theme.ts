// types/theme.ts
// Theme and styling type definitions

export interface Colors {
  bg: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  link: string;
  accent: string;
  primaryGradient: [string, string];
}

export interface Radius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface Fonts {
  title: number;
  subtitle: number;
  body: number;
  caption: number;
}

export type SpacingFunction = (multiplier: number) => number;

export interface Theme {
  colors: Colors;
  radius: Radius;
  fonts: Fonts;
  spacing: SpacingFunction;
}

// Component styling prop types
export interface StyleProps {
  style?: any; // React Native StyleProp
}
