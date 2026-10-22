// ─── src/components/appliances/ApplianceItem.tsx ─────────────────────────
// Item individual de electrodoméstico en la lista

import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { formatKwh, formatCOP } from '@/utils/formatters';
import { useTheme } from '@/styles/theme';
import Icon from '@/components/icons/Icon';
import type { ApplianceWithComputed } from '@/types';

interface ApplianceItemProps {
  appliance: ApplianceWithComputed;
  tariff: number;
  onDelete: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ApplianceItem = ({ appliance, tariff, onDelete, style }: ApplianceItemProps) => {
  const { theme } = useTheme();
  const monthly = appliance.monthlyKwh;
  const cost = monthly * tariff;

  return (
    <View
      style={[
        {
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 16,
          padding: 14,
          marginBottom: 10,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', flex: 1 }}>
          <Text style={{ fontSize: 28 }}>{appliance.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text }}>
              {appliance.name}
            </Text>
            <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
              {appliance.watts}W · {appliance.hours}h/día · {appliance.qty} unid.
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: theme.cyan }}>
                {formatKwh(monthly)}
              </Text>
              <Text style={{ fontSize: 13, color: theme.textMuted }}>
                ≈ {formatCOP(cost)}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={onDelete} style={{ padding: 4 }}>
          <Icon name="trash" size={16} color={theme.red} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ApplianceItem;