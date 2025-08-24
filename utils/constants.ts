// utils/constants.ts
import { FoodCategory, MealType } from '../types/app';

// App Configuration Constants
export const APP_CONFIG = {
  NAME: 'GI Tracker',
  VERSION: '1.0.0',
  BUNDLE_ID: 'com.susiehu.gitracker',
} as const;

// Food and Nutrition Constants
export const FOOD_CATEGORIES: readonly FoodCategory[] = [
  'grains',
  'fruits',
  'vegetables',
  'proteins',
  'dairy',
  'fats',
  'beverages',
  'snacks',
  'prepared_meals'
] as const;

export const MEAL_TYPES: readonly MealType[] = [
  'breakfast',
  'lunch',
  'dinner',
  'snack'
] as const;

// Glucose Level Constants
export const GLUCOSE_RANGES = {
  NORMAL: { min: 70, max: 100 },
  PREDIABETIC: { min: 100, max: 125 },
  DIABETIC: { min: 126, max: 300 },
  CRITICAL_LOW: { min: 0, max: 70 },
  CRITICAL_HIGH: { min: 300, max: 600 },
} as const;

// Glycemic Index Ranges
export const GI_RANGES = {
  LOW: { min: 0, max: 55 },
  MEDIUM: { min: 56, max: 69 },
  HIGH: { min: 70, max: 100 },
} as const;

// API Endpoints (if you have external APIs)
export const API_ENDPOINTS = {
  FOOD_SEARCH: '/api/food/search',
  NUTRITION_INFO: '/api/food/nutrition',
  USER_PROFILE: '/api/user/profile',
  GLUCOSE_LOGS: '/api/glucose/logs',
} as const;

// Validation Constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

// UI Constants
export const UI_CONSTANTS = {
  HEADER_HEIGHT: 60,
  TAB_BAR_HEIGHT: 80,
  LOADING_TIMEOUT: 30000, // 30 seconds
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 250,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: '@user_preferences',
  RECENT_SEARCHES: '@recent_searches',
  CACHED_FOODS: '@cached_foods',
  GLUCOSE_CACHE: '@glucose_cache',
  APP_INTRO_SEEN: '@app_intro_seen',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  AUTH_FAILED: 'Authentication failed. Please check your credentials.',
  PERMISSION_DENIED: 'Permission denied. Please grant necessary permissions.',
  FILE_TOO_LARGE: 'File size too large. Maximum size is 5MB.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  WEAK_PASSWORD: 'Password must be at least 8 characters long.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully.',
  GLUCOSE_LOGGED: 'Glucose reading logged successfully.',
  FOOD_ADDED: 'Food item added to your log.',
  EMAIL_VERIFIED: 'Email verified successfully.',
  PASSWORD_CHANGED: 'Password changed successfully.',
} as const;

