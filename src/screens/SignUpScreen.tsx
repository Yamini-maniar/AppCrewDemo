import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ToastAndroid, Text } from 'react-native';
import { useAuth } from '../auth/AuthProvider';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<ParamList, 'SignUp'>;
};

const SignUpScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignUp = useCallback(async () => {
    if (!email || !password) {
      ToastAndroid.show('Please fill in all fields', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    } else {
      ToastAndroid.show('Account created! Please sign in.', ToastAndroid.SHORT);
      navigation.goBack();
    }
  }, [email, password, signUp, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
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
        title="Sign Up"
        onPress={handleSignUp}
        loading={loading}
        style={styles.button}
      />

      <AppButton
        title="Already have an account? Sign In"
        onPress={() => navigation.goBack()}
        variant="secondary"
        style={styles.linkButton}
      />
    </View>
  );
};

export default SignUpScreen;

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
