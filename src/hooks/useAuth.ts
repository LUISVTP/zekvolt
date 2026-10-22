// ─── src/hooks/useAuth.ts ────────────────────────────────────────────
// Hook para manejo de autenticación

import { useEffect, useState, useCallback } from 'react';
import { signIn, signUp, signOut, getSession, onAuthChange, updatePassword, sendPasswordResetEmail } from '@/services/auth.service';
import type { User, Session } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data, error } = await getSession();
      if (!mounted) return;
      if (error) {
        console.error('Error getting session:', error);
      }
      setSession(data);
      setUser(data?.user ?? null);
      setLoading(false);
    };

    init();

    const { data: { subscription } } = onAuthChange(async (event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await signIn(email, password);
    if (error) throw error;
    return data;
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const { data, error } = await signUp(email, password);
    if (error) throw error;
    return data;
  }, []);

  const logout = useCallback(async () => {
    const { error } = await signOut();
    if (error) throw error;
  }, []);

  const changePassword = useCallback(async (newPassword: string) => {
    const { data, error } = await updatePassword(newPassword);
    if (error) throw error;
    return data;
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await sendPasswordResetEmail(email);
    if (error) throw error;
  }, []);

  return {
    user,
    session,
    loading,
    login,
    register,
    logout,
    changePassword,
    resetPassword,
    isAuthenticated: !!user,
  };
}