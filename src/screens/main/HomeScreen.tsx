// ─── src/screens/main/HomeScreen.tsx ──────────────────────────────────────
// Pantalla principal (Home tab)

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '@/styles/theme';
import {
  ConsumptionCard,
  TopConsumers,
  ProfilePills,
  EnergyTips,
} from '@/components/home';
import { ZekvoltLogo } from '@/components/logo/ZekvoltLogo';
import type { ApplianceWithComputed } from '@/types';
import { calculateTotalMonthlyKwh, calculateDailyKwh, calculateEstimatedBill, enrichAppliance } from '@/utils/calculations';
import { getTariffForStratum } from '@/data/tariffs';

interface HomeScreenProps {
  profile: {
    city: string;
    estrato: number;
    company: string;
  };
  appliances: any[];
}

export default function HomeScreen({ profile, appliances }: HomeScreenProps) {
  const { theme } = useTheme();

  // Enriquecer electrodomésticos con datos del catálogo
  const enrichedAppliances: ApplianceWithComputed[] = appliances.map(enrichAppliance);

  // Cálculos
  const tariff = getTariffForStratum(profile.company, profile.estrato);
  const totalKwh = calculateTotalMonthlyKwh(appliances);
  const dailyKwh = calculateDailyKwh(totalKwh);
  const estimatedBill = calculateEstimatedBill(totalKwh, tariff);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingTop: 30, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <View>
            <Text style={{ fontSize: 13, color: theme.textMuted }}>Buenos días,</Text>
            <Text style={{ fontSize: 22, fontWeight: '700', color: theme.text }}>Panel de consumo</Text>
          </View>
          <ZekvoltLogo size={42} />
        </View>

        {/* Tarjeta de consumo principal */}
        <ConsumptionCard
          estimatedBill={estimatedBill}
          totalKwh={totalKwh}
          dailyKwh={dailyKwh}
          tariff={tariff}
        />

        {/* Píldoras de perfil */}
        <ProfilePills
          city={profile.city}
          estrato={profile.estrato}
          company={profile.company}
        />

        {/* Top consumidores */}
        <TopConsumers
          appliances={enrichedAppliances}
          totalKwh={totalKwh}
        />
      </ScrollView>
    </View>
  );
}