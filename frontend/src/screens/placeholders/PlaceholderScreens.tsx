/**
 * BabyGuide PH — Placeholder Screens
 *
 * Minimal placeholder screens for tabs that will be fleshed out in later phases.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { EmptyState } from '../../components';

// ── Checker ────────────────────────────────────────────
export function CheckerIntroScreen() {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <EmptyState
        icon={<Ionicons name="medkit-outline" size={64} color={theme.colors.primary} />}
        title="Symptom Checker"
        message="Answer guided questions about your baby's symptoms and get preliminary assessments with care recommendations."
      />
    </SafeAreaView>
  );
}

// ── Library ────────────────────────────────────────────
export function LibrarySearchScreen() {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <EmptyState
        icon={<Ionicons name="library-outline" size={64} color={theme.colors.info} />}
        title="Disease Library"
        message="Browse and search through common newborn conditions. Evidence-based information about symptoms, causes, treatment, and when to seek help."
      />
    </SafeAreaView>
  );
}

// ── Community ──────────────────────────────────────────
export function CommunityFeedScreen() {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <EmptyState
        icon={<Ionicons name="people-outline" size={64} color={theme.colors.secondary} />}
        title="Community"
        message="Connect with other parents, ask questions, and get guidance from verified health professionals."
      />
    </SafeAreaView>
  );
}

// ── Profile ────────────────────────────────────────────
export function ProfileOverviewScreen() {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <EmptyState
        icon={<Ionicons name="person-outline" size={64} color={theme.colors.primary} />}
        title="Your Profile"
        message="Manage your parent and baby profiles, view medical history, vaccination records, and growth tracking."
      />
    </SafeAreaView>
  );
}

// ── Notifications ──────────────────────────────────────
export function NotificationsScreen() {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <EmptyState
        icon={<Ionicons name="notifications-outline" size={64} color={theme.colors.accent} />}
        title="Notifications"
        message="Your medication reminders, vaccination schedules, and emergency alerts will appear here."
      />
    </SafeAreaView>
  );
}

// ── Emergency Guide ────────────────────────────────────
export function EmergencyGuideScreen() {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <EmptyState
        icon={<Ionicons name="alert-circle-outline" size={64} color={theme.colors.danger} />}
        title="Emergency Guide"
        message="Know the warning signs and emergency levels. Find nearest hospitals and emergency hotlines."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
