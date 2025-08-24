// navigation/AppNavigator.tsx
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import PreferencesScreen from '../screens/profile/PreferencesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import GlucoseLogScreen from '../screens/progress/GlucoseLogScreen';
import ProgressViewScreen from '../screens/progress/ProgressViewScreen';
import TrendsScreen from '../screens/progress/TrendsScreen';
import CameraScanScreen from '../screens/tracking/CameraScanScreen';
import FoodDetailsScreen from '../screens/tracking/FoodDetailsScreen';
import HomePageScreen from '../screens/tracking/HomePageScreen';
import SearchScreen from '../screens/tracking/SearchScreen';
import {
    AppTabParamList,
    ProfileStackParamList,
    ProgressStackParamList,
    TrackingStackParamList
} from '../types/navigation';

const Tab = createBottomTabNavigator<AppTabParamList>();
const TrackingStack = createStackNavigator<TrackingStackParamList>();
const ProgressStack = createStackNavigator<ProgressStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

const TrackingStackNavigator: React.FC = () => {
  return (
    <TrackingStack.Navigator 
      screenOptions={{ 
        headerShown: false,

        gestureEnabled: true 
      }}
    >
      <TrackingStack.Screen name="HomePage" component={HomePageScreen as any} />
      <TrackingStack.Screen name="CameraScan" component={CameraScanScreen as any} />
      <TrackingStack.Screen name="Search" component={SearchScreen as any} />
      <TrackingStack.Screen name="FoodDetails" component={FoodDetailsScreen as any} />
    </TrackingStack.Navigator>
  );
};

const ProgressStackNavigator: React.FC = () => {
  return (
    <ProgressStack.Navigator 
      screenOptions={{ 
        headerShown: false,

        gestureEnabled: true 
      }}
    >
      <ProgressStack.Screen name="ProgressView" component={ProgressViewScreen as any} />
      <ProgressStack.Screen name="GlucoseLog" component={GlucoseLogScreen as any} />
      <ProgressStack.Screen name="Trends" component={TrendsScreen as any} />
    </ProgressStack.Navigator>
  );
};

const ProfileStackNavigator: React.FC = () => {
  return (
    <ProfileStack.Navigator 
      screenOptions={{ 
        headerShown: false,

        gestureEnabled: true 
      }}
    >
      <ProfileStack.Screen name="Profile" component={ProfileScreen as any} />
      <ProfileStack.Screen name="Preferences" component={PreferencesScreen as any} />
    </ProfileStack.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'TrackingTab') {
            return <MaterialCommunityIcons name="food-apple" size={size} color={color} />;
          } else if (route.name === 'ProgressTab') {
            return <FontAwesome5 name="chart-line" size={size} color={color} />;
          } else if (route.name === 'ProfileTab') {
            return <Ionicons name="person" size={size} color={color} />;
          }
          return null;
        },
      })}
    >
      <Tab.Screen 
        name="TrackingTab" 
        component={TrackingStackNavigator}
        options={{ title: 'Tracking' }}
      />
      <Tab.Screen 
        name="ProgressTab" 
        component={ProgressStackNavigator}
        options={{ title: 'Progress' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStackNavigator}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
