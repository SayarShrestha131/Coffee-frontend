import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

export default function SplashScreen({ onGetStarted, onSignIn }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.safeArea}>
            {/* Top Brand Logo */}
            <View style={styles.brandContainer}>
              <View style={styles.logoCircle}>
                <MaterialCommunityIcons name="coffee-maker" size={32} color={Colors.accentGold} />
              </View>
              <Text style={styles.brandTitle}>Café Bliss</Text>
              <Text style={styles.brandSubtitle}>ARTISANAL COFFEE ROASTERS</Text>
            </View>

            {/* Bottom Content Card */}
            <View style={styles.bottomCard}>
              <View style={styles.badgeRow}>
                <View style={styles.miniBadge}>
                  <MaterialCommunityIcons name="seed" size={14} color={Colors.accentGold} />
                  <Text style={styles.miniBadgeText}>100% Arabica</Text>
                </View>
                <View style={styles.miniBadge}>
                  <MaterialCommunityIcons name="lightning-bolt" size={14} color={Colors.accentGold} />
                  <Text style={styles.miniBadgeText}>15-Min Delivery</Text>
                </View>
              </View>

              <Text style={styles.headline}>
                Fall in Love with Coffee in Every Sip
              </Text>
              <Text style={styles.description}>
                Experience handcrafted espressos, cold brews, and fresh pastries tailored precisely to your taste.
              </Text>

              {/* Action Buttons */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={onGetStarted}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
                <Feather name="arrow-right" size={20} color={Colors.card} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onSignIn}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryText}>
                  Already have an account? <Text style={styles.signInLink}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(25, 14, 6, 0.68)',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  brandTitle: {
    fontSize: Typography.titleLarge,
    fontWeight: '800',
    color: Colors.card,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accentGold,
    letterSpacing: 2,
    marginTop: 2,
  },
  bottomCard: {
    backgroundColor: 'rgba(43, 26, 14, 0.88)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.25)',
    ...Shadows.large,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  miniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 163, 115, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  miniBadgeText: {
    color: Colors.accentGold,
    fontSize: 11,
    fontWeight: '700',
  },
  headline: {
    fontSize: Typography.hero,
    fontWeight: '800',
    color: Colors.card,
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: Typography.bodyMedium,
    color: Colors.accentLight,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadows.medium,
  },
  primaryButtonText: {
    color: Colors.card,
    fontSize: Typography.bodyLarge,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingVertical: 6,
  },
  secondaryText: {
    color: Colors.accentLight,
    fontSize: Typography.bodySmall,
  },
  signInLink: {
    color: Colors.accentGold,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
