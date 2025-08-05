// components/FoodCard.js
// TODO: flesh out FoodCard with favorite, rating, etc.
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

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
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    margin: 8,
    alignItems: 'center',
    padding: 12,
    elevation: 2,
    minWidth: 140,
    maxWidth: 180,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calories: {
    fontSize: 14,
    color: '#888',
  },
});