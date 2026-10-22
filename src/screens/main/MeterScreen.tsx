// ─── src/screens/main/MeterScreen.tsx ──────────────────────────────────────
// Pantalla de medidor (lectura de medidor)

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '@/styles/theme';
import { Button, Input } from '@/components/ui';
import { ZekvoltLogo } from '@/components/logo/ZekvoltLogo';
import Icon from '@/components/icons/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTariffForStratum, formatCOP } from '@/data/tariffs';
import { calculateTotalMonthlyKwh, calculateEstimatedBill } from '@/utils/calculations';

interface MeterScreenProps {
  profile: {
    city: string;
    estrato: number;
    company: string;
  };
  appliances: any[];
}

export default function MeterScreen({ profile, appliances }: MeterScreenProps) {
  const { theme } = useTheme();
  const tariff = getTariffForStratum(profile.company, profile.estrato);

  const [meterReading, setMeterReading] = useState('');
  const [lastReading, setLastReading] = useState<string | null>(null);
  const [consumptionDiff, setConsumptionDiff] = useState<number | null>(null);
  const [costDiff, setCostDiff] = useState<number | null>(null);

  // Cargar lectura guardada
  useEffect(() => {
    AsyncStorage.getItem('meterReading').then(val => {
      if (val) {
        setMeterReading(val);
        setLastReading(val);
      }
    });
    AsyncStorage.getItem('lastMeterReading').then(val => {
      if (val && val !== meterReading) {
        setLastReading(val);
      }
    });
  }, []);

  // Calcular diferencia cuando cambie la lectura
  useEffect(() => {
    if (lastReading && meterReading) {
      const current = parseFloat(meterReading);
      const previous = parseFloat(lastReading);
      if (!isNaN(current) && !isNaN(previous) && current >= previous) {
        const diff = current - previous;
        setConsumptionDiff(diff);
        setCostDiff(diff * tariff);
      } else {
        setConsumptionDiff(null);
        setCostDiff(null);
      }
    }
  }, [meterReading, lastReading, tariff]);

  // Consumo estimado por electrodomésticos
  const estimatedKwh = calculateTotalMonthlyKwh(appliances);
  const estimatedBill = calculateEstimatedBill(estimatedKwh, tariff);

  const handleSaveReading = async () => {
    if (!meterReading.trim()) return;
    await AsyncStorage.setItem('lastMeterReading', meterReading);
    await AsyncStorage.setItem('meterReading', meterReading);
    setLastReading(meterReading);
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <View>
            <Text style={{ fontSize: 13, color: theme.textMuted }}>Medidor eléctrico</Text>
            <Text style={{ fontSize: 22, fontWeight: '700', color: theme.text }}>Lectura de consumo</Text>
          </View>
          <ZekvoltLogo size={42} />
        </View>

        {/* Tarjeta lectura actual */}
        <View style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.cyanMid, borderRadius: 20, padding: 24, marginBottom: 16 }}>
          <Text style={{ fontSize: 11, color: theme.cyan, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4, fontFamily: 'monospace' }}>
            Lectura actual del medidor
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 16 }}>
            <Input
              type="numeric"
              value={meterReading}
              onChange={setMeterReading}
              placeholder="Ej: 12345"
              inputStyle={{ flex: 1, color: theme.text, fontSize: 44, fontWeight: '800', paddingVertical: 0 }}
              style={{ borderWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 0 }}
            />
            <Text style={{ fontSize: 24, fontWeight: '500', color: theme.textMuted, marginBottom: 8 }}>kWh</Text>
          </View>

          <Button onPress={handleSaveReading} style={{ paddingVertical: 14 }}>
            <Icon name="check" size={18} color={theme.bg} />
            <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>Guardar lectura</Text>
          </Button>
        </View>

        {/* Comparación con lectura anterior */}
        {lastReading && meterReading && (
          <View style={{ backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderRadius: 16, padding: 20, marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text, marginBottom: 16 }}>
              Comparación con lectura anterior
            </Text>
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: theme.textMuted }}>Lectura anterior</Text>
                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.text, marginTop: 4 }}>{lastReading} kWh</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: theme.textMuted }}>Lectura actual</Text>
                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.cyan, marginTop: 4 }}>{meterReading} kWh</Text>
              </View>
            </View>
            {consumptionDiff !== null && (
              <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontSize: 11, color: theme.textMuted }}>Consumo del período</Text>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: theme.gold, marginTop: 4 }}>
                      {consumptionDiff.toFixed(0)} kWh
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 11, color: theme.textMuted }}>Costo estimado</Text>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: theme.gold, marginTop: 4 }}>
                      {costDiff !== null ? formatCOP(costDiff) : '—'}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Consumo estimado por electrodomésticos */}
        <View style={{ backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text, marginBottom: 16 }}>
            Consumo estimado por electrodomésticos
          </Text>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: theme.textMuted }}>Mensual estimado</Text>
              <Text style={{ fontSize: 20, fontWeight: '700', color: theme.cyan, marginTop: 4 }}>
                {estimatedKwh.toFixed(1)} kWh
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 11, color: theme.textMuted }}>Factura estimada</Text>
              <Text style={{ fontSize: 20, fontWeight: '700', color: theme.gold, marginTop: 4 }}>
                {formatCOP(estimatedBill)}
              </Text>
            </View>
          </View>
        </View>

        {/* Info de tarifa */}
        <View style={{ backgroundColor: theme.cyanDim, borderWidth: 1, borderColor: theme.cyanMid, borderRadius: 12, padding: 16 }}>
          <Text style={{ color: theme.cyan, fontSize: 13, fontWeight: '600' }}>Tu tarifa: {formatCOP(tariff).replace('COP', '')} / kWh</Text>
          <Text style={{ color: theme.text, fontSize: 12, marginTop: 4 }}>
            Empresa: {profile.company} • Estrato {profile.estrato} • {profile.city}
          </Text>
        </View>

        {/* Consejos */}
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text, marginBottom: 12 }}>
            Consejos para lectura precisa
          </Text>
          <View style={{ gap: 8 }}>
            {[
              'Lee el medidor a la misma hora cada mes',
              'Anota solo los números en blanco (ignora los rojos/decimales)',
              'Compara con tu factura anterior para validar',
              'Si hay gran diferencia, contacta a tu empresa energética',
            ].map((tip, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.cyan, marginTop: 6 }} />
                <Text style={{ color: theme.text, fontSize: 13, lineHeight: 20 }}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}