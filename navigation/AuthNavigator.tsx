// navigation/AuthNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import EmailVerificationScreen from '../screens/auth/EmailVerificationScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import { AuthStackParamList } from '../types/navigation';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Login" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen as any} />
      <Stack.Screen name="SignUp" component={SignUpScreen as any} />
      <Stack.Screen name="EmailVerification" component={EmailVerificationScreen as any} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

