// ─── src/types/index.ts ──────────────────────────────────────────────
// Tipos centrales de la aplicación Zekvolt

export interface User {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at?: string;
  phone?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}

export interface Session {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
}

export interface Profile {
  id: string;              // = auth.users.id
  city: string;            // Departamento / Ciudad
  estrato: number;         // 1-6
  company: string;         // Empresa distribuidora
  created_at: string;
  updated_at: string;
}

export interface Appliance {
  id: string;
  user_id: string;
  name: string;            // Clave de APPLIANCES_DB (ej: "Nevera/Refrigerador")
  hours: number;           // Horas de uso por día
  qty: number;             // Cantidad de unidades
  created_at: string;
}

export interface ApplianceWithComputed extends Appliance {
  watts: number;
  monthlyKwh: number;
  monthlyCost: number;
  icon: string;
  defaultHours: number;
}

// ─── Visión IA ────────────────────────────────────────────────────────

export type ConfidenceLevel = 'exact' | 'estimated' | 'unknown';

export interface VisionResult {
  name: string | null;
  watts: number | null;
  model: string | null;
  confidence: ConfidenceLevel;
  voltage?: number | null;
  amperage?: number | null;
  raw?: string;
}

export interface VisionAnalysisInput {
  imageBase64: string;
  mimeType?: string;
}

export interface ModelLookupInput {
  modelText: string;
}

export interface ModelLookupResult extends VisionResult {}

// ─── Tarifas y Cálculos ────────────────────────────────────────────────

export interface TariffData {
  [company: string]: number[]; // [E1, E2, E3, E4, E5, E6] en COP/kWh
}

export interface CompanyCU {
  [company: string]: number;   // Costo Unitario base (estrato 4)
}

export interface CompanySubsistence {
  [company: string]: number;   // Límite de subsistencia en kWh/mes
}

export interface CompanyList {
  [department: string]: string[];
}

export interface TariffCalculationResult {
  totalKwh: number;
  dailyKwh: number;
  estimatedBill: number;
  tariff: number;
  topConsumers: ApplianceWithComputed[];
}

// ─── Navegación ────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Setup: undefined;
  Splash: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Appliances: undefined;
  Scan: undefined;
  Meter: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};

// ─── Temas ─────────────────────────────────────────────────────────────

export interface ThemeColors {
  bg: string;
  surface: string;
  card: string;
  border: string;
  cyan: string;
  cyanDim: string;
  cyanMid: string;
  gold: string;
  goldDim: string;
  orange: string;
  text: string;
  textMuted: string;
  textSub: string;
  red: string;
  redDim: string;
  redMid: string;
  green: string;
  white: string;
  overlay: string;
}

export interface ThemeContextValue {
  dark: boolean;
  theme: ThemeColors;
  toggle: () => void;
  setDark: (dark: boolean) => void;
}

// ─── Validación ────────────────────────────────────────────────────────

export interface WattValidationResult {
  valid: boolean;
  warning: string | null;
  suggested: number | null;
}

// ─── Configuración ────────────────────────────────────────────────────

export interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  nvidia: {
    apiKey: string;
    model: string;
    baseUrl: string;
    timeoutMs: number;
  };
  app: {
    name: string;
    version: string;
  };
}

// ─── Errores ──────────────────────────────────────────────────────────

export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

export class ZekvoltError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ZekvoltError';
  }
}

// ─── Servicios ────────────────────────────────────────────────────────

export interface AuthResult<T> {
  data: T | null;
  error: ZekvoltError | null;
}

export interface ProfileResult {
  data: Profile | null;
  error: ZekvoltError | null;
}

export interface ApplianceResult {
  data: Appliance | null;
  error: ZekvoltError | null;
}

export interface ApplianceListResult {
  data: Appliance[] | null;
  error: ZekvoltError | null;
}

export interface ApplianceInput {
  name: string;
  hours: number;
  qty: number;
}

export interface ConsumptionCalculation {
  totalKwh: number;
  dailyKwh: number;
  estimatedBill: number;
  tariff: number;
  topConsumers: ApplianceWithComputed[];
}

export interface TariffInfo {
  company: string;
  estrato: number;
  tariff: number;
  cuBase: number;
  subsistenceLimit: number | null;
}

export interface VisionAnalysisResult {
  result: VisionResult;
  validation: WattValidationResult | null;
}

export interface ModelLookupServiceResult {
  result: ModelLookupResult;
  validation: WattValidationResult | null;
}