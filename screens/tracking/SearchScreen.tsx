// screens/tracking/SearchScreen.tsx
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
// @ts-ignore
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { FoodCard, SearchBar } from '../../components';
import { FoodItem } from '../../types/app';
import { TrackingScreenProps } from '../../types/navigation';
import { colors, fonts, spacing } from '../../utils/theme';

type SearchScreenProps = TrackingScreenProps<'Search'>;

interface SearchResult extends FoodItem {
  id: string;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, route }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const db = getFirestore();

  // Initialize search from route params
  useEffect(() => {
    const { initialQuery, showRecent } = route.params || {};
    
    if (initialQuery) {
      setSearch(initialQuery);
      performSearch(initialQuery);
    } else if (showRecent) {
      loadRecentFoods();
    }
  }, [route.params]);

  // Debounced search function
  const performSearch = useCallback(
    debounce(async (text: string) => {
      if (!text.trim()) {
        setResults([]);
        setNoResults(false);
        setLoading(false);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setNoResults(false);
      setHasSearched(true);

      try {
        const foodsRef = collection(db, 'foods');
        
        // Firestore does not support case-insensitive search, so we use prefix search
        const searchLower = text.toLowerCase();
        const q = query(
          foodsRef,
          where('nameLower', '>=', searchLower),
          where('nameLower', '<', searchLower + '\uf8ff')
        );
        
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as SearchResult[];

        // Also search by category or other fields if no direct name match
        if (data.length === 0) {
          const categoryQuery = query(
            foodsRef,
            where('category', '==', searchLower)
          );
          const categorySnapshot = await getDocs(categoryQuery);
          const categoryData = categorySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          })) as SearchResult[];
          
          setResults(categoryData);
          setNoResults(categoryData.length === 0);
        } else {
          setResults(data);
          setNoResults(false);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setNoResults(true);
      } finally {
        setLoading(false);
      }
    }, 500),
    [db]
  );

  const loadRecentFoods = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      // Load recently viewed/searched foods
      // This would typically come from user's search history or recently viewed items
      const foodsRef = collection(db, 'foods');
      const snapshot = await getDocs(query(foodsRef));
      const data = snapshot.docs
        .slice(0, 10) // Limit to 10 recent items
        .map(doc => ({ id: doc.id, ...doc.data() })) as SearchResult[];
      
      setResults(data);
      setHasSearched(true);
    } catch (error) {
      console.error('Load recent foods error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [db]);

  const handleSearchChange = (text: string): void => {
    setSearch(text);
    performSearch(text.trim());
  };

  const handleSearchSubmit = (): void => {
    if (search.trim()) {
      performSearch(search.trim());
    }
  };

  const handleSearchClear = (): void => {
    setSearch('');
    setResults([]);
    setNoResults(false);
    setHasSearched(false);
  };

  const handleFoodPress = useCallback((item: SearchResult): void => {
    navigation.navigate('FoodDetails', { 
      foodId: item.id,
      food: item
    });
  }, [navigation]);

  const handleFilterPress = useCallback((): void => {
    // Navigate to filter screen when implemented
    console.log('Filter functionality will be implemented');
  }, []);

  const renderFoodItem = ({ item }: { item: SearchResult }) => (
    <FoodCard 
      food={item}
      layout="list"
      showGI={true}
      onPress={() => handleFoodPress(item)}
    />
  );

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.link} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }

    if (!hasSearched) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyTitle}>Search for Foods</Text>
          <Text style={styles.emptyDescription}>
            Enter a food name to find nutritional information and GI values
          </Text>
        </View>
      );
    }

    if (noResults) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.noResultsTitle}>No Results Found</Text>
          <Text style={styles.noResultsDescription}>
            Try adjusting your search terms or browse our food categories
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <SearchBar 
        value={search} 
        onChangeText={handleSearchChange}
        onSubmit={handleSearchSubmit}
        onClear={handleSearchClear}
        placeholder="Search foods..."
        showFilter={true}
        onFilterPress={handleFilterPress}
        loading={loading}
      />
      
      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderFoodItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  listContainer: {
    padding: spacing(4),
    paddingBottom: spacing(6),
  },
  separator: {
    height: spacing(2),
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing(6),
  },
  loadingText: {
    marginTop: spacing(3),
    fontSize: fonts.body,
    color: colors.subtext,
  },
  emptyTitle: {
    fontSize: fonts.title,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(2),
  },
  emptyDescription: {
    fontSize: fonts.body,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },
  noResultsTitle: {
    fontSize: fonts.subtitle,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(2),
  },
  noResultsDescription: {
    fontSize: fonts.body,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default SearchScreen;
