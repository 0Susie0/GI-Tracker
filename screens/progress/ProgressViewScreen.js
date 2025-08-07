// screens/ProgressViewScreen.js
// TODO: flesh out ProgressViewScreen with real chart, tabs, etc.
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '../../components/Header';
import MacroSummary from '../../components/MacroSummary';
import ProgressChart from '../../components/ProgressChart';

const mockMacros = [
  { label: 'Protein', value: 80 },
  { label: 'Carbs', value: 150 },
  { label: 'Fat', value: 50 },
];

export default function ProgressViewScreen() {
  return (
    <View style={styles.container}>
      <Header title="Progress" icon="trending-up" />
      <ProgressChart percent={60} />
      <MacroSummary macros={mockMacros} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 8 },
});