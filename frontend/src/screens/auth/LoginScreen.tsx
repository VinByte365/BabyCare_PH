/**
 * BabyGuide PH — Login Screen
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
import { Button, Card } from '../../components';
import { useAuthStore } from '../../stores/authStore';
import type { AuthScreenProps } from '../../navigation/types';

export function LoginScreen({ navigation }: AuthScreenProps<'Login'>) {
  const { theme } = useTheme();
  const { colors, spacing, typography: t, radii } = theme;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    try {
      // For presentation/offline test, simulate login if server is not reachable
      // We will perform a fetch later when connecting.
      // Simulating a brief delay:
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Seed dummy user
      setUser({
        id: '1',
        email: email.toLowerCase(),
        firstName: 'Melvin',
        lastName: 'Catuera',
        role: 'parent',
      });
      await setTokens('dummy_access_token', 'dummy_refresh_token');
      
      // Navigate to main
      navigation.getParent()?.navigate('Main');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Something went wrong.');
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
          <View style={[styles.header, { marginTop: spacing.xxxl, marginBottom: spacing.xxl }]}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: colors.primary + '15',
                  borderColor: colors.primary + '30',
                  borderRadius: radii.full,
                  borderWidth: 1.5,
                  marginBottom: spacing.md,
                },
              ]}
            >
              <Ionicons name="heart" size={32} color={colors.primary} />
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
              Welcome Back
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
              Log in to access your baby guide and tools
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
                  marginBottom: spacing.sm,
                },
              ]}
            >
              <Ionicons name="lock-closed-outline" size={20} color={colors.placeholder} style={{ marginRight: 8 }} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
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

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotBtn}
            >
              <Text
                style={{
                  fontFamily: t.bodySmall.fontFamily,
                  fontSize: 13,
                  color: colors.primary,
                  textAlign: 'right',
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Button
              title="Log In"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              style={{ marginTop: spacing.md }}
            />
          </Card>

          {/* Registration Link */}
          <View style={styles.footer}>
            <Text
              style={{
                fontFamily: t.body.fontFamily,
                fontSize: t.bodySmall.fontSize,
                color: colors.textSecondary,
              }}
            >
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text
                style={{
                  fontFamily: t.bodyBold.fontFamily,
                  fontSize: t.bodySmall.fontSize,
                  color: colors.primary,
                }}
              >
                Sign Up
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
  forgotBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
});
