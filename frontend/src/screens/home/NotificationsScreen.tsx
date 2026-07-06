import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Badge } from '../../components';
import { api } from '../../lib/api';
import { useNotificationStore } from '../../stores/notificationStore';
import type { HomeScreenProps } from '../../navigation/types';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string | null;
  related_id: string | null;
  is_read: boolean;
  created_at: string;
}

const typeConfig: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string; label: string }> = {
  symptom_check: { icon: 'medkit-outline', color: '#6366f1', label: 'Symptom Check' },
  skin_check: { icon: 'color-palette-outline', color: '#0d74ce', label: 'Skin Check' },
  emergency: { icon: 'alert-circle', color: '#eb8e90', label: 'Emergency' },
};

export function NotificationsScreen({ navigation }: HomeScreenProps<'Notifications'>) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const fetchUnreadCount = useNotificationStore((s) => s.fetchUnreadCount);
  const decrementCount = useNotificationStore((s) => s.decrementCount);
  const resetCount = useNotificationStore((s) => s.resetCount);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await api.get<NotificationItem[]>('/notifications/');
      setNotifications(data || []);
    } catch {
      setNotifications([]);
    }
  }, []);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    await fetchNotifications();
    await fetchUnreadCount();
    setLoading(false);
  }, [fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    await fetchUnreadCount();
    setRefreshing(false);
  }, [fetchNotifications, fetchUnreadCount]);

  const handleMarkRead = async (item: NotificationItem) => {
    if (item.is_read) return;
    try {
      await api.put(`/notifications/${item.id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
      );
      decrementCount();
    } catch {
      // silently fail
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      resetCount();
    } catch {
      // silently fail
    }
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
    } catch {
      return iso;
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const config = typeConfig[item.type] || { icon: 'notifications-outline' as const, color: colors.textSecondary, label: 'Update' };
    return (
      <TouchableOpacity onPress={() => handleMarkRead(item)} activeOpacity={0.7}>
        <Card
          style={{
            marginBottom: spacing.sm,
            borderLeftWidth: item.is_read ? 0 : 3,
            borderLeftColor: item.is_read ? 'transparent' : colors.primary,
            opacity: item.is_read ? 0.7 : 1,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: radii.md,
                backgroundColor: item.is_read ? colors.surfaceStrong : config.color + '20',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.sm,
              }}
            >
              <Ionicons name={config.icon} size={20} color={item.is_read ? colors.textTertiary : config.color} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 15,
                    color: colors.textPrimary,
                    flex: 1,
                  }}
                >
                  {item.title}
                </Text>
                {!item.is_read && (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: colors.primary,
                      marginLeft: spacing.xs,
                    }}
                  />
                )}
              </View>
              {item.body && (
                <Text
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 13,
                    color: colors.textSecondary,
                    marginTop: 2,
                    lineHeight: 18,
                  }}
                  numberOfLines={2}
                >
                  {item.body}
                </Text>
              )}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Badge label={config.label} variant="info" />
                <Text
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 11,
                    color: colors.textTertiary,
                    marginLeft: spacing.xs,
                  }}
                >
                  {formatDate(item.created_at)}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
        <Ionicons name="notifications-off-outline" size={48} color={colors.textTertiary} />
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' }}>
          No notifications yet
        </Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textTertiary, marginTop: 4, textAlign: 'center' }}>
          Notifications from symptom checks, skin checks, and other activity will appear here.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.base,
          paddingTop: 8,
          paddingBottom: spacing.sm,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ height: 44, width: 44, justifyContent: 'center' }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: 'Inter_600SemiBold',
            fontSize: 18,
            lineHeight: 25,
            color: colors.textPrimary,
            flex: 1,
            marginLeft: 4,
          }}
        >
          Notifications
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.textLink }}>
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      {loading ? (
        <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xxl }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
