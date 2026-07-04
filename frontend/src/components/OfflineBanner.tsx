import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { useNetworkStore } from '../lib/networkStore';

export function OfflineBanner() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const isConnected = useNetworkStore((s) => s.isConnected);
  const translateY = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isConnected ? -60 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isConnected, translateY]);

  if (isConnected) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        backgroundColor: colors.warning,
        paddingTop: spacing.xs,
        paddingBottom: spacing.xs,
        paddingHorizontal: spacing.base,
        flexDirection: 'row',
        alignItems: 'center',
        transform: [{ translateY }],
      }}
    >
      <Ionicons
        name="cloud-offline-outline"
        size={16}
        color={colors.textPrimary}
        style={{ marginRight: spacing.xs }}
      />
      <Text
        style={{
          fontFamily: 'Inter_500Medium',
          fontSize: 13,
          color: colors.textPrimary,
          flex: 1,
        }}
      >
        You're offline — some features may be limited
      </Text>
    </Animated.View>
  );
}
