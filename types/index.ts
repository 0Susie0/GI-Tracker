// types/index.ts
// Central export file for all type definitions

// Core app types
export * from './app';
export * from './components';
export * from './navigation';
export * from './theme';

// Re-export commonly used types from external libraries
export type { User } from 'firebase/auth';
export type {
    ImageProps, ImageStyle, PressableProps, StyleProp, TextProps, TextStyle, ViewProps, ViewStyle
} from 'react-native';

export type {
    StackNavigationProp,
    StackScreenProps
} from '@react-navigation/stack';

export type {
    BottomTabNavigationProp,
    BottomTabScreenProps
} from '@react-navigation/bottom-tabs';

export type {
    CompositeNavigationProp,
    NavigatorScreenParams,
    RouteProp
} from '@react-navigation/native';


