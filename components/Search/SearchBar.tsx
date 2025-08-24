// components/Search/SearchBar.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SearchBarProps } from '../../types/components';
import { colors, fonts, radius, spacing } from '../../utils/theme';

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChangeText, 
  onSubmit,
  onClear,
  placeholder = "Search...",
  loading = false,
  showFilter = false,
  onFilterPress,
  style
}) => {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const handleChangeText = (text: string) => {
    onChangeText(text);
    
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer for auto-submit after 500ms of no typing
    const timer = setTimeout(() => {
      if (text.trim() && onSubmit) {
        onSubmit();
      }
    }, 500);
    
    setDebounceTimer(timer);
  };

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit?.();
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={20} color={colors.subtext} style={styles.icon} />
      
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.subtext}
        returnKeyType="search"
        autoCorrect={false}
        editable={!loading}
      />
      
      {value.length > 0 && (
        <TouchableOpacity 
          onPress={handleClear} 
          style={styles.clearButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close-circle" size={20} color={colors.subtext} />
        </TouchableOpacity>
      )}
      
      {loading && (
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass" size={16} color={colors.subtext} />
        </View>
      )}
      
      {showFilter && (
        <TouchableOpacity 
          onPress={onFilterPress} 
          style={styles.filterButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="filter" size={20} color={colors.link} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing(3),
    margin: spacing(3),
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minHeight: 48,
  },
  icon: {
    marginRight: spacing(2),
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: fonts.body,
    color: colors.text,
    paddingVertical: 0, // Remove default padding for consistent height
  },
  clearButton: {
    marginLeft: spacing(1),
    padding: spacing(1),
  },
  loadingContainer: {
    marginLeft: spacing(1),
    padding: spacing(1),
  },
  filterButton: {
    marginLeft: spacing(1),
    padding: spacing(1),
  },
});

export default SearchBar;
