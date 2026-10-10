import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { CATEGORIES } from '../data/mockData';

export default function CategoryPills({ selectedCategory, onSelectCategory }) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => onSelectCategory(cat.id)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name={cat.icon}
                size={16}
                color={isActive ? Colors.card : Colors.textSecondary}
                style={styles.icon}
              />
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: Spacing.md,
  },
  container: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.small,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  icon: {
    marginRight: 6,
  },
  pillText: {
    fontSize: Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.card,
    fontWeight: '700',
  },
});
