// components/Statistic/ProgressChart.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ProgressChartProps } from '../../types/components';
import { colors, fonts, radius, spacing } from '../../utils/theme';

interface ChartPoint {
  x: number;
  y: number;
  value: number;
  label?: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ 
  percent,
  data,
  type = 'line',
  height = 200,
  showGrid = false,
  showLabels = true,
  style 
}) => {
  const [animatedValue] = useState(new Animated.Value(0));
  const [selectedPoint, setSelectedPoint] = useState<ChartPoint | null>(null);
  
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - spacing(8); // Account for container padding
  const chartHeight = height - 60; // Account for labels
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  // Simple progress circle component
  const renderProgressCircle = () => {
    const size = 120;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (circumference * (percent || 0)) / 100;

    return (
      <View style={styles.progressContainer}>
        <View style={[styles.circleContainer, { width: size, height: size }]}>
          <Animated.View
            style={{
              transform: [{
                rotate: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              }],
            }}
          >
            <Ionicons name="stats-chart" size={48} color={colors.accent} />
          </Animated.View>
        </View>
        <Text style={styles.percentText}>{percent}%</Text>
        <Text style={styles.progressLabel}>Weekly Progress</Text>
      </View>
    );
  };

  // Chart with data points
  const renderDataChart = () => {
    if (!data || data.length === 0) {
      return (
        <View style={[styles.chartContainer, { height }]}>
          <View style={styles.noDataContainer}>
            <Ionicons name="analytics-outline" size={48} color={colors.subtext} />
            <Text style={styles.noDataText}>No data available</Text>
          </View>
        </View>
      );
    }

    // Prepare chart data
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;
    
    const chartPoints: ChartPoint[] = data.map((point, index) => ({
      x: (index / (data.length - 1)) * chartWidth,
      y: chartHeight - ((point.value - minValue) / valueRange) * chartHeight,
      value: point.value,
      label: point.label || point.date,
    }));

    const renderGridLines = () => {
      if (!showGrid) return null;
      
      const gridLines = [];
      const gridCount = 5;
      
      // Horizontal lines
      for (let i = 0; i <= gridCount; i++) {
        const y = (i / gridCount) * chartHeight;
        gridLines.push(
          <View
            key={`h-${i}`}
            style={[
              styles.gridLine,
              {
                top: y,
                left: 0,
                right: 0,
                height: 1,
              }
            ]}
          />
        );
      }
      
      // Vertical lines
      for (let i = 0; i <= gridCount; i++) {
        const x = (i / gridCount) * chartWidth;
        gridLines.push(
          <View
            key={`v-${i}`}
            style={[
              styles.gridLine,
              {
                left: x,
                top: 0,
                bottom: 0,
                width: 1,
              }
            ]}
          />
        );
      }
      
      return gridLines;
    };

    const renderLineChart = () => {
      return (
        <>
          {/* Grid */}
          {renderGridLines()}
          
          {/* Data points */}
          {chartPoints.map((point, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dataPoint,
                {
                  left: point.x - 6,
                  top: point.y - 6,
                  backgroundColor: selectedPoint === point ? colors.accent : colors.link,
                }
              ]}
              onPress={() => setSelectedPoint(selectedPoint === point ? null : point)}
            />
          ))}
          
          {/* Value labels */}
          {showLabels && chartPoints.map((point, index) => (
            <View
              key={`label-${index}`}
              style={[
                styles.valueLabel,
                {
                  left: point.x - 20,
                  top: point.y - 30,
                }
              ]}
            >
              <Text style={styles.valueLabelText}>{point.value}</Text>
            </View>
          ))}
        </>
      );
    };

    const renderBarChart = () => {
      const barWidth = chartWidth / data.length * 0.6;
      
      return (
        <>
          {/* Grid */}
          {renderGridLines()}
          
          {/* Bars */}
          {chartPoints.map((point, index) => {
            const barHeight = ((point.value - minValue) / valueRange) * chartHeight;
            const barX = point.x - barWidth / 2;
            const barY = chartHeight - barHeight;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.barItem,
                  {
                    left: barX,
                    top: barY,
                    width: barWidth,
                    height: barHeight,
                    backgroundColor: selectedPoint === point ? colors.accent : colors.link,
                  }
                ]}
                onPress={() => setSelectedPoint(selectedPoint === point ? null : point)}
              />
            );
          })}
          
          {/* Value labels */}
          {showLabels && chartPoints.map((point, index) => (
            <View
              key={`label-${index}`}
              style={[
                styles.valueLabel,
                {
                  left: point.x - 20,
                  top: point.y - 30,
                }
              ]}
            >
              <Text style={styles.valueLabelText}>{point.value}</Text>
            </View>
          ))}
        </>
      );
    };

    return (
      <View style={[styles.chartContainer, { height }]}>
        <View style={styles.chartArea}>
          <View style={[styles.chart, { width: chartWidth, height: chartHeight }]}>
            {type === 'bar' ? renderBarChart() : renderLineChart()}
          </View>
        </View>
        
        {/* X-axis labels */}
        {showLabels && (
          <View style={styles.xAxisLabels}>
            {data.map((point, index) => (
              <Text key={index} style={styles.xAxisLabel}>
                {point.date}
              </Text>
            ))}
          </View>
        )}
        
        {/* Selected point tooltip */}
        {selectedPoint && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>
              {selectedPoint.label || `Value: ${selectedPoint.value}`}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {data && data.length > 0 ? renderDataChart() : renderProgressCircle()}
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
  progressContainer: {
    alignItems: 'center',
    padding: spacing(4),
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  percentText: {
    fontSize: fonts.title,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: spacing(1),
  },
  progressLabel: {
    fontSize: fonts.caption,
    color: colors.subtext,
  },
  chartContainer: {
    padding: spacing(3),
  },
  chartArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: colors.border,
    opacity: 0.3,
  },
  dataPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  barItem: {
    position: 'absolute',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  valueLabel: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    borderRadius: 4,
    width: 40,
    alignItems: 'center',
  },
  valueLabelText: {
    color: '#fff',
    fontSize: fonts.caption,
    fontWeight: 'bold',
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing(2),
    paddingHorizontal: spacing(2),
  },
  xAxisLabel: {
    fontSize: fonts.caption,
    color: colors.subtext,
    textAlign: 'center',
    flex: 1,
  },
  tooltip: {
    position: 'absolute',
    top: spacing(2),
    right: spacing(2),
    backgroundColor: colors.text,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    borderRadius: 6,
  },
  tooltipText: {
    color: '#fff',
    fontSize: fonts.caption,
    fontWeight: 'bold',
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noDataText: {
    marginTop: spacing(2),
    fontSize: fonts.body,
    color: colors.subtext,
  },
});

export default ProgressChart;
