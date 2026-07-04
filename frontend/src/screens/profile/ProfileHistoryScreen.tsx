import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Badge } from '../../components';
import type { ProfileScreenProps } from '../../navigation/types';

interface HistoryItem {
  id: string;
  type: 'symptom_check' | 'bookmark' | 'guidance';
  title: string;
  date: string;
  badge?: string;
}

const mockHistory: HistoryItem[] = [
  {
    id: '1',
    type: 'symptom_check',
    title: 'Fever & Rash Assessment',
    date: 'Jun 28, 2026',
    badge: 'COMPLETED',
  },
  {
    id: '2',
    type: 'guidance',
    title: 'Newborn Jaundice Care Guide',
    date: 'Jun 25, 2026',
    badge: 'SAVED',
  },
  {
    id: '3',
    type: 'bookmark',
    title: 'Breastfeeding Positioning',
    date: 'Jun 22, 2026',
    badge: 'BOOKMARK',
  },
  {
    id: '4',
    type: 'symptom_check',
    title: 'Cough & Cold Assessment',
    date: 'Jun 18, 2026',
    badge: 'COMPLETED',
  },
  {
    id: '5',
    type: 'bookmark',
    title: 'Vaccination Schedule 0-12 Months',
    date: 'Jun 15, 2026',
    badge: 'BOOKMARK',
  },
];

const typeIcons: Record<HistoryItem['type'], keyof typeof Ionicons.glyphMap> = {
  symptom_check: 'medkit-outline',
  bookmark: 'bookmark-outline',
  guidance: 'document-text-outline',
};

export function ProfileHistoryScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const [filter, setFilter] = useState<HistoryItem['type'] | 'all'>('all');

  const filteredHistory = filter === 'all' ? mockHistory : mockHistory.filter((h) => h.type === filter);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.base, paddingTop: 8, paddingBottom: spacing.sm }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ height: 44, width: 44, justifyContent: 'center' }}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, lineHeight: 25, color: colors.textPrimary, flex: 1, marginLeft: 4 }}>
          History
        </Text>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.sm }}
        style={{ flexGrow: 0 }}
      >
        {(['all', 'symptom_check', 'bookmark', 'guidance'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 16,
              borderRadius: radii.pill,
              backgroundColor: filter === f ? colors.primary : colors.surface,
              borderWidth: 1,
              borderColor: filter === f ? colors.primary : colors.border,
              marginRight: spacing.xs,
            }}
          >
            <Text
              style={{
                fontFamily: 'Inter_500Medium',
                fontSize: 13,
                color: filter === f ? colors.textInverse : colors.textSecondary,
              }}
            >
              {f === 'all' ? 'All' : f === 'symptom_check' ? 'Symptom Checks' : f === 'bookmark' ? 'Bookmarks' : 'Guidance'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {filteredHistory.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
            <Ionicons name="time-outline" size={48} color={colors.textTertiary} />
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' }}>
              No history yet
            </Text>
          </View>
        ) : (
          filteredHistory.map((item) => (
            <Card key={item.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
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
                <Ionicons name={typeIcons[item.type]} size={20} color={colors.iconActive} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary }}>
                  {item.title}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textTertiary, marginRight: spacing.xs }}>
                    {item.date}
                  </Text>
                  {item.badge && <Badge label={item.badge} variant="info" />}
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
