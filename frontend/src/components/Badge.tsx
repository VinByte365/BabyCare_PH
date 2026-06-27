/**
 * BabyGuide PH — Badge Component
 *
 * Variants: emergency, moderate, low, new, reminder, info
 * Used for severity indicators, status labels, tags.
 */

import React from 'react';
import { View, Text, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
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
      return { bg: colors.accent, text: colors.textPrimary };
    case 'low':
      return { bg: colors.successLight, text: colors.success };
    case 'new':
      return { bg: colors.primary, text: colors.textInverse };
    case 'reminder':
      return { bg: colors.infoLight, text: colors.info };
    case 'info':
    default:
      return { bg: colors.backgroundSecondary, text: colors.textSecondary };
  }
}

export function Badge({ label, variant = 'info', style }: BadgeProps) {
  const { theme } = useTheme();
  const variantColors = getVariantColors(variant, theme.colors);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: variantColors.bg,
          borderRadius: theme.radii.xs,
          paddingHorizontal: theme.spacing.xs,
          paddingVertical: 2,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: variantColors.text,
            fontSize: theme.typography.medicalLabel.fontSize,
            fontFamily: theme.typography.medicalLabel.fontFamily,
            letterSpacing: theme.typography.medicalLabel.letterSpacing,
            lineHeight: theme.typography.medicalLabel.lineHeight,
            textTransform: theme.typography.medicalLabel.textTransform,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  label: {},
});
