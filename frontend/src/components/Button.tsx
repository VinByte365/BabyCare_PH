/**
 * BabyGuide PH — Button Component
 *
 * Variants: primary, secondary, outlined, danger
 * Supports loading state, disabled state, icons, and haptic feedback.
 */

import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../theme';
import type { ThemeColors } from '../theme/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const { theme } = useTheme();
  const { colors, radii, spacing: sp } = theme;

  const handlePress = useCallback(() => {
    if (!disabled && !loading) {
      onPress();
    }
  }, [disabled, loading, onPress]);

  const containerStyle = getContainerStyle(variant, colors, disabled);
  const labelStyle = getLabelStyle(variant, colors, disabled);
  const sizeStyle = getSizeStyle(size, sp, radii);
  const labelSizeStyle = getLabelSizeStyle(size);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.base,
        containerStyle,
        sizeStyle,
        fullWidth && styles.fullWidth,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outlined' ? colors.primary : colors.textInverse}
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={[styles.label, labelStyle, labelSizeStyle, textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

// ── Style helpers ──────────────────────────────────────

function getContainerStyle(
  variant: ButtonVariant,
  colors: ThemeColors,
  disabled: boolean,
): ViewStyle {
  const opacity = disabled ? 0.5 : 1;
  switch (variant) {
    case 'primary':
      return { backgroundColor: colors.primary, opacity };
    case 'secondary':
      return { backgroundColor: colors.secondary, opacity };
    case 'outlined':
      return {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.primary,
        opacity,
      };
    case 'danger':
      return { backgroundColor: colors.danger, opacity };
  }
}

function getLabelStyle(
  variant: ButtonVariant,
  colors: ThemeColors,
  _disabled: boolean,
): TextStyle {
  switch (variant) {
    case 'primary':
    case 'secondary':
    case 'danger':
      return { color: colors.textInverse };
    case 'outlined':
      return { color: colors.primary };
  }
}

function getSizeStyle(
  size: ButtonSize,
  sp: typeof import('../theme/spacing').spacing,
  r: typeof import('../theme/spacing').radii,
): ViewStyle {
  switch (size) {
    case 'sm':
      return { paddingVertical: sp.xs, paddingHorizontal: sp.md, borderRadius: r.sm };
    case 'md':
      return { paddingVertical: sp.sm, paddingHorizontal: sp.xl, borderRadius: r.lg };
    case 'lg':
      return { paddingVertical: sp.md, paddingHorizontal: sp.xxl, borderRadius: r.lg };
  }
}

function getLabelSizeStyle(size: ButtonSize): TextStyle {
  switch (size) {
    case 'sm':
      return { fontSize: 14, lineHeight: 20 };
    case 'md':
      return { fontSize: 16, lineHeight: 24 };
    case 'lg':
      return { fontSize: 18, lineHeight: 26 };
  }
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // tap target
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
