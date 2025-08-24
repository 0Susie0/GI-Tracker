// components/Food/FoodCard.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FoodCardProps } from '../../types/components';
import { colors, fonts, radius, spacing } from '../../utils/theme';

const FoodCard: React.FC<FoodCardProps> = ({ 
  food, 
  onPress, 
  onFavorite, 
  isFavorite = false, 
  showGI = true, 
  layout = 'card',
  style 
}) => {
  const handlePress = () => {
    onPress?.();
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    onFavorite?.();
  };

  const getGIColor = (gi?: number): string => {
    if (!gi) return colors.subtext;
    if (gi <= 55) return '#10B981'; // Green - Low GI
    if (gi <= 70) return '#F59E0B'; // Yellow - Medium GI
    return '#EF4444'; // Red - High GI
  };

  const getGILabel = (gi?: number): string => {
    if (!gi) return 'Unknown';
    if (gi <= 55) return 'Low';
    if (gi <= 70) return 'Medium';
    return 'High';
  };

  if (layout === 'list') {
    return (
      <TouchableOpacity 
        style={[styles.listCard, style]} 
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Image 
          source={food.image ? { uri: food.image } : require('../../assets/images/icon.png')} 
          style={styles.listImage} 
        />
        <View style={styles.listContent}>
          <Text style={styles.listName} numberOfLines={1}>{food.name}</Text>
          {food.brand && (
            <Text style={styles.listBrand} numberOfLines={1}>{food.brand}</Text>
          )}
          <View style={styles.listInfo}>
            <Text style={styles.listCalories}>{food.calories} kcal</Text>
            {showGI && food.glycemicIndex && (
              <View style={[styles.giIndicator, { backgroundColor: getGIColor(food.glycemicIndex) }]}>
                <Text style={styles.giText}>{getGILabel(food.glycemicIndex)}</Text>
              </View>
            )}
          </View>
        </View>
        {onFavorite && (
          <TouchableOpacity onPress={handleFavoritePress} style={styles.favoriteButton}>
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={20} 
              color={isFavorite ? '#EF4444' : colors.subtext} 
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  if (layout === 'compact') {
    return (
      <TouchableOpacity 
        style={[styles.compactCard, style]} 
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={styles.compactName} numberOfLines={1}>{food.name}</Text>
        <Text style={styles.compactCalories}>{food.calories} kcal</Text>
        {showGI && food.glycemicIndex && (
          <View style={[styles.compactGI, { backgroundColor: getGIColor(food.glycemicIndex) }]}>
            <Text style={styles.compactGIText}>{food.glycemicIndex}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  // Default card layout
  return (
    <TouchableOpacity 
      style={[styles.card, style]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={food.image ? { uri: food.image } : require('../../assets/images/icon.png')} 
          style={styles.image} 
        />
        {onFavorite && (
          <TouchableOpacity onPress={handleFavoritePress} style={styles.cardFavoriteButton}>
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={16} 
              color={isFavorite ? '#EF4444' : colors.card} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.name} numberOfLines={2}>{food.name}</Text>
        {food.brand && (
          <Text style={styles.brand} numberOfLines={1}>{food.brand}</Text>
        )}
        
        <View style={styles.infoRow}>
          <Text style={styles.calories}>{food.calories} kcal</Text>
          {showGI && food.glycemicIndex && (
            <View style={[styles.giIndicator, { backgroundColor: getGIColor(food.glycemicIndex) }]}>
              <Text style={styles.giText}>{getGILabel(food.glycemicIndex)}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    margin: spacing(2),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 140,
    maxWidth: 180,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 100,
    backgroundColor: colors.bg,
  },
  cardContent: {
    padding: spacing(3),
  },
  name: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing(1),
    textAlign: 'center',
    lineHeight: 20,
  },
  brand: {
    fontSize: fonts.caption,
    color: colors.subtext,
    marginBottom: spacing(2),
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calories: {
    fontSize: fonts.caption,
    color: colors.subtext,
  },
  giIndicator: {
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    borderRadius: radius.sm,
  },
  giText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardFavoriteButton: {
    position: 'absolute',
    top: spacing(2),
    right: spacing(2),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: spacing(1),
  },
  
  // List layout styles
  listCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    marginHorizontal: spacing(3),
    marginVertical: spacing(1),
    padding: spacing(3),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  listImage: {
    width: 60,
    height: 60,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    marginRight: spacing(3),
  },
  listContent: {
    flex: 1,
  },
  listName: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  listBrand: {
    fontSize: fonts.caption,
    color: colors.subtext,
    marginBottom: spacing(1),
  },
  listInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listCalories: {
    fontSize: fonts.caption,
    color: colors.subtext,
    marginRight: spacing(2),
  },
  favoriteButton: {
    padding: spacing(2),
    marginLeft: spacing(2),
  },
  
  // Compact layout styles
  compactCard: {
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    padding: spacing(2),
    margin: spacing(1),
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 100,
  },
  compactName: {
    fontSize: fonts.caption,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  compactCalories: {
    fontSize: 10,
    color: colors.subtext,
    marginBottom: spacing(0.5),
  },
  compactGI: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing(1),
    paddingVertical: 2,
    borderRadius: 4,
  },
  compactGIText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FoodCard;

