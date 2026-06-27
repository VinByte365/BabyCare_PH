/**
 * BabyGuide PH — Typography Tokens
 *
 * Display/headings → Nunito (rounded, friendly)
 * Body text        → Inter (highly legible humanist sans-serif)
 *
 * Minimum body size: 16 — accessible for sleep-deprived parents.
 */

export const fontFamilies = {
  displayRegular:  'Nunito_400Regular',
  displayMedium:   'Nunito_500Medium',
  displaySemiBold: 'Nunito_600SemiBold',
  displayBold:     'Nunito_700Bold',
  displayExtraBold:'Nunito_800ExtraBold',

  bodyRegular:     'Inter_400Regular',
  bodyMedium:      'Inter_500Medium',
  bodySemiBold:    'Inter_600SemiBold',
  bodyBold:        'Inter_700Bold',
} as const;

export type FontFamily = typeof fontFamilies[keyof typeof fontFamilies];

// ── Type Scale ──────────────────────────────────────────
export const typography = {
  /** App title, hero sections */
  display: {
    fontFamily: fontFamilies.displayExtraBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },

  /** Section headings */
  heading1: {
    fontFamily: fontFamilies.displayBold,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.3,
  },

  heading2: {
    fontFamily: fontFamilies.displayBold,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.2,
  },

  /** Card titles, toolbar titles */
  title: {
    fontFamily: fontFamilies.displaySemiBold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
  },

  /** Sub-headings */
  subtitle: {
    fontFamily: fontFamilies.displayMedium,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: 0,
  },

  /** Primary body text (min 16) */
  body: {
    fontFamily: fontFamilies.bodyRegular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.1,
  },

  /** Emphasized body text */
  bodyBold: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.1,
  },

  /** Secondary information */
  bodySmall: {
    fontFamily: fontFamilies.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.15,
  },

  /** Timestamps, metadata, labels */
  caption: {
    fontFamily: fontFamilies.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.3,
  },

  /** Button labels */
  button: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  },

  /** Small button labels */
  buttonSmall: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.5,
  },

  /** Medical labels, severity tags */
  medicalLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
} as const;

export type TypographyVariant = keyof typeof typography;
