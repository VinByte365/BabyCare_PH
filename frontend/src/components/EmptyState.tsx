/**
 * BabyGuide PH — EmptyState Component
 *
 * Friendly empty-state placeholder with icon/illustration, title, and body.
 * Used for empty feeds, no search results, etc.
 */

import React from 'react';
import { View, Text, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
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
  const { colors, spacing, typography: t } = theme;

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.xxl }, style]}>
      {icon && <View style={[styles.iconWrap, { marginBottom: spacing.lg }]}>{icon}</View>}

      <Text
        style={[
          styles.title,
          {
            color: colors.textPrimary,
            fontFamily: t.title.fontFamily,
            fontSize: t.title.fontSize,
            lineHeight: t.title.lineHeight,
            marginBottom: spacing.xs,
          },
        ]}
      >
        {title}
      </Text>

      {message && (
        <Text
          style={[
            styles.message,
            {
              color: colors.textSecondary,
              fontFamily: t.body.fontFamily,
              fontSize: t.body.fontSize,
              lineHeight: t.body.lineHeight,
              marginBottom: spacing.lg,
            },
          ]}
        >
          {message}
        </Text>
      )}

      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} variant="outlined" size="sm" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  iconWrap: {
    opacity: 0.6,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
});
