// screens/auth/EmailVerificationScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Header, PrimaryButton } from '../../components';
import { AuthScreenProps } from '../../types/navigation';
import {
    checkEmailVerification,
    resendVerificationEmail,
    waitForEmailVerification,
} from '../../utils/emailVerification';
import { auth } from '../../utils/firebase';
import { colors, fonts, spacing } from '../../utils/theme';

type EmailVerificationScreenProps = AuthScreenProps<'EmailVerification'>;

type VerificationStatus = 'pending' | 'verified' | 'timeout';

const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({ navigation, route }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('pending');
  
  const user: User | null = auth.currentUser;
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

  const checkInitialVerification = async (): Promise<void> => {
    if (user) {
      const isVerified = await checkEmailVerification(user);
      if (isVerified) {
        handleVerificationSuccess();
      }
    }
  };

  const handleVerificationSuccess = (): void => {
    setVerificationStatus('verified');
    Alert.alert(
      'Email Verified!',
      'Your email has been successfully verified. You can now access all features of GI Tracker.',
      [{
        text: 'Continue',
        onPress: () => {
          // Navigation will be handled by AppComplete.tsx when auth state changes
          navigation.replace('Login');
        },
      }]
    );
  };

  const handleVerificationTimeout = (): void => {
    setVerificationStatus('timeout');
    Alert.alert(
      'Verification Timeout',
      'Email verification timed out. You can resend the verification email or try again later.',
      [{ text: 'OK' }]
    );
  };

  const handleResendEmail = async (): Promise<void> => {
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
      (error: Error) => {
        console.error('Resend verification email error:', error);
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

  const handleManualCheck = async (): Promise<void> => {
    if (!user) return;

    setIsChecking(true);
    const isVerified = await checkEmailVerification(user);
    setIsChecking(false);

    if (isVerified) {
      handleVerificationSuccess();
    } else {
      Alert.alert(
        'Not Yet Verified',
        'Your email is not yet verified. Please check your email and click the verification link.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSkipForNow = (): void => {
    Alert.alert(
      'Skip Verification?',
      'You can use the app without email verification, but some features may be limited. You can verify your email later from your profile settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => {
            // Navigation will be handled by AppComplete.tsx when auth state changes
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const getStatusIcon = (): any => {
    switch (verificationStatus) {
      case 'verified':
        return 'checkmark-circle';
      case 'timeout':
        return 'alert-circle';
      default:
        return 'mail-outline';
    }
  };

  const getStatusColor = (): string => {
    switch (verificationStatus) {
      case 'verified':
        return colors.accent;
      case 'timeout':
        return '#ff4444';
      default:
        return colors.link;
    }
  };

  const getTitle = (): string => {
    switch (verificationStatus) {
      case 'verified':
        return 'Email Verified!';
      case 'timeout':
        return 'Verification Timeout';
      default:
        return 'Check Your Email';
    }
  };

  const getDescription = (): string => {
    switch (verificationStatus) {
      case 'verified':
        return 'Your email has been successfully verified.';
      case 'timeout':
        return 'Email verification timed out. Please try resending the verification email.';
      default:
        return `We've sent a verification link to:`;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Verify Your Email" icon="mail" />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={getStatusIcon()} 
            size={80} 
            color={getStatusColor()} 
          />
        </View>

        <Text style={styles.title}>{getTitle()}</Text>
        <Text style={styles.description}>{getDescription()}</Text>

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
                loading={isChecking}
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
                loading={isChecking && !canResend}
                variant="secondary"
                style={[
                  styles.secondaryButton, 
                  (!canResend || isChecking) && styles.disabledButton
                ]}
              />

              <TouchableOpacity 
                onPress={handleSkipForNow} 
                style={styles.skipButton}
                activeOpacity={0.7}
              >
                <Text style={styles.skipText}>Skip for now</Text>
              </TouchableOpacity>
            </View>

            {isChecking && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.link} />
                <Text style={styles.loadingText}>Checking verification status...</Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    padding: spacing(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: spacing(8),
  },
  title: {
    fontSize: fonts.title,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(4),
  },
  description: {
    fontSize: fonts.body,
    color: colors.subtext,
    textAlign: 'center',
    marginBottom: spacing(2),
  },
  email: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: colors.link,
    textAlign: 'center',
    marginBottom: spacing(6),
  },
  instructions: {
    fontSize: fonts.caption,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing(8),
    paddingHorizontal: spacing(2),
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    marginBottom: spacing(4),
  },
  secondaryButton: {
    marginBottom: spacing(4),
  },
  disabledButton: {
    opacity: 0.6,
  },
  skipButton: {
    padding: spacing(3),
  },
  skipText: {
    color: colors.subtext,
    fontSize: fonts.caption,
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing(6),
  },
  loadingText: {
    marginLeft: spacing(2),
    color: colors.subtext,
    fontSize: fonts.caption,
  },
});

export default EmailVerificationScreen;
