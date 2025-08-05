import { MaterialIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FoodCard from '../../components/FoodCard';

// Placeholder API function
async function detectFoodImage(imageUri) {
  // Simulate API call delay
  await new Promise(res => setTimeout(res, 1500));
  // Return mock data
  return [
    { name: 'Apple', gi: 38 },
    { name: 'Banana', gi: 52 },
  ];
}

export default function CameraScanScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        setError('Camera permission denied. Please enable it in settings.');
      }
    })();
  }, []);

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    setLoading(true);
    setError('');
    try {
      const photo = await cameraRef.current.takePictureAsync();
      const detected = await detectFoodImage(photo.uri);
      setResults(detected);
    } catch (e) {
      setError('Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.center}><Text>{error || 'No access to camera.'}</Text></View>;
  }

  return (
    <View style={{ flex: 1 }}>
      {results.length === 0 ? (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} ref={cameraRef} />
          <TouchableOpacity style={styles.captureBtn} onPress={handleCapture} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <MaterialIcons name="camera-alt" size={36} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.name}
          renderItem={({ item }) => <FoodCard name={item.name} gi={item.gi} />}
          contentContainerStyle={{ padding: 16 }}
          ListHeaderComponent={<Text style={styles.header}>Detected Foods</Text>}
        />
      )}
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  captureBtn: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 32,
    padding: 16,
    elevation: 2,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
});