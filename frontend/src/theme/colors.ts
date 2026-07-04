/**
 * BabyGuide PH — Color Tokens
 *
 * Redesigned per DESIGN.md: minimal editorial palette with
 * pure white canvas, near-black ink, black CTAs, blue inline links.
 */

export const palette = {
  // ── Brand & CTA ──────────────────────────────────────
  primary:        '#000000',
  primaryActive:  '#1a1a1a',

  // ── Text Links ──────────────────────────────────────
  textLink:       '#0d74ce',
  textLinkSecondary: '#476cff',

  // ── Text ────────────────────────────────────────────
  ink:            '#171717',
  body:           '#60646c',
  bodyStrong:     '#171717',
  muted:          '#999999',
  mutedSoft:      '#cccccc',

  // ── Surfaces ────────────────────────────────────────
  white:          '#ffffff',
  canvas:         '#ffffff',
  canvasSoft:     '#fafafa',
  surfaceCard:    '#ffffff',
  surfaceStrong:  '#f0f0f3',
  surfaceDark:    '#171717',
  surfaceDarkElevated: '#1a1a1a',

  // ── Hairlines ───────────────────────────────────────
  hairline:       '#f0f0f3',
  hairlineSoft:   '#f5f5f7',
  hairlineStrong: '#dcdee0',

  // ── Sky Gradient ────────────────────────────────────
  gradientSkyLight: '#cfe7ff',
  gradientSkyMid:   '#a8c8e8',

  // ── Accents ─────────────────────────────────────────
  accentWarning:    '#ab6400',
  accentPreview:    '#8145b5',
  accentLinkBright: '#47c2ff',

  // ── Semantic ────────────────────────────────────────
  semanticError:   '#eb8e90',
  semanticSuccess: '#16a34a',
} as const;

// ── Light Theme ────────────────────────────────────────
export const lightColors = {
  background:           palette.canvas,
  backgroundSecondary:  palette.canvasSoft,
  surface:              palette.surfaceCard,
  surfaceElevated:      palette.surfaceCard,
  surfaceStrong:        palette.surfaceStrong,
  surfaceDark:          palette.surfaceDark,
  surfaceDarkElevated:  palette.surfaceDarkElevated,

  textPrimary:          palette.ink,
  textSecondary:        palette.body,
  textTertiary:         palette.muted,
  textMuted:            palette.mutedSoft,
  textInverse:          palette.white,
  textLink:             palette.textLink,
  textLinkSecondary:    palette.textLinkSecondary,
  onDark:               palette.white,
  onDarkSoft:           '#b0b4ba',

  primary:              palette.primary,
  primaryActive:        palette.primaryActive,

  danger:               palette.semanticError,
  success:              palette.semanticSuccess,
  warning:              palette.accentWarning,
  preview:              palette.accentPreview,

  border:               palette.hairlineStrong,
  borderLight:          palette.hairline,
  borderSoft:           palette.hairlineSoft,
  divider:              palette.hairline,
  icon:                 palette.body,
  iconActive:           palette.ink,
  placeholder:          palette.muted,
  overlay:              'rgba(0,0,0,0.4)',

  tabBar:               palette.canvas,
  tabBarBorder:         palette.hairline,
  tabBarActive:         palette.ink,
  tabBarInactive:       palette.muted,

  cardBackground:       palette.surfaceCard,
  cardBorder:           palette.hairlineStrong,

  gradientSkyLight:     palette.gradientSkyLight,
  gradientSkyMid:       palette.gradientSkyMid,

  statusBar:            'dark-content' as const,
} as const;

// ── Dark Theme (Night Mode) ───────────────────────────
export const darkColors = {
  background:           '#171717',
  backgroundSecondary:  '#1a1a1a',
  surface:              '#1a1a1a',
  surfaceElevated:      '#222222',
  surfaceStrong:        '#2a2a2a',
  surfaceDark:          '#000000',
  surfaceDarkElevated:  '#1a1a1a',

  textPrimary:          '#f0f0f0',
  textSecondary:        '#b0b4ba',
  textTertiary:         '#999999',
  textMuted:            '#666666',
  textInverse:          '#171717',
  textLink:             '#47c2ff',
  textLinkSecondary:    '#476cff',
  onDark:               '#ffffff',
  onDarkSoft:           '#b0b4ba',

  primary:              '#ffffff',
  primaryActive:        '#e0e0e0',

  danger:               '#eb8e90',
  success:              '#16a34a',
  warning:              '#ab6400',
  preview:              '#8145b5',

  border:               '#333333',
  borderLight:          '#2a2a2a',
  borderSoft:           '#222222',
  divider:              '#2a2a2a',
  icon:                 '#999999',
  iconActive:           '#f0f0f0',
  placeholder:          '#666666',
  overlay:              'rgba(0,0,0,0.6)',

  tabBar:               '#171717',
  tabBarBorder:         '#2a2a2a',
  tabBarActive:         '#f0f0f0',
  tabBarInactive:       '#666666',

  cardBackground:       '#1a1a1a',
  cardBorder:           '#333333',

  gradientSkyLight:     '#1a2a3a',
  gradientSkyMid:       '#0d1a2a',

  statusBar:            'light-content' as const,
} as const;

export type ThemeColors = typeof lightColors | typeof darkColors;
