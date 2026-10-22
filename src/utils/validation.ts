// ─── src/utils/validation.ts ─────────────────────────────────────────
// Validadores de entrada de datos

import { getExpectedWatts } from '@/data/appliances';
import type { WattValidationResult } from '@/types';

/**
 * Valida los watts ingresados para un tipo de electrodoméstico.
 *
 * @param applianceName - Clave de APPLIANCES_DB (ej. "Bombilla LED")
 * @param enteredWatts - Valor que el usuario escribió
 * @returns Objeto con validación, advertencia y valor sugerido
 */
export function validateWatts(applianceName: string, enteredWatts: number): WattValidationResult {
  // Si no hay nombre o watts inválidos, no validamos
  if (!applianceName || enteredWatts == null || isNaN(enteredWatts) || enteredWatts <= 0) {
    return { valid: true, warning: null, suggested: null };
  }

  const expected = getExpectedWatts(applianceName);
  if (expected === null) {
    // Electrodoméstico no está en nuestra base de datos → validación genérica
    if (enteredWatts > 6000) {
      return {
        valid: false,
        warning: `¿Seguro que consume ${enteredWatts}W? La mayoría de electrodomésticos residenciales consumen menos de 6000W.`,
        suggested: null,
      };
    }
    if (enteredWatts < 1) {
      return {
        valid: false,
        warning: `Un consumo de ${enteredWatts}W es demasiado bajo para cualquier electrodoméstico.`,
        suggested: null,
      };
    }
    return { valid: true, warning: null, suggested: null };
  }

  // Rango esperado: [expected * 0.5, expected * 2.5] con mínimo 1W
  const min = Math.max(expected * 0.5, 1);
  const max = Math.max(expected * 2.5, expected + 50);

  // Si está dentro del rango esperado → ok
  if (enteredWatts >= min && enteredWatts <= max) {
    return { valid: true, warning: null, suggested: null };
  }

  // Fuera de rango → generar advertencia
  let warning: string;
  if (enteredWatts < min) {
    warning = `El valor (${enteredWatts}W) es muy bajo para "${applianceName}". ` +
      `El valor típico es ${expected}W. ¿Quieres corregirlo?`;
  } else {
    warning = `El valor (${enteredWatts}W) es muy alto para "${applianceName}". ` +
      `El valor típico es ${expected}W. ` +
      (enteredWatts > expected * 10 ? `¿Quizás escribiste ${expected}W?` : '');
  }

  return { valid: false, warning, suggested: expected };
}

/**
 * Valida email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida contraseña (mínimo 6 caracteres)
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
  }
  return { valid: true };
}

/**
 * Valida campos requeridos
 */
export function validateRequired(value: string, fieldName: string): { valid: boolean; message?: string } {
  if (!value || !value.trim()) {
    return { valid: false, message: `${fieldName} es requerido` };
  }
  return { valid: true };
}

/**
 * Valida estrato (1-6)
 */
export function validateStratum(estrato: string | number): { valid: boolean; value?: number; message?: string } {
  const num = typeof estrato === 'string' ? parseInt(estrato, 10) : estrato;
  if (isNaN(num) || num < 1 || num > 6) {
    return { valid: false, message: 'Estrato debe ser un número entre 1 y 6' };
  }
  return { valid: true, value: num };
}

/**
 * Valida horas de uso (0-24)
 */
export function validateHours(hours: string | number): { valid: boolean; value?: number; message?: string } {
  const num = typeof hours === 'string' ? parseFloat(hours) : hours;
  if (isNaN(num) || num < 0 || num > 24) {
    return { valid: false, message: 'Horas debe ser un número entre 0 y 24' };
  }
  return { valid: true, value: num };
}

/**
 * Valida cantidad (1-100)
 */
export function validateQuantity(qty: string | number): { valid: boolean; value?: number; message?: string } {
  const num = typeof qty === 'string' ? parseInt(qty, 10) : qty;
  if (isNaN(num) || num < 1 || num > 100) {
    return { valid: false, message: 'Cantidad debe ser un número entre 1 y 100' };
  }
  return { valid: true, value: num };
}