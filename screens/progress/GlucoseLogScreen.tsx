// screens/progress/GlucoseLogScreen.tsx
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header, InputField, PrimaryButton } from '../../components';
import { GlucoseReading } from '../../types/app';
import { ProgressScreenProps } from '../../types/navigation';
import { colors, fonts, spacing } from '../../utils/theme';

type GlucoseLogScreenProps = ProgressScreenProps<'GlucoseLog'>;

interface FormData {
  value: string;
  notes: string;
  datetime: Date;
  mealContext?: 'before_meal' | 'after_meal' | 'fasting' | 'bedtime';
}

interface ValidationErrors {
  value?: string;
  datetime?: string;
}

const GlucoseLogScreen: React.FC<GlucoseLogScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<FormData>({
    value: '',
    notes: '',
    datetime: new Date(),
    mealContext: undefined,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate glucose value
    const glucoseValue = parseFloat(formData.value);
    if (!formData.value.trim()) {
      newErrors.value = 'Glucose value is required';
    } else if (isNaN(glucoseValue)) {
      newErrors.value = 'Please enter a valid number';
    } else if (glucoseValue < 20 || glucoseValue > 600) {
      newErrors.value = 'Glucose value should be between 20-600 mg/dL';
    }

    // Validate datetime
    const now = new Date();
    if (formData.datetime > now) {
      newErrors.datetime = 'Cannot log readings for future dates';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please check your input and try again.');
      return;
    }

    setLoading(true);
    
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not logged in');
      }

      const db = getFirestore();
      const glucoseReading: Omit<GlucoseReading, 'id'> = {
        value: parseFloat(formData.value),
        timestamp: formData.datetime,
        userId: user.uid,
        notes: formData.notes.trim() || undefined,
        mealContext: formData.mealContext ? {
          mealType: formData.mealContext as any,
          timeSinceMeal: 0, // This would be calculated based on meal timing
        } : undefined,
      };

      await addDoc(collection(db, `users/${user.uid}/glucoseReadings`), {
        ...glucoseReading,
        timestamp: glucoseReading.timestamp.toISOString(),
      });

      Alert.alert(
        'Success!', 
        'Glucose reading saved successfully.',
        [
          {
            text: 'Add Another',
            onPress: () => {
              setFormData({
                value: '',
                notes: '',
                datetime: new Date(),
                mealContext: undefined,
              });
              setErrors({});
            }
          },
          {
            text: 'View Trends',
            onPress: () => navigation.navigate('Trends')
          }
        ]
      );
    } catch (error: any) {
      console.error('Error saving glucose reading:', error);
      Alert.alert(
        'Error', 
        error.message || 'Failed to save glucose reading. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date): void => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ 
        ...prev, 
        datetime: new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          prev.datetime.getHours(),
          prev.datetime.getMinutes()
        )
      }));
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date): void => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFormData(prev => ({ 
        ...prev, 
        datetime: new Date(
          prev.datetime.getFullYear(),
          prev.datetime.getMonth(),
          prev.datetime.getDate(),
          selectedTime.getHours(),
          selectedTime.getMinutes()
        )
      }));
    }
  };

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getMealContextLabel = (context: string): string => {
    const labels = {
      before_meal: 'Before Meal',
      after_meal: 'After Meal',
      fasting: 'Fasting',
      bedtime: 'Bedtime',
    };
    return labels[context as keyof typeof labels] || context;
  };

  return (
    <View style={styles.container}>
      <Header title="Log Glucose Reading" icon="fitness" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Glucose Reading</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Glucose Value (mg/dL)*</Text>
            <InputField
              value={formData.value}
              onChangeText={(text) => setFormData(prev => ({ ...prev, value: text }))}
              placeholder="Enter glucose value (e.g., 120)"
              keyboardType="numeric"
              error={errors.value}
              required={true}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date & Time*</Text>
            <View style={styles.dateTimeContainer}>
              <PrimaryButton
                title={formatDateTime(formData.datetime)}
                onPress={() => setShowDatePicker(true)}
                variant="secondary"
                style={styles.dateTimeButton}
              />
            </View>
            {errors.datetime && (
              <Text style={styles.errorText}>{errors.datetime}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Meal Context (Optional)</Text>
            <View style={styles.mealContextContainer}>
              {(['before_meal', 'after_meal', 'fasting', 'bedtime'] as const).map((context) => (
                <PrimaryButton
                  key={context}
                  title={getMealContextLabel(context)}
                  onPress={() => setFormData(prev => ({ 
                    ...prev, 
                    mealContext: prev.mealContext === context ? undefined : context 
                  }))}
                  variant={formData.mealContext === context ? 'primary' : 'secondary'}
                  style={styles.contextButton}
                />
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <InputField
              value={formData.notes}
              onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
              placeholder="Add any additional notes..."
              multiline={true}
              numberOfLines={3}
            />
          </View>

          <PrimaryButton
            title={loading ? 'Saving Reading...' : 'Save Glucose Reading'}
            onPress={handleSubmit}
            disabled={loading}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={formData.datetime}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={formData.datetime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
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
  form: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: fonts.subtitle,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing(4),
  },
  inputGroup: {
    marginBottom: spacing(4),
  },
  label: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(2),
  },
  dateTimeContainer: {
    marginBottom: spacing(1),
  },
  dateTimeButton: {
    justifyContent: 'flex-start',
  },
  mealContextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(2),
  },
  contextButton: {
    flex: 0,
    minWidth: 100,
  },
  errorText: {
    color: '#EF4444',
    fontSize: fonts.caption,
    marginTop: spacing(1),
  },
  submitButton: {
    marginTop: spacing(6),
  },
});

export default GlucoseLogScreen;
