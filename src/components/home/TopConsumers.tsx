// ─── src/components/home/TopConsumers.tsx ────────────────────────────────
// Lista de top consumidores en Home

import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { formatKwh, formatCOP } from '@/utils/formatters';
import { useTheme } from '@/styles/theme';
import type { ApplianceWithComputed } from '@/types';

interface TopConsumersProps {
  appliances: ApplianceWithComputed[];
  totalKwh: number;
  style?: StyleProp<ViewStyle>;
}

export const TopConsumers = ({ appliances, totalKwh, style }: TopConsumersProps) => {
  const { theme } = useTheme();

  const top = [...appliances]
    .sort((a, b) => b.monthlyKwh - a.monthlyKwh)
    .slice(0, 4);

  if (top.length === 0) {
    return (
      <View
        style={[
          {
            backgroundColor: theme.cyanDim,
            borderWidth: 1,
            borderColor: theme.cyanMid,
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
          },
          style,
        ]}
      >
        <Icon name="zap" size={24} color={theme.cyan} />
        <Text style={{ color: theme.cyan, fontSize: 14, fontWeight: '600', marginTop: 8 }}>
          Sin electrodomésticos
        </Text>
        <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4, textAlign: 'center' }}>
          Ve a la pestaña &quot;Aparatos&quot; para agregar tu primer electrodoméstico
        </Text>
      </View>
    );
  }

  return (
    <View style={style}>
      <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text, marginBottom: 12 }}>
        Top consumidores
      </Text>
      {top.map((a, i) => {
        const pct = totalKwh > 0 ? (a.monthlyKwh / totalKwh) * 100 : 0;
        return (
          <View
            key={a.id}
            style={{
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 14,
              padding: 14,
              marginBottom: 8,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 20 }}>{a.icon}</Text>
                <View>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: theme.text }}>{a.name}</Text>
                  <Text style={{ fontSize: 11, color: theme.textMuted }}>
                    {a.hours}h/día × {a.qty} unid.
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: theme.cyan }}>
                  {formatKwh(a.monthlyKwh)}
                </Text>
                <Text style={{ fontSize: 11, color: theme.textMuted }}>{pct.toFixed(0)}%</Text>
              </View>
            </View>
            <View style={{ height: 4, borderRadius: 2, backgroundColor: theme.border }}>
              <View
                style={{
                  height: '100%',
                  borderRadius: 2,
                  width: `${Math.min(pct, 100)}%`,
                  backgroundColor: i === 0 ? theme.gold : theme.cyan,
                }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

// Importar Icon aquí para evitar error
import Icon from '@/components/icons/Icon';

export default TopConsumers;