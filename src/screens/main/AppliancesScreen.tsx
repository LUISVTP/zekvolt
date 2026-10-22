// ─── src/screens/main/AppliancesScreen.tsx ─────────────────────────────────
// Pantalla de electrodomésticos (Aparatos tab)

import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '@/styles/theme';
import { ApplianceList, AddApplianceModal } from '@/components/appliances';
import { Button } from '@/components/ui';
import { Icon } from '@/components/icons';
import { ZekvoltLogo } from '@/components/logo/ZekvoltLogo';
import { calculateTotalMonthlyKwh, calculateEstimatedBill, enrichAppliance } from '@/utils/calculations';
import { getTariffForStratum } from '@/data/tariffs';
import { formatCOP, formatKwh } from '@/utils/formatters';
import { lookupModelByText } from '@/services/vision.service';
import type { ApplianceWithComputed } from '@/types';

interface AppliancesScreenProps {
  profile: {
    city: string;
    estrato: number;
    company: string;
  };
  appliances: any[];
  onAddAppliance: (data: { name: string; hours: number; qty: number }) => Promise<void>;
  onRemoveAppliance: (id: string) => Promise<void>;
}

export default function AppliancesScreen({
  profile,
  appliances,
  onAddAppliance,
  onRemoveAppliance,
}: AppliancesScreenProps) {
  const { theme } = useTheme();

  const [showAddModal, setShowAddModal] = useState(false);

  // Enriquecer electrodomésticos
  const enrichedAppliances: ApplianceWithComputed[] = appliances.map(enrichAppliance);

  // Cálculos
  const tariff = getTariffForStratum(profile.company, profile.estrato);
  const totalKwh = calculateTotalMonthlyKwh(appliances);
  const estimatedBill = calculateEstimatedBill(totalKwh, tariff);

  // Buscar modelo por texto
  const handleModelSearch = async (modelText: string) => {
    const result = await lookupModelByText(modelText);
    return {
      name: result.result.name,
      watts: result.result.watts,
      model: result.result.model,
      confidence: result.result.confidence,
    };
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingTop: 30, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: '700', color: theme.text }}>Electrodomésticos</Text>
            <Text style={{ fontSize: 13, color: theme.textMuted }}>{appliances.length} registrados</Text>
          </View>
          <Button onPress={() => setShowAddModal(true)} style={{ paddingVertical: 10, paddingHorizontal: 16 }}>
            <Icon name="plus" size={16} color={theme.bg} />
            <Text style={{ color: theme.bg, fontWeight: '700', fontSize: 13 }}>Agregar</Text>
          </Button>
        </View>

        {/* Resumen superior */}
        <View style={{ backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderRadius: 14, padding: 16, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 11, color: theme.textMuted }}>Total mensual</Text>
            <Text style={{ fontSize: 20, fontWeight: '700', color: theme.cyan }}>{formatKwh(totalKwh)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 11, color: theme.textMuted }}>Estimado factura</Text>
            <Text style={{ fontSize: 20, fontWeight: '700', color: theme.gold }}>{formatCOP(estimatedBill)}</Text>
          </View>
        </View>

        {/* Lista de electrodomésticos */}
        <ApplianceList
          appliances={enrichedAppliances}
          tariff={tariff}
          onDelete={onRemoveAppliance}
        />

        {/* Modal agregar */}
        <AddApplianceModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={onAddAppliance}
          tariff={tariff}
          onModelSearch={handleModelSearch}
        />
      </ScrollView>
    </View>
  );
}