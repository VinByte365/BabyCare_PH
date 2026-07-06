import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Button } from '../../components';
import type { CheckerScreenProps } from '../../navigation/types';
import { createSession } from '../../lib/symptomEngine';

export function CheckerIntroScreen({ navigation }: CheckerScreenProps<'CheckerIntro'>) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;

  type IconName = React.ComponentProps<typeof Ionicons>['name'];
  const steps: { icon: IconName; label: string }[] = [
    { icon: 'clipboard-outline', label: 'Answer guided questions about your baby\'s symptoms' },
    { icon: 'search-outline', label: 'Our engine cross-references known newborn conditions' },
    { icon: 'document-text-outline', label: 'Receive preliminary assessment & care recommendations' },
  ];

  const handleStart = () => {
    const sessionId = createSession();
    navigation.navigate('CheckerQuestions', { sessionId });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.xl }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: radii.xl,
              backgroundColor: colors.surfaceStrong,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.base,
            }}
          >
            <Ionicons name="medkit-outline" size={44} color={colors.iconActive} />
          </View>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 28, lineHeight: 34, color: colors.textPrimary, textAlign: 'center' }}>
            Symptom Checker
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs, paddingHorizontal: spacing.lg }}>
            A guided assessment tool for newborn symptoms. This is an educational aid and does not replace professional medical advice.
          </Text>
        </View>

        {/* How it works */}
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, lineHeight: 25, color: colors.textPrimary, marginBottom: spacing.sm }}>
          How it works
        </Text>

        {steps.map((step, idx) => (
          <Card key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: radii.md,
                backgroundColor: colors.surfaceStrong,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.sm,
              }}
            >
              <Ionicons name={step.icon} size={20} color={colors.iconActive} />
            </View>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textPrimary, flex: 1, lineHeight: 20 }}>
              {step.label}
            </Text>
          </Card>
        ))}

        {/* Disclaimer */}
        <Card
          style={{
            marginTop: spacing.md,
            marginBottom: spacing.lg,
            backgroundColor: colors.backgroundSecondary,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Ionicons name="information-circle-outline" size={20} color={colors.textTertiary} style={{ marginRight: spacing.sm, marginTop: 2 }} />
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 18 }}>
              This tool provides preliminary guidance only. Always consult a licensed pediatrician for medical decisions. In emergencies, call emergency services immediately.
            </Text>
          </View>
        </Card>

        {/* Skin Check option */}
        <Card
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing.md,
            backgroundColor: colors.backgroundSecondary,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: radii.md,
              backgroundColor: colors.surfaceStrong,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.sm,
            }}
          >
            <Ionicons name="color-palette-outline" size={24} color={colors.iconActive} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary }}>
              AI Skin Check
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary, lineHeight: 18 }}>
              Use the camera to screen for skin conditions like Measles, Heat Rash, and Chickenpox
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('SkinCheckIntro')}
            style={{
              height: 44,
              paddingHorizontal: 14,
              justifyContent: 'center',
            }}
            accessibilityRole="button"
            accessibilityLabel="Open AI Skin Check"
          >
            <Ionicons name="chevron-forward" size={22} color={colors.iconActive} />
          </TouchableOpacity>
        </Card>

        {/* Start Button */}
        <Button title="Start Symptom Check" onPress={handleStart} fullWidth />
      </ScrollView>
    </SafeAreaView>
  );
}
