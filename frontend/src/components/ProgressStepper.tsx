import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { useTheme } from '../theme';

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

export function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  const { theme } = useTheme();
  const { colors, radii, spacing } = theme;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const progress = steps.length > 1 ? currentStep / (steps.length - 1) : 1;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={{ paddingHorizontal: spacing.base, paddingVertical: spacing.sm }}>
      {/* Step labels */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
        {steps.map((step, idx) => (
          <Text
            key={idx}
            style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 11,
              letterSpacing: 0.88,
              textTransform: 'uppercase',
              color: idx <= currentStep ? colors.primary : colors.textTertiary,
              textAlign: idx === 0 ? 'left' : idx === steps.length - 1 ? 'right' : 'center',
              flex: 1,
            }}
          >
            {step}
          </Text>
        ))}
      </View>

      {/* Progress bar track */}
      <View
        style={{
          height: 4,
          borderRadius: radii.pill,
          backgroundColor: colors.borderLight,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            height: '100%',
            borderRadius: radii.pill,
            backgroundColor: colors.primary,
            width: barWidth,
          }}
        />
      </View>
    </View>
  );
}
