/**
 * BabyGuide PH — App Entry Point
 *
 * Sets up:
 * - Custom font loading (Nunito + Inter)
 * - Theme provider (light/dark/system)
 * - TanStack Query provider
 * - Navigation (Root → Tabs)
 * - Safe area provider
 * - Reduced motion detection
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

// Nunito (display/headings)
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

// Inter (body text)
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import { ThemeProvider } from './src/theme';
import { queryClient } from './src/lib/queryClient';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useAuthStore } from './src/stores/authStore';
import { useThemeStore } from './src/stores/themeStore';
import { palette } from './src/theme/colors';

// Keep splash visible until the app is ready, but never let that block rendering forever.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const loadStoredAuth = useAuthStore((s) => s.loadStoredAuth);
  const isAuthLoading = useAuthStore((s) => s.isLoading);
  const checkReduceMotion = useThemeStore((s) => s.checkReduceMotion);
  const [fontLoadTimedOut, setFontLoadTimedOut] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Load auth tokens + check accessibility prefs on mount
  useEffect(() => {
    loadStoredAuth();
    checkReduceMotion();
  }, [checkReduceMotion, loadStoredAuth]);

  useEffect(() => {
    const timer = setTimeout(() => setFontLoadTimedOut(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const fontsReady = fontsLoaded || Boolean(fontError) || fontLoadTimedOut;
  const appReady = fontsReady && !isAuthLoading;

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [appReady]);

  // Show nothing while fonts or auth are loading (splash screen is visible)
  if (!appReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={palette.sage} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDFBF7',
  },
});
