/**
 * BabyGuide PH — Color Tokens
 *
 * Soft, nurturing palette designed for a healthcare / baby-care context.
 * Low eye-strain for night-time use; never clinical or cold.
 */

export const palette = {
  // ── Brand ──────────────────────────────────────────────
  sage:        '#7FB3A3',   // Primary — calm, "healthy"
  sageDark:    '#5E9485',
  sageLight:   '#A8D5C8',

  coral:       '#FFB6A3',   // Secondary — warmth, CTAs
  coralDark:   '#E8957F',
  coralLight:  '#FFD4C8',

  yellow:      '#F5D06E',   // Accent — warnings, highlights, education
  yellowDark:  '#D4AF37',
  yellowLight: '#FBE9A7',

  // ── Semantic ──────────────────────────────────────────
  danger:      '#E0524C',   // Emergency — muted red
  dangerDark:  '#C0312B',
  dangerLight: '#F5A3A0',

  success:     '#6BC29A',
  successDark: '#4AA87D',
  successLight:'#A8E6C5',

  info:        '#6AABDB',
  infoDark:    '#4A8FC0',
  infoLight:   '#A0D0F0',

  // ── Neutrals ─────────────────────────────────────────
  white:       '#FFFFFF',
  offWhite:    '#FDFBF7',   // warm off-white for light bg
  gray50:      '#F8F7F4',
  gray100:     '#F0EEED',
  gray200:     '#E2E0DD',
  gray300:     '#C5C3C0',
  gray400:     '#9E9C99',
  gray500:     '#6E6C69',
  gray600:     '#4A4845',
  gray700:     '#2E3A36',   // primary text (dark sage-gray)
  gray800:     '#232927',
  gray900:     '#1B2027',   // dark-mode bg (soft charcoal)
  black:       '#111215',
} as const;

// ── Light Theme ────────────────────────────────────────
export const lightColors = {
  // Backgrounds
  background:        palette.offWhite,
  backgroundSecondary:palette.gray50,
  surface:           palette.white,
  surfaceElevated:   palette.white,

  // Text
  textPrimary:       palette.gray700,
  textSecondary:     palette.gray500,
  textTertiary:      palette.gray400,
  textInverse:       palette.white,

  // Brand
  primary:           palette.sage,
  primaryDark:       palette.sageDark,
  primaryLight:      palette.sageLight,
  secondary:         palette.coral,
  secondaryDark:     palette.coralDark,
  secondaryLight:    palette.coralLight,
  accent:            palette.yellow,
  accentDark:        palette.yellowDark,
  accentLight:       palette.yellowLight,

  // Semantic
  danger:            palette.danger,
  dangerLight:       palette.dangerLight,
  success:           palette.success,
  successLight:      palette.successLight,
  info:              palette.info,
  infoLight:         palette.infoLight,

  // UI elements
  border:            palette.gray200,
  borderFocused:     palette.sage,
  divider:           palette.gray100,
  icon:              palette.gray500,
  iconActive:        palette.sage,
  placeholder:       palette.gray400,
  overlay:           'rgba(0,0,0,0.4)',

  // Tab bar
  tabBar:            palette.white,
  tabBarBorder:      palette.gray200,
  tabBarActive:      palette.sage,
  tabBarInactive:    palette.gray400,

  // Cards
  cardBackground:    palette.white,
  cardBorder:        palette.gray100,

  // Status bar
  statusBar:         'dark-content' as const,
} as const;

// ── Dark Theme (Night Mode) ───────────────────────────
export const darkColors = {
  // Backgrounds
  background:        palette.gray900,
  backgroundSecondary:'#212830',
  surface:           '#252C34',
  surfaceElevated:   '#2D343C',

  // Text
  textPrimary:       '#EAE8E4',
  textSecondary:     palette.gray400,
  textTertiary:      palette.gray500,
  textInverse:       palette.gray900,

  // Brand
  primary:           palette.sageLight,
  primaryDark:       palette.sage,
  primaryLight:      '#C8E8DD',
  secondary:         palette.coralLight,
  secondaryDark:     palette.coral,
  secondaryLight:    '#FFE8E0',
  accent:            palette.yellowLight,
  accentDark:        palette.yellow,
  accentLight:       '#FFF3D0',

  // Semantic
  danger:            palette.dangerLight,
  dangerLight:       '#3D2020',
  success:           palette.successLight,
  successLight:      '#1D3028',
  info:              palette.infoLight,
  infoLight:         '#1D2A38',

  // UI elements
  border:            '#3A4048',
  borderFocused:     palette.sageLight,
  divider:           '#2D343C',
  icon:              palette.gray400,
  iconActive:        palette.sageLight,
  placeholder:       palette.gray500,
  overlay:           'rgba(0,0,0,0.6)',

  // Tab bar
  tabBar:            '#1F262E',
  tabBarBorder:      '#2D343C',
  tabBarActive:      palette.sageLight,
  tabBarInactive:    palette.gray500,

  // Cards
  cardBackground:    '#252C34',
  cardBorder:        '#3A4048',

  // Status bar
  statusBar:         'light-content' as const,
} as const;

export type ThemeColors = typeof lightColors | typeof darkColors;
