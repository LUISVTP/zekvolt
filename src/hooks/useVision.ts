// ─── src/hooks/useVision.ts ───────────────────────────────────────────
// Hook para módulo de visión IA

import { useState, useCallback } from 'react';
import { analyzeApplianceImage, lookupModelByText, validateManualWatts, getExpectedWattsForAppliance } from '@/services/vision.service';
import type { VisionResult, ModelLookupResult, WattValidationResult } from '@/types';

interface UseVisionResult {
  analyzing: boolean;
  error: Error | null;
  analyzeImage: (imageBase64: string, mimeType?: string) => Promise<{ result: VisionResult; validation: WattValidationResult | null }>;
  lookupModel: (modelText: string) => Promise<{ result: ModelLookupResult; validation: WattValidationResult | null }>;
  validateWatts: (name: string, watts: number) => WattValidationResult;
  getExpectedWatts: (name: string) => number | null;
  clearError: () => void;
}

export function useVision(): UseVisionResult {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const analyzeImageAction = useCallback(async (imageBase64: string, mimeType = 'image/jpeg') => {
    setAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeApplianceImage(imageBase64, mimeType);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      throw err;
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const lookupModelAction = useCallback(async (modelText: string) => {
    setAnalyzing(true);
    setError(null);
    try {
      const result = await lookupModelByText(modelText);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      throw err;
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const validateWattsAction = useCallback((name: string, watts: number) => {
    return validateManualWatts(name, watts);
  }, []);

  const getExpectedWattsAction = useCallback((name: string) => {
    return getExpectedWattsForAppliance(name);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    analyzing,
    error,
    analyzeImage: analyzeImageAction,
    lookupModel: lookupModelAction,
    validateWatts: validateWattsAction,
    getExpectedWatts: getExpectedWattsAction,
    clearError,
  };
}