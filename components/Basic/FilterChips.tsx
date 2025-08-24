// components/Basic/FilterChips.tsx
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FilterChipsProps } from '../../types/components';
import { colors, fonts, radius, spacing } from '../../utils/theme';

const FilterChips: React.FC<FilterChipsProps> = ({ 
  filters, 
  selected, 
  onSelect, 
  multiple = false, 
  selectedItems = [] 
}) => {
  const handleSelection = (filter: string) => {
    onSelect(filter);
  };

  const isFilterSelected = (filter: string): boolean => {
    if (multiple) {
      return selectedItems.includes(filter);
    }
    return selected === filter;
  };

  const renderChip = (filter: string) => {
    const isSelected = isFilterSelected(filter);
    
    if (isSelected) {
      return (
        <TouchableOpacity
          key={filter}
          onPress={() => handleSelection(filter)}
          style={styles.chipContainer}
          activeOpacity={0.8}
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
        onPress={() => handleSelection(filter)}
        activeOpacity={0.7}
      >
        <Text style={styles.chipText}>{filter}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map(renderChip)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(3),
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
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
    fontSize: fonts.caption,
    fontWeight: 'bold',
  },
});

export default FilterChips;

