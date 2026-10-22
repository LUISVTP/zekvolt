// ─── src/styles/colors.ts ─────────────────────────────────────────────
// Tokens de color semánticos

export const colors = {
  // Primarios
  primary: '#00d4c8',      // Cian - Pantone 311 C
  primaryDim: '#00d4c822',
  primaryMid: '#00d4c855',

  // Secundarios
  secondary: '#f5a623',    // Dorado - Pantone 2003 C
  secondaryDim: '#f5a62322',

  // Semánticos
  success: '#2ed573',
  warning: '#f5a623',
  error: '#ff4757',
  info: '#00d4c8',

  // Neutros (dark mode base)
  bg: '#0a0c0e',
  surface: '#111518',
  card: '#161b20',
  border: '#1e262e',

  // Texto
  text: '#e8f4f3',
  textMuted: '#6b8a88',
  textSub: '#3d5a58',

  // Overlay
  overlay: '#00000088',
} as const;

export type Colors = typeof colors;