/**
 * BabyGuide PH — Spacing, Radius & Shadow Tokens
 *
 * 8-point grid system. Generous padding + large tap targets (min 44x44pt).
 */

// ── Spacing (8-point grid) ─────────────────────────────
export const spacing = {
  /** 4px — micro spacing, icon padding */
  xxs: 4,
  /** 8px — tight inner padding */
  xs: 8,
  /** 12px — compact spacing */
  sm: 12,
  /** 16px — standard padding */
  md: 16,
  /** 20px — between related sections */
  lg: 20,
  /** 24px — section spacing */
  xl: 24,
  /** 32px — major section breaks */
  xxl: 32,
  /** 40px — top-level section separation */
  xxxl: 40,
  /** 48px — screen-level spacing */
  xxxxl: 48,
} as const;

// ── Border Radius ──────────────────────────────────────
export const radii = {
  /** 4px — tiny chips, inline badges */
  xs: 4,
  /** 8px — small cards, inputs */
  sm: 8,
  /** 12px — medium cards */
  md: 12,
  /** 16px — large cards, buttons */
  lg: 16,
  /** 24px — extra-large, pill shapes */
  xl: 24,
  /** 999px — full circle */
  full: 999,
} as const;

// ── Shadows / Elevation ────────────────────────────────
export const shadows = {
  /** Cards — subtle depth */
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  /** Elevated card (hovered/pressed state) */
  cardElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },

  /** Floating action button */
  fab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  /** Modal / Bottom sheet */
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },

  /** Bottom navigation / top bar */
  navigation: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
} as const;

// ── Minimum tap target (44pt per Apple HIG) ────────────
export const hitSlop = {
  top: 8,
  bottom: 8,
  left: 8,
  right: 8,
} as const;

export const MIN_TAP_SIZE = 44;

// ── Animation Durations ────────────────────────────────
export const durations = {
  fast: 150,
  normal: 250,
  slow: 400,
  splash: 1500,
} as const;
