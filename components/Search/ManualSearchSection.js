// components/ManualSearchSection.js
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../utils/theme';

export default function ManualSearchSection({ searchValue, onSearchChange, onSearch }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="search" size={20} color={colors.text} style={styles.headerIcon} />
        <Text style={styles.headerText}>Manual Search</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={16} color={colors.subtext} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder="Search for food (e.g., brown rice, apple, bread...)"
            placeholderTextColor={colors.subtext}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
  },
  searchContainer: {
    flexDirection: 'row',
    gap: spacing(2),
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
  },
  searchIcon: {
    marginRight: spacing(2),
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: fonts.caption,
    color: colors.text,
  },
  searchButton: {
    backgroundColor: colors.text,
    borderRadius: radius.md,
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(2.5),
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: fonts.caption,
    fontWeight: 'bold',
  },
});
