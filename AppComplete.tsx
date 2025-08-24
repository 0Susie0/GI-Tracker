// AppComplete.tsx
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, LogBox, StatusBar, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import { auth } from './utils/firebase';
import { colors, fonts, spacing } from './utils/theme';

const AppComplete: React.FC = () => {
  // State with proper TypeScript typing
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  // Suppress development warnings
  LogBox.ignoreLogs([
    'AppRegistryBinding::stopSurface failed',
    'Global was not installed',
    'The native view manager for module(ExpoLinearGradient)',
    'Unable to get the view config for %s from module &s default view ExpoLinearGradient',
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('Auth check timeout - proceeding without auth');
      setAuthChecked(true);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'No user');
      clearTimeout(timeout);
      setUser(firebaseUser);
      setAuthChecked(true);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  if (!authChecked) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: spacing(4)
          }}>
            <ActivityIndicator size="large" color={colors.link} />
            <Text style={{
              marginTop: spacing(4),
              fontSize: fonts.body,
              color: colors.subtext,
              textAlign: 'center'
            }}>
              Initializing GI Tracker...
            </Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <NavigationContainer>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppComplete;

