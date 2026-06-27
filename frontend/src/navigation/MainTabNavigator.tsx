/**
 * BabyGuide PH — Main Tab Navigator
 *
 * Bottom tab navigation with 5 tabs:
 * Home | Symptom Checker | Disease Library | Community | Profile
 *
 * Each tab has its own stack navigator.
 */

import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

import type {
  MainTabParamList,
  HomeStackParamList,
  CheckerStackParamList,
  LibraryStackParamList,
  CommunityStackParamList,
  ProfileStackParamList,
} from './types';

// ── Screens ────────────────────────────────────────────
import { HomeScreen } from '../screens/home/HomeScreen';
import {
  CheckerIntroScreen,
  LibrarySearchScreen,
  CommunityFeedScreen,
  ProfileOverviewScreen,
  NotificationsScreen,
  EmergencyGuideScreen,
} from '../screens/placeholders/PlaceholderScreens';

// ── Stack Navigators ───────────────────────────────────
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
    </HomeStack.Navigator>
  );
}

function CheckerStackNavigator() {
  return (
    <CheckerStack.Navigator screenOptions={{ headerShown: false }}>
      <CheckerStack.Screen name="CheckerIntro" component={CheckerIntroScreen} />
    </CheckerStack.Navigator>
  );
}

function LibraryStackNavigator() {
  return (
    <LibraryStack.Navigator screenOptions={{ headerShown: false }}>
      <LibraryStack.Screen name="LibrarySearch" component={LibrarySearchScreen} />
    </LibraryStack.Navigator>
  );
}

function CommunityStackNavigator() {
  return (
    <CommunityStack.Navigator screenOptions={{ headerShown: false }}>
      <CommunityStack.Screen name="CommunityFeed" component={CommunityFeedScreen} />
    </CommunityStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileOverview" component={ProfileOverviewScreen} />
    </ProfileStack.Navigator>
  );
}

// ── Bottom Tabs ────────────────────────────────────────
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
  const { colors, shadows: s, typography: t } = theme;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 64,
          ...s.navigation,
        },
        tabBarLabelStyle: {
          fontFamily: t.caption.fontFamily,
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
            <Ionicons
              name={focused ? tabConfig.HomeTab.iconFocused : tabConfig.HomeTab.iconOutline}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CheckerTab"
        component={CheckerStackNavigator}
        options={{
          tabBarLabel: tabConfig.CheckerTab.label,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? tabConfig.CheckerTab.iconFocused : tabConfig.CheckerTab.iconOutline}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="LibraryTab"
        component={LibraryStackNavigator}
        options={{
          tabBarLabel: tabConfig.LibraryTab.label,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? tabConfig.LibraryTab.iconFocused : tabConfig.LibraryTab.iconOutline}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CommunityTab"
        component={CommunityStackNavigator}
        options={{
          tabBarLabel: tabConfig.CommunityTab.label,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? tabConfig.CommunityTab.iconFocused : tabConfig.CommunityTab.iconOutline}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: tabConfig.ProfileTab.label,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? tabConfig.ProfileTab.iconFocused : tabConfig.ProfileTab.iconOutline}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
