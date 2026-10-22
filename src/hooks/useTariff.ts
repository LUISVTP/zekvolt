// ─── src/hooks/useTariff.ts ────────────────────────────────────────────
// Hook para cálculos de tarifa y consumo

import { useCallback } from 'react';
import { getTariffForStratum, getCompanyCU, getSubsistenceLimit, formatCOP, formatKwh } from '@/data/tariffs';
import { calculateConsumption } from '@/services/appliance.service';
import type { Appliance, ConsumptionCalculation, TariffInfo } from '@/types';

interface UseTariffResult {
  getTariff: (company: string, estrato: number) => number;
  getTariffInfo: (company: string, estrato: number) => TariffInfo;
  calculateConsumption: (appliances: Appliance[], company: string, estrato: number) => ConsumptionCalculation;
  formatCOP: (value: number) => string;
  formatKwh: (value: number) => string;
}

export function useTariff(): UseTariffResult {
  const getTariff = useCallback((company: string, estrato: number) => {
    return getTariffForStratum(company, estrato);
  }, []);

  const getTariffInfo = useCallback((company: string, estrato: number): TariffInfo => {
    return {
      company,
      estrato,
      tariff: getTariffForStratum(company, estrato),
      cuBase: getCompanyCU(company),
      subsistenceLimit: getSubsistenceLimit(company),
    };
  }, []);

  const calculateConsumptionAction = useCallback(
    (appliances: Appliance[], company: string, estrato: number): ConsumptionCalculation => {
      const tariff = getTariffForStratum(company, estrato);
      return calculateConsumption(appliances, tariff);
    },
    []
  );

  return {
    getTariff,
    getTariffInfo,
    calculateConsumption: calculateConsumptionAction,
    formatCOP,
    formatKwh,
  };
}