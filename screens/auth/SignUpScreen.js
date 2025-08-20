import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Header from '../../components/Header';
import PasswordStrengthChecker from '../../components/PasswordStrengthChecker';
import PrimaryButton from '../../components/PrimaryButton';
import TermsOfService, { TermsCheckbox } from '../../components/TermsOfService';
import ValidatedInputField from '../../components/ValidatedInputField';
import { sendVerificationEmail } from '../../utils/emailVerification';
import { auth } from '../../utils/firebase'; // Import the configured auth instance

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [showTosModal, setShowTosModal] = useState(false);
  const nav = useNavigation();

  const validateForm = () => {
    // Email validation
    if (!email || email.trim().length === 0) {
      Alert.alert('Validation Error', 'Email is required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return false;
    }

    // Password validation
    if (!password) {
      Alert.alert('Validation Error', 'Password is required.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return false;
    }

    // Password strength validation
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < 8 || !hasUppercase || !hasLowercase || !hasNumber) {
      Alert.alert(
        'Weak Password',
        'For better security, your password should be at least 8 characters long and include uppercase letters, lowercase letters, and numbers.'
      );
    }

    // Confirm password validation
    if (!confirmPassword) {
      Alert.alert('Validation Error', 'Please confirm your password.');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return false;
    }

    // Terms of Service validation
    if (!tosAccepted) {
      Alert.alert('Terms Required', 'You must accept the Terms of Service to create an account.');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      const emailSent = await sendVerificationEmail(user);
      
      if (emailSent) {
        Alert.alert(
          'Account Created!',
          'Your account has been created successfully. A verification email has been sent to your email address. Please verify your email to access all features.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to email verification screen
                navigation.navigate('EmailVerification', { email: email });
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Account Created',
          'Your account has been created successfully, but we encountered an issue sending the verification email. You can resend it from your profile later.',
          [
            {
              text: 'OK',
              onPress: () => {
                // User will be automatically navigated via App.js useEffect when auth state changes
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Sign up error:', error);
      
      // Handle specific Firebase errors
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already registered. Please use a different email or try logging in.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address is invalid. Please enter a valid email.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
      }
      
      Alert.alert('Sign Up Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTosAccept = () => {
    setTosAccepted(true);
    setShowTosModal(false);
  };

  const handleTosDecline = () => {
    setTosAccepted(false);
    setShowTosModal(false);
  };

  const handleTosCheckboxPress = () => {
    if (!tosAccepted) {
      setShowTosModal(true);
    } else {
      setTosAccepted(false);
    }
  };

  const isFormValid = () => {
    return (
      email.trim().length > 0 &&
      password.length >= 6 &&
      confirmPassword === password &&
      tosAccepted &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Header title="Create Account" icon="person-add" />
      
      <View style={styles.form}>
        <ValidatedInputField
          value={email}
          onChangeText={setEmail}
          placeholder="Email Address"
          validationType="email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <ValidatedInputField
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          validationType="password"
          secureTextEntry
          autoCapitalize="none"
        />

        <PasswordStrengthChecker password={password} />

        <ValidatedInputField
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          validationType="required"
          secureTextEntry
          autoCapitalize="none"
          style={styles.confirmPasswordInput}
        />

        {confirmPassword && password !== confirmPassword && (
          <Text style={styles.passwordMismatchText}>Passwords do not match</Text>
        )}

        <TermsCheckbox
          checked={tosAccepted}
          onPress={handleTosCheckboxPress}
          style={styles.tosCheckbox}
        />

        <PrimaryButton
          title={loading ? 'Creating Account...' : 'Create Account'}
          onPress={handleSignUp}
          disabled={loading || !isFormValid()}
          style={[styles.signUpButton, (!isFormValid() && !loading) && styles.disabledButton]}
        />

        <TouchableOpacity onPress={() => navigation?.navigate('Login')} style={styles.loginLink}>
          <Text style={styles.link}>Already have an account? <Text style={styles.linkHighlight}>Log In</Text></Text>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  confirmPasswordInput: {
    marginTop: 8,
  },
  passwordMismatchText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 8,
  },
  tosCheckbox: {
    marginVertical: 20,
  },
  signUpButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  loginLink: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  link: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  linkHighlight: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});