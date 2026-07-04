# AGENTS.md

Primary guide for AI coding agents working on BabyGuide PH. Read this file before making changes, then inspect the relevant code paths directly.

## Project Overview

BabyGuide PH is a mobile-first newborn health companion for parents in the Philippines. The product centers on authentication, parent and baby profiles, a symptom checker, disease library, care guidance, emergency support, community features, and future analytics/offline capability.

The repository is split into two main applications:

- `frontend/`: Expo managed React Native app written in TypeScript. It owns the mobile UI, navigation, theme system, local state, secure token storage, and client-side symptom/library logic.
- `backend/`: FastAPI service written in Python. It exposes versioned REST endpoints under `/api/v1`, uses SQLAlchemy models, Pydantic schemas, JWT auth, and a PostgreSQL database by default.

Current architecture:

- Mobile app boots through `frontend/App.tsx`, loads fonts and stored auth state, then renders `RootNavigator`.
- Navigation is typed in `frontend/src/navigation/types.ts` and organized into auth, onboarding, tab, and feature stacks.
- Shared frontend design tokens live in `frontend/src/theme/`; reusable UI components live in `frontend/src/components/`.
- Frontend server communication is centralized in `frontend/src/lib/api.ts`.
- Backend entry point is `backend/app/main.py`.
- Backend routes are collected in `backend/app/api/v1/api.py` and implemented in `backend/app/api/v1/endpoints/`.
- Backend configuration is centralized in `backend/app/core/config.py`.

Main technologies:

- Frontend: Expo SDK 54, React Native 0.81, React 19, TypeScript strict mode, React Navigation, Zustand, TanStack Query, Expo SecureStore, AsyncStorage, Expo Font, Expo Splash Screen, Expo Camera/Image Picker, Expo Haptics, Lottie.
- Backend: FastAPI, Uvicorn, SQLAlchemy 2, Pydantic 2, Pydantic Settings, PostgreSQL, Alembic dependency, JWT via `python-jose`, password hashing via `passlib`.

## Repository Structure

- `frontend/`: Expo mobile app.
- `frontend/App.tsx`: App bootstrap, font loading, splash hiding, providers, and root navigation.
- `frontend/index.ts`: Expo entry file.
- `frontend/app.json`: Expo configuration, assets, plugins, Android/iOS/web settings.
- `frontend/package.json` and `frontend/package-lock.json`: Node dependencies and scripts.
- `frontend/tsconfig.json`: TypeScript config; currently extends Expo config with `strict: true`.
- `frontend/assets/`: App icons, adaptive icon layers, splash icon, favicon.
- `frontend/src/components/`: Shared UI primitives such as `Button`, `Card`, `Chip`, `Badge`, `Toast`, `SkeletonLoader`, `ProgressStepper`, and `EmptyState`.
- `frontend/src/lib/`: Shared frontend logic such as `api.ts`, `queryClient.ts`, `symptomEngine.ts`, `diseaseLibrary.ts`, `analytics.ts`, `networkStore.ts`, and `offlineQueue.ts`.
- `frontend/src/navigation/`: Typed navigators and route type definitions.
- `frontend/src/screens/`: Feature screens grouped by domain: `auth`, `checker`, `home`, `library`, `onboarding`, `placeholders`, and `profile`.
- `frontend/src/stores/`: Zustand stores for auth and theme/reduced-motion state.
- `frontend/src/theme/`: Theme provider, color tokens, typography, spacing, radii, shadows, motion durations, and tap target constants.
- `backend/`: FastAPI backend.
- `backend/README.md`: Backend setup/run notes.
- `backend/requirements.txt`: Python dependencies.
- `backend/app/main.py`: FastAPI app creation, CORS, router inclusion, startup table creation, root health message.
- `backend/app/core/`: Configuration, database session/engine, password and JWT helpers.
- `backend/app/api/v1/`: Versioned API router and endpoint modules.
- `backend/app/models/`: SQLAlchemy database models.
- `backend/app/schemas/`: Pydantic request/response/token schemas.
- Root Markdown docs: planning and product/design references, including `BabyGuide_PH_Implementation_TODO.md`, `Modules.md`, `implementation_plan.md`, `UI_plan_mobile.md`, and `DESIGN.md`.

There is currently no committed test directory, Alembic migration directory, frontend lint config, or formatter config. Do not invent commands that are not present; add tooling only when the task requires it.

## Development Workflow

### Install Dependencies

Backend:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Frontend:

```powershell
cd frontend
npm install
```

### Run Locally

Backend:

```powershell
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/api/v1/openapi.json`

Frontend:

```powershell
cd frontend
npm start
```

Platform shortcuts:

```powershell
npm run android
npm run ios
npm run web
```

The development API base URL in `frontend/src/lib/api.ts` is currently `http://10.0.2.2:8000/api/v1`, which targets a host machine from the Android emulator. Adjust carefully for iOS simulator, physical devices, or web work.

### Build Commands

No production build or EAS build scripts are currently defined. For local Expo workflows, use the scripts in `frontend/package.json`. Add explicit build scripts only when introducing a real build workflow.

### Test Commands

No automated test commands are currently defined. Before adding tests, choose tools that fit the existing stack:

- Backend: `pytest` plus FastAPI `TestClient`/HTTPX are natural fits.
- Frontend: Jest and React Native Testing Library are natural fits for component and screen tests.

Document any new test command in this file and in the relevant README.

### Linting and Formatting Commands

No lint or format scripts are currently declared. Preserve the existing style manually. If adding ESLint, Prettier, Ruff, Black, or similar tooling, add scripts and document them.

### Environment Variables

Backend settings are loaded from `.env` by `backend/app/core/config.py` using Pydantic Settings. Important values:

- `PROJECT_NAME`: Defaults to `BabyGuide PH API`.
- `API_V1_STR`: Defaults to `/api/v1`.
- `SECRET_KEY`: Defaults to a development placeholder; override for any non-local environment.
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Defaults to one week.
- `ALGORITHM`: Defaults to `HS256`.
- `DATABASE_URL`: Defaults to `postgresql://postgres:postgres@localhost:5432/babyguide`.

Never commit real `.env` files or secrets. Prefer documenting required keys in an example file if environment setup grows.

## Coding Standards

- Follow the existing coding style in the file you are editing.
- Keep functions focused and modular.
- Prefer clear, readable implementations over clever shortcuts.
- Reuse existing utilities, components, stores, theme tokens, schemas, and database helpers.
- Do not introduce new frameworks or libraries unless they solve a real problem that the existing stack cannot handle cleanly.
- Minimize breaking changes to API contracts, navigation route names, schema fields, storage keys, and theme tokens.
- Keep frontend TypeScript strict-mode friendly. Avoid `any` unless the boundary is genuinely untyped and document the reason locally.
- Keep backend request/response shapes explicit with Pydantic schemas.

## AI Agent Guidelines

- Read the relevant existing code before editing.
- Maintain consistency with the current two-app architecture: Expo frontend plus FastAPI backend.
- Avoid broad refactors unless explicitly requested or required to complete the task safely.
- Do not modify unrelated files.
- Preserve backward compatibility unless the user explicitly asks for a breaking change.
- Explain major architectural changes in commit messages or documentation.
- Ask for clarification if requirements are ambiguous and a reasonable assumption would be risky.
- Treat the root planning docs as product/design guidance, but treat implemented code as the source of truth for current behavior.
- Be especially careful around health-related wording: the app should provide supportive guidance and appropriate escalation, not definitive medical diagnosis.

## File Modification Rules

- Prefer editing existing files over creating new ones.
- Create new files only when they clearly improve maintainability, match existing structure, or are explicitly requested.
- Never delete files unless explicitly requested.
- Never overwrite configuration files without understanding their purpose.
- Do not commit generated caches such as Python `__pycache__` files.
- Keep frontend assets in `frontend/assets/` and source modules under `frontend/src/`.
- Keep backend models in `backend/app/models/`, schemas in `backend/app/schemas/`, and route handlers in `backend/app/api/v1/endpoints/`.

## Testing Expectations

- Update or add tests for new behavior when test infrastructure exists.
- If a task introduces test infrastructure, keep the first tests focused on the changed behavior.
- Ensure existing tests continue to pass when tests are added.
- For backend endpoint work, cover auth, validation, ownership checks, and error responses.
- For frontend feature work, cover reusable logic in `src/lib/` and important UI states where practical.
- Manually verify key flows when automated coverage is absent, and report what was checked.

## Documentation Requirements

- Update documentation whenever behavior, setup, commands, environment variables, API contracts, or user-facing flows change.
- Keep `backend/README.md` synchronized with backend setup and run commands.
- Update root planning docs only when the task is explicitly about plans/design or when the implementation meaningfully changes project direction.
- If API behavior changes, document affected endpoints, request fields, response fields, and auth requirements.

## Git Practices

- Make small, logical commits.
- Avoid unrelated changes in the same commit.
- Preserve meaningful commit history.
- Before committing, review `git status` and avoid including generated files or unrelated user changes.
- Do not rewrite history, reset branches, or discard changes unless explicitly instructed.

## Security

- Never hardcode production secrets, credentials, API keys, or private tokens.
- Use environment variables for sensitive backend values.
- Keep `SECRET_KEY` private outside local development.
- Validate user input at API boundaries with Pydantic schemas and frontend form validation.
- Preserve authorization checks that scope baby profiles to the current user.
- Store mobile auth tokens only in secure storage; the current app uses `expo-secure-store`.
- Avoid logging personally identifiable information or sensitive health data.
- Keep CORS permissive only for local development; tighten it before production deployment.
- Use HTTPS-only backend URLs outside local development.

## Performance

- Avoid unnecessary database queries and keep ownership filters in database queries rather than post-filtering in Python.
- Add indexes when introducing frequently queried fields.
- Avoid loading large data sets into memory; use pagination where list endpoints can grow.
- Keep React Native screens responsive by avoiding expensive work during render.
- Use TanStack Query for server state and Zustand for small local app state, matching current architecture.
- Keep disease/symptom lookup logic efficient and consider offline caching for library content as the product evolves.

## Project-Specific Notes

- Product tone matters: BabyGuide PH should feel calm, trustworthy, legible, and supportive for first-time parents. Avoid alarmist language except in true emergency flows.
- The frontend currently uses Inter for primary UI typography and JetBrains Mono for code-like surfaces. Use the existing `theme` exports instead of hardcoded style values.
- Shared components should remain accessible: keep touch targets at least 44px where possible, set accessibility roles/labels, and respect reduced-motion state for animation work.
- Navigation changes should update `frontend/src/navigation/types.ts` first, then the relevant navigator.
- API calls should go through `frontend/src/lib/api.ts` unless there is a clear reason to create a more specialized client.
- Auth state lives in `frontend/src/stores/authStore.ts`; do not duplicate token state elsewhere.
- Theme and reduced-motion concerns live in `frontend/src/theme/` and `frontend/src/stores/themeStore.ts`.
- Backend auth uses OAuth2 password login at `/api/v1/auth/login`; registration is `/api/v1/auth/register`; current-user profile is `/api/v1/auth/me`.
- Baby profile endpoints live under `/api/v1/babies` and must remain scoped to the authenticated user.
- SQLAlchemy tables are currently auto-created on app startup in `backend/app/main.py`. Alembic is listed as a dependency but migrations are not yet present.
- The current backend defaults to PostgreSQL but includes a SQLite compatibility branch in `database.py` for local debugging/tests.
- Several modules in the planning docs are still partial or placeholder implementations. Check current code before assuming a module is complete.
- Generated Python cache files are present in the working tree; do not edit or rely on them.
- **Offline capability**: The Disease & Symptom Database is bundled locally via `src/lib/diseaseLibrary.ts` for offline browsing. Network state is tracked via `@react-native-community/netinfo` in `src/lib/networkStore.ts`. An `OfflineBanner` component (`src/components/OfflineBanner.tsx`) shows a warm amber slide-down banner when offline. Community actions (posts/comments) are queued to AsyncStorage via `src/lib/offlineQueue.ts` when offline. Analytics events are queued independently via `src/lib/analytics.ts` with AsyncStorage. Analytics flushes automatically every 5 minutes and on app backgrounding.
