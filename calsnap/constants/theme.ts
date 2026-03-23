import { Platform } from 'react-native';

export type ThemeColors = typeof LightTheme;

export const LightTheme = {
  primary: '#4CAD53',
  primaryDark: '#3D8B42',
  primaryLight: '#E8F5E9',
  primaryBg: '#F1F8E9',
  white: '#FFFFFF',
  black: '#000000',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  background: '#F9FBF7',
  card: '#FFFFFF',
  border: '#E5E7EB',
  divider: '#F3F4F6',
  success: '#4CAD53',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  calorie: '#4CAD53',
  carbs: '#F59E0B',
  protein: '#3B82F6',
  fat: '#EF4444',
  sodium: '#8B5CF6',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E5E7EB',
  tabIconDefault: '#9CA3AF',
  tabIconSelected: '#4CAD53',
};

export const DarkTheme: ThemeColors = {
  primary: '#5CC864',
  primaryDark: '#4CAD53',
  primaryLight: '#1A3A1E',
  primaryBg: '#1A2E1C',
  white: '#1C1C1E',
  black: '#FFFFFF',
  text: '#ECEDEE',
  textSecondary: '#9BA1A6',
  textLight: '#6B7280',
  background: '#111214',
  card: '#1C1C1E',
  border: '#2C2C2E',
  divider: '#232326',
  success: '#5CC864',
  warning: '#FFB340',
  error: '#FF6B6B',
  info: '#5B9DF6',
  calorie: '#5CC864',
  carbs: '#FFB340',
  protein: '#5B9DF6',
  fat: '#FF6B6B',
  sodium: '#A78BFA',
  tabBar: '#1C1C1E',
  tabBarBorder: '#2C2C2E',
  tabIconDefault: '#6B7280',
  tabIconSelected: '#5CC864',
};

/** @deprecated use LightTheme or useTheme() instead */
export const Colors = LightTheme;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 48,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    mono: 'Menlo',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    mono: 'monospace',
  },
});
