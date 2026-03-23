/**
 * Gemini API Service
 * Servicio para generacion de imagenes y videos usando la API de Google Gemini.
 * Llamadas directas desde el navegador (client-side).
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta'

// ---------------------------------------------------------------------------
// Constantes exportables
// ---------------------------------------------------------------------------

export const IMAGE_MODELS = [
  { value: 'gemini-2.5-flash-image', label: 'Nano Banana Flash (Rapido, ~500/dia gratis)', free: true },
  { value: 'gemini-3.1-flash-image-preview', label: 'Nano Banana 3.1 Flash (Rapido)', free: true },
  { value: 'gemini-3-pro-image-preview', label: 'Nano Banana Pro (Alta calidad, ~3/dia gratis)', free: true },
  { value: 'nano-banana-pro-preview', label: 'Nano Banana Pro Preview', free: true },
  { value: 'imagen-4.0-generate-001', label: 'Imagen 4.0 (Google)', free: false },
]

export const VIDEO_MODELS = [
  { value: 'veo-3.1-generate-preview', label: 'Veo 3.1 (Mejor calidad)', free: false },
  { value: 'veo-3.1-fast-generate-preview', label: 'Veo 3.1 Fast (Rapido)', free: false },
  { value: 'veo-3.0-generate-001', label: 'Veo 3.0', free: false },
  { value: 'veo-2.0-generate-001', label: 'Veo 2.0', free: false },
]

export const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1 (Cuadrado)' },
  { value: '16:9', label: '16:9 (Horizontal HD)' },
  { value: '9:16', label: '9:16 (Vertical / Stories)' },
  { value: '3:2', label: '3:2 (Foto clasica)' },
  { value: '4:3', label: '4:3 (Pantalla clasica)' },
  { value: '21:9', label: '21:9 (Ultra-wide)' },
]

export const IMAGE_SIZES = [
  { value: '1K', label: '1K' },
  { value: '2K', label: '2K' },
  { value: '4K', label: '4K' },
]

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

function getApiKey() {
  if (!API_KEY) {
    throw new Error(
      'No se encontro la API key de Gemini. ' +
      'Asegurate de definir VITE_GEMINI_API_KEY en tu archivo .env'
    )
  }
  return API_KEY
}

/**
 * Wrapper para fetch con manejo de errores consistente.
 */
async function geminiRequest(url, options = {}) {
  let response
  try {
    response = await fetch(url, options)
  } catch (err) {
    throw new Error(
      `Error de red al conectar con Gemini: ${err.message}. ` +
      'Verifica tu conexion a internet.'
    )
  }

  if (!response.ok) {
    let errorBody = ''
    try {
      const json = await response.json()
      errorBody = json?.error?.message || JSON.stringify(json)
    } catch {
      errorBody = await response.text().catch(() => '')
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error(
        `API key invalida o sin permisos (${response.status}). ` +
        'Revisa tu VITE_GEMINI_API_KEY.'
      )
    }
    if (response.status === 429) {
      throw new Error(
        'Has superado el limite de solicitudes de la API de Gemini. ' +
        'Espera unos minutos e intenta de nuevo.'
      )
    }
    if (response.status === 400) {
      throw new Error(
        `Solicitud invalida (400): ${errorBody}`
      )
    }

    throw new Error(
      `Error de Gemini API (${response.status}): ${errorBody}`
    )
  }

  return response.json()
}

// ---------------------------------------------------------------------------
// Generacion de imagenes
// ---------------------------------------------------------------------------

/**
 * Genera una imagen usando un modelo de Gemini.
 *
 * @param {string} prompt - Descripcion de la imagen a generar.
 * @param {string} [model='gemini-2.5-flash-image'] - Modelo a usar (ver IMAGE_MODELS).
 * @param {object} [options={}]
 * @param {string} [options.aspectRatio] - Relacion de aspecto (ej. '16:9').
 * @param {string} [options.imageSize] - Tamano de imagen ('1K', '2K', '4K').
 * @returns {Promise<{imageUrl: string, text: string|null}>}
 */
export async function generateImage(prompt, model = 'gemini-2.5-flash-image', options = {}) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('El prompt es obligatorio y debe ser un texto.')
  }

  const key = getApiKey()
  const url = `${BASE_URL}/models/${model}:generateContent?key=${key}`

  const imageConfig = {}
  if (options.aspectRatio) imageConfig.aspectRatio = options.aspectRatio
  if (options.imageSize) imageConfig.imageSize = options.imageSize

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
      ...(Object.keys(imageConfig).length > 0 ? { imageConfig } : {}),
    },
  }

  const data = await geminiRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  // Extraer imagen y texto de la respuesta
  const parts = data?.candidates?.[0]?.content?.parts
  if (!parts || parts.length === 0) {
    throw new Error(
      'Gemini no devolvio contenido. ' +
      'Es posible que el prompt haya sido rechazado por las politicas de seguridad.'
    )
  }

  let imageUrl = null
  let text = null

  for (const part of parts) {
    if (part.inlineData?.data && part.inlineData?.mimeType) {
      imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
    }
    if (part.text) {
      text = part.text
    }
  }

  if (!imageUrl) {
    throw new Error(
      'Gemini no genero una imagen. Respuesta recibida: ' +
      (text || 'sin contenido de texto')
    )
  }

  return { imageUrl, text }
}

// ---------------------------------------------------------------------------
// Generacion de video
// ---------------------------------------------------------------------------

/**
 * Inicia la generacion de un video. Devuelve un objeto con el nombre de la
 * operacion para hacer polling.
 *
 * @param {string} prompt - Descripcion del video.
 * @param {string} [model='veo-3.1-generate-preview'] - Modelo de video.
 * @param {object} [options={}]
 * @param {string} [options.aspectRatio='16:9']
 * @param {string} [options.resolution='720p']
 * @param {number} [options.durationSeconds=8]
 * @param {string} [options.imageBase64] - Imagen base64 para image-to-video.
 * @param {string} [options.imageMimeType] - MIME type de la imagen (ej. 'image/png').
 * @returns {Promise<{operationName: string, raw: object}>}
 */
export async function generateVideo(prompt, model = 'veo-3.1-generate-preview', options = {}) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('El prompt es obligatorio y debe ser un texto.')
  }

  const key = getApiKey()

  // Intentar primero con generateVideos, luego con predictLongRunning
  const endpoints = [
    `${BASE_URL}/models/${model}:generateVideos?key=${key}`,
    `${BASE_URL}/models/${model}:predictLongRunning?key=${key}`,
  ]

  const aspectRatio = options.aspectRatio || '16:9'
  const resolution = options.resolution || '720p'
  const durationSeconds = options.durationSeconds || 8

  // Cuerpo para generateVideos
  const generateVideosBody = {
    prompt,
    config: {
      aspectRatio,
      resolution,
      durationSeconds: String(durationSeconds),
    },
  }

  // Si hay imagen para image-to-video
  if (options.imageBase64) {
    generateVideosBody.image = {
      bytesBase64Encoded: options.imageBase64,
      mimeType: options.imageMimeType || 'image/png',
    }
  }

  // Cuerpo para predictLongRunning
  const predictBody = {
    instances: [{ prompt }],
    parameters: {
      aspectRatio,
      resolution,
      durationSeconds,
    },
  }

  if (options.imageBase64) {
    predictBody.instances[0].image = {
      bytesBase64Encoded: options.imageBase64,
      mimeType: options.imageMimeType || 'image/png',
    }
  }

  const bodies = [generateVideosBody, predictBody]

  let lastError = null

  for (let i = 0; i < endpoints.length; i++) {
    try {
      const data = await geminiRequest(endpoints[i], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodies[i]),
      })

      const operationName = data?.name || data?.operationName || null
      if (!operationName) {
        // Algunos modelos pueden devolver el resultado directamente
        return { operationName: null, raw: data }
      }

      return { operationName, raw: data }
    } catch (err) {
      lastError = err
      // Si es el primer endpoint y falla con 404, intentar el siguiente
      if (i < endpoints.length - 1) continue
    }
  }

  throw new Error(
    `No se pudo iniciar la generacion de video: ${lastError?.message || 'Error desconocido'}`
  )
}

// ---------------------------------------------------------------------------
// Polling de operaciones de video
// ---------------------------------------------------------------------------

/**
 * Consulta el estado de una operacion de generacion de video.
 *
 * @param {string} operationName - Nombre de la operacion devuelto por generateVideo.
 * @returns {Promise<{done: boolean, videoUrl: string|null, raw: object}>}
 */
export async function pollVideoOperation(operationName) {
  if (!operationName) {
    throw new Error('Se requiere el nombre de la operacion para consultar su estado.')
  }

  const key = getApiKey()
  const url = `${BASE_URL}/${operationName}?key=${key}`

  const data = await geminiRequest(url)

  const done = !!data.done

  let videoUrl = null
  if (done && data.response) {
    // Buscar URL de video en distintas estructuras de respuesta
    videoUrl =
      data.response?.generatedSamples?.[0]?.video?.uri ||
      data.response?.predictions?.[0]?.videoUri ||
      data.response?.videos?.[0]?.uri ||
      null
  }

  return { done, videoUrl, raw: data }
}

/**
 * Hace polling automatico hasta que la operacion termine o se agote el tiempo.
 *
 * @param {string} operationName - Nombre de la operacion.
 * @param {function} [onProgress] - Callback opcional llamado en cada intento con { attempt, done, raw }.
 * @param {object} [options={}]
 * @param {number} [options.intervalMs=10000] - Intervalo entre consultas (ms).
 * @param {number} [options.maxAttempts=60] - Maximo de intentos (por defecto ~10 min).
 * @returns {Promise<{videoUrl: string, raw: object}>}
 */
export async function pollVideoUntilComplete(operationName, onProgress, options = {}) {
  if (!operationName) {
    throw new Error('Se requiere el nombre de la operacion para hacer polling.')
  }

  const intervalMs = options.intervalMs || 10000
  const maxAttempts = options.maxAttempts || 60

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const result = await pollVideoOperation(operationName)

    if (onProgress) {
      try {
        onProgress({ attempt, done: result.done, raw: result.raw })
      } catch {
        // No dejar que errores del callback rompan el polling
      }
    }

    if (result.done) {
      if (!result.videoUrl) {
        throw new Error(
          'La generacion del video termino pero no se encontro la URL del video en la respuesta.'
        )
      }
      return { videoUrl: result.videoUrl, raw: result.raw }
    }

    // Esperar antes del siguiente intento
    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }

  throw new Error(
    `La generacion del video no termino despues de ${maxAttempts} intentos ` +
    `(~${Math.round((maxAttempts * intervalMs) / 60000)} minutos). ` +
    'Puedes seguir consultando manualmente con pollVideoOperation().'
  )
}

// ---------------------------------------------------------------------------
// Test de API key
// ---------------------------------------------------------------------------

/**
 * Verifica que la API key sea valida listando los modelos disponibles.
 *
 * @returns {Promise<{valid: boolean, models: string[]}>}
 */
export async function testApiKey() {
  const key = getApiKey()
  const url = `${BASE_URL}/models?key=${key}`

  try {
    const data = await geminiRequest(url)
    const models = (data.models || []).map((m) => m.name)
    return { valid: true, models }
  } catch (err) {
    return { valid: false, models: [], error: err.message }
  }
}
