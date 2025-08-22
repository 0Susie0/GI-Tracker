// components/FoodCard.js
// TODO: flesh out FoodCard with favorite, rating, etc.
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../utils/theme';

export default function FoodCard({ name, image, calories }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.calories}>{calories} kcal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    margin: spacing(2),
    alignItems: 'center',
    padding: spacing(3),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 140,
    maxWidth: 180,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: radius.sm,
    marginBottom: spacing(2),
  },
  name: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing(1),
    textAlign: 'center',
  },
  calories: {
    fontSize: fonts.caption,
    color: colors.subtext,
  },
});