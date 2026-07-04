import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../theme';
import { Card, Button } from '../../components';
import type { CheckerScreenProps } from '../../navigation/types';

interface BodyArea {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const BODY_AREAS: BodyArea[] = [
  { id: 'head', label: 'Head & Face', icon: 'eye-outline' },
  { id: 'chest', label: 'Chest', icon: 'accessibility-outline' },
  { id: 'abdomen', label: 'Belly / Abdomen', icon: 'accessibility-outline' },
  { id: 'back', label: 'Back', icon: 'accessibility-outline' },
  { id: 'arms', label: 'Arms & Hands', icon: 'hand-left-outline' },
  { id: 'legs', label: 'Legs & Feet', icon: 'footsteps-outline' },
  { id: 'diaper', label: 'Diaper Area', icon: 'refresh-outline' },
  { id: 'skin_general', label: 'Skin (general)', icon: 'color-palette-outline' },
  { id: 'mouth', label: 'Mouth / Throat', icon: 'chatbubble-ellipses-outline' },
  { id: 'umbilical', label: 'Umbilical Cord', icon: 'medical-outline' },
];

export function CheckerVisualScreen({ navigation, route }: CheckerScreenProps<'CheckerVisual'>) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const { sessionId } = route.params;

  const [selectedAreas, setSelectedAreas] = useState<Set<string>>(new Set());

  const handleToggle = (areaId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAreas((prev) => {
      const next = new Set(prev);
      if (next.has(areaId)) next.delete(areaId);
      else next.add(areaId);
      return next;
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.base, paddingTop: 8, paddingBottom: spacing.sm }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ height: 44, width: 44, justifyContent: 'center' }}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, lineHeight: 25, color: colors.textPrimary, flex: 1, marginLeft: 4 }}>
          Affected Areas
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Body diagram placeholder */}
        <Card style={{ alignItems: 'center', paddingVertical: spacing.xl, marginBottom: spacing.lg }}>
          <View
            style={{
              width: 120,
              height: 160,
              borderRadius: radii.lg,
              backgroundColor: colors.surfaceStrong,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.sm,
            }}
          >
            <Ionicons name="accessibility-outline" size={72} color={colors.textTertiary} />
          </View>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textTertiary, textAlign: 'center' }}>
            Tap areas below to indicate where{'\n'}your baby has symptoms
          </Text>
        </Card>

        {/* Body area grid */}
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary, marginBottom: spacing.sm }}>
          Select affected areas
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {BODY_AREAS.map((area) => {
            const isSelected = selectedAreas.has(area.id);
            return (
              <TouchableOpacity
                key={area.id}
                onPress={() => handleToggle(area.id)}
                activeOpacity={0.85}
                style={{
                  width: '48%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderRadius: radii.md,
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                  borderWidth: 1,
                  borderColor: isSelected ? colors.primary : colors.border,
                  marginBottom: spacing.sm,
                  marginRight: '2%',
                  minHeight: 48,
                }}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
              >
                <Ionicons
                  name={area.icon}
                  size={20}
                  color={isSelected ? colors.textInverse : colors.icon}
                  style={{ marginRight: spacing.xs }}
                />
                <Text
                  style={{
                    fontFamily: 'Inter_500Medium',
                    fontSize: 14,
                    color: isSelected ? colors.textInverse : colors.textPrimary,
                    flex: 1,
                  }}
                >
                  {area.label}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={16} color={colors.textInverse} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          title="Continue to Results"
          onPress={() => navigation.navigate('CheckerResult', { sessionId })}
          fullWidth
          style={{ marginTop: spacing.md }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
