import React from 'react';
import { View, Text, type ViewStyle, type StyleProp } from 'react-native';
import { useTheme } from '../theme';
import type { ThemeColors } from '../theme/colors';

export type BadgeVariant = 'emergency' | 'moderate' | 'low' | 'new' | 'reminder' | 'info';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
}

function getVariantColors(variant: BadgeVariant, colors: ThemeColors) {
  switch (variant) {
    case 'emergency':
      return { bg: colors.danger, text: colors.textInverse };
    case 'moderate':
      return { bg: colors.warning, text: '#fff' };
    case 'low':
      return { bg: colors.success, text: '#fff' };
    case 'new':
      return { bg: colors.primary, text: colors.textInverse };
    case 'reminder':
      return { bg: colors.surfaceStrong, text: colors.textPrimary };
    case 'info':
    default:
      return { bg: colors.surfaceStrong, text: colors.textSecondary };
  }
}

export function Badge({ label, variant = 'info', style }: BadgeProps) {
  const { theme } = useTheme();
  const variantColors = getVariantColors(variant, theme.colors);

  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          backgroundColor: variantColors.bg,
          borderRadius: theme.radii.pill,
          paddingHorizontal: 10,
          paddingVertical: 4,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: variantColors.text,
          fontSize: 11,
          fontFamily: 'Inter_600SemiBold',
          letterSpacing: 0.88,
          lineHeight: 14,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
    </View>
  );
}
