// screens/profile/PreferencesScreen.tsx
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, ToastAndroid, View } from 'react-native';

import { Header } from '../../components';
import { ProfileScreenProps } from '../../types/navigation';
import { colors, fonts, spacing } from '../../utils/theme';

type PreferencesScreenProps = ProfileScreenProps<'Preferences'>;

interface DietaryPreference {
  key: keyof DietaryPreferences;
  label: string;
  description: string;
}

interface DietaryPreferences {
  lowGI: boolean;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  nutFree: boolean;
  lowCarb: boolean;
  keto: boolean;
}

interface NotificationSettings {
  glucose: boolean;
  meals: boolean;
  reminders: boolean;
  dailyReports: boolean;
  weeklyReports: boolean;
}

interface AppPreferences extends DietaryPreferences {
  notifications: NotificationSettings;
  units: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'auto';
  glucoseTargets: {
    min: number;
    max: number;
  };
}

const DIETARY_PREFERENCES: DietaryPreference[] = [
  { key: 'lowGI', label: 'Low Glycemic Index', description: 'Prefer foods with GI ≤ 55' },
  { key: 'vegetarian', label: 'Vegetarian', description: 'No meat or fish' },
  { key: 'vegan', label: 'Vegan', description: 'No animal products' },
  { key: 'glutenFree', label: 'Gluten-Free', description: 'No wheat, barley, or rye' },
  { key: 'dairyFree', label: 'Dairy-Free', description: 'No milk or dairy products' },
  { key: 'nutFree', label: 'Nut-Free', description: 'No tree nuts or peanuts' },
  { key: 'lowCarb', label: 'Low Carb', description: 'Reduced carbohydrate intake' },
  { key: 'keto', label: 'Ketogenic', description: 'Very low carb, high fat' },
];

const NOTIFICATION_OPTIONS = [
  { key: 'glucose', label: 'Glucose Reminders', description: 'Remind me to log glucose readings' },
  { key: 'meals', label: 'Meal Tracking', description: 'Remind me to log meals' },
  { key: 'reminders', label: 'General Reminders', description: 'App tips and suggestions' },
  { key: 'dailyReports', label: 'Daily Reports', description: 'Daily summary notifications' },
  { key: 'weeklyReports', label: 'Weekly Reports', description: 'Weekly progress updates' },
];

const PreferencesScreen: React.FC<PreferencesScreenProps> = ({ navigation }) => {
  const [preferences, setPreferences] = useState<AppPreferences>({
    lowGI: false,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false,
    lowCarb: false,
    keto: false,
    notifications: {
      glucose: true,
      meals: true,
      reminders: false,
      dailyReports: true,
      weeklyReports: true,
    },
    units: 'imperial',
    theme: 'auto',
    glucoseTargets: {
      min: 70,
      max: 180,
    },
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const showToast = useCallback((message: string): void => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', message);
    }
  }, []);

  const fetchPreferences = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not logged in');
      }

      const db = getFirestore();
      const preferencesRef = doc(db, `users/${user.uid}/preferences`);
      const preferencesSnap = await getDoc(preferencesRef);
      
      if (preferencesSnap.exists()) {
        const data = preferencesSnap.data();
        setPreferences(prev => ({
          ...prev,
          ...data,
          notifications: {
            ...prev.notifications,
            ...(data.notifications || {}),
          },
          glucoseTargets: {
            ...prev.glucoseTargets,
            ...(data.glucoseTargets || {}),
          },
        }));
      }
    } catch (error: any) {
      console.error('Error loading preferences:', error);
      Alert.alert('Error', error.message || 'Failed to load preferences.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const updatePreference = async (
    keyOrCategory: any,
    keyOrValue: any,
    value?: any
  ): Promise<void> => {
    if (loading || updating) return;

    setUpdating(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not logged in');
      }

      let newPreferences: AppPreferences;
      
      if (value !== undefined) {
        // Nested update (e.g., notifications.glucose)
        newPreferences = {
          ...preferences,
          [keyOrCategory]: {
            ...(preferences[keyOrCategory as keyof AppPreferences] as any),
            [keyOrValue]: value,
          },
        };
      } else {
        // Direct update
        newPreferences = {
          ...preferences,
          [keyOrCategory]: keyOrValue,
        };
      }

      setPreferences(newPreferences);

      const db = getFirestore();
      const preferencesRef = doc(db, `users/${user.uid}/preferences`);
      await setDoc(preferencesRef, newPreferences, { merge: true });

      showToast('Preferences updated');
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      Alert.alert('Error', error.message || 'Failed to update preferences.');
      
      // Revert the change on error
      fetchPreferences();
    } finally {
      setUpdating(false);
    }
  };

  const handleDietaryToggle = (key: keyof DietaryPreferences): void => {
    const newValue = !preferences[key];
    
    // Handle mutual exclusivity
    if (newValue) {
      if (key === 'vegan' && newValue) {
        // Vegan includes vegetarian
        updatePreference(key, newValue);
        updatePreference('vegetarian', true);
      } else if (key === 'vegetarian' && !newValue && preferences.vegan) {
        // Can't disable vegetarian if vegan is enabled
        Alert.alert(
          'Info',
          'Vegan diet includes vegetarian. Disable vegan first if you want to change this.',
          [{ text: 'OK' }]
        );
        return;
      } else if (key === 'keto' && newValue) {
        // Keto is typically low carb
        updatePreference(key, newValue);
        updatePreference('lowCarb', true);
      } else {
        updatePreference(key, newValue);
      }
    } else {
      updatePreference(key, newValue);
    }
  };

  const handleNotificationToggle = (key: keyof NotificationSettings): void => {
    updatePreference('notifications', key, !preferences.notifications[key]);
  };

  const renderSection = (
    title: string,
    items: Array<{ key: string; label: string; description: string }>,
    values: any,
    onToggle: (key: string) => void
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item) => (
        <View key={item.key} style={styles.preferenceRow}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceLabel}>{item.label}</Text>
            <Text style={styles.preferenceDescription}>{item.description}</Text>
          </View>
          <Switch
            value={values[item.key]}
            onValueChange={() => onToggle(item.key)}
            disabled={loading || updating}
            trackColor={{ false: colors.border, true: colors.link }}
            thumbColor={values[item.key] ? '#fff' : colors.subtext}
          />
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Preferences" icon="settings" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {renderSection(
          'Dietary Preferences',
          DIETARY_PREFERENCES,
          preferences,
          handleDietaryToggle as any
        )}

        {renderSection(
          'Notifications',
          NOTIFICATION_OPTIONS,
          preferences.notifications,
          handleNotificationToggle as any
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Units</Text>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceLabel}>Use Metric Units</Text>
              <Text style={styles.preferenceDescription}>
                {preferences.units === 'metric' ? 'kg, cm, °C' : 'lbs, ft, °F'}
              </Text>
            </View>
            <Switch
              value={preferences.units === 'metric'}
              onValueChange={(value) => updatePreference('units', value ? 'metric' : 'imperial')}
              disabled={loading || updating}
              trackColor={{ false: colors.border, true: colors.link }}
              thumbColor={preferences.units === 'metric' ? '#fff' : colors.subtext}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceLabel}>Dark Mode</Text>
              <Text style={styles.preferenceDescription}>
                {preferences.theme === 'auto' ? 'Follow system' : 
                 preferences.theme === 'dark' ? 'Always dark' : 'Always light'}
              </Text>
            </View>
            <Switch
              value={preferences.theme === 'dark'}
              onValueChange={(value) => updatePreference('theme', value ? 'dark' : 'light')}
              disabled={loading || updating}
              trackColor={{ false: colors.border, true: colors.link }}
              thumbColor={preferences.theme === 'dark' ? '#fff' : colors.subtext}
            />
          </View>
        </View>

        {(loading || updating) && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {loading ? 'Loading preferences...' : 'Updating...'}
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
  section: {
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
  sectionTitle: {
    fontSize: fonts.subtitle,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing(3),
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  preferenceInfo: {
    flex: 1,
    marginRight: spacing(3),
  },
  preferenceLabel: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  preferenceDescription: {
    fontSize: fonts.caption,
    color: colors.subtext,
    lineHeight: 16,
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: spacing(4),
  },
  statusText: {
    fontSize: fonts.body,
    color: colors.subtext,
    textAlign: 'center',
  },
});

export default PreferencesScreen;
