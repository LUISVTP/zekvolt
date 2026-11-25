// ─── src/screens/main/MeterScreen.tsx ──────────────────────────────────────
// Pantalla de medidor: registra la lectura del medidor y calcula el consumo
// del período respecto a la lectura anterior.

import React, { useState, useEffect } from 'react';
import { TextInput, View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/AppText';
import { useTheme } from '@/styles/theme';
import { Button } from '@/components/ui';
import { ZekvoltLogo } from '@/components/logo/ZekvoltLogo';
import Icon from '@/components/icons/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTariffForStratum, formatCOP } from '@/data/tariffs';
import { calculateTotalMonthlyKwh, calculateEstimatedBill } from '@/utils/calculations';

const STORAGE_KEY_READING = 'lastMeterReading';
const STORAGE_KEY_DATE = 'lastMeterReadingDate';

interface MeterScreenProps {
  profile: {
    city: string;
    estrato: number;
    company: string;
  };
  appliances: any[];
}

interface SavedReading {
  value: number;
  diff: number | null;
  cost: number | null;
}

function parseReading(text: string): number | null {
  const normalized = text.replace(',', '.').trim();
  if (!normalized) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function MeterScreen({ profile, appliances }: MeterScreenProps) {
  const { theme, fontScale } = useTheme();
  const tariff = getTariffForStratum(profile.company, profile.estrato);

  const [previousReading, setPreviousReading] = useState<number | null>(null);
  const [previousDate, setPreviousDate] = useState<string | null>(null);
  const [newReading, setNewReading] = useState('');
  const [saved, setSaved] = useState<SavedReading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Cargar la última lectura guardada
  useEffect(() => {
    let mounted = true;
    AsyncStorage.multiGet([STORAGE_KEY_READING, STORAGE_KEY_DATE])
      .then(entries => {
        if (!mounted) return;
        const stored = Object.fromEntries(entries);
        const value = parseReading(stored[STORAGE_KEY_READING] ?? '');
        if (value !== null) setPreviousReading(value);
        if (stored[STORAGE_KEY_DATE]) setPreviousDate(stored[STORAGE_KEY_DATE]);
      })
      .catch(() => {
        // Sin lectura guardada: se empieza de cero
      });
    return () => {
      mounted = false;
    };
  }, []);

  const parsedNew = parseReading(newReading);
  const isLowerThanPrevious =
    parsedNew !== null && previousReading !== null && parsedNew < previousReading;
  const canSave = parsedNew !== null && parsedNew >= 0 && !isLowerThanPrevious;

  // Vista previa del consumo mientras se escribe
  const previewDiff =
    parsedNew !== null && previousReading !== null && parsedNew >= previousReading
      ? parsedNew - previousReading
      : null;

  const estimatedKwh = calculateTotalMonthlyKwh(appliances);
  const estimatedBill = calculateEstimatedBill(estimatedKwh, tariff);

  const handleSaveReading = async () => {
    if (!canSave || parsedNew === null) return;

    setSaving(true);
    setError(null);
    try {
      const diff = previousReading !== null ? parsedNew - previousReading : null;
      const cost = diff !== null ? diff * tariff : null;
      const now = new Date().toISOString();

      await AsyncStorage.multiSet([
        [STORAGE_KEY_READING, String(parsedNew)],
        [STORAGE_KEY_DATE, now],
      ]);

      setPreviousReading(parsedNew);
      setPreviousDate(now);
      setNewReading('');
      setSaved({ value: parsedNew, diff, cost });
    } catch {
      setError('No se pudo guardar la lectura. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const inputHasError = error !== null || isLowerThanPrevious;

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

        {/* Lectura anterior */}
        <View
          style={{
            backgroundColor: theme.card,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 11, color: theme.textMuted, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'monospace' }}>
            Última lectura guardada
          </Text>
          {previousReading !== null ? (
            <>
              <Text style={{ fontSize: 32, fontWeight: '800', color: theme.text, marginTop: 6 }}>
                {previousReading.toLocaleString('es-CO')} kWh
              </Text>
              {previousDate && (
                <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>
                  Registrada el {formatDate(previousDate)}
                </Text>
              )}
            </>
          ) : (
            <Text style={{ fontSize: 14, color: theme.textMuted, marginTop: 8, lineHeight: 20 }}>
              Aún no has guardado una lectura. Escribe abajo el número que muestra tu medidor hoy
              para empezar.
            </Text>
          )}
        </View>

        {/* Nueva lectura */}
        <View
          style={{
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: inputHasError ? theme.redMid : theme.cyanMid,
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 11, color: theme.cyan, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8, fontFamily: 'monospace' }}>
            Nueva lectura
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              borderBottomWidth: 1,
              borderBottomColor: theme.border,
              paddingBottom: 4,
            }}
          >
            <TextInput
              value={newReading}
              onChangeText={text => {
                setNewReading(text);
                setError(null);
              }}
              keyboardType="numeric"
              placeholder="Ej: 12345"
              placeholderTextColor={theme.textSub}
              accessibilityLabel="Nueva lectura del medidor en kilovatios hora"
              accessibilityHint="Escribe el número que aparece en tu medidor eléctrico"
              style={{
                flex: 1,
                color: theme.text,
                fontSize: Math.round(40 * fontScale),
                fontWeight: '800',
                paddingVertical: 8,
              }}
            />
            <Text style={{ fontSize: 20, fontWeight: '500', color: theme.textMuted }}>kWh</Text>
          </View>

          {isLowerThanPrevious && (
            <Text style={{ color: theme.red, fontSize: 12, marginTop: 8 }}>
              La nueva lectura no puede ser menor que la anterior ({previousReading?.toLocaleString('es-CO')} kWh).
            </Text>
          )}
          {error && (
            <Text accessibilityLiveRegion="polite" style={{ color: theme.red, fontSize: 12, marginTop: 8 }}>
              {error}
            </Text>
          )}

          {previewDiff !== null && (
            <View
              accessibilityLiveRegion="polite"
              style={{
                marginTop: 14,
                backgroundColor: theme.cyanDim,
                borderWidth: 1,
                borderColor: theme.cyanMid,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Text style={{ color: theme.text, fontSize: 13 }}>
                Consumo desde la última lectura: <Text style={{ fontWeight: '800', color: theme.cyan }}>{previewDiff.toLocaleString('es-CO')} kWh</Text>
              </Text>
              <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                Costo aproximado: {formatCOP(previewDiff * tariff)}
              </Text>
            </View>
          )}

          <Button
            onPress={handleSaveReading}
            disabled={!canSave || saving}
            accessibilityLabel="Guardar lectura del medidor"
            style={{ paddingVertical: 14, marginTop: 16 }}
          >
            <Icon name="check" size={18} color={theme.bg} />
            <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>
              {saving ? 'Guardando...' : 'Guardar lectura'}
            </Text>
          </Button>
        </View>

        {/* Resultado de la última lectura guardada */}
        {saved && (
          <View
            accessibilityLiveRegion="polite"
            style={{
              backgroundColor: theme.cyanDim,
              borderWidth: 1,
              borderColor: theme.cyanMid,
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="check" size={18} color={theme.cyan} />
              <Text style={{ fontSize: 14, fontWeight: '700', color: theme.cyan }}>
                Lectura guardada: {saved.value.toLocaleString('es-CO')} kWh
              </Text>
            </View>

            {saved.diff !== null ? (
              <>
                <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 12 }}>
                  Consumo del período
                </Text>
                <Text style={{ fontSize: 26, fontWeight: '800', color: theme.text, marginTop: 2 }}>
                  {saved.diff.toLocaleString('es-CO')} kWh
                </Text>
                <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 8 }}>
                  Costo estimado
                </Text>
                <Text style={{ fontSize: 20, fontWeight: '700', color: theme.gold, marginTop: 2 }}>
                  {saved.cost !== null ? formatCOP(saved.cost) : '—'}
                </Text>
              </>
            ) : (
              <Text style={{ fontSize: 12, color: theme.text, marginTop: 8, lineHeight: 18 }}>
                Primera lectura registrada. Guarda otra el próximo mes para ver cuánto consumiste.
              </Text>
            )}
          </View>
        )}

        {/* Consumo estimado por electrodomésticos */}
        <View
          style={{
            backgroundColor: theme.card,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
          }}
        >
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
          <Text style={{ color: theme.cyan, fontSize: 13, fontWeight: '600' }}>
            Tu tarifa: {formatCOP(tariff).replace('COP', '')} / kWh
          </Text>
          <Text style={{ color: theme.text, fontSize: 12, marginTop: 4 }}>
            Empresa: {profile.company} • Estrato {profile.estrato} • {profile.city}
          </Text>
        </View>

        {/* Consejos */}
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text, marginBottom: 12 }}>
            Consejos para una lectura correcta
          </Text>
          <View style={{ gap: 8 }}>
            {[
              'Toma la lectura a la misma hora cada mes',
              'Anota solo los números en negro (ignora los rojos o decimales)',
              'La nueva lectura siempre debe ser mayor que la anterior',
              'Compara con tu factura para validar el consumo',
            ].map((tip, index) => (
              <View key={index} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
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
