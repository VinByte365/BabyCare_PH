/**
 * BabyGuide PH — Home Dashboard Screen
 *
 * The main dashboard showing quick actions, baby summary, daily tips,
 * and recent activity. This is the central hub of the app.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../theme';
import { Card, Badge } from '../../components';
import type { HomeScreenProps, MainTabParamList } from '../../navigation/types';

// ── Quick Action Data ──────────────────────────────────
const quickActions = [
  { id: 'checker', label: 'Symptom\nChecker', icon: 'medkit-outline' as const, color: '#7FB3A3' },
  { id: 'library', label: 'Disease\nLibrary', icon: 'library-outline' as const, color: '#6AABDB' },
  { id: 'emergency', label: 'Emergency\nGuide', icon: 'warning-outline' as const, color: '#E0524C' },
  { id: 'community', label: 'Community\nForum', icon: 'people-outline' as const, color: '#FFB6A3' },
];

const dailyTips = [
  {
    id: '1',
    title: 'Newborn Sleep Tips',
    body: 'Newborns typically sleep 16–17 hours a day. Place your baby on their back to reduce SIDS risk.',
    badge: 'SLEEP',
  },
  {
    id: '2',
    title: 'Breastfeeding Basics',
    body: 'Feed on demand — typically every 2–3 hours. Watch for hunger cues like rooting or lip-smacking.',
    badge: 'FEEDING',
  },
];

export function HomeScreen({ navigation }: HomeScreenProps<'Home'>) {
  const { theme } = useTheme();
  const { colors, spacing, typography: t, radii } = theme;
  const tabNavigation = navigation.getParent<BottomTabNavigationProp<MainTabParamList>>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingHorizontal: spacing.md }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────── */}
        <View style={[styles.header, { marginBottom: spacing.xl }]}>
          <View>
            <Text
              style={{
                fontFamily: t.body.fontFamily,
                fontSize: t.body.fontSize,
                color: colors.textSecondary,
              }}
            >
              Good day! 👋
            </Text>
            <Text
              style={{
                fontFamily: t.heading1.fontFamily,
                fontSize: t.heading1.fontSize,
                lineHeight: t.heading1.lineHeight,
                color: colors.textPrimary,
                marginTop: 2,
              }}
            >
              BabyGuide PH
            </Text>
          </View>

          {/* Notification bell */}
          <Card
            onPress={() => navigation.navigate('Notifications')}
            style={{
              padding: spacing.sm,
              borderRadius: radii.full,
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.icon} />
          </Card>
        </View>

        {/* ── Baby Summary Card ───────────────────── */}
        <Card
          elevated
          style={{
            marginBottom: spacing.xl,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: radii.full,
              backgroundColor: colors.primaryLight,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.md,
            }}
          >
            <Ionicons name="happy-outline" size={28} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: t.title.fontFamily,
                fontSize: t.title.fontSize,
                color: colors.textPrimary,
              }}
            >
              Your Baby
            </Text>
            <Text
              style={{
                fontFamily: t.bodySmall.fontFamily,
                fontSize: t.bodySmall.fontSize,
                color: colors.textSecondary,
                marginTop: 2,
              }}
            >
              Add your baby's profile to get personalized guidance
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </Card>

        {/* ── Quick Actions ───────────────────────── */}
        <Text
          style={{
            fontFamily: t.subtitle.fontFamily,
            fontSize: t.subtitle.fontSize,
            color: colors.textPrimary,
            marginBottom: spacing.sm,
          }}
        >
          Quick Actions
        </Text>

        <View style={[styles.quickActionsGrid, { marginBottom: spacing.xl }]}>
          {quickActions.map((action) => (
            <Card
              key={action.id}
              onPress={() => {
                switch (action.id) {
                  case 'checker':
                    tabNavigation?.navigate('CheckerTab');
                    break;
                  case 'library':
                    tabNavigation?.navigate('LibraryTab');
                    break;
                  case 'community':
                    tabNavigation?.navigate('CommunityTab');
                    break;
                  case 'emergency':
                    navigation.navigate('EmergencyGuide');
                    break;
                }
              }}
              style={{
                width: '48%',
                alignItems: 'center',
                paddingVertical: spacing.lg,
                marginBottom: spacing.sm,
              }}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: radii.lg,
                  backgroundColor: action.color + '18',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing.sm,
                }}
              >
                <Ionicons name={action.icon} size={26} color={action.color} />
              </View>
              <Text
                style={{
                  fontFamily: t.bodyBold.fontFamily,
                  fontSize: t.bodySmall.fontSize,
                  color: colors.textPrimary,
                  textAlign: 'center',
                }}
              >
                {action.label}
              </Text>
            </Card>
          ))}
        </View>

        {/* ── Daily Tips ──────────────────────────── */}
        <Text
          style={{
            fontFamily: t.subtitle.fontFamily,
            fontSize: t.subtitle.fontSize,
            color: colors.textPrimary,
            marginBottom: spacing.sm,
          }}
        >
          Daily Tips
        </Text>

        {dailyTips.map((tip) => (
          <Card
            key={tip.id}
            style={{ marginBottom: spacing.sm }}
          >
            <View style={styles.tipHeader}>
              <Text
                style={{
                  fontFamily: t.bodyBold.fontFamily,
                  fontSize: t.body.fontSize,
                  color: colors.textPrimary,
                  flex: 1,
                }}
              >
                {tip.title}
              </Text>
              <Badge label={tip.badge} variant="new" />
            </View>
            <Text
              style={{
                fontFamily: t.body.fontFamily,
                fontSize: t.bodySmall.fontSize,
                color: colors.textSecondary,
                marginTop: spacing.xs,
                lineHeight: 20,
              }}
            >
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
            <Text
              style={{
                fontFamily: t.bodyBold.fontFamily,
                fontSize: t.body.fontSize,
                color: colors.danger,
              }}
            >
              Emergency Guide
            </Text>
            <Text
              style={{
                fontFamily: t.bodySmall.fontFamily,
                fontSize: t.caption.fontSize,
                color: colors.textSecondary,
              }}
            >
              Know when to seek immediate medical help
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.danger} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
