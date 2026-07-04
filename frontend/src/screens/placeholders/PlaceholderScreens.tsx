import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { EmptyState } from '../../components';

export function ProfileOverviewScreen() {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <EmptyState
        icon={<Ionicons name="person-outline" size={64} color={theme.colors.iconActive} />}
        title="Your Profile"
        message="Manage your parent and baby profiles, view medical history, vaccination records, and growth tracking."
      />
    </SafeAreaView>
  );
}

export function NotificationsScreen() {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <EmptyState
        icon={<Ionicons name="notifications-outline" size={64} color={theme.colors.iconActive} />}
        title="Notifications"
        message="Your medication reminders, vaccination schedules, and emergency alerts will appear here."
      />
    </SafeAreaView>
  );
}
