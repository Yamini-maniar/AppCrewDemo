import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/auth/AuthProvider';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';

function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar animated barStyle={'dark-content'} />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
