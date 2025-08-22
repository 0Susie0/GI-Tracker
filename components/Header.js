// components/Header.js
// TODO: flesh out header with navigation actions, logo, etc.
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, fonts, spacing } from '../utils/theme';

export default function Header({ title, icon = 'ios-restaurant' }) {
  return (
    <LinearGradient
      colors={colors.primaryGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.header}
    >
      <Ionicons name={icon} size={24} color="#fff" style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing(4),
    paddingHorizontal: spacing(5),
    width: '100%',
  },
  icon: {
    marginRight: spacing(3),
  },
  title: {
    color: '#fff',
    fontSize: fonts.title,
    fontWeight: 'bold',
  },
});