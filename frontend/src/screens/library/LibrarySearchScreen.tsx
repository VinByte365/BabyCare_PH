import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Chip, Badge } from '../../components';
import type { LibraryScreenProps } from '../../navigation/types';
import {
  DISEASE_LIBRARY,
  LIBRARY_CATEGORIES,
  searchDiseases,
  getCategoryDisplayName,
} from '../../lib/diseaseLibrary';
import type { DiseaseCategory } from '../../lib/diseaseLibrary';
import { useBookmarkStore } from '../../lib/bookmarkStore';

const severityOrder: Record<string, number> = {
  emergency: 0,
  urgent: 1,
  moderate: 2,
  low: 3,
};

const severityColors: Record<string, string> = {
  emergency: '#eb8e90',
  urgent: '#ab6400',
  moderate: '#0d74ce',
  low: '#16a34a',
};

function DiseaseListItem({
  item,
  onPress,
}: {
  item: (typeof DISEASE_LIBRARY)[number];
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const isBookmarked = useBookmarkStore((s) => s.isBookmarked(item.id));
  const toggleBookmark = useBookmarkStore((s) => s.toggleBookmark);

  return (
    <Card onPress={onPress} style={{ marginBottom: spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: radii.md,
            backgroundColor: colors.backgroundSecondary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.sm,
          }}
        >
          <Ionicons
            name={
              item.severity === 'emergency'
                ? 'alert-circle'
                : item.severity === 'urgent'
                  ? 'warning-outline'
                  : item.severity === 'moderate'
                    ? 'information-circle-outline'
                    : 'checkmark-circle-outline'
            }
            size={22}
            color={severityColors[item.severity]}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
            <Text
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 16,
                color: colors.textPrimary,
                flex: 1,
              }}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <TouchableOpacity
              onPress={() => toggleBookmark({ id: item.id, type: 'disease', title: item.name })}
              style={{ marginRight: spacing.xs, padding: 4 }}
              hitSlop={8}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isBookmarked ? colors.primary : colors.textTertiary}
              />
            </TouchableOpacity>
            <Badge
              label={item.severity}
              variant={
                item.severity === 'emergency'
                  ? 'emergency'
                  : item.severity === 'urgent'
                    ? 'moderate'
                    : item.severity === 'moderate'
                      ? 'info'
                      : 'low'
              }
            />
          </View>
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 13,
              color: colors.textSecondary,
              lineHeight: 18,
              marginBottom: spacing.xs,
            }}
            numberOfLines={2}
          >
            {item.description}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="folder-outline" size={12} color={colors.textTertiary} style={{ marginRight: 4 }} />
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.textTertiary, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              {getCategoryDisplayName(item.category)}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

export function LibrarySearchScreen({ navigation }: LibraryScreenProps<'LibrarySearch'>) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const results = useMemo(() => {
    const searched = searchQuery ? searchDiseases(searchQuery) : DISEASE_LIBRARY;
    if (selectedCategory === 'all') return searched;
    return searched.filter((d) => d.category === selectedCategory);
  }, [searchQuery, selectedCategory]);

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => {
      const sDiff = (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99);
      if (sDiff !== 0) return sDiff;
      return a.name.localeCompare(b.name);
    });
  }, [results]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: spacing.base,
          paddingTop: spacing.sm,
          paddingBottom: spacing.sm,
          backgroundColor: colors.background,
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter_600SemiBold',
            fontSize: 22,
            lineHeight: 28,
            color: colors.textPrimary,
            marginBottom: spacing.xs,
          }}
        >
          Disease Library
        </Text>
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: spacing.sm,
          }}
        >
          Browse evidence-based information about common newborn conditions.
        </Text>
        {/* Search Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.backgroundSecondary,
            borderRadius: theme.radii.md,
            paddingHorizontal: spacing.sm,
            height: 44,
            borderWidth: 1,
            borderColor: colors.borderLight,
          }}
        >
          <Ionicons name="search-outline" size={18} color={colors.placeholder} style={{ marginRight: spacing.xs }} />
          <TextInput
            placeholder="Search conditions..."
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              fontFamily: 'Inter_400Regular',
              fontSize: 15,
              color: colors.textPrimary,
              paddingVertical: 0,
            }}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.placeholder} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter Chips */}
      <View style={{ paddingBottom: spacing.sm }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.base }}
        >
          {LIBRARY_CATEGORIES.map((cat) => (
            <View key={cat.id} style={{ marginRight: spacing.xs }}>
              <Chip
                label={cat.label}
                selected={selectedCategory === cat.id}
                onPress={() => setSelectedCategory(cat.id)}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Results List */}
      <FlatList
        data={sortedResults}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: spacing.base,
          paddingBottom: spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <DiseaseListItem
            item={item}
            onPress={() => navigation.navigate('DiseaseDetail', { diseaseId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={{ flex: 1, paddingTop: 60, alignItems: 'center' }}>
            <Ionicons name="search-outline" size={48} color={colors.icon} />
            <Text
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 16,
                color: colors.textPrimary,
                textAlign: 'center',
                marginTop: spacing.sm,
              }}
            >
              No matching conditions
            </Text>
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 14,
                color: colors.textSecondary,
                textAlign: 'center',
                marginTop: spacing.xs,
                paddingHorizontal: spacing.xl,
              }}
            >
              Try a different search term or select a different category.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
