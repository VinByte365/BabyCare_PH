import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Badge } from '../../components';
import type { HomeScreenProps } from '../../navigation/types';
import { CARE_GUIDES, searchCareGuides } from '../../lib/careGuidance';
import { useBookmarkStore } from '../../lib/bookmarkStore';

export function CareGuidanceScreen({ navigation }: HomeScreenProps<'CareGuidance'>) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const [searchQuery, setSearchQuery] = useState('');
  const bookmarks = useBookmarkStore((s) => s.bookmarks);

  const results = useMemo(() => searchCareGuides(searchQuery), [searchQuery]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ paddingHorizontal: spacing.base, paddingVertical: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: spacing.sm }} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={colors.iconActive} />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 22, lineHeight: 28, color: colors.textPrimary, flex: 1 }}>
            Care Guidance
          </Text>
        </View>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, marginBottom: spacing.sm }}>
          Step-by-step guides for managing common newborn conditions.
        </Text>
        {/* Search */}
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
            placeholder="Search guides..."
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

      {/* Guide List */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSaved = bookmarks.some((b) => b.id === item.id);
          return (
            <Card
              onPress={() => navigation.navigate('CareGuidanceDetail', { guideId: item.id })}
              style={{ marginBottom: spacing.sm }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: theme.radii.md,
                    backgroundColor: colors.surfaceStrong,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: spacing.sm,
                  }}
                >
                  <Ionicons name="document-text-outline" size={22} color={colors.iconActive} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    <Text
                      style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary, flex: 1 }}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    {isSaved && <Ionicons name="bookmark" size={16} color={colors.textLink} style={{ marginLeft: 4 }} />}
                  </View>
                  <Text
                    style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: spacing.xs }}
                    numberOfLines={2}
                  >
                    {item.summary}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Badge label={item.category} variant="info" />
                    {item.estimatedMinutes && (
                      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.textTertiary, marginLeft: spacing.xs }}>
                        ~{item.estimatedMinutes} min
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </Card>
          );
        }}
        ListEmptyComponent={
          <View style={{ flex: 1, paddingTop: 60, alignItems: 'center' }}>
            <Ionicons name="search-outline" size={48} color={colors.icon} />
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary, textAlign: 'center', marginTop: spacing.sm }}>
              No matching guides
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs, paddingHorizontal: spacing.xl }}>
              Try a different search term.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
