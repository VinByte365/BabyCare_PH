/**
 * BabyGuide PH — Splash Screen
 *
 * Renders a clean loading page with a soft pulsing/breathing logo
 * and transitions to Onboarding or Main depending on the auth state.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackScreenProps } from '../../navigation/types';

export function SplashScreen({ navigation }: RootStackScreenProps<'Splash'>) {
  const { theme } = useTheme();
  const { colors, spacing, typography: t } = theme;
  const pulseAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    // Navigate after a delay
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigation.replace('Main');
      } else {
        navigation.replace('Onboarding');
      }
    }, 2000);

    return () => {
      pulse.stop();
      clearTimeout(timer);
    };
  }, [pulseAnim]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            backgroundColor: colors.primary + '15',
            borderColor: colors.primary + '30',
            borderWidth: 3,
            borderRadius: theme.radii.xl,
            transform: [{ scale: pulseAnim }],
            marginBottom: spacing.lg,
          },
        ]}
      >
        <Ionicons name="heart" size={60} color={colors.primary} />
      </Animated.View>
      <Text
        style={[
          styles.title,
          {
            color: colors.textPrimary,
            fontFamily: t.display.fontFamily,
            fontSize: t.display.fontSize,
            letterSpacing: t.display.letterSpacing,
            lineHeight: t.display.lineHeight,
          },
        ]}
      >
        BabyGuide PH
      </Text>
      <Text
        style={[
          styles.subtitle,
          {
            color: colors.textSecondary,
            fontFamily: t.body.fontFamily,
            fontSize: t.bodySmall.fontSize,
            marginTop: spacing.xs,
          },
        ]}
      >
        Your Newborn Health Companion
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
  },
});
