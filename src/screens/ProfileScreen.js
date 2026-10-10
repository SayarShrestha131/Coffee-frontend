import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import UserAvatar from '../components/UserAvatar';

export default function ProfileScreen({
  onOpenDrawer,
  onOpenCart,
  onOpenNotifications,
  onGoToOrderTracking,
}) {
  const { user, logout, updateProfile } = useAuth();
  const { orderHistory } = useCart();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [ecoCupReward, setEcoCupReward] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');

  const openEditProfile = () => {
    setEditName(user.name);
    setEditPhone(user.phone);
    setEditAddress(user.savedAddress);
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = async () => {
    if (editName.trim().length < 2) {
      Alert.alert('Name required', 'Enter a name with at least 2 characters.');
      return;
    }
    setIsSavingProfile(true);
    try {
      await updateProfile({
        name: editName.trim(),
        phone: editPhone.trim(),
        savedAddress: editAddress.trim(),
      });
      setIsEditProfileOpen(false);
    } catch (error) {
      Alert.alert('Could not update profile', error.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Could not sign out', error.message);
    }
  };

  const menuSections = [
    {
      title: 'Coffee Experience',
      items: [
        {
          id: 'addresses',
          label: 'Delivery Addresses',
          icon: 'location-outline',
          detail: '452 Broadway, SoHo',
          onPress: openEditProfile,
        },
        {
          id: 'preferences',
          label: 'Taste & Milk Defaults',
          icon: 'options-outline',
          detail: 'Oat Milk • 50% Sweet',
          onPress: () => Alert.alert('Default Taste', 'Default saved: Oat Milk, Less Ice'),
        },
        {
          id: 'gift_cards',
          label: 'Gift Cards & Vouchers',
          icon: 'gift-outline',
          detail: '2 Active Vouchers',
          onPress: () => Alert.alert('Vouchers', '1. COFFEE20 (20% Off)\n2. WELCOME5 ($2.50 Off)'),
        },
      ],
    },
    {
      title: 'Preferences & Support',
      items: [
        {
          id: 'help',
          label: 'Barista Concierge / Support',
          icon: 'headset-outline',
          onPress: () => Alert.alert('Support', 'Live chat with our master barista is available 24/7!'),
        },
        {
          id: 'terms',
          label: 'Privacy Policy & Terms',
          icon: 'document-text-outline',
          onPress: () => Alert.alert('Terms', 'Café Bliss v1.0.0 Artisanal Mobile Terms'),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="My Account"
        subtitle="Profile & Rewards"
        onOpenDrawer={onOpenDrawer}
        onPressCart={onOpenCart}
        onPressNotifications={onOpenNotifications}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <UserAvatar uri={user.avatar} name={user.name} size={60} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={openEditProfile}
          >
            <Feather name="edit-2" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Loyalty Rewards VIP Gold Card */}
        <View style={styles.loyaltyCard}>
          <View style={styles.loyaltyHeader}>
            <View>
              <Text style={styles.loyaltyLabel}>LOYALTY MEMBERSHIP</Text>
              <Text style={styles.loyaltyTier}>{user.memberTier}</Text>
            </View>
            <MaterialCommunityIcons name="coffee" size={32} color={Colors.accentGold} />
          </View>

          <View style={styles.pointsRow}>
            <Text style={styles.pointsCount}>{user.rewardPoints}</Text>
            <Text style={styles.pointsUnit}>Beans Earned</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '68%' }]} />
            </View>
            <Text style={styles.progressText}>
              60 more beans until your next FREE handcrafted drink!
            </Text>
          </View>
        </View>

        {/* Active Order Banner if any */}
        {orderHistory.length > 0 && (
          <TouchableOpacity
            style={styles.activeOrderBanner}
            onPress={onGoToOrderTracking}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="bicycle" size={24} color={Colors.accentGold} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.activeOrderTitle}>
                Active Order #{orderHistory[0].orderId}
              </Text>
              <Text style={styles.activeOrderSub}>
                Status: {orderHistory[0].status} • Tap to view live progress
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.card} />
          </TouchableOpacity>
        )}

        {/* Preferences Toggles */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Quick Settings</Text>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>Order Status Notifications</Text>
              <Text style={styles.toggleSub}>Get real-time push updates on your coffee</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.card}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>Bring Your Own Cup Bonus</Text>
              <Text style={styles.toggleSub}>Earn +10 bonus beans for zero-waste orders</Text>
            </View>
            <Switch
              value={ecoCupReward}
              onValueChange={setEcoCupReward}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.card}
            />
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((sec) => (
          <View key={sec.title} style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>{sec.title}</Text>
            {sec.items.map((item, idx) => (
              <React.Fragment key={item.id}>
                <TouchableOpacity
                  style={styles.menuRow}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <Ionicons name={item.icon} size={20} color={Colors.primary} />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  {item.detail && <Text style={styles.menuDetail}>{item.detail}</Text>}
                  <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                </TouchableOpacity>
                {idx < sec.items.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Feather name="log-out" size={18} color={Colors.error} />
          <Text style={styles.logoutBtnText}>Sign Out from Account</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal visible={isEditProfileOpen} transparent animationType="fade" onRequestClose={() => setIsEditProfileOpen(false)}>
        <View style={styles.editOverlay}>
          <View style={styles.editCard}>
            <Text style={styles.editTitle}>Edit Profile</Text>
            <TextInput
              style={styles.editInput}
              placeholder="Name"
              placeholderTextColor={Colors.textMuted}
              value={editName}
              onChangeText={setEditName}
              maxLength={80}
            />
            <TextInput
              style={styles.editInput}
              placeholder="Phone number"
              placeholderTextColor={Colors.textMuted}
              value={editPhone}
              onChangeText={setEditPhone}
              keyboardType="phone-pad"
              maxLength={30}
            />
            <TextInput
              style={[styles.editInput, styles.editAddressInput]}
              placeholder="Saved delivery address"
              placeholderTextColor={Colors.textMuted}
              value={editAddress}
              onChangeText={setEditAddress}
              multiline
              maxLength={250}
            />
            <TouchableOpacity style={styles.saveProfileButton} onPress={handleSaveProfile} disabled={isSavingProfile}>
              <Text style={styles.saveProfileText}>{isSavingProfile ? 'Saving...' : 'Save changes'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditProfileOpen(false)}>
              <Text style={styles.cancelEditText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.small,
  },
  userInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  userName: {
    fontSize: Typography.bodyLarge,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  userEmail: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  userPhone: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 1,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
    backgroundColor: 'rgba(35, 20, 7, 0.65)',
  },
  editCard: {
    padding: Spacing.xl,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    gap: Spacing.md,
  },
  editTitle: {
    fontSize: Typography.titleSmall,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  editInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  editAddressInput: {
    minHeight: 76,
    textAlignVertical: 'top',
  },
  saveProfileButton: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
  },
  saveProfileText: {
    color: Colors.card,
    fontWeight: '700',
  },
  cancelEditText: {
    alignSelf: 'center',
    color: Colors.textMuted,
    padding: Spacing.sm,
  },
  loyaltyCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.medium,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loyaltyLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accentGold,
    letterSpacing: 1,
  },
  loyaltyTier: {
    fontSize: Typography.titleSmall,
    fontWeight: '800',
    color: Colors.card,
    marginTop: 2,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: Spacing.md,
    gap: 6,
  },
  pointsCount: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.card,
  },
  pointsUnit: {
    fontSize: Typography.bodyMedium,
    color: Colors.accentLight,
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: Spacing.md,
  },
  progressBar: {
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accentGold,
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontSize: Typography.caption,
    color: Colors.accentLight,
    marginTop: 6,
  },
  activeOrderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  activeOrderTitle: {
    fontSize: Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.card,
  },
  activeOrderSub: {
    fontSize: Typography.caption,
    color: Colors.accentLight,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.small,
  },
  sectionHeader: {
    fontSize: Typography.bodyLarge,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    letterSpacing: -0.2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: Spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  menuDetail: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  toggleTitle: {
    fontSize: Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  toggleSub: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 8,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.errorLight,
    gap: 8,
    marginVertical: Spacing.sm,
  },
  logoutBtnText: {
    fontSize: Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.error,
  },
});
