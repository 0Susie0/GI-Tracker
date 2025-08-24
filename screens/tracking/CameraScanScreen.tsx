// screens/tracking/CameraScanScreen.tsx
import { MaterialIcons } from '@expo/vector-icons';
// import { Camera } from 'expo-camera';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { FoodCard, Header } from '../../components';
import { FoodItem } from '../../types/app';
import { TrackingScreenProps } from '../../types/navigation';
import { colors, fonts, spacing } from '../../utils/theme';

type CameraScanScreenProps = TrackingScreenProps<'CameraScan'>;

interface DetectedFood {
  id: string;
  name: string;
  gi: number;
  confidence: number;
  servingSize: string;
  calories: number;
  carbs: number;
  fiber: number;
  protein: number;
  category: string;
}

interface CameraPermissionState {
  granted: boolean | null;
  loading: boolean;
  error: string | null;
}

// Enhanced mock API function with more realistic data
const detectFoodImage = async (imageUri: string): Promise<DetectedFood[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate potential API failure (10% chance)
  if (Math.random() < 0.1) {
    throw new Error('Food detection service temporarily unavailable');
  }
  
  // Return mock data with confidence scores
  const mockResults: DetectedFood[] = [
    { 
      id: '1',
      name: 'Green Apple', 
      gi: 38, 
      confidence: 0.92,
      servingSize: '1 medium (182g)',
      calories: 95,
      carbs: 25,
      fiber: 4,
      protein: 0.5,
      category: 'fruits'
    },
    { 
      id: '2',
      name: 'Whole Wheat Bread', 
      gi: 74, 
      confidence: 0.85,
      servingSize: '1 slice (28g)',
      calories: 81,
      carbs: 14,
      fiber: 2,
      protein: 4,
      category: 'grains'
    },
  ];
  
  return mockResults.filter(food => food.confidence > 0.7); // Only return high-confidence results
};

const CameraScanScreen: React.FC<CameraScanScreenProps> = ({ navigation, route }) => {
  const [permission, setPermission] = useState<CameraPermissionState>({
    granted: null,
    loading: true,
    error: null,
  });
  const [cameraType, setCameraType] = useState('back' as any);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DetectedFood[]>([]);
  const [error, setError] = useState<string>('');
  const cameraRef = useRef<any>(null);

  const mode = route.params?.mode || 'camera';

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async (): Promise<void> => {
    try {
      setPermission(prev => ({ ...prev, loading: true, error: null }));
      
      // const { status } = await Camera.requestCameraPermissionsAsync();
      // Mock permission for now
      const granted = true;
      
      setPermission({
        granted,
        loading: false,
        error: granted ? null : 'Camera permission is required to scan food items. Please enable it in your device settings.',
      });
    } catch (error) {
      setPermission({
        granted: false,
        loading: false,
        error: 'Failed to request camera permission. Please try again.',
      });
    }
  };

  const handleCapture = async (): Promise<void> => {
    if (!cameraRef.current) {
      setError('Camera not ready. Please try again.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      
      const detected = await detectFoodImage(photo.uri);
      
      if (detected.length === 0) {
        setError('No food items detected. Please try taking another photo with better lighting.');
        return;
      }
      
      setResults(detected);
    } catch (error: any) {
      console.error('Food detection error:', error);
      setError(error.message || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetakePhoto = (): void => {
    setResults([]);
    setError('');
  };

  const handleFoodPress = useCallback((food: DetectedFood): void => {
    const foodItem: FoodItem = {
      id: food.id,
      name: food.name,
      gi: food.gi,
      servingSize: food.servingSize,
      calories: food.calories,
      carbs: food.carbs,
      fiber: food.fiber,
      protein: food.protein,
      category: food.category,
    };

    navigation.navigate('FoodDetails', {
      foodId: food.id,
      foodName: food.name,
      food: foodItem,
    });
  }, [navigation]);

  const toggleCameraType = (): void => {
    setCameraType((current: any) => 
      current === 'back' ? 'front' : 'back'
    );
  };

  const handleUploadFromGallery = (): void => {
    // TODO: Implement gallery picker
    Alert.alert(
      'Coming Soon',
      'Gallery upload feature will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>
        {results.length > 0 ? 'Detected Foods' : 'Food Scanner'}
      </Text>
      <Text style={styles.headerSubtitle}>
        {results.length > 0 
          ? `Found ${results.length} food item${results.length > 1 ? 's' : ''}` 
          : 'Point camera at food and tap to scan'
        }
      </Text>
    </View>
  );

  const renderFoodItem = ({ item }: { item: DetectedFood }) => (
    <TouchableOpacity 
      style={styles.foodItemContainer}
      onPress={() => handleFoodPress(item)}
      activeOpacity={0.7}
    >
      <FoodCard 
        food={{
          id: item.id,
          name: item.name,
          glycemicIndex: item.gi,
          calories: item.calories,
        }}
        onPress={() => handleFoodPress(item)}
      />
      <View style={styles.confidenceContainer}>
        <Text style={styles.confidenceText}>
          Confidence: {Math.round(item.confidence * 100)}%
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (permission.loading) {
    return (
      <View style={styles.container}>
        <Header title="Food Scanner" icon="camera" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.link} />
          <Text style={styles.loadingText}>Requesting camera permission...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Header title="Food Scanner" icon="camera" />
        <View style={styles.centerContainer}>
          <MaterialIcons name="camera-alt" size={64} color={colors.subtext} />
          <Text style={styles.errorText}>{permission.error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={requestCameraPermission}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Food Scanner" icon="camera" />
      
      {results.length === 0 ? (
        <View style={styles.cameraContainer}>
          <View style={styles.mockCamera}>
            <View style={styles.cameraOverlay}>
              <View style={styles.topControls}>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={toggleCameraType}
                >
                  <MaterialIcons name="flip-camera-android" size={24} color="#fff" />
                </TouchableOpacity>
                {mode === 'upload' && (
                  <TouchableOpacity 
                    style={styles.controlButton}
                    onPress={handleUploadFromGallery}
                  >
                    <MaterialIcons name="photo-library" size={24} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.scanningFrame} />
              <View style={styles.mockCameraText}>
                <MaterialIcons name="camera-alt" size={64} color="rgba(255,255,255,0.7)" />
                <Text style={styles.mockText}>Camera Preview</Text>
                <Text style={styles.mockSubtext}>Tap capture to simulate food detection</Text>
              </View>
              
              <View style={styles.bottomControls}>
                <TouchableOpacity 
                  style={[styles.captureButton, loading && styles.captureButtonDisabled]} 
                  onPress={handleCapture} 
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="large" />
                  ) : (
                    <MaterialIcons name="camera-alt" size={36} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          <FlatList
            data={results}
            keyExtractor={item => item.id}
            renderItem={renderFoodItem}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={renderHeader}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.retakeButton}
              onPress={handleRetakePhoto}
            >
              <MaterialIcons name="camera-alt" size={20} color={colors.link} />
              <Text style={styles.retakeButtonText}>Retake Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.dismissButton}
            onPress={() => setError('')}
          >
            <Text style={styles.dismissButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.bg,
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: spacing(4),
  },
  loadingText: {
    marginTop: spacing(3),
    fontSize: fonts.body,
    color: colors.subtext,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  mockCamera: { 
    flex: 1,
    backgroundColor: '#000',
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing(4),
    paddingTop: spacing(6),
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: spacing(3),
  },
  scanningFrame: {
    position: 'absolute',
    top: spacing(16),
    left: spacing(8),
    right: spacing(8),
    bottom: spacing(16),
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  mockCameraText: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: -50 }],
  },
  mockText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: fonts.subtitle,
    fontWeight: 'bold',
    marginTop: spacing(2),
  },
  mockSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fonts.body,
    marginTop: spacing(1),
    textAlign: 'center',
  },
  bottomControls: {
    alignItems: 'center',
    paddingBottom: spacing(8),
  },
  captureButton: {
    backgroundColor: colors.accent,
    borderRadius: 40,
    padding: spacing(4),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  captureButtonDisabled: {
    backgroundColor: colors.border,
  },
  resultsContainer: {
    flex: 1,
  },
  headerContainer: {
    padding: spacing(4),
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fonts.title,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing(1),
  },
  headerSubtitle: {
    fontSize: fonts.body,
    color: colors.subtext,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: spacing(4),
    paddingBottom: spacing(6),
  },
  foodItemContainer: {
    marginBottom: spacing(3),
  },
  confidenceContainer: {
    paddingHorizontal: spacing(3),
    paddingTop: spacing(1),
  },
  confidenceText: {
    fontSize: fonts.caption,
    color: colors.subtext,
    textAlign: 'right',
  },
  actionButtons: {
    padding: spacing(4),
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.link,
    borderRadius: 8,
    padding: spacing(3),
  },
  retakeButtonText: {
    marginLeft: spacing(2),
    fontSize: fonts.body,
    color: colors.link,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    padding: spacing(3),
    margin: spacing(4),
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    color: '#DC2626',
    fontSize: fonts.body,
    marginRight: spacing(2),
  },
  dismissButton: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
  },
  dismissButtonText: {
    color: '#DC2626',
    fontSize: fonts.caption,
    fontWeight: '600',
  },
  retryButton: {
    marginTop: spacing(4),
    backgroundColor: colors.link,
    paddingHorizontal: spacing(6),
    paddingVertical: spacing(3),
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: fonts.body,
    fontWeight: 'bold',
  },
});

export default CameraScanScreen;
