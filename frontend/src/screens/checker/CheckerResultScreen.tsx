import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Button, Badge } from '../../components';
import type { CheckerScreenProps } from '../../navigation/types';
import {
  assessSymptoms,
  getSymptomsByIds,
} from '../../lib/symptomEngine';
import type { AssessmentResult, SeverityLevel } from '../../lib/symptomEngine';

const MOCK_SELECTED_SYMPTOMS = [
  'fever_high', 'cough', 'difficult_breathing', 'poor_feeding',
];

const severityConfig: Record<SeverityLevel, { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  emergency: { label: 'EMERGENCY', color: '#eb8e90', icon: 'alert-circle' },
  urgent: { label: 'URGENT', color: '#ab6400', icon: 'warning-outline' },
  moderate: { label: 'MODERATE', color: '#0d74ce', icon: 'information-circle-outline' },
  low: { label: 'LOW', color: '#16a34a', icon: 'checkmark-circle-outline' },
};

function ResultCard({ result, index }: { result: AssessmentResult; index: number }) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const severity = severityConfig[result.severity];
  const opacity = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, delay: index * 150, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 400, delay: index * 150, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY: slide }], marginBottom: spacing.sm }}>
      <Card style={{ borderLeftWidth: 3, borderLeftColor: severity.color }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.xs }}>
          <Ionicons name={severity.icon} size={20} color={severity.color} style={{ marginRight: spacing.sm, marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary, flex: 1 }}>
                {result.diseaseName}
              </Text>
              <Badge
                label={severity.label}
                variant={
                  result.severity === 'emergency' ? 'emergency' :
                  result.severity === 'urgent' ? 'moderate' :
                  result.severity === 'moderate' ? 'info' : 'low'
                }
              />
            </View>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: spacing.sm }}>
              {result.description}
            </Text>
          </View>
        </View>

        <View style={{ backgroundColor: colors.backgroundSecondary, borderRadius: radii.sm, padding: spacing.sm, marginBottom: spacing.sm }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: colors.textPrimary, marginBottom: 2 }}>
            Recommendation
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary, lineHeight: 18 }}>
            {result.recommendation}
          </Text>
        </View>

        {result.homeCare && (
          <View style={{ backgroundColor: colors.backgroundSecondary, borderRadius: radii.sm, padding: spacing.sm, marginBottom: spacing.sm }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: colors.textPrimary, marginBottom: 2 }}>
              Home Care
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary, lineHeight: 18 }}>
              {result.homeCare}
            </Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <Ionicons name="time-outline" size={16} color={severity.color} style={{ marginRight: 6, marginTop: 2 }} />
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary, flex: 1, lineHeight: 17 }}>
            {result.whenToSeekCare}
          </Text>
        </View>

        {result.emergencySigns && result.emergencySigns.length > 0 && (
          <View style={{ marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.divider }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.88, textTransform: 'uppercase', color: colors.danger, marginBottom: 4 }}>
              Watch for these emergency signs
            </Text>
            {result.emergencySigns.map((sign, sIdx) => (
              <View key={sIdx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: colors.danger, marginRight: 8 }} />
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary }}>{sign}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>
    </Animated.View>
  );
}

export function CheckerResultScreen({ navigation, route }: CheckerScreenProps<'CheckerResult'>) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const { sessionId } = route.params;

  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [isEmergency, setIsEmergency] = useState(false);
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const { results: r, isEmergency: e } = assessSymptoms(MOCK_SELECTED_SYMPTOMS);
    setResults(r);
    setIsEmergency(e);

    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleBackToHome = () => {
    navigation.getParent()?.getParent()?.navigate('HomeTab');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }} showsVerticalScrollIndicator={false}>
        {/* Emergency Banner */}
        {isEmergency && (
          <View style={{ backgroundColor: colors.danger + '15', borderBottomWidth: 1, borderBottomColor: colors.danger + '30', paddingHorizontal: spacing.base, paddingVertical: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="alert-circle" size={24} color={colors.danger} style={{ marginRight: spacing.sm }} />
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.danger, flex: 1 }}>
                Seek Emergency Care Immediately
              </Text>
            </View>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs, marginLeft: 36 }}>
              Some of the matched conditions require urgent medical attention.
            </Text>
          </View>
        )}

        {/* Header */}
        <View style={{ paddingHorizontal: spacing.base, paddingTop: spacing.lg, paddingBottom: spacing.md }}>
          <Animated.View style={{ opacity: opacityAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
              <Ionicons name="document-text-outline" size={24} color={colors.iconActive} style={{ marginRight: spacing.sm }} />
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 22, lineHeight: 28, color: colors.textPrimary }}>
                Assessment Results
              </Text>
            </View>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary }}>
              Based on the symptoms you selected, the following conditions were identified as possible matches.
            </Text>
          </Animated.View>
        </View>

        {/* Selected Symptoms Summary */}
        <View style={{ paddingHorizontal: spacing.base, marginBottom: spacing.md }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.88, textTransform: 'uppercase', color: colors.textTertiary, marginBottom: spacing.xs }}>
            Selected Symptoms
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {getSymptomsByIds(MOCK_SELECTED_SYMPTOMS).map((s) => (
              <View key={s.id} style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 9999, backgroundColor: colors.surfaceStrong, marginRight: spacing.xs, marginBottom: spacing.xs }}>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary }}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Results List */}
        <View style={{ paddingHorizontal: spacing.base }}>
          {results.length === 0 ? (
            <Card style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
              <Ionicons name="checkmark-circle-outline" size={48} color={colors.success} />
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, color: colors.textPrimary, marginTop: spacing.sm, textAlign: 'center' }}>
                No matching conditions
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs }}>
                The selected symptoms don't closely match any known conditions in our database.
              </Text>
            </Card>
          ) : (
            results.map((result, idx) => (
              <ResultCard key={result.diseaseId} result={result} index={idx} />
            ))
          )}
        </View>

        {/* Action buttons */}
        <View style={{ paddingHorizontal: spacing.base, marginTop: spacing.md }}>
          {isEmergency && (
            <Button
              title="Call Emergency Services"
              onPress={() => Linking.openURL('tel:911')}
              variant="danger"
              fullWidth
              icon={<Ionicons name="call" size={16} color="#fff" />}
            />
          )}
          <View style={{ height: spacing.sm }} />
          <Button title="Back to Home" onPress={handleBackToHome} variant="secondary" fullWidth />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
