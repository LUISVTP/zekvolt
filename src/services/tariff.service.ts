// ─── src/services/tariff.service.ts ──────────────────────────────────
// Servicio de tarifas y cálculos de consumo

import { getTariffForStratum, getCompanyCU, getSubsistenceLimit, formatCOP, formatKwh } from '@/data/tariffs';
import type { TariffCalculationResult, ApplianceWithComputed } from '@/types';

export interface TariffInfo {
  company: string;
  estrato: number;
  tariff: number;        // COP/kWh
  cuBase: number;        // Costo Unitario base (estrato 4)
  subsistenceLimit: number | null; // kWh/mes
}

export function getTariffInfo(company: string, estrato: number): TariffInfo {
  return {
    company,
    estrato,
    tariff: getTariffForStratum(company, estrato),
    cuBase: getCompanyCU(company),
    subsistenceLimit: getSubsistenceLimit(company),
  };
}

export function calculateBill(
  appliances: ApplianceWithComputed[],
  company: string,
  estrato: number
): TariffCalculationResult {
  const tariff = getTariffForStratum(company, estrato);
  const totalKwh = appliances.reduce((acc, a) => acc + a.monthlyKwh, 0);
  const dailyKwh = totalKwh / 30;
  const estimatedBill = totalKwh * tariff;

  const topConsumers = [...appliances]
    .sort((a, b) => b.monthlyKwh - a.monthlyKwh)
    .slice(0, 4);

  return {
    totalKwh,
    dailyKwh,
    estimatedBill,
    tariff,
    topConsumers,
  };
}

export { formatCOP, formatKwh };