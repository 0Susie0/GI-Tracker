import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import PreferencesScreen from '../screens/profile/PreferencesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import GlucoseLogScreen from '../screens/progress/GlucoseLogScreen';
import TrendsScreen from '../screens/progress/TrendsScreen';
import CameraScanScreen from '../screens/tracking/CameraScanScreen';
import FoodDetailsScreen from '../screens/tracking/FoodDetailsScreen';
import HomePageScreen from '../screens/tracking/HomePageScreen';
import SearchScreen from '../screens/tracking/SearchScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TrackingStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="HomePage" component={HomePageScreen} />
      <Stack.Screen name="CameraScan" component={CameraScanScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
    </Stack.Navigator>
  );
}

function ProgressStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Trends" component={TrendsScreen} />
      <Stack.Screen name="GlucoseLog" component={GlucoseLogScreen} />
    </Stack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Tracking') {
              return <MaterialCommunityIcons name="food-apple" size={size} color={color} />;
            } else if (route.name === 'Progress') {
              return <FontAwesome5 name="chart-line" size={size} color={color} />;
            } else if (route.name === 'Profile') {
              return <Ionicons name="person" size={size} color={color} />;
            }
          },
        })}
      >
        <Tab.Screen name="Tracking" component={TrackingStackNavigator} />
        <Tab.Screen name="Progress" component={ProgressStackNavigator} />
        <Tab.Screen name="Profile" component={ProfileStackNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}