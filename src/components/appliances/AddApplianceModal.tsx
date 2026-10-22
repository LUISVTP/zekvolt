// ─── src/components/appliances/AddApplianceModal.tsx ──────────────────────
// Modal para agregar electrodoméstico (categorías, manual, búsqueda por modelo)

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { getExpectedWatts as getExpectedWattsUtil } from '@/data/appliances';
import { validateWatts } from '@/utils/validation';
import { APPLIANCE_CATEGORIES, APPLIANCES_DB, getDefaultHours } from '@/data/appliances';
import { formatCOP } from '@/utils/formatters';
import { useTheme } from '@/styles/theme';
import { Button, Input } from '@/components/ui';
import Icon from '@/components/icons/Icon';
import { EnergyTips } from '@/components/home/EnergyTips';
import type { WattValidationResult } from '@/types';

interface AddApplianceModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: { name: string; hours: number; qty: number }) => Promise<void>;
  tariff: number;
  onModelSearch?: (modelText: string) => Promise<{
    name: string | null;
    watts: number | null;
    model: string | null;
    confidence: string;
  }>;
  style?: StyleProp<ViewStyle>;
}

type Step = 'categories' | 'manual' | 'modelSearch' | 'categoryItems';

export const AddApplianceModal = ({
  visible,
  onClose,
  onAdd,
  tariff,
  onModelSearch,
  style,
}: AddApplianceModalProps) => {
  const { theme } = useTheme();

  const [step, setStep] = useState<Step>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [manualName, setManualName] = useState('');
  const [manualWatts, setManualWatts] = useState('');
  const [manualHours, setManualHours] = useState('');
  const [manualQty, setManualQty] = useState('1');
  const [wattWarning, setWattWarning] = useState<WattValidationResult | null>(null);
  const [modelSearchText, setModelSearchText] = useState('');
  const [modelSearchResult, setModelSearchResult] = useState<{
    name: string | null;
    watts: number | null;
    model: string | null;
    confidence: string;
  } | null>(null);
  const [modelSearchLoading, setModelSearchLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleClose = useCallback(() => {
    setStep('categories');
    setSelectedCategory(null);
    setManualName('');
    setManualWatts('');
    setManualHours('');
    setManualQty('1');
    setWattWarning(null);
    setModelSearchText('');
    setModelSearchResult(null);
    setModelSearchLoading(false);
    onClose();
  }, [onClose]);

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setStep('categoryItems');
  };

  const handleAppliancePress = (name: string) => {
    const defaultHours = getDefaultHours(name);
    setManualName(name);
    setManualHours(String(defaultHours));
    setStep('manual');
  };

  const handleWattsChange = (text: string) => {
    setManualWatts(text);
    const watts = parseFloat(text);
    if (manualName && !isNaN(watts)) {
      const result = validateWatts(manualName, watts);
      setWattWarning(result.valid ? null : result);
    } else {
      setWattWarning(null);
    }
  };

  const handleSaveManual = async () => {
    if (!manualName) return;
    setSaving(true);
    try {
      await onAdd({
        name: manualName,
        hours: parseFloat(manualHours) || getDefaultHours(manualName),
        qty: parseInt(manualQty) || 1,
      });
      handleClose();
    } catch (error) {
      console.error('Error guardando:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleModelSearch = async () => {
    const query = modelSearchText.trim();
    if (query.length < 3 || !onModelSearch) return;

    setModelSearchLoading(true);
    try {
      const result = await onModelSearch(query);
      setModelSearchResult(result);
    } catch (error) {
      console.error('Error buscando modelo:', error);
    } finally {
      setModelSearchLoading(false);
    }
  };

  const handleApplyModelSearch = () => {
    if (!modelSearchResult?.name) return;
    setManualName(modelSearchResult.name);
    if (modelSearchResult.watts) setManualWatts(String(modelSearchResult.watts));
    setManualHours(String(getDefaultHours(modelSearchResult.name)));
    setModelSearchResult(null);
    setModelSearchText('');
    setStep('manual');
  };

  const goBack = () => {
    if (step === 'manual') {
      setManualName('');
      setManualWatts('');
      setManualHours('');
      setManualQty('1');
      setWattWarning(null);
      setStep(selectedCategory ? 'categoryItems' : 'categories');
    } else if (step === 'categoryItems') {
      setSelectedCategory(null);
      setStep('categories');
    } else if (step === 'modelSearch') {
      setModelSearchResult(null);
      setModelSearchText('');
      setStep('categories');
    } else if (step === 'categories') {
      handleClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: theme.overlay, justifyContent: 'flex-end' }}
        activeOpacity={1}
        onPress={handleClose}
      >
        <View
          style={[
            {
              backgroundColor: theme.surface,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: '85%',
              paddingBottom: 30,
            },
            style,
          ]}
        >
          <View style={{ alignItems: 'center', paddingVertical: 12 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: theme.border }} />
          </View>

          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <TouchableOpacity onPress={goBack} style={{ padding: 8 }}>
                <Icon name="arrowLeft" size={20} color={theme.cyan} />
              </TouchableOpacity>
              <Text style={{ fontSize: 18, fontWeight: '700', color: theme.text, flex: 1, textAlign: 'center' }}>
                Agregar electrodoméstico
              </Text>
              <View style={{ width: 40 }} />
            </View>

            {renderStepContent()}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  function renderStepContent() {
    switch (step) {
      case 'categories':
        return renderCategoriesStep();
      case 'categoryItems':
        return renderCategoryItemsStep();
      case 'manual':
        return renderManualStep();
      case 'modelSearch':
        return renderModelSearchStep();
      default:
        return null;
    }
  }

  function renderCategoriesStep() {
    return (
      <>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {APPLIANCE_CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.name}
              onPress={() => handleCategoryPress(cat.name)}
              style={{
                backgroundColor: theme.card,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 14,
                width: '48%',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Text style={{ fontSize: 24 }}>{cat.icon}</Text>
              <Text style={{ color: theme.text, fontSize: 12, fontWeight: '600', textAlign: 'center' }}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16, marginTop: 16 }}>
          <Text style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, fontFamily: 'monospace' }}>
            ¿Conoces el modelo exacto?
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <View style={{ flex: 1, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderRadius: 10, paddingHorizontal: 12 }}>
              <TextInput
                value={modelSearchText}
                onChangeText={setModelSearchText}
                placeholder="Ej: Samsung RT38"
                placeholderTextColor={theme.textSub}
                style={{ color: theme.text, fontSize: 14, paddingVertical: 10 }}
                onSubmitEditing={handleModelSearch}
                returnKeyType="search"
              />
            </View>
            <Button onPress={handleModelSearch} disabled={modelSearchLoading} style={{ paddingVertical: 10, paddingHorizontal: 14 }}>
              {modelSearchLoading ? (
                <Text style={{ color: theme.bg, fontSize: 13, fontWeight: '700' }}>...</Text>
              ) : (
                <Icon name="scan" size={20} color={theme.bg} />
              )}
            </Button>
          </View>
          {modelSearchResult && (
            <View style={{ marginTop: 12, backgroundColor: theme.cyanDim, borderWidth: 1, borderColor: theme.cyanMid, borderRadius: 12, padding: 14 }}>
              {modelSearchResult.name ? (
                <>
                  <Text style={{ color: theme.cyan, fontSize: 14, fontWeight: '600' }}>{modelSearchResult.name}</Text>
                  {modelSearchResult.watts && (
                    <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', marginTop: 4 }}>
                      {modelSearchResult.watts}W
                      <Text style={{ fontSize: 11, fontWeight: '400', color: theme.textMuted }}>
                        {' '}({modelSearchResult.confidence === 'exact' ? 'EXACTO' : 'ESTIMADO'})
                      </Text>
                    </Text>
                  )}
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                    <Button onPress={handleApplyModelSearch} style={{ flex: 1, paddingVertical: 8, borderRadius: 8 }}>
                      <Text style={{ color: theme.bg, fontSize: 13, fontWeight: '700' }}>Usar</Text>
                    </Button>
                    <Button variant="ghost" onPress={() => setModelSearchResult(null)} style={{ flex: 1, paddingVertical: 8, borderRadius: 8 }}>
                      <Text style={{ color: theme.cyan, fontSize: 13, fontWeight: '700' }}>Descartar</Text>
                    </Button>
                  </View>
                </>
              ) : (
                <Text style={{ color: theme.gold, fontSize: 13 }}>No se encontraron especificaciones para &quot;{modelSearchResult.model}&quot;.</Text>
              )}
            </View>
          )}
        </View>
      </>
    );
  }

  function renderCategoryItemsStep() {
    const category = APPLIANCE_CATEGORIES.find(c => c.name === selectedCategory);
    if (!category) return null;

    return (
      <>
        <TouchableOpacity onPress={goBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Icon name="arrowLeft" size={18} color={theme.cyan} />
          <Text style={{ color: theme.cyan, fontSize: 13 }}>Todas las categorías</Text>
        </TouchableOpacity>
        {category.items.map(item => {
          const db = APPLIANCES_DB[item];
          return (
            <TouchableOpacity
              key={item}
              onPress={() => handleAppliancePress(item)}
              style={{
                backgroundColor: theme.card,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 12,
                paddingVertical: 14,
                paddingHorizontal: 16,
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={{ fontSize: 22 }}>{db?.icon || '⚡'}</Text>
                <View>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>{item}</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 11 }}>
                    {db?.watts}W — {db?.defaultHours}h/día
                  </Text>
                </View>
              </View>
              <Icon name="chevronRight" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          );
        })}
      </>
    );
  }

  function renderManualStep() {
    if (!manualName) return null;

    const expectedWatts = getExpectedWattsUtil(manualName) ?? 0;
    const defaultHours = getDefaultHours(manualName);

    return (
      <>
        <TouchableOpacity onPress={goBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Icon name="arrowLeft" size={18} color={theme.cyan} />
          <Text style={{ color: theme.cyan, fontSize: 13 }}>{selectedCategory || 'Categorías'}</Text>
        </TouchableOpacity>

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
              onChange={handleWattsChange}
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

        <View style={{ flexDirection: 'row', gap: 10 }}>
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

        {manualHours && parseFloat(manualHours) > 0 && manualWatts && (
          <View style={{ backgroundColor: theme.cyanDim, borderWidth: 1, borderColor: theme.cyanMid, borderRadius: 10, padding: 12, marginBottom: 12 }}>
            <Text style={{ fontSize: 13, color: theme.cyan }}>
              Consumo: {((parseFloat(manualWatts) * parseFloat(manualHours) * 30 * parseInt(manualQty)) / 1000).toFixed(1)} kWh/mes ≈ {formatCOP(((parseFloat(manualWatts) * parseFloat(manualHours) * 30 * parseInt(manualQty)) / 1000) * tariff)}
            </Text>
          </View>
        )}

        <EnergyTips applianceName={manualName} />

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <View style={{ flex: 1 }}>
            <Button variant="ghost" onPress={goBack} style={{ paddingVertical: 12 }}>
              <Text style={{ color: theme.cyan, fontSize: 15, fontWeight: '700' }}>Cancelar</Text>
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button onPress={handleSaveManual} disabled={saving || !manualName} style={{ paddingVertical: 12 }}>
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
      </>
    );
  }

  function renderModelSearchStep() {
    return (
      <>
        <TouchableOpacity onPress={goBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Icon name="arrowLeft" size={18} color={theme.cyan} />
          <Text style={{ color: theme.cyan, fontSize: 13 }}>Buscar modelo</Text>
        </TouchableOpacity>
        <View style={{ backgroundColor: theme.cyanDim, borderWidth: 1, borderColor: theme.cyanMid, borderRadius: 12, padding: 14 }}>
          {modelSearchResult?.name ? (
            <>
              <Text style={{ color: theme.cyan, fontSize: 14, fontWeight: '600' }}>{modelSearchResult.name}</Text>
              {modelSearchResult.watts && (
                <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', marginTop: 4 }}>
                  {modelSearchResult.watts}W
                  <Text style={{ fontSize: 11, fontWeight: '400', color: theme.textMuted }}>
                    {' '}({modelSearchResult.confidence === 'exact' ? 'EXACTO' : 'ESTIMADO'})
                  </Text>
                </Text>
              )}
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                <Button onPress={handleApplyModelSearch} style={{ flex: 1, paddingVertical: 8, borderRadius: 8 }}>
                  <Text style={{ color: theme.bg, fontSize: 13, fontWeight: '700' }}>Usar</Text>
                </Button>
                <Button variant="ghost" onPress={() => setModelSearchResult(null)} style={{ flex: 1, paddingVertical: 8, borderRadius: 8 }}>
                  <Text style={{ color: theme.cyan, fontSize: 13, fontWeight: '700' }}>Descartar</Text>
                </Button>
              </View>
            </>
          ) : (
            <Text style={{ color: theme.gold, fontSize: 13 }}>No se encontraron especificaciones para &quot;{modelSearchResult?.model}&quot;.</Text>
          )}
        </View>
      </>
    );
  }
};

export default AddApplianceModal;