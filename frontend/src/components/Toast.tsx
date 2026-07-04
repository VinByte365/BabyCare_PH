import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../theme';

interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
  duration?: number;
  type?: 'success' | 'error' | 'info';
}

export function Toast({
  visible,
  message,
  onHide,
  duration = 2000,
  type = 'success',
}: ToastProps) {
  const { theme } = useTheme();
  const { colors, radii } = theme;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 20, duration: 200, useNativeDriver: true }),
        ]).start(() => onHide());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const bgColor =
    type === 'success' ? colors.success :
    type === 'error' ? colors.danger :
    colors.primary;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          borderRadius: radii.md,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={[styles.text, { color: '#fff' }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    right: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 999,
    elevation: 10,
  },
  text: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
});
