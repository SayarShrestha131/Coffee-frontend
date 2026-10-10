import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PromoBanner({ onClaim }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.badge}>
          <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FFF" />
          <Text style={styles.badgeText}>SPECIAL PROMO</Text>
        </View>

        <Text style={styles.title}>Get 20% OFF</Text>
        <Text style={styles.subtitle}>On all artisanal cold brews & specialty lattes today!</Text>

        <View style={styles.bottomRow}>
          <View style={styles.codePill}>
            <Text style={styles.codeLabel}>Code:</Text>
            <Text style={styles.codeText}>COFFEE20</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={onClaim} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Order Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.medium,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
    marginBottom: Spacing.xs,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: Typography.titleLarge,
    fontWeight: '800',
    color: Colors.card,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Typography.bodySmall,
    color: Colors.accentLight,
    marginTop: 4,
    lineHeight: 18,
    maxWidth: '85%',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  codePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  codeLabel: {
    fontSize: 11,
    color: Colors.accentLight,
  },
  codeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  button: {
    backgroundColor: Colors.accentGold,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  buttonText: {
    color: Colors.primaryDark,
    fontSize: Typography.bodySmall,
    fontWeight: '700',
  },
});
