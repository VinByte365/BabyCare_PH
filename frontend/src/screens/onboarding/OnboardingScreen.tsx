import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Button, Card } from '../../components';
import { useAuthStore } from '../../stores/authStore';
import type { RootStackScreenProps } from '../../navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Guided Symptom Assessment',
    description: 'Check newborn symptoms through a simple, medically-guided process to identify potential conditions.',
    icon: 'medkit-outline' as const,
  },
  {
    id: '2',
    title: 'Evidence-Based Library',
    description: 'Browse medical articles validated by pediatric professionals covering common newborn diseases and home care.',
    icon: 'library-outline' as const,
  },
  {
    id: '3',
    title: 'Community Support',
    description: 'Connect with other parents and get verified answers from professional pediatric healthcare workers.',
    icon: 'people-outline' as const,
  },
  {
    id: '4',
    title: 'Medical Disclaimer',
    description: 'BabyGuide PH is an educational aid. It does NOT replace professional medical advice, diagnosis, or treatment. Always consult a pediatrician in emergencies.',
    icon: 'alert-circle-outline' as const,
    isDisclaimer: true,
  },
];

export function OnboardingScreen({ navigation }: RootStackScreenProps<'Onboarding'>) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const [activePage, setActivePage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    const page = Math.round(x / SCREEN_WIDTH);
    if (page !== activePage) setActivePage(page);
  };

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleNext = () => {
    if (activePage < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (activePage + 1) * SCREEN_WIDTH, animated: true });
    } else {
      navigation.replace(isAuthenticated ? 'Main' : 'Auth');
    }
  };

  const handleSkip = () => {
    scrollRef.current?.scrollTo({ x: (slides.length - 1) * SCREEN_WIDTH, animated: true });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Skip button */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 8 }}>
        {activePage < slides.length - 1 ? (
          <Button title="Skip" onPress={handleSkip} variant="tertiary" size="sm" />
        ) : (
          <View style={{ height: 36 }} />
        )}
      </View>

      {/* Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={{ width: SCREEN_WIDTH, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: SCREEN_WIDTH * 0.85, alignItems: 'center' }}>
              {/* Icon Container */}
              <View
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: radii.xl,
                  backgroundColor: colors.surfaceStrong,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing.xxl,
                }}
              >
                <Ionicons name={slide.icon} size={72} color={colors.iconActive} />
              </View>

              {/* Title & Description */}
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 28, lineHeight: 34, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.base }}>
                {slide.title}
              </Text>

              {slide.isDisclaimer ? (
                <Card style={{ backgroundColor: colors.backgroundSecondary, padding: spacing.base }}>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, color: colors.textPrimary, textAlign: 'center' }}>
                    {slide.description}
                  </Text>
                </Card>
              ) : (
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 24, color: colors.textSecondary, textAlign: 'center' }}>
                  {slide.description}
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer controls */}
      <View style={{ alignItems: 'center', paddingHorizontal: spacing.xl, marginBottom: spacing.xl }}>
        {/* Pagination Dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 24 }}>
          {slides.map((_, idx) => (
            <View
              key={idx}
              style={{
                height: 8,
                borderRadius: radii.full,
                backgroundColor: idx === activePage ? colors.primary : colors.border,
                width: idx === activePage ? 24 : 8,
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>

        {/* Action Button */}
        <Button
          title={activePage === slides.length - 1 ? 'I Understand & Agree' : 'Next'}
          onPress={handleNext}
          variant={activePage === slides.length - 1 ? 'danger' : 'primary'}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}
