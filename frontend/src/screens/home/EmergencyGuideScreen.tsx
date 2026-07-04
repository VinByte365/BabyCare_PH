import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Button } from '../../components';
import type { HomeScreenProps } from '../../navigation/types';
import { logEvent } from '../../lib/analytics';
import {
  EMERGENCY_HOTLINES,
  HEALTHCARE_FACILITIES,
  EMERGENCY_FIRST_STEPS,
} from '../../lib/emergencyData';

function callNumber(number: string) {
  Linking.openURL(`tel:${number}`);
}

export function EmergencyGuideScreen({ navigation }: HomeScreenProps<'EmergencyGuide'>) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;

  useEffect(() => {
    logEvent('emergency_guide_viewed').catch(() => {});
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: spacing.base, paddingTop: spacing.sm, paddingBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: spacing.sm }} hitSlop={8}>
              <Ionicons name="arrow-back" size={24} color={colors.iconActive} />
            </TouchableOpacity>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 22, lineHeight: 28, color: colors.textPrimary, flex: 1 }}>
              Emergency Guide
            </Text>
          </View>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary }}>
            Know what to do in a medical emergency. Keep these numbers accessible.
          </Text>
        </View>

        {/* Emergency Banner */}
        <View
          style={{
            marginHorizontal: spacing.base,
            marginBottom: spacing.md,
            backgroundColor: colors.danger + '15',
            borderWidth: 1,
            borderColor: colors.danger + '30',
            borderRadius: radii.lg,
            padding: spacing.base,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: radii.full,
                backgroundColor: colors.danger + '25',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.sm,
              }}
            >
              <Ionicons name="alert-circle" size={28} color={colors.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 20, color: colors.danger }}>
                In an Emergency
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary }}>
                Dial 911 immediately for ambulance assistance
              </Text>
            </View>
          </View>
          <Button
            title="Call 911 Now"
            onPress={() => callNumber('911')}
            variant="danger"
            fullWidth
            icon={<Ionicons name="call" size={16} color="#fff" />}
            style={{ marginBottom: spacing.xs }}
          />
          <Button
            title="Call Red Cross 143"
            onPress={() => callNumber('143')}
            variant="secondary"
            fullWidth
            icon={<Ionicons name="call-outline" size={16} color={colors.textPrimary} />}
          />
        </View>

        {/* First Steps */}
        <View style={{ paddingHorizontal: spacing.base, marginBottom: spacing.md }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary, marginBottom: spacing.sm }}>
            First Steps
          </Text>
          {EMERGENCY_FIRST_STEPS.map((step) => (
            <Card key={step.stepNumber} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.xs }}>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: radii.full,
                  backgroundColor: colors.danger + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: spacing.sm,
                  marginTop: 2,
                  flexShrink: 0,
                }}
              >
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: colors.danger }}>
                  {step.stepNumber}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: 2 }}>
                  {step.title}
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18, color: colors.textSecondary }}>
                  {step.body}
                </Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Emergency Hotlines */}
        <View style={{ paddingHorizontal: spacing.base, marginBottom: spacing.md }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary, marginBottom: spacing.sm }}>
            Emergency Hotlines
          </Text>
          {EMERGENCY_HOTLINES.map((hotline, idx) => (
            <Card
              key={idx}
              onPress={() => callNumber(hotline.number)}
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}
            >
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
                <Ionicons name="call-outline" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary }}>
                  {hotline.name}
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary }}>
                  {hotline.description}
                </Text>
              </View>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 18, color: colors.textLink, letterSpacing: 1 }}>
                {hotline.number}
              </Text>
            </Card>
          ))}
        </View>

        {/* Healthcare Facilities */}
        <View style={{ paddingHorizontal: spacing.base }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary, marginBottom: spacing.sm }}>
            Nearby Hospitals & Facilities
          </Text>
          {HEALTHCARE_FACILITIES.map((facility) => (
            <Card key={facility.id} style={{ marginBottom: spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
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
                  <Ionicons name="medkit-outline" size={20} color={colors.iconActive} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary }}>
                    {facility.name}
                  </Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                    {facility.address}, {facility.city}
                  </Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary }}>
                    {facility.phone}
                  </Text>
                  <View style={{ flexDirection: 'row', marginTop: spacing.xs }}>
                    {facility.hasEmergency && (
                      <BadgeInternal label="ER Open" color={colors.success} />
                    )}
                    {facility.is24Hour && (
                      <BadgeInternal label="24/7" color={colors.textPrimary} style={{ marginLeft: 4 }} />
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => callNumber(facility.phone.replace(/[^\d]/g, ''))}
                  hitSlop={8}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: radii.md,
                    backgroundColor: colors.surfaceStrong,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="call-outline" size={20} color={colors.textLink} />
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BadgeInternal({
  label,
  color,
  style,
}: {
  label: string;
  color: string;
  style?: any;
}) {
  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          backgroundColor: color + '20',
          borderRadius: 4,
          paddingHorizontal: 8,
          paddingVertical: 2,
        },
        style,
      ]}
    >
      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 10, color, letterSpacing: 0.5, textTransform: 'uppercase' }}>
        {label}
      </Text>
    </View>
  );
}
