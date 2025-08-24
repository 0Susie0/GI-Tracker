// screens/progress/TrendsScreen.tsx
import { getAuth } from 'firebase/auth';
import { collection, getDocs, getFirestore, limit, orderBy, query } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Header } from '../../components';
import ProgressChart from '../../components/Statistic/ProgressChart';
import { GlucoseReading } from '../../types/app';
import { ProgressScreenProps } from '../../types/navigation';
import { colors, fonts, spacing } from '../../utils/theme';

type TrendsScreenProps = ProgressScreenProps<'Trends'>;

type TimeMode = 'week' | 'month' | 'quarter';

interface AggregatedData {
  date: string;
  value: number;
  count: number;
  label?: string;
}

interface TrendAnalysis {
  average: number;
  trend: 'improving' | 'stable' | 'declining';
  changePercent: number;
  timeInRange: number; // Percentage of readings in target range (70-180 mg/dL)
}

const TrendsScreen: React.FC<TrendsScreenProps> = ({ navigation }) => {
  const [mode, setMode] = useState<TimeMode>('week');
  const [readings, setReadings] = useState<GlucoseReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);

  const formatDate = useCallback((date: Date, mode: TimeMode): string => {
    const d = new Date(date);
    switch (mode) {
      case 'week':
        return d.toISOString().slice(0, 10); // YYYY-MM-DD
      case 'month':
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
      case 'quarter':
        const quarter = Math.floor(d.getMonth() / 3) + 1;
        return `${d.getFullYear()}-Q${quarter}`;
      default:
        return d.toISOString().slice(0, 10);
    }
  }, []);

  const aggregateReadings = useCallback((readings: GlucoseReading[], mode: TimeMode): AggregatedData[] => {
    const grouped: Record<string, number[]> = {};
    
    readings.forEach(reading => {
      const key = formatDate(reading.timestamp, mode);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(reading.value);
    });

    const aggregated = Object.entries(grouped).map(([date, values]) => ({
      date,
      value: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      count: values.length,
      label: formatDisplayDate(date, mode),
    }));

    return aggregated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [formatDate]);

  const formatDisplayDate = (date: string, mode: TimeMode): string => {
    switch (mode) {
      case 'week':
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'month':
        return new Date(date + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      case 'quarter':
        return date; // Already in Q format
      default:
        return date;
    }
  };

  const calculateAnalysis = useCallback((readings: GlucoseReading[]): TrendAnalysis => {
    if (readings.length === 0) {
      return {
        average: 0,
        trend: 'stable',
        changePercent: 0,
        timeInRange: 0,
      };
    }

    const values = readings.map(r => r.value);
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    
    // Calculate time in range (70-180 mg/dL is typical target)
    const inRange = values.filter(v => v >= 70 && v <= 180).length;
    const timeInRange = (inRange / values.length) * 100;

    // Calculate trend based on first half vs second half
    const midPoint = Math.floor(readings.length / 2);
    if (readings.length < 4) {
      return {
        average: Math.round(average),
        trend: 'stable',
        changePercent: 0,
        timeInRange: Math.round(timeInRange),
      };
    }

    const firstHalfAvg = readings.slice(0, midPoint)
      .reduce((sum, r) => sum + r.value, 0) / midPoint;
    const secondHalfAvg = readings.slice(midPoint)
      .reduce((sum, r) => sum + r.value, 0) / (readings.length - midPoint);
    
    const changePercent = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
    
    let trend: 'improving' | 'stable' | 'declining';
    if (Math.abs(changePercent) < 5) {
      trend = 'stable';
    } else if (changePercent < 0) {
      trend = 'improving'; // Lower glucose is better
    } else {
      trend = 'declining';
    }

    return {
      average: Math.round(average),
      trend,
      changePercent: Math.round(Math.abs(changePercent)),
      timeInRange: Math.round(timeInRange),
    };
  }, []);

  const loadReadings = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError('');
    
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not logged in');
      }

      const db = getFirestore();
      const readingsRef = collection(db, `users/${user.uid}/glucoseReadings`);
      const q = query(readingsRef, orderBy('timestamp', 'desc'), limit(100));
      const snapshot = await getDocs(q);
      
      const data = snapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          value: Number(docData.value),
          timestamp: new Date(docData.timestamp || docData.datetime),
          userId: user.uid,
          notes: docData.notes,
          mealContext: docData.mealContext,
        } as GlucoseReading;
      });

      setReadings(data.reverse()); // Reverse to get chronological order
      setAnalysis(calculateAnalysis(data));
    } catch (error: any) {
      console.error('Error loading readings:', error);
      setError(error.message || 'Failed to fetch readings.');
    } finally {
      setLoading(false);
    }
  }, [calculateAnalysis]);

  useEffect(() => {
    loadReadings();
  }, [loadReadings]);

  const handleModeChange = (newMode: TimeMode): void => {
    setMode(newMode);
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

  const aggregatedData = aggregateReadings(readings, mode);
  const chartData = aggregatedData.map(d => ({
    date: d.label || d.date,
    value: d.value,
    label: `${d.label}: ${d.value} mg/dL (${d.count} readings)`,
  }));

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Glucose Trends" icon="analytics" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.link} />
          <Text style={styles.loadingText}>Loading your trends...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header title="Glucose Trends" icon="analytics" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadReadings} style={styles.retryButton}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Glucose Trends" icon="analytics" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {analysis && (
          <View style={styles.analysisCard}>
            <Text style={styles.cardTitle}>Analysis</Text>
            <View style={styles.analysisRow}>
              <View style={styles.analysisItem}>
                <Text style={styles.analysisValue}>{analysis.average}</Text>
                <Text style={styles.analysisLabel}>Avg mg/dL</Text>
              </View>
              <View style={styles.analysisItem}>
                <Text style={[styles.analysisValue, { color: getTrendColor(analysis.trend) }]}>
                  {getTrendIcon(analysis.trend)} {analysis.changePercent}%
                </Text>
                <Text style={styles.analysisLabel}>{analysis.trend}</Text>
              </View>
              <View style={styles.analysisItem}>
                <Text style={styles.analysisValue}>{analysis.timeInRange}%</Text>
                <Text style={styles.analysisLabel}>In Range</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.cardTitle}>Glucose Trends</Text>
            <View style={styles.toggleContainer}>
              {(['week', 'month', 'quarter'] as const).map((timeMode) => (
                <TouchableOpacity
                  key={timeMode}
                  style={[styles.toggleBtn, mode === timeMode && styles.activeBtn]}
                  onPress={() => handleModeChange(timeMode)}
                >
                  <Text style={mode === timeMode ? styles.activeText : styles.toggleText}>
                    {timeMode.charAt(0).toUpperCase() + timeMode.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {chartData.length > 0 ? (
            <ProgressChart 
              {...({
                data: chartData,
                type: "line",
                height: 250,
                showGrid: true,
                showLabels: true,
              } as any)}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No glucose readings found</Text>
              <Text style={styles.noDataSubtext}>
                Start logging your glucose readings to see trends
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('GlucoseLog')}
                style={styles.logButton}
              >
                <Text style={styles.logButtonText}>Log Reading</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {readings.length > 0 && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Target Ranges</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Normal (Fasting):</Text>
              <Text style={styles.infoValue}>70-100 mg/dL</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Normal (Post-meal):</Text>
              <Text style={styles.infoValue}>70-180 mg/dL</Text>
            </View>
            <Text style={styles.disclaimerText}>
              * Consult your healthcare provider for personalized target ranges
            </Text>
          </View>
        )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing(4),
  },
  errorText: {
    color: '#EF4444',
    fontSize: fonts.body,
    textAlign: 'center',
    marginBottom: spacing(4),
  },
  retryButton: {
    backgroundColor: colors.link,
    paddingHorizontal: spacing(6),
    paddingVertical: spacing(3),
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: fonts.body,
    fontWeight: 'bold',
  },
  analysisCard: {
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
  analysisRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  analysisItem: {
    alignItems: 'center',
  },
  analysisValue: {
    fontSize: fonts.title,
    fontWeight: 'bold',
    color: colors.link,
    marginBottom: spacing(1),
  },
  analysisLabel: {
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
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(3),
  },
  cardTitle: {
    fontSize: fonts.subtitle,
    fontWeight: 'bold',
    color: colors.text,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.bg,
    borderRadius: 8,
    padding: 2,
  },
  toggleBtn: {
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(3),
    borderRadius: 6,
    minWidth: 60,
  },
  activeBtn: {
    backgroundColor: colors.link,
  },
  toggleText: {
    color: colors.text,
    fontSize: fonts.caption,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeText: {
    color: '#fff',
    fontSize: fonts.caption,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: spacing(8),
  },
  noDataText: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(2),
  },
  noDataSubtext: {
    fontSize: fonts.caption,
    color: colors.subtext,
    textAlign: 'center',
    marginBottom: spacing(4),
  },
  logButton: {
    backgroundColor: colors.link,
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(2),
    borderRadius: 8,
  },
  logButtonText: {
    color: '#fff',
    fontSize: fonts.body,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing(2),
  },
  infoLabel: {
    fontSize: fonts.body,
    color: colors.text,
  },
  infoValue: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.link,
  },
  disclaimerText: {
    fontSize: fonts.caption,
    color: colors.subtext,
    fontStyle: 'italic',
    marginTop: spacing(2),
  },
});

export default TrendsScreen;
