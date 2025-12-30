import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ToastAndroid, Text } from 'react-native';
import { useAuth } from '../auth/AuthProvider';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamList } from '../types';
import { CommonActions } from '@react-navigation/native';

type Props = {
  navigation: NativeStackNavigationProp<ParamList, 'Login'>;
};

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      ToastAndroid.show('Please fill in all fields', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    } else {
      ToastAndroid.show('Login Successful', ToastAndroid.SHORT);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        }),
      );
    }
  }, [email, navigation, password, signIn]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <AppInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <AppInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <AppButton
        title="Sign In"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
      />

      <AppButton
        title="Don't have an account? Sign Up"
        onPress={() => navigation.navigate('SignUp')}
        variant="secondary"
        style={styles.linkButton}
      />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    marginTop: 10,
  },
  linkButton: {
    marginTop: 20,
    borderWidth: 0,
  },
});
