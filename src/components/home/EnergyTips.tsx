// ─── src/components/home/EnergyTips.tsx ────────────────────────────────
// Componente de consejos de ahorro energético

import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { getTipsForAppliance } from '@/data/tips';
import Icon from '@/components/icons/Icon';
import { useTheme } from '@/styles/theme';

interface EnergyTipsProps {
  applianceName: string | null;
  style?: StyleProp<ViewStyle>;
  maxTips?: number;
}

export const EnergyTips = ({ applianceName, style, maxTips = 3 }: EnergyTipsProps) => {
  const { theme } = useTheme();
  const tips = getTipsForAppliance(applianceName ?? '').slice(0, maxTips);

  if (tips.length === 0) return null;

  return (
    <View style={[{ marginTop: 16 }, style]}>
      <Text
        style={{
          fontSize: 11,
          color: theme.gold,
          letterSpacing: 3,
          textTransform: 'uppercase',
          marginBottom: 10,
          fontFamily: 'monospace',
        }}
      >
        {applianceName ? `Consejos para ${applianceName}` : 'Consejos generales'}
      </Text>

      {tips.map((tip, i) => (
        <View
          key={i}
          style={{
            backgroundColor: theme.goldDim,
            borderWidth: 1,
            borderColor: `${theme.gold}44`,
            borderRadius: 12,
            padding: 12,
            marginBottom: 8,
            flexDirection: 'row',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <View
            style={{
              backgroundColor: theme.goldDim,
              borderRadius: 8,
              padding: 6,
              borderWidth: 1,
              borderColor: `${theme.gold}33`,
            }}
          >
            <Icon name={tip.icon as any} size={16} color={theme.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: theme.text, marginBottom: 2 }}>
              {tip.title}
            </Text>
            <Text style={{ fontSize: 12, color: theme.textMuted, lineHeight: 18 }}>
              {tip.tip}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default EnergyTips;