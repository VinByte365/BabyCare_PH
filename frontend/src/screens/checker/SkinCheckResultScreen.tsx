import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Button, Badge } from '../../components';
import type { CheckerScreenProps } from '../../navigation/types';
import { api } from '../../lib/api';
import { useNotificationStore } from '../../stores/notificationStore';

const severityColorMap: Record<string, string> = {
  emergency: '#eb8e90',
  urgent: '#ab6400',
  moderate: '#0d74ce',
  low: '#16a34a',
};

const severityLabelMap: Record<string, string> = {
  emergency: 'SEEK EMERGENCY CARE',
  urgent: 'SEEK CARE SOON',
  moderate: 'MONITOR',
  low: 'INFORMATIONAL',
};

export function SkinCheckResultScreen({ navigation, route }: CheckerScreenProps<'SkinCheckResult'>) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const { predicted, detectedClass, confidence, conditionContent, message } = route.params;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

    const fetchUnread = useNotificationStore.getState().fetchUnreadCount;
    const sessionId = route.params.sessionId;
    const title = predicted
      ? (detectedClass === 'Normal Skin' ? 'Skin Check — No Concerns' : `Skin Check — ${detectedClass}`)
      : 'Skin Check Inconclusive';
    const body = predicted
      ? (confidence !== undefined ? `Confidence: ${(confidence * 100).toFixed(1)}%. ${detectedClass === 'Normal Skin' ? 'No skin concerns detected.' : 'Review the results for next steps.'}` : 'Review the results for next steps.')
      : (message || 'Unable to detect the skin condition. Try again with a clearer image.');
    api.post('/notifications/', {
      type: 'skin_check',
      title,
      body,
      related_id: sessionId || null,
    }).then(() => fetchUnread()).catch(() => {});
  }, []);

  const handleBackToChecker = () => {
    navigation.navigate('CheckerIntro');
  };

  const handleBackToHome = () => {
    navigation.getParent()?.navigate('HomeTab');
  };

  const renderIcon = () => {
    if (!predicted) {
      return <Ionicons name="help-circle-outline" size={56} color={colors.warning} />;
    }
    if (detectedClass === 'Normal Skin') {
      return <Ionicons name="checkmark-circle-outline" size={56} color={colors.success} />;
    }
    const sev = conditionContent?.severity || 'low';
    return <Ionicons name="information-circle-outline" size={56} color={severityColorMap[sev] || colors.textSecondary} />;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: spacing.base, paddingTop: spacing.lg, paddingBottom: spacing.md }}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={{ alignItems: 'center', marginBottom: spacing.base }}>
              {renderIcon()}
              <Text
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 24,
                  lineHeight: 30,
                  color: colors.textPrimary,
                  textAlign: 'center',
                  marginTop: spacing.sm,
                }}
              >
                {predicted ? (detectedClass === 'Normal Skin' ? 'No Concerns Detected' : detectedClass || 'Result') : 'Unable to Detect Condition'}
              </Text>
              {confidence !== undefined && predicted && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs }}>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary }}>
                    Confidence: {(confidence * 100).toFixed(1)}%
                  </Text>
                  {confidence >= 0.7 && (
                    <Ionicons name="shield-checkmark-outline" size={16} color={colors.success} style={{ marginLeft: 6 }} />
                  )}
                </View>
              )}
            </View>
          </Animated.View>
        </View>

        {/* Low confidence message */}
        {!predicted && message && (
          <View style={{ paddingHorizontal: spacing.base, marginBottom: spacing.md }}>
            <Card style={{ backgroundColor: colors.backgroundSecondary }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Ionicons name="bulb-outline" size={20} color={colors.warning} style={{ marginRight: spacing.sm, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textPrimary, lineHeight: 20 }}>
                    {message}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Condition content */}
        {conditionContent && (
          <View style={{ paddingHorizontal: spacing.base }}>
            {/* Severity badge */}
            {conditionContent.severity && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
                <Badge
                  label={severityLabelMap[conditionContent.severity] || conditionContent.severity}
                  variant={
                    conditionContent.severity === 'emergency' ? 'emergency' :
                    conditionContent.severity === 'urgent' ? 'moderate' :
                    conditionContent.severity === 'moderate' ? 'info' : 'low'
                  }
                />
              </View>
            )}

            {/* Description */}
            <Card style={{ marginBottom: spacing.sm }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary, marginBottom: spacing.xs }}>
                What this means
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, lineHeight: 20 }}>
                {conditionContent.description}
              </Text>
            </Card>

            {/* Recommendation */}
            <Card style={{ marginBottom: spacing.sm }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary, marginBottom: spacing.xs }}>
                Recommendation
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, lineHeight: 20 }}>
                {conditionContent.recommendation}
              </Text>
            </Card>

            {/* When to seek care */}
            <Card style={{ marginBottom: spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Ionicons name="time-outline" size={20} color={colors.danger} style={{ marginRight: spacing.sm, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary, marginBottom: 2 }}>
                    When to seek care
                  </Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, lineHeight: 20 }}>
                    {conditionContent.when_to_seek_care}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Home care */}
            {conditionContent.home_care && (
              <Card style={{ marginBottom: spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <Ionicons name="home-outline" size={20} color={colors.iconActive} style={{ marginRight: spacing.sm, marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary, marginBottom: 2 }}>
                      Home care
                    </Text>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, lineHeight: 20 }}>
                      {conditionContent.home_care}
                    </Text>
                  </View>
                </View>
              </Card>
            )}

            {/* Disclaimer */}
            <Card style={{ backgroundColor: colors.backgroundSecondary, marginBottom: spacing.lg }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Ionicons name="information-circle-outline" size={20} color={colors.textTertiary} style={{ marginRight: spacing.sm, marginTop: 2 }} />
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary, flex: 1, lineHeight: 17 }}>
                  {conditionContent.disclaimer}
                </Text>
              </View>
            </Card>
          </View>
        )}

        {/* Retake / Upload Another */}
        {!predicted && (
          <View style={{ paddingHorizontal: spacing.base, marginBottom: spacing.md }}>
            <Button
              title="Try Again with Clearer Image"
              onPress={() => navigation.navigate('SkinCheckCamera', { inputMethod: 'camera' })}
              fullWidth
              icon={<Ionicons name="camera-reverse-outline" size={16} color="#fff" />}
              style={{ marginBottom: spacing.sm }}
            />
            <Button
              title="Upload Another Photo"
              onPress={() => navigation.navigate('SkinCheckCamera', { inputMethod: 'gallery' })}
              variant="secondary"
              fullWidth
              icon={<Ionicons name="images-outline" size={16} color={colors.textPrimary} />}
            />
          </View>
        )}

        {/* Action buttons */}
        <View style={{ paddingHorizontal: spacing.base, marginTop: spacing.sm }}>
          <Button
            title="Back to Symptom Checker"
            onPress={handleBackToChecker}
            variant="secondary"
            fullWidth
            style={{ marginBottom: spacing.sm }}
          />
          <Button
            title="Back to Home"
            onPress={handleBackToHome}
            variant="tertiary"
            fullWidth
          />
        </View>

        {/* Emergency call */}
        <View style={{ paddingHorizontal: spacing.base, marginTop: spacing.lg, alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textTertiary, textAlign: 'center', marginBottom: spacing.xs }}>
            In case of emergency
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('tel:911')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: radii.pill,
              backgroundColor: colors.danger + '15',
            }}
          >
            <Ionicons name="call-outline" size={16} color={colors.danger} />
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.danger, marginLeft: 6 }}>
              Call Emergency Services (911)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
