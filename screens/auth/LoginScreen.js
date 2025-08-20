import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Header from '../../components/Header';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import '../../utils/firebase'; // Ensures Firebase is initialized

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Email and password are required.');
      return;
    }
    setLoading(true);
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation will happen automatically via App.js useEffect when user state changes
    } catch (error) {
      Alert.alert('Login Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestEntry = async () => {
    try {
      await AsyncStorage.setItem('userMode', 'guest');
      // For guest mode, we'll need to modify App.js to handle this case
      Alert.alert('Info', 'Guest mode will be implemented in future update. Please create an account for now.');
    } catch (error) {
      Alert.alert('Error', 'Unable to continue as guest. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Login" icon="log-in" />
      <InputField value={email} onChangeText={setEmail} placeholder="Email" />
      <InputField value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
      <PrimaryButton title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
      <PrimaryButton
        title="Continue as Guest"
        onPress={handleGuestEntry}
        style={{ marginTop: 16, backgroundColor: '#ccc' }}
      />
      <TouchableOpacity onPress={() => navigation?.navigate('SignUp')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#fff' },
  link: { color: '#4CAF50', textAlign: 'center', marginTop: 16 },
});