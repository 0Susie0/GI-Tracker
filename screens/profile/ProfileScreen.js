// screens/ProfileScreen.js
// TODO: flesh out ProfileScreen with stats, edit, etc.
import { getAuth, updateEmail } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/Avatar';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import MacroSummary from '../../components/MacroSummary';
import PrimaryButton from '../../components/PrimaryButton';

export default function ProfileScreen() {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('https://randomuser.me/api/portraits/women/44.jpg');
  const [macros, setMacros] = useState([
    { label: 'Protein', value: 60 },
    { label: 'Carbs', value: 120 },
    { label: 'Fat', value: 40 },
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('User not logged in');
        setEmail(user.email || '');
        const db = getFirestore();
        const docRef = doc(db, `users/${user.uid}/profile`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setBio(data.bio || '');
          if (data.avatar) setAvatar(data.avatar);
          if (data.macros) setMacros(data.macros);
        } else {
          setName('');
          setBio('');
        }
      } catch (e) {
        Alert.alert('Error', e.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('User not logged in');
      // Update email if changed
      if (email !== user.email) {
        await updateEmail(user, email);
      }
      // Update Firestore profile
      const db = getFirestore();
      const docRef = doc(db, `users/${user.uid}/profile`);
      await setDoc(docRef, { name, bio, avatar, macros }, { merge: true });
      Alert.alert('Success', 'Profile updated!');
      setEditMode(false);
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Profile" icon="person" />
        <Text style={{ marginTop: 32 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Profile" icon="person" />
      <Avatar uri={avatar} size={100} />
      {editMode ? (
        <>
          <InputField value={name} onChangeText={setName} placeholder="Name" />
          <InputField value={email} onChangeText={setEmail} placeholder="Email" />
          <InputField value={bio} onChangeText={setBio} placeholder="Bio" />
          <PrimaryButton
            title={saving ? 'Saving...' : 'Save'}
            onPress={handleSave}
            disabled={saving}
          />
          <PrimaryButton
            title="Cancel"
            onPress={() => setEditMode(false)}
            style={{ backgroundColor: '#ccc', marginTop: 8 }}
            disabled={saving}
          />
        </>
      ) : (
        <>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          {bio ? <Text style={styles.bio}>{bio}</Text> : null}
          <MacroSummary macros={macros} />
          <PrimaryButton title="Edit Profile" onPress={() => setEditMode(true)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#fff', paddingTop: 24 },
  name: { fontSize: 22, fontWeight: 'bold', marginTop: 12 },
  email: { fontSize: 16, color: '#888', marginBottom: 8 },
  bio: { fontSize: 15, color: '#444', marginBottom: 16 },
});