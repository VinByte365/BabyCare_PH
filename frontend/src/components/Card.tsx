import React from 'react';
import {
  View,
  TouchableOpacity,
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
  const { colors, radii } = theme;

  const containerStyle: ViewStyle = {
    backgroundColor: colors.cardBackground,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...(noPadding ? {} : { padding: 16 }),
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
