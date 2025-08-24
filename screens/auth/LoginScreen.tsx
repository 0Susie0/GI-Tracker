// screens/auth/LoginScreen.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Header, InputField, PrimaryButton } from '../../components';
import { AuthScreenProps } from '../../types/navigation';
import { auth } from '../../utils/firebase';
import { colors, fonts, spacing } from '../../utils/theme';

type LoginScreenProps = AuthScreenProps<'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation will happen automatically via AppComplete.tsx useEffect when user state changes
    } catch (error: any) {
      let errorMessage = 'An error occurred during login';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestEntry = async () => {
    try {
      await AsyncStorage.setItem('userMode', 'guest');
      // For guest mode, we'll need to modify AppComplete.tsx to handle this case
      Alert.alert(
        'Guest Mode', 
        'Guest mode will be implemented in a future update. Please create an account for now.',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Unable to continue as guest. Please try again.');
    }
  };

  const handleNavigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <Header title="Welcome Back" icon="log-in" />
      
      <View style={styles.form}>
        <InputField 
          value={email} 
          onChangeText={setEmail} 
          placeholder="Email Address" 
          keyboardType="email-address"
          autoCapitalize="none"
          error={emailError}
          onBlur={() => validateEmail(email)}
        />
        
        <InputField 
          value={password} 
          onChangeText={setPassword} 
          placeholder="Password" 
          secureTextEntry
          error={passwordError}
          onBlur={() => validatePassword(password)}
        />
        
        <PrimaryButton 
          title={loading ? 'Signing In...' : 'Sign In'} 
          onPress={handleLogin} 
          disabled={loading}
          loading={loading}
        />
        
        <PrimaryButton
          title="Continue as Guest"
          onPress={handleGuestEntry}
          variant="secondary"
          style={styles.guestButton}
        />
        
        <TouchableOpacity 
          onPress={handleNavigateToSignUp} 
          style={styles.linkContainer}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkHighlight}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.bg 
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing(4),
  },
  guestButton: {
    marginTop: spacing(2),
  },
  linkContainer: {
    marginTop: spacing(4),
    paddingVertical: spacing(2),
  },
  linkText: { 
    color: colors.subtext,
    textAlign: 'center',
    fontSize: fonts.body,
  },
  linkHighlight: {
    color: colors.link,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
