import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import {
    checkEmailVerification,
    resendVerificationEmail,
    waitForEmailVerification,
} from '../../utils/emailVerification';
import { auth } from '../../utils/firebase'; // Import the configured auth instance

export default function EmailVerificationScreen({ navigation, route }) {
  const [isChecking, setIsChecking] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  
  const user = auth.currentUser;
  const userEmail = user?.email || route?.params?.email || 'your email';

  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
      return;
    }

    // Check if already verified
    checkInitialVerification();

    // Start polling for verification
    const intervalId = waitForEmailVerification(
      user,
      handleVerificationSuccess,
      handleVerificationTimeout,
      10 // 10 minutes timeout
    );

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user]);

  const checkInitialVerification = async () => {
    if (user) {
      const isVerified = await checkEmailVerification(user);
      if (isVerified) {
        handleVerificationSuccess();
      }
    }
  };

  const handleVerificationSuccess = () => {
    setVerificationStatus('verified');
    Alert.alert(
      'Email Verified!',
      'Your email has been successfully verified. You can now access all features of GI Tracker.',
      [
        {
          text: 'Continue',
          onPress: () => {
            // Navigation will be handled by App.js when auth state changes
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const handleVerificationTimeout = () => {
    setVerificationStatus('timeout');
    Alert.alert(
      'Verification Timeout',
      'Email verification timed out. You can resend the verification email or try again later.',
      [{ text: 'OK' }]
    );
  };

  const handleResendEmail = async () => {
    if (!canResend || !user) return;

    setIsChecking(true);
    setCanResend(false);

    const success = await resendVerificationEmail(
      user,
      () => {
        Alert.alert(
          'Verification Email Sent',
          'A new verification email has been sent to your email address. Please check your inbox and spam folder.'
        );
      },
      (error) => {
        Alert.alert(
          'Error',
          'Failed to resend verification email. Please try again later.'
        );
      }
    );

    setIsChecking(false);

    if (success) {
      // Start cooldown timer (60 seconds)
      setResendCooldown(60);
      const cooldownInterval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownInterval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCanResend(true);
    }
  };

  const handleManualCheck = async () => {
    if (!user) return;

    setIsChecking(true);
    const isVerified = await checkEmailVerification(user);
    setIsChecking(false);

    if (isVerified) {
      handleVerificationSuccess();
    } else {
      Alert.alert(
        'Not Yet Verified',
        'Your email is not yet verified. Please check your email and click the verification link.'
      );
    }
  };

  const handleSkipForNow = () => {
    Alert.alert(
      'Skip Verification?',
      'You can use the app without email verification, but some features may be limited. You can verify your email later from your profile settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => {
            // Navigation will be handled by App.js when auth state changes
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Verify Your Email" icon="mail" />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={verificationStatus === 'verified' ? 'checkmark-circle' : 'mail-outline'} 
            size={80} 
            color={verificationStatus === 'verified' ? '#4CAF50' : '#4CAF50'} 
          />
        </View>

        <Text style={styles.title}>
          {verificationStatus === 'verified' ? 'Email Verified!' : 'Check Your Email'}
        </Text>

        <Text style={styles.description}>
          {verificationStatus === 'verified'
            ? 'Your email has been successfully verified.'
            : `We've sent a verification link to:`}
        </Text>

        {verificationStatus !== 'verified' && (
          <>
            <Text style={styles.email}>{userEmail}</Text>

            <Text style={styles.instructions}>
              Click the link in the email to verify your account. The email might be in your spam folder.
            </Text>

            <View style={styles.buttonContainer}>
              <PrimaryButton
                title={isChecking ? 'Checking...' : 'I\'ve Verified'}
                onPress={handleManualCheck}
                disabled={isChecking}
                style={styles.primaryButton}
              />

              <PrimaryButton
                title={
                  isChecking
                    ? 'Sending...'
                    : canResend
                    ? 'Resend Email'
                    : `Resend in ${resendCooldown}s`
                }
                onPress={handleResendEmail}
                disabled={!canResend || isChecking}
                style={[styles.secondaryButton, (!canResend || isChecking) && styles.disabledButton]}
              />

              <TouchableOpacity onPress={handleSkipForNow} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip for now</Text>
              </TouchableOpacity>
            </View>

            {isChecking && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#4CAF50" />
                <Text style={styles.loadingText}>Checking verification status...</Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 24,
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    marginBottom: 16,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  skipButton: {
    padding: 12,
  },
  skipText: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
});
