import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Button, Chip, Badge, Toast } from '../../components';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

interface VaccinationRecord {
  id: string;
  baby_id: string;
  vaccine_name: string;
  dose_number: number | null;
  date_administered: string;
  administered_by: string | null;
  location: string | null;
  notes: string | null;
  next_due_date: string | null;
  created_at: string;
}

interface BabyOption {
  id: string;
  name: string;
  sex: 'male' | 'female';
}

const emptyForm = {
  vaccine_name: '',
  dose_number: '',
  date_administered: '',
  administered_by: '',
  location: '',
  notes: '',
  next_due_date: '',
};

const commonVaccines = [
  'BCG', 'Hepatitis B', 'DPT', 'Polio (IPV)', 'OPV',
  'Pentavalent', 'PCV', 'Rotavirus', 'MMR', 'Influenza',
  'Varicella', 'Hepatitis A', 'HPV', 'COVID-19',
];

export function VaccinationRecordScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const babies = useAuthStore((s) => s.babies) as BabyOption[];

  const [selectedBabyId, setSelectedBabyId] = useState<string>('');
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<VaccinationRecord | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (babies.length > 0 && !selectedBabyId) {
      setSelectedBabyId(babies[0].id);
    }
  }, [babies]);

  const fetchRecords = useCallback(async (babyId: string) => {
    if (!babyId) return;
    try {
      const data = await api.get<VaccinationRecord[]>(`/vaccinations/?baby_id=${babyId}`);
      setRecords(data || []);
    } catch {
      setRecords([]);
    }
  }, []);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    if (selectedBabyId) await fetchRecords(selectedBabyId);
    setLoading(false);
  }, [selectedBabyId, fetchRecords]);

  useEffect(() => {
    loadInitial();
  }, [selectedBabyId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (selectedBabyId) await fetchRecords(selectedBabyId);
    setRefreshing(false);
  }, [selectedBabyId, fetchRecords]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
  };

  const openAdd = () => {
    setEditingRecord(null);
    setForm(emptyForm);
    setModalVisible(true);
  };

  const openEdit = (record: VaccinationRecord) => {
    setEditingRecord(record);
    setForm({
      vaccine_name: record.vaccine_name,
      dose_number: record.dose_number != null ? String(record.dose_number) : '',
      date_administered: record.date_administered,
      administered_by: record.administered_by || '',
      location: record.location || '',
      notes: record.notes || '',
      next_due_date: record.next_due_date || '',
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.vaccine_name.trim()) {
      showToast('Please enter the vaccine name');
      return;
    }
    if (!form.date_administered.trim()) {
      showToast('Please enter the date administered');
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        baby_id: selectedBabyId,
        vaccine_name: form.vaccine_name.trim(),
        date_administered: form.date_administered.trim(),
        administered_by: form.administered_by.trim() || null,
        location: form.location.trim() || null,
        notes: form.notes.trim() || null,
        next_due_date: form.next_due_date.trim() || null,
      };
      if (form.dose_number) {
        payload.dose_number = parseInt(form.dose_number, 10);
      }

      if (editingRecord) {
        await api.put(`/vaccinations/${editingRecord.id}`, payload);
        showToast('Vaccination updated');
      } else {
        await api.post('/vaccinations/', payload);
        showToast('Vaccination added');
      }

      setModalVisible(false);
      await fetchRecords(selectedBabyId);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save vaccination');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (record: VaccinationRecord) => {
    Alert.alert('Remove Record', `Delete "${record.vaccine_name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/vaccinations/${record.id}`);
            showToast('Vaccination removed');
            await fetchRecords(selectedBabyId);
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to delete vaccination');
          }
        },
      },
    ]);
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return iso;
    }
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    try {
      return new Date(dueDate) < new Date();
    } catch {
      return false;
    }
  };

  const renderItem = ({ item }: { item: VaccinationRecord }) => {
    const overdue = isOverdue(item.next_due_date);
    return (
      <TouchableOpacity onPress={() => openEdit(item)} activeOpacity={0.7}>
        <Card style={{ marginBottom: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{ width: 40, height: 40, borderRadius: radii.md, backgroundColor: colors.surfaceStrong, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm }}>
              <Ionicons name="shield-checkmark-outline" size={20} color={overdue ? colors.danger : colors.iconActive} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary }}>
                {item.vaccine_name}
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
                {item.dose_number != null ? `Dose ${item.dose_number} — ` : ''}Administered {formatDate(item.date_administered)}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xs }}>
                {overdue && <Badge label="Overdue" variant="emergency" />}
                {item.next_due_date && !overdue && (
                  <Badge label={`Due ${formatDate(item.next_due_date)}`} variant="reminder" />
                )}
              </View>
              {item.administered_by && (
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textTertiary, marginTop: 4 }}>
                  Given by {item.administered_by}{item.location ? ` at ${item.location}` : ''}
                </Text>
              )}
              {item.notes && (
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary, marginTop: 4, lineHeight: 17 }} numberOfLines={2}>
                  {item.notes}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={() => handleDelete(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ padding: 4 }}>
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
        <Ionicons name="shield-checkmark-outline" size={48} color={colors.textTertiary} />
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' }}>
          No vaccination records yet
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.base, paddingTop: 8, paddingBottom: spacing.sm }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ height: 44, width: 44, justifyContent: 'center' }}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, lineHeight: 25, color: colors.textPrimary, flex: 1, marginLeft: 4 }}>
          Vaccination Record
        </Text>
        <TouchableOpacity onPress={openAdd} style={{ height: 44, width: 44, justifyContent: 'center', alignItems: 'flex-end' }}>
          <Ionicons name="add-circle-outline" size={26} color={colors.iconActive} />
        </TouchableOpacity>
      </View>

      {/* Baby selector */}
      {babies.length > 1 && (
        <View style={{ paddingHorizontal: spacing.base, paddingBottom: spacing.sm }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {babies.map((baby) => (
              <Chip
                key={baby.id}
                label={baby.name}
                selected={selectedBabyId === baby.id}
                onPress={() => setSelectedBabyId(baby.id)}
                style={{ marginRight: spacing.xs }}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* List */}
      {loading ? (
        <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xxl }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
          }
        />
      )}

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.base, paddingTop: 8, paddingBottom: spacing.sm }}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ height: 44, width: 44, justifyContent: 'center' }}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, lineHeight: 25, color: colors.textPrimary, flex: 1, marginLeft: 4 }}>
              {editingRecord ? 'Edit Vaccination' : 'Add Vaccination'}
            </Text>
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xxl }} showsVerticalScrollIndicator={false}>
            <Card style={{ padding: spacing.lg }}>
              {/* Vaccine Name */}
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
                Vaccine
              </Text>
              <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, height: 44, marginBottom: spacing.sm }}>
                <TextInput
                  value={form.vaccine_name}
                  onChangeText={(t) => setForm({ ...form, vaccine_name: t })}
                  placeholder="Vaccine name"
                  placeholderTextColor={colors.placeholder}
                  style={{ flex: 1, height: '100%', fontSize: 16, color: colors.textPrimary, fontFamily: 'Inter_400Regular' }}
                />
              </View>
              {/* Quick vaccine chips */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.base }}>
                {commonVaccines.map((v) => (
                  <Chip
                    key={v}
                    label={v}
                    selected={form.vaccine_name === v}
                    onPress={() => setForm({ ...form, vaccine_name: v })}
                    style={{ marginRight: spacing.xs, marginBottom: spacing.xs }}
                  />
                ))}
              </ScrollView>

              {/* Dose Number */}
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
                Dose Number (optional)
              </Text>
              <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, height: 44, marginBottom: spacing.base }}>
                <TextInput
                  value={form.dose_number}
                  onChangeText={(t) => setForm({ ...form, dose_number: t.replace(/[^0-9]/g, '') })}
                  placeholder="e.g. 1, 2, 3"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="number-pad"
                  style={{ flex: 1, height: '100%', fontSize: 16, color: colors.textPrimary, fontFamily: 'Inter_400Regular' }}
                />
              </View>

              {/* Date Administered */}
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
                Date Administered
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, height: 44, marginBottom: spacing.base }}>
                <Ionicons name="calendar-outline" size={20} color={colors.placeholder} style={{ marginRight: 8 }} />
                <TextInput
                  value={form.date_administered}
                  onChangeText={(t) => setForm({ ...form, date_administered: t })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="number-pad"
                  maxLength={10}
                  style={{ flex: 1, height: '100%', fontSize: 16, color: colors.textPrimary, fontFamily: 'Inter_400Regular' }}
                />
              </View>

              {/* Next Due Date */}
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
                Next Due Date (optional)
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, height: 44, marginBottom: spacing.base }}>
                <Ionicons name="calendar-outline" size={20} color={colors.placeholder} style={{ marginRight: 8 }} />
                <TextInput
                  value={form.next_due_date}
                  onChangeText={(t) => setForm({ ...form, next_due_date: t })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="number-pad"
                  maxLength={10}
                  style={{ flex: 1, height: '100%', fontSize: 16, color: colors.textPrimary, fontFamily: 'Inter_400Regular' }}
                />
              </View>

              {/* Administered By */}
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
                Administered By (optional)
              </Text>
              <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, height: 44, marginBottom: spacing.base }}>
                <TextInput
                  value={form.administered_by}
                  onChangeText={(t) => setForm({ ...form, administered_by: t })}
                  placeholder="Nurse or doctor name"
                  placeholderTextColor={colors.placeholder}
                  style={{ flex: 1, height: '100%', fontSize: 16, color: colors.textPrimary, fontFamily: 'Inter_400Regular' }}
                />
              </View>

              {/* Location */}
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
                Location (optional)
              </Text>
              <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, height: 44, marginBottom: spacing.base }}>
                <TextInput
                  value={form.location}
                  onChangeText={(t) => setForm({ ...form, location: t })}
                  placeholder="Health center or hospital"
                  placeholderTextColor={colors.placeholder}
                  style={{ flex: 1, height: '100%', fontSize: 16, color: colors.textPrimary, fontFamily: 'Inter_400Regular' }}
                />
              </View>

              {/* Notes */}
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
                Notes (optional)
              </Text>
              <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, paddingVertical: 8, marginBottom: spacing.lg }}>
                <TextInput
                  value={form.notes}
                  onChangeText={(t) => setForm({ ...form, notes: t })}
                  placeholder="Additional notes..."
                  placeholderTextColor={colors.placeholder}
                  multiline
                  numberOfLines={3}
                  style={{ fontSize: 16, color: colors.textPrimary, fontFamily: 'Inter_400Regular', minHeight: 60, textAlignVertical: 'top' }}
                />
              </View>

              <Button title={editingRecord ? 'Save Changes' : 'Add Vaccination'} onPress={handleSave} loading={saving} fullWidth />
            </Card>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Toast visible={toastVisible} message={toastMsg} onHide={() => setToastVisible(false)} type="success" />
    </SafeAreaView>
  );
}
