/**
 * Design System — Tienda de Barrio
 * Sistema verde/naranja alineado con el proyecto web oficial.
 * https://tienda-de-barrio.pages.dev/
 */
export const theme = {
  fonts: {
    regular: undefined,
    medium: undefined,
    bold: undefined,
  },
  colors: {
    // ── Fondos ──────────────────────────────────────────────────────
    background:    '#f0f1f2',   // bg-neutral: fondo general de la app
    surface:       '#ffffff',   // superficies de tarjetas y modales
    surfaceDim:    '#e7e8e9',   // chip-inactive, fondos secundarios
    surfaceBright: '#f8f9fa',   // superficies elevadas

    // ── Forest (Identidad primaria) ─────────────────────────────────
    primary:          '#012d1d', // forest-dark: headers, botones primarios
    primaryMid:       '#1b4332', // forest-mid: chips activos, superficies
    primaryLight:     '#86af99', // forest-light: texto en chips activos
    onPrimary:        '#ffffff',
    primaryContainer: '#d4edda',
    onPrimaryContainer: '#012d1d',

    // ── Orange (CTA / Conversión) ────────────────────────────────────
    orange:     '#fd8603', // orange-cta: Agregar, Enviar, FAB acción
    orangeText: '#5f2f00', // texto de alto contraste sobre naranja

    // ── Texto ────────────────────────────────────────────────────────
    onSurface:        '#0d1c17', // text-primary: títulos, nombres de productos
    onSurfaceVariant: '#414844', // text-secondary: precios anteriores, desc.
    onSurfaceMuted:   '#c1c8c2', // text-placeholder: guías de entrada

    // ── Bordes ───────────────────────────────────────────────────────
    outline:        '#e0e0e0',
    outlineVariant: '#c8c9ca',

    // ── Semánticos ───────────────────────────────────────────────────
    error:            '#dc2626',
    errorContainer:   'rgba(220,38,38,0.08)',
    success:          '#166534',
    successContainer: 'rgba(22,101,52,0.1)',
    warning:          '#b45309',

    // ── Carrito / Checkout ───────────────────────────────────────────
    cartHeaderStart: '#003d26',  // gradiente del drawer del carrito
    cartHeaderEnd:   '#012d1d',

    // ── Chips de categoría ───────────────────────────────────────────
    chipActive:   '#1b4332',
    chipInactive: '#e7e8e9',
  },

  typography: {
    headlineLg: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
    headlineMd: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
    titleMd:    { fontSize: 20, fontWeight: '600', lineHeight: 28 },
    bodyLg:     { fontSize: 16, fontWeight: '400', lineHeight: 24 },
    bodySm:     { fontSize: 14, fontWeight: '400', lineHeight: 20 },
    labelCaps:  { fontSize: 12, fontWeight: '600', lineHeight: 16, letterSpacing: 0.5 },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  rounded: {
    sm:   6,
    md:   12,
    lg:   16,
    xl:   24,
    full: 9999,
  },

  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOpacity: 0.10,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
  },
};