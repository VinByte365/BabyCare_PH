import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function SkeletonLoader({
  width = '100%',
  height = 16,
  borderRadius,
  style,
}: SkeletonLoaderProps) {
  const { theme } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const radius = borderRadius ?? theme.radii.sm;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim]);

  const backgroundColor = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      theme.isDark ? '#2a2a2a' : '#f0f0f3',
      theme.isDark ? '#333333' : '#e0e0e3',
    ],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius: radius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  const { theme } = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.radii.lg,
        padding: theme.spacing.base,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
      }}
    >
      <SkeletonLoader width="60%" height={20} borderRadius={theme.radii.sm} />
      <View style={{ height: theme.spacing.sm }} />
      <SkeletonLoader width="100%" height={14} borderRadius={theme.radii.xs} />
      <View style={{ height: theme.spacing.xs }} />
      <SkeletonLoader width="80%" height={14} borderRadius={theme.radii.xs} />
    </View>
  );
}

export function SkeletonListItem() {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.base,
      }}
    >
      <SkeletonLoader width={44} height={44} borderRadius={theme.radii.full} />
      <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
        <SkeletonLoader width="70%" height={16} />
        <View style={{ height: 6 }} />
        <SkeletonLoader width="40%" height={12} />
      </View>
    </View>
  );
}
