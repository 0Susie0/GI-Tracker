// components/ProgressChart.js
// TODO: flesh out ProgressChart with real chart library
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ProgressChart({ percent = 60 }) {
  return (
    <View style={styles.container}>
      <Ionicons name="stats-chart" size={48} color="#4CAF50" />
      <Text style={styles.text}>{percent}%</Text>
      <Text style={styles.label}>Weekly Progress</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});