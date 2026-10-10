import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';

export default function OrderTrackingScreen({ onBack, onGoHome }) {
  const { lastPlacedOrder, orderHistory } = useCart();
  const order = lastPlacedOrder || orderHistory[0] || {
    orderId: 'CF-8924',
    date: 'Just now',
    total: 12.80,
    items: [],
    deliveryType: 'delivery',
    address: '452 Broadway, SoHo, NY',
    status: 'Brewing',
    estimatedTime: '14 mins',
  };

  const [currentStep, setCurrentStep] = useState(1); // 0: placed, 1: brewing, 2: courier, 3: delivered
  const [minutesLeft, setMinutesLeft] = useState(14);

  // simulate countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setMinutesLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      title: 'Order Confirmed',
      subtitle: 'Barista received your ticket',
      icon: 'receipt-outline',
    },
    {
      title: 'Beans Grinding & Brewing',
      subtitle: 'Crafting espresso & frothing milk',
      icon: 'cafe-outline',
    },
    {
      title: 'On the Way',
      subtitle: 'Courier dispatched with hot bag',
      icon: 'bicycle-outline',
    },
    {
      title: 'Delivered',
      subtitle: 'Enjoy your freshly crafted cup!',
      icon: 'checkmark-done-outline',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={`Order #${order.orderId}`}
        subtitle="Live Order Status"
        showBack={true}
        onBack={onBack}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Estimated Time Hero Box */}
        <View style={styles.timeCard}>
          <View style={styles.timeBadge}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={Colors.accentGold} />
            <Text style={styles.timeBadgeText}>ESTIMATED ARRIVAL</Text>
          </View>
          <Text style={styles.timeHero}>{minutesLeft} Minutes</Text>
          <Text style={styles.timeSub}>
            Your hot coffee is being kept in a thermal travel pouch.
          </Text>

          {/* Quick step advancement simulator */}
          <View style={styles.simRow}>
            <TouchableOpacity
              style={styles.simBtn}
              onPress={() => setCurrentStep((prev) => (prev < 3 ? prev + 1 : 0))}
            >
              <Text style={styles.simBtnText}>
                Simulate Next Stage ({currentStep + 1}/4)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Multi-Step Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.cardTitle}>Preparation Progress</Text>

          <View style={styles.timelineList}>
            {steps.map((step, idx) => {
              const isPassed = idx < currentStep;
              const isCurrent = idx === currentStep;
              const isUpcoming = idx > currentStep;

              return (
                <View key={step.title} style={styles.timelineItem}>
                  {/* Left Icon / Line Column */}
                  <View style={styles.stepIndicatorCol}>
                    <View
                      style={[
                        styles.stepDot,
                        isPassed && styles.stepDotPassed,
                        isCurrent && styles.stepDotCurrent,
                      ]}
                    >
                      <Ionicons
                        name={isPassed ? 'checkmark' : step.icon}
                        size={16}
                        color={isUpcoming ? Colors.textMuted : Colors.card}
                      />
                    </View>
                    {idx < steps.length - 1 && (
                      <View
                        style={[
                          styles.stepLine,
                          isPassed && styles.stepLinePassed,
                        ]}
                      />
                    )}
                  </View>

                  {/* Right Content */}
                  <View style={styles.stepContent}>
                    <Text
                      style={[
                        styles.stepTitle,
                        isCurrent && styles.stepTitleCurrent,
                        isUpcoming && styles.stepTitleUpcoming,
                      ]}
                    >
                      {step.title}
                    </Text>
                    <Text style={styles.stepSub}>{step.subtitle}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Courier / Barista Card */}
        <View style={styles.courierCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
            }}
            style={styles.courierAvatar}
          />
          <View style={styles.courierInfo}>
            <Text style={styles.courierName}>Marcus Vance</Text>
            <Text style={styles.courierRole}>Master Barista & Express Courier</Text>
            <View style={styles.courierRating}>
              <Ionicons name="star" size={12} color={Colors.star} />
              <Text style={styles.courierRatingText}>4.9 (1.2k deliveries)</Text>
            </View>
          </View>

          <View style={styles.courierActions}>
            <TouchableOpacity
              style={styles.actionCircle}
              onPress={() => Alert.alert('Calling Courier', 'Connecting to Marcus (+1-555-0192)...')}
            >
              <Feather name="phone" size={18} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCircle}
              onPress={() => Alert.alert('Chat Support', 'Marcus: "I am packing your oat milk latte now!"')}
            >
              <Feather name="message-circle" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Destination Card */}
        <View style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <Ionicons name="location-sharp" size={18} color={Colors.accent} />
            <Text style={styles.addressHeaderTitle}>Delivery Destination</Text>
          </View>
          <Text style={styles.addressDetail}>{order.address}</Text>
        </View>

        {/* Back to Home Button */}
        <TouchableOpacity style={styles.homeBtn} onPress={onGoHome} activeOpacity={0.85}>
          <Text style={styles.homeBtnText}>Return to Home</Text>
          <Feather name="arrow-right" size={18} color={Colors.card} />
        </TouchableOpacity>
      </ScrollView>
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
  timeCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.medium,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 163, 115, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 6,
    marginBottom: Spacing.xs,
  },
  timeBadgeText: {
    color: Colors.accentGold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  timeHero: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.card,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  timeSub: {
    fontSize: Typography.bodySmall,
    color: Colors.accentLight,
    textAlign: 'center',
    marginTop: 4,
  },
  simRow: {
    marginTop: Spacing.md,
  },
  simBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  simBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  timelineCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.small,
  },
  cardTitle: {
    fontSize: Typography.bodyLarge,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  timelineList: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 58,
  },
  stepIndicatorCol: {
    alignItems: 'center',
    width: 32,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotPassed: {
    backgroundColor: Colors.success,
  },
  stepDotCurrent: {
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.accentGold,
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 2,
  },
  stepLinePassed: {
    backgroundColor: Colors.success,
  },
  stepContent: {
    flex: 1,
    marginLeft: Spacing.md,
    paddingBottom: Spacing.md,
  },
  stepTitle: {
    fontSize: Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  stepTitleCurrent: {
    color: Colors.primary,
    fontWeight: '800',
  },
  stepTitleUpcoming: {
    color: Colors.textMuted,
  },
  stepSub: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  courierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.small,
  },
  courierAvatar: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.full,
  },
  courierInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  courierName: {
    fontSize: Typography.bodyLarge,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  courierRole: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 1,
  },
  courierRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  courierRatingText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  courierActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionCircle: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  addressHeaderTitle: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.accent,
  },
  addressDetail: {
    fontSize: Typography.bodyMedium,
    color: Colors.textPrimary,
    marginLeft: 24,
  },
  homeBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
    ...Shadows.medium,
  },
  homeBtnText: {
    color: Colors.card,
    fontSize: Typography.bodyMedium,
    fontWeight: '700',
  },
});
