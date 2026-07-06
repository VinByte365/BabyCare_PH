import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../theme';
import { Button } from '../../components';
import { ProgressStepper } from '../../components/ProgressStepper';
import type { CheckerScreenProps } from '../../navigation/types';
import {
  QUESTION_STEPS,
  type SymptomId,
} from '../../lib/symptomEngine';

const STEP_LABELS = ['General', 'Respiratory', 'Digestive', 'Skin', 'Neurological'];

export function CheckerQuestionsScreen({ navigation, route }: CheckerScreenProps<'CheckerQuestions'>) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const { sessionId } = route.params;

  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<SymptomId>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);

  const scaleAnims = useRef<Map<string, Animated.Value>>(new Map());

  const getScaleAnim = useCallback((id: string) => {
    if (!scaleAnims.current.has(id)) {
      scaleAnims.current.set(id, new Animated.Value(1));
    }
    return scaleAnims.current.get(id)!;
  }, []);

  const currentSymptoms = QUESTION_STEPS[currentStep]?.symptoms || [];
  const isLastStep = currentStep === QUESTION_STEPS.length - 1;

  const handleToggleSymptom = (symptomId: SymptomId) => {
    const anim = getScaleAnim(symptomId);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.sequence([
      Animated.timing(anim, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    setSelectedSymptoms((prev) => {
      const next = new Set(prev);
      if (next.has(symptomId)) {
        next.delete(symptomId);
      } else {
        next.add(symptomId);
      }
      return next;
    });
  };

  const handleNext = () => {
    if (isLastStep) {
      const symptomIds = Array.from(selectedSymptoms);
      navigation.navigate('CheckerResult', { sessionId, symptomIds });
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const selectedCount = selectedSymptoms.size;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.base, paddingTop: 8, paddingBottom: spacing.sm }}>
        <TouchableOpacity onPress={handleBack} style={{ height: 44, width: 44, justifyContent: 'center' }} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, lineHeight: 25, color: colors.textPrimary, flex: 1, marginLeft: 4 }}>
          Symptom Checker
        </Text>
        {selectedCount > 0 && (
          <View
            style={{
              paddingVertical: 4,
              paddingHorizontal: 10,
              borderRadius: radii.pill,
              backgroundColor: colors.surfaceStrong,
            }}
          >
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.88, textTransform: 'uppercase', color: colors.textSecondary }}>
              {selectedCount} selected
            </Text>
          </View>
        )}
      </View>

      {/* Progress Stepper */}
      <ProgressStepper steps={STEP_LABELS} currentStep={currentStep} />

      {/* Question content */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: spacing.sm, paddingBottom: spacing.lg }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, lineHeight: 16, letterSpacing: 0.88, textTransform: 'uppercase', color: colors.textTertiary, marginBottom: spacing.xs }}>
            Step {currentStep + 1} of {QUESTION_STEPS.length}
          </Text>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 24, lineHeight: 30, color: colors.textPrimary, marginBottom: spacing.xs }}>
            {QUESTION_STEPS[currentStep]?.title}
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, color: colors.textSecondary }}>
            {QUESTION_STEPS[currentStep]?.subtitle}
          </Text>
        </View>

        {/* Symptoms as full-width touch-friendly rows */}
        <View>
          {currentSymptoms.map((symptom) => {
            const isSelected = selectedSymptoms.has(symptom.id);
            const anim = getScaleAnim(symptom.id);
            return (
              <Animated.View key={symptom.id} style={{ transform: [{ scale: anim }], marginBottom: spacing.sm }}>
                <TouchableOpacity
                  onPress={() => handleToggleSymptom(symptom.id)}
                  activeOpacity={0.85}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: radii.md,
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor: isSelected ? colors.primary : colors.border,
                    minHeight: 56,
                  }}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: radii.sm,
                      borderWidth: 1,
                      borderColor: isSelected ? colors.textInverse : colors.border,
                      backgroundColor: isSelected ? colors.textInverse : colors.backgroundSecondary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: spacing.sm,
                    }}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color={colors.primary} />
                    )}
                  </View>
                  <Text
                    style={{
                      fontFamily: 'Inter_400Regular',
                      fontSize: 15,
                      color: isSelected ? colors.textInverse : colors.textPrimary,
                      lineHeight: 22,
                      flex: 1,
                    }}
                  >
                    {symptom.label}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Skip / Next */}
        <View style={{ flexDirection: 'row', marginTop: spacing.md }}>
          <Button
            title={isLastStep ? 'See Results' : 'Next'}
            onPress={handleNext}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
