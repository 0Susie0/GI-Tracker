// components/Authentification/ValidatedInputField.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { ValidatedInputFieldProps } from '../../types/components';
import { colors, fonts, radius, spacing } from '../../utils/theme';

type ValidationType = 'none' | 'email' | 'password' | 'required';

interface ValidationResult {
  isValid: boolean;
  error: string;
}

interface ExtendedValidatedInputFieldProps extends ValidatedInputFieldProps {
  validationType?: ValidationType;
}

const ValidatedInputField: React.FC<ExtendedValidatedInputFieldProps> = ({
  value,
  onChangeText,
  onBlur,
  onFocus,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
  maxLength,
  editable = true,
  required = false,
  validationType = 'none',
  validationRules = [],
  showValidation = true,
  validateOnChange = true,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  const validateField = (text: string): ValidationResult => {
    if (!hasBeenTouched && !text) return { isValid: true, error: '' };
    
    // Use custom validation rules if provided
    if (validationRules.length > 0) {
      for (const rule of validationRules) {
        if (!rule.test(text)) {
          return { isValid: false, error: rule.message };
        }
      }
      return { isValid: true, error: '' };
    }

    // Use built-in validation types
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

  const validateEmail = (email: string): ValidationResult => {
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    return { isValid: true, error: '' };
  };

  const validatePassword = (password: string): ValidationResult => {
    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }
    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters' };
    }
    return { isValid: true, error: '' };
  };

  const validateRequired = (text: string): ValidationResult => {
    if (!text || text.trim().length === 0) {
      return { isValid: false, error: 'This field is required' };
    }
    return { isValid: true, error: '' };
  };

  const validation = validateField(value);
  const displayError = error || (showValidation ? validation.error : '');
  const showError = !validation.isValid && hasBeenTouched && showValidation;
  const showSuccess = validation.isValid && hasBeenTouched && value && showValidation;

  const handleChangeText = (text: string) => {
    if (!hasBeenTouched && validateOnChange) {
      setHasBeenTouched(true);
    }
    onChangeText(text);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setHasBeenTouched(true);
    onBlur?.();
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const getInputStyle = () => {
    const baseStyle: any[] = [styles.input];
    if (showError) baseStyle.push(styles.inputError);
    else if (showSuccess) baseStyle.push(styles.inputSuccess);
    else if (isFocused) baseStyle.push(styles.inputFocused);
    
    if (multiline) baseStyle.push(styles.inputMultiline);
    return baseStyle;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={editable}
          style={getInputStyle()}
          placeholderTextColor={colors.subtext}
          {...props}
        />
        {showSuccess && (
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
          </View>
        )}
        {showError && (
          <View style={styles.iconContainer}>
            <Ionicons name="alert-circle" size={20} color="#ff4444" />
          </View>
        )}
      </View>
      {(showError || error) && (
        <Text style={styles.errorText}>{displayError}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing(2),
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing(4),
    fontSize: fonts.body,
    backgroundColor: colors.card,
    color: colors.text,
    minHeight: 44,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputFocused: {
    borderColor: colors.link,
  },
  inputSuccess: {
    borderColor: colors.accent,
    backgroundColor: colors.card,
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: colors.card,
  },
  iconContainer: {
    position: 'absolute',
    right: spacing(4),
  },
  errorText: {
    color: '#ff4444',
    fontSize: fonts.caption,
    marginTop: spacing(1),
    marginLeft: spacing(1),
  },
});

export default ValidatedInputField;

