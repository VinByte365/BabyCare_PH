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
import type { ProfileScreenProps } from '../../navigation/types';

interface CombinedHistoryItem {
  id: string;
  check_type: 'skin' | 'symptom';
  created_at: string;
  detected_class: string | null;
  confidence: number | null;
  confidence_passed: boolean;
  input_method: string | null;
  selected_symptom_count: number | null;
  matched_disease_count: number | null;
  highest_severity: string | null;
  is_emergency: boolean;
}

interface PaginatedCombinedResponse {
  items: CombinedHistoryItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

type HistoryFilter = 'all' | 'skin_check' | 'symptom_check';

const PAGE_SIZE = 10;

export function ProfileHistoryScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const [filter, setFilter] = useState<HistoryFilter>('all');
  const [items, setItems] = useState<CombinedHistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchHistory = useCallback(async (pageNum: number, replace: boolean) => {
    try {
      const data = await api.get<PaginatedCombinedResponse>(`/history/all?page=${pageNum}&page_size=${PAGE_SIZE}`);
      if (replace) {
        setItems(data.items || []);
      } else {
        setItems((prev) => [...prev, ...(data.items || [])]);
      }
      setTotalPages(data.total_pages);
      setPage(pageNum);
    } catch {
      if (replace) setItems([]);
    }
  }, []);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    await fetchHistory(1, true);
    setLoading(false);
  }, [fetchHistory]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHistory(1, true);
    setRefreshing(false);
  }, [fetchHistory]);

  const onEndReached = useCallback(async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    await fetchHistory(page + 1, false);
    setLoadingMore(false);
  }, [loadingMore, page, totalPages, fetchHistory]);

  const filteredItems = items.filter((item) => {
    if (filter === 'skin_check') return item.check_type === 'skin';
    if (filter === 'symptom_check') return item.check_type === 'symptom';
    return true;
  });

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const severityBadgeVariant = (severity: string | null) => {
    if (severity === 'emergency') return 'emergency' as const;
    if (severity === 'urgent') return 'moderate' as const;
    if (severity === 'moderate') return 'info' as const;
    return 'low' as const;
  };

  const severityBadgeLabel = (severity: string | null) => {
    if (!severity) return 'Checked';
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  const renderItem = ({ item }: { item: CombinedHistoryItem }) => (
    <Card style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radii.md,
          backgroundColor: item.check_type === 'skin' ? colors.surfaceStrong : '#f0f0ff',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.sm,
        }}
      >
        <Ionicons
          name={item.check_type === 'skin' ? 'color-palette-outline' : 'medkit-outline'}
          size={20}
          color={item.check_type === 'skin' ? colors.iconActive : '#6366f1'}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary }}>
          {item.check_type === 'skin'
            ? (item.detected_class || 'Skin Check')
            : 'Symptom Check'}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textTertiary, marginRight: spacing.xs }}>
            {formatDate(item.created_at)}
          </Text>
          {item.check_type === 'skin' ? (
            item.confidence_passed && item.detected_class ? (
              <Badge label={item.detected_class} variant="info" />
            ) : (
              <Badge label="Inconclusive" variant="low" />
            )
          ) : (
            <Badge
              label={severityBadgeLabel(item.highest_severity)}
              variant={severityBadgeVariant(item.highest_severity)}
            />
          )}
        </View>
      </View>
      {item.check_type === 'symptom' && item.matched_disease_count != null && item.matched_disease_count > 0 && (
        <View
          style={{
            backgroundColor: colors.surfaceStrong,
            borderRadius: radii.pill,
            paddingVertical: 2,
            paddingHorizontal: 8,
          }}
        >
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: colors.textSecondary }}>
            {item.matched_disease_count} match{item.matched_disease_count !== 1 ? 'es' : ''}
          </Text>
        </View>
      )}
    </Card>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ alignItems: 'center', paddingVertical: spacing.base }}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
        <Ionicons name="time-outline" size={48} color={colors.textTertiary} />
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' }}>
          No history yet
        </Text>
      </View>
    );
  };

  const filterOptions: { key: HistoryFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'skin_check', label: 'Skin Checks' },
    { key: 'symptom_check', label: 'Symptom Checks' },
  ];

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
      <View style={{ paddingHorizontal: spacing.base, paddingBottom: spacing.sm }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filterOptions}
          keyExtractor={(f) => f.key}
          renderItem={({ item: f }) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 16,
                borderRadius: radii.pill,
                backgroundColor: filter === f.key ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: filter === f.key ? colors.primary : colors.border,
                marginRight: spacing.xs,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Inter_500Medium',
                  fontSize: 13,
                  color: filter === f.key ? colors.textInverse : colors.textSecondary,
                }}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* List */}
      {loading ? (
        <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xxl }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
        />
      )}
    </SafeAreaView>
  );
}
