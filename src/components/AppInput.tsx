import React, { useState } from 'react';
import { TextInput, TextInputProps, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

interface Props extends TextInputProps {
    label?: string;
    error?: string;
}

const AppInput = ({ label, error, style, secureTextEntry, ...props }: Props) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.inputContainer}>
            <TextInput
                style={[styles.input, error ? styles.inputError : null, style]}
                placeholderTextColor="#999"
                secureTextEntry={secureTextEntry && !isPasswordVisible}
                {...props}
            />
            {secureTextEntry && (
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                    {isPasswordVisible ? (
                        <EyeOff size={20} color="#666" />
                    ) : (
                        <Eye size={20} color="#666" />
                    )}
                </TouchableOpacity>
            )}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default AppInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
      marginBottom: 6,
      fontSize: 14,
      fontWeight: '600',
      color: '#333',
  },
  inputContainer: {
      position: 'relative',
      justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
    paddingRight: 40, 
  },
  inputError: {
      borderColor: 'red',
  },
  eyeIcon: {
      position: 'absolute',
      right: 12,
  },
  errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 4,
  }
});
