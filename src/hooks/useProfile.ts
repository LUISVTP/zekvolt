// ─── src/hooks/useProfile.ts ──────────────────────────────────────────
// Hook para manejo de perfil de usuario

import { useState, useCallback } from 'react';
import { getProfile, createProfile, updateProfile } from '@/services/profile.service';
import type { Profile } from '@/types';

interface UseProfileResult {
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  fetchProfile: (userId: string) => Promise<void>;
  createProfile: (userId: string, data: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => Promise<Profile>;
  updateProfile: (userId: string, data: Partial<Omit<Profile, 'id' | 'created_at'>>) => Promise<Profile>;
  clearProfile: () => void;
}

export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getProfile(userId);
      if (error) throw error;
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProfileAction = useCallback(async (
    userId: string,
    data: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const { data: newProfile, error } = await createProfile(userId, data);
      if (error) throw error;
      setProfile(newProfile!);
      return newProfile!;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfileAction = useCallback(async (
    userId: string,
    data: Partial<Omit<Profile, 'id' | 'created_at'>>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const { data: updatedProfile, error } = await updateProfile(userId, data);
      if (error) throw error;
      setProfile(updatedProfile!);
      return updatedProfile!;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
    setError(null);
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    createProfile: createProfileAction,
    updateProfile: updateProfileAction,
    clearProfile,
  };
}