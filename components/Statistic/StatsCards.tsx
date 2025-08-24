// components/Statistic/StatsCards.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatCard } from '../../types/app';
import { StatsCardsProps } from '../../types/components';
import { colors, fonts, radius, spacing } from '../../utils/theme';

const StatsCards: React.FC<StatsCardsProps> = ({ 
  stats, 
  onCardPress,
  animated = false,
  style 
}) => {
  const renderCard = (stat: StatCard, index: number) => {
    const CardComponent = onCardPress ? TouchableOpacity : View;
    
    return (
      <CardComponent
        key={stat.id || index}
        style={[
          styles.card,
          animated && styles.animatedCard,
          { borderColor: stat.color || colors.border }
        ]}
        onPress={onCardPress ? () => onCardPress(stat) : undefined}
        activeOpacity={onCardPress ? 0.7 : 1}
      >
        {stat.icon && (
          <View style={[styles.iconContainer, { backgroundColor: stat.color || colors.link }]}>
            <Ionicons 
              name={stat.icon as any} 
              size={16} 
              color="#fff" 
            />
          </View>
        )}
        
        <Text style={[styles.value, { color: stat.color || colors.link }]}>
          {stat.value}
        </Text>
        
        <Text style={styles.label} numberOfLines={2}>
          {stat.label}
        </Text>
        
        {stat.trend && (
          <View style={styles.trendContainer}>
            <Ionicons 
              name={stat.trend === 'up' ? 'trending-up' : 'trending-down'} 
              size={12} 
              color={stat.trend === 'up' ? colors.accent : '#EF4444'} 
            />
            {stat.trendValue && (
              <Text style={[
                styles.trendText,
                { color: stat.trend === 'up' ? colors.accent : '#EF4444' }
              ]}>
                {stat.trendValue}
              </Text>
            )}
          </View>
        )}
        
        {stat.subtitle && (
          <Text style={styles.subtitle}>
            {stat.subtitle}
          </Text>
        )}
      </CardComponent>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {stats.map(renderCard)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing(3),
    marginVertical: spacing(2),
    gap: spacing(2),
  },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing(4),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 100,
    justifyContent: 'center',
  },
  animatedCard: {
    // Add animation styles if needed
    transform: [{ scale: 1 }],
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  value: {
    fontSize: fonts.title,
    fontWeight: 'bold',
    marginBottom: spacing(1),
    textAlign: 'center',
  },
  label: {
    fontSize: fonts.caption,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 16,
  },
  subtitle: {
    fontSize: 10,
    color: colors.subtext,
    textAlign: 'center',
    marginTop: spacing(0.5),
    fontWeight: '500',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing(1),
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: spacing(0.5),
  },
});

export default StatsCards;
