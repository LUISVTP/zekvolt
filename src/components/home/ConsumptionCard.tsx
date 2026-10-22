// ─── src/components/home/ConsumptionCard.tsx ────────────────────────────
// Tarjeta principal de consumo en Home

import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { formatCOP, formatKwh } from '@/utils/formatters';
import { useTheme } from '@/styles/theme';

interface ConsumptionCardProps {
  estimatedBill: number;
  totalKwh: number;
  dailyKwh: number;
  tariff: number;
  style?: StyleProp<ViewStyle>;
}

export const ConsumptionCard = ({
  estimatedBill,
  totalKwh,
  dailyKwh,
  tariff,
  style,
}: ConsumptionCardProps) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.surface,
          borderWidth: 1,
          borderColor: theme.cyanMid,
          borderRadius: 20,
          padding: 24,
          marginBottom: 16,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: 11,
          color: theme.cyan,
          letterSpacing: 3,
          textTransform: 'uppercase',
          marginBottom: 4,
          fontFamily: 'monospace',
        }}
      >
        Factura estimada del mes
      </Text>
      <Text style={{ fontSize: 44, fontWeight: '800', color: theme.text, lineHeight: 48 }}>
        {formatCOP(estimatedBill).replace('COP', '')}
        <Text style={{ fontSize: 16, fontWeight: '500', color: theme.textMuted }}> COP</Text>
      </Text>
      <View style={{ flexDirection: 'row', gap: 20, marginTop: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, color: theme.textMuted }}>Consumo mensual</Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: theme.cyan }}>
            {formatKwh(totalKwh)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, color: theme.textMuted }}>Consumo diario</Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: theme.gold }}>
            {formatKwh(dailyKwh)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, color: theme.textMuted }}>Tarifa kWh</Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: theme.text }}>
            {formatCOP(tariff).replace('COP', '')}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ConsumptionCard;