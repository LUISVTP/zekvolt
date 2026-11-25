// ─── src/utils/accessibility.ts ───────────────────────────────────────
// Utilidades de accesibilidad: escalado de estilos de texto.

import { StyleProp, StyleSheet, TextStyle } from 'react-native';

type MutableTextStyle = { -readonly [K in keyof TextStyle]: TextStyle[K] };

/**
 * Multiplica fontSize y lineHeight de un estilo de texto sin perder el resto
 * de propiedades. Acepta estilos en objeto, arreglo o registrados.
 */
export function scaleTextStyle<T extends TextStyle>(
  style: StyleProp<T>,
  scale: number
): StyleProp<T> {
  if (scale === 1 || !style) return style;

  const flat = StyleSheet.flatten(style) as T | undefined;
  if (!flat) return style;

  const scaled = { ...flat } as MutableTextStyle;
  if (typeof flat.fontSize === 'number') {
    scaled.fontSize = Math.round(flat.fontSize * scale);
  }
  if (typeof flat.lineHeight === 'number') {
    scaled.lineHeight = Math.round(flat.lineHeight * scale);
  }
  return scaled as T;
}
