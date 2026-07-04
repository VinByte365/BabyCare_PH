import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Badge, Chip, SkeletonCard } from '../../components';
import type { CommunityScreenProps } from '../../navigation/types';
import {
  COMMUNITY_POSTS,
  getCategoryLabel,
} from '../../lib/communityData';
import type { CommunityPost } from '../../lib/communityData';
import { logEvent } from '../../lib/analytics';
import { useNetworkStore } from '../../lib/networkStore';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'health', label: 'Health' },
  { id: 'feeding', label: 'Feeding' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'vaccination', label: 'Vaccines' },
  { id: 'development', label: 'Development' },
  { id: 'general', label: 'General' },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  health: '#0d74ce',
  feeding: '#16a34a',
  sleep: '#8145b5',
  vaccination: '#ab6400',
  development: '#47c2ff',
  general: '#999999',
};

function PostCard({
  post,
  onPress,
}: {
  post: CommunityPost;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;

  return (
    <Card onPress={onPress} style={{ marginBottom: spacing.sm }}>
      {/* Header: user info */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: radii.full,
            backgroundColor: post.user.verified ? colors.textLink + '20' : colors.surfaceStrong,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.sm,
          }}
        >
          <Ionicons
            name={post.user.role === 'professional' ? 'medkit' : 'person'}
            size={20}
            color={post.user.verified ? colors.textLink : colors.iconActive}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginRight: 4 }}>
              {post.user.name}
            </Text>
            {post.user.verified && (
              <Ionicons name="checkmark-circle" size={14} color={colors.textLink} />
            )}
          </View>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.textTertiary }}>
            {new Date(post.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {post.isPinned && <Ionicons name="pin" size={14} color={colors.textLink} style={{ marginRight: 4 }} />}
          <Badge label={getCategoryLabel(post.category)} variant="info" />
        </View>
      </View>

      {/* Title & Body */}
      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary, marginBottom: 4 }}>
        {post.title}
      </Text>
      <Text
        style={{ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: colors.textSecondary }}
        numberOfLines={3}
      >
        {post.body}
      </Text>

      {/* Stats */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.divider }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: spacing.md }}>
          <Ionicons name="heart-outline" size={16} color={colors.icon} style={{ marginRight: 4 }} />
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textTertiary }}>{post.likes}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: spacing.md }}>
          <Ionicons name="chatbubble-outline" size={16} color={colors.icon} style={{ marginRight: 4 }} />
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textTertiary }}>{post.commentCount}</Text>
        </View>
        {post.isReviewed && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
            <Ionicons name="shield-checkmark" size={14} color={colors.success} style={{ marginRight: 4 }} />
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.success }}>Reviewed</Text>
          </View>
        )}
      </View>
    </Card>
  );
}

export function CommunityFeedScreen({ navigation }: CommunityScreenProps<'CommunityFeed'>) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const isConnected = useNetworkStore((s) => s.isConnected);

  useEffect(() => {
    logEvent('community_feed_viewed').catch(() => {});
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredPosts = selectedCategory === 'all'
    ? COMMUNITY_POSTS
    : COMMUNITY_POSTS.filter((p) => p.category === selectedCategory);

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ paddingHorizontal: spacing.base, paddingTop: spacing.sm, paddingBottom: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 22, lineHeight: 28, color: colors.textPrimary }}>
            Community
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreatePost')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: theme.radii.md,
              backgroundColor: colors.primary,
            }}
          >
            <Ionicons name="add" size={18} color={colors.textInverse} style={{ marginRight: 4 }} />
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.textInverse }}>
              New Post
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary }}>
          Connect with other parents and health professionals.
        </Text>
        {!isConnected && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs }}>
            <Ionicons name="cloud-offline-outline" size={12} color={colors.warning} style={{ marginRight: 4 }} />
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.warning }}>
              Offline — posts will be queued
            </Text>
          </View>
        )}
      </View>

      {/* Category Chips */}
      <View style={{ paddingBottom: spacing.sm }}>
        <FlatList
          horizontal
          data={CATEGORIES}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.base }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginRight: spacing.xs }}>
              <Chip
                label={item.label}
                selected={selectedCategory === item.id}
                onPress={() => setSelectedCategory(item.id)}
              />
            </View>
          )}
        />
      </View>

      {/* Post List */}
      {isLoading ? (
        <View style={{ paddingHorizontal: spacing.base }}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ marginBottom: spacing.sm }}>
              <SkeletonCard />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={sortedPosts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xxl }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onPress={() => {
                logEvent('community_post_viewed', { postId: item.id }).catch(() => {});
                navigation.navigate('CommunityPost', { postId: item.id });
              }}
            />
          )}
          ListEmptyComponent={
            <View style={{ flex: 1, paddingTop: 60, alignItems: 'center' }}>
              <Ionicons name="chatbubbles-outline" size={48} color={colors.icon} />
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary, textAlign: 'center', marginTop: spacing.sm }}>
                No posts in this category
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs, paddingHorizontal: spacing.xl }}>
                Be the first to start a discussion!
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
