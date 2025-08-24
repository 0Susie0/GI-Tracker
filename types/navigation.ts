// types/navigation.ts
// Navigation type definitions for React Navigation

import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack Navigator Types
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  EmailVerification: {
    email: string;
    password: string;
  };
};

// Tracking Stack Navigator Types
export type TrackingStackParamList = {
  HomePage: undefined;
  Search: { initialQuery?: string; showRecent?: boolean };
  CameraScan: { mode?: 'camera' | 'upload' };
  FoodDetails: {
    foodId: string;
    foodName?: string;
    food?: any;
    calories?: number;
    gi?: number;
  };
};

// Progress Stack Navigator Types
export type ProgressStackParamList = {
  ProgressView: undefined;
  GlucoseLog: undefined;
  Trends: undefined;
};

// Profile Stack Navigator Types
export type ProfileStackParamList = {
  Profile: undefined;
  Preferences: undefined;
};

// Bottom Tab Navigator Types
export type AppTabParamList = {
  TrackingTab: NavigatorScreenParams<TrackingStackParamList>;
  ProgressTab: NavigatorScreenParams<ProgressStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// Root Navigator Types (combining Auth and App)
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppTabParamList>;
};

// Screen Props Types
export type AuthScreenProps<T extends keyof AuthStackParamList> = {
  route: { params: AuthStackParamList[T] };
  navigation: any; // Will be properly typed with stack navigator
};

export type TrackingScreenProps<T extends keyof TrackingStackParamList> = {
  route: { params: TrackingStackParamList[T] };
  navigation: any;
};

export type ProgressScreenProps<T extends keyof ProgressStackParamList> = {
  route: { params: ProgressStackParamList[T] };
  navigation: any;
};

export type ProfileScreenProps<T extends keyof ProfileStackParamList> = {
  route: { params: ProfileStackParamList[T] };
  navigation: any;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

