// ─── src/components/ui/AppText.tsx ────────────────────────────────────
// Texto con escala de accesibilidad configurable desde Ajustes.

import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { useTheme } from '@/styles/theme';
import { scaleTextStyle } from '@/utils/accessibility';

export const Text = React.forwardRef<React.ElementRef<typeof RNText>, TextProps>(
  ({ style, ...props }, ref) => {
    const { fontScale } = useTheme();
    return <RNText ref={ref} {...props} style={scaleTextStyle(style, fontScale)} />;
  }
);

Text.displayName = 'Text';

export default Text;
