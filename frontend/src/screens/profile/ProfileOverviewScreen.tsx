import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Button } from '../../components';
import { AvatarPicker } from '../../components/AvatarPicker';
import { useAuthStore } from '../../stores/authStore';
import type { ProfileScreenProps } from '../../navigation/types';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
}

export function ProfileOverviewScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const user = useAuthStore((s) => s.user);
  const babies = useAuthStore((s) => s.babies);
  const updateUser = useAuthStore((s) => s.updateUser);
  const logout = useAuthStore((s) => s.logout);
  const fetchBabies = useAuthStore((s) => s.fetchBabies);

  useEffect(() => {
    fetchBabies();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => logout(),
        },
      ],
    );
  };

  const menuSections: { title?: string; items: MenuItem[] }[] = [
    {
      items: [
        {
          icon: 'person-outline',
          label: 'Edit Parent Profile',
          onPress: () => navigation.navigate('ParentProfile'),
        },
        {
          icon: 'time-outline',
          label: 'History',
          onPress: () => navigation.navigate('ProfileHistory'),
        },
        
      ],
    },
    {
      title: 'Medical',
      items: [
        {
          icon: 'medkit-outline',
          label: 'Medical History',
          onPress: () => navigation.navigate('MedicalHistory'),
        },
        {
          icon: 'shield-checkmark-outline',
          label: 'Vaccination Record',
          onPress: () => navigation.navigate('VaccinationRecord'),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile Header ──────────────────────── */}
        <View style={{ alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.xl }}>
          <AvatarPicker
            uri={user?.avatarUrl}
            size={88}
            onImagePicked={(uri) => updateUser({ avatarUrl: uri })}
          />
          <Text
            style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 22,
              lineHeight: 28,
              color: colors.textPrimary,
              marginTop: spacing.sm,
            }}
          >
            {user ? `${user.firstName} ${user.lastName}` : 'User'}
          </Text>
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 14,
              color: colors.textSecondary,
              marginTop: 2,
            }}
          >
            {user?.email}
          </Text>
          <View
            style={{
              marginTop: spacing.xs,
              paddingVertical: 4,
              paddingHorizontal: 10,
              borderRadius: radii.pill,
              backgroundColor: colors.surfaceStrong,
            }}
          >
            <Text
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 11,
                letterSpacing: 0.88,
                textTransform: 'uppercase',
                color: colors.textTertiary,
              }}
            >
              {user?.role === 'professional' ? 'Healthcare Worker' : 'Parent'}
            </Text>
          </View>
        </View>

        {/* ── Baby Profiles ───────────────────────── */}
        <View style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, lineHeight: 25, color: colors.textPrimary }}>
              Baby Profiles
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('BabyProfile', {})}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="add-circle-outline" size={24} color={colors.iconActive} />
            </TouchableOpacity>
          </View>

          {babies.length === 0 ? (
            <Card style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
              <Ionicons name="happy-outline" size={40} color={colors.textTertiary} />
              <Text
                style={{
                  fontFamily: 'Inter_400Regular',
                  fontSize: 14,
                  color: colors.textSecondary,
                  marginTop: spacing.sm,
                  textAlign: 'center',
                }}
              >
                No baby profiles yet.{'\n'}Tap + to add one.
              </Text>
            </Card>
          ) : (
            babies.map((baby) => (
              <Card
                key={baby.id}
                onPress={() => navigation.navigate('BabyProfile', { babyId: baby.id })}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: radii.full,
                    backgroundColor: colors.surfaceStrong,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: spacing.base,
                  }}
                >
                  {baby.avatarUrl ? (
                    <AvatarPicker
                      uri={baby.avatarUrl}
                      size={48}
                      onImagePicked={() => {}}
                      editable={false}
                    />
                  ) : (
                    <Ionicons
                      name={baby.sex === 'male' ? 'man-outline' : 'woman-outline'}
                      size={24}
                      color={colors.iconActive}
                    />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary }}>
                    {baby.name}
                  </Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
                    {baby.dateOfBirth} &middot; {baby.sex === 'male' ? 'Boy' : 'Girl'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
              </Card>
            ))
          )}
        </View>

        {/* ── Menu Sections ───────────────────────── */}
        {menuSections.map((section, sIdx) => (
          <View key={sIdx} style={{ marginBottom: spacing.md }}>
            {section.title && (
              <Text
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 11,
                  letterSpacing: 0.88,
                  textTransform: 'uppercase',
                  color: colors.textTertiary,
                  marginBottom: spacing.xs,
                  marginLeft: 4,
                }}
              >
                {section.title}
              </Text>
            )}
            <Card noPadding style={{ overflow: 'hidden' }}>
              {section.items.map((item, iIdx) => (
                <TouchableOpacity
                  key={iIdx}
                  onPress={item.onPress}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 14,
                    paddingHorizontal: spacing.base,
                    borderBottomWidth: iIdx < section.items.length - 1 ? 1 : 0,
                    borderBottomColor: colors.divider,
                  }}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={item.color || colors.icon}
                    style={{ marginRight: spacing.sm }}
                  />
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 16, color: colors.textPrimary, flex: 1 }}>
                    {item.label}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        {/* ── Logout ──────────────────────────────── */}
        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="danger"
          fullWidth
          style={{ marginTop: spacing.md }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
