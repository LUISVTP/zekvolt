// ─── src/components/ui/ConfidenceBadge.tsx ────────────────────────────
// Indicador de confianza de la IA. Comunica con icono y texto, no solo color.

import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Text } from '@/components/ui/AppText';
import Icon, { IconName } from '@/components/icons/Icon';
import { useTheme } from '@/styles/theme';
import type { ConfidenceLevel } from '@/types';

interface ConfidenceBadgeProps {
  confidence: ConfidenceLevel;
  style?: StyleProp<ViewStyle>;
}

const CONFIG: Record<ConfidenceLevel, { text: string; icon: IconName; description: string }> = {
  exact: {
    text: 'EXACTO',
    icon: 'check',
    description: 'Potencia exacta leída de la etiqueta del aparato',
  },
  estimated: {
    text: 'ESTIMADO',
    icon: 'info',
    description: 'Potencia estimada; no se leyó de una etiqueta',
  },
  unknown: {
    text: 'SIN DATOS',
    icon: 'alertTriangle',
    description: 'No se pudo determinar la potencia',
  },
};

export const ConfidenceBadge = ({ confidence, style }: ConfidenceBadgeProps) => {
  const { theme } = useTheme();
  const { text, icon, description } = CONFIG[confidence];

  const color =
    confidence === 'exact' ? theme.green : confidence === 'estimated' ? theme.gold : theme.textMuted;

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={description}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: 4,
          borderWidth: 1,
          borderColor: color,
          backgroundColor: theme.card,
          borderRadius: 8,
          paddingHorizontal: 8,
          paddingVertical: 3,
        },
        style,
      ]}
    >
      <Icon name={icon} size={12} color={color} />
      <Text style={{ color, fontSize: 10, fontWeight: '700' }}>{text}</Text>
    </View>
  );
};

export default ConfidenceBadge;
