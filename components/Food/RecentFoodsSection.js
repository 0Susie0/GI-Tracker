// components/RecentFoodsSection.js
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../utils/theme';

export default function RecentFoodsSection({ foods, onViewAll, onFoodPress }) {
  const getGIBadgeColor = (giValue) => {
    if (giValue <= 55) return '#34D399'; // Low GI - Green
    if (giValue <= 70) return '#F59E0B'; // Medium GI - Yellow
    return '#EF4444'; // High GI - Red
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="trending-up" size={20} color={colors.text} style={styles.headerIcon} />
          <Text style={styles.headerText}>Recent Foods</Text>
        </View>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.foodsContainer}>
        {foods.map((food, index) => (
          <TouchableOpacity
            key={index}
            style={styles.foodItem}
            onPress={() => onFoodPress(food)}
          >
            <Image source={{ uri: food.image }} style={styles.foodImage} />
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{food.name}</Text>
              <View style={[styles.giBadge, { backgroundColor: getGIBadgeColor(food.gi) }]}>
                <Text style={styles.giText}>GI: {food.gi}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

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
  },
  headerIcon: {
    marginRight: spacing(2),
  },
  headerText: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: colors.text,
  },
  viewAllText: {
    fontSize: fonts.caption,
    color: colors.link,
    fontWeight: '500',
  },
  foodsContainer: {
    flexDirection: 'row',
    gap: spacing(3),
  },
  foodItem: {
    flex: 1,
    alignItems: 'center',
  },
  foodImage: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    marginBottom: spacing(2),
  },
  foodInfo: {
    alignItems: 'center',
  },
  foodName: {
    fontSize: fonts.caption,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(1),
  },
  giBadge: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(0.5),
    borderRadius: radius.sm,
  },
  giText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
});
