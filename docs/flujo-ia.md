# Flujo de visión IA

Zekvolt identifica electrodomésticos y lee su potencia a partir de una foto o
de una búsqueda por texto, usando NVIDIA NIM con el modelo
`meta/llama-3.2-11b-vision-instruct`.

## Capas del flujo

```
UI (ScanScreen / CameraView)
        │  imagen base64 o texto
        ▼
vision.service.ts   ── orquesta, valida watts contra el catálogo
        │
        ▼
lib/nvidia.ts       ── cliente HTTP, prompts, timeout, reintentos
        │
        ▼
NVIDIA NIM API      ── meta/llama-3.2-11b-vision-instruct
```

## Cliente (`src/lib/nvidia.ts`)

- Construye la llamada a `/chat/completions` con el modelo configurado en
  `EXPO_PUBLIC_NVIDIA_MODEL`.
- Envía la imagen como `data:` URL en base64 dentro del mensaje.
- Controla timeout (`EXPO_PUBLIC_NVIDIA_TIMEOUT_MS`) con `AbortController`.
- Reintenta ante fallos transitorios y traduce los códigos HTTP a
  `ZekvoltError` con mensaje en español.
- Extrae y sanea la respuesta JSON del modelo antes de devolverla.

## Servicio (`src/services/vision.service.ts`)

Expone dos operaciones de negocio:

- `analyzeApplianceImage(imageBase64, mimeType?)` — analiza una imagen y
  devuelve el resultado más una validación del wattaje.
- `lookupModelByText(modelText)` — busca especificaciones por descripción o
  modelo y valida igualmente.

En ambos casos, si el modelo devuelve `name` y `watts`, el servicio ejecuta
`validateWatts` (en `src/utils/validation.ts`) contra la potencia esperada del
catálogo. El resultado (`WattValidationResult`) indica si el valor es coherente
y, si no lo es, sugiere un rango esperado para que el usuario lo corrija antes
de guardar.

## Salida (`VisionResult`)

Definido en `src/types/index.ts`:

- `name` — tipo de electrodoméstico detectado.
- `watts` — potencia detectada (W), si se pudo leer.
- `model` — modelo o marca, si fue identificable.
- `confidence` — `exact` | `estimated` | `unknown`.
- `voltage` / `amperage` — presentes cuando la etiqueta expone V y A.
- `raw` — texto crudo de respuesta, útil para depuración.

## Consideraciones de seguridad

- La API key de NVIDIA nunca se incluye en el código; se lee de
  `EXPO_PUBLIC_NVIDIA_API_KEY`.
- La respuesta del modelo se trata como dato no confiable: se sanea en
  `nvidia.ts` y se valida de nuevo en `vision.service.ts` antes de llegar a la
  UI o a la base de datos.
- La potencia detectada por IA se contrasta con el catálogo local para detectar
  valores atípicos y advertir al usuario.

## Configuración

Ver `.env.example` y la sección de visión IA en
[arquitectura.md](arquitectura.md).
