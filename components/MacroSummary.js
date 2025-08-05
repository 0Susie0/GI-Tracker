// components/MacroSummary.js
// TODO: flesh out MacroSummary with icons, progress bars, etc.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MacroSummary({ macros }) {
  return (
    <View style={styles.container}>
      {macros.map((macro) => (
        <View key={macro.label} style={styles.item}>
          <Text style={styles.label}>{macro.label}</Text>
          <Text style={styles.value}>{macro.value}g</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
    width: '100%',
  },
  item: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#888',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});