import React from 'react';
import { View, Text, type ViewStyle, type StyleProp } from 'react-native';
import { useTheme } from '../theme';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: spacing.xl }, style]}>
      {icon && <View style={{ marginBottom: spacing.lg, opacity: 0.6 }}>{icon}</View>}

      <Text
        style={{
          color: colors.textPrimary,
          fontFamily: 'Inter_600SemiBold',
          fontSize: 18,
          lineHeight: 25,
          textAlign: 'center',
          marginBottom: spacing.xs,
        }}
      >
        {title}
      </Text>

      {message && (
        <Text
          style={{
            color: colors.textSecondary,
            fontFamily: 'Inter_400Regular',
            fontSize: 16,
            lineHeight: 24,
            textAlign: 'center',
            marginBottom: spacing.lg,
          }}
        >
          {message}
        </Text>
      )}

      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} variant="secondary" size="sm" />
      )}
    </View>
  );
}
