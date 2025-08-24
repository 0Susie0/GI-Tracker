// components/Basic/InputField.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { InputFieldProps } from '../../types/components';
import { colors, fonts, radius, spacing } from '../../utils/theme';

const InputField: React.FC<InputFieldProps> = ({ 
  label,
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
  style
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const borderColor = error ? colors.accent : isFocused ? colors.link : colors.border;
  const showPasswordToggle = secureTextEntry;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View style={[styles.inputContainer, { borderColor }]}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            showPasswordToggle && styles.inputWithIcon
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.subtext}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={editable}
        />
        
        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color={colors.subtext}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing(2),
    marginHorizontal: spacing(3),
  },
  label: {
    fontSize: fonts.caption,
    color: colors.text,
    marginBottom: spacing(1),
    fontWeight: '600',
  },
  required: {
    color: colors.accent,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    padding: spacing(3),
    fontSize: fonts.body,
    color: colors.text,
    minHeight: 44,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    paddingRight: spacing(1),
  },
  passwordToggle: {
    padding: spacing(2),
    marginRight: spacing(1),
  },
  errorText: {
    fontSize: fonts.caption,
    color: colors.accent,
    marginTop: spacing(1),
    marginLeft: spacing(1),
  },
});

export default InputField;

