// components/StatsCards.js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../../utils/theme';

export default function StatsCards({ stats }) {
  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.card}>
          <Text style={[styles.value, { color: stat.color || colors.link }]}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing(3),
    marginVertical: spacing(2),
  },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing(4),
    marginHorizontal: spacing(1),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  value: {
    fontSize: fonts.title,
    fontWeight: 'bold',
    marginBottom: spacing(1),
  },
  label: {
    fontSize: fonts.caption,
    color: colors.subtext,
    textAlign: 'center',
  },
});
