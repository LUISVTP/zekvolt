// ─── src/services/vision.service.ts ──────────────────────────────────
// Servicio de visión IA (wrapper con validación y lógica de negocio)

import { analyzeApplianceImage as analyzeImage, lookupModelByText as lookupModel } from '@/lib/nvidia';
import { validateWatts } from '@/utils/validation';
import { getExpectedWatts } from '@/data/appliances';
import type { VisionResult, ModelLookupResult, WattValidationResult } from '@/types';
import { ZekvoltError } from '@/types';

export interface VisionAnalysisResult {
  result: VisionResult;
  validation: WattValidationResult | null;
}

export interface ModelLookupServiceResult {
  result: ModelLookupResult;
  validation: WattValidationResult | null;
}

/**
 * Analiza imagen de electrodoméstico y valida el wattaje detectado
 */
export async function analyzeApplianceImage(
  imageBase64: string,
  mimeType = 'image/jpeg'
): Promise<VisionAnalysisResult> {
  const result = await analyzeImage(imageBase64, mimeType);

  let validation: WattValidationResult | null = null;
  if (result.name && result.watts) {
    validation = validateWatts(result.name, result.watts);
  }

  return { result, validation };
}

/**
 * Busca especificaciones por modelo de texto y valida
 */
export async function lookupModelByText(modelText: string): Promise<ModelLookupServiceResult> {
  const result = await lookupModel(modelText);

  let validation: WattValidationResult | null = null;
  if (result.name && result.watts) {
    validation = validateWatts(result.name, result.watts);
  }

  return { result, validation };
}

/**
 * Obtiene el wattaje esperado para un electrodoméstico del catálogo
 */
export function getExpectedWattsForAppliance(name: string): number | null {
  return getExpectedWatts(name);
}

/**
 * Valida wattaje ingresado manualmente
 */
export function validateManualWatts(name: string, watts: number): WattValidationResult {
  return validateWatts(name, watts);
}