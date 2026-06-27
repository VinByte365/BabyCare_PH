/**
 * BabyGuide PH — Forgot Password Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Button, Card } from '../../components';
import type { AuthScreenProps } from '../../navigation/types';

export function ForgotPasswordScreen({ navigation }: AuthScreenProps<'ForgotPassword'>) {
  const { theme } = useTheme();
  const { colors, spacing, typography: t, radii } = theme;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Validation Error', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert(
        'Email Sent',
        'If this email is registered in our system, you will receive password reset instructions shortly.',
        [{ text: 'Back to Login', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Back button */}
        <View style={[styles.headerRow, { paddingHorizontal: spacing.md }]}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={[styles.backBtn, { height: 44, width: 44, justifyContent: 'center' }]}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingHorizontal: spacing.xl }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={[styles.header, { marginTop: spacing.md, marginBottom: spacing.xl }]}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: colors.accent + '15',
                  borderColor: colors.accent + '30',
                  borderRadius: radii.full,
                  borderWidth: 1.5,
                  marginBottom: spacing.md,
                },
              ]}
            >
              <Ionicons name="key-outline" size={32} color={colors.accent} />
            </View>
            <Text
              style={{
                fontFamily: t.heading1.fontFamily,
                fontSize: t.heading1.fontSize,
                color: colors.textPrimary,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Reset Password
            </Text>
            <Text
              style={{
                fontFamily: t.body.fontFamily,
                fontSize: t.bodySmall.fontSize,
                color: colors.textSecondary,
                marginTop: 4,
                textAlign: 'center',
              }}
            >
              Enter your email and we'll send instructions to reset your password
            </Text>
          </View>

          {/* Form Card */}
          <Card elevated style={{ padding: spacing.lg, marginBottom: spacing.xl }}>
            {/* Email Input */}
            <Text
              style={{
                fontFamily: t.bodyBold.fontFamily,
                fontSize: t.bodySmall.fontSize,
                color: colors.textPrimary,
                marginBottom: spacing.xs,
              }}
            >
              Email Address
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: colors.border,
                  borderRadius: radii.sm,
                  backgroundColor: colors.backgroundSecondary,
                  marginBottom: spacing.lg,
                },
              ]}
            >
              <Ionicons name="mail-outline" size={20} color={colors.placeholder} style={{ marginRight: 8 }} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, { color: colors.textPrimary, fontFamily: t.body.fontFamily }]}
              />
            </View>

            {/* Submit Button */}
            <Button
              title="Send Instructions"
              onPress={handleReset}
              loading={loading}
              fullWidth
            />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    paddingTop: 8,
  },
  backBtn: {},
  scroll: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
});
