import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const ValidatedInputField = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  validationType = 'none',
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  const validateField = (text) => {
    if (!hasBeenTouched && !text) return { isValid: true, error: '' };
    
    switch (validationType) {
      case 'email':
        return validateEmail(text);
      case 'password':
        return validatePassword(text);
      case 'required':
        return validateRequired(text);
      default:
        return { isValid: true, error: '' };
    }
  };

  const validateEmail = (email) => {
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    return { isValid: true, error: '' };
  };

  const validatePassword = (password) => {
    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }
    if (password.length < 6) {
      return { isValid: false, error: 'Password must be at least 6 characters' };
    }
    return { isValid: true, error: '' };
  };

  const validateRequired = (text) => {
    if (!text || text.trim().length === 0) {
      return { isValid: false, error: 'This field is required' };
    }
    return { isValid: true, error: '' };
  };

  const validation = validateField(value);
  const showError = !validation.isValid && hasBeenTouched;
  const showSuccess = validation.isValid && hasBeenTouched && value;

  const handleChangeText = (text) => {
    if (!hasBeenTouched) {
      setHasBeenTouched(true);
    }
    onChangeText(text);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setHasBeenTouched(true);
  };

  const getInputStyle = () => {
    if (showError) return [styles.input, styles.inputError];
    if (showSuccess) return [styles.input, styles.inputSuccess];
    if (isFocused) return [styles.input, styles.inputFocused];
    return styles.input;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          style={getInputStyle()}
          placeholderTextColor="#aaa"
          {...props}
        />
        {showSuccess && (
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          </View>
        )}
        {showError && (
          <View style={styles.iconContainer}>
            <Ionicons name="alert-circle" size={20} color="#ff4444" />
          </View>
        )}
      </View>
      {showError && (
        <Text style={styles.errorText}>{validation.error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  inputFocused: {
    borderColor: '#4CAF50',
  },
  inputSuccess: {
    borderColor: '#4CAF50',
    backgroundColor: '#f8fff8',
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff8f8',
  },
  iconContainer: {
    position: 'absolute',
    right: 16,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default ValidatedInputField;
