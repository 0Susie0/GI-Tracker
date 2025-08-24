// screens/progress/ProgressViewScreen.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header } from '../../components';
import MacroSummary from '../../components/Statistic/MacroSummary';
import ProgressChart from '../../components/Statistic/ProgressChart';
import { ProgressScreenProps } from '../../types/navigation';
import { colors, fonts, spacing } from '../../utils/theme';

type ProgressViewScreenProps = ProgressScreenProps<'ProgressView'>;

interface MacroData {
  label: string;
  value: number;
  target: number;
  unit: string;
}

interface ProgressSummary {
  weeklyAverage: number;
  monthlyAverage: number;
  trend: 'improving' | 'stable' | 'declining';
  streakDays: number;
  totalReadings: number;
}

const ProgressViewScreen: React.FC<ProgressViewScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<ProgressSummary | null>(null);
  const [macroData, setMacroData] = useState<MacroData[]>([]);

  // Mock data - replace with real data fetching
  const mockMacros: MacroData[] = [
    { label: 'Protein', value: 80, target: 100, unit: 'g' },
    { label: 'Carbs', value: 150, target: 200, unit: 'g' },
    { label: 'Fat', value: 50, target: 70, unit: 'g' },
    { label: 'Calories', value: 1800, target: 2000, unit: 'kcal' },
  ];

  const mockProgress: ProgressSummary = {
    weeklyAverage: 125,
    monthlyAverage: 128,
    trend: 'improving',
    streakDays: 12,
    totalReadings: 156,
  };

  useEffect(() => {
    const loadProgressData = async (): Promise<void> => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setProgressData(mockProgress);
        setMacroData(mockMacros);
      } catch (error) {
        console.error('Error loading progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, []);

  const calculateOverallProgress = (): number => {
    if (!macroData.length) return 0;
    
    const totalProgress = macroData.reduce((sum, macro) => {
      const progress = Math.min((macro.value / macro.target) * 100, 100);
      return sum + progress;
    }, 0);
    
    return Math.round(totalProgress / macroData.length);
  };

  const getTrendColor = (trend: string): string => {
    switch (trend) {
      case 'improving': return colors.accent;
      case 'declining': return '#EF4444';
      default: return colors.link;
    }
  };

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Progress Overview" icon="trending-up" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.link} />
          <Text style={styles.loadingText}>Loading your progress...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Progress Overview" icon="trending-up" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {progressData && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Weekly Summary</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{progressData.weeklyAverage}</Text>
                <Text style={styles.summaryLabel}>Avg Glucose</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: getTrendColor(progressData.trend) }]}>
                  {getTrendIcon(progressData.trend)} {progressData.trend}
                </Text>
                <Text style={styles.summaryLabel}>Trend</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{progressData.streakDays}</Text>
                <Text style={styles.summaryLabel}>Day Streak</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Overall Progress</Text>
          <ProgressChart 
            {...({
              data: [
                { date: 'Week 1', value: 68 },
                { date: 'Week 2', value: 72 },
                { date: 'Week 3', value: 65 },
                { date: 'Week 4', value: 70 },
              ],
              type: "line",
              height: 200,
              showGrid: true,
              showLabels: true,
            } as any)}
          />
        </View>

        <View style={styles.macroCard}>
          <Text style={styles.cardTitle}>Daily Nutrition</Text>
          <MacroSummary 
            macros={{
              carbs: { current: macroData[1]?.value || 0, target: macroData[1]?.target || 200 },
              protein: { current: macroData[0]?.value || 0, target: macroData[0]?.target || 100 },
              fat: { current: macroData[2]?.value || 0, target: macroData[2]?.target || 70 },
              calories: { current: macroData[3]?.value || 0, target: macroData[3]?.target || 2000 },
            }}
            {...({ showPercentages: true } as any)}
          />
        </View>

        <View style={styles.insightsCard}>
          <Text style={styles.cardTitle}>Insights</Text>
          <View style={styles.insightItem}>
            <Text style={styles.insightText}>
              📊 Your glucose levels have been {progressData?.trend === 'improving' ? 'improving' : 'stable'} over the past week
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightText}>
              🎯 You're {calculateOverallProgress()}% towards your daily nutrition goals
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightText}>
              🔥 Keep up your {progressData?.streakDays || 0}-day tracking streak!
            </Text>
          </View>
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
    padding: spacing(4),
    paddingBottom: spacing(6),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing(3),
    fontSize: fonts.body,
    color: colors.subtext,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing(4),
    marginBottom: spacing(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: fonts.subtitle,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing(3),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: fonts.title,
    fontWeight: 'bold',
    color: colors.link,
    marginBottom: spacing(1),
  },
  summaryLabel: {
    fontSize: fonts.caption,
    color: colors.subtext,
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing(4),
    marginBottom: spacing(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  macroCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing(4),
    marginBottom: spacing(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: fonts.subtitle,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing(3),
  },
  insightItem: {
    marginBottom: spacing(2),
  },
  insightText: {
    fontSize: fonts.body,
    color: colors.subtext,
    lineHeight: 22,
  },
});

export default ProgressViewScreen;
