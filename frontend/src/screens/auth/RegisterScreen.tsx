/**
 * BabyGuide PH — Register Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Button, Card, Chip } from '../../components';
import { useAuthStore } from '../../stores/authStore';
import type { AuthScreenProps } from '../../navigation/types';

export function RegisterScreen({ navigation }: AuthScreenProps<'Register'>) {
  const { theme } = useTheme();
  const { colors, spacing, typography: t, radii } = theme;
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'parent' | 'professional'>('parent');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setUser({
        id: '1',
        email: email.toLowerCase(),
        firstName,
        lastName,
        role,
      });
      await setTokens('dummy_access_token', 'dummy_refresh_token');
      
      navigation.getParent()?.navigate('Main');
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Something went wrong.');
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
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingHorizontal: spacing.xl }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={[styles.header, { marginTop: spacing.xl, marginBottom: spacing.lg }]}>
            <Text
              style={{
                fontFamily: t.heading1.fontFamily,
                fontSize: t.heading1.fontSize,
                color: colors.textPrimary,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Create Account
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
              Join BabyGuide PH to track and check baby health
            </Text>
          </View>

          {/* Form Card */}
          <Card elevated style={{ padding: spacing.lg, marginBottom: spacing.xl }}>
            
            {/* Role selection */}
            <Text
              style={{
                fontFamily: t.bodyBold.fontFamily,
                fontSize: t.bodySmall.fontSize,
                color: colors.textPrimary,
                marginBottom: spacing.xs,
              }}
            >
              I am registering as a:
            </Text>
            <View style={[styles.roleRow, { marginBottom: spacing.md }]}>
              <Chip
                label="Parent"
                selected={role === 'parent'}
                onPress={() => setRole('parent')}
                icon={
                  <Ionicons
                    name="happy-outline"
                    size={16}
                    color={role === 'parent' ? colors.textInverse : colors.textPrimary}
                  />
                }
                style={{ marginRight: spacing.sm }}
              />
              <Chip
                label="Healthcare Worker"
                selected={role === 'professional'}
                onPress={() => setRole('professional')}
                icon={
                  <Ionicons
                    name="medical-outline"
                    size={16}
                    color={role === 'professional' ? colors.textInverse : colors.textPrimary}
                  />
                }
              />
            </View>

            {/* Names Input */}
            <View style={styles.nameRow}>
              <View style={{ flex: 1, marginRight: spacing.sm }}>
                <Text
                  style={{
                    fontFamily: t.bodyBold.fontFamily,
                    fontSize: t.bodySmall.fontSize,
                    color: colors.textPrimary,
                    marginBottom: spacing.xs,
                  }}
                >
                  First Name
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor: colors.border,
                      borderRadius: radii.sm,
                      backgroundColor: colors.backgroundSecondary,
                    },
                  ]}
                >
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First name"
                    placeholderTextColor={colors.placeholder}
                    style={[styles.input, { color: colors.textPrimary, fontFamily: t.body.fontFamily }]}
                  />
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: t.bodyBold.fontFamily,
                    fontSize: t.bodySmall.fontSize,
                    color: colors.textPrimary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Last Name
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor: colors.border,
                      borderRadius: radii.sm,
                      backgroundColor: colors.backgroundSecondary,
                    },
                  ]}
                >
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last name"
                    placeholderTextColor={colors.placeholder}
                    style={[styles.input, { color: colors.textPrimary, fontFamily: t.body.fontFamily }]}
                  />
                </View>
              </View>
            </View>

            {/* Email Input */}
            <Text
              style={{
                fontFamily: t.bodyBold.fontFamily,
                fontSize: t.bodySmall.fontSize,
                color: colors.textPrimary,
                marginBottom: spacing.xs,
                marginTop: spacing.md,
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
                  marginBottom: spacing.md,
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

            {/* Password Input */}
            <Text
              style={{
                fontFamily: t.bodyBold.fontFamily,
                fontSize: t.bodySmall.fontSize,
                color: colors.textPrimary,
                marginBottom: spacing.xs,
              }}
            >
              Password
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
              <Ionicons name="lock-closed-outline" size={20} color={colors.placeholder} style={{ marginRight: 8 }} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password (min 6 char)"
                placeholderTextColor={colors.placeholder}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                style={[styles.input, { color: colors.textPrimary, fontFamily: t.body.fontFamily }]}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.placeholder}
                />
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <Button
              title="Sign Up"
              onPress={handleRegister}
              loading={loading}
              fullWidth
            />
          </Card>

          {/* Login Link */}
          <View style={styles.footer}>
            <Text
              style={{
                fontFamily: t.body.fontFamily,
                fontSize: t.bodySmall.fontSize,
                color: colors.textSecondary,
              }}
            >
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text
                style={{
                  fontFamily: t.bodyBold.fontFamily,
                  fontSize: t.bodySmall.fontSize,
                  color: colors.primary,
                }}
              >
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
  },
  roleRow: {
    flexDirection: 'row',
  },
  nameRow: {
    flexDirection: 'row',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
});
