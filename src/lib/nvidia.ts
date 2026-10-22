// ─── src/lib/nvidia.ts ───────────────────────────────────────────────
// Cliente para NVIDIA NIM API (Visión IA - LLaMA 3.2 Vision)

import { env } from '@/config/env';
import type { VisionResult, ModelLookupResult } from '@/types';
import { ZekvoltError } from '@/types';

const { apiKey, model, baseUrl, timeoutMs } = env.nvidia;

interface NvidiaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | NvidiaContent[];
}

interface NvidiaContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: { url: string };
}

interface NvidiaRequest {
  model: string;
  messages: NvidiaMessage[];
  temperature: number;
  max_tokens: number;
}

interface NvidiaResponse {
  choices: Array<{
    message: { content: string };
    finish_reason: string;
  }>;
  error?: { message: string; code: string };
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ZekvoltError('TIMEOUT', 'La API tardó demasiado. Verifica tu conexión a internet.');
    }
    throw new ZekvoltError('NETWORK_ERROR', `Error de red: ${error instanceof Error ? error.message : 'Desconocido'}`);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function callNvidiaAPI(body: NvidiaRequest, retries = 2): Promise<NvidiaResponse> {
  if (!apiKey || apiKey === 'tu-nvidia-api-key-aqui') {
    throw new ZekvoltError(
      'CONFIG_ERROR',
      'NVIDIA_API_KEY no configurada. Obtén una en https://build.nvidia.com/'
    );
  }

  const response = await fetchWithTimeout(
    `${baseUrl}/chat/completions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    },
    timeoutMs
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    if (response.status === 401 || response.status === 403) {
      throw new ZekvoltError('AUTH_ERROR', 'API Key inválida o sin permisos.');
    }
    if (response.status === 429) {
      if (retries > 0) {
        await new Promise(r => setTimeout(r, 3000));
        return callNvidiaAPI(body, retries - 1);
      }
      throw new ZekvoltError('RATE_LIMIT', 'Límite de requests alcanzado. Espera un momento e intenta de nuevo.');
    }
    throw new ZekvoltError('API_ERROR', `Error HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}

function parseVisionResponse(text: string): VisionResult | null {
  if (!text) return null;

  // Buscar el primer bloque JSON en la respuesta
  const match = text.match(/\{[\s\S]*?\}/);
  if (!match) return null;

  try {
    const parsed = JSON.parse(match[0]);
    return {
      name: parsed.name ?? null,
      watts: parsed.watts ?? null,
      model: parsed.model ?? null,
      confidence: parsed.confidence ?? 'unknown',
      voltage: parsed.voltage ?? null,
      amperage: parsed.amperage ?? null,
      raw: text,
    };
  } catch {
    return null;
  }
}

// ─── Prompts del Sistema ──────────────────────────────────────────────

const VISION_SYSTEM_PROMPT = `Eres un experto en electrodomésticos y lectura de etiquetas técnicas.
Analiza la imagen y responde SOLO con un objeto JSON válido (sin markdown, sin texto extra).

Reglas:
1. Identifica el tipo de electrodoméstico (name) en español. Ej: "Nevera/Refrigerador", "Lavadora", "Microondas", "Televisor LED 55\\"", "Aire Acondicionado 12000 BTU", "Ducha eléctrica", "Bombilla LED", "Horno eléctrico", "Licuadora", "Computador portátil", "Plancha de ropa", "Ventilador", "Secadora de ropa", "Bomba de agua", "Cafetera", "Freidora de aire", "Cocina/Horno eléctrico", "Calefactor eléctrico", "Consola videojuegos", etc.

2. Si ves UNA ETIQUETA con wattaje visible (W, Watts, Potencia, Consumo, Power, kW):
   - Extrae el valor exacto
   - confidence = "exact"

3. Si la etiqueta muestra VOLTIOS (V) y AMPERIOS (A) en lugar de watts directos:
   - Calcula watts usando la fórmula W = V × A
   - Ej: "110V ~ 1.2A" → watts = 110 × 1.2 = 132
   - confidence = "exact"
   - Incluye voltage y amperage en el JSON

4. Si NO ves etiqueta con wattaje ni V/A pero puedes identificar el TIPO:
   - ESTIMA un valor promedio REALISTA en watts para ese tipo
   - Ej: nevera ~150W, TV 55" ~120W, lavadora ~500W, microondas ~1200W, licuadora ~400W, bombilla LED ~10W, ventilador ~60W
   - confidence = "estimated"
   - NUNCA pongas watts null cuando puedas estimar

5. Si puedes, extrae modelo/marca (model). Si no visible, model = null.

6. Si la imagen no es un electrodoméstico o es ininteligible:
   name = null, watts = null, model = null, confidence = "unknown"

Formato EXACTO (sin acentos en claves JSON):
{"name": "Nevera/Refrigerador", "watts": 150, "model": "Samsung RT38", "confidence": "exact"}

Si confidence es "estimated":
{"name": "Televisor LED 55\\"", "watts": 120, "model": null, "confidence": "estimated"}

Si leíste V y A:
{"name": "Ducha eléctrica", "watts": 132, "model": null, "confidence": "exact", "voltage": 110, "amperage": 1.2}`;

const MODEL_LOOKUP_PROMPT = `Eres un experto en electrodomésticos y conoces las especificaciones técnicas de todos los modelos del mercado.

El usuario busca información sobre: "{modelText}"

Responde SOLO con un objeto JSON válido (sin markdown, sin texto extra).

Reglas:
1. Identifica el tipo de electrodoméstico (name) en español. Ej: "Nevera/Refrigerador", "Lavadora", "Televisor LED", "Microondas", "Aire Acondicionado", etc.

2. Busca la potencia en watts (watts) de ESE modelo específico.
   - Si conoces el valor exacto para ese modelo → confidence = "exact"
   - Si no conoces el exacto pero puedes estimar por el tipo y tamaño → confidence = "estimated"
   - Si no tienes idea → watts = null, confidence = "unknown"

3. Modelo exacto (model) = lo que el usuario escribió, normalizado.

4. NUNCA inventes un wattaje exacto si no estás seguro. Mejor estima y marca "estimated".

Formato EXACTO:
{"name": "Nevera/Refrigerador", "watts": 380, "model": "Samsung RT38", "confidence": "estimated"}

Si no encuentras nada:
{"name": null, "watts": null, "model": "{modelText}", "confidence": "unknown"}`;

// ─── Funciones Públicas ───────────────────────────────────────────────

/**
 * Analiza una imagen de electrodoméstico usando NVIDIA NIM + LLaMA 3.2 Vision
 */
export async function analyzeApplianceImage(
  imageBase64: string,
  mimeType = 'image/jpeg'
): Promise<VisionResult> {
  const body: NvidiaRequest = {
    model,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: VISION_SYSTEM_PROMPT },
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${imageBase64}` },
          },
        ],
      },
    ],
    temperature: 0.1,
    max_tokens: 1024,
  };

  const data = await callNvidiaAPI(body);
  const text = data.choices?.[0]?.message?.content ?? '';
  const parsed = parseVisionResponse(text);

  if (!parsed) {
    return { name: null, watts: null, model: null, confidence: 'unknown', raw: text };
  }

  return parsed;
}

/**
 * Busca especificaciones de un modelo por texto usando NVIDIA NIM
 */
export async function lookupModelByText(modelText: string): Promise<ModelLookupResult> {
  if (!modelText || modelText.trim().length < 3) {
    throw new ZekvoltError('VALIDATION_ERROR', 'Escribe al menos 3 caracteres para buscar.');
  }

  const prompt = MODEL_LOOKUP_PROMPT.replace('{modelText}', modelText.trim());

  const body: NvidiaRequest = {
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 1024,
  };

  const data = await callNvidiaAPI(body);
  const text = data.choices?.[0]?.message?.content ?? '';
  const parsed = parseVisionResponse(text);

  if (!parsed) {
    return { name: null, watts: null, model: modelText.trim(), confidence: 'unknown', raw: text };
  }

  return {
    ...parsed,
    model: parsed.model ?? modelText.trim(),
  };
}