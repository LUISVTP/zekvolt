// ─── src/utils/formatters.ts ─────────────────────────────────────────
// Formateadores de valores para UI

/** Formatea número como COP (pesos colombianos) */
export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Formatea kWh con 1 decimal */
export function formatKwh(value: number): string {
  return `${value.toFixed(1)} kWh`;
}

/** Formatea watts */
export function formatWatts(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)} kW`;
  }
  return `${value} W`;
}

/** Formatea porcentaje */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** Formatea horas con 1 decimal si es necesario */
export function formatHours(value: number): string {
  return value % 1 === 0 ? `${value}h` : `${value.toFixed(1)}h`;
}

/** Trunca texto largo */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/** Capitaliza primera letra */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/** Formatea fecha relativa (ej: "hace 2 días") */
export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  return d.toLocaleDateString('es-CO');
}