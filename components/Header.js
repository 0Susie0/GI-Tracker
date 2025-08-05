// components/Header.js
// TODO: flesh out header with navigation actions, logo, etc.
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Header({ title, icon = 'ios-restaurant' }) {
  return (
    <View style={styles.header}>
      <Ionicons name={icon} size={24} color="#fff" style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '100%',
  },
  icon: {
    marginRight: 12,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});