/**
 * BabyGuide PH — Typography Tokens
 *
 * Per DESIGN.md: Inter is the single sans family across every text role.
 * JetBrains Mono carries every code surface.
 * Display weight stays at 600, body at 400.
 */

export const fontFamilies = {
  display:    'Inter_600SemiBold',
  body:       'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodyBold:   'Inter_700Bold',
  code:       'JetBrainsMono_400Regular',
} as const;

export type FontFamily = typeof fontFamilies[keyof typeof fontFamilies];

// ── Type Scale (Expo DESIGN.md tokens) ────────────────
export const typography = {
  /** Homepage hero h1 — 64px / 600 / -1.92px */
  displayMega: {
    fontFamily: fontFamilies.display,
    fontSize: 64,
    lineHeight: 1.05,
    letterSpacing: -1.92,
  },

  /** Subsidiary heroes — 48px / 600 / -1.44px */
  displayXl: {
    fontFamily: fontFamilies.display,
    fontSize: 48,
    lineHeight: 1.1,
    letterSpacing: -1.44,
  },

  /** Section heads — 36px / 600 / -1.08px */
  displayLg: {
    fontFamily: fontFamilies.display,
    fontSize: 36,
    lineHeight: 1.15,
    letterSpacing: -1.08,
  },

  /** Sub-section heads — 28px / 600 / -0.84px */
  displayMd: {
    fontFamily: fontFamilies.display,
    fontSize: 28,
    lineHeight: 1.2,
    letterSpacing: -0.84,
  },

  /** Card group titles — 22px / 600 / -0.5px */
  displaySm: {
    fontFamily: fontFamilies.display,
    fontSize: 22,
    lineHeight: 1.25,
    letterSpacing: -0.5,
  },

  /** Component titles — 18px / 600 / 0 */
  titleMd: {
    fontFamily: fontFamilies.display,
    fontSize: 18,
    lineHeight: 1.4,
    letterSpacing: 0,
  },

  /** List labels — 16px / 600 / 0 */
  titleSm: {
    fontFamily: fontFamilies.display,
    fontSize: 16,
    lineHeight: 1.4,
    letterSpacing: 0,
  },

  /** Default body text — 16px / 400 / 0 */
  body: {
    fontFamily: fontFamilies.body,
    fontSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0,
  },

  /** Footer body — 14px / 400 / 0 */
  bodySm: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 1.5,
    letterSpacing: 0,
  },

  /** Photo captions — 13px / 400 / 0 */
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    lineHeight: 1.4,
    letterSpacing: 0,
  },

  /** Section labels, badges — 11px / 600 / 0.88px uppercase */
  captionUppercase: {
    fontFamily: fontFamilies.display,
    fontSize: 11,
    lineHeight: 1.4,
    letterSpacing: 0.88,
    textTransform: 'uppercase' as const,
  },

  /** CTA labels — 14px / 500 / 0 */
  button: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    lineHeight: 1.0,
    letterSpacing: 0,
  },

  /** Top-nav menu — 14px / 500 / 0 */
  navLink: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    lineHeight: 1.4,
    letterSpacing: 0,
  },

  /** Code blocks — JetBrains Mono 13px */
  code: {
    fontFamily: fontFamilies.code,
    fontSize: 13,
    lineHeight: 1.5,
    letterSpacing: 0,
  },
} as const;

export type TypographyVariant = keyof typeof typography;
