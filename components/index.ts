// components/index.ts
// Central export file for all components

// Basic Components
export { default as Avatar } from './Basic/Avatar';
export { default as ErrorBoundary } from './Basic/ErrorBoundary';
export { default as FilterChips } from './Basic/FilterChips';
export { default as Header } from './Basic/Header';
export { default as InputField } from './Basic/InputField';
export { default as PrimaryButton } from './Basic/PrimaryButton';

// Authentication Components
export { default as PasswordStrengthChecker } from './Authentification/PasswordStrengthChecker';
export { TermsCheckbox, default as TermsOfService } from './Authentification/TermsOfService';
export { default as ValidatedInputField } from './Authentification/ValidatedInputField';

// Food Components
export { default as AIFoodSection } from './Food/AIFoodSection';
export { default as FoodCard } from './Food/FoodCard';
export { default as RecentFoodsSection } from './Food/RecentFoodsSection';
export { default as RecipesSection } from './Food/RecipesSection';

// Search Components
export { default as ManualSearchSection } from './Search/ManualSearchSection';
export { default as SearchBar } from './Search/SearchBar';

// Statistics Components
export { default as StatsCards } from './Statistic/StatsCards';

// Note: Additional components can be exported here as they are migrated to TypeScript
// For now, JavaScript components can still be imported directly from their paths
