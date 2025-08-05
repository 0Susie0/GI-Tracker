import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Switch, Text, ToastAndroid, View } from 'react-native';
import Header from '../../components/Header';

const PREFERENCES = [
  { key: 'lowGI', label: 'Low GI' },
  { key: 'vegetarian', label: 'Vegetarian' },
  { key: 'glutenFree', label: 'Gluten-free' },
];

export default function PreferencesScreen() {
  const [prefs, setPrefs] = useState({ lowGI: false, vegetarian: false, glutenFree: false });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      setLoading(true);
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('User not logged in');
        const db = getFirestore();
        const docRef = doc(db, `users/${user.uid}/preferences`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPrefs({ ...prefs, ...docSnap.data() });
        }
      } catch (e) {
        Alert.alert('Error', e.message || 'Failed to load preferences.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg);
    }
  };

  const handleToggle = async (key) => {
    if (loading || updating) return;
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    setUpdating(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('User not logged in');
      const db = getFirestore();
      const docRef = doc(db, `users/${user.uid}/preferences`);
      await setDoc(docRef, newPrefs, { merge: true });
      showToast('Preferences updated');
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to update preferences.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Preferences" icon="settings" />
      {PREFERENCES.map((pref) => (
        <View key={pref.key} style={styles.row}>
          <Text style={styles.label}>{pref.label}</Text>
          <Switch
            value={prefs[pref.key]}
            onValueChange={() => handleToggle(pref.key)}
            disabled={loading || updating}
          />
        </View>
      ))}
      {(loading || updating) && <Text style={styles.status}>Loading...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  label: {
    fontSize: 18,
  },
  status: {
    marginTop: 24,
    textAlign: 'center',
    color: '#888',
  },
});