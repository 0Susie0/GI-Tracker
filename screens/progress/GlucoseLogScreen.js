import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import InputField from '../../components/Basic/InputField';
import PrimaryButton from '../../components/Basic/PrimaryButton';

export default function GlucoseLogScreen() {
  const [value, setValue] = useState('');
  const [datetime, setDatetime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) setDatetime(selectedDate);
  };

  const handleSubmit = async () => {
    if (!value || isNaN(Number(value))) {
      Alert.alert('Validation Error', 'Please enter a valid glucose value.');
      return;
    }
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('User not logged in');
      const db = getFirestore();
      await addDoc(collection(db, `users/${user.uid}/glucoseReadings`), {
        value: Number(value),
        datetime: datetime.toISOString(),
        notes: notes.trim(),
      });
      Alert.alert('Success', 'Glucose reading saved!');
      setValue('');
      setNotes('');
      setDatetime(new Date());
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to save glucose reading.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Glucose Value (mg/dL)</Text>
      <InputField
        value={value}
        onChangeText={setValue}
        placeholder="Enter value"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Date & Time</Text>
      <PrimaryButton
        title={datetime.toLocaleString()}
        onPress={() => setShowPicker(true)}
        style={{ marginBottom: 8 }}
      />
      {showPicker && (
        <DateTimePicker
          value={datetime}
          mode="datetime"
          display="default"
          onChange={onChangeDate}
        />
      )}
      <Text style={styles.label}>Notes (optional)</Text>
      <InputField
        value={notes}
        onChangeText={setNotes}
        placeholder="Add notes"
        multiline
      />
      <PrimaryButton
        title={loading ? 'Saving...' : 'Save Reading'}
        onPress={handleSubmit}
        disabled={loading}
        style={{ marginTop: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
    fontSize: 16,
  },
});