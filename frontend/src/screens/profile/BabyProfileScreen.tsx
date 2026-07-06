import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTheme } from '../../theme';
import { Card, Button, Chip } from '../../components';
import { AvatarPicker } from '../../components/AvatarPicker';
import { Toast } from '../../components/Toast';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../lib/api';
import type { ProfileScreenProps } from '../../navigation/types';

export function BabyProfileScreen({ navigation, route }: any) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const babies = useAuthStore((s) => s.babies);
  const addBaby = useAuthStore((s) => s.addBaby);
  const updateBaby = useAuthStore((s) => s.updateBaby);
  const removeBaby = useAuthStore((s) => s.removeBaby);
  const fetchBabies = useAuthStore((s) => s.fetchBabies);

  const babyId = route?.params?.babyId;
  const existingBaby = babyId ? babies.find((b) => b.id === babyId) : null;
  const isEditing = !!existingBaby;

  const [name, setName] = useState(existingBaby?.name || '');
  const [sex, setSex] = useState<'male' | 'female'>(existingBaby?.sex || 'male');
  const [dateOfBirth, setDateOfBirth] = useState(
    existingBaby?.dateOfBirth ? new Date(existingBaby.dateOfBirth) : new Date()
  );
  const [avatarUri, setAvatarUri] = useState(existingBaby?.avatarUrl || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setToastMessage('Please enter the baby\'s name');
      setToastVisible(true);
      return;
    }

    const formattedDate = dateOfBirth.toISOString().split('T')[0];
    setSaving(true);

    try {
      if (isEditing) {
        await api.put(`/babies/${babyId}`, {
          name: name.trim(),
          sex,
          date_of_birth: formattedDate,
        });
        updateBaby(babyId, {
          name: name.trim(),
          sex,
          dateOfBirth: formattedDate,
          avatarUrl: avatarUri || undefined,
        });
        setToastMessage('Baby profile updated');
      } else {
        const created = await api.post<{ id: string }>('/babies/', {
          name: name.trim(),
          sex,
          date_of_birth: formattedDate,
        });
        addBaby({
          id: created.id,
          name: name.trim(),
          sex,
          dateOfBirth: formattedDate,
          avatarUrl: avatarUri || undefined,
        });
        setToastMessage('Baby profile added');
      }
      setToastVisible(true);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save baby profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    setSaving(true);
    try {
      await api.delete(`/babies/${babyId}`);
      removeBaby(babyId);
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to delete baby profile.');
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.base, paddingTop: 8, paddingBottom: spacing.sm }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ height: 44, width: 44, justifyContent: 'center' }}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, lineHeight: 25, color: colors.textPrimary, flex: 1, marginLeft: 4 }}>
          {isEditing ? 'Edit Baby' : 'Add Baby'}
        </Text>
        {saving && <ActivityIndicator size="small" color={colors.primary} />}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xxl }} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={{ alignItems: 'center', marginVertical: spacing.xl }}>
          <AvatarPicker
            uri={avatarUri}
            size={96}
            onImagePicked={setAvatarUri}
          />
        </View>

        {/* Form */}
        <Card style={{ padding: spacing.lg }}>
          {/* Name */}
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
            Baby's Name
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, height: 44, marginBottom: spacing.base }}>
            <Ionicons name="happy-outline" size={20} color={colors.placeholder} style={{ marginRight: 8 }} />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Full name"
              placeholderTextColor={colors.placeholder}
              style={{ flex: 1, height: '100%', fontSize: 16, color: colors.textPrimary, fontFamily: 'Inter_400Regular' }}
            />
          </View>

          {/* Sex */}
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
            Sex
          </Text>
          <View style={{ flexDirection: 'row', marginBottom: spacing.base }}>
            <Chip
              label="Boy"
              selected={sex === 'male'}
              onPress={() => setSex('male')}
              icon={<Ionicons name="man-outline" size={16} color={sex === 'male' ? colors.textInverse : colors.textPrimary} />}
              style={{ marginRight: spacing.sm }}
            />
            <Chip
              label="Girl"
              selected={sex === 'female'}
              onPress={() => setSex('female')}
              icon={<Ionicons name="woman-outline" size={16} color={sex === 'female' ? colors.textInverse : colors.textPrimary} />}
            />
          </View>

          {/* Date of Birth */}
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
            Date of Birth
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, height: 44, marginBottom: spacing.lg }}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.placeholder} style={{ marginRight: 8 }} />
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 16, color: colors.textPrimary, flex: 1 }}>
              {dateOfBirth.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.placeholder} />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          <Button
            title={isEditing ? 'Save Changes' : 'Add Baby'}
            onPress={handleSave}
            loading={saving}
            fullWidth
          />

          {isEditing && (
            <Button
              title="Remove Baby Profile"
              onPress={handleDelete}
              variant="danger"
              fullWidth
              loading={saving}
              style={{ marginTop: spacing.sm }}
            />
          )}
        </Card>
      </ScrollView>

      <Toast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
        type="success"
      />
    </SafeAreaView>
  );
}
