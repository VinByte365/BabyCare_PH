/**
 * BabyGuide PH — Chip Component
 *
 * Selectable chips for symptom selection, category filters, etc.
 * Supports selected state with scale micro-interaction.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Chip({
  label,
  selected = false,
  onPress,
  icon,
  disabled = false,
  style,
}: ChipProps) {
  const { theme } = useTheme();
  const { colors, radii, spacing } = theme;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled }}
      style={[
        styles.container,
        {
          borderRadius: radii.xl,
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.md,
          backgroundColor: selected ? colors.primary : colors.surface,
          borderWidth: 1.5,
          borderColor: selected ? colors.primary : colors.border,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {icon && <>{icon}</>}
      <Text
        style={[
          styles.label,
          {
            color: selected ? colors.textInverse : colors.textPrimary,
            fontFamily: theme.typography.bodySmall.fontFamily,
            fontSize: theme.typography.bodySmall.fontSize,
            lineHeight: theme.typography.bodySmall.lineHeight,
            marginLeft: icon ? spacing.xxs : 0,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    minHeight: 36,
  },
  label: {},
});
