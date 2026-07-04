import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../theme';
import type { ThemeColors } from '../theme/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
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
  const { colors, radii } = theme;

  const handlePress = useCallback(() => {
    if (!disabled && !loading) {
      onPress();
    }
  }, [disabled, loading, onPress]);

  const containerStyle = getContainerStyle(variant, colors, disabled);
  const labelStyle = getLabelStyle(variant, colors, disabled);
  const sizeStyle = getSizeStyle(size);
  const labelSizeStyle = getLabelSizeStyle(size);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 44,
          borderRadius: radii.md,
          flexDirection: 'row',
        },
        containerStyle,
        sizeStyle,
        fullWidth && { width: '100%' },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'tertiary' ? colors.textLink : variant === 'secondary' ? colors.textPrimary : colors.textInverse}
        />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {icon && iconPosition === 'left' && (
            <View style={{ marginRight: 8 }}>{icon}</View>
          )}
          <Text style={[{ letterSpacing: 0 }, labelStyle, labelSizeStyle, textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={{ marginLeft: 8 }}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

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
      return {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        opacity,
      };
    case 'tertiary':
      return { backgroundColor: 'transparent', opacity };
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
      return { color: colors.textInverse, fontFamily: 'Inter_500Medium', fontSize: 14 };
    case 'secondary':
      return { color: colors.textPrimary, fontFamily: 'Inter_500Medium', fontSize: 14 };
    case 'tertiary':
      return { color: colors.textLink, fontFamily: 'Inter_500Medium', fontSize: 14 };
    case 'danger':
      return { color: colors.textInverse, fontFamily: 'Inter_500Medium', fontSize: 14 };
  }
}

function getSizeStyle(size: ButtonSize): ViewStyle {
  switch (size) {
    case 'sm':
      return { paddingVertical: 6, paddingHorizontal: 14 };
    case 'md':
      return { paddingVertical: 10, paddingHorizontal: 18 };
    case 'lg':
      return { paddingVertical: 14, paddingHorizontal: 24 };
  }
}

function getLabelSizeStyle(size: ButtonSize): TextStyle {
  switch (size) {
    case 'sm':
      return { fontSize: 13 };
    case 'md':
      return { fontSize: 14 };
    case 'lg':
      return { fontSize: 16 };
  }
}
