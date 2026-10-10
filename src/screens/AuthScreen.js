import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen({ initialMode = 'login', onTriggerOtp, onBackToSplash }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const { login, signup, requestPasswordReset, resetPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetPasswordValue, setResetPasswordValue] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleLoginSubmit = async () => {
    if (!loginEmail.trim() || !loginPassword) {
      Alert.alert('Required', 'Please enter your email and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      await login(loginEmail.trim(), loginPassword, rememberMe);
    } catch (error) {
      Alert.alert('Sign-in failed', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async () => {
    if (!signupName.trim() || !signupEmail.trim() || signupPassword.length < 8) {
      Alert.alert('Incomplete Form', 'Enter your name and email, and choose a password with at least 8 characters.');
      return;
    }
    if (!agreeTerms) {
      Alert.alert('Terms required', 'Please agree to the Terms of Service and Privacy Policy.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await signup(signupName.trim(), signupEmail.trim(), signupPhone.trim(), signupPassword);
      onTriggerOtp(signupEmail.trim(), response.verificationCode);
    } catch (error) {
      Alert.alert('Account creation failed', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestReset = async () => {
    if (!resetEmail.trim()) {
      Alert.alert('Email required', 'Enter the email address for your account.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await requestPasswordReset(resetEmail.trim());
      Alert.alert('Check your email', response.message);
    } catch (error) {
      Alert.alert('Could not send reset code', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (resetCode.trim().length !== 6 || resetPasswordValue.length < 8) {
      Alert.alert('Details required', 'Enter the 6-digit code and a password with at least 8 characters.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await resetPassword(resetEmail.trim(), resetCode.trim(), resetPasswordValue);
      Alert.alert('Password changed', response.message);
      setIsResetOpen(false);
      setLoginEmail(resetEmail.trim());
      setLoginPassword('');
      setResetCode('');
      setResetPasswordValue('');
    } catch (error) {
      Alert.alert('Could not reset password', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Bar with back to splash */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackToSplash}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color={Colors.primary} />
            </TouchableOpacity>

            <View style={styles.brandHeader}>
              <MaterialCommunityIcons name="coffee" size={24} color={Colors.accentGold} />
              <Text style={styles.brandTitle}>Café Bliss</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          {/* Decorative Coffee Banner Header */}
          <View style={styles.bannerWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
              }}
              style={styles.bannerImage}
            />
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerHeading}>
                {mode === 'login' ? 'Welcome Back!' : 'Join Our Coffee Club'}
              </Text>
              <Text style={styles.bannerSubheading}>
                {mode === 'login'
                  ? 'Your handcrafted cup is just a click away.'
                  : 'Earn beans with every order & unlock free drinks.'}
              </Text>
            </View>
          </View>

          {/* Segmented Mode Switcher */}
          <View style={styles.switcherContainer}>
            <TouchableOpacity
              style={[styles.switcherTab, mode === 'login' && styles.switcherTabActive]}
              onPress={() => setMode('login')}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.switcherText, mode === 'login' && styles.switcherTextActive]}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.switcherTab, mode === 'signup' && styles.switcherTabActive]}
              onPress={() => setMode('signup')}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.switcherText, mode === 'signup' && styles.switcherTextActive]}
              >
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Forms */}
          {mode === 'login' ? (
            <View style={styles.formContainer}>
              {/* Email / Username */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="mail" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={Colors.textMuted}
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="lock" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={!showLoginPassword}
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowLoginPassword(!showLoginPassword)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={showLoginPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={Colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Remember me & Forgot Password */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberRow}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={rememberMe ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={rememberMe ? Colors.primary : Colors.textMuted}
                  />
                  <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setResetEmail(loginEmail);
                    setIsResetOpen(true);
                  }}
                >
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              {/* Sign In Primary CTA */}
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleLoginSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnText}>{isSubmitting ? 'Signing In...' : 'Sign In'}</Text>
                <Feather name="arrow-right" size={18} color={Colors.card} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formContainer}>
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="user" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Alex Henderson"
                    placeholderTextColor={Colors.textMuted}
                    value={signupName}
                    onChangeText={setSignupName}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="mail" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="alex@example.com"
                    placeholderTextColor={Colors.textMuted}
                    value={signupEmail}
                    onChangeText={setSignupEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="phone" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="+1 (555) 000-0000"
                    placeholderTextColor={Colors.textMuted}
                    value={signupPhone}
                    onChangeText={setSignupPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Create Password</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="lock" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="At least 8 characters"
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={!showSignupPassword}
                    maxLength={72}
                    value={signupPassword}
                    onChangeText={setSignupPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowSignupPassword(!showSignupPassword)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={showSignupPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={Colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms check */}
              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => setAgreeTerms(!agreeTerms)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={agreeTerms ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={agreeTerms ? Colors.primary : Colors.textMuted}
                />
                <Text style={styles.termsText}>
                  I agree to the <Text style={styles.termsBold}>Terms of Service</Text> & Privacy Policy.
                </Text>
              </TouchableOpacity>

              {/* Sign Up CTA */}
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSignupSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnText}>{isSubmitting ? 'Creating Account...' : 'Create Account'}</Text>
                <Feather name="check" size={18} color={Colors.card} />
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
      <Modal visible={isResetOpen} transparent animationType="fade" onRequestClose={() => setIsResetOpen(false)}>
        <View style={styles.resetOverlay}>
          <View style={styles.resetCard}>
            <Text style={styles.resetTitle}>Reset your password</Text>
            <Text style={styles.resetDescription}>Request a one-time code by email, then choose a new password.</Text>
            <TextInput
              style={styles.resetInput}
              placeholder="Email address"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={resetEmail}
              onChangeText={setResetEmail}
            />
            <TouchableOpacity style={styles.resetSecondaryButton} onPress={handleRequestReset} disabled={isSubmitting}>
              <Text style={styles.resetSecondaryText}>Send reset code</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.resetInput}
              placeholder="6-digit code"
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
              maxLength={6}
              value={resetCode}
              onChangeText={setResetCode}
            />
            <TextInput
              style={styles.resetInput}
              placeholder="New password (8+ characters)"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
              maxLength={72}
              value={resetPasswordValue}
              onChangeText={setResetPasswordValue}
            />
            <TouchableOpacity style={styles.resetPrimaryButton} onPress={handleResetPassword} disabled={isSubmitting}>
              <Text style={styles.resetPrimaryText}>{isSubmitting ? 'Please wait...' : 'Change password'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsResetOpen(false)}>
              <Text style={styles.resetCancelText}>Cancel</Text>
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
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: Typography.titleSmall,
    fontWeight: '800',
    color: Colors.primary,
  },
  bannerWrapper: {
    height: 120,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginVertical: Spacing.md,
    position: 'relative',
    ...Shadows.medium,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 20, 7, 0.72)',
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  bannerHeading: {
    fontSize: Typography.titleMedium,
    fontWeight: '800',
    color: Colors.card,
  },
  bannerSubheading: {
    fontSize: Typography.bodySmall,
    color: Colors.accentLight,
    marginTop: 4,
  },
  switcherContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSubtle,
    borderRadius: BorderRadius.full,
    padding: 4,
    marginVertical: Spacing.md,
  },
  switcherTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: BorderRadius.full,
  },
  switcherTabActive: {
    backgroundColor: Colors.primary,
    ...Shadows.small,
  },
  switcherText: {
    fontSize: Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  switcherTextActive: {
    color: Colors.card,
  },
  formContainer: {
    marginTop: Spacing.sm,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 50,
    ...Shadows.small,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: Typography.bodyMedium,
    color: Colors.textPrimary,
  },
  eyeBtn: {
    padding: 6,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Spacing.sm,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rememberText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  forgotText: {
    fontSize: Typography.bodySmall,
    color: Colors.accent,
    fontWeight: '700',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: Spacing.md,
  },
  termsText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
  },
  termsBold: {
    color: Colors.primary,
    fontWeight: '700',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
    gap: 8,
    ...Shadows.medium,
  },
  submitBtnText: {
    fontSize: Typography.bodyLarge,
    fontWeight: '800',
    color: Colors.card,
  },
  socialSection: {
    marginTop: Spacing.lg,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  socialButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingVertical: 12,
    gap: 8,
    ...Shadows.small,
  },
  socialBtnText: {
    fontSize: Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  resetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(35, 20, 7, 0.65)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  resetCard: {
    padding: Spacing.xl,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },
  resetTitle: {
    fontSize: Typography.titleSmall,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  resetDescription: {
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  resetInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  resetSecondaryButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
  },
  resetSecondaryText: {
    color: Colors.accent,
    fontWeight: '700',
  },
  resetPrimaryButton: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
  },
  resetPrimaryText: {
    color: Colors.card,
    fontWeight: '700',
  },
  resetCancelText: {
    alignSelf: 'center',
    color: Colors.textMuted,
    padding: Spacing.sm,
  },
});
