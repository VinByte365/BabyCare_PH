import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Badge, Button } from '../../components';
import type { CommunityScreenProps } from '../../navigation/types';
import { getCategoryLabel } from '../../lib/communityData';
import { logEvent } from '../../lib/analytics';
import { useNetworkStore } from '../../lib/networkStore';
import { enqueueAction } from '../../lib/offlineQueue';
import { api } from '../../lib/api';

interface CommentUser {
  id: string;
  name: string;
  avatar_url: string | null;
  role: string;
  verified: boolean;
}

interface CommentData {
  id: string;
  post_id: string;
  user: CommentUser;
  body: string;
  likes_count: number;
  created_at: string;
}

interface PostDetail {
  id: string;
  user: CommentUser;
  title: string;
  body: string;
  category: string;
  created_at: string;
  comment_count: number;
  likes_count: number;
  is_pinned: boolean;
  is_reviewed: boolean;
  liked_by_current_user: boolean;
  comments: CommentData[];
}

export function CommunityPostScreen({ navigation, route }: CommunityScreenProps<'CommunityPost'>) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const { postId } = route.params;
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<CommentData[]>([]);
  const [sending, setSending] = useState(false);
  const isConnected = useNetworkStore((s) => s.isConnected);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const data = await api.get<PostDetail>(`/posts/${postId}`);
      setPost(data);
      setComments(data.comments || []);
    } catch {
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    const trimmed = commentText.trim();
    if (!trimmed || !post) return;

    logEvent('community_comment_added', { postId: post.id }).catch(() => {});

    if (!isConnected) {
      enqueueAction({
        type: 'add_comment',
        payload: { postId: post.id, body: trimmed },
      }).catch(() => {});
      setCommentText('');
      Alert.alert('Comment Queued', 'You are offline. Your comment will be posted when you are back online.');
      return;
    }

    setSending(true);
    try {
      const created = await api.post<CommentData>(`/posts/${post.id}/comments`, { body: trimmed });
      setComments((prev) => [...prev, created]);
      setCommentText('');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to post comment. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.icon} />
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 16, color: colors.textSecondary, marginTop: spacing.sm }}>
          Post not found
        </Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} variant="secondary" size="sm" style={{ marginTop: spacing.base }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: spacing.base, paddingTop: spacing.sm, paddingBottom: spacing.md }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: spacing.sm, alignSelf: 'flex-start' }} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={colors.iconActive} />
          </TouchableOpacity>
        </View>

        {/* Post Content Card */}
        <Card style={{ marginHorizontal: spacing.base, marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: radii.full,
                backgroundColor: post.user.verified ? colors.textLink + '20' : colors.surfaceStrong,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.sm,
              }}
            >
              <Ionicons
                name={post.user.role === 'professional' ? 'medkit' : 'person'}
                size={22}
                color={post.user.verified ? colors.textLink : colors.iconActive}
              />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary, marginRight: 4 }}>
                  {post.user.name}
                </Text>
                {post.user.verified && (
                  <Ionicons name="checkmark-circle" size={16} color={colors.textLink} />
                )}
                {post.user.role === 'professional' && (
                  <Badge label="Health Professional" variant="info" style={{ marginLeft: spacing.xs }} />
                )}
              </View>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textTertiary }}>
                {new Date(post.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
            <Badge label={getCategoryLabel(post.category as any)} variant="info" />
          </View>

          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, color: colors.textPrimary, marginBottom: spacing.sm }}>
            {post.title}
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, color: colors.textSecondary }}>
            {post.body}
          </Text>

          {post.is_reviewed && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.divider }}>
              <Ionicons name="shield-checkmark" size={16} color={colors.success} style={{ marginRight: 6 }} />
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.success }}>
                Reviewed by BabyGuide medical content team
              </Text>
            </View>
          )}
        </Card>

        {/* Comments Section */}
        <View style={{ paddingHorizontal: spacing.base }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary, marginBottom: spacing.sm }}>
            Comments ({comments.length})
          </Text>

          {comments.map((comment) => (
            <Card key={comment.id} style={{ marginBottom: spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: radii.full,
                    backgroundColor: comment.user.verified ? colors.textLink + '20' : colors.surfaceStrong,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: spacing.sm,
                    marginTop: 2,
                  }}
                >
                  <Ionicons
                    name={comment.user.role === 'professional' ? 'medkit' : 'person'}
                    size={16}
                    color={comment.user.verified ? colors.textLink : colors.iconActive}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.textPrimary, marginRight: 4 }}>
                      {comment.user.name}
                    </Text>
                    {comment.user.verified && (
                      <Ionicons name="checkmark-circle" size={12} color={colors.textLink} />
                    )}
                  </View>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: colors.textSecondary, marginBottom: 4 }}>
                    {comment.body}
                  </Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.textTertiary }}>
                    {new Date(comment.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
              </View>
            </Card>
          ))}

          {/* Add Comment */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: spacing.sm }}>
            <TextInput
              placeholder="Add a comment..."
              placeholderTextColor={colors.placeholder}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              style={{
                flex: 1,
                fontFamily: 'Inter_400Regular',
                fontSize: 14,
                color: colors.textPrimary,
                backgroundColor: colors.backgroundSecondary,
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: colors.borderLight,
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
                minHeight: 44,
                maxHeight: 100,
                marginRight: spacing.xs,
              }}
            />
            <TouchableOpacity
              onPress={handleAddComment}
              disabled={!commentText.trim() || sending}
              style={{
                width: 44,
                height: 44,
                borderRadius: radii.md,
                backgroundColor: commentText.trim() && !sending ? colors.primary : colors.surfaceStrong,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {sending ? (
                <ActivityIndicator size="small" color={colors.textInverse} />
              ) : (
                <Ionicons
                  name="send"
                  size={18}
                  color={commentText.trim() ? colors.textInverse : colors.textTertiary}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
