// screens/profile/ProfileScreen.tsx
import { getAuth, signOut, updateEmail, updateProfile } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar, Header, InputField, PrimaryButton } from '../../components';
import MacroSummary from '../../components/Statistic/MacroSummary';
import { ProfileScreenProps } from '../../types/navigation';
import { colors, fonts, spacing } from '../../utils/theme';

type ProfileScreenScreenProps = ProfileScreenProps<'Profile'>;

interface ProfileData {
  name: string;
  bio: string;
  avatar: string;
  targetCalories: number;
  targetGlucose: {
    min: number;
    max: number;
  };
  streakDays: number;
  totalReadings: number;
}

interface MacroTargets {
  carbs: { current: number; target: number };
  protein: { current: number; target: number };
  fat: { current: number; target: number };
  calories: { current: number; target: number };
}

const ProfileScreen: React.FC<ProfileScreenScreenProps> = ({ navigation }) => {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    bio: '',
    avatar: '',
    targetCalories: 2000,
    targetGlucose: { min: 70, max: 180 },
    streakDays: 0,
    totalReadings: 0,
  });
  const [email, setEmail] = useState('');
  const [macros, setMacros] = useState<MacroTargets>({
    carbs: { current: 120, target: 200 },
    protein: { current: 60, target: 100 },
    fat: { current: 40, target: 70 },
    calories: { current: 1800, target: 2000 },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const fetchProfile = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not logged in');
      }

      setEmail(user.email || '');
      
      const db = getFirestore();
      const profileRef = doc(db, `users/${user.uid}/profile`);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        const data = profileSnap.data();
        setProfileData(prev => ({
          ...prev,
          name: data.name || user.displayName || '',
          bio: data.bio || '',
          avatar: data.avatar || user.photoURL || '',
          targetCalories: data.targetCalories || 2000,
          targetGlucose: data.targetGlucose || { min: 70, max: 180 },
          streakDays: data.streakDays || 0,
          totalReadings: data.totalReadings || 0,
        }));
        
        if (data.macroTargets) {
          setMacros(data.macroTargets);
        }
      } else {
        // Set default values from Firebase user
        setProfileData(prev => ({
          ...prev,
          name: user.displayName || '',
          avatar: user.photoURL || '',
        }));
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', error.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (profileData.targetCalories < 1000 || profileData.targetCalories > 5000) {
      newErrors.targetCalories = 'Target calories should be between 1000-5000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (): Promise<void> => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please check your input and try again.');
      return;
    }

    setSaving(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not logged in');
      }

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: profileData.name,
        photoURL: profileData.avatar,
      });

      // Update email if changed
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      // Update Firestore profile
      const db = getFirestore();
      const profileRef = doc(db, `users/${user.uid}/profile`);
      await setDoc(profileRef, {
        ...profileData,
        macroTargets: macros,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      Alert.alert('Success', 'Profile updated successfully!');
      setEditMode(false);
      setErrors({});
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      let errorMessage = 'Failed to update profile.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already in use.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please log out and log back in to change your email.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = (): void => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              const auth = getAuth();
              await signOut(auth);
              // Navigation will happen automatically via AppComplete.tsx when auth state changes
            } catch (error: any) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleAvatarPress = (): void => {
    // TODO: Implement avatar picker/camera functionality
    Alert.alert(
      'Change Avatar',
      'Avatar changing functionality will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const navigateToPreferences = (): void => {
    navigation.navigate('Preferences');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Profile" icon="person" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.link} />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Profile" icon="person" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarSection}>
          <Avatar 
            source={profileData.avatar ? { uri: profileData.avatar } : undefined}
            size={120}
            name={profileData.name}
            onPress={editMode ? handleAvatarPress : undefined}
            editable={editMode}
          />
          {!editMode && (
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profileData.streakDays}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profileData.totalReadings}</Text>
                <Text style={styles.statLabel}>Total Readings</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          {editMode ? (
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name*</Text>
                <InputField
                  value={profileData.name}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter your name"
                  error={errors.name}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email*</Text>
                <InputField
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Bio</Text>
                <InputField
                  value={profileData.bio}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, bio: text }))}
                  placeholder="Tell us about yourself..."
                  multiline={true}
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Daily Calorie Target</Text>
                <InputField
                  value={profileData.targetCalories.toString()}
                  onChangeText={(text) => setProfileData(prev => ({ 
                    ...prev, 
                    targetCalories: parseInt(text) || 0 
                  }))}
                  placeholder="2000"
                  keyboardType="numeric"
                  error={errors.targetCalories}
                />
              </View>

              <View style={styles.buttonContainer}>
                <PrimaryButton
                  title={saving ? 'Saving...' : 'Save Changes'}
                  onPress={handleSave}
                  disabled={saving}
                  loading={saving}
                  style={styles.saveButton}
                />
                <PrimaryButton
                  title="Cancel"
                  onPress={() => {
                    setEditMode(false);
                    setErrors({});
                  }}
                  variant="secondary"
                  disabled={saving}
                  style={styles.cancelButton}
                />
              </View>
            </View>
          ) : (
            <View style={styles.displayMode}>
              <Text style={styles.name}>{profileData.name || 'No name set'}</Text>
              <Text style={styles.email}>{email}</Text>
              {profileData.bio && (
                <Text style={styles.bio}>{profileData.bio}</Text>
              )}

              <View style={styles.macroSection}>
                <Text style={styles.sectionTitle}>Today's Nutrition</Text>
                <MacroSummary 
                  macros={macros}
                  {...({ showPercentages: true } as any)}
                />
              </View>

              <View style={styles.actionButtons}>
                <PrimaryButton 
                  title="Edit Profile" 
                  onPress={() => setEditMode(true)}
                  style={styles.editButton}
                />
                <PrimaryButton 
                  title="Preferences" 
                  onPress={navigateToPreferences}
                  variant="secondary"
                  style={styles.preferencesButton}
                />
                <PrimaryButton 
                  title="Sign Out" 
                  onPress={handleLogout}
                  variant="secondary"
                  style={styles.logoutButton}
                />
              </View>
            </View>
          )}
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing(6),
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing(4),
    gap: spacing(8),
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: fonts.title,
    fontWeight: 'bold',
    color: colors.link,
  },
  statLabel: {
    fontSize: fonts.caption,
    color: colors.subtext,
    marginTop: spacing(1),
  },
  infoSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  form: {
    gap: spacing(4),
  },
  inputGroup: {
    gap: spacing(2),
  },
  label: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.text,
  },
  buttonContainer: {
    gap: spacing(3),
    marginTop: spacing(4),
  },
  saveButton: {
    backgroundColor: colors.accent,
  },
  cancelButton: {
    backgroundColor: colors.border,
  },
  displayMode: {
    alignItems: 'center',
  },
  name: { 
    fontSize: fonts.title,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing(2),
    textAlign: 'center',
  },
  email: { 
    fontSize: fonts.body,
    color: colors.subtext,
    marginBottom: spacing(3),
    textAlign: 'center',
  },
  bio: { 
    fontSize: fonts.body,
    color: colors.text,
    marginBottom: spacing(4),
    textAlign: 'center',
    lineHeight: 22,
  },
  macroSection: {
    width: '100%',
    marginBottom: spacing(6),
  },
  sectionTitle: {
    fontSize: fonts.subtitle,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing(3),
    textAlign: 'center',
  },
  actionButtons: {
    width: '100%',
    gap: spacing(3),
  },
  editButton: {
    backgroundColor: colors.link,
  },
  preferencesButton: {
    backgroundColor: colors.accent,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
  },
});

export default ProfileScreen;
