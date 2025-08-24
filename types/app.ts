// types/app.ts
// Application-wide type definitions

import { User } from 'firebase/auth';

// User and Authentication Types
export interface AppUser extends User {
  // Additional user properties specific to your app
  profileComplete?: boolean;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  units: 'metric' | 'imperial';
  notifications: {
    glucose: boolean;
    meals: boolean;
    reminders: boolean;
  };
  glucoseTargets: {
    min: number;
    max: number;
  };
  theme: 'light' | 'dark' | 'auto';
}

// Food and Nutrition Types
export interface Food {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  glycemicIndex?: number;
  carbohydrates: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize: {
    amount: number;
    unit: string;
  };
  category: FoodCategory;
}

export type FoodCategory = 
  | 'grains'
  | 'fruits'
  | 'vegetables'
  | 'proteins'
  | 'dairy'
  | 'fats'
  | 'beverages'
  | 'snacks'
  | 'prepared_meals';

export interface FoodEntry {
  id: string;
  food: Food;
  quantity: number;
  timestamp: Date;
  userId: string;
  mealType: MealType;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// Glucose and Health Types
export interface GlucoseReading {
  id: string;
  value: number; // mg/dL
  timestamp: Date;
  userId: string;
  notes?: string;
  mealContext?: {
    mealType: MealType;
    timeSinceMeal: number; // minutes
  };
}

export interface HealthMetrics {
  glucoseReadings: GlucoseReading[];
  foodEntries: FoodEntry[];
  averageGlucose?: number;
  glucoseTrend?: 'improving' | 'stable' | 'worsening';
  lastSync: Date;
}

// Component Props Types
export interface BaseComponentProps {
  children?: React.ReactNode;
  style?: any;
  testID?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Search and Filter Types
export interface SearchFilters {
  category?: FoodCategory;
  maxCalories?: number;
  maxGI?: number;
  query?: string;
  sortBy?: 'name' | 'calories' | 'gi' | 'recent';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult extends Food {
  relevanceScore?: number;
  isRecent?: boolean;
  isFavorite?: boolean;
}

// Additional types for compatibility
export interface FoodItem {
  id: string;
  name: string;
  gi: number;
  image?: string;
  servingSize: string;
  calories: number;
  carbs: number;
  fiber: number;
  protein: number;
  fat?: number;
  category: string;
  glycemicLoad?: number;
  description?: string;
}

export interface StatCard {
  id?: string;
  value: string;
  label: string;
  color?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  subtitle?: string;
}
