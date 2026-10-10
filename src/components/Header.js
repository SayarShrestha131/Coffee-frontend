import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { useCart } from '../context/CartContext';

export default function Header({
  title,
  subtitle,
  showLocation = false,
  showBack = false,
  onBack,
  onOpenDrawer,
  onPressCart,
  onPressNotifications,
  onPressLocation,
}) {
  const { totalItemCount } = useCart();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onOpenDrawer}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="menu" size={24} color={Colors.primary} />
          </TouchableOpacity>
        )}

        {showLocation ? (
          <TouchableOpacity
            style={styles.locationContainer}
            onPress={onPressLocation}
            activeOpacity={0.7}
          >
            <Text style={styles.locationLabel}>DELIVER TO</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={14} color={Colors.accent} />
              <Text style={styles.locationText} numberOfLines={1}>
                SoHo, 452 Broadway
              </Text>
              <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.titleContainer}>
            {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
            <Text style={styles.titleText}>{title}</Text>
          </View>
        )}
      </View>

      <View style={styles.rightContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onPressNotifications}
          activeOpacity={0.7}
        >
          <Feather name="bell" size={20} color={Colors.primary} />
          <View style={styles.dotBadge} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onPressCart}
          activeOpacity={0.7}
        >
          <Feather name="shopping-bag" size={20} color={Colors.primary} />
          {totalItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {totalItemCount > 9 ? '9+' : totalItemCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? Spacing.sm : Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleContainer: {
    marginLeft: Spacing.md,
  },
  titleText: {
    fontSize: Typography.titleMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  locationContainer: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginHorizontal: 4,
    maxWidth: 160,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  dotBadge: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: Colors.card,
  },
  cartBadgeText: {
    color: Colors.card,
    fontSize: 10,
    fontWeight: '800',
  },
});
