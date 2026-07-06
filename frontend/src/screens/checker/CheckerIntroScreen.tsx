import React from 'react';
import { View, Text, ScrollView } from 'react-native';
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
    { icon: 'clipboard-outline', label: 'Answer a short set of symptom questions' },
    { icon: 'search-outline', label: 'Compare symptoms with newborn health patterns' },
    { icon: 'document-text-outline', label: 'Review care guidance and escalation signs' },
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
        <View style={{ marginTop: spacing.xl, marginBottom: spacing.lg }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: radii.md,
              backgroundColor: colors.surfaceStrong,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.md,
            }}
          >
            <Ionicons name="medkit-outline" size={24} color={colors.iconActive} />
          </View>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 28, lineHeight: 34, color: colors.textPrimary }}>
            Symptom Checker
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 24, color: colors.textSecondary, marginTop: spacing.xs }}>
            A calm, guided check for newborn symptoms with clear next steps. It supports your judgment and does not replace a pediatrician.
          </Text>
        </View>

        {/* How it works */}
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, lineHeight: 16, letterSpacing: 0.88, textTransform: 'uppercase', color: colors.textTertiary, marginBottom: spacing.sm }}>
          How it works
        </Text>

        {steps.map((step, idx) => (
          <Card key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, padding: spacing.md }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: radii.md,
                backgroundColor: colors.surfaceStrong,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.sm,
              }}
            >
              <Ionicons name={step.icon} size={18} color={colors.iconActive} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, lineHeight: 18, color: colors.textTertiary, marginBottom: 1 }}>
                0{idx + 1}
              </Text>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.textPrimary, lineHeight: 20 }}>
                {step.label}
              </Text>
            </View>
          </Card>
        ))}

        {/* Disclaimer */}
        <Card
          style={{
            marginTop: spacing.sm,
            marginBottom: spacing.lg,
            backgroundColor: colors.backgroundSecondary,
            padding: spacing.md,
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
          onPress={() => navigation.navigate('SkinCheckIntro')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing.md,
            padding: spacing.md,
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
            <Ionicons name="scan-outline" size={24} color={colors.iconActive} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary }}>
              AI Skin Check
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary, lineHeight: 18 }}>
              Camera-assisted screening for visible skin concerns
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.iconActive} />
        </Card>

        {/* Start Button */}
        <Button title="Start Symptom Check" onPress={handleStart} fullWidth />
      </ScrollView>
    </SafeAreaView>
  );
}
