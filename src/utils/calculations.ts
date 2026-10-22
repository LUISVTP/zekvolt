// ─── src/utils/calculations.ts ───────────────────────────────────────
// Cálculos de consumo energético

import type { Appliance, ApplianceWithComputed } from '@/types';
import { getApplianceData } from '@/data/appliances';

/**
 * Enriquece un electrodoméstico con datos del catálogo
 */
export function enrichAppliance(appliance: Appliance): ApplianceWithComputed {
  const db = getApplianceData(appliance.name);
  const watts = db?.watts ?? 0;
  const monthlyKwh = (watts * appliance.hours * 30 * appliance.qty) / 1000;

  return {
    ...appliance,
    watts,
    monthlyKwh,
    monthlyCost: 0, // Se calcula aparte con tarifa
    icon: db?.icon ?? '⚡',
    defaultHours: db?.defaultHours ?? 4,
  };
}

/**
 * Calcula consumo total mensual en kWh
 */
export function calculateTotalMonthlyKwh(appliances: Appliance[]): number {
  return appliances.reduce((acc, a) => {
    const db = getApplianceData(a.name);
    return acc + (db ? db.watts * a.hours * 30 * a.qty : 0);
  }, 0) / 1000;
}

/**
 * Calcula factura estimada
 */
export function calculateEstimatedBill(totalKwh: number, tariff: number): number {
  return totalKwh * tariff;
}

/**
 * Calcula consumo diario promedio
 */
export function calculateDailyKwh(totalMonthlyKwh: number): number {
  return totalMonthlyKwh / 30;
}

/**
 * Obtiene top consumidores
 */
export function getTopConsumers(
  appliances: Appliance[],
  limit = 4
): ApplianceWithComputed[] {
  return appliances
    .map(enrichAppliance)
    .sort((a, b) => b.monthlyKwh - a.monthlyKwh)
    .slice(0, limit);
}

/**
 * Calcula desglose por electrodoméstico
 */
export interface ApplianceBreakdown {
  appliance: ApplianceWithComputed;
  monthlyKwh: number;
  monthlyCost: number;
  percentage: number;
}

export function calculateBreakdown(
  appliances: Appliance[],
  tariff: number
): ApplianceBreakdown[] {
  const totalKwh = calculateTotalMonthlyKwh(appliances);

  return appliances
    .map(enrichAppliance)
    .map(appliance => ({
      appliance,
      monthlyKwh: appliance.monthlyKwh,
      monthlyCost: appliance.monthlyKwh * tariff,
      percentage: totalKwh > 0 ? (appliance.monthlyKwh / totalKwh) * 100 : 0,
    }))
    .sort((a, b) => b.monthlyKwh - a.monthlyKwh);
}

/**
 * Estima ahorro aplicando consejos (porcentaje estimado)
 */
export function estimateSavings(
  currentBill: number,
  savingsPercent: number
): number {
  return currentBill * (savingsPercent / 100);
}

/**
 * Proyecta factura anual
 */
export function projectAnnualBill(monthlyBill: number): number {
  return monthlyBill * 12;
}