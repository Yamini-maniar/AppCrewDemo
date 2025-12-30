import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface Props extends TouchableOpacityProps {
    title: string;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
}

const AppButton = ({ title, loading, variant = 'primary', style, disabled, ...props }: Props) => {
    const getBackgroundColor = () => {
        if (disabled) return '#ccc';
        switch (variant) {
            case 'secondary': return 'transparent';
            case 'danger': return '#ff4444';
            default: return '#007AFF';
        }
    };

    const getTextColor = () => {
        if (disabled) return '#666';
        if (variant === 'secondary') return '#007AFF';
        return '#fff';
    };

  return (
    <TouchableOpacity
        style={[
            styles.button,
            { backgroundColor: getBackgroundColor() },
             variant === 'secondary' && styles.secondaryButton,
            style
        ]}
        disabled={disabled || loading}
        {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    width: '100%',
  },
  secondaryButton: {
      borderWidth: 1,
      borderColor: '#007AFF',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
