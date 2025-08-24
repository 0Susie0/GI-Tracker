// components/Search/ManualSearchSection.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ManualSearchSectionProps } from '../../types/components';
import { colors, fonts, radius, spacing } from '../../utils/theme';

const ManualSearchSection: React.FC<ManualSearchSectionProps> = ({ 
  onSearch, 
  onFilterPress,
  recentSearches = [],
  onRecentSearch,
  style 
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const handleRecentSearch = (query: string) => {
    setSearchValue(query);
    onRecentSearch?.(query);
  };

  const clearRecentSearches = () => {
    // This would typically call a parent function to clear stored recent searches
    console.log('Clear recent searches requested');
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Ionicons name="search" size={20} color={colors.text} style={styles.headerIcon} />
        <Text style={styles.headerText}>Manual Search</Text>
        {onFilterPress && (
          <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
            <Ionicons name="filter" size={20} color={colors.link} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={16} color={colors.subtext} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            value={searchValue}
            onChangeText={setSearchValue}
            onSubmitEditing={handleSearch}
            placeholder="Search for food (e.g., brown rice, apple, bread...)"
            placeholderTextColor={colors.subtext}
            returnKeyType="search"
            autoCorrect={false}
          />
        </View>
        <TouchableOpacity 
          style={[
            styles.searchButton, 
            !searchValue.trim() && styles.searchButtonDisabled
          ]} 
          onPress={handleSearch}
          disabled={!searchValue.trim()}
        >
          <Text style={[
            styles.searchButtonText,
            !searchValue.trim() && styles.searchButtonTextDisabled
          ]}>
            Search
          </Text>
        </TouchableOpacity>
      </View>

      {recentSearches.length > 0 && (
        <View style={styles.recentContainer}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={clearRecentSearches}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={recentSearches.slice(0, 5)} // Show only last 5 searches
            keyExtractor={(item, index) => `recent-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.recentItem}
                onPress={() => handleRecentSearch(item)}
              >
                <Ionicons name="time" size={14} color={colors.subtext} />
                <Text style={styles.recentText} numberOfLines={1}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ width: spacing(2) }} />}
            contentContainerStyle={styles.recentList}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing(3),
    marginVertical: spacing(2),
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing(4),
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(3),
  },
  headerIcon: {
    marginRight: spacing(2),
  },
  headerText: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  filterButton: {
    padding: spacing(1),
  },
  searchContainer: {
    flexDirection: 'row',
    gap: spacing(2),
    marginBottom: spacing(3),
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    paddingHorizontal: spacing(3),
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  searchIcon: {
    marginRight: spacing(2),
  },
  input: {
    flex: 1,
    fontSize: fonts.body,
    color: colors.text,
    paddingVertical: 0,
  },
  searchButton: {
    backgroundColor: colors.text,
    borderRadius: radius.md,
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(2.5),
    justifyContent: 'center',
    minHeight: 44,
  },
  searchButtonDisabled: {
    backgroundColor: colors.border,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: fonts.body,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchButtonTextDisabled: {
    color: colors.subtext,
  },
  recentContainer: {
    marginTop: spacing(2),
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  recentTitle: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.text,
  },
  clearText: {
    fontSize: fonts.caption,
    color: colors.link,
    fontWeight: '500',
  },
  recentList: {
    paddingHorizontal: 0,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    paddingHorizontal: spacing(2.5),
    paddingVertical: spacing(1.5),
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: 120,
  },
  recentText: {
    fontSize: fonts.caption,
    color: colors.text,
    marginLeft: spacing(1),
    flex: 1,
  },
});

export default ManualSearchSection;
