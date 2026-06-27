/**
 * BabyGuide PH — Root Navigator
 *
 * Manages the top-level navigation: Splash → Onboarding → Auth → Main.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from '../theme';
import type { RootStackParamList } from './types';
// ── Screens ────────────────────────────────────────────
import { SplashScreen } from '../screens/onboarding/SplashScreen';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { useAuthStore } from '../stores/authStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { theme } = useTheme();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const navigationTheme = theme.isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.textPrimary,
          border: theme.colors.border,
          primary: theme.colors.primary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.textPrimary,
          border: theme.colors.border,
          primary: theme.colors.primary,
        },
      };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
