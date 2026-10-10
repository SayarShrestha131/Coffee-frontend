import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme';

export default function UserAvatar({ uri, name, size = 60 }) {
  const imageUri = typeof uri === 'string' ? uri.trim() : '';
  const initial = typeof name === 'string' ? name.trim().charAt(0).toUpperCase() : '';

  if (imageUri) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>
        {initial || '?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: Colors.cardSecondary,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardSecondary,
  },
  initial: {
    color: Colors.primary,
    fontWeight: '800',
  },
});
