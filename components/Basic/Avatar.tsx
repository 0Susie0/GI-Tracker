// components/Basic/Avatar.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AvatarProps } from '../../types/components';
import { colors } from '../../utils/theme';

const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 40,
  name,
  onPress,
  editable = false,
  placeholder = false,
  style
}) => {
  const avatarSize = { width: size, height: size, borderRadius: size / 2 };
  
  const getInitials = (fullName?: string): string => {
    if (!fullName) return '?';
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderAvatar = () => {
    if (source && !placeholder) {
      return (
        <Image 
          source={source} 
          style={[styles.avatar, avatarSize]} 
          resizeMode="cover"
        />
      );
    }

    // Placeholder with initials or icon
    return (
      <View style={[styles.placeholder, avatarSize, { backgroundColor: colors.border }]}>
        {name ? (
          <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
            {getInitials(name)}
          </Text>
        ) : (
          <Ionicons 
            name="person" 
            size={size * 0.6} 
            color={colors.subtext} 
          />
        )}
      </View>
    );
  };

  const avatarContent = (
    <View style={[styles.container, style]}>
      {renderAvatar()}
      {editable && (
        <View style={[styles.editBadge, { right: size * 0.05, bottom: size * 0.05 }]}>
          <Ionicons name="camera" size={size * 0.25} color="#fff" />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {avatarContent}
      </TouchableOpacity>
    );
  }

  return avatarContent;
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: colors.border,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: colors.text,
    fontWeight: 'bold',
  },
  editBadge: {
    position: 'absolute',
    backgroundColor: colors.link,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
});

export default Avatar;

