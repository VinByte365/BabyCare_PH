import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Badge, Button } from '../../components';
import type { HomeScreenProps } from '../../navigation/types';
import { getCareGuide } from '../../lib/careGuidance';
import { useBookmarkStore } from '../../lib/bookmarkStore';
import { logEvent } from '../../lib/analytics';

function StepCard({
  step,
  index,
}: {
  step: { stepNumber: number; title: string; body: string; icon?: string };
  index: number;
}) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const opacity = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, delay: index * 200, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 400, delay: index * 200, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY: slide }], marginBottom: spacing.sm }}>
      <Card style={{ paddingLeft: spacing.base, flexDirection: 'row', alignItems: 'flex-start' }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: radii.full,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.sm,
            marginTop: 2,
            flexShrink: 0,
          }}
        >
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textInverse }}>
            {step.stepNumber}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            {step.icon && (
              <Ionicons name={step.icon as any} size={16} color={colors.primary} style={{ marginRight: 6 }} />
            )}
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary, flex: 1 }}>
              {step.title}
            </Text>
          </View>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: colors.textSecondary }}>
            {step.body}
          </Text>
        </View>
      </Card>
    </Animated.View>
  );
}

export function CareGuidanceDetailScreen({ navigation, route }: HomeScreenProps<'CareGuidanceDetail'>) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const { guideId } = route.params;
  const guide = getCareGuide(guideId);
  const toggleBookmark = useBookmarkStore((s) => s.toggleBookmark);
  const isSaved = useBookmarkStore((s) => s.isBookmarked(guideId));

  if (!guide) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.icon} />
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 16, color: colors.textSecondary, marginTop: spacing.sm }}>
          Guide not found
        </Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} variant="secondary" size="sm" style={{ marginTop: spacing.base }} />
      </SafeAreaView>
    );
  }

  useEffect(() => {
    logEvent('care_guide_viewed', { guideId: guide.id, guideTitle: guide.title }).catch(() => {});
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: spacing.base, paddingTop: spacing.sm, paddingBottom: spacing.md }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: spacing.sm, alignSelf: 'flex-start' }} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={colors.iconActive} />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 22, lineHeight: 28, color: colors.textPrimary, marginBottom: 4 }}>
                {guide.title}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Badge label={guide.category} variant="info" />
                {guide.estimatedMinutes && (
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textTertiary, marginLeft: spacing.xs }}>
                    ~{guide.estimatedMinutes} min read
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              onPress={() => toggleBookmark({ id: guide.id, type: 'care_guide', title: guide.title })}
              hitSlop={8}
              style={{
                width: 44,
                height: 44,
                borderRadius: theme.radii.md,
                backgroundColor: colors.surfaceStrong,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={isSaved ? colors.textLink : colors.icon}
              />
            </TouchableOpacity>
          </View>

          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: colors.textSecondary, marginTop: spacing.sm }}>
            {guide.summary}
          </Text>
        </View>

        {/* Steps */}
        <View style={{ paddingHorizontal: spacing.base }}>
          {guide.steps.map((step, idx) => (
            <StepCard key={step.stepNumber} step={step} index={idx} />
          ))}
        </View>

        {/* Bottom Note */}
        <View style={{ paddingHorizontal: spacing.base, marginTop: spacing.md }}>
          <Card style={{ backgroundColor: colors.backgroundSecondary }}>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17, color: colors.textTertiary, textAlign: 'center' }}>
              These guides provide general care information. Always consult your pediatrician for medical advice specific to your baby.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
