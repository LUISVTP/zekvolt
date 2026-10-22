// ─── src/services/profile.service.ts ─────────────────────────────────
// Servicio de perfiles de usuario (city, estrato, company)

import { getSupabaseClient } from '@/lib';
import type { Profile } from '@/types';
import { ZekvoltError } from '@/types';

export interface ProfileResult {
  data: Profile | null;
  error: ZekvoltError | null;
}

export interface ProfileListResult {
  data: Profile[] | null;
  error: ZekvoltError | null;
}

function mapError(error: Error): ZekvoltError {
  return new ZekvoltError('PROFILE_ERROR', error.message);
}

export async function getProfile(userId: string): Promise<ProfileResult> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) return { data: null, error: mapError(error) };
  return { data: data as Profile | null, error: null };
}

export async function createProfile(
  userId: string,
  profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
): Promise<ProfileResult> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, ...profile })
    .select()
    .single();

  if (error) return { data: null, error: mapError(error) };
  return { data: data as Profile, error: null };
}

export async function updateProfile(
  userId: string,
  updates: Partial<Omit<Profile, 'id' | 'created_at'>>
): Promise<ProfileResult> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) return { data: null, error: mapError(error) };
  return { data: data as Profile, error: null };
}