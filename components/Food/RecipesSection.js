// components/RecipesSection.js
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../utils/theme';

export default function RecipesSection({ onBrowseRecipes }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="book" size={20} color={colors.text} style={styles.headerIcon} />
        <Text style={styles.headerText}>Diabetic-Friendly Recipes</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="book-outline" size={32} color={colors.link} />
        </View>
        
        <Text style={styles.title}>Discover Low-GI Recipes</Text>
        <Text style={styles.description}>
          Explore our collection of diabetic-friendly recipes designed to help manage blood sugar levels
        </Text>
        
        <TouchableOpacity style={styles.browseButton} onPress={onBrowseRecipes}>
          <LinearGradient
            colors={colors.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Ionicons name="book" size={16} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Browse Recipes</Text>
          </LinearGradient>
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
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing(3),
  },
  title: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing(2),
  },
  description: {
    fontSize: fonts.caption,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: spacing(4),
    paddingHorizontal: spacing(2),
  },
  browseButton: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(3),
    paddingHorizontal: spacing(6),
  },
  buttonIcon: {
    marginRight: spacing(1),
  },
  buttonText: {
    color: '#fff',
    fontSize: fonts.caption,
    fontWeight: 'bold',
  },
});
