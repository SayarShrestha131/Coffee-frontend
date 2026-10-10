import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

export default function OtpModal({ visible, email, developmentCode, onVerify, onResend, onClose }) {
  const [currentDevelopmentCode, setCurrentDevelopmentCode] = useState(developmentCode);
  const [pin, setPin] = useState(
    developmentCode ? developmentCode.split('') : ['', '', '', '', '', '']
  );
  const [isBusy, setIsBusy] = useState(false);
  const inputsRef = useRef([]);

  const handleChange = (text, index) => {
    const newPin = [...pin];
    newPin[index] = '';
    const digits = text.replace(/\D/g, '').slice(0, pin.length - index);
    digits.split('').forEach((digit, offset) => {
      newPin[index + offset] = digit;
    });
    setPin(newPin);

    if (digits && index + digits.length < pin.length) {
      inputsRef.current[index + digits.length]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleConfirm = async () => {
    const code = pin.join('');
    if (code.length !== pin.length) {
      Alert.alert('Verification code required', 'Enter all 6 digits from the email.');
      return;
    }
    setIsBusy(true);
    try {
      await onVerify(code);
    } catch (error) {
      Alert.alert('Verification failed', error.message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleResend = async () => {
    setIsBusy(true);
    try {
      const response = await onResend();
      if (response.verificationCode) {
        setCurrentDevelopmentCode(response.verificationCode);
        setPin(response.verificationCode.split(''));
      } else {
        setPin(['', '', '', '', '', '']);
      }
      Alert.alert(
        response.verificationCode ? 'Code refreshed' : 'Code sent',
        response.verificationCode
          ? 'Use the refreshed development code shown above.'
          : 'Check your email for a new verification code.'
      );
    } catch (error) {
      Alert.alert('Could not resend code', error.message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          {/* Verification Badge */}
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="shield-check" size={32} color={Colors.accentGold} />
          </View>

          <Text style={styles.title}>Verify Your Account</Text>
          <Text style={styles.subtitle}>
            {currentDevelopmentCode
              ? 'Local development mode: enter this verification code.'
              : 'Enter the 6-digit verification code sent to'}
            {'\n'}
            <Text style={styles.emailHighlight}>{email || 'your email'}</Text>
            {currentDevelopmentCode ? (
              <>
                {'\n'}
                <Text style={styles.emailHighlight}>{currentDevelopmentCode}</Text>
              </>
            ) : null}
          </Text>

          {/* 6 Digit Inputs */}
          <View style={styles.pinRow}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputsRef.current[index] = ref)}
                style={[
                  styles.pinBox,
                  pin[index] ? styles.pinBoxFilled : null,
                ]}
                keyboardType="number-pad"
                maxLength={6}
                value={pin[index]}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                autoFocus={index === 0}
              />
            ))}
          </View>

          {/* Resend Link */}
          <View style={styles.resendRow}>
            <Text style={styles.resendText}>Didn&apos;t receive the code? </Text>
            <TouchableOpacity onPress={handleResend} disabled={isBusy}>
              <Text style={styles.resendLink}>Resend</Text>
            </TouchableOpacity>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.verifyBtn}
            onPress={handleConfirm}
            disabled={isBusy}
            activeOpacity={0.85}
          >
            <Text style={styles.verifyBtnText}>{isBusy ? 'Please wait...' : 'Verify & Proceed'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(35, 20, 7, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    position: 'relative',
    ...Shadows.large,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 6,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.titleSmall,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: Spacing.xl,
    lineHeight: 18,
  },
  emailHighlight: {
    fontWeight: '700',
    color: Colors.primary,
  },
  pinRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  pinBox: {
    width: 40,
    height: 52,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    fontSize: Typography.titleMedium,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
  },
  pinBoxFilled: {
    borderColor: Colors.accent,
    backgroundColor: Colors.card,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  resendText: {
    fontSize: Typography.bodySmall,
    color: Colors.textMuted,
  },
  resendLink: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.accent,
  },
  verifyBtn: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    ...Shadows.small,
  },
  verifyBtnText: {
    fontSize: Typography.bodyLarge,
    fontWeight: '700',
    color: Colors.card,
  },
});
