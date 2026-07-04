import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

// Inter (body + display — single sans family per DESIGN.md)
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

// JetBrains Mono (code surfaces per DESIGN.md)
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';

import { ThemeProvider } from './src/theme';
import { queryClient } from './src/lib/queryClient';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useAuthStore } from './src/stores/authStore';
import { useThemeStore } from './src/stores/themeStore';
import { lightColors } from './src/theme/colors';
import { flushAnalytics, startAnalyticsSession } from './src/lib/analytics';
import { useNetworkStore } from './src/lib/networkStore';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const loadStoredAuth = useAuthStore((s) => s.loadStoredAuth);
  const isAuthLoading = useAuthStore((s) => s.isLoading);
  const checkReduceMotion = useThemeStore((s) => s.checkReduceMotion);
  const initializeNetwork = useNetworkStore((s) => s.initialize);
  const [fontLoadTimedOut, setFontLoadTimedOut] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    JetBrainsMono_400Regular,
  });

  useEffect(() => {
    loadStoredAuth();
    checkReduceMotion();
    startAnalyticsSession().catch(() => {});
    const unsubNet = initializeNetwork();
    return () => {
      unsubNet();
    };
  }, [checkReduceMotion, initializeNetwork, loadStoredAuth]);

  const flushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    flushTimerRef.current = setInterval(() => {
      flushAnalytics().catch(() => {});
    }, 300000); // flush every 5 minutes
    return () => {
      if (flushTimerRef.current) clearInterval(flushTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        flushAnalytics().catch(() => {});
      }
    });
    return () => sub.remove();
  }, []);

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

  if (!appReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: lightColors.background }}>
        <ActivityIndicator size="large" color={lightColors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
