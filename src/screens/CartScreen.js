import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';

export default function CartScreen({
  onProceedToCheckout,
  onExploreMenu,
  onOpenDrawer,
  onOpenNotifications,
}) {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    appliedPromo,
    applyPromo,
    removePromo,
    subtotal,
    discount,
    deliveryFee,
    serviceTax,
    total,
    deliveryType,
    setDeliveryType,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    if (!res.success) {
      Alert.alert('Promo Code', res.message);
    } else {
      setPromoInput('');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="My Cart"
        subtitle="Order Summary"
        onOpenDrawer={onOpenDrawer}
        onPressNotifications={onOpenNotifications}
      />

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <MaterialCommunityIcons name="coffee-off-outline" size={48} color={Colors.accent} />
          </View>
          <Text style={styles.emptyTitle}>Your cup is empty!</Text>
          <Text style={styles.emptySubtitle}>
            Looks like you haven&apos;t added any coffees or bakery treats yet.
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={onExploreMenu}
            activeOpacity={0.85}
          >
            <Text style={styles.exploreBtnText}>Explore Coffee Menu</Text>
            <Feather name="arrow-right" size={18} color={Colors.card} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Delivery vs Pickup Toggle */}
            <View style={styles.deliveryToggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  deliveryType === 'delivery' && styles.toggleBtnActive,
                ]}
                onPress={() => setDeliveryType('delivery')}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="moped"
                  size={18}
                  color={deliveryType === 'delivery' ? Colors.card : Colors.textSecondary}
                />
                <Text
                  style={[
                    styles.toggleBtnText,
                    deliveryType === 'delivery' && styles.toggleBtnTextActive,
                  ]}
                >
                  Delivery (15-20m)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  deliveryType === 'pickup' && styles.toggleBtnActive,
                ]}
                onPress={() => setDeliveryType('pickup')}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="storefront-outline"
                  size={18}
                  color={deliveryType === 'pickup' ? Colors.card : Colors.textSecondary}
                />
                <Text
                  style={[
                    styles.toggleBtnText,
                    deliveryType === 'pickup' && styles.toggleBtnTextActive,
                  ]}
                >
                  Takeaway / Pickup
                </Text>
              </TouchableOpacity>
            </View>

            {/* Cart Items List */}
            <View style={styles.itemsSection}>
              <Text style={styles.sectionHeader}>Selected Drinks & Treats</Text>

              {cartItems.map((item) => (
                <View key={item.id} style={styles.cartItemCard}>
                  <Image source={{ uri: item.product.image }} style={styles.itemImage} />

                  <View style={styles.itemInfo}>
                    <View style={styles.itemHeaderRow}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.product.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeFromCart(item.id)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Feather name="trash-2" size={16} color={Colors.textMuted} />
                      </TouchableOpacity>
                    </View>

                    {/* Customization Details Summary */}
                    <Text style={styles.itemCustoms} numberOfLines={2}>
                      {item.size?.name || 'Standard'}
                      {item.milk ? ` • ${item.milk.name}` : ''}
                      {item.ice ? ` • ${item.ice}` : ''}
                      {item.sweetness ? ` • ${item.sweetness}` : ''}
                    </Text>

                    {item.toppings && item.toppings.length > 0 && (
                      <Text style={styles.itemToppings} numberOfLines={1}>
                        + {item.toppings.map((t) => t.name).join(', ')}
                      </Text>
                    )}

                    {/* Quantity Stepper & Price Row */}
                    <View style={styles.itemFooterRow}>
                      <Text style={styles.itemPrice}>
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </Text>

                      <View style={styles.stepper}>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => updateQuantity(item.id, -1)}
                        >
                          <Feather name="minus" size={14} color={Colors.primary} />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => updateQuantity(item.id, 1)}
                        >
                          <Feather name="plus" size={14} color={Colors.primary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Promo Voucher Section */}
            <View style={styles.promoSection}>
              <Text style={styles.sectionHeader}>Promo & Discounts</Text>

              {appliedPromo ? (
                <View style={styles.appliedPromoCard}>
                  <View style={styles.appliedPromoLeft}>
                    <MaterialCommunityIcons name="tag-check" size={22} color={Colors.success} />
                    <View style={{ marginLeft: 8 }}>
                      <Text style={styles.appliedPromoCode}>{appliedPromo.code}</Text>
                      <Text style={styles.appliedPromoDesc}>{appliedPromo.description}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={removePromo} style={styles.removePromoBtn}>
                    <Feather name="x" size={18} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.promoInputRow}>
                  <TextInput
                    style={styles.promoInput}
                    placeholder="Enter code (e.g. COFFEE20)"
                    placeholderTextColor={Colors.textMuted}
                    value={promoInput}
                    onChangeText={setPromoInput}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={handleApplyPromo}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.applyBtnText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Bill Details / Receipt */}
            <View style={styles.billSection}>
              <Text style={styles.sectionHeader}>Payment Summary</Text>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Subtotal</Text>
                <Text style={styles.billValue}>${subtotal.toFixed(2)}</Text>
              </View>

              {discount > 0 && (
                <View style={styles.billRow}>
                  <Text style={[styles.billLabel, { color: Colors.success }]}>
                    Promo Discount ({appliedPromo?.code})
                  </Text>
                  <Text style={[styles.billValue, { color: Colors.success }]}>
                    -${discount.toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>
                  {deliveryType === 'delivery' ? 'Delivery Fee' : 'Store Pickup Fee'}
                </Text>
                <Text style={styles.billValue}>
                  {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                </Text>
              </View>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Estimated Tax & Service</Text>
                <Text style={styles.billValue}>${serviceTax.toFixed(2)}</Text>
              </View>

              <View style={styles.billDivider} />

              <View style={styles.billTotalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Sticky Checkout Bar */}
          <View style={styles.stickyBar}>
            <View>
              <Text style={styles.stickyTotalLabel}>Total to Pay</Text>
              <Text style={styles.stickyTotalValue}>${total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={onProceedToCheckout}
              activeOpacity={0.88}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
              <Feather name="arrow-right" size={18} color={Colors.card} />
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    paddingBottom: 110,
  },
  deliveryToggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSubtle,
    borderRadius: BorderRadius.full,
    padding: 4,
    marginVertical: Spacing.md,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
    ...Shadows.small,
  },
  toggleBtnText: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  toggleBtnTextActive: {
    color: Colors.card,
  },
  sectionHeader: {
    fontSize: Typography.titleSmall,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    letterSpacing: -0.2,
  },
  itemsSection: {
    marginVertical: Spacing.sm,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.small,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    resizeMode: 'cover',
  },
  itemInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'space-between',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: Typography.bodyLarge,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  itemCustoms: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  itemToppings: {
    fontSize: 10,
    color: Colors.accent,
    fontWeight: '600',
    marginTop: 1,
  },
  itemFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  itemPrice: {
    fontSize: Typography.bodyLarge,
    fontWeight: '800',
    color: Colors.primary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSubtle,
    borderRadius: BorderRadius.full,
    padding: 2,
    gap: 8,
  },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: Typography.bodySmall,
    fontWeight: '800',
    color: Colors.primary,
    minWidth: 16,
    textAlign: 'center',
  },
  promoSection: {
    marginVertical: Spacing.sm,
  },
  promoInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  promoInput: {
    flex: 1,
    height: 46,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.bodyMedium,
    color: Colors.textPrimary,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    height: 46,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: Colors.card,
    fontSize: Typography.bodySmall,
    fontWeight: '700',
  },
  appliedPromoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.accentLight,
  },
  appliedPromoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appliedPromoCode: {
    fontSize: Typography.bodyMedium,
    fontWeight: '800',
    color: Colors.primary,
  },
  appliedPromoDesc: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  removePromoBtn: {
    padding: 6,
  },
  billSection: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.small,
  },
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
  },
  billValue: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  billDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
  },
  billTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: Typography.bodyLarge,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: Typography.titleMedium,
    fontWeight: '800',
    color: Colors.primary,
  },
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.large,
  },
  stickyTotalLabel: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
  },
  stickyTotalValue: {
    fontSize: Typography.titleSmall,
    fontWeight: '800',
    color: Colors.primary,
  },
  checkoutBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    ...Shadows.medium,
  },
  checkoutBtnText: {
    color: Colors.card,
    fontSize: Typography.bodyMedium,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.titleMedium,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: Typography.bodyMedium,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    gap: 8,
    ...Shadows.medium,
  },
  exploreBtnText: {
    color: Colors.card,
    fontSize: Typography.bodyMedium,
    fontWeight: '700',
  },
});
