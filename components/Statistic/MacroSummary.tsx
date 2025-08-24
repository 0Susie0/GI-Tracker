// components/Statistic/MacroSummary.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MacroSummaryProps } from '../../types/components';
import { colors, fonts, radius, spacing } from '../../utils/theme';

interface MacroItemData {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  icon: string;
}

const MacroSummary: React.FC<MacroSummaryProps> = ({ 
  macros, 
  showPercentages = false,
  style 
}) => {
  // Handle both old array format and new object format
  const getMacroData = (): MacroItemData[] => {
    // New object format with current/target
    if (macros && typeof macros === 'object' && 'carbs' in macros) {
      return [
        {
          label: 'Carbs',
          current: macros.carbs.current,
          target: macros.carbs.target,
          unit: 'g',
          color: '#3B82F6',
          icon: 'nutrition',
        },
        {
          label: 'Protein',
          current: macros.protein.current,
          target: macros.protein.target,
          unit: 'g',
          color: '#EF4444',
          icon: 'fitness',
        },
        {
          label: 'Fat',
          current: macros.fat.current,
          target: macros.fat.target,
          unit: 'g',
          color: '#F59E0B',
          icon: 'water',
        },
        {
          label: 'Calories',
          current: macros.calories.current,
          target: macros.calories.target,
          unit: 'kcal',
          color: colors.accent,
          icon: 'flash',
        },
      ];
    }
    
    // Legacy array format
    if (Array.isArray(macros)) {
      return (macros as any[]).map((macro: any, index: number) => ({
        label: macro.label,
        current: macro.value,
        target: macro.value * 1.5, // Mock target
        unit: 'g',
        color: ['#3B82F6', '#EF4444', '#F59E0B', colors.accent][index] || colors.link,
        icon: ['nutrition', 'fitness', 'water', 'flash'][index] || 'analytics',
      }));
    }

    return [];
  };

  const macroData = getMacroData();

  const calculatePercentage = (current: number, target: number): number => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const renderProgressBar = (current: number, target: number, color: string) => {
    const percentage = calculatePercentage(current, target);
    
    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill,
              { 
                width: `${percentage}%`,
                backgroundColor: color,
              }
            ]}
          />
        </View>
        <Text style={styles.progressPercentage}>{percentage}%</Text>
      </View>
    );
  };

  const renderMacroItem = (macro: MacroItemData) => (
    <View key={macro.label} style={styles.macroItem}>
      <View style={styles.macroHeader}>
        <View style={styles.macroLabelContainer}>
          <View style={[styles.iconContainer, { backgroundColor: macro.color }]}>
            <Ionicons name={macro.icon as any} size={16} color="#fff" />
          </View>
          <Text style={styles.macroLabel}>{macro.label}</Text>
        </View>
        
        <View style={styles.valueContainer}>
          <Text style={styles.currentValue}>
            {macro.current}
          </Text>
          <Text style={styles.unit}>{macro.unit}</Text>
        </View>
      </View>
      
      {showPercentages && (
        <>
          {renderProgressBar(macro.current, macro.target, macro.color)}
          <View style={styles.targetContainer}>
            <Text style={styles.targetText}>
              Target: {macro.target}{macro.unit}
            </Text>
            <Text style={styles.remainingText}>
              {macro.target - macro.current > 0 
                ? `${macro.target - macro.current}${macro.unit} remaining`
                : 'Target reached!'
              }
            </Text>
          </View>
        </>
      )}
    </View>
  );

  if (macroData.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.noDataText}>No nutrition data available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {showPercentages ? (
        <View style={styles.detailedContainer}>
          <Text style={styles.sectionTitle}>Nutrition Breakdown</Text>
          {macroData.map(renderMacroItem)}
        </View>
      ) : (
        <View style={styles.simpleContainer}>
          {macroData.map((macro) => (
            <View key={macro.label} style={styles.simpleItem}>
              <View style={[styles.colorDot, { backgroundColor: macro.color }]} />
              <Text style={styles.simpleValue}>{macro.current}{macro.unit}</Text>
              <Text style={styles.simpleLabel}>{macro.label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: fonts.subtitle,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing(3),
    textAlign: 'center',
  },
  detailedContainer: {
    padding: spacing(4),
  },
  simpleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing(4),
  },
  macroItem: {
    marginBottom: spacing(4),
    paddingBottom: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  macroLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing(2),
  },
  macroLabel: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.text,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentValue: {
    fontSize: fonts.title,
    fontWeight: 'bold',
    color: colors.text,
  },
  unit: {
    fontSize: fonts.caption,
    color: colors.subtext,
    marginLeft: spacing(0.5),
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginRight: spacing(2),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: fonts.caption,
    fontWeight: 'bold',
    color: colors.text,
    minWidth: 35,
    textAlign: 'right',
  },
  targetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  targetText: {
    fontSize: fonts.caption,
    color: colors.subtext,
  },
  remainingText: {
    fontSize: fonts.caption,
    color: colors.link,
    fontWeight: '600',
  },
  simpleItem: {
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: spacing(1),
  },
  simpleValue: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  simpleLabel: {
    fontSize: fonts.caption,
    color: colors.subtext,
  },
  noDataText: {
    fontSize: fonts.body,
    color: colors.subtext,
    textAlign: 'center',
    padding: spacing(4),
  },
});

export default MacroSummary;
