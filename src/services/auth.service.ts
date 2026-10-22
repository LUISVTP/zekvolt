// ─── src/services/auth.service.ts ────────────────────────────────────
// Servicio de autenticación con Supabase

import { getSupabaseClient } from '@/lib';
import type { User, Session } from '@/types';
import { ZekvoltError } from '@/types';

export interface AuthResult<T> {
  data: T | null;
  error: ZekvoltError | null;
}

function mapSupabaseError(error: Error): ZekvoltError {
  const messages: Record<string, string> = {
    'Invalid login credentials': 'Correo o contraseña incorrectos',
    'Email not confirmed': 'Debes confirmar tu correo electrónico',
    'User already registered': 'Este correo ya está registrado',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
    'Unable to validate email address: invalid format': 'Formato de correo inválido',
  };
  return new ZekvoltError('AUTH_ERROR', messages[error.message] ?? error.message);
}

// Helper para convertir tipos de Supabase a nuestros tipos
function mapUser(supabaseUser: any): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    created_at: supabaseUser.created_at,
    email_confirmed_at: supabaseUser.email_confirmed_at,
    phone: supabaseUser.phone,
    user_metadata: supabaseUser.user_metadata,
    app_metadata: supabaseUser.app_metadata,
  };
}

function mapSession(supabaseSession: any): Session {
  return {
    user: mapUser(supabaseSession.user),
    access_token: supabaseSession.access_token,
    refresh_token: supabaseSession.refresh_token,
    expires_at: supabaseSession.expires_at,
    token_type: supabaseSession.token_type,
  };
}

export async function signUp(email: string, password: string): Promise<AuthResult<User>> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { data: null, error: mapSupabaseError(error) };
  return { data: data.user ? mapUser(data.user) : null, error: null };
}

export async function signIn(email: string, password: string): Promise<AuthResult<User>> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { data: null, error: mapSupabaseError(error) };
  return { data: data.user ? mapUser(data.user) : null, error: null };
}

export async function signOut(): Promise<AuthResult<void>> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { data: null, error: new ZekvoltError('AUTH_ERROR', error.message) };
  return { data: null, error: null };
}

export async function getSession(): Promise<AuthResult<Session | null>> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) return { data: null, error: new ZekvoltError('AUTH_ERROR', error.message) };
  return { data: data.session ? mapSession(data.session) : null, error: null };
}

export function onAuthChange(callback: (event: string, session: Session | null) => void) {
  const supabase = getSupabaseClient();
  return supabase.auth.onAuthStateChange((event, supabaseSession) => {
    const session = supabaseSession ? mapSession(supabaseSession) : null;
    callback(event, session);
  });
}

export async function updatePassword(newPassword: string): Promise<AuthResult<User>> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { data: null, error: mapSupabaseError(error) };
  return { data: data.user ? mapUser(data.user) : null, error: null };
}

export async function sendPasswordResetEmail(email: string): Promise<AuthResult<void>> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return { data: null, error: mapSupabaseError(error) };
  return { data: null, error: null };
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user ? mapUser(user) : null;
}