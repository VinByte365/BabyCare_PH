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
import { Button, Card } from '../../components';
import type { AuthScreenProps } from '../../navigation/types';

export function ForgotPasswordScreen({ navigation }: AuthScreenProps<'ForgotPassword'>) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Back button */}
        <View style={{ paddingHorizontal: spacing.base, paddingTop: 8 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ height: 44, width: 44, justifyContent: 'center' }}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginTop: spacing.base, marginBottom: spacing.xl }}>
            <View style={{ width: 64, height: 64, borderRadius: radii.full, backgroundColor: colors.surfaceStrong, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.base }}>
              <Ionicons name="key-outline" size={32} color={colors.iconActive} />
            </View>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 28, lineHeight: 34, color: colors.textPrimary, textAlign: 'center' }}>
              Reset Password
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, marginTop: 4, textAlign: 'center' }}>
              Enter your email and we'll send instructions to reset your password
            </Text>
          </View>

          {/* Form Card */}
          <Card style={{ padding: spacing.lg, marginBottom: spacing.xl }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
              Email Address
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, height: 44, marginBottom: spacing.lg }}>
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
            <Button title="Send Instructions" onPress={handleReset} loading={loading} fullWidth />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
