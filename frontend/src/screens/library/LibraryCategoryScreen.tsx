import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Badge } from '../../components';
import type { LibraryScreenProps } from '../../navigation/types';
import {
  getDiseasesByCategory,
  getCategoryDisplayName,
} from '../../lib/diseaseLibrary';
import type { DiseaseCategory } from '../../lib/diseaseLibrary';

const severityColors: Record<string, string> = {
  emergency: '#eb8e90',
  urgent: '#ab6400',
  moderate: '#0d74ce',
  low: '#16a34a',
};

export function LibraryCategoryScreen({ navigation, route }: LibraryScreenProps<'LibraryCategory'>) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const { categoryId, categoryName } = route.params;

  const diseases = useMemo(
    () => getDiseasesByCategory(categoryId as DiseaseCategory),
    [categoryId],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.base,
          paddingVertical: spacing.sm,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: spacing.sm }} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.iconActive} />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: 'Inter_600SemiBold',
            fontSize: 18,
            color: colors.textPrimary,
            flex: 1,
          }}
        >
          {categoryName}
        </Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textTertiary }}>
          {diseases.length} condition{diseases.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={diseases}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: spacing.base,
          paddingBottom: spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card
            onPress={() => navigation.navigate('DiseaseDetail', { diseaseId: item.id })}
            style={{ marginBottom: spacing.sm }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: theme.radii.md,
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
                    style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary, flex: 1 }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
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
                  style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary, lineHeight: 18 }}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              </View>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <View style={{ flex: 1, paddingTop: 60, alignItems: 'center' }}>
            <Ionicons name="folder-open-outline" size={48} color={colors.icon} />
            <Text
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 16,
                color: colors.textPrimary,
                textAlign: 'center',
                marginTop: spacing.sm,
              }}
            >
              No conditions in this category
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
