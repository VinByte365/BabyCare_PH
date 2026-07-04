import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Badge, Button } from '../../components';
import type { LibraryScreenProps } from '../../navigation/types';
import { getDiseaseLibraryEntry, getCategoryDisplayName } from '../../lib/diseaseLibrary';
import { getSymptomById } from '../../lib/symptomEngine';
import { getCareGuidesByDisease } from '../../lib/careGuidance';
import { logEvent } from '../../lib/analytics';

type AccordionSection = 'overview' | 'symptoms' | 'causes' | 'treatment' | 'prevention' | 'seekingCare' | 'faq';

function AccordionCard({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card style={{ marginBottom: spacing.sm }}>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary, flex: 1 }}>
          {title}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.icon}
        />
      </TouchableOpacity>
      {isOpen && (
        <View style={{ marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.divider }}>
          {children}
        </View>
      )}
    </Card>
  );
}

export function DiseaseDetailScreen({ navigation, route }: LibraryScreenProps<'DiseaseDetail'>) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const { diseaseId } = route.params;
  const disease = getDiseaseLibraryEntry(diseaseId);

  if (!disease) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.icon} />
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 16, color: colors.textSecondary, marginTop: spacing.sm }}>
          Disease not found
        </Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} variant="secondary" size="sm" style={{ marginTop: spacing.base }} />
      </SafeAreaView>
    );
  }

  const severityConfig = {
    emergency: { label: 'EMERGENCY', variant: 'emergency' as const, color: '#eb8e90' },
    urgent: { label: 'URGENT', variant: 'moderate' as const, color: '#ab6400' },
    moderate: { label: 'MODERATE', variant: 'info' as const, color: '#0d74ce' },
    low: { label: 'LOW', variant: 'low' as const, color: '#16a34a' },
  } as const;

  const severity = severityConfig[disease.severity];
  const resolvedSymptoms = disease.symptoms.map((sid) => getSymptomById(sid)).filter(Boolean);

  useEffect(() => {
    logEvent('disease_viewed', { diseaseId: disease.id, diseaseName: disease.name }).catch(() => {});
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }} showsVerticalScrollIndicator={false}>
        {/* Back Button + Header */}
        <View style={{ paddingHorizontal: spacing.base, paddingTop: spacing.sm, paddingBottom: spacing.md }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: spacing.sm, alignSelf: 'flex-start' }} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={colors.iconActive} />
          </TouchableOpacity>
        </View>

        {/* Disease Title Card */}
        <Card style={{ marginHorizontal: spacing.base, marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 22, lineHeight: 28, color: colors.textPrimary, marginBottom: 4 }}>
                {disease.name}
              </Text>
              {disease.commonName && (
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textTertiary, marginBottom: spacing.xs }}>
                  Also known as: {disease.commonName}
                </Text>
              )}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs }}>
                <Badge label={severity.label} variant={severity.variant} />
                <View style={{ marginLeft: spacing.xs, flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="folder-outline" size={12} color={colors.textTertiary} style={{ marginRight: 4 }} />
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.textTertiary, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    {getCategoryDisplayName(disease.category)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, color: colors.textSecondary }}>
            {disease.description}
          </Text>
        </Card>

        {/* Overview */}
        <View style={{ paddingHorizontal: spacing.base }}>
          <AccordionCard title="Overview & Recommendations" defaultOpen>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
              Recommendation
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: colors.textSecondary, marginBottom: spacing.sm }}>
              {disease.recommendation}
            </Text>

            {disease.homeCare && (
              <>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
                  Home Care
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: colors.textSecondary, marginBottom: spacing.sm }}>
                  {disease.homeCare}
                </Text>
              </>
            )}

            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
              When to Seek Care
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Ionicons name="time-outline" size={16} color={severity.color} style={{ marginRight: 6, marginTop: 2 }} />
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: colors.textSecondary, flex: 1 }}>
                {disease.whenToSeekCare}
              </Text>
            </View>

            {disease.emergencySigns && disease.emergencySigns.length > 0 && (
              <View style={{ marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.divider }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.88, textTransform: 'uppercase', color: colors.danger, marginBottom: spacing.xs }}>
                  Emergency Warning Signs
                </Text>
                {disease.emergencySigns.map((sign, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: colors.danger, marginRight: 8 }} />
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary }}>{sign}</Text>
                  </View>
                ))}
              </View>
            )}
          </AccordionCard>

          {/* Symptoms */}
          <AccordionCard title={`Symptoms (${resolvedSymptoms.length})`}>
            {resolvedSymptoms.map((sym) => (
              <View key={sym!.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginRight: spacing.sm }} />
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, flex: 1 }}>
                  {sym!.label}
                </Text>
              </View>
            ))}
          </AccordionCard>

          {/* Causes */}
          <AccordionCard title="Causes & Risk Factors">
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: colors.textSecondary }}>
              {disease.causes}
            </Text>
          </AccordionCard>

          {/* Treatment */}
          <AccordionCard title="Treatment">
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: colors.textSecondary }}>
              {disease.treatment}
            </Text>
            {disease.complications && (
              <View style={{ marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.divider }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.danger, marginBottom: spacing.xs }}>
                  Possible Complications
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: colors.textSecondary }}>
                  {disease.complications}
                </Text>
              </View>
            )}
          </AccordionCard>

          {/* Prevention */}
          {disease.prevention && (
            <AccordionCard title="Prevention">
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: colors.textSecondary }}>
                {disease.prevention}
              </Text>
            </AccordionCard>
          )}

          {/* FAQ */}
          {disease.faq && disease.faq.length > 0 && (
            <AccordionCard title={`FAQ (${disease.faq.length})`}>
              {disease.faq.map((item, idx) => (
                <View key={idx} style={{ marginBottom: idx < disease.faq!.length - 1 ? spacing.sm : 0 }}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.textPrimary, marginBottom: 2 }}>
                    {item.question}
                  </Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, color: colors.textSecondary }}>
                    {item.answer}
                  </Text>
                  {idx < disease.faq!.length - 1 && (
                    <View style={{ height: 1, backgroundColor: colors.divider, marginTop: spacing.sm }} />
                  )}
                </View>
              ))}
            </AccordionCard>
          )}

          {/* Related Care Guide */}
          {(() => {
            const guides = getCareGuidesByDisease(disease.id);
            if (guides.length === 0) return null;
            const tabNav = navigation.getParent();
            return (
              <View style={{ marginTop: spacing.sm }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary, marginBottom: spacing.sm }}>
                  Related Care Guide
                </Text>
                {guides.map((guide) => (
                  <Card
                    key={guide.id}
                    onPress={() =>
                      tabNav?.navigate('HomeTab', {
                        screen: 'CareGuidanceDetail',
                        params: { guideId: guide.id },
                      } as any)
                    }
                    style={{ marginBottom: spacing.xs, flexDirection: 'row', alignItems: 'center' }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: radii.md,
                        backgroundColor: colors.surfaceStrong,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: spacing.sm,
                      }}
                    >
                      <Ionicons name="document-text-outline" size={20} color={colors.iconActive} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.textPrimary }}>
                        {guide.title}
                      </Text>
                      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textTertiary }}>
                        {guide.steps.length} steps · ~{guide.estimatedMinutes} min
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                  </Card>
                ))}
              </View>
            );
          })()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
