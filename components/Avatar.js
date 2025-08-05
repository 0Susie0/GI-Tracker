// components/Avatar.js
// TODO: flesh out Avatar with edit, status, etc.
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function Avatar({ uri, size = 64 }) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image source={{ uri }} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
});