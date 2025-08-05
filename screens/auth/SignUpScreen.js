import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Header from '../../components/Header';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import '../../utils/firebase'; // Ensures Firebase is initialized

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();

  const validate = () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Email and password are required.');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    setLoading(true);
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      nav.replace('Tracking');
    } catch (error) {
      Alert.alert('Sign Up Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Sign Up" icon="person-add" />
      <InputField value={email} onChangeText={setEmail} placeholder="Email" />
      <InputField value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
      <PrimaryButton title={loading ? 'Signing Up...' : 'Sign Up'} onPress={handleSignUp} disabled={loading} />
      <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#fff' },
  link: { color: '#4CAF50', textAlign: 'center', marginTop: 16 },
});