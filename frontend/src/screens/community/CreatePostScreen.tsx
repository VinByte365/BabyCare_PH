import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Button, Chip } from '../../components';
import type { CommunityScreenProps } from '../../navigation/types';
import { logEvent } from '../../lib/analytics';
import { useNetworkStore } from '../../lib/networkStore';
import { enqueueAction } from '../../lib/offlineQueue';
import { api } from '../../lib/api';

const CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'feeding', label: 'Feeding' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'health', label: 'Health' },
  { id: 'development', label: 'Development' },
  { id: 'vaccination', label: 'Vaccination' },
] as const;

export function CreatePostScreen({ navigation }: CommunityScreenProps<'CreatePost'>) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<string>('general');
  const [titleError, setTitleError] = useState('');
  const [bodyError, setBodyError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isConnected = useNetworkStore((s) => s.isConnected);

  const validate = (): boolean => {
    let valid = true;
    if (!title.trim()) {
      setTitleError('Please enter a title');
      valid = false;
    } else if (title.trim().length < 5) {
      setTitleError('Title must be at least 5 characters');
      valid = false;
    } else {
      setTitleError('');
    }

    if (!body.trim()) {
      setBodyError('Please enter your question or post content');
      valid = false;
    } else if (body.trim().length < 10) {
      setBodyError('Please provide more detail (at least 10 characters)');
      valid = false;
    } else {
      setBodyError('');
    }

    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    logEvent('community_post_created', { category }).catch(() => {});

    if (!isConnected) {
      enqueueAction({
        type: 'create_post',
        payload: { title: title.trim(), body: body.trim(), category },
      }).catch(() => {});
      setIsSubmitting(false);
      Alert.alert(
        'Post Queued',
        'You are currently offline. Your post has been saved and will be submitted when you are back online.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
      return;
    }

    try {
      await api.post('/posts/', {
        title: title.trim(),
        body: body.trim(),
        category,
      });
      setIsSubmitting(false);
      Alert.alert(
        'Post Submitted',
        'Your post has been submitted and will be reviewed by our moderation team. Thank you for contributing to the BabyGuide community!',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (err: any) {
      setIsSubmitting(false);
      Alert.alert('Error', err.message || 'Failed to submit post. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: spacing.base, paddingTop: spacing.sm, paddingBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: spacing.sm }} hitSlop={8}>
              <Ionicons name="arrow-back" size={24} color={colors.iconActive} />
            </TouchableOpacity>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 22, lineHeight: 28, color: colors.textPrimary, flex: 1 }}>
              New Post
            </Text>
          </View>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, marginLeft: 32 }}>
            Ask a question or share your experience with other parents.
          </Text>
        </View>

        {/* Form */}
        <View style={{ paddingHorizontal: spacing.base }}>
          {/* Category Selection */}
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.sm }}>
            Category
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md }}>
            {CATEGORIES.map((cat) => (
              <View key={cat.id} style={{ marginRight: spacing.xs, marginBottom: spacing.xs }}>
                <Chip
                  label={cat.label}
                  selected={category === cat.id}
                  onPress={() => setCategory(cat.id)}
                />
              </View>
            ))}
          </View>

          {/* Title */}
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
            Title
          </Text>
          <TextInput
            placeholder="Give your post a clear title..."
            placeholderTextColor={colors.placeholder}
            value={title}
            onChangeText={(t) => { setTitle(t); if (titleError) setTitleError(''); }}
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 15,
              color: colors.textPrimary,
              backgroundColor: colors.backgroundSecondary,
              borderRadius: theme.radii.md,
              borderWidth: 1,
              borderColor: titleError ? colors.danger : colors.borderLight,
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.sm,
              marginBottom: titleError ? spacing.xs : spacing.md,
            }}
            maxLength={200}
          />
          {titleError ? (
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.danger, marginBottom: spacing.sm }}>
              {titleError}
            </Text>
          ) : null}

          {/* Body */}
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
            Your Post
          </Text>
          <TextInput
            placeholder="Describe your concern or question in detail. The more information you provide, the better other parents and health professionals can help."
            placeholderTextColor={colors.placeholder}
            value={body}
            onChangeText={(b) => { setBody(b); if (bodyError) setBodyError(''); }}
            multiline
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 15,
              color: colors.textPrimary,
              backgroundColor: colors.backgroundSecondary,
              borderRadius: theme.radii.md,
              borderWidth: 1,
              borderColor: bodyError ? colors.danger : colors.borderLight,
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.sm,
              minHeight: 160,
              textAlignVertical: 'top',
              marginBottom: bodyError ? spacing.xs : spacing.md,
            }}
            maxLength={2000}
          />
          {bodyError ? (
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.danger, marginBottom: spacing.sm }}>
              {bodyError}
            </Text>
          ) : null}

          {/* Disclaimer */}
          <Card style={{ backgroundColor: colors.backgroundSecondary, marginBottom: spacing.md }}>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17, color: colors.textTertiary }}>
              Posts are reviewed by our moderation team before being visible to the community. Please be respectful and avoid sharing personal medical information.
            </Text>
          </Card>

          {/* Submit */}
          <Button
            title={isSubmitting ? 'Submitting...' : 'Submit Post'}
            onPress={handleSubmit}
            variant="primary"
            fullWidth
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
