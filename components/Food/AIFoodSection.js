// components/AIFoodSection.js
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../../utils/theme';

export default function AIFoodSection({ onUploadPhoto, onTakePhoto }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.primaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Ionicons name="flash" size={20} color="#fff" style={styles.headerIcon} />
        <Text style={styles.headerText}>AI Food Recognition</Text>
      </LinearGradient>
      
      <View style={styles.content}>
        <View style={styles.uploadArea}>
          <View style={styles.iconCircle}>
            <Ionicons name="cloud-upload-outline" size={24} color={colors.link} />
          </View>
          <Text style={styles.uploadTitle}>Upload Food Image</Text>
          <Text style={styles.uploadDescription}>
            Take a photo of prepared meals or ingredients to get GI information and recipe suggestions
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={onUploadPhoto}>
            <LinearGradient
              colors={colors.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Ionicons name="cloud-upload-outline" size={16} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.primaryButtonText}>Upload Photo</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={onTakePhoto}>
            <Ionicons name="camera-outline" size={16} color={colors.text} style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing(3),
    marginVertical: spacing(2),
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing(3),
  },
  headerIcon: {
    marginRight: spacing(2),
  },
  headerText: {
    color: '#fff',
    fontSize: fonts.body,
    fontWeight: 'bold',
  },
  content: {
    padding: spacing(4),
  },
  uploadArea: {
    alignItems: 'center',
    paddingVertical: spacing(4),
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    marginBottom: spacing(4),
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing(2),
  },
  uploadTitle: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing(1),
  },
  uploadDescription: {
    fontSize: fonts.caption,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: spacing(2),
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing(2),
  },
  primaryButton: {
    flex: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(3),
    paddingHorizontal: spacing(4),
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing(3),
    paddingHorizontal: spacing(4),
  },
  buttonIcon: {
    marginRight: spacing(1),
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: fonts.caption,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: fonts.caption,
    fontWeight: 'bold',
  },
});
