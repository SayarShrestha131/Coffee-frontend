import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { useCart } from '../context/CartContext';

export default function BottomTabBar({ activeTab, onSelectTab }) {
  const { totalItemCount } = useCart();

  const tabs = [
    { id: 'Home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { id: 'Menu', label: 'Drinks', icon: 'cafe-outline', activeIcon: 'cafe' },
    { id: 'Favorites', label: 'Saved', icon: 'heart-outline', activeIcon: 'heart' },
    { id: 'Cart', label: 'Cart', icon: 'bag-handle-outline', activeIcon: 'bag-handle' },
    { id: 'Profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => onSelectTab(tab.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={22}
                  color={isActive ? Colors.card : Colors.textMuted}
                />
                {tab.id === 'Cart' && totalItemCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {totalItemCount > 9 ? '9+' : totalItemCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 8,
    paddingHorizontal: Spacing.lg,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: 10,
    paddingHorizontal: 8,
    ...Shadows.large,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapperActive: {
    backgroundColor: Colors.accent,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.accentLight,
    marginTop: 2,
  },
  labelActive: {
    color: Colors.card,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.accentGold,
    borderRadius: BorderRadius.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Colors.primaryDark,
    fontSize: 9,
    fontWeight: '800',
  },
});
