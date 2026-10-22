// ─── src/data/appliances.ts ──────────────────────────────────────────
// Base de datos de electrodomésticos con valores típicos de consumo

import type { ApplianceWithComputed } from '@/types';

export interface ApplianceDBEntry {
  watts: number;
  icon: string;
  defaultHours: number;
}

export const APPLIANCES_DB: Record<string, ApplianceDBEntry> = {
  // ── Iluminación ──
  'Bombilla LED': { watts: 10, icon: '💡', defaultHours: 8 },
  'Bombilla incandescente': { watts: 60, icon: '💡', defaultHours: 8 },
  'Tubo fluorescente': { watts: 20, icon: '💡', defaultHours: 8 },

  // ── Consumo Vampiro ──
  'Módem/Router': { watts: 10, icon: '📡', defaultHours: 24 },
  'Decodificador de TV': { watts: 15, icon: '📺', defaultHours: 24 },
  'Consola en reposo': { watts: 10, icon: '🎮', defaultHours: 24 },
  'Asistente virtual': { watts: 3, icon: '🔊', defaultHours: 24 },
  'Cargador enchufado': { watts: 1, icon: '🔌', defaultHours: 24 },
  'TV en stand-by': { watts: 5, icon: '📺', defaultHours: 24 },

  // ── Infraestructura Oculta ──
  'Cámara de seguridad': { watts: 10, icon: '📹', defaultHours: 24 },
  'Bomba de agua': { watts: 800, icon: '💧', defaultHours: 2 },
  'Motor portón eléctrico': { watts: 500, icon: '🚪', defaultHours: 0.5 },
  'Timbre inteligente': { watts: 2, icon: '🔔', defaultHours: 24 },

  // ── Línea Blanca ──
  'Nevera/Refrigerador': { watts: 150, icon: '🧊', defaultHours: 24 },
  'Lavadora': { watts: 500, icon: '🫧', defaultHours: 1.5 },
  'Secadora de ropa': { watts: 3000, icon: '💨', defaultHours: 1 },
  'Lavavajillas': { watts: 1500, icon: '🍽️', defaultHours: 1.5 },
  'Cocina/Horno eléctrico': { watts: 2000, icon: '🔥', defaultHours: 1 },
  'Ducha eléctrica': { watts: 3500, icon: '🚿', defaultHours: 0.5 },
  'Calentador de agua': { watts: 1500, icon: '♨️', defaultHours: 1 },

  // ── Climatización ──
  'Aire Acondicionado 9000 BTU': { watts: 900, icon: '❄️', defaultHours: 8 },
  'Aire Acondicionado 12000 BTU': { watts: 1200, icon: '❄️', defaultHours: 8 },
  'Calefactor eléctrico': { watts: 1500, icon: '🔥', defaultHours: 4 },
  'Ventilador': { watts: 60, icon: '🌀', defaultHours: 8 },

  // ── PAE (Pequeños Aparatos) ──
  'Microondas': { watts: 1200, icon: '📡', defaultHours: 0.5 },
  'Freidora de aire': { watts: 1500, icon: '🍟', defaultHours: 0.5 },
  'Cafetera': { watts: 800, icon: '☕', defaultHours: 0.5 },
  'Tostadora': { watts: 800, icon: '🍞', defaultHours: 0.2 },
  'Hervidor de agua': { watts: 1500, icon: '🫖', defaultHours: 0.2 },
  'Licuadora': { watts: 400, icon: '🥤', defaultHours: 0.2 },
  'Batidora': { watts: 300, icon: '🥄', defaultHours: 0.2 },
  'Plancha de ropa': { watts: 1000, icon: '👕', defaultHours: 0.5 },
  'Aspiradora': { watts: 1200, icon: '🧹', defaultHours: 0.5 },
  'Secador de pelo': { watts: 1500, icon: '💇', defaultHours: 0.2 },
  'Plancha de pelo': { watts: 200, icon: '💇‍♀️', defaultHours: 0.2 },

  // ── Línea Marrón ──
  'Televisor LED 32"': { watts: 45, icon: '📺', defaultHours: 6 },
  'Televisor LED 55"': { watts: 120, icon: '📺', defaultHours: 6 },
  'Consola videojuegos': { watts: 150, icon: '🎮', defaultHours: 4 },
  'Computador portátil': { watts: 65, icon: '💻', defaultHours: 8 },
  'Computador escritorio': { watts: 250, icon: '🖥️', defaultHours: 8 },
  'Equipo de sonido': { watts: 100, icon: '🔊', defaultHours: 4 },

  // ── Otros ──
  'Estufa eléctrica (1 fogón)': { watts: 1500, icon: '🍳', defaultHours: 1 },
  'Horno eléctrico': { watts: 2000, icon: '🔥', defaultHours: 1 },
};

export const APPLIANCE_CATEGORIES = [
  {
    name: 'Iluminación',
    icon: '💡',
    items: ['Bombilla LED', 'Bombilla incandescente', 'Tubo fluorescente'],
  },
  {
    name: 'Ocio',
    icon: '🎮',
    items: [
      'Módem/Router',
      'Decodificador de TV',
      'Consola en reposo',
      'Asistente virtual',
      'Cargador enchufado',
      'TV en stand-by',
      'Televisor LED 32"',
      'Televisor LED 55"',
      'Consola videojuegos',
      'Computador portátil',
      'Computador escritorio',
      'Equipo de sonido',
    ],
  },
  {
    name: 'Infraestructura Oculta',
    icon: '🔧',
    items: ['Cámara de seguridad', 'Bomba de agua', 'Motor portón eléctrico', 'Timbre inteligente'],
  },
  {
    name: 'Electrohogar',
    icon: '🧊',
    items: [
      'Nevera/Refrigerador',
      'Lavadora',
      'Secadora de ropa',
      'Lavavajillas',
      'Cocina/Horno eléctrico',
      'Ducha eléctrica',
      'Calentador de agua',
    ],
  },
  {
    name: 'Climatización',
    icon: '❄️',
    items: [
      'Aire Acondicionado 9000 BTU',
      'Aire Acondicionado 12000 BTU',
      'Calefactor eléctrico',
      'Ventilador',
    ],
  },
  {
    name: 'PAE (Pequeños Aparatos)',
    icon: '🔌',
    items: [
      'Microondas',
      'Freidora de aire',
      'Cafetera',
      'Tostadora',
      'Hervidor de agua',
      'Licuadora',
      'Batidora',
      'Plancha de ropa',
      'Aspiradora',
      'Secador de pelo',
      'Plancha de pelo',
    ],
  },
  {
    name: 'Otros',
    icon: '⚡',
    items: ['Estufa eléctrica (1 fogón)', 'Horno eléctrico'],
  },
];

// Helper para obtener datos completos de un electrodoméstico
export function getApplianceData(name: string): ApplianceDBEntry | undefined {
  return APPLIANCES_DB[name];
}

export function getExpectedWatts(name: string): number | null {
  return APPLIANCES_DB[name]?.watts ?? null;
}

export function getApplianceIcon(name: string): string {
  return APPLIANCES_DB[name]?.icon ?? '⚡';
}

export function getDefaultHours(name: string): number {
  return APPLIANCES_DB[name]?.defaultHours ?? 4;
}

// Para usar en listas planas
export const ALL_APPLIANCES = Object.keys(APPLIANCES_DB).sort();