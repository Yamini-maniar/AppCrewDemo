import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import AppNavigator from './AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

const InitialRouter = () => {
  const { loading } = useAuth();

  return loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <AppNavigator />
    </SafeAreaView>
  );
};

export default InitialRouter;
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
});
