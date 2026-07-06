import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Button } from '../../components';
import type { CheckerScreenProps } from '../../navigation/types';

export function SkinCheckIntroScreen({ navigation }: CheckerScreenProps<'SkinCheckIntro'>) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 8, marginBottom: spacing.md }}>
          <View style={{ height: 44, width: 44, justifyContent: 'center' }}>
            <Ionicons name="camera-outline" size={28} color={colors.iconActive} />
          </View>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 22, lineHeight: 28, color: colors.textPrimary, flex: 1, marginLeft: 4 }}>
            Skin Check
          </Text>
        </View>

        {/* Hero illustration area */}
        <Card style={{ alignItems: 'center', paddingVertical: spacing.xl, marginBottom: spacing.lg }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: radii.xl,
              backgroundColor: colors.surfaceStrong,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.sm,
            }}
          >
            <Ionicons name="color-palette-outline" size={52} color={colors.iconActive} />
          </View>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 20, lineHeight: 26, color: colors.textPrimary, textAlign: 'center' }}>
            AI-Powered Skin Screening
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs, paddingHorizontal: spacing.lg, lineHeight: 20 }}>
            Use your phone's camera to check your baby's skin for common conditions. This tool is a screening aid only.
          </Text>
        </Card>

        {/* What it checks */}
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary, marginBottom: spacing.sm }}>
          Conditions screened
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.lg }}>
          {[
            { label: 'Measles', icon: 'warning-outline' },
            { label: 'Heat Rash', icon: 'flame-outline' },
            { label: 'Chickenpox', icon: 'ellipse-outline' },
            { label: 'Eczema', icon: 'refresh-outline' },
          ].map((c) => (
            <Card key={c.label} style={{ width: '47%', marginRight: '3%', marginBottom: spacing.sm, alignItems: 'center', paddingVertical: spacing.base }}>
              <Ionicons name={c.icon as any} size={24} color={colors.iconActive} />
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.textPrimary, marginTop: spacing.xs, textAlign: 'center' }}>
                {c.label}
              </Text>
            </Card>
          ))}
        </View>

        {/* How it works */}
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary, marginBottom: spacing.sm }}>
          How it works
        </Text>

        {[
          { icon: 'camera-outline', label: 'Take a clear photo of the affected skin area' },
          { icon: 'scan-outline', label: 'Our AI analyzes the image pattern' },
          { icon: 'document-text-outline', label: 'Get a preliminary screening result with guidance' },
        ].map((step, idx) => (
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
              <Ionicons name={step.icon as any} size={20} color={colors.iconActive} />
            </View>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textPrimary, flex: 1, lineHeight: 20 }}>
              {step.label}
            </Text>
          </Card>
        ))}

        {/* Important disclaimer */}
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
              This tool provides preliminary screening only and is not a medical diagnosis. Always consult a licensed pediatrician for medical decisions. In emergencies, call emergency services immediately.
            </Text>
          </View>
        </Card>

        {/* Action buttons */}
        <Button
          title="Take a Photo"
          onPress={() => navigation.navigate('SkinCheckCamera', { inputMethod: 'camera' })}
          fullWidth
          icon={<Ionicons name="camera" size={16} color="#fff" />}
          style={{ marginBottom: spacing.sm }}
        />
        <Button
          title="Upload from Gallery"
          onPress={() => navigation.navigate('SkinCheckCamera', { inputMethod: 'gallery' })}
          variant="secondary"
          fullWidth
          icon={<Ionicons name="images-outline" size={16} color={colors.textPrimary} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
