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
import { Card, Button } from '../../components';
import { ProgressStepper } from '../../components/ProgressStepper';
import type { CheckerScreenProps } from '../../navigation/types';
import {
  QUESTION_STEPS,
  type SymptomId,
  assessSymptoms,
  getSymptomsByIds,
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
      const { results, isEmergency } = assessSymptoms(Array.from(selectedSymptoms));
      navigation.navigate('CheckerResult', { sessionId });
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
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.base, paddingTop: 8, paddingBottom: spacing.xs }}>
        <TouchableOpacity onPress={handleBack} style={{ height: 44, width: 44, justifyContent: 'center' }}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, lineHeight: 25, color: colors.textPrimary, flex: 1, marginLeft: 4 }}>
          Symptom Checker
        </Text>
        {selectedCount > 0 && (
          <View
            style={{
              paddingVertical: 2,
              paddingHorizontal: 8,
              borderRadius: radii.pill,
              backgroundColor: colors.surfaceStrong,
            }}
          >
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.textSecondary }}>
              {selectedCount} selected
            </Text>
          </View>
        )}
      </View>

      {/* Progress Stepper */}
      <ProgressStepper steps={STEP_LABELS} currentStep={currentStep} />

      {/* Question content */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 22, lineHeight: 28, color: colors.textPrimary, marginBottom: spacing.xs }}>
          {QUESTION_STEPS[currentStep]?.title}
        </Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, marginBottom: spacing.lg }}>
          {QUESTION_STEPS[currentStep]?.subtitle}
        </Text>

        {/* Symptoms as large touch-friendly chips */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {currentSymptoms.map((symptom) => {
            const isSelected = selectedSymptoms.has(symptom.id);
            const anim = getScaleAnim(symptom.id);
            return (
              <Animated.View key={symptom.id} style={{ transform: [{ scale: anim }], marginBottom: spacing.sm, marginRight: spacing.sm }}>
                <TouchableOpacity
                  onPress={() => handleToggleSymptom(symptom.id)}
                  activeOpacity={0.85}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: radii.md,
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor: isSelected ? colors.primary : colors.border,
                    minHeight: 48,
                  }}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                >
                  <Text
                    style={{
                      fontFamily: 'Inter_500Medium',
                      fontSize: 14,
                      color: isSelected ? colors.textInverse : colors.textPrimary,
                      lineHeight: 20,
                      flex: 1,
                    }}
                  >
                    {symptom.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={18} color={colors.textInverse} style={{ marginLeft: 8 }} />
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Skip / Next */}
        <View style={{ flexDirection: 'row', marginTop: spacing.md, gap: spacing.sm }}>
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
