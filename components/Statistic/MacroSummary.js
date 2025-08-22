// components/MacroSummary.js
// TODO: flesh out MacroSummary with icons, progress bars, etc.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../../utils/theme';

export default function MacroSummary({ macros }) {
  return (
    <View style={styles.container}>
      {macros.map((macro) => (
        <View key={macro.label} style={styles.item}>
          <Text style={styles.value}>{macro.value}g</Text>
          <Text style={styles.label}>{macro.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.card,
    marginVertical: spacing(3),
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
  item: {
    alignItems: 'center',
  },
  label: {
    fontSize: fonts.caption,
    color: colors.subtext,
    marginTop: spacing(1),
  },
  value: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: colors.text,
  },
});