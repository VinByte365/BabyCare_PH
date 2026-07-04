import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Badge, Button } from '../../components';
import type { CommunityScreenProps } from '../../navigation/types';
import {
  getCommunityPost,
  getCategoryLabel,
} from '../../lib/communityData';
import { logEvent } from '../../lib/analytics';
import { useNetworkStore } from '../../lib/networkStore';
import { enqueueAction } from '../../lib/offlineQueue';

export function CommunityPostScreen({ navigation, route }: CommunityScreenProps<'CommunityPost'>) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const { postId } = route.params;
  const post = getCommunityPost(postId);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState(post?.comments ?? []);
  const isConnected = useNetworkStore((s) => s.isConnected);

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

  const handleAddComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;

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

    const newComment = {
      id: `c_local_${Date.now()}`,
      postId: post.id,
      userId: 'local_user',
      user: {
        id: 'local_user',
        name: 'You',
        role: 'parent' as const,
        verified: false,
      },
      body: trimmed,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    setLocalComments([...localComments, newComment]);
    setCommentText('');
  };

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
                {new Date(post.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
            <Badge label={getCategoryLabel(post.category)} variant="info" />
          </View>

          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, color: colors.textPrimary, marginBottom: spacing.sm }}>
            {post.title}
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, color: colors.textSecondary }}>
            {post.body}
          </Text>

          {post.isReviewed && (
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
            Comments ({localComments.length})
          </Text>

          {localComments.map((comment) => (
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
                    {new Date(comment.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
              </View>
            </Card>
          ))}

          {/* Add Comment */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              marginTop: spacing.sm,
            }}
          >
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
              disabled={!commentText.trim()}
              style={{
                width: 44,
                height: 44,
                borderRadius: radii.md,
                backgroundColor: commentText.trim() ? colors.primary : colors.surfaceStrong,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name="send"
                size={18}
                color={commentText.trim() ? colors.textInverse : colors.textTertiary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
