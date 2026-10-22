// ─── src/data/companies.ts ────────────────────────────────────────────
// Empresas distribuidoras de energía por departamento (Colombia)

export interface CompanyOption {
  value: string;
  label: string;
  tariff?: string; // Tarifa formateada para estrato 4
}

export const COMPANIES_BY_DEPARTMENT: Record<string, string[]> = {
  'Amazonas': ['ENAM'],
  'Antioquia': ['EPM (Empresas Públicas de Medellín)'],
  'Arauca': ['ENELAR'],
  'Atlántico': ['Air-e'],
  'Bogotá D.C. / Cundinamarca': ['Enel Colombia'],
  'Bolívar': ['Afinia'],
  'Boyacá': ['EBSA (Empresa de Energía de Boyacá)'],
  'Caldas': ['CHEC'],
  'Caquetá': ['Electrocaquetá'],
  'Casanare': ['Enerca'],
  'Cauca': ['CEO (Compañía Energética de Occidente)'],
  'Cesar': ['Afinia'],
  'Chocó': ['DISPAC'],
  'Córdoba': ['Afinia'],
  'Guainía': ['EMELGUAINÍA'],
  'Guaviare': ['Energuaviare'],
  'Huila': ['Electrohuila'],
  'La Guajira': ['Air-e'],
  'Magdalena': ['Air-e'],
  'Meta': ['EMSA (Electrificadora del Meta)'],
  'Nariño': ['CEDENAR'],
  'Norte de Santander': ['CENS'],
  'Putumayo': ['Empresa de Energía del Putumayo'],
  'Quindío': ['EDEQ'],
  'Risaralda': ['Energía de Pereira'],
  'San Andrés y Providencia': ['SOPESA'],
  'Santander': ['ESSA (Electrificadora de Santander)'],
  'Sucre': ['Afinia'],
  'Tolima': ['Celsia'],
  'Valle del Cauca': ['EMCALI'],
  'Vaupés': ['EMPOVAUPÉS'],
  'Vichada': ['ELECTROVICHADA'],
};

export const DEPARTMENTS = Object.keys(COMPANIES_BY_DEPARTMENT).sort((a, b) =>
  a.localeCompare(b, 'es')
);

export function getCompaniesForDepartment(department: string): string[] {
  return COMPANIES_BY_DEPARTMENT[department] ?? [];
}

export function getCompanyOptions(department: string): CompanyOption[] {
  const companies = getCompaniesForDepartment(department);
  return companies.map(company => ({ value: company, label: company }));
}

// Para el selector de ciudad/departamento en Setup
export function getDepartmentOptions() {
  return [
    { value: '', label: 'Selecciona tu ciudad...' },
    ...DEPARTMENTS.map(d => ({ value: d, label: d })),
  ];
}

export function getStratumOptions() {
  return [
    { value: '', label: 'Selecciona tu estrato...' },
    ...[1, 2, 3, 4, 5, 6].map(e => ({ value: String(e), label: `Estrato ${e}` })),
  ];
}