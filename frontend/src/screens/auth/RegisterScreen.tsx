import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
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
import { api } from '../../lib/api';
import type { AuthScreenProps } from '../../navigation/types';

export function RegisterScreen({ navigation }: AuthScreenProps<'Register'>) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'parent' | 'professional'>('parent');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);
  const loadUserProfile = useAuthStore((s) => s.loadUserProfile);

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
      await api.post('/auth/register', {
        email: email.toLowerCase().trim(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        role,
      });

      const formData = new URLSearchParams();
      formData.append('username', email.toLowerCase().trim());
      formData.append('password', password);

      const tokenRes = await fetch(
        `${__DEV__ ? 'http://10.0.2.2:8000/api/v1' : 'https://api.babyguide.ph/api/v1'}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        }
      );

      if (!tokenRes.ok) {
        throw new Error('Registration succeeded but login failed. Please log in manually.');
      }

      const { access_token, refresh_token } = await tokenRes.json();
      await setTokens(access_token, refresh_token);
      await loadUserProfile();
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.lg }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 28, lineHeight: 34, color: colors.textPrimary, textAlign: 'center' }}>
              Create Account
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, marginTop: 4, textAlign: 'center' }}>
              Join BabyGuide PH to track and check baby health
            </Text>
          </View>

          {/* Form Card */}
          <Card style={{ padding: spacing.lg, marginBottom: spacing.xl }}>
            {/* Role selection */}
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
              I am registering as a:
            </Text>
            <View style={{ flexDirection: 'row', marginBottom: spacing.base }}>
              <Chip label="Parent" selected={role === 'parent'} onPress={() => setRole('parent')} style={{ marginRight: spacing.sm }} />
              <Chip label="Healthcare Worker" selected={role === 'professional'} onPress={() => setRole('professional')} />
            </View>

            {/* Names Input */}
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, marginRight: spacing.sm }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
                  First Name
                </Text>
                <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, height: 44 }}>
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First name"
                    placeholderTextColor={colors.placeholder}
                    style={{ flex: 1, height: '100%', fontSize: 16, color: colors.textPrimary, fontFamily: 'Inter_400Regular' }}
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
                  Last Name
                </Text>
                <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, height: 44 }}>
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last name"
                    placeholderTextColor={colors.placeholder}
                    style={{ flex: 1, height: '100%', fontSize: 16, color: colors.textPrimary, fontFamily: 'Inter_400Regular' }}
                  />
                </View>
              </View>
            </View>

            {/* Email Input */}
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs, marginTop: spacing.base }}>
              Email Address
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, height: 44, marginBottom: spacing.base }}>
              <Ionicons name="mail-outline" size={20} color={colors.placeholder} style={{ marginRight: 8 }} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ flex: 1, height: '100%', fontSize: 16, color: colors.textPrimary, fontFamily: 'Inter_400Regular' }}
              />
            </View>

            {/* Password Input */}
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
              Password
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, height: 44, marginBottom: spacing.lg }}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.placeholder} style={{ marginRight: 8 }} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password (min 6 char)"
                placeholderTextColor={colors.placeholder}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                style={{ flex: 1, height: '100%', fontSize: 16, color: colors.textPrimary, fontFamily: 'Inter_400Regular' }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.placeholder} />
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <Button title="Sign Up" onPress={handleRegister} loading={loading} fullWidth />
          </Card>

          {/* Login Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary }}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.textLink }}>
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
