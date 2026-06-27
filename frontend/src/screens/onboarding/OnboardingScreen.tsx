/**
 * BabyGuide PH — Onboarding Screen
 *
 * Carousel onboarding introducing first-time parents to the app features:
 * 1. Symptom Checker
 * 2. Disease Library
 * 3. Community Forum
 * 4. Medical Disclaimer
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
    color: '#7FB3A3',
  },
  {
    id: '2',
    title: 'Evidence-Based Library',
    description: 'Browse medical articles validated by pediatric professionals covering common newborn diseases and home care.',
    icon: 'library-outline' as const,
    color: '#6AABDB',
  },
  {
    id: '3',
    title: 'Community Support',
    description: 'Connect with other parents and get verified answers from professional pediatric healthcare workers.',
    icon: 'people-outline' as const,
    color: '#FFB6A3',
  },
  {
    id: '4',
    title: 'Medical Disclaimer',
    description: 'BabyGuide PH is an educational aid. It does NOT replace professional medical advice, diagnosis, or treatment. Always consult a pediatrician in emergencies.',
    icon: 'alert-circle-outline' as const,
    color: '#E0524C',
    isDisclaimer: true,
  },
];

export function OnboardingScreen({ navigation }: RootStackScreenProps<'Onboarding'>) {
  const { theme } = useTheme();
  const { colors, spacing, typography: t, radii } = theme;
  const [activePage, setActivePage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    const page = Math.round(x / SCREEN_WIDTH);
    if (page !== activePage) {
      setActivePage(page);
    }
  };

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleNext = () => {
    if (activePage < slides.length - 1) {
      scrollRef.current?.scrollTo({
        x: (activePage + 1) * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      if (isAuthenticated) {
        navigation.replace('Main');
      } else {
        navigation.replace('Auth');
      }
    }
  };

  const handleSkip = () => {
    // Skip goes directly to disclaimer (last slide)
    scrollRef.current?.scrollTo({
      x: (slides.length - 1) * SCREEN_WIDTH,
      animated: true,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Skip button (hide on disclaimer page) */}
      <View style={styles.header}>
        {activePage < slides.length - 1 ? (
          <Button
            title="Skip"
            onPress={handleSkip}
            variant="outlined"
            size="sm"
            style={{ borderColor: 'transparent' }}
            textStyle={{ color: colors.textSecondary }}
          />
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
        style={styles.scroll}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <View style={styles.slideContent}>
              {/* Animated Icon Container */}
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: slide.color + '18',
                    borderRadius: radii.xl,
                    borderColor: slide.color + '30',
                    borderWidth: 2,
                    marginBottom: spacing.xxl,
                  },
                ]}
              >
                <Ionicons name={slide.icon} size={72} color={slide.color} />
              </View>

              {/* Title & Description */}
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.textPrimary,
                    fontFamily: t.heading1.fontFamily,
                    fontSize: t.heading1.fontSize,
                    lineHeight: t.heading1.lineHeight,
                    marginBottom: spacing.md,
                  },
                ]}
              >
                {slide.title}
              </Text>

              {slide.isDisclaimer ? (
                <Card
                  style={{
                    backgroundColor: colors.danger + '08',
                    borderColor: colors.danger + '20',
                    borderWidth: 1.5,
                    padding: spacing.md,
                  }}
                >
                  <Text
                    style={[
                      styles.description,
                      {
                        color: colors.textPrimary,
                        fontFamily: t.body.fontFamily,
                        fontSize: t.bodySmall.fontSize,
                        lineHeight: 22,
                        textAlign: 'center',
                      },
                    ]}
                  >
                    {slide.description}
                  </Text>
                </Card>
              ) : (
                <Text
                  style={[
                    styles.description,
                    {
                      color: colors.textSecondary,
                      fontFamily: t.body.fontFamily,
                      fontSize: t.body.fontSize,
                      lineHeight: 24,
                    },
                  ]}
                >
                  {slide.description}
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer controls */}
      <View style={[styles.footer, { paddingHorizontal: spacing.xl, marginBottom: spacing.xl }]}>
        {/* Pagination Dots */}
        <View style={styles.dots}>
          {slides.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                {
                  borderRadius: radii.full,
                  backgroundColor: idx === activePage ? colors.primary : colors.border,
                  width: idx === activePage ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <Button
          title={activePage === slides.length - 1 ? 'I Understand & Agree' : 'Next'}
          onPress={handleNext}
          variant={activePage === slides.length - 1 ? 'danger' : 'primary'}
          style={styles.actionBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  scroll: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    width: SCREEN_WIDTH * 0.85,
    alignItems: 'center',
  },
  iconContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    height: 8,
    marginHorizontal: 4,
  },
  actionBtn: {
    width: '100%',
  },
});
