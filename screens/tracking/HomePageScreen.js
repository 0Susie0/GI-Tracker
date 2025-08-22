// screens/HomePageScreen.js
// TODO: flesh out HomeScreen with real data, navigation, etc.
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import Header from '../../components/Basic/Header';
import AIFoodSection from '../../components/Food/AIFoodSection';
import ManualSearchSection from '../../components/ManualSearchSection';
import RecentFoodsSection from '../../components/RecentFoodsSection';
import RecipesSection from '../../components/RecipesSection';
import StatsCards from '../../components/Statistic/StatsCards';
import { colors, spacing } from '../../utils/theme';

const mockStats = [
  { value: '1,247', label: 'Foods Tracked', color: colors.link },
  { value: '68', label: 'Avg Daily GI', color: colors.accent },
  { value: '12', label: 'Day Streak', color: colors.link },
];

const mockRecentFoods = [
  { 
    name: 'White Rice', 
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6', 
    gi: 73 
  },
  { 
    name: 'Jasmine Rice', 
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c', 
    gi: 89 
  },
];

export default function HomePageScreen() {
  const [searchValue, setSearchValue] = useState('');

  const handleUploadPhoto = () => {
    Alert.alert('Upload Photo', 'Photo upload functionality will be implemented here');
  };

  const handleTakePhoto = () => {
    Alert.alert('Take Photo', 'Camera functionality will be implemented here');
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      Alert.alert('Search', `Searching for: ${searchValue}`);
    }
  };

  const handleViewAllFoods = () => {
    Alert.alert('View All', 'Navigate to all foods screen');
  };

  const handleFoodPress = (food) => {
    Alert.alert('Food Details', `View details for: ${food.name}`);
  };

  const handleBrowseRecipes = () => {
    Alert.alert('Browse Recipes', 'Navigate to recipes screen');
  };

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
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearch={handleSearch}
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
}

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