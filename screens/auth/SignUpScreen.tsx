// screens/auth/SignUpScreen.tsx
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Header, PasswordStrengthChecker, PrimaryButton, ValidatedInputField } from '../../components';
import TermsOfService, { TermsCheckbox } from '../../components/Authentification/TermsOfService';
import { AuthScreenProps } from '../../types/navigation';
import { sendVerificationEmail } from '../../utils/emailVerification';
import { auth } from '../../utils/firebase';
import { colors, fonts, spacing } from '../../utils/theme';

type SignUpScreenProps = AuthScreenProps<'SignUp'>;

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  tosAccepted: boolean;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  tos?: string;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    tosAccepted: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showTosModal, setShowTosModal] = useState(false);

  const validateEmail = (email: string): string | undefined => {
    if (!email || email.trim().length === 0) {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return undefined;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    newErrors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);

    if (!formData.tosAccepted) {
      newErrors.tos = 'You must accept the Terms of Service to create an account';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const checkPasswordStrength = (password: string): void => {
    if (password.length >= 6) {
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      
      if (password.length < 8 || !hasUppercase || !hasLowercase || !hasNumber) {
        Alert.alert(
          'Password Suggestion',
          'For better security, consider using at least 8 characters with uppercase letters, lowercase letters, and numbers.'
        );
      }
    }
  };

  const handleSignUp = async (): Promise<void> => {
    if (!validateForm()) {
      const firstError = Object.values(errors).find(error => error);
      if (firstError) {
        Alert.alert('Validation Error', firstError);
      }
      return;
    }

    setLoading(true);
    
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Send email verification
      const emailSent = await sendVerificationEmail(user);
      
      if (emailSent) {
        Alert.alert(
          'Account Created!',
          'Your account has been created successfully. A verification email has been sent to your email address. Please verify your email to access all features.',
          [{
            text: 'OK',
            onPress: () => {
              navigation.navigate('EmailVerification', { email: formData.email });
            },
          }]
        );
      } else {
        Alert.alert(
          'Account Created',
          'Your account has been created successfully, but we encountered an issue sending the verification email. You can resend it from your profile later.',
          [{
            text: 'OK',
            onPress: () => {
              // User will be automatically navigated via AppComplete.tsx useEffect when auth state changes
            },
          }]
        );
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Handle specific Firebase errors
      let errorMessage = 'An unexpected error occurred during sign up';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email address is already registered. Please use a different email or try logging in.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak. Please choose a stronger password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'The email address is invalid. Please enter a valid email.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled. Please contact support.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection and try again.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      Alert.alert('Sign Up Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTosAccept = (): void => {
    handleInputChange('tosAccepted', true);
    setShowTosModal(false);
  };

  const handleTosDecline = (): void => {
    handleInputChange('tosAccepted', false);
    setShowTosModal(false);
  };

  const handleTosCheckboxPress = (): void => {
    if (!formData.tosAccepted) {
      setShowTosModal(true);
    } else {
      handleInputChange('tosAccepted', false);
    }
  };

  const isFormValid = (): boolean => {
    return (
      formData.email.trim().length > 0 &&
      formData.password.length >= 6 &&
      formData.confirmPassword === formData.password &&
      formData.tosAccepted &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    );
  };

  const handleNavigateToLogin = (): void => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Header title="Create Account" icon="person-add" />
      
      <View style={styles.form}>
        <ValidatedInputField
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
          placeholder="Email Address"
          validationType="email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={errors.email}
        />

        <ValidatedInputField
          value={formData.password}
          onChangeText={(text) => handleInputChange('password', text)}
          onBlur={() => checkPasswordStrength(formData.password)}
          placeholder="Password"
          validationType="password"
          secureTextEntry
          autoCapitalize="none"
          error={errors.password}
        />

        <PasswordStrengthChecker password={formData.password} />

        <ValidatedInputField
          value={formData.confirmPassword}
          onChangeText={(text) => handleInputChange('confirmPassword', text)}
          placeholder="Confirm Password"
          validationType="required"
          secureTextEntry
          autoCapitalize="none"
          error={errors.confirmPassword}
          style={styles.confirmPasswordInput}
        />

        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <Text style={styles.passwordMismatchText}>Passwords do not match</Text>
        )}

        <TermsCheckbox
          checked={formData.tosAccepted}
          onPress={handleTosCheckboxPress}
          style={styles.tosCheckbox}
        />

        {errors.tos && (
          <Text style={styles.errorText}>{errors.tos}</Text>
        )}

        <PrimaryButton
          title={loading ? 'Creating Account...' : 'Create Account'}
          onPress={handleSignUp}
          disabled={loading || !isFormValid()}
          loading={loading}
          style={[
            styles.signUpButton, 
            (!isFormValid() && !loading) && styles.disabledButton
          ]}
        />

        <TouchableOpacity 
          onPress={handleNavigateToLogin} 
          style={styles.loginLink}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkHighlight}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <TermsOfService
        isVisible={showTosModal}
        onAccept={handleTosAccept}
        onDecline={handleTosDecline}
        onClose={() => setShowTosModal(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing(4),
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  confirmPasswordInput: {
    marginTop: spacing(1),
  },
  passwordMismatchText: {
    color: '#ff4444',
    fontSize: fonts.caption,
    marginTop: spacing(1),
    marginLeft: spacing(1),
    marginBottom: spacing(1),
  },
  errorText: {
    color: '#ff4444',
    fontSize: fonts.caption,
    marginTop: spacing(1),
    marginLeft: spacing(1),
    marginBottom: spacing(1),
  },
  tosCheckbox: {
    marginVertical: spacing(4),
  },
  signUpButton: {
    marginTop: spacing(2),
    marginBottom: spacing(4),
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginLink: {
    paddingVertical: spacing(3),
    alignItems: 'center',
  },
  linkText: {
    fontSize: fonts.body,
    color: colors.subtext,
    textAlign: 'center',
  },
  linkHighlight: {
    color: colors.link,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
