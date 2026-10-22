// ─── src/hooks/useAppliances.ts ───────────────────────────────────────
// Hook para manejo de electrodomésticos

import { useState, useCallback } from 'react';
import { getAppliances, addAppliance, removeAppliance, calculateConsumption } from '@/services/appliance.service';
import type { Appliance, ApplianceInput, ConsumptionCalculation } from '@/types';

interface UseAppliancesResult {
  appliances: Appliance[];
  loading: boolean;
  error: Error | null;
  fetchAppliances: (userId: string) => Promise<void>;
  addAppliance: (userId: string, input: ApplianceInput) => Promise<Appliance>;
  removeAppliance: (applianceId: string) => Promise<void>;
  calculateConsumption: (tariff: number) => ConsumptionCalculation;
  clearAppliances: () => void;
}

export function useAppliances(): UseAppliancesResult {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAppliances = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getAppliances(userId);
      if (error) throw error;
      setAppliances(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setAppliances([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addApplianceAction = useCallback(async (userId: string, input: ApplianceInput) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await addAppliance(userId, input);
      if (error) throw error;
      if (data) setAppliances(prev => [...prev, data]);
      return data!;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeApplianceAction = useCallback(async (applianceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await removeAppliance(applianceId);
      if (error) throw error;
      setAppliances(prev => prev.filter(a => a.id !== applianceId));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateConsumptionAction = useCallback((tariff: number): ConsumptionCalculation => {
    return calculateConsumption(appliances, tariff);
  }, [appliances]);

  const clearAppliances = useCallback(() => {
    setAppliances([]);
    setError(null);
  }, []);

  return {
    appliances,
    loading,
    error,
    fetchAppliances,
    addAppliance: addApplianceAction,
    removeAppliance: removeApplianceAction,
    calculateConsumption: calculateConsumptionAction,
    clearAppliances,
  };
}