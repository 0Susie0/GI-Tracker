// components/FilterChips.js
// TODO: flesh out FilterChips with selection, scroll, etc.
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../../utils/theme';

export default function FilterChips({ filters, selected, onSelect }) {
  return (
    <View style={styles.container}>
      {filters.map((filter) => {
        const isSelected = selected === filter;
        
        if (isSelected) {
          return (
            <TouchableOpacity
              key={filter}
              onPress={() => onSelect(filter)}
              style={styles.chipContainer}
            >
              <LinearGradient
                colors={colors.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.selectedChip}
              >
                <Text style={styles.selectedText}>{filter}</Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={filter}
            style={[styles.chipContainer, styles.chip]}
            onPress={() => onSelect(filter)}
          >
            <Text style={styles.chipText}>{filter}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: spacing(2),
    marginLeft: spacing(3),
  },
  chipContainer: {
    marginRight: spacing(2),
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  chip: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing(3.5),
    paddingVertical: spacing(1.5),
  },
  selectedChip: {
    paddingHorizontal: spacing(3.5),
    paddingVertical: spacing(1.5),
  },
  chipText: {
    color: colors.text,
    fontSize: fonts.caption,
  },
  selectedText: {
    color: '#fff',
    fontSize: fonts.caption,
    fontWeight: 'bold',
  },
});