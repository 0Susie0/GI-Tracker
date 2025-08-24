// components/Food/RecentFoodsSection.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FoodItem } from '../../types/app';
import { RecentFoodsSectionProps } from '../../types/components';
import { colors, fonts, radius, spacing } from '../../utils/theme';

const RecentFoodsSection: React.FC<RecentFoodsSectionProps> = ({ 
  foods, 
  onViewAll, 
  onFoodPress,
  title = "Recent Foods",
  icon = "trending-up",
  style 
}) => {
  const getGIBadgeColor = (giValue: number): string => {
    if (giValue <= 55) return '#34D399'; // Low GI - Green
    if (giValue <= 70) return '#F59E0B'; // Medium GI - Yellow
    return '#EF4444'; // High GI - Red
  };

  const getGICategory = (giValue: number): string => {
    if (giValue <= 55) return 'Low';
    if (giValue <= 70) return 'Med';
    return 'High';
  };

  const renderFoodItem = (food: FoodItem, index: number) => (
    <TouchableOpacity
      key={food.id || index}
      style={styles.foodItem}
      onPress={() => onFoodPress(food)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: food.image }} 
          style={styles.foodImage}
          defaultSource={require('../../assets/images/icon.png')}
        />
        <View style={[styles.giBadge, { backgroundColor: getGIBadgeColor(food.gi) }]}>
          <Text style={styles.giText}>{getGICategory(food.gi)}</Text>
        </View>
      </View>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName} numberOfLines={2}>
          {food.name}
        </Text>
        <Text style={styles.giValue}>
          GI: {food.gi}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="restaurant-outline" size={32} color={colors.subtext} />
      <Text style={styles.emptyText}>No recent foods yet</Text>
      <Text style={styles.emptySubtext}>
        Start tracking foods to see them here
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name={icon as any} size={20} color={colors.text} style={styles.headerIcon} />
          <Text style={styles.headerText}>{title}</Text>
          {foods.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{foods.length}</Text>
            </View>
          )}
        </View>
        {foods.length > 0 && onViewAll && (
          <TouchableOpacity 
            onPress={onViewAll}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {foods.length > 0 ? (
        <View style={styles.foodsContainer}>
          {foods.slice(0, 3).map(renderFoodItem)}
        </View>
      ) : (
        renderEmptyState()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing(3),
    marginVertical: spacing(2),
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing(4),
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(3),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    marginRight: spacing(2),
  },
  headerText: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: colors.text,
  },
  countBadge: {
    backgroundColor: colors.link,
    borderRadius: radius.sm,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    marginLeft: spacing(2),
  },
  countText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewAllText: {
    fontSize: fonts.caption,
    color: colors.link,
    fontWeight: '600',
  },
  foodsContainer: {
    flexDirection: 'row',
    gap: spacing(3),
  },
  foodItem: {
    flex: 1,
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: spacing(2),
  },
  foodImage: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
  },
  giBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    borderRadius: radius.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  giText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#fff',
  },
  foodInfo: {
    alignItems: 'center',
    width: '100%',
  },
  foodName: {
    fontSize: fonts.caption,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(0.5),
    lineHeight: 16,
  },
  giValue: {
    fontSize: 10,
    color: colors.subtext,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing(6),
  },
  emptyText: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.subtext,
    marginTop: spacing(3),
  },
  emptySubtext: {
    fontSize: fonts.caption,
    color: colors.subtext,
    marginTop: spacing(1),
    textAlign: 'center',
  },
});

export default RecentFoodsSection;
