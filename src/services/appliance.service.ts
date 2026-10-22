// ─── src/services/appliance.service.ts ───────────────────────────────
// Servicio de electrodomésticos (CRUD)

import { getSupabaseClient } from '@/lib';
import type { Appliance, ApplianceWithComputed } from '@/types';
import { getApplianceData } from '@/data';
import { ZekvoltError } from '@/types';

export interface ApplianceInput {
  name: string;
  hours: number;
  qty: number;
}

export interface ApplianceResult {
  data: Appliance | null;
  error: ZekvoltError | null;
}

export interface ApplianceListResult {
  data: Appliance[] | null;
  error: ZekvoltError | null;
}

function mapError(error: Error): ZekvoltError {
  return new ZekvoltError('APPLIANCE_ERROR', error.message);
}

function enrichAppliance(appliance: Appliance): ApplianceWithComputed {
  const db = getApplianceData(appliance.name);
  return {
    ...appliance,
    watts: db?.watts ?? 0,
    monthlyKwh: db ? (db.watts * appliance.hours * 30 * appliance.qty) / 1000 : 0,
    monthlyCost: 0, // Se calcula con la tarifa
    icon: db?.icon ?? '⚡',
    defaultHours: db?.defaultHours ?? 4,
  };
}

export async function getAppliances(userId: string): Promise<ApplianceListResult> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('electrodomesticos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) return { data: null, error: mapError(error) };
  return { data: (data ?? []) as Appliance[], error: null };
}

export async function addAppliance(userId: string, input: ApplianceInput): Promise<ApplianceResult> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('electrodomesticos')
    .insert({ user_id: userId, ...input })
    .select()
    .single();

  if (error) return { data: null, error: mapError(error) };
  return { data: data as Appliance, error: null };
}

export async function removeAppliance(applianceId: string): Promise<ApplianceResult> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('electrodomesticos')
    .delete()
    .eq('id', applianceId);

  if (error) return { data: null, error: mapError(error) };
  return { data: null, error: null };
}

// Calcular consumo total y factura estimada
export interface ConsumptionCalculation {
  totalKwh: number;
  dailyKwh: number;
  estimatedBill: number;
  tariff: number;
  topConsumers: ApplianceWithComputed[];
}

export function calculateConsumption(
  appliances: Appliance[],
  tariff: number
): ConsumptionCalculation {
  const enriched = appliances.map(enrichAppliance);
  const totalWattHoursMonth = enriched.reduce(
    (acc, a) => acc + (a.watts * a.hours * 30 * a.qty),
    0
  );
  const totalKwh = totalWattHoursMonth / 1000;
  const dailyKwh = totalKwh / 30;
  const estimatedBill = totalKwh * tariff;

  const topConsumers = [...enriched]
    .sort((a, b) => b.monthlyKwh - a.monthlyKwh)
    .slice(0, 4);

  return { totalKwh, dailyKwh, estimatedBill, tariff, topConsumers };
}