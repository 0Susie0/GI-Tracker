// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, LogBox, Text, View } from 'react-native';

import AuthNavigator from './navigation/AuthNavigator';

const App: React.FC = () => {
  // Suppress development warnings
  LogBox.ignoreLogs([
    'AppRegistryBinding::stopSurface failed',
    'Global was not installed',
    'The native view manager for module(ExpoLinearGradient)',
    'Unable to get the view config for %s from module &s default view ExpoLinearGradient',
  ]);

  return (
    <NavigationContainer
      fallback={
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: '#F3F4FF' 
        }}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={{ 
            marginTop: 16, 
            fontSize: 14, 
            color: '#666' 
          }}>
            Loading Navigation...
          </Text>
        </View>
      }
    >
      <AuthNavigator />
    </NavigationContainer>
  );
};

export default App;

