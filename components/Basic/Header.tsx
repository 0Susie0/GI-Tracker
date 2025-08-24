// components/Basic/Header.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HeaderProps } from '../../types/components';
import { colors, fonts, spacing } from '../../utils/theme';

const Header: React.FC<HeaderProps> = ({ 
  title, 
  icon = 'ios-restaurant', 
  leftButton, 
  rightButton, 
  showGradient = true 
}) => {
  const content = (
    <>
      {leftButton && (
        <TouchableOpacity onPress={leftButton.onPress} style={styles.leftButton}>
          <Ionicons name={leftButton.icon as any} size={24} color="#fff" />
        </TouchableOpacity>
      )}
      
      <Ionicons name={icon as any} size={24} color="#fff" style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      
      {rightButton && (
        <TouchableOpacity onPress={rightButton.onPress} style={styles.rightButton}>
          <Ionicons name={rightButton.icon as any} size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </>
  );

  if (showGradient) {
    return (
      <LinearGradient
        colors={colors.primaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        {content}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.header, { backgroundColor: colors.card }]}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing(4),
    paddingHorizontal: spacing(5),
    width: '100%',
  },
  icon: {
    marginRight: spacing(3),
  },
  title: {
    color: '#fff',
    fontSize: fonts.title,
    fontWeight: 'bold',
    flex: 1,
  },
  leftButton: {
    marginRight: spacing(3),
    padding: spacing(1),
  },
  rightButton: {
    marginLeft: spacing(3),
    padding: spacing(1),
  },
});

export default Header;

