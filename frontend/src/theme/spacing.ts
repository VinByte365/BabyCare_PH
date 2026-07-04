/**
 * BabyGuide PH — Spacing, Radius & Shadow Tokens
 *
 * Updated per DESIGN.md: 4px base unit, editorial spacing.
 * Shadows removed — cards use hairline borders + soft drop only.
 */

// ── Spacing (4px base) ────────────────────────────────
export const spacing = {
  /** 4px — micro spacing */
  xxs: 4,
  /** 8px — tight inner padding */
  xs: 8,
  /** 12px — compact spacing */
  sm: 12,
  /** 16px — standard padding */
  base: 16,
  /** 20px — between related sections */
  md: 20,
  /** 24px — section spacing */
  lg: 24,
  /** 32px — major section breaks */
  xl: 32,
  /** 48px — top-level section separation */
  xxl: 48,
  /** 96px — section padding */
  section: 96,
} as const;

// ── Border Radius ──────────────────────────────────────
export const radii = {
  /** 0px — reserved */
  none: 0,
  /** 4px — inline tags */
  xs: 4,
  /** 6px — compact rows */
  sm: 6,
  /** 8px — CTA buttons, form inputs, ecosystem tiles */
  md: 8,
  /** 12px — feature cards, code blocks, pricing tiers */
  lg: 12,
  /** 16px — device mockup cards */
  xl: 16,
  /** 24px — larger atmospheric cards (rare) */
  xxl: 24,
  /** 9999px — badges only, pill geometry */
  pill: 9999,
  /** 9999px — avatar plates */
  full: 9999,
} as const;

// ── Shadows / Elevation ────────────────────────────────
export const shadows = {
  /** Cards — subtle drop shadow (only shadow tier used) */
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },

  /** Hovered card (single shadow tier) */
  cardHovered: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
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
