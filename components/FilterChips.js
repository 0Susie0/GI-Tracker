// components/FilterChips.js
// TODO: flesh out FilterChips with selection, scroll, etc.
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FilterChips({ filters, selected, onSelect }) {
  return (
    <View style={styles.container}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.chip,
            selected === filter && styles.selectedChip,
          ]}
          onPress={() => onSelect(filter)}
        >
          <Text style={[
            styles.chipText,
            selected === filter && styles.selectedText,
          ]}>{filter}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,
    marginLeft: 12,
  },
  chip: {
    backgroundColor: '#eee',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
  },
  selectedChip: {
    backgroundColor: '#4CAF50',
  },
  chipText: {
    color: '#333',
    fontSize: 14,
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});