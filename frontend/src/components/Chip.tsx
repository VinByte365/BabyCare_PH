import React from 'react';
import {
  TouchableOpacity,
  Text,
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
  const { colors, radii } = theme;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled }}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          minHeight: 36,
          borderRadius: radii.md,
          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: selected ? colors.primary : colors.surface,
          borderWidth: 1,
          borderColor: selected ? colors.primary : colors.border,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {icon && <>{icon}</>}
      <Text
        style={{
          color: selected ? colors.textInverse : colors.textPrimary,
          fontFamily: 'Inter_400Regular',
          fontSize: 14,
          lineHeight: 20,
          marginLeft: icon ? 4 : 0,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
