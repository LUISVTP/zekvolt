// ─── src/screens/main/ScanScreen.tsx ───────────────────────────────────────
// Pantalla de escaneo IA (Escanear tab)

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/styles/theme';
import { CameraView, VisionResult } from '@/components/camera';
import { Button, Input } from '@/components/ui';
import { Icon } from '@/components/icons';
import { analyzeApplianceImage, lookupModelByText, validateManualWatts, getExpectedWattsForAppliance } from '@/services/vision.service';
import { useCamera } from '@/hooks/useCamera';
import { getTariffForStratum, formatCOP } from '@/data/tariffs';
import { getDefaultHours, getExpectedWatts } from '@/data/appliances';
import { Alert } from 'react-native';
import type { VisionResult as VisionResultType, WattValidationResult, ThemeColors } from '@/types';

interface ScanScreenProps {
  profile: {
    city: string;
    estrato: number;
    company: string;
  };
  onAddAppliance: (data: { name: string; hours: number; qty: number }) => Promise<void>;
}

type CameraStep = 'idle' | 'result' | 'manual';

export default function ScanScreen({ profile, onAddAppliance }: ScanScreenProps) {
  const { theme } = useTheme();
  const tariff = getTariffForStratum(profile.company, profile.estrato);

  // Hook de cámara
  const {
    cameraRef,
    cameraPermission,
    requestCameraPermission,
    cameraStep: hookCameraStep,
    setCameraStep: setHookCameraStep,
    showFullscreenCamera,
    setShowFullscreenCamera,
    capturedImage,
    setCapturedImage,
    takePicture,
    pickFromGallery,
    resetCamera,
  } = useCamera();

  // Estados locales
  const [cameraStep, setCameraStep] = useState<CameraStep>('idle');
  const [detectedResult, setDetectedResult] = useState<VisionResultType | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [visionError, setVisionError] = useState<string | null>(null);
  const [isRescan, setIsRescan] = useState(false);
  const [modelSearchText, setModelSearchText] = useState('');
  const [modelSearchResult, setModelSearchResult] = useState<VisionResultType | null>(null);
  const [modelSearchLoading, setModelSearchLoading] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualWatts, setManualWatts] = useState('');
  const [manualHours, setManualHours] = useState('');
  const [manualQty, setManualQty] = useState('1');
  const [wattWarning, setWattWarning] = useState<WattValidationResult | null>(null);
  const [saving, setSaving] = useState(false);

  // Sincronizar step del hook con local
  const syncStep = (step: CameraStep) => {
    setCameraStep(step);
    setHookCameraStep(step as any);
  };

  // Analizar imagen con IA
  const analyzeImage = useCallback(async () => {
    if (!capturedImage) return;
    setAnalyzing(true);
    setVisionError(null);

    try {
      const { result, validation } = await analyzeApplianceImage(capturedImage);
      if (!result.name) {
        setVisionError('No se pudo identificar el electrodoméstico. La imagen puede ser borrosa. Puedes intentar de nuevo o registrar manualmente.');
        setDetectedResult(null);
        syncStep('idle');
      } else if (isRescan && result.confidence === 'exact') {
        setDetectedResult(prev => prev ? {
          ...prev,
          watts: result.watts || prev.watts,
          model: result.model || prev.model,
          confidence: 'exact',
        } : result);
        setIsRescan(false);
        syncStep('result');
      } else {
        setDetectedResult(result);
        setIsRescan(false);
        syncStep('result');
      }
      if (validation && !validation.valid) {
        setWattWarning(validation);
      }
    } catch (err) {
      setVisionError(err instanceof Error ? err.message : 'Error al analizar la imagen');
      setDetectedResult(null);
    } finally {
      setAnalyzing(false);
    }
  }, [capturedImage, isRescan]);

  // Confirmar resultado detectado
  const confirmDetected = useCallback(async (hours: number, qty: number) => {
    if (!detectedResult?.name) return;

    const applianceData = {
      name: detectedResult.name,
      hours: hours || getDefaultHours(detectedResult.name) || 4,
      qty: qty || 1,
    };

    setSaving(true);
    try {
      await onAddAppliance(applianceData);
      resetCamera();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el electrodoméstico');
    } finally {
      setSaving(false);
    }
  }, [detectedResult, onAddAppliance, resetCamera]);

  // Guardar formulario manual
  const saveManual = useCallback(async () => {
    if (!manualName) return;
    const applianceData = {
      name: manualName,
      hours: parseFloat(manualHours) || getDefaultHours(manualName) || 4,
      qty: parseInt(manualQty) || 1,
    };

    setSaving(true);
    try {
      await onAddAppliance(applianceData);
      resetCamera();
      setManualName('');
      setManualWatts('');
      setManualHours('');
      setManualQty('1');
      setWattWarning(null);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el electrodoméstico');
    } finally {
      setSaving(false);
    }
  }, [manualName, manualHours, manualQty, onAddAppliance, resetCamera]);

  // Validar watts en tiempo real
  const handleManualWattsChange = useCallback((text: string) => {
    setManualWatts(text);
    const watts = parseFloat(text);
    if (manualName && !isNaN(watts)) {
      const result = validateManualWatts(manualName, watts);
      setWattWarning(result.valid ? null : result);
    } else {
      setWattWarning(null);
    }
  }, [manualName]);

  // Buscar modelo por texto
  const handleModelSearch = useCallback(async () => {
    const query = modelSearchText.trim();
    if (query.length < 3) return;

    setModelSearchLoading(true);
    try {
      const result = await lookupModelByText(query);
      setModelSearchResult({
        name: result.result.name,
        watts: result.result.watts,
        model: result.result.model,
        confidence: result.result.confidence,
      });
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Error al buscar modelo');
    } finally {
      setModelSearchLoading(false);
    }
  }, [modelSearchText]);

  // Aplicar resultado de búsqueda
  const applyModelSearch = useCallback(() => {
    if (!modelSearchResult?.name) return;
    setDetectedResult({
      name: modelSearchResult.name,
      watts: modelSearchResult.watts,
      model: modelSearchResult.model,
      confidence: modelSearchResult.confidence,
      voltage: null,
      amperage: null,
      raw: '',
    });
    setManualName(modelSearchResult.name);
    if (modelSearchResult.watts) setManualWatts(String(modelSearchResult.watts));
    setManualHours(String(getDefaultHours(modelSearchResult.name)));
    setModelSearchResult(null);
    setModelSearchText('');
    syncStep('result');
  }, [modelSearchResult]);

  // Ir a rescán
  const startRescan = useCallback(() => {
    setIsRescan(true);
    syncStep('idle');
    setCapturedImage(null);
    setVisionError(null);
  }, [setCapturedImage]);

  // Volver atrás
  const goBackCamera = useCallback(() => {
    if (cameraStep === 'result') {
      syncStep('idle');
      setCapturedImage(null);
      setDetectedResult(null);
      setVisionError(null);
      setIsRescan(false);
    } else if (cameraStep === 'manual') {
      setManualName('');
      setManualWatts('');
      setManualHours('');
      setManualQty('1');
      setWattWarning(null);
      syncStep('idle');
    }
  }, [cameraStep, setCapturedImage]);

  // Props para ManualForm (declarados antes de los returns para evitar TDZ)
  const manualFormProps = {
    theme,
    manualName,
    setManualName,
    manualWatts,
    setManualWatts,
    manualHours,
    setManualHours,
    manualQty,
    setManualQty,
    wattWarning,
    setWattWarning,
    onWattsChange: handleManualWattsChange,
    onSave: saveManual,
    onBack: goBackCamera,
    saving,
    tariff,
  };

  // Render según step
  if (cameraStep === 'result' && detectedResult) {
    return (
      <VisionResult
        result={detectedResult}
        capturedImage={capturedImage}
        onConfirm={confirmDetected}
        onRescan={startRescan}
        onBack={goBackCamera}
        onManualEdit={() => {
          setManualName(detectedResult.name || '');
          if (detectedResult.watts) setManualWatts(String(detectedResult.watts));
          setManualHours(String(getDefaultHours(detectedResult.name || '')));
          syncStep('manual');
        }}
        tariff={tariff}
      />
    );
  }

  if (cameraStep === 'manual') {
    return <ManualForm {...manualFormProps} />;
  }

  // Paso idle - Cámara
  return (
    <CameraView
      ref={cameraRef}
      onTakePicture={takePicture}
      onGalleryPress={pickFromGallery}
      onAnalyzePress={analyzeImage}
      onClose={goBackCamera}
      capturedImage={capturedImage}
      analyzing={analyzing}
      cameraPermission={cameraPermission}
      showFullscreen={showFullscreenCamera}
      isRescan={isRescan}
    />
  );
}

// Componente separado para el formulario manual
interface ManualFormProps {
  theme: ThemeColors;
  manualName: string;
  setManualName: (v: string) => void;
  manualWatts: string;
  setManualWatts: (v: string) => void;
  manualHours: string;
  setManualHours: (v: string) => void;
  manualQty: string;
  setManualQty: (v: string) => void;
  wattWarning: WattValidationResult | null;
  setWattWarning: (v: WattValidationResult | null) => void;
  onWattsChange: (text: string) => void;
  onSave: () => void;
  onBack: () => void;
  saving: boolean;
  tariff: number;
}

const ManualForm = ({
  theme,
  manualName,
  setManualName,
  manualWatts,
  setManualWatts,
  manualHours,
  setManualHours,
  manualQty,
  setManualQty,
  wattWarning,
  setWattWarning,
  onWattsChange,
  onSave,
  onBack,
  saving,
  tariff,
}: ManualFormProps) => {
  const expectedWatts = manualName ? getExpectedWatts(manualName) ?? 0 : 0;
  const defaultHours = manualName ? getDefaultHours(manualName) : 4;
  const estimatedMonthly = manualWatts && parseFloat(manualHours) > 0
    ? (parseFloat(manualWatts) * parseFloat(manualHours) * 30 * parseInt(manualQty)) / 1000
    : 0;
  const estimatedCost = estimatedMonthly * tariff;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingTop: 10, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <TouchableOpacity onPress={onBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <Icon name="arrowLeft" size={20} color={theme.cyan} />
          <Text style={{ color: theme.cyan, fontSize: 14, fontWeight: '600' }}>Volver</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 22, fontWeight: '700', color: theme.text, marginBottom: 4 }}>
          Registro manual
        </Text>
        <Text style={{ fontSize: 14, color: theme.textMuted, marginBottom: 20 }}>
          Ingresa los datos de tu electrodoméstico
        </Text>

        {/* Selector de electrodoméstico - simplificado */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, fontFamily: 'monospace' }}>
            Electrodoméstico
          </Text>
          <View
            style={{
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 14,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600', flex: 1 }}>
              {manualName || 'Selecciona un electrodoméstico'}
            </Text>
            <Icon name="chevronRight" size={18} color={theme.textMuted} />
          </View>
        </View>

        {/* Potencia */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, fontFamily: 'monospace' }}>
            Potencia (Watts) — valor típico: {expectedWatts}W
          </Text>
          <View
            style={{
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: wattWarning ? `${theme.gold}88` : theme.border,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 14,
            }}
          >
            <Input
              type="numeric"
              value={manualWatts}
              onChange={onWattsChange}
              placeholder="Ej: 150"
              inputStyle={{ flex: 1, color: theme.text, fontSize: 15, paddingVertical: 14 }}
              style={{ borderWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 0 }}
            />
            <Text style={{ color: theme.textMuted, fontSize: 13 }}>W</Text>
          </View>
        </View>

        {wattWarning && (
          <View
            style={{
              backgroundColor: theme.goldDim,
              borderWidth: 1,
              borderColor: `${theme.gold}66`,
              borderRadius: 12,
              padding: 14,
              marginBottom: 16,
              flexDirection: 'row',
              gap: 10,
              alignItems: 'flex-start',
            }}
          >
            <Icon name="alertTriangle" size={18} color={theme.gold} style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '600', marginBottom: 4 }}>
                Valor atípico detectado
              </Text>
              <Text style={{ color: theme.text, fontSize: 13, lineHeight: 18 }}>
                {wattWarning.warning}
              </Text>
              {wattWarning.suggested && (
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                  <Button
                    onPress={() => { setManualWatts(String(wattWarning.suggested)); setWattWarning(null); }}
                    style={{ flex: 1, paddingVertical: 8, borderRadius: 8 }}
                  >
                    <Text style={{ color: theme.bg, fontSize: 13, fontWeight: '700' }}>
                      Usar {wattWarning.suggested}W
                    </Text>
                  </Button>
                  <Button variant="ghost" onPress={() => setWattWarning(null)} style={{ flex: 1, paddingVertical: 8, borderRadius: 8 }}>
                    <Text style={{ color: theme.cyan, fontSize: 13, fontWeight: '700' }}>Ignorar</Text>
                  </Button>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Horas y cantidad */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          <View style={{ flex: 2 }}>
            <Input
              label="Horas/día"
              type="numeric"
              value={manualHours}
              onChange={setManualHours}
              placeholder={String(defaultHours)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Cantidad"
              type="numeric"
              value={manualQty}
              onChange={setManualQty}
              placeholder="1"
            />
          </View>
        </View>

        {/* Estimación */}
        {manualHours && parseFloat(manualHours) > 0 && manualWatts && (
          <View style={{ backgroundColor: theme.cyanDim, borderWidth: 1, borderColor: theme.cyanMid, borderRadius: 10, padding: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 13, color: theme.cyan }}>
              Consumo: {estimatedMonthly.toFixed(1)} kWh/mes ≈ {formatCOP(estimatedCost)}
            </Text>
          </View>
        )}

        {/* Botones */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <View style={{ flex: 1 }}>
            <Button variant="ghost" onPress={onBack} style={{ paddingVertical: 12 }}>
              <Text style={{ color: theme.cyan, fontSize: 15, fontWeight: '700' }}>Cancelar</Text>
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button onPress={onSave} disabled={saving || !manualName} style={{ paddingVertical: 12 }}>
              {saving ? (
                <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>Guardando...</Text>
              ) : (
                <>
                  <Icon name="plus" size={16} color={theme.bg} />
                  <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>Agregar</Text>
                </>
              )}
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};