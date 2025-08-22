// screens/FoodDetailsScreen.js
// TODO: flesh out Food Details with actions, more info, etc.
import React from 'react';
import { Image, ScrollView, StyleSheet, Text } from 'react-native';
import Header from '../../components/Basic/Header';
import PrimaryButton from '../../components/Basic/PrimaryButton';
import MacroSummary from '../../components/Statistic/MacroSummary';

const mockFood = {
  name: 'Avocado Toast',
  image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  description: 'A healthy and delicious breakfast option packed with nutrients.',
  macros: [
    { label: 'Protein', value: 6 },
    { label: 'Carbs', value: 24 },
    { label: 'Fat', value: 12 },
  ],
};

export default function FoodDetailsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Header title="Food Details" icon="nutrition" />
      <Image source={{ uri: mockFood.image }} style={styles.image} />
      <Text style={styles.name}>{mockFood.name}</Text>
      <Text style={styles.desc}>{mockFood.description}</Text>
      <MacroSummary macros={mockFood.macros} />
      <PrimaryButton title="Add to Diary" onPress={() => {}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 180, borderRadius: 12, marginTop: 16 },
  name: { fontSize: 22, fontWeight: 'bold', margin: 16 },
  desc: { fontSize: 16, color: '#888', marginHorizontal: 16, marginBottom: 8 },
});