# BabyGuide PH — Modules Overview

## User Authentication Module
- User registration (parent / healthcare worker)
- User login
- Password hashing (bcrypt)
- JWT token generation and validation
- Token refresh mechanism
- Session management (expo-secure-store)
- Logout with session clear
- Auto-login on app start
- Forgot password / reset flow

## User Profile Module
- Parent profile screen (name, contact, preferences)
- Baby profile screen (name, date of birth, sex, birth details)
- Baby profile photo upload (expo-image-picker)
- Edit/update profile with save confirmation
- Profile history tab (past symptom checks, bookmarked content)
- Role-based access (parent vs. professional)

## Home Dashboard / Navigation Module
- Bottom tab navigation (Home, Checker, Library, Community, Profile)
- Dashboard card grid (Symptom Checker, Disease Info, Care Guidance, Emergency, Community)
- Active tab animations
- Onboarding welcome carousel
- Medical disclaimer screen

## Symptom Checker Module
- Decision-tree symptom assessment engine
- Multi-step guided questionnaire UI
- Symptom selection with touch-friendly chips
- Progress stepper indicator
- Cross-reference symptoms against disease database
- Results screen with severity assessment
- Conditional emergency routing for urgent symptoms
- Session logging to analytics

### Computer Vision — Skin Disease Detection
- Skin Check option inside Symptom Checker
- Upload image from gallery (expo-image-picker)
- Live camera capture (expo-camera)
- Image classification (Measles, Heat Rash, Chickenpox, Eczema, Normal Skin)
- Confidence threshold logic (≥30% displays result, <30% shows retry prompt)
- Skin Check results screen with condition info and disclaimer
- Backend inference endpoint
- Skin Check history saved to profile
- Anonymized analytics logging

## Disease & Symptom Database Module
- Searchable disease list with sticky search bar
- Filter chips by category (skin, respiratory, digestive)
- Expandable accordion cards for disease details
- Local bundled database for offline access (diseaseLibrary.ts)
- Content entries: symptoms, causes, treatment, prevention, when to seek care
- Skin condition content (Measles, Heat Rash, Chickenpox, Eczema, Normal Skin)

## Care Guidance Module
- Step-by-step instructional care guides
- Linked to disease/symptom entries
- Bookmark guidance for later reference
- Fade-and-slide reveal animations

## Emergency Alert Module
- Urgent symptom trigger logic
- High-contrast emergency screen (alert color #E0524C)
- Pulsing alert icon animation
- Call nearest facility button (expo-linking)
- Nearest healthcare facility info
- Analytics logging for emergency triggers

## Community Support Module
- Community feed UI (card/bubble layout)
- Post and question submission
- Verified health-professional badges
- Moderation and curation flow
- Skeleton loading placeholders
- Empty state illustrations
- Offline queue for posts/comments

## Analytics Module
- Anonymized event schema (feature, timestamp, session duration, no PII)
- Event logging across Symptom Checker, Skin Check, Disease Info, Care Guidance, Emergency, Community
- Queued analytics with AsyncStorage
- Periodic flush every 5 minutes
- Flush on app background
- Backend analytics storage

## Offline Capability Module
- Local disease database bundle for offline browsing
- Network state detection (NetInfo)
- Offline banner component (amber slide-down)
- Community action queue (AsyncStorage)
- Analytics event queue (AsyncStorage)
- Graceful offline UI messaging

## Security & Privacy Module
- Secure token storage (expo-secure-store)
- HTTPS-only API communication
- JWT authentication with token expiry
- Role-based access control
- Input validation at API boundaries (Pydantic)
- In-app privacy policy screen
- Medical disclaimer screens

## Bookmark Module
- Bookmark disease entries
- Bookmark care guidance
- Bookmark community posts
- Persistent storage
- Bookmark management API endpoints

## History Module
- Past symptom check sessions
- Past skin check sessions
- Bookmarked content history
- History API endpoints

## Theme & UI Foundation Module
- Color tokens (primary, secondary, backgrounds, alert, text)
- Light and dark mode support
- Typography (Inter, JetBrains Mono)
- Spacing and radius constants
- Reusable components (Card, Button, Chip, Badge, SkeletonLoader, EmptyState, Toast, ProgressStepper, AvatarPicker, OfflineBanner)
- Reduced-motion support
- Lottie animations
- Haptic feedback (expo-haptics)
