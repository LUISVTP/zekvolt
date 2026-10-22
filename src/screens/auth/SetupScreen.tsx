// ─── src/screens/auth/SetupScreen.tsx ────────────────────────────────────
// Pantalla de configuración inicial (onboarding)

import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useTheme } from '@/styles/theme';
import { Button, Select } from '@/components/ui';
import Icon from '@/components/icons/Icon';
import { getDepartmentOptions, getStratumOptions, getCompanyOptions } from '@/data/companies';
import { getTariffForStratum, formatCOP } from '@/data/tariffs';
import { createProfile } from '@/services/profile.service';
import { ZekvoltError } from '@/types';

interface SetupScreenProps {
  userId?: string;
  onSetupComplete?: (userId: string) => void;
}

export default function SetupScreen({ userId, onSetupComplete }: SetupScreenProps) {
  const { theme } = useTheme();

  const [city, setCity] = useState('');
  const [estrato, setEstrato] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);

  const companies = city ? getCompanyOptions(city) : [];
  const canNext = city && estrato && company;

  const tariffPreview = canNext
    ? getTariffForStratum(company, parseInt(estrato))
    : 0;

  const handleNext = async () => {
    if (!canNext || !userId) return;

    setLoading(true);
    try {
      const profileData = { city, estrato: parseInt(estrato), company };
      const { error } = await createProfile(userId, profileData);
      if (error) throw error;

      // Notifica al RootNavigator para que recargue el perfil y pase a Main
      onSetupComplete?.(userId);
    } catch (err) {
      const message = err instanceof ZekvoltError ? err.message : 'No se pudo guardar tu perfil. Intenta de nuevo.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      style={{ flex: 1, backgroundColor: theme.bg }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: 50, paddingHorizontal: 24, paddingBottom: 24 }}>
          {/* Progress bar */}
          <View style={{ flexDirection: 'row', gap: 4, marginBottom: 32 }}>
            <View style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: theme.cyan }} />
          </View>

          <Text style={{ fontSize: 11, color: theme.cyan, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8, fontFamily: 'monospace' }}>
            Configuración inicial
          </Text>
          <Text style={{ fontSize: 24, fontWeight: '700', color: theme.text, marginBottom: 6 }}>
            ¿Dónde vives?
          </Text>
          <Text style={{ fontSize: 14, color: theme.textMuted, marginBottom: 28, lineHeight: 22 }}>
            Esta información nos ayuda a calcular las tarifas exactas de tu empresa energética.
          </Text>

          <Select
            label="Departamento / Ciudad"
            icon="mapPin"
            value={city}
            onChange={v => { setCity(v); setCompany(''); }}
            options={getDepartmentOptions()}
          />
          <Select
            label="Estrato socioeconómico"
            icon="home"
            value={estrato}
            onChange={setEstrato}
            options={getStratumOptions()}
          />
          {city ? (
            <Select
              label="Empresa energética"
              icon="zap"
              value={company}
              onChange={setCompany}
              options={[
                { value: '', label: 'Selecciona tu empresa...' },
                ...companies,
              ]}
            />
          ) : null}

          {canNext ? (
            <View style={{ marginTop: 8 }}>
              <View
                style={{
                  backgroundColor: theme.cyanDim,
                  borderWidth: 1,
                  borderColor: theme.cyanMid,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 20,
                }}
              >
                <Text style={{ color: theme.cyan, fontSize: 13, fontWeight: '600' }}>Tu tarifa aproximada</Text>
                <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', marginTop: 4 }}>
                  {formatCOP(tariffPreview).replace('COP', '')}
                  <Text style={{ fontSize: 13, fontWeight: '400', color: theme.textMuted }}> / kWh</Text>
                </Text>
              </View>
              <Button onPress={handleNext} disabled={loading}>
                {loading ? (
                  <>
                    <Icon name="refreshCw" size={18} color={theme.bg} />
                    <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>Guardando...</Text>
                  </>
                ) : (
                  <>
                    <Icon name="bolt" size={18} color={theme.bg} />
                    <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>Continuar</Text>
                  </>
                )}
              </Button>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}