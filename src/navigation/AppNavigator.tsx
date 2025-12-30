import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CreateNoteScreen from '../screens/CreateNoteScreen';
import EditNoteScreen from '../screens/EditNoteScreen';
import { ParamList } from '../types';
import { useAuth } from '../auth/AuthProvider';
import AuthNavigator from './AuthNavigator';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { LogOut } from 'lucide-react-native';

const Stack = createNativeStackNavigator<ParamList>();

const Header = () => {
  const { signOut } = useAuth();

  const handleLogout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      <LogOut size={24} color="#007AFF" />
    </TouchableOpacity>
  );
};

const AppNavigator = () => {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={!user ? 'Auth' : 'Home'}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Auth"
          component={AuthNavigator}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'My Notes', headerRight: () => <Header /> }}
        />
        <Stack.Screen
          name="CreateNote"
          component={CreateNoteScreen}
          options={{ title: 'New Note' }}
        />
        <Stack.Screen
          name="EditNote"
          component={EditNoteScreen}
          options={{ title: 'Edit Note' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 10,
  },
});
