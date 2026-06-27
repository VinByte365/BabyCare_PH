# BabyGuide PH: System Functionalities and Modules

Based on Chapters 1–3 of the BabyGuide PH study (Objectives, Scope, Design Procedure, and Flowcharts), the following modules and functionalities are necessary for system development.

## Core Functional Modules

### 1. Symptom Checker Module
- Guided symptom input form for parents to enter observed signs in their newborn
- Decision-tree algorithm that processes input symptoms against the disease/symptom database
- Automated preliminary assessment of possible conditions
- Generation of care recommendations (home care steps and/or referral to a health professional)

### 2. Disease and Symptom Database / Information Module
- Searchable and browsable database of common newborn diseases (e.g., neonatal jaundice, neonatal sepsis, respiratory distress, colic, umbilical cord infection, skin conditions, feeding difficulties)
- Evidence-based content covering symptoms, causes, treatment, prevention, and when to seek medical care
- Content management capability for the Medical Content Review Panel (pediatric professionals) to validate and update entries

### 3. Care Guidance Module
- Step-by-step home care instructions tied to identified symptoms/conditions
- Content framework linking assessment results to actionable advice

### 4. Emergency Alert Module
- Automatic detection/trigger when symptoms indicate a serious or urgent condition
- Display of emergency instructions and nearest healthcare facility information

### 5. Community Support Module
- Peer-to-peer interaction feature for parents to connect with one another
- Curated Q&A content filtered/moderated by health professionals

### 6. User Interaction Logging / Analytics Module
- Anonymized logging of feature usage (symptom checker frequency, feature usage patterns, session duration)
- Aggregated data storage in an analytics database to support app improvement and content updates

### 7. Offline Capability
- Core features (e.g., disease information access) functional without an active internet connection

## Supporting System Requirements

### 8. User Authentication Module
- Account registration and login (e.g., email/mobile number and password, with option for social/Google sign-in)
- Secure password handling (hashing, password reset/recovery)
- Session management and logout
- Role-based access for different user types (first-time parent users vs. pediatric health professionals/content reviewers)

### 9. User Profile Module
- Parent profile setup and management (name, contact details, account preferences)
- Baby/infant profile management (name, date of birth, sex, birth details) to support age-relevant content and recommendations
- Ability to update or edit profile information
- Profile-linked history of symptom checks and saved/bookmarked content

### 10. Home Dashboard / Navigation
- Central access point to all modules (Symptom Checker, Disease Information, Care Guidance, Emergency Alert, Community)
- Ability to return to dashboard from any module

### 11. Security and Privacy Compliance
- Secure handling and storage of user health data
- Compliance with data privacy standards for sensitive health information

### 12. Cross-Platform Compatibility
- Functional on both iOS and Android

## Theme, UI, and Animation (Expo Go / React Native)

Since BabyGuide PH is a baby monitoring and health companion app, the visual design should feel calm, trustworthy, and legible to sleep-deprived first-time parents — never clinical/cold, never cluttered. The guidance below targets a native build runnable in **Expo Go**, using libraries available in the Expo managed workflow (no custom native modules required).

### 12.1 Theme / Design Tokens
- **Color palette** (soft, nurturing, low eye-strain for night use):
  - Primary: `#7FB3A3` (sage/mint green — calm, "healthy")
  - Secondary: `#FFB6A3` (soft coral — warmth, used for highlights/CTAs)
  - Background (light mode): `#FDFBF7` (warm off-white)
  - Background (dark/night mode): `#1B2027` (soft charcoal, for night feedings)
  - Alert/Emergency: `#E0524C` (muted red — urgent but not alarming)
  - Text: `#2E3A36` (dark sage-gray, softer than pure black)
- **Dark Mode / Night Mode**: essential for a baby app — parents check symptoms at 2 AM. Implement via `useColorScheme()` (Expo/React Native built-in) with a manual toggle override stored in `AsyncStorage` or `expo-secure-store`.
- **Typography**:
  - Display/headings: a rounded, friendly sans-serif (e.g., **Nunito** or **Quicksand** via `expo-font` / `@expo-google-fonts`)
  - Body text: a highly legible humanist sans-serif (e.g., **Inter** or **Lato**) for dense health content
  - Minimum body font size of 16px; scalable with the OS's accessibility text-size settings
- **Iconography**: rounded, soft-edged icon set (`@expo/vector-icons` — Feather or Ionicons rounded variants) rather than sharp/clinical icons
- **Spacing & shape**: generous padding, large tap targets (min 44x44pt), rounded corners (12–16px radius) on cards and buttons to feel approachable rather than institutional

### 12.2 Core UI Components/Screens
- **Onboarding/Welcome carousel** — swipeable intro screens (`react-native-pager-view` or `react-native-reanimated-carousel`) introducing app purpose and disclaimers
- **Home Dashboard** — card-based grid/list (Symptom Checker, Disease Info, Care Guidance, Emergency, Community) using `FlatList`/`ScrollView` with elevation/shadow for depth
- **Symptom Checker flow** — multi-step guided form with a progress indicator (stepper UI), large touch-friendly selectable chips/checkboxes for symptoms
- **Disease Info library** — searchable list with a sticky search bar (`@react-navigation` header + `TextInput`), filter chips by category, expandable accordion cards for details
- **Emergency Alert screen** — high-contrast, distraction-free layout with a prominent call-to-action button (e.g., "Call Nearest Facility") using `expo-linking` to trigger phone calls/maps
- **Community/Forum feed** — chat-bubble or card-feed layout, with clear visual separation between parent posts and verified health-professional responses (e.g., a badge/checkmark)
- **Profile / Baby Profile screens** — form-based UI with `expo-image-picker` for baby photo, date picker (`@react-native-community/datetimepicker`) for birth date
- **Bottom Tab Navigation** — `@react-navigation/bottom-tabs` for primary navigation (Home, Checker, Library, Community, Profile)

### 12.3 Animations & Micro-interactions
All animations should be achievable with **`react-native-reanimated`**, **`react-native-gesture-handler`**, **`expo-haptics`**, and **`lottie-react-native`** — all Expo Go–compatible without custom native code.

- **Splash/loading animation**: a gentle Lottie animation (e.g., a breathing/heartbeat motif or a soft pulsing logo) shown via `expo-splash-screen` + `lottie-react-native`
- **Onboarding transitions**: smooth horizontal slide/fade between carousel screens (`react-native-reanimated` shared values)
- **Symptom Checker progress**: animated progress bar that fills smoothly as steps are completed; gentle scale/bounce feedback when a symptom chip is selected (paired with light haptic feedback via `expo-haptics`)
- **Results reveal**: fade-and-slide-up animation when the assessment/recommendation card appears, to soften the moment of receiving health information
- **Emergency Alert pulse**: a subtle pulsing/glow animation around the alert icon or button to draw attention without inducing panic (avoid harsh flashing/strobing)
- **Pull-to-refresh & list loading**: skeleton loading placeholders (`react-native-skeleton-placeholder` or custom `reanimated` shimmer) instead of plain spinners, for a polished feel
- **Tab/navigation transitions**: subtle icon scale/color animation on active tab (via `@react-navigation` + `reanimated`)
- **Empty states**: light, friendly Lottie illustrations (e.g., a sleeping baby icon) for empty community feeds or no-search-results states
- **Reduced motion support**: respect `AccessibilityInfo.isReduceMotionEnabled()` so animations gracefully degrade to simple fades for users with motion sensitivity

### 12.4 Suggested Expo-Compatible Libraries
| Purpose | Library |
|---|---|
| Navigation | `@react-navigation/native`, `@react-navigation/bottom-tabs` |
| Animation | `react-native-reanimated`, `lottie-react-native` |
| Gestures | `react-native-gesture-handler` |
| Haptics | `expo-haptics` |
| Fonts | `expo-font`, `@expo-google-fonts/*` |
| Icons | `@expo/vector-icons` |
| Forms/Date | `@react-native-community/datetimepicker` |
| Local storage | `expo-secure-store`, `@react-native-async-storage/async-storage` |
| Image picking | `expo-image-picker` |
| Phone/Maps linking (Emergency) | `expo-linking` |
| Notifications (future) | `expo-notifications` |