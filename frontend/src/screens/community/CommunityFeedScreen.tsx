import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Badge, Chip, SkeletonCard } from '../../components';
import type { CommunityScreenProps } from '../../navigation/types';
import { getCategoryLabel } from '../../lib/communityData';
import { logEvent } from '../../lib/analytics';
import { useNetworkStore } from '../../lib/networkStore';
import { api } from '../../lib/api';

interface PostUser {
  id: string;
  name: string;
  avatar_url: string | null;
  role: string;
  verified: boolean;
}

interface PostSummary {
  id: string;
  user: PostUser;
  title: string;
  body: string;
  category: string;
  created_at: string;
  comment_count: number;
  likes_count: number;
  is_pinned: boolean;
  is_reviewed: boolean;
  liked_by_current_user: boolean;
}

interface PaginatedResponse {
  items: PostSummary[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'health', label: 'Health' },
  { id: 'feeding', label: 'Feeding' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'vaccination', label: 'Vaccines' },
  { id: 'development', label: 'Development' },
  { id: 'general', label: 'General' },
] as const;

const PAGE_SIZE = 10;

function PostCard({ post, onPress }: { post: PostSummary; onPress: () => void }) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;

  return (
    <Card onPress={onPress} style={{ marginBottom: spacing.sm }}>
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
            {new Date(post.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {post.is_pinned && <Ionicons name="pin" size={14} color={colors.textLink} style={{ marginRight: 4 }} />}
          <Badge label={getCategoryLabel(post.category as any)} variant="info" />
        </View>
      </View>

      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary, marginBottom: 4 }}>
        {post.title}
      </Text>
      <Text
        style={{ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: colors.textSecondary }}
        numberOfLines={3}
      >
        {post.body}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.divider }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: spacing.md }}>
          <Ionicons
            name={post.liked_by_current_user ? 'heart' : 'heart-outline'}
            size={16}
            color={post.liked_by_current_user ? colors.danger : colors.icon}
            style={{ marginRight: 4 }}
          />
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textTertiary }}>{post.likes_count}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: spacing.md }}>
          <Ionicons name="chatbubble-outline" size={16} color={colors.icon} style={{ marginRight: 4 }} />
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textTertiary }}>{post.comment_count}</Text>
        </View>
        {post.is_reviewed && (
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
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const isConnected = useNetworkStore((s) => s.isConnected);

  const fetchPosts = useCallback(async (pageNum: number, replace: boolean) => {
    try {
      const catParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
      const data = await api.get<PaginatedResponse>(`/posts/?page=${pageNum}&page_size=${PAGE_SIZE}${catParam}`);
      if (replace) {
        setPosts(data.items || []);
      } else {
        setPosts((prev) => [...prev, ...(data.items || [])]);
      }
      setTotalPages(data.total_pages);
      setPage(pageNum);
    } catch {
      if (replace) setPosts([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    logEvent('community_feed_viewed').catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setPosts([]);
    setPage(1);
    fetchPosts(1, true).then(() => setLoading(false));
  }, [fetchPosts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts(1, true);
    setRefreshing(false);
  }, [fetchPosts]);

  const onEndReached = useCallback(async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    await fetchPosts(page + 1, false);
    setLoadingMore(false);
  }, [loadingMore, page, totalPages, fetchPosts]);

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
      {loading ? (
        <View style={{ paddingHorizontal: spacing.base }}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ marginBottom: spacing.sm }}>
              <SkeletonCard />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xxl }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
          }
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onPress={() => {
                logEvent('community_post_viewed', { postId: item.id }).catch(() => {});
                navigation.navigate('CommunityPost', { postId: item.id });
              }}
            />
          )}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: spacing.base, alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textTertiary }}>Loading more...</Text>
              </View>
            ) : null
          }
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
