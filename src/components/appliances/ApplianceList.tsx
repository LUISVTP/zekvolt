// ─── src/components/appliances/ApplianceList.tsx ─────────────────────────
// Lista de electrodomésticos

import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/styles/theme';
import { ApplianceItem } from './ApplianceItem';
import type { ApplianceWithComputed } from '@/types';

interface ApplianceListProps {
  appliances: ApplianceWithComputed[];
  tariff: number;
  onDelete: (id: string) => void;
  style?: StyleProp<ViewStyle>;
  emptyMessage?: string;
}

export const ApplianceList = ({
  appliances,
  tariff,
  onDelete,
  style,
  emptyMessage = 'No hay electrodomésticos registrados',
}: ApplianceListProps) => {
  const { theme } = useTheme();

  if (appliances.length === 0) {
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
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <View style={style}>
      {appliances.map(appliance => (
        <ApplianceItem
          key={appliance.id}
          appliance={appliance}
          tariff={tariff}
          onDelete={() => onDelete(appliance.id)}
        />
      ))}
    </View>
  );
};

// Importar Icon
import Icon from '@/components/icons/Icon';

export default ApplianceList;