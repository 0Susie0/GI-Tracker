// components/ProgressChart.js
// TODO: flesh out ProgressChart with real chart library
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../utils/theme';

export default function ProgressChart({ percent = 60 }) {
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Ionicons name="stats-chart" size={48} color={colors.accent} />
        <Text style={styles.text}>{percent}%</Text>
      </View>
      <Text style={styles.label}>Weekly Progress</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.card,
    marginVertical: spacing(4),
    marginHorizontal: spacing(3),
    padding: spacing(4),
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  text: {
    fontSize: fonts.title,
    fontWeight: 'bold',
    color: colors.accent,
    marginTop: spacing(2),
  },
  label: {
    fontSize: fonts.caption,
    color: colors.subtext,
  },
});