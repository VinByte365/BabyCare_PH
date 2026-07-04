import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../theme';
import { Card, Badge } from '../../components';
import type { HomeScreenProps, MainTabParamList } from '../../navigation/types';

const quickActions = [
  { id: 'checker', label: 'Symptom Checker', icon: 'medkit-outline' as const },
  { id: 'library', label: 'Disease Library', icon: 'library-outline' as const },
  { id: 'emergency', label: 'Emergency Guide', icon: 'warning-outline' as const },
  { id: 'community', label: 'Community Forum', icon: 'people-outline' as const },
];

const dailyTips = [
  {
    id: '1',
    title: 'Newborn Sleep Tips',
    body: 'Newborns typically sleep 16-17 hours a day. Place your baby on their back to reduce SIDS risk.',
    badge: 'SLEEP',
  },
  {
    id: '2',
    title: 'Breastfeeding Basics',
    body: 'Feed on demand - typically every 2-3 hours. Watch for hunger cues like rooting or lip-smacking.',
    badge: 'FEEDING',
  },
];

export function HomeScreen({ navigation }: HomeScreenProps<'Home'>) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const tabNavigation = navigation.getParent<BottomTabNavigationProp<MainTabParamList>>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.base, paddingTop: 8, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────── */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
          <View>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary }}>
              Good day
            </Text>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 22, lineHeight: 28, color: colors.textPrimary, marginTop: 2 }}>
              BabyGuide PH
            </Text>
          </View>
          <Card
            onPress={() => navigation.navigate('Notifications')}
            noPadding
            style={{
              width: 44,
              height: 44,
              borderRadius: radii.md,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.icon} />
          </Card>
        </View>

        {/* ── Baby Summary Card ───────────────────── */}
        <Card style={{ marginBottom: spacing.lg, flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: radii.full,
              backgroundColor: colors.surfaceStrong,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.base,
            }}
          >
            <Ionicons name="happy-outline" size={28} color={colors.iconActive} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, lineHeight: 25, color: colors.textPrimary }}>
              Your Baby
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, marginTop: 2 }}>
              Add your baby's profile to get personalized guidance
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </Card>

        {/* ── Quick Actions ───────────────────────── */}
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, lineHeight: 25, color: colors.textPrimary, marginBottom: spacing.sm }}>
          Quick Actions
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: spacing.lg }}>
          {quickActions.map((action) => (
            <Card
              key={action.id}
              onPress={() => {
                switch (action.id) {
                  case 'checker': tabNavigation?.navigate('CheckerTab'); break;
                  case 'library': tabNavigation?.navigate('LibraryTab'); break;
                  case 'community': tabNavigation?.navigate('CommunityTab'); break;
                  case 'emergency': navigation.navigate('EmergencyGuide'); break;
                }
              }}
              style={{ width: '48%', alignItems: 'center', paddingVertical: spacing.lg, marginBottom: spacing.sm }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: radii.md,
                  backgroundColor: colors.surfaceStrong,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing.sm,
                }}
              >
                <Ionicons name={action.icon} size={24} color={colors.iconActive} />
              </View>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.textPrimary, textAlign: 'center' }}>
                {action.label}
              </Text>
            </Card>
          ))}
        </View>

        {/* ── Daily Tips ──────────────────────────── */}
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, lineHeight: 25, color: colors.textPrimary, marginBottom: spacing.sm }}>
          Daily Tips
        </Text>

        {dailyTips.map((tip) => (
          <Card key={tip.id} style={{ marginBottom: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary, flex: 1 }}>
                {tip.title}
              </Text>
              <Badge label={tip.badge} variant="info" />
            </View>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs, lineHeight: 20 }}>
              {tip.body}
            </Text>
          </Card>
        ))}

        {/* ── Emergency Banner ────────────────────── */}
        <Card
          onPress={() => navigation.navigate('EmergencyGuide')}
          style={{
            marginTop: spacing.sm,
            marginBottom: spacing.xxl,
            backgroundColor: colors.danger + '10',
            borderColor: colors.danger + '30',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: radii.full,
              backgroundColor: colors.danger + '20',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.sm,
            }}
          >
            <Ionicons name="alert-circle" size={24} color={colors.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.danger }}>
              Emergency Guide
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary }}>
              Know when to seek immediate medical help
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.danger} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
