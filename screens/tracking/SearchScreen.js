import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import debounce from 'lodash.debounce';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import FoodCard from '../../components/Food/FoodCard';
import SearchBar from '../../components/Search/SearchBar';

export default function SearchScreen() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const navigation = useNavigation();
  const db = getFirestore();

  // Debounced search function
  const doSearch = useCallback(
    debounce(async (text) => {
      if (!text) {
        setResults([]);
        setNoResults(false);
        setLoading(false);
        return;
      }
      setLoading(true);
      setNoResults(false);
      try {
        const foodsRef = collection(db, 'foods');
        // Firestore does not support startsWith natively, so we use >= and < for prefix search
        const q = query(
          foodsRef,
          where('name', '>=', text),
          where('name', '<', text + '\uf8ff')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setResults(data);
        setNoResults(data.length === 0);
      } catch (e) {
        setResults([]);
        setNoResults(true);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleSearchChange = (text) => {
    setSearch(text);
    doSearch(text.trim());
  };

  const handleFoodPress = (item) => {
    navigation.navigate('FoodDetails', { id: item.id });
  };

  return (
    <View style={{ flex: 1 }}>
      <SearchBar value={search} onChangeText={handleSearchChange} placeholder="Search foods..." />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} size="large" />
      ) : noResults ? (
        <Text style={styles.noResults}>No results found.</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <FoodCard {...item} onPress={() => handleFoodPress(item)} />
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  noResults: {
    textAlign: 'center',
    marginTop: 32,
    color: '#888',
    fontSize: 16,
  },
});