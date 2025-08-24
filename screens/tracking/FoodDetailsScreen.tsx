// screens/tracking/FoodDetailsScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Header, PrimaryButton } from '../../components';
import MacroSummary from '../../components/Statistic/MacroSummary';
import { FoodItem } from '../../types/app';
import { TrackingScreenProps } from '../../types/navigation';
import { colors, fonts, radius, spacing } from '../../utils/theme';

type FoodDetailsScreenProps = TrackingScreenProps<'FoodDetails'>;

interface NutritionFacts {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  saturatedFat?: number;
}

interface ServingOption {
  id: string;
  name: string;
  grams: number;
  multiplier: number;
}

const FoodDetailsScreen: React.FC<FoodDetailsScreenProps> = ({ navigation, route }) => {
  const { foodId, foodName, food } = route.params || {};
  
  const [selectedServing, setSelectedServing] = useState<ServingOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [nutritionFacts, setNutritionFacts] = useState<NutritionFacts | null>(null);

  // Mock data - in real app, this would come from API or route params
  const mockFood: FoodItem = food || {
    id: foodId || '1',
    name: foodName || 'Avocado Toast',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    description: 'A healthy and delicious breakfast option packed with nutrients and healthy fats.',
    gi: 45,
    servingSize: '1 slice',
    calories: 215,
    carbs: 24,
    fiber: 7,
    protein: 6,
    fat: 12,
    category: 'prepared foods',
    glycemicLoad: 11,
  };

  const servingOptions: ServingOption[] = [
    { id: '1', name: '1 slice', grams: 85, multiplier: 1 },
    { id: '2', name: '2 slices', grams: 170, multiplier: 2 },
    { id: '3', name: '100g', grams: 100, multiplier: 1.18 },
    { id: '4', name: '1 cup pieces', grams: 150, multiplier: 1.76 },
  ];

  useEffect(() => {
    // Set default serving
    setSelectedServing(servingOptions[0]);
    
    // Calculate nutrition facts
    setNutritionFacts({
      calories: mockFood.calories,
      carbs: mockFood.carbs,
      protein: mockFood.protein,
      fat: mockFood.fat || 0,
      fiber: mockFood.fiber,
      sugar: Math.round(mockFood.carbs * 0.3), // Mock sugar content
      sodium: 125, // Mock sodium content
      cholesterol: 0,
      saturatedFat: Math.round((mockFood.fat || 0) * 0.25),
    });
  }, []);

  const calculateNutrition = useCallback((baseValue: number): number => {
    const servingMultiplier = selectedServing?.multiplier || 1;
    return Math.round(baseValue * servingMultiplier * quantity);
  }, [selectedServing, quantity]);

  const getMacroData = useCallback(() => {
    if (!nutritionFacts || !selectedServing) return null;
    
    return {
      carbs: { current: calculateNutrition(nutritionFacts.carbs), target: 200 },
      protein: { current: calculateNutrition(nutritionFacts.protein), target: 100 },
      fat: { current: calculateNutrition(nutritionFacts.fat), target: 70 },
      calories: { current: calculateNutrition(nutritionFacts.calories), target: 2000 },
    };
  }, [nutritionFacts, selectedServing, calculateNutrition]);

  const handleAddToLog = async (): Promise<void> => {
    if (!selectedServing) {
      Alert.alert('Error', 'Please select a serving size.');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call to add food to diary
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Success!',
        `${mockFood.name} has been added to your food diary.`,
        [
          {
            text: 'Add Another',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'View Diary',
            onPress: () => navigation.navigate('HomePage'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add food to diary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = (): void => {
    // TODO: Implement favorite functionality
    Alert.alert('Coming Soon', 'Favorite functionality will be available in a future update.');
  };

  const getGIColor = (gi: number): string => {
    if (gi <= 55) return colors.accent; // Low GI - green
    if (gi <= 70) return '#F59E0B'; // Medium GI - orange
    return '#EF4444'; // High GI - red
  };

  const getGILabel = (gi: number): string => {
    if (gi <= 55) return 'Low';
    if (gi <= 70) return 'Medium';
    return 'High';
  };

  const macroData = getMacroData();

  return (
    <View style={styles.container}>
      <Header title="Food Details" icon="nutrition" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Food Image */}
        <View style={styles.imageContainer}>
          {mockFood.image ? (
            <Image source={{ uri: mockFood.image }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <Ionicons name="restaurant" size={48} color={colors.subtext} />
            </View>
          )}
          <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
            <Ionicons name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Food Info */}
        <View style={styles.infoSection}>
          <Text style={styles.foodName}>{mockFood.name}</Text>
          {mockFood.description && (
            <Text style={styles.description}>{mockFood.description}</Text>
          )}
          
          {/* GI Badge */}
          <View style={styles.giBadgeContainer}>
            <View style={[styles.giBadge, { backgroundColor: getGIColor(mockFood.gi) }]}>
              <Text style={styles.giBadgeText}>
                GI: {mockFood.gi} ({getGILabel(mockFood.gi)})
              </Text>
            </View>
            {mockFood.glycemicLoad && (
              <Text style={styles.glText}>
                Glycemic Load: {calculateNutrition(mockFood.glycemicLoad)}
              </Text>
            )}
          </View>
        </View>

        {/* Serving Size Selection */}
        <View style={styles.servingSection}>
          <Text style={styles.sectionTitle}>Serving Size</Text>
          <View style={styles.servingOptions}>
            {servingOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.servingOption,
                  selectedServing?.id === option.id && styles.selectedServing,
                ]}
                onPress={() => setSelectedServing(option)}
              >
                <Text
                  style={[
                    styles.servingOptionText,
                    selectedServing?.id === option.id && styles.selectedServingText,
                  ]}
                >
                  {option.name}
                </Text>
                <Text
                  style={[
                    styles.servingGrams,
                    selectedServing?.id === option.id && styles.selectedServingText,
                  ]}
                >
                  ({option.grams}g)
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quantity Selection */}
        <View style={styles.quantitySection}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Ionicons name="remove" size={20} color={quantity <= 1 ? colors.subtext : colors.link} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Ionicons name="add" size={20} color={colors.link} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Nutrition Facts */}
        {macroData && (
          <View style={styles.nutritionSection}>
            <Text style={styles.sectionTitle}>Nutrition Facts</Text>
            <MacroSummary 
              macros={macroData}
              {...({ showPercentages: false } as any)}
            />
            
            {nutritionFacts && (
              <View style={styles.detailedNutrition}>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Fiber</Text>
                  <Text style={styles.nutritionValue}>{calculateNutrition(nutritionFacts.fiber)}g</Text>
                </View>
                {nutritionFacts.sugar !== undefined && (
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Sugar</Text>
                    <Text style={styles.nutritionValue}>{calculateNutrition(nutritionFacts.sugar)}g</Text>
                  </View>
                )}
                {nutritionFacts.sodium !== undefined && (
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Sodium</Text>
                    <Text style={styles.nutritionValue}>{calculateNutrition(nutritionFacts.sodium)}mg</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <PrimaryButton
            title={loading ? 'Adding to Diary...' : 'Add to Food Diary'}
            onPress={handleAddToLog}
            disabled={loading}
            loading={loading}
            style={styles.addButton}
          />
          
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={() => Alert.alert('Coming Soon', 'Share functionality will be available soon.')}
          >
            <Ionicons name="share-outline" size={20} color={colors.link} />
            <Text style={styles.shareButtonText}>Share Food</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: spacing(6),
  },
  imageContainer: {
    position: 'relative',
  },
  image: { 
    width: '100%', 
    height: 250, 
    backgroundColor: colors.border,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing(3),
    right: spacing(3),
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: spacing(2),
  },
  infoSection: {
    padding: spacing(4),
  },
  foodName: { 
    fontSize: fonts.title,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing(2),
  },
  description: { 
    fontSize: fonts.body,
    color: colors.subtext,
    lineHeight: 22,
    marginBottom: spacing(3),
  },
  giBadgeContainer: {
    alignItems: 'flex-start',
  },
  giBadge: {
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(1.5),
    borderRadius: radius.sm,
    marginBottom: spacing(1),
  },
  giBadgeText: {
    color: '#fff',
    fontSize: fonts.body,
    fontWeight: 'bold',
  },
  glText: {
    fontSize: fonts.caption,
    color: colors.subtext,
  },
  servingSection: {
    padding: spacing(4),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    fontSize: fonts.subtitle,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing(3),
  },
  servingOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(2),
  },
  servingOption: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    minWidth: 80,
    alignItems: 'center',
  },
  selectedServing: {
    backgroundColor: colors.link,
    borderColor: colors.link,
  },
  servingOptionText: {
    fontSize: fonts.body,
    color: colors.text,
    fontWeight: '600',
  },
  selectedServingText: {
    color: '#fff',
  },
  servingGrams: {
    fontSize: fonts.caption,
    color: colors.subtext,
    marginTop: spacing(0.5),
  },
  quantitySection: {
    padding: spacing(4),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: spacing(2),
  },
  quantityText: {
    fontSize: fonts.title,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: spacing(6),
    minWidth: 40,
    textAlign: 'center',
  },
  nutritionSection: {
    padding: spacing(4),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailedNutrition: {
    marginTop: spacing(3),
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing(3),
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing(1.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  nutritionLabel: {
    fontSize: fonts.body,
    color: colors.text,
  },
  nutritionValue: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.link,
  },
  actionSection: {
    padding: spacing(4),
    gap: spacing(3),
  },
  addButton: {
    backgroundColor: colors.accent,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.link,
    borderRadius: 8,
    paddingVertical: spacing(3),
    paddingHorizontal: spacing(4),
  },
  shareButtonText: {
    marginLeft: spacing(2),
    fontSize: fonts.body,
    color: colors.link,
    fontWeight: '600',
  },
});

export default FoodDetailsScreen;
