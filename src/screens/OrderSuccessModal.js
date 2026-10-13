import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

export default function OrderSuccessModal({
  visible,
  order,
  onTrackOrder,
  onBackToHome,
}) {
  if (!order) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Animated celebration icon */}
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="coffee" size={36} color={Colors.card} />
            <View style={styles.checkBadge}>
              <Ionicons name="checkmark" size={16} color="#FFF" />
            </View>
          </View>

          <Text style={styles.title}>Order Confirmed!</Text>
          <Text style={styles.orderIdBadge}>Order #{order.orderId}</Text>

          <Text style={styles.message}>
            Our head barista has received your order and is currently grinding the beans and steaming the milk.
          </Text>

          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Paid</Text>
              <Text style={styles.summaryVal}>रू{order.total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated Time</Text>
              <Text style={styles.summaryVal}>{order.estimatedTime}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Method</Text>
              <Text style={styles.summaryVal}>{order.paymentMethod}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onTrackOrder}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Track Order Live</Text>
            <Feather name="arrow-right" size={18} color={Colors.card} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={onBackToHome}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(35, 20, 7, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.large,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: Spacing.md,
    ...Shadows.medium,
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.success,
    width: 26,
    height: 26,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.card,
  },
  title: {
    fontSize: Typography.titleSmall,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  orderIdBadge: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.accent,
    backgroundColor: Colors.cardSecondary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginTop: 6,
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  summaryBox: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
  },
  summaryVal: {
    fontSize: Typography.caption,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },
  primaryBtnText: {
    color: Colors.card,
    fontSize: Typography.bodyMedium,
    fontWeight: '700',
  },
  secondaryBtn: {
    paddingVertical: 8,
  },
  secondaryBtnText: {
    color: Colors.accent,
    fontSize: Typography.bodySmall,
    fontWeight: '700',
  },
});
