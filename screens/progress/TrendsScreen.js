import { getAuth } from 'firebase/auth';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProgressChart from '../../components/Statistic/ProgressChart';

function formatDate(date, mode) {
  const d = new Date(date);
  if (mode === 'week') {
    // Format as 'YYYY-MM-DD'
    return d.toISOString().slice(0, 10);
  } else {
    // Format as 'YYYY-[W]WW' (ISO week)
    const onejan = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${week}`;
  }
}

function aggregateReadings(readings, mode) {
  const grouped = {};
  readings.forEach(r => {
    const key = formatDate(r.datetime, mode);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(r.value);
  });
  // Average per group
  return Object.entries(grouped).map(([date, values]) => ({
    date,
    value: values.reduce((a, b) => a + b, 0) / values.length,
  })).sort((a, b) => new Date(a.date) - new Date(b.date));
}

export default function TrendsScreen() {
  const [mode, setMode] = useState('week');
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('User not logged in');
        const db = getFirestore();
        const snapshot = await getDocs(collection(db, `users/${user.uid}/glucoseReadings`));
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setReadings(data.map(r => ({
          value: Number(r.value),
          datetime: r.datetime,
        })));
      } catch (e) {
        setError(e.message || 'Failed to fetch readings.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const aggregated = aggregateReadings(readings, mode);
  const chartData = {
    labels: aggregated.map(d => d.date),
    datasets: [{
      data: aggregated.map(d => d.value),
    }],
    tooltips: aggregated.map(d => `${d.date}: ${d.value.toFixed(1)}`),
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, mode === 'week' && styles.activeBtn]}
          onPress={() => setMode('week')}
        >
          <Text style={mode === 'week' ? styles.activeText : styles.toggleText}>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, mode === 'month' && styles.activeBtn]}
          onPress={() => setMode('month')}
        >
          <Text style={mode === 'month' ? styles.activeText : styles.toggleText}>Month</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} size="large" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <ProgressChart data={chartData} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginHorizontal: 8,
  },
  activeBtn: {
    backgroundColor: '#4CAF50',
  },
  toggleText: {
    color: '#333',
    fontWeight: 'bold',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 32,
  },
});