// screens/tracking/HomePageScreen.tsx
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { AIFoodSection, Header, ManualSearchSection, RecipesSection } from '../../components';
import RecentFoodsSection from '../../components/Food/RecentFoodsSection';
import StatsCards from '../../components/Statistic/StatsCards';
import { FoodItem, StatCard } from '../../types/app';
import { TrackingScreenProps } from '../../types/navigation';
import { colors, spacing } from '../../utils/theme';

type HomePageScreenProps = TrackingScreenProps<'HomePage'>;

const mockStats: StatCard[] = [
  { value: '1,247', label: 'Foods Tracked', color: colors.link },
  { value: '68', label: 'Avg Daily GI', color: colors.accent },
  { value: '12', label: 'Day Streak', color: colors.link },
];

const mockRecentFoods: FoodItem[] = [
  { 
    id: '1',
    name: 'White Rice', 
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6', 
    gi: 73,
    servingSize: '1 cup',
    calories: 205,
    carbs: 45,
    fiber: 0.6,
    protein: 4.3,
    category: 'grains'
  },
  { 
    id: '2',
    name: 'Jasmine Rice', 
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c', 
    gi: 89,
    servingSize: '1 cup',
    calories: 205,
    carbs: 45,
    fiber: 0.6,
    protein: 4.3,
    category: 'grains'
  },
];

const HomePageScreen: React.FC<HomePageScreenProps> = ({ navigation }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleUploadPhoto = useCallback((): void => {
    // Navigate to camera screen with upload mode
    navigation.navigate('CameraScan', { mode: 'upload' });
  }, [navigation]);

  const handleTakePhoto = useCallback((): void => {
    // Navigate to camera screen with camera mode
    navigation.navigate('CameraScan', { mode: 'camera' });
  }, [navigation]);

  const handleSearch = useCallback((query?: string): void => {
    const searchQuery = query || searchValue.trim();
    if (searchQuery) {
      navigation.navigate('Search', { initialQuery: searchQuery });
    }
  }, [navigation, searchValue]);

  const handleViewAllFoods = useCallback((): void => {
    navigation.navigate('Search', { showRecent: true });
  }, [navigation]);

  const handleFoodPress = useCallback((food: FoodItem): void => {
    navigation.navigate('FoodDetails', { 
      foodId: food.id,
      food: food 
    });
  }, [navigation]);

  const handleBrowseRecipes = useCallback((): void => {
    // Navigate to recipes screen when implemented
    Alert.alert(
      'Browse Recipes', 
      'Recipe browsing will be available in a future update!',
      [{ text: 'OK' }]
    );
  }, []);

  const handleRecentSearch = useCallback((query: string): void => {
    setSearchValue(query);
    handleSearch(query);
  }, [handleSearch]);

  const handleFilterPress = useCallback((): void => {
    // Navigate to advanced search/filter screen when implemented
    Alert.alert(
      'Filters', 
      'Advanced filtering will be available in a future update!',
      [{ text: 'OK' }]
    );
  }, []);

  return (
    <View style={styles.container}>
      <Header title="GI Tracker" icon="restaurant" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <StatsCards stats={mockStats} />
        
        <AIFoodSection 
          onUploadPhoto={handleUploadPhoto}
          onTakePhoto={handleTakePhoto}
        />
        
        <ManualSearchSection 
          onSearch={handleSearch}
          onFilterPress={handleFilterPress}
          onRecentSearch={handleRecentSearch}
          recentSearches={['brown rice', 'quinoa', 'sweet potato']}
        />
        
        <RecentFoodsSection 
          foods={mockRecentFoods}
          onViewAll={handleViewAllFoods}
          onFoodPress={handleFoodPress}
        />
        
        <RecipesSection onBrowseRecipes={handleBrowseRecipes} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: spacing(2),
    paddingBottom: spacing(6),
  },
});

export default HomePageScreen;
