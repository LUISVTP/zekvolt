// ─── src/components/home/ConsumptionCharts.tsx ────────────────────────
// Gráficas de consumo mensual: distribución (dona) y detalle por aparato.
// Usa react-native-svg, ya incluido en el proyecto.

import React, { useMemo } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Text } from '@/components/ui/AppText';
import Icon from '@/components/icons/Icon';
import { useTheme } from '@/styles/theme';
import { formatCOP, formatKwh } from '@/utils/formatters';
import type { ApplianceWithComputed } from '@/types';

interface ConsumptionChartsProps {
  visible: boolean;
  onClose: () => void;
  appliances: ApplianceWithComputed[];
  totalKwh: number;
  estimatedBill: number;
}

const DONUT_SIZE = 190;
const DONUT_STROKE = 24;
const DONUT_RADIUS = (DONUT_SIZE - DONUT_STROKE) / 2;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

export const ConsumptionCharts = ({
  visible,
  onClose,
  appliances,
  totalKwh,
  estimatedBill,
}: ConsumptionChartsProps) => {
  const { theme } = useTheme();

  const palette = [theme.cyan, theme.gold, theme.green, theme.orange, theme.red, theme.textMuted];

  const { segments, sorted, maxKwh } = useMemo(() => {
    const withConsumption = [...appliances]
      .filter(appliance => appliance.monthlyKwh > 0)
      .sort((a, b) => b.monthlyKwh - a.monthlyKwh);

    const top = withConsumption.slice(0, 5);
    const rest = withConsumption.slice(5).reduce((sum, appliance) => sum + appliance.monthlyKwh, 0);

    const donutSegments = top.map((appliance, index) => ({
      name: appliance.name,
      value: appliance.monthlyKwh,
      color: palette[index % palette.length],
    }));

    if (rest > 0) {
      donutSegments.push({ name: 'Otros', value: rest, color: palette[5] });
    }

    return {
      segments: donutSegments,
      sorted: withConsumption,
      maxKwh: withConsumption[0]?.monthlyKwh ?? 0,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliances, theme.cyan, theme.gold, theme.green, theme.orange, theme.red, theme.textMuted]);

  const segmentsTotal = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: theme.overlay, justifyContent: 'flex-end' }}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <View
          accessibilityViewIsModal
          style={{
            height: '88%',
            backgroundColor: theme.surface,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 24,
          }}
        >
          <View style={{ alignItems: 'center', paddingBottom: 10 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: theme.border }} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: theme.text }}>Gráficas de consumo</Text>
            <TouchableOpacity
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cerrar gráficas"
              hitSlop={8}
              style={{ padding: 8 }}
            >
              <Icon name="x" size={20} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            {sorted.length === 0 ? (
              <View
                style={{
                  backgroundColor: theme.cyanDim,
                  borderWidth: 1,
                  borderColor: theme.cyanMid,
                  borderRadius: 14,
                  padding: 20,
                  alignItems: 'center',
                }}
              >
                <Icon name="activity" size={32} color={theme.cyan} label="Gráficas" />
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700', marginTop: 10 }}>
                  Aún no hay datos
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 6, textAlign: 'center' }}>
                  Agrega electrodomésticos en Aparatos para ver la distribución de tu consumo.
                </Text>
              </View>
            ) : (
              <>
                {/* Resumen */}
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: theme.card,
                    borderWidth: 1,
                    borderColor: theme.border,
                    borderRadius: 14,
                    padding: 16,
                    marginBottom: 20,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, color: theme.textMuted }}>Consumo mensual</Text>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: theme.cyan, marginTop: 2 }}>
                      {formatKwh(totalKwh)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, color: theme.textMuted }}>Factura estimada</Text>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: theme.gold, marginTop: 2 }}>
                      {formatCOP(estimatedBill)}
                    </Text>
                  </View>
                </View>

                {/* Distribución (dona) */}
                <Text style={{ fontSize: 15, fontWeight: '700', color: theme.text, marginBottom: 4 }}>
                  Distribución del consumo
                </Text>
                <Text style={{ fontSize: 12, color: theme.textMuted, marginBottom: 16 }}>
                  Porcentaje que aporta cada aparato al total del mes.
                </Text>

                <View style={{ alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ width: DONUT_SIZE, height: DONUT_SIZE }}>
                    <Svg width={DONUT_SIZE} height={DONUT_SIZE}>
                      <G rotation={-90} origin={`${DONUT_SIZE / 2}, ${DONUT_SIZE / 2}`}>
                        <Circle
                          cx={DONUT_SIZE / 2}
                          cy={DONUT_SIZE / 2}
                          r={DONUT_RADIUS}
                          stroke={theme.border}
                          strokeWidth={DONUT_STROKE}
                          fill="none"
                        />
                        {segments.map((segment, index) => {
                          const length = segmentsTotal > 0 ? (segment.value / segmentsTotal) * DONUT_CIRCUMFERENCE : 0;
                          const previous = segments
                            .slice(0, index)
                            .reduce((sum, item) => sum + item.value, 0);
                          const offset = segmentsTotal > 0 ? (previous / segmentsTotal) * DONUT_CIRCUMFERENCE : 0;
                          const visibleLength = Math.max(length - 2, 0);
                          return (
                            <Circle
                              key={`${segment.name}-${index}`}
                              cx={DONUT_SIZE / 2}
                              cy={DONUT_SIZE / 2}
                              r={DONUT_RADIUS}
                              stroke={segment.color}
                              strokeWidth={DONUT_STROKE}
                              strokeDasharray={`${visibleLength} ${DONUT_CIRCUMFERENCE}`}
                              strokeDashoffset={-offset}
                              strokeLinecap="butt"
                              fill="none"
                            />
                          );
                        })}
                      </G>
                    </Svg>
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 22, fontWeight: '800', color: theme.text }}>
                        {formatKwh(totalKwh)}
                      </Text>
                      <Text style={{ fontSize: 11, color: theme.textMuted }}>al mes</Text>
                    </View>
                  </View>
                </View>

                {/* Leyenda con nombre, valor y porcentaje (no depende solo del color) */}
                <View style={{ marginBottom: 24 }}>
                  {segments.map((segment, index) => {
                    const percent = segmentsTotal > 0 ? (segment.value / segmentsTotal) * 100 : 0;
                    return (
                      <View
                        key={`${segment.name}-${index}`}
                        accessible
                        accessibilityLabel={`${segment.name}: ${formatKwh(segment.value)}, ${Math.round(percent)} por ciento del total`}
                        style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6 }}
                      >
                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: segment.color, marginRight: 10 }} />
                        <Text style={{ flex: 1, fontSize: 13, color: theme.text }} numberOfLines={1}>
                          {segment.name}
                        </Text>
                        <Text style={{ fontSize: 12, color: theme.textMuted, marginRight: 10 }}>
                          {formatKwh(segment.value)}
                        </Text>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text, minWidth: 42, textAlign: 'right' }}>
                          {Math.round(percent)}%
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* Detalle por aparato */}
                <Text style={{ fontSize: 15, fontWeight: '700', color: theme.text, marginBottom: 12 }}>
                  Detalle por aparato
                </Text>
                {sorted.map(appliance => {
                  const width = maxKwh > 0 ? (appliance.monthlyKwh / maxKwh) * 100 : 0;
                  const percent = totalKwh > 0 ? (appliance.monthlyKwh / totalKwh) * 100 : 0;
                  return (
                    <View
                      key={appliance.id}
                      accessible
                      accessibilityLabel={`${appliance.name}: ${formatKwh(appliance.monthlyKwh)}, ${Math.round(percent)} por ciento`}
                      style={{ marginBottom: 12 }}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text style={{ flex: 1, fontSize: 13, color: theme.text }} numberOfLines={1}>
                          {appliance.icon} {appliance.name}
                        </Text>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: theme.cyan, marginLeft: 8 }}>
                          {formatKwh(appliance.monthlyKwh)}
                        </Text>
                      </View>
                      <View style={{ height: 8, borderRadius: 4, backgroundColor: theme.border }}>
                        <View
                          style={{
                            height: '100%',
                            borderRadius: 4,
                            width: `${Math.min(width, 100)}%`,
                            backgroundColor: theme.cyan,
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ConsumptionCharts;
