import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackScreenProps } from '../../navigation/types';

export function SplashScreen({ navigation }: RootStackScreenProps<'Splash'>) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const pulseAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.95, duration: 1200, useNativeDriver: true }),
      ])
    );
    pulse.start();

    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigation.replace('Main');
      } else {
        navigation.replace('Onboarding');
      }
    }, 2000);

    return () => { pulse.stop(); clearTimeout(timer); };
  }, [pulseAnim]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <Animated.View
        style={{
          width: 120,
          height: 120,
          borderRadius: radii.xl,
          backgroundColor: colors.surfaceStrong,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 0,
          transform: [{ scale: pulseAnim }],
          marginBottom: spacing.lg,
        }}
      >
        <Ionicons name="heart" size={60} color={colors.iconActive} />
      </Animated.View>
      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 32, lineHeight: 40, color: colors.textPrimary, letterSpacing: -0.5 }}>
        BabyGuide PH
      </Text>
      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs }}>
        Your Newborn Health Companion
      </Text>
    </View>
  );
}
