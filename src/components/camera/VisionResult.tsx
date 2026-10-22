// ─── src/components/camera/VisionResult.tsx ───────────────────────────────
// Resultado del análisis de visión IA

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleProp, ViewStyle, ScrollView, Image } from 'react-native';
import { formatCOP } from '@/utils/formatters';
import { getDefaultHours, getExpectedWatts } from '@/data/appliances';
import { useTheme } from '@/styles/theme';
import { Button } from '@/components/ui';
import Icon from '@/components/icons/Icon';
import type { VisionResult as VisionResultData } from '@/types';

interface VisionResultProps {
  result: VisionResultData;
  capturedImage: string | null;
  onConfirm: (hours: number, qty: number) => void;
  onRescan: () => void;
  onBack: () => void;
  onManualEdit: () => void;
  tariff: number;
  style?: StyleProp<ViewStyle>;
}

export const VisionResult = ({
  result,
  capturedImage,
  onConfirm,
  onRescan,
  onBack,
  onManualEdit,
  tariff,
  style,
}: VisionResultProps) => {
  const { theme } = useTheme();
  const db = getExpectedWatts(result.name || '') ? { watts: getExpectedWatts(result.name || '')!, defaultHours: getDefaultHours(result.name || '') } : null;
  const isKnown = !!db;
  const isEstimated = result.confidence === 'estimated';
  const [hours, setHours] = React.useState(db?.defaultHours || 4);
  const [qty, setQty] = React.useState(1);
  const [localWatts, setLocalWatts] = React.useState<number>(result.watts ?? db?.watts ?? 0);

  const estimatedMonthly = localWatts && hours > 0
    ? (localWatts * hours * 30 * qty) / 1000
    : 0;
  const estimatedCost = estimatedMonthly * tariff;

  return (
    <ScrollView
      style={[{ flex: 1, backgroundColor: theme.bg }, style]}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Icon name="arrowLeft" size={20} color={theme.cyan} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '700', color: theme.text, flex: 1, textAlign: 'center', marginRight: 36 }}>
          IA detectó
        </Text>
      </View>

      {/* Imagen capturada */}
      {capturedImage && (
        <View
          style={{
            width: '90%',
            aspectRatio: 4 / 3,
            borderRadius: 16,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: theme.border,
            alignSelf: 'center',
            marginBottom: 16,
          }}
        >
          <Image source={{ uri: `data:image/jpeg;base64,${capturedImage}` }} style={{ flex: 1, resizeMode: 'contain' }} />
        </View>
      )}

      {/* Datos detectados */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text, marginBottom: 16 }}>
          Datos del electrodoméstico
        </Text>

        {/* Nombre */}
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
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600' }}>
              {isKnown ? `${result.name}` : result.name}
            </Text>
            {!isKnown && (
              <Text style={{ color: theme.gold, fontSize: 11 }}>No catalogado</Text>
            )}
          </View>
        </View>

        {/* Potencia */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, fontFamily: 'monospace' }}>
            Potencia
          </Text>
          <View
            style={{
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 14,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {result.watts ? (
                <Text style={{ color: theme.cyan, fontSize: 20, fontWeight: '800' }}>
                  {result.watts}W
                  {result.watts >= 1000 && (
                    <Text style={{ fontSize: 12, fontWeight: '400', color: theme.textMuted }}>
                      {' '}({(result.watts / 1000).toFixed(1)}kW)
                    </Text>
                  )}
                </Text>
              ) : (
                <Text style={{ color: theme.gold, fontSize: 14 }}>
                  No se pudo determinar de la imagen
                </Text>
              )}

              {/* Badge de confianza */}
              {result.confidence === 'exact' && (
                <View
                  style={{
                    backgroundColor: `${theme.green}22`,
                    borderWidth: 1,
                    borderColor: `${theme.green}66`,
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text style={{ color: theme.green, fontSize: 10, fontWeight: '700' }}>EXACTO</Text>
                </View>
              )}
              {isEstimated && (
                <View
                  style={{
                    backgroundColor: theme.goldDim,
                    borderWidth: 1,
                    borderColor: `${theme.gold}66`,
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text style={{ color: theme.gold, fontSize: 10, fontWeight: '700' }}>ESTIMADO</Text>
                </View>
              )}
            </View>

            {isEstimated && (
              <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 6, lineHeight: 16 }}>
                No se leyó el wattaje exacto de una etiqueta. Este valor es un promedio estimado para este tipo de electrodoméstico.
              </Text>
            )}
            {isKnown && result.watts && result.watts !== db.watts && (
              <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 4 }}>
                En nuestro registro: {db.watts}W (ajusta si es necesario)
              </Text>
            )}
          </View>
        </View>

        {/* Modelo */}
        {result.model && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, fontFamily: 'monospace' }}>
              Modelo
            </Text>
            <View
              style={{
                backgroundColor: theme.card,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 14,
              }}
            >
              <Text style={{ color: theme.text, fontSize: 14 }}>{result.model}</Text>
            </View>
          </View>
        )}

        {/* Horas y cantidad */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          <View style={{ flex: 2 }}>
            <Text style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, fontFamily: 'monospace' }}>
              Horas/día
            </Text>
            <View
              style={{
                backgroundColor: theme.card,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 8,
              }}
            >
              <TextInput
                value={String(hours)}
                onChangeText={text => setHours(parseFloat(text) || 0)}
                placeholder={String(db?.defaultHours || 4)}
                placeholderTextColor={theme.textSub}
                keyboardType="numeric"
                style={{ color: theme.text, fontSize: 15, paddingVertical: 6 }}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, fontFamily: 'monospace' }}>
              Cantidad
            </Text>
            <View
              style={{
                backgroundColor: theme.card,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 8,
              }}
            >
              <TextInput
                value={String(qty)}
                onChangeText={text => setQty(parseInt(text) || 1)}
                placeholder="1"
                placeholderTextColor={theme.textSub}
                keyboardType="numeric"
                style={{ color: theme.text, fontSize: 15, paddingVertical: 6 }}
              />
            </View>
          </View>
        </View>

        {/* Estimación de consumo */}
        {localWatts && hours > 0 && (
          <View style={{ backgroundColor: theme.cyanDim, borderWidth: 1, borderColor: theme.cyanMid, borderRadius: 10, padding: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 13, color: theme.cyan }}>
              Consumo: {estimatedMonthly.toFixed(1)} kWh/mes ≈ {formatCOP(estimatedCost)}
            </Text>
          </View>
        )}

        {/* Botón rescán si es estimado */}
        {isEstimated && (
          <View
            style={{
              backgroundColor: theme.goldDim,
              borderWidth: 1,
              borderColor: `${theme.gold}66`,
              borderRadius: 14,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '600', marginBottom: 8 }}>
              ¿Quieres mayor precisión?
            </Text>
            <Text style={{ color: theme.text, fontSize: 12, lineHeight: 18, marginBottom: 12 }}>
              Toma una foto de la placa de especificaciones donde aparecen los watts exactos.
            </Text>
            <Button onPress={onRescan} style={{ paddingVertical: 10 }}>
              <Icon name="camera" size={18} color={theme.bg} />
              <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>Tomar foto de la placa exacta</Text>
            </Button>
            <View style={{ marginTop: 8 }}>
              <Text style={{ color: theme.textMuted, fontSize: 11, textAlign: 'center' }}>
                O edita manualmente abajo
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Botones de acción */}
      <View style={{ paddingHorizontal: 20, gap: 10 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Button variant="ghost" onPress={onBack} style={{ paddingVertical: 12 }}>
              <Text style={{ color: theme.cyan, fontSize: 15, fontWeight: '700' }}>Descartar</Text>
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button variant="danger" onPress={onManualEdit} style={{ paddingVertical: 12 }}>
              <Icon name="edit" size={16} color={theme.red} />
              <Text style={{ color: theme.red, fontSize: 15, fontWeight: '700' }}>Editar manual</Text>
            </Button>
          </View>
        </View>
        <Button onPress={() => onConfirm(hours, qty)} style={{ paddingVertical: 14 }}>
          <Icon name="check" size={18} color={theme.bg} />
          <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>Confirmar y guardar</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default VisionResult;