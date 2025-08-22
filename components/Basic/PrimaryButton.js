// components/PrimaryButton.js
// TODO: flesh out PrimaryButton with loading, disabled, etc.
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, fonts, radius, spacing } from '../../utils/theme';

export default function PrimaryButton({ title, onPress, disabled = false, style }) {
  if (disabled) {
    return (
      <TouchableOpacity 
        style={[styles.button, styles.disabledButton, style]} 
        onPress={null} 
        activeOpacity={1}
      >
        <Text style={[styles.text, styles.disabledText]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.buttonContainer, style]} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={colors.primaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    margin: spacing(3),
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  button: {
    borderRadius: radius.md,
    paddingVertical: spacing(3.5),
    paddingHorizontal: spacing(6),
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.border,
    margin: spacing(3),
  },
  text: {
    color: '#fff',
    fontSize: fonts.body,
    fontWeight: 'bold',
  },
  disabledText: {
    color: colors.subtext,
  },
});