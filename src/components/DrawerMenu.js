import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';

export default function DrawerMenu({
  visible,
  onClose,
  onNavigate,
  activeScreen,
}) {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'Home', label: 'Home Feed', icon: 'home-outline' },
    { id: 'Menu', label: 'Coffee Menu & Catalog', icon: 'cafe-outline' },
    { id: 'Cart', label: 'My Cart & Orders', icon: 'bag-handle-outline' },
    { id: 'Favorites', label: 'Saved Favorites', icon: 'heart-outline' },
    { id: 'Tracking', label: 'Track Live Order', icon: 'bicycle-outline' },
    { id: 'Profile', label: 'Profile & Rewards', icon: 'person-outline' },
  ];

  const handleSelect = (screenId) => {
    onClose();
    setTimeout(() => {
      onNavigate(screenId);
    }, 150);
  };

  const handleLogout = async () => {
    onClose();
    try {
      await logout();
    } catch (error) {
      Alert.alert('Could not sign out', error.message);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        
        <SafeAreaView style={styles.drawerContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header with Close */}
            <View style={styles.header}>
              <View style={styles.brandBadge}>
                <MaterialCommunityIcons name="coffee" size={20} color={Colors.accentGold} />
                <Text style={styles.brandTitle}>Café Bliss</Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Ionicons name="close" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* User Profile Card */}
            <View style={styles.userCard}>
              <UserAvatar uri={user.avatar} name={user.name} size={54} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.tierPill}>
                  <Ionicons name="sparkles" size={12} color={Colors.accentGold} />
                  <Text style={styles.tierText}>{user.memberTier}</Text>
                </View>
              </View>
            </View>

            {/* Loyalty points card */}
            <View style={styles.pointsBanner}>
              <View>
                <Text style={styles.pointsLabel}>REWARDS BALANCE</Text>
                <Text style={styles.pointsValue}>{user.rewardPoints} Beans</Text>
              </View>
              <TouchableOpacity
                style={styles.redeemBtn}
                onPress={() => handleSelect('Profile')}
              >
                <Text style={styles.redeemBtnText}>Redeem</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Navigation links */}
            <View style={styles.linksContainer}>
              {menuItems.map((item) => {
                const isCurrent = activeScreen === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.menuItem, isCurrent && styles.menuItemActive]}
                    onPress={() => handleSelect(item.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={isCurrent ? Colors.primary : Colors.textSecondary}
                    />
                    <Text
                      style={[styles.menuLabel, isCurrent && styles.menuLabelActive]}
                    >
                      {item.label}
                    </Text>
                    {isCurrent && (
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={Colors.primary}
                        style={{ marginLeft: 'auto' }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.divider} />

            {/* Sign Out */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
              <Feather name="log-out" size={18} color={Colors.error} />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Café Bliss v1.0.0 • Mobile App</Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(35, 20, 7, 0.45)',
  },
  backdrop: {
    flex: 1,
  },
  drawerContainer: {
    width: '78%',
    maxWidth: 320,
    backgroundColor: Colors.background,
    height: '100%',
    ...Shadows.large,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: Typography.titleSmall,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.small,
  },
  userInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  userName: {
    fontSize: Typography.bodyLarge,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  userEmail: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 1,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSubtle,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    gap: 4,
    marginTop: 6,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accent,
  },
  pointsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  pointsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accentLight,
    letterSpacing: 0.6,
  },
  pointsValue: {
    fontSize: Typography.titleSmall,
    fontWeight: '800',
    color: Colors.card,
    marginTop: 2,
  },
  redeemBtn: {
    backgroundColor: Colors.accentGold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  redeemBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.lg,
  },
  linksContainer: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  menuItemActive: {
    backgroundColor: Colors.cardSecondary,
  },
  menuLabel: {
    fontSize: Typography.bodyMedium,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  menuLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  logoutText: {
    fontSize: Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.error,
  },
  versionText: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
