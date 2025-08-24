// types/components.ts
// Component-specific type definitions

import { BaseComponentProps, FoodItem, StatCard } from './app';

// Button Component Types
export interface PrimaryButtonProps extends BaseComponentProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

// Input Field Types
export interface InputFieldProps extends BaseComponentProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  editable?: boolean;
  required?: boolean;
}

export interface ValidatedInputFieldProps extends InputFieldProps {
  validationRules?: ValidationRule[];
  showValidation?: boolean;
  validateOnChange?: boolean;
}

export interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
  type: 'error' | 'warning' | 'success';
}

// Header Component Types
export interface HeaderProps extends BaseComponentProps {
  title: string;
  icon?: string;
  leftButton?: {
    icon: string;
    onPress: () => void;
  };
  rightButton?: {
    icon: string;
    onPress: () => void;
  };
  showGradient?: boolean;
}

// Food Card Types
export interface FoodCardProps extends BaseComponentProps {
  food: {
    id: string;
    name: string;
    brand?: string;
    calories: number;
    glycemicIndex?: number;
    image?: string;
  };
  onPress?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  showGI?: boolean;
  layout?: 'card' | 'list' | 'compact';
}

// Filter Chips Types
export interface FilterChipsProps extends BaseComponentProps {
  filters: string[];
  selected?: string;
  onSelect: (filter: string) => void;
  multiple?: boolean;
  selectedItems?: string[];
}



// Search Component Types
export interface SearchBarProps extends BaseComponentProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  placeholder?: string;
  loading?: boolean;
  showFilter?: boolean;
  onFilterPress?: () => void;
}

export interface ManualSearchSectionProps extends BaseComponentProps {
  onSearch: (query: string) => void;
  onFilterPress?: () => void;
  recentSearches?: string[];
  onRecentSearch?: (query: string) => void;
}

// Statistics Component Types
export interface StatsCardsProps extends BaseComponentProps {
  stats: StatCard[];
  onCardPress?: (stat: StatCard) => void;
  animated?: boolean;
  period?: 'week' | 'month' | 'year';
}

export interface ProgressChartProps extends BaseComponentProps {
  percent?: number; // For simple progress circle
  data?: Array<{
    date: string;
    value: number;
    label?: string;
  }>;
  type?: 'line' | 'bar' | 'area';
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
}

export interface MacroSummaryProps extends BaseComponentProps {
  macros: {
    carbs: { current: number; target: number };
    protein: { current: number; target: number };
    fat: { current: number; target: number };
    calories: { current: number; target: number };
  };
  showPercentages?: boolean;
}

// Auth Component Types
export interface PasswordStrengthCheckerProps extends BaseComponentProps {
  password: string;
  showStrength?: boolean;
  requirements?: Array<{
    test: (password: string) => boolean;
    message: string;
  }>;
}

export interface TermsOfServiceProps extends BaseComponentProps {
  isVisible: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}

// Avatar Component Types
export interface AvatarProps extends BaseComponentProps {
  source?: { uri: string } | number;
  size?: number;
  name?: string;
  onPress?: () => void;
  editable?: boolean;
  placeholder?: boolean;
}

// Error Boundary Types
export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: any) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Food Component Types
export interface RecentFoodsSectionProps extends BaseComponentProps {
  foods: FoodItem[];
  onViewAll?: () => void;
  onFoodPress: (food: FoodItem) => void;
  title?: string;
  icon?: string;
}

// Terms Component Types
export interface TermsCheckboxProps extends BaseComponentProps {
  checked: boolean;
  onPress: () => void;
}
