// components/Basic/PrimaryButton.tsx
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { PrimaryButtonProps } from '../../types/components';
import { colors, fonts, radius, spacing } from '../../utils/theme';

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  title, 
  onPress, 
  disabled = false, 
  loading = false,
  style,
  variant = 'primary',
  size = 'medium'
}) => {
  if (disabled) {
    return (
      <TouchableOpacity 
        style={[styles.button, styles.disabledButton, style]} 
        onPress={undefined} 
        activeOpacity={1}
        disabled={true}
      >
        <Text style={[styles.text, styles.disabledText]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  const buttonSize = size === 'small' ? styles.smallButton : 
                   size === 'large' ? styles.largeButton : styles.button;

  const textSize = size === 'small' ? styles.smallText :
                  size === 'large' ? styles.largeText : styles.text;

  return (
    <TouchableOpacity 
      style={[styles.buttonContainer, buttonSize, style]} 
      onPress={onPress} 
      activeOpacity={0.8}
      disabled={loading}
    >
      <LinearGradient
        colors={colors.primaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientButton}
      >
        <Text style={[textSize, { opacity: loading ? 0.7 : 1 }]}>
          {loading ? 'Loading...' : title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

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
  smallButton: {
    borderRadius: radius.sm,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(4),
    alignItems: 'center',
  },
  largeButton: {
    borderRadius: radius.lg,
    paddingVertical: spacing(4),
    paddingHorizontal: spacing(8),
    alignItems: 'center',
  },
  gradientButton: {
    borderRadius: radius.md,
    paddingVertical: spacing(3.5),
    paddingHorizontal: spacing(6),
    alignItems: 'center',
    justifyContent: 'center',
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
  smallText: {
    color: '#fff',
    fontSize: fonts.caption,
    fontWeight: 'bold',
  },
  largeText: {
    color: '#fff',
    fontSize: fonts.title,
    fontWeight: 'bold',
  },
  disabledText: {
    color: colors.subtext,
  },
});

export default PrimaryButton;

