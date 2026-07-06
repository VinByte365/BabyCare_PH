/**
 * BabyGuide PH — Navigation Types
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// ── Root Stack ─────────────────────────────────────────
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
};

// ── Auth Stack ─────────────────────────────────────────
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

// ── Main Bottom Tabs ───────────────────────────────────
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList> | undefined;
  CheckerTab: NavigatorScreenParams<CheckerStackParamList> | undefined;
  LibraryTab: NavigatorScreenParams<LibraryStackParamList> | undefined;
  CommunityTab: NavigatorScreenParams<CommunityStackParamList> | undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

// ── Home Stack ─────────────────────────────────────────
export type HomeStackParamList = {
  Home: undefined;
  Notifications: undefined;
  EmergencyGuide: undefined;
  EmergencyAlert: undefined;
  CareGuidance: undefined;
  CareGuidanceDetail: { guideId: string };
};

// ── Checker Stack ──────────────────────────────────────
export type CheckerStackParamList = {
  CheckerIntro: undefined;
  CheckerQuestions: { sessionId: string };
  CheckerVisual: { sessionId: string };
  CheckerResult: { sessionId: string; symptomIds?: string[] };
  SkinCheckIntro: undefined;
  SkinCheckCamera: { inputMethod: 'camera' | 'gallery' };
  SkinCheckResult: {
    sessionId?: string;
    detectedClass?: string;
    confidence?: number;
    conditionContent?: SkinConditionContent | null;
    predicted: boolean;
    message?: string;
  };
};

// ── Library Stack ──────────────────────────────────────
export type LibraryStackParamList = {
  LibrarySearch: undefined;
  LibraryCategory: { categoryId: string; categoryName: string };
  DiseaseDetail: { diseaseId: string };
};

// ── Community Stack ────────────────────────────────────
export type CommunityStackParamList = {
  CommunityFeed: undefined;
  CommunityPost: { postId: string };
  CreatePost: undefined;
};

// ── Profile Stack ──────────────────────────────────────
export type ProfileStackParamList = {
  ProfileOverview: undefined;
  ParentProfile: undefined;
  BabyProfile: { babyId?: string };
  ProfileHistory: undefined;
  MedicalHistory: undefined;
  VaccinationRecord: undefined;
  GrowthTracking: { babyId: string };
  Settings: undefined;
};

// ── Skin Check Types ──────────────────────────────────
export interface SkinConditionContent {
  name: string;
  description: string;
  severity: string;
  recommendation: string;
  when_to_seek_care: string;
  home_care: string;
  disclaimer: string;
}

// ── Screen Props helpers ───────────────────────────────
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type HomeScreenProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

export type CheckerScreenProps<T extends keyof CheckerStackParamList> =
  NativeStackScreenProps<CheckerStackParamList, T>;

export type LibraryScreenProps<T extends keyof LibraryStackParamList> =
  NativeStackScreenProps<LibraryStackParamList, T>;

export type CommunityScreenProps<T extends keyof CommunityStackParamList> =
  NativeStackScreenProps<CommunityStackParamList, T>;

export type ProfileScreenProps<T extends keyof ProfileStackParamList> =
  NativeStackScreenProps<ProfileStackParamList, T>;
