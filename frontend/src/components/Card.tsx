/**
 * BabyGuide PH — Card Component
 *
 * Base card with consistent elevation, padding, border radius.
 * Optionally pressable (for dashboard cards, disease cards, etc.)
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
  noPadding?: boolean;
}

export function Card({
  children,
  onPress,
  elevated = false,
  style,
  noPadding = false,
}: CardProps) {
  const { theme } = useTheme();
  const { colors, radii, spacing, shadows: s } = theme;

  const containerStyle: ViewStyle = {
    backgroundColor: colors.cardBackground,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cardBorder,
    ...(elevated ? s.cardElevated : s.card),
    ...(noPadding ? {} : { padding: spacing.md }),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[containerStyle, style]}
        accessibilityRole="button"
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[containerStyle, style]}>{children}</View>;
}
