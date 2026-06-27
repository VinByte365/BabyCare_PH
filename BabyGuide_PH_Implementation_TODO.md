# BabyGuide PH: Implementation To-Do List

This task list breaks down the development of each module defined in `BabyGuide_PH_System_Functionalities.md` into actionable build steps for an **Expo Go (React Native, managed workflow)** implementation. Every UI task references the agreed **theme tokens, components, and animation specs** (color palette, typography, Lottie/Reanimated motion, haptics) so visual design stays consistent across modules.

> **Setup prerequisite (do this first):** Initialize the Expo project, install the shared libraries below, and create a global `theme.js`/`ThemeProvider` so every module pulls from the same tokens instead of redefining styles.

```
expo init BabyGuidePH
npx expo install @react-navigation/native @react-navigation/bottom-tabs
npx expo install react-native-reanimated react-native-gesture-handler
npx expo install lottie-react-native expo-haptics expo-font expo-splash-screen
npx expo install @expo/vector-icons expo-linking expo-image-picker
npx expo install expo-secure-store @react-native-async-storage/async-storage
npx expo install @react-native-community/datetimepicker
```

---

## 0. Global Theme & Foundation Setup
- [ ] Create `theme.js` with color tokens (`primary #7FB3A3`, `secondary #FFB6A3`, backgrounds `#FDFBF7` / `#1B2027`, alert `#E0524C`, text `#2E3A36`)
- [ ] Implement `ThemeProvider` using `useColorScheme()` for automatic light/dark (night) mode
- [ ] Add manual dark-mode override toggle, persisted via `AsyncStorage`
- [ ] Load custom fonts (Nunito/Quicksand for display, Inter/Lato for body) via `expo-font` + `@expo-google-fonts`
- [ ] Set up `@expo/vector-icons` (Feather/Ionicons rounded set) as the shared icon library
- [ ] Define shared spacing/radius constants (12–16px card radius, 44x44pt min tap targets)
- [ ] Build base reusable components: `Card`, `Button`, `Chip`, `Badge`, `SkeletonLoader`
- [ ] Configure `expo-splash-screen` with Lottie breathing/pulsing logo animation
- [ ] Set up `AccessibilityInfo.isReduceMotionEnabled()` check and global "reduced motion" flag for all animated components

---

## 1. User Authentication Module
- [ ] Build Login screen (email/mobile + password fields) using theme `Card`/`Button` components
- [ ] Build Registration screen with role selection (parent vs. health professional) — role-based access setup
- [ ] Implement password hashing/secure handling on backend (or auth provider, e.g., Firebase Auth)
- [ ] Implement "Forgot Password" / reset flow
- [ ] Add session management (token storage via `expo-secure-store`) and auto-login on app start
- [ ] Implement logout flow with confirmation
- [ ] Add input validation states (error shake animation via `react-native-reanimated`, paired with light haptic via `expo-haptics`)
- [ ] Apply fade/slide transition between Login ↔ Register screens

## 2. User Profile Module
- [ ] Build Parent Profile screen (name, contact, preferences) using form components
- [ ] Build Baby Profile screen (name, date of birth via `@react-native-community/datetimepicker`, sex, birth details)
- [ ] Integrate `expo-image-picker` for baby/profile photo upload with rounded-avatar preview
- [ ] Implement edit/update profile flow with save confirmation (fade-in toast/snackbar)
- [ ] Build "History" tab on profile showing past symptom checks and bookmarked content
- [ ] Apply card-based layout with soft shadows consistent with Home Dashboard styling
- [ ] Add subtle scale animation on avatar tap (image picker trigger)

## 3. Home Dashboard / Navigation Module
- [ ] Set up `@react-navigation/bottom-tabs` (Home, Checker, Library, Community, Profile)
- [ ] Build dashboard card grid linking to Symptom Checker, Disease Info, Care Guidance, Emergency, Community
- [ ] Implement `FlatList`/`ScrollView` with elevation/shadow styling per theme spec
- [ ] Add active-tab icon scale/color animation via `reanimated`
- [ ] Add "return to dashboard" affordance accessible from all module screens
- [ ] Apply onboarding/welcome carousel (`react-native-reanimated-carousel`) for first-time app launch, with slide/fade transitions and disclaimer screen

## 4. Symptom Checker Module
- [ ] Design and build decision-tree data structure/algorithm logic (backend or local JS logic)
- [ ] Build multi-step guided form UI with stepper/progress indicator component
- [ ] Build symptom selection screen using large touch-friendly chips/checkboxes
- [ ] Animate progress bar fill on step completion (`reanimated`)
- [ ] Add scale/bounce micro-interaction + haptic feedback (`expo-haptics`) on chip selection
- [ ] Implement logic to cross-reference selected symptoms against Disease & Symptom Database
- [ ] Build Results screen with fade-and-slide-up reveal animation for assessment/recommendations
- [ ] Add conditional routing: trigger Emergency Alert Module if symptoms match urgent criteria
- [ ] Log each symptom check session to Analytics Module (anonymized)

## 5. Disease and Symptom Database / Information Module
- [ ] Set up backend/database schema for diseases (symptoms, causes, treatment, prevention, when-to-seek-care fields)
- [ ] Build searchable list UI with sticky search bar in screen header
- [ ] Add filter chips by category (e.g., skin, respiratory, digestive)
- [ ] Build expandable accordion cards for disease detail view
- [ ] Implement admin/content-reviewer interface (web or in-app) for Medical Content Review Panel to add/edit/validate entries
- [ ] Cache database locally (e.g., SQLite via `expo-sqlite` or bundled JSON) to support offline access
- [ ] Add empty-state Lottie illustration for no search results

## 6. Care Guidance Module
- [ ] Link care guidance content records to corresponding disease/symptom entries
- [ ] Build step-by-step instructional UI (numbered list or card-stack layout)
- [ ] Reuse fade-and-slide-up reveal animation pattern from Symptom Checker results screen for consistency
- [ ] Add "Save/Bookmark this guidance" action tied to User Profile history

## 7. Emergency Alert Module
- [ ] Define trigger logic/criteria for urgent vs. non-urgent symptom combinations
- [ ] Build high-contrast, distraction-free Emergency screen using `#E0524C` alert color token
- [ ] Add pulsing/glow animation around alert icon (non-strobing, per reduced-motion guidelines)
- [ ] Implement "Call Nearest Facility" button using `expo-linking` (phone dial + maps)
- [ ] Display nearest healthcare facility info (static list or maps integration)
- [ ] Ensure this screen bypasses/overrides reduced-motion settings only for the pulse-to-fade fallback (never disable the alert itself)
- [ ] Log emergency-alert triggers to Analytics Module

## 8. Community Support Module
- [ ] Build community feed UI with chat-bubble/card-feed layout
- [ ] Implement visual distinction (badge/checkmark) for verified health-professional responses
- [ ] Build post/question submission screen with input validation
- [ ] Implement moderation/curation flow for health-professional-reviewed Q&A
- [ ] Add skeleton loading placeholders for feed while content loads
- [ ] Add empty-state Lottie illustration for empty feed

## 9. User Interaction Logging / Analytics Module
- [ ] Define anonymized event schema (feature used, timestamp, session duration, no PII)
- [ ] Implement event logging calls across Symptom Checker, Disease Info, Care Guidance, Emergency, Community modules
- [ ] Set up aggregated analytics storage/database (backend)
- [ ] Build internal reporting/dashboard (admin-facing, separate from parent-facing UI) for usage pattern review

## 10. Offline Capability
- [ ] Bundle/cache Disease & Symptom Database locally for offline browsing
- [ ] Implement offline detection (`expo-network` or `NetInfo`) with graceful UI messaging
- [ ] Queue Community/Analytics actions locally and sync when connection resumes
- [ ] Add offline-state banner/toast using theme-consistent styling (no harsh red unless truly an error)

## 11. Security and Privacy Compliance
- [ ] Encrypt sensitive local storage via `expo-secure-store`
- [ ] Implement HTTPS-only API communication
- [ ] Add in-app privacy policy and medical-disclaimer screens (shown at onboarding, accessible from Profile)
- [ ] Implement data access controls aligned with role-based permissions (parent vs. health professional)
- [ ] Conduct a data-privacy review pass before pilot deployment

## 12. Cross-Platform Compatibility (iOS & Android)
- [ ] Test all screens in Expo Go on both iOS and Android devices/simulators
- [ ] Verify safe-area handling (`react-native-safe-area-context`) across notch/punch-hole devices
- [ ] Verify haptics, date picker, and image picker behave correctly on both platforms
- [ ] Run accessibility check (text scaling, reduced motion, tap target sizes) on both platforms

---

## Final Polish Pass
- [ ] Full UI consistency audit against theme tokens (colors, fonts, spacing, radius)
- [ ] Animation consistency audit (reuse of fade/slide/scale patterns, no conflicting motion styles)
- [ ] Reduced-motion fallback test across all animated components
- [ ] Performance check on low-end Android devices (animation frame rate via Reanimated's UI thread execution)
- [ ] Prepare build for pilot testing (Taguig City health centers) via Expo Go / EAS preview build
