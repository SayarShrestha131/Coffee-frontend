import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutScreen({ onBack, onOrderSuccess }) {
  const { total, deliveryType, placeOrder } = useCart();
  const { user } = useAuth();

  const [address, setAddress] = useState(user.savedAddress);
  const [selectedPayment, setSelectedPayment] = useState('apple_pay');
  const [selectedTip, setSelectedTip] = useState(2.0); // $2 tip default
  const [note, setNote] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const paymentOptions = [
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      subtitle: 'Fast 1-touch checkout',
      icon: 'logo-apple',
      iconColor: '#000',
    },
    {
      id: 'credit_card',
      name: 'Visa •••• 4242',
      subtitle: 'Expires 08/28',
      icon: 'card-outline',
      iconColor: '#1A1F71',
    },
    {
      id: 'wallet',
      name: 'Café Bliss Wallet',
      subtitle: '$45.50 balance available',
      icon: 'wallet-outline',
      iconColor: Colors.accent,
    },
    {
      id: 'cash',
      name: 'Cash on Hand',
      subtitle: 'Pay directly on delivery',
      icon: 'cash-outline',
      iconColor: Colors.success,
    },
  ];

  const tipOptions = [
    { label: 'No Tip', value: 0 },
    { label: '$1.00', value: 1.0 },
    { label: '$2.00', value: 2.0 },
    { label: '$3.00', value: 3.0 },
  ];

  const grandTotal = parseFloat((total + selectedTip).toFixed(2));

  const handlePlaceOrder = async () => {
    if (deliveryType === 'delivery' && !address.trim()) {
      Alert.alert('Delivery address required', 'Enter a delivery address before placing the order.');
      return;
    }
    setIsPlacingOrder(true);
    try {
      const order = await placeOrder({
        address,
        paymentMethod:
          paymentOptions.find((p) => p.id === selectedPayment)?.name || 'Apple Pay',
        note,
        tip: selectedTip,
      });
      onOrderSuccess(order);
    } catch (error) {
      Alert.alert('Could not place order', error.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Checkout" subtitle="Final Step" showBack={true} onBack={onBack} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery / Pickup Address Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons
                name={deliveryType === 'delivery' ? 'location-sharp' : 'storefront'}
                size={20}
                color={Colors.accent}
              />
              <Text style={styles.cardHeaderTitle}>
                {deliveryType === 'delivery' ? 'Delivery Address' : 'Pickup Store'}
              </Text>
            </View>
            {deliveryType === 'delivery' && <Text style={styles.editLink}>Edit below</Text>}
          </View>

          {deliveryType === 'delivery' ? (
            <TextInput
              style={styles.addressText}
              placeholder="Enter your delivery address"
              placeholderTextColor={Colors.textMuted}
              value={address}
              onChangeText={setAddress}
              multiline
              maxLength={250}
            />
          ) : (
            <Text style={styles.addressText}>Café Bliss Flagship • 452 Broadway, SoHo, New York</Text>
          )}

          <View style={styles.deliveryEstimateBadge}>
            <MaterialCommunityIcons name="clock-fast" size={16} color={Colors.accent} />
            <Text style={styles.estimateText}>
              Estimated {deliveryType === 'delivery' ? 'Arrival' : 'Ready'}: 15 - 20 minutes
            </Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="card" size={20} color={Colors.accent} />
              <Text style={styles.cardHeaderTitle}>Payment Method</Text>
            </View>
          </View>

          <View style={styles.paymentList}>
            {paymentOptions.map((opt) => {
              const isSelected = selectedPayment === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.paymentOption,
                    isSelected && styles.paymentOptionSelected,
                  ]}
                  onPress={() => setSelectedPayment(opt.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.paymentIconBox}>
                    <Ionicons name={opt.icon} size={22} color={opt.iconColor} />
                  </View>

                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.paymentName}>{opt.name}</Text>
                    <Text style={styles.paymentSub}>{opt.subtitle}</Text>
                  </View>

                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={isSelected ? Colors.primary : Colors.textMuted}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Barista Tip */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <MaterialCommunityIcons name="coffee-to-go" size={20} color={Colors.accent} />
              <Text style={styles.cardHeaderTitle}>Tip Your Barista</Text>
            </View>
          </View>
          <Text style={styles.tipSub}>Show appreciation for the artisan brew team</Text>

          <View style={styles.tipRow}>
            {tipOptions.map((tip) => {
              const isSelected = selectedTip === tip.value;
              return (
                <TouchableOpacity
                  key={tip.label}
                  style={[styles.tipPill, isSelected && styles.tipPillSelected]}
                  onPress={() => setSelectedTip(tip.value)}
                >
                  <Text
                    style={[styles.tipText, isSelected && styles.tipTextSelected]}
                  >
                    {tip.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Special Instructions Note */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>Special Instructions</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="e.g. Please leave at front desk, extra napkins..."
            placeholderTextColor={Colors.textMuted}
            value={note}
            onChangeText={setNote}
            multiline
            maxLength={500}
          />
        </View>
      </ScrollView>

      {/* Sticky Bottom Place Order Bar */}
      <View style={styles.stickyBar}>
        <View>
          <Text style={styles.totalLabel}>Total to Pay</Text>
          <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.placeOrderBtn}
          onPress={handlePlaceOrder}
          activeOpacity={0.88}
        >
          <Text style={styles.placeOrderBtnText}>{isPlacingOrder ? 'Placing Order...' : 'Place Order'}</Text>
          <Ionicons name="checkmark-circle" size={20} color={Colors.card} />
        </TouchableOpacity>
      </View>
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
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.small,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderTitle: {
    fontSize: Typography.bodyLarge,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  editLink: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.accent,
  },
  addressText: {
    fontSize: Typography.bodyMedium,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: 2,
  },
  deliveryEstimateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSubtle,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 6,
    marginTop: Spacing.md,
  },
  estimateText: {
    fontSize: Typography.caption,
    fontWeight: '700',
    color: Colors.accent,
  },
  paymentList: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.card,
  },
  paymentOptionSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.cardSecondary,
  },
  paymentIconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentName: {
    fontSize: Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  paymentSub: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 1,
  },
  tipSub: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  tipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tipPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tipPillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tipText: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  tipTextSelected: {
    color: Colors.card,
  },
  noteInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    minHeight: 70,
    marginTop: Spacing.sm,
    fontSize: Typography.bodyMedium,
    color: Colors.textPrimary,
    textAlignVertical: 'top',
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
  totalLabel: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
  },
  totalValue: {
    fontSize: Typography.titleSmall,
    fontWeight: '800',
    color: Colors.primary,
  },
  placeOrderBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    ...Shadows.medium,
  },
  placeOrderBtnText: {
    color: Colors.card,
    fontSize: Typography.bodyMedium,
    fontWeight: '800',
  },
});
