// components/InputField.js
// TODO: flesh out InputField with validation, icons, etc.
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../../utils/theme';

export default function InputField({ value, onChangeText, placeholder, secureTextEntry = false }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.subtext}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing(2),
    marginHorizontal: spacing(3),
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing(3),
    fontSize: fonts.body,
    backgroundColor: colors.card,
    color: colors.text,
  },
});