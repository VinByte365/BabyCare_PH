import React from 'react';
import { Platform, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { OfflineBanner } from '../components/OfflineBanner';

import type {
  MainTabParamList,
  HomeStackParamList,
  CheckerStackParamList,
  LibraryStackParamList,
  CommunityStackParamList,
  ProfileStackParamList,
} from './types';

import { HomeScreen } from '../screens/home/HomeScreen';
import { CareGuidanceScreen } from '../screens/home/CareGuidanceScreen';
import { CareGuidanceDetailScreen } from '../screens/home/CareGuidanceDetailScreen';
import { EmergencyGuideScreen } from '../screens/home/EmergencyGuideScreen';
import { EmergencyAlertScreen } from '../screens/home/EmergencyAlertScreen';
import { LibrarySearchScreen } from '../screens/library/LibrarySearchScreen';
import { LibraryCategoryScreen } from '../screens/library/LibraryCategoryScreen';
import { DiseaseDetailScreen } from '../screens/library/DiseaseDetailScreen';
import { CommunityFeedScreen } from '../screens/community/CommunityFeedScreen';
import { CommunityPostScreen } from '../screens/community/CommunityPostScreen';
import { CreatePostScreen } from '../screens/community/CreatePostScreen';
import {
  NotificationsScreen,
} from '../screens/placeholders/PlaceholderScreens';

import { CheckerIntroScreen } from '../screens/checker/CheckerIntroScreen';
import { CheckerQuestionsScreen } from '../screens/checker/CheckerQuestionsScreen';
import { CheckerVisualScreen } from '../screens/checker/CheckerVisualScreen';
import { CheckerResultScreen } from '../screens/checker/CheckerResultScreen';
import { SkinCheckIntroScreen } from '../screens/checker/SkinCheckIntroScreen';
import { SkinCheckCameraScreen } from '../screens/checker/SkinCheckCameraScreen';
import { SkinCheckResultScreen } from '../screens/checker/SkinCheckResultScreen';

import { ProfileOverviewScreen } from '../screens/profile/ProfileOverviewScreen';
import { ParentProfileScreen } from '../screens/profile/ParentProfileScreen';
import { BabyProfileScreen } from '../screens/profile/BabyProfileScreen';
import { ProfileHistoryScreen } from '../screens/profile/ProfileHistoryScreen';
import { MedicalHistoryScreen } from '../screens/profile/MedicalHistoryScreen';
import { VaccinationRecordScreen } from '../screens/profile/VaccinationRecordScreen';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const CheckerStack = createNativeStackNavigator<CheckerStackParamList>();
const LibraryStack = createNativeStackNavigator<LibraryStackParamList>();
const CommunityStack = createNativeStackNavigator<CommunityStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
      <HomeStack.Screen name="EmergencyGuide" component={EmergencyGuideScreen} />
      <HomeStack.Screen name="EmergencyAlert" component={EmergencyAlertScreen} />
      <HomeStack.Screen name="CareGuidance" component={CareGuidanceScreen} />
      <HomeStack.Screen name="CareGuidanceDetail" component={CareGuidanceDetailScreen} />
    </HomeStack.Navigator>
  );
}

function CheckerStackNavigator() {
  return (
    <CheckerStack.Navigator screenOptions={{ headerShown: false }}>
      <CheckerStack.Screen name="CheckerIntro" component={CheckerIntroScreen} />
      <CheckerStack.Screen name="CheckerQuestions" component={CheckerQuestionsScreen} />
      <CheckerStack.Screen name="CheckerVisual" component={CheckerVisualScreen} />
      <CheckerStack.Screen name="CheckerResult" component={CheckerResultScreen} />
      <CheckerStack.Screen name="SkinCheckIntro" component={SkinCheckIntroScreen} />
      <CheckerStack.Screen name="SkinCheckCamera" component={SkinCheckCameraScreen} />
      <CheckerStack.Screen name="SkinCheckResult" component={SkinCheckResultScreen} />
    </CheckerStack.Navigator>
  );
}

function LibraryStackNavigator() {
  return (
    <LibraryStack.Navigator screenOptions={{ headerShown: false }}>
      <LibraryStack.Screen name="LibrarySearch" component={LibrarySearchScreen} />
      <LibraryStack.Screen name="LibraryCategory" component={LibraryCategoryScreen} />
      <LibraryStack.Screen name="DiseaseDetail" component={DiseaseDetailScreen} />
    </LibraryStack.Navigator>
  );
}

function CommunityStackNavigator() {
  return (
    <CommunityStack.Navigator screenOptions={{ headerShown: false }}>
      <CommunityStack.Screen name="CommunityFeed" component={CommunityFeedScreen} />
      <CommunityStack.Screen name="CommunityPost" component={CommunityPostScreen} />
      <CommunityStack.Screen name="CreatePost" component={CreatePostScreen} />
    </CommunityStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileOverview" component={ProfileOverviewScreen} />
      <ProfileStack.Screen name="ParentProfile" component={ParentProfileScreen} />
      <ProfileStack.Screen name="BabyProfile" component={BabyProfileScreen} />
      <ProfileStack.Screen name="ProfileHistory" component={ProfileHistoryScreen} />
      <ProfileStack.Screen name="MedicalHistory" component={MedicalHistoryScreen} />
      <ProfileStack.Screen name="VaccinationRecord" component={VaccinationRecordScreen} />
      <ProfileStack.Screen name="GrowthTracking" component={NotificationsScreen} />
      <ProfileStack.Screen name="Settings" component={NotificationsScreen} />
    </ProfileStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIconName = React.ComponentProps<typeof Ionicons>['name'];

const tabConfig: Record<
  keyof MainTabParamList,
  { label: string; iconFocused: TabIconName; iconOutline: TabIconName }
> = {
  HomeTab: { label: 'Home', iconFocused: 'home', iconOutline: 'home-outline' },
  CheckerTab: { label: 'Checker', iconFocused: 'medkit', iconOutline: 'medkit-outline' },
  LibraryTab: { label: 'Library', iconFocused: 'library', iconOutline: 'library-outline' },
  CommunityTab: { label: 'Community', iconFocused: 'people', iconOutline: 'people-outline' },
  ProfileTab: { label: 'Profile', iconFocused: 'person', iconOutline: 'person-outline' },
};

export function MainTabNavigator() {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View style={{ flex: 1 }}>
      <OfflineBanner />
      <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_400Regular',
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: tabConfig.HomeTab.label,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? tabConfig.HomeTab.iconFocused : tabConfig.HomeTab.iconOutline} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CheckerTab"
        component={CheckerStackNavigator}
        options={{
          tabBarLabel: tabConfig.CheckerTab.label,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? tabConfig.CheckerTab.iconFocused : tabConfig.CheckerTab.iconOutline} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="LibraryTab"
        component={LibraryStackNavigator}
        options={{
          tabBarLabel: tabConfig.LibraryTab.label,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? tabConfig.LibraryTab.iconFocused : tabConfig.LibraryTab.iconOutline} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CommunityTab"
        component={CommunityStackNavigator}
        options={{
          tabBarLabel: tabConfig.CommunityTab.label,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? tabConfig.CommunityTab.iconFocused : tabConfig.CommunityTab.iconOutline} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: tabConfig.ProfileTab.label,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? tabConfig.ProfileTab.iconFocused : tabConfig.ProfileTab.iconOutline} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
    </View>
  );
}
