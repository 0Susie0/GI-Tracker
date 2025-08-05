// screens/HomeScreen.js
// TODO: flesh out HomeScreen with real data, navigation, etc.
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import FilterChips from '../../components/FilterChips';
import FoodCard from '../../components/FoodCard';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';

const mockFoods = [
  { name: 'Avocado Toast', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', calories: 250 },
  { name: 'Berry Smoothie', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c', calories: 180 },
  { name: 'Chicken Salad', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0', calories: 320 },
  { name: 'Veggie Bowl', image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc', calories: 210 },
];
const filters = ['All', 'Breakfast', 'Lunch', 'Dinner'];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('All');
  return (
    <View style={styles.container}>
      <Header title="Home" icon="home" />
      <SearchBar value={search} onChangeText={setSearch} />
      <FilterChips filters={filters} selected={selected} onSelect={setSelected} />
      <FlatList
        data={mockFoods.filter(f => selected === 'All' || f.name.includes(selected))}
        keyExtractor={item => item.name}
        renderItem={({ item }) => <FoodCard {...item} />}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 8 },
  grid: { paddingHorizontal: 8 },
});