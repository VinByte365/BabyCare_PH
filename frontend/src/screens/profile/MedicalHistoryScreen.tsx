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

interface MedicalRecord {
  id: string;
  baby_id: string;
  condition_name: string;
  diagnosis_date: string;
  treating_doctor: string | null;
  hospital: string | null;
  notes: string | null;
  is_chronic: boolean;
  is_active: boolean;
  created_at: string;
}

interface BabyOption {
  id: string;
  name: string;
  sex: 'male' | 'female';
}

const emptyForm = {
  condition_name: '',
  diagnosis_date: '',
  treating_doctor: '',
  hospital: '',
  notes: '',
  is_chronic: false,
  is_active: true,
};

export function MedicalHistoryScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const babies = useAuthStore((s) => s.babies) as BabyOption[];

  const [selectedBabyId, setSelectedBabyId] = useState<string>('');
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
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
      const data = await api.get<MedicalRecord[]>(`/medical-history/?baby_id=${babyId}`);
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

  const openEdit = (record: MedicalRecord) => {
    setEditingRecord(record);
    setForm({
      condition_name: record.condition_name,
      diagnosis_date: record.diagnosis_date,
      treating_doctor: record.treating_doctor || '',
      hospital: record.hospital || '',
      notes: record.notes || '',
      is_chronic: record.is_chronic,
      is_active: record.is_active,
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.condition_name.trim()) {
      showToast('Please enter the condition name');
      return;
    }
    if (!form.diagnosis_date.trim()) {
      showToast('Please enter the diagnosis date');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        baby_id: selectedBabyId,
        condition_name: form.condition_name.trim(),
        diagnosis_date: form.diagnosis_date.trim(),
        treating_doctor: form.treating_doctor.trim() || null,
        hospital: form.hospital.trim() || null,
        notes: form.notes.trim() || null,
        is_chronic: form.is_chronic,
        is_active: form.is_active,
      };

      if (editingRecord) {
        await api.put(`/medical-history/${editingRecord.id}`, payload);
        showToast('Record updated');
      } else {
        await api.post('/medical-history/', payload);
        showToast('Record added');
      }

      setModalVisible(false);
      await fetchRecords(selectedBabyId);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save record');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (record: MedicalRecord) => {
    Alert.alert('Remove Record', `Delete "${record.condition_name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/medical-history/${record.id}`);
            showToast('Record removed');
            await fetchRecords(selectedBabyId);
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to delete record');
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

  const renderItem = ({ item }: { item: MedicalRecord }) => (
    <TouchableOpacity onPress={() => openEdit(item)} activeOpacity={0.7}>
      <Card style={{ marginBottom: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{ width: 40, height: 40, borderRadius: radii.md, backgroundColor: colors.surfaceStrong, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm }}>
            <Ionicons name="medkit-outline" size={20} color={colors.iconActive} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary }}>
              {item.condition_name}
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
              Diagnosed {formatDate(item.diagnosis_date)}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xs }}>
              {item.is_chronic && <Badge label="Chronic" variant="moderate" />}
              {!item.is_active && <Badge label="Inactive" variant="low" />}
              {item.is_active && !item.is_chronic && <Badge label="Active" variant="info" />}
            </View>
            {item.treating_doctor && (
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textTertiary, marginTop: 4 }}>
                Dr. {item.treating_doctor}{item.hospital ? ` — ${item.hospital}` : ''}
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

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
        <Ionicons name="medkit-outline" size={48} color={colors.textTertiary} />
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' }}>
          No medical history recorded yet
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
          Medical History
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
              {editingRecord ? 'Edit Record' : 'Add Record'}
            </Text>
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xxl }} showsVerticalScrollIndicator={false}>
            <Card style={{ padding: spacing.lg }}>
              {/* Condition Name */}
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
                Condition Name
              </Text>
              <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, height: 44, marginBottom: spacing.base }}>
                <TextInput
                  value={form.condition_name}
                  onChangeText={(t) => setForm({ ...form, condition_name: t })}
                  placeholder="e.g. Asthma, Eczema"
                  placeholderTextColor={colors.placeholder}
                  style={{ flex: 1, height: '100%', fontSize: 16, color: colors.textPrimary, fontFamily: 'Inter_400Regular' }}
                />
              </View>

              {/* Diagnosis Date */}
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
                Diagnosis Date
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, height: 44, marginBottom: spacing.base }}>
                <Ionicons name="calendar-outline" size={20} color={colors.placeholder} style={{ marginRight: 8 }} />
                <TextInput
                  value={form.diagnosis_date}
                  onChangeText={(t) => setForm({ ...form, diagnosis_date: t })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="number-pad"
                  maxLength={10}
                  style={{ flex: 1, height: '100%', fontSize: 16, color: colors.textPrimary, fontFamily: 'Inter_400Regular' }}
                />
              </View>

              {/* Treating Doctor */}
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
                Treating Doctor (optional)
              </Text>
              <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, height: 44, marginBottom: spacing.base }}>
                <TextInput
                  value={form.treating_doctor}
                  onChangeText={(t) => setForm({ ...form, treating_doctor: t })}
                  placeholder="Doctor's name"
                  placeholderTextColor={colors.placeholder}
                  style={{ flex: 1, height: '100%', fontSize: 16, color: colors.textPrimary, fontFamily: 'Inter_400Regular' }}
                />
              </View>

              {/* Hospital */}
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
                Hospital / Clinic (optional)
              </Text>
              <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, height: 44, marginBottom: spacing.base }}>
                <TextInput
                  value={form.hospital}
                  onChangeText={(t) => setForm({ ...form, hospital: t })}
                  placeholder="Hospital or clinic name"
                  placeholderTextColor={colors.placeholder}
                  style={{ flex: 1, height: '100%', fontSize: 16, color: colors.textPrimary, fontFamily: 'Inter_400Regular' }}
                />
              </View>

              {/* Notes */}
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs }}>
                Notes (optional)
              </Text>
              <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, paddingVertical: 8, marginBottom: spacing.base }}>
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

              {/* Toggles */}
              <View style={{ flexDirection: 'row', marginBottom: spacing.lg }}>
                <Chip
                  label="Chronic"
                  selected={form.is_chronic}
                  onPress={() => setForm({ ...form, is_chronic: !form.is_chronic })}
                  style={{ marginRight: spacing.sm }}
                />
                <Chip
                  label="Active"
                  selected={form.is_active}
                  onPress={() => setForm({ ...form, is_active: !form.is_active })}
                />
              </View>

              <Button title={editingRecord ? 'Save Changes' : 'Add Record'} onPress={handleSave} loading={saving} fullWidth />
            </Card>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Toast visible={toastVisible} message={toastMsg} onHide={() => setToastVisible(false)} type="success" />
    </SafeAreaView>
  );
}
