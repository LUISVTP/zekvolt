// ─── src/data/tariffs.ts ─────────────────────────────────────────────
// Tarifas eléctricas por empresa y estrato (COP/kWh)
// Valores actualizados a 2026 - Basados en resoluciones CREG

export interface TariffData {
  [company: string]: number[]; // [E1, E2, E3, E4, E5, E6]
}

export const TARIFFS: TariffData = {
  // Zona No Interconectada (ZNI)
  'ENAM': [352.48, 420.16, 790.11, 929.54, 1115.45, 1115.45],

  // Interconectadas
  'EPM (Empresas Públicas de Medellín)': [400.62, 480.75, 681.06, 801.24, 961.49, 961.49],
  'ENELAR': [452.00, 565.00, 947.07, 1114.20, 1337.04, 1337.04],
  'Air-e': [318.40, 398.00, 676.60, 796.00, 955.20, 955.20],
  'Enel Colombia': [301.28, 376.64, 629.21, 740.25, 888.30, 888.30],
  'Afinia': [446.00, 557.50, 947.75, 1115.00, 1338.00, 1338.00],
  'EBSA (Empresa de Energía de Boyacá)': [426.05, 511.26, 724.28, 852.10, 1022.52, 1022.52],
  'CHEC': [409.20, 491.04, 695.64, 818.40, 982.08, 982.08],
  'Electrocaquetá': [374.24, 467.80, 795.26, 935.60, 1122.72, 1122.72],
  'Enerca': [404.92, 506.15, 860.45, 1012.30, 1214.76, 1214.76],
  'CEO (Compañía Energética de Occidente)': [437.10, 524.52, 743.07, 874.20, 1049.04, 1049.04],
  'DISPAC': [426.16, 532.70, 905.59, 1065.40, 1278.48, 1278.48],
  'EMELGUAINÍA': [339.94, 417.20, 772.60, 880.76, 1066.18, 1066.18],
  'Energuaviare': [438.16, 547.70, 931.09, 1095.40, 1314.48, 1314.48],
  'Electrohuila': [344.92, 431.15, 732.95, 862.30, 1034.76, 1034.76],
  'EMSA (Electrificadora del Meta)': [356.86, 446.08, 758.33, 892.15, 1070.58, 1070.58],
  'CEDENAR': [429.30, 515.16, 729.81, 858.60, 1030.32, 1030.32],
  'CENS': [335.36, 419.20, 712.64, 838.40, 1006.08, 1006.08],
  'Empresa de Energía del Putumayo': [379.32, 474.15, 806.05, 948.30, 1137.96, 1137.96],
  'EDEQ': [406.25, 487.50, 690.62, 812.50, 975.00, 975.00],
  'Energía de Pereira': [409.80, 491.76, 696.66, 819.60, 983.52, 983.52],
  'SOPESA': [340.46, 414.48, 740.15, 858.57, 1036.21, 1036.21],
  'ESSA (Electrificadora de Santander)': [413.25, 495.90, 702.52, 826.50, 991.80, 991.80],
  'Celsia': [350.56, 438.20, 744.94, 876.40, 1051.68, 1051.68],
  'EMCALI': [334.08, 417.60, 709.92, 835.20, 1002.24, 1002.24],
  'EMPOVAUPÉS': [350.78, 417.60, 785.08, 935.42, 1119.16, 1119.16],
  'ELECTROVICHADA': [345.61, 411.45, 773.52, 921.64, 1102.68, 1102.68],
};

export const DEFAULT_TARIFF = [318.40, 398.00, 676.60, 796.00, 955.20, 955.20];

// Costo Unitario base por empresa (estrato 4 = tarifa plena)
export const COMPANY_CU: Record<string, number> = {
  'ENAM': 1685.01,
  'EPM (Empresas Públicas de Medellín)': 801.24,
  'ENELAR': 1114.20,
  'Air-e': 796.00,
  'Enel Colombia': 740.25,
  'Afinia': 1115.00,
  'EBSA (Empresa de Energía de Boyacá)': 852.10,
  'CHEC': 818.40,
  'Electrocaquetá': 935.60,
  'Enerca': 1012.30,
  'CEO (Compañía Energética de Occidente)': 874.20,
  'DISPAC': 1065.40,
  'EMELGUAINÍA': 1545.20,
  'Energuaviare': 1095.40,
  'Electrohuila': 862.30,
  'EMSA (Electrificadora del Meta)': 892.15,
  'CEDENAR': 858.60,
  'CENS': 838.40,
  'Empresa de Energía del Putumayo': 948.30,
  'EDEQ': 812.50,
  'Energía de Pereira': 819.60,
  'SOPESA': 1480.30,
  'ESSA (Electrificadora de Santander)': 826.50,
  'Celsia': 876.40,
  'EMCALI': 835.20,
  'EMPOVAUPÉS': 1670.40,
  'ELECTROVICHADA': 1645.80,
};

// Límite de subsistencia por empresa (kWh/mes)
export const COMPANY_SUBSISTENCE: Record<string, number> = {
  'EPM (Empresas Públicas de Medellín)': 130,
  'Enel Colombia': 130,
  'EBSA (Empresa de Energía de Boyacá)': 130,
  'CHEC': 130,
  'CEO (Compañía Energética de Occidente)': 130,
  'CEDENAR': 130,
  'EDEQ': 130,
  'Energía de Pereira': 130,
  'ESSA (Electrificadora de Santander)': 130,
};

// Helpers
export function getTariffForCompany(company: string): number[] {
  return TARIFFS[company] ?? DEFAULT_TARIFF;
}

export function getTariffForStratum(company: string, estrato: number): number {
  const tariffs = getTariffForCompany(company);
  const index = Math.max(0, Math.min(5, estrato - 1));
  return tariffs[index];
}

export function getCompanyCU(company: string): number {
  return COMPANY_CU[company] ?? DEFAULT_TARIFF[3]; // estrato 4 por defecto
}

export function getSubsistenceLimit(company: string): number | null {
  return COMPANY_SUBSISTENCE[company] ?? null;
}

export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatKwh(value: number): string {
  return `${value.toFixed(1)} kWh`;
}