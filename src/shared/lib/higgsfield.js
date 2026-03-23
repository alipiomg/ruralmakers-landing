/**
 * Higgsfield AI API Service (v2)
 * Uses platform.higgsfield.ai via Vite proxy at /api/higgsfield
 * Supports: Nano Banana Pro (text-to-image), DoP (image-to-video)
 * Docs: https://github.com/higgsfield-ai/higgsfield-js
 */

const API_KEY_ID = import.meta.env.VITE_HIGGSFIELD_API_KEY_ID
const API_SECRET = import.meta.env.VITE_HIGGSFIELD_API_SECRET
const CREDENTIALS = `${API_KEY_ID}:${API_SECRET}`

// Use proxy in dev, direct in prod
const BASE_URL = '/api/higgsfield'

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(CREDENTIALS)}`,
    'X-API-Key-Id': API_KEY_ID,
  }
}

// Fallback: try Bearer auth if Basic doesn't work
function getHeadersBearer() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_SECRET}`,
    'X-API-Key-Id': API_KEY_ID,
  }
}

/**
 * Submit a generation request to Higgsfield.
 * @param {string} endpoint - API endpoint path (e.g. 'flux-pro/kontext/max/text-to-image')
 * @param {object} input - Input parameters for the generation
 * @returns {Promise<object>} Job/request object with id
 */
async function submitRequest(endpoint, input) {
  // Try the v2 subscribe-style endpoint
  const url = `${BASE_URL}/api/v1/submit/${endpoint}`

  let response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ input }),
  })

  // Fallback: try alternate auth and endpoint format
  if (!response.ok && response.status === 401) {
    response = await fetch(url, {
      method: 'POST',
      headers: getHeadersBearer(),
      body: JSON.stringify({ input }),
    })
  }

  // Fallback: try the /v1/generations endpoint (older API)
  if (!response.ok) {
    const altUrl = `${BASE_URL}/v1/generations`
    response = await fetch(altUrl, {
      method: 'POST',
      headers: getHeadersBearer(),
      body: JSON.stringify({
        task: endpoint.includes('image2video') ? 'image-to-video' : 'text-to-image',
        model: endpoint.includes('flux') ? 'flux' : 'default-video-model',
        ...input,
      }),
    })
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || err.error || `Error ${response.status}: No se pudo iniciar la generacion.`)
  }

  return response.json()
}

/**
 * Check status of a request/job.
 * @param {string} requestId
 * @returns {Promise<object>}
 */
async function checkStatus(requestId) {
  // Try v2 endpoint
  let response = await fetch(`${BASE_URL}/api/v1/requests/${requestId}/status`, {
    headers: getHeaders(),
  })

  // Fallback to v1
  if (!response.ok) {
    response = await fetch(`${BASE_URL}/v1/generations/${requestId}`, {
      headers: getHeadersBearer(),
    })
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || `Error ${response.status}: No se pudo consultar el estado.`)
  }

  return response.json()
}

/**
 * Generate an image using Flux/Nano Banana Pro model.
 * @param {string} prompt - Text description
 * @param {string} [aspectRatio='1:1'] - Aspect ratio
 * @param {object} [options] - Extra options
 * @returns {Promise<object>} Job object
 */
export async function generateImage(prompt, aspectRatio = '1:1', options = {}) {
  if (!prompt?.trim()) throw new Error('El prompt es obligatorio.')

  return submitRequest('flux-pro/kontext/max/text-to-image', {
    prompt: prompt.trim(),
    aspect_ratio: aspectRatio,
    safety_tolerance: 2,
    ...options,
  })
}

/**
 * Generate a video from an image using DoP model.
 * @param {string} imageUrl - URL of the source image
 * @param {string} [prompt] - Animation description
 * @param {string} [model='dop-turbo'] - Video model
 * @returns {Promise<object>} Job object
 */
export async function generateVideo(imageUrl, prompt = '', model = 'dop-turbo') {
  if (!imageUrl) throw new Error('Se necesita una URL de imagen.')

  return submitRequest('/v1/image2video/dop', {
    model,
    prompt: prompt?.trim() || 'Cinematic slow camera movement with gentle animation',
    input_images: [{
      type: 'image_url',
      image_url: imageUrl,
    }],
  })
}

/**
 * Poll until job completes.
 * @param {string} requestId
 * @param {function} [onProgress]
 * @param {number} [intervalMs=3000]
 * @param {number} [maxAttempts=100]
 * @returns {Promise<object>}
 */
export async function pollUntilComplete(requestId, onProgress, intervalMs = 3000, maxAttempts = 100) {
  let attempts = 0

  while (attempts < maxAttempts) {
    const status = await checkStatus(requestId)
    if (onProgress) onProgress(status)

    const state = (status.status || '').toLowerCase()

    if (state === 'completed' || state === 'succeeded' || state === 'done') {
      return status
    }
    if (state === 'failed' || state === 'error' || state === 'cancelled' || state === 'nsfw') {
      throw new Error(status.error || `Generacion fallida: ${state}`)
    }

    attempts++
    await new Promise(r => setTimeout(r, intervalMs))
  }

  throw new Error('Tiempo agotado esperando la generacion.')
}

/**
 * Direct check of API connectivity.
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function testConnection() {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/health`, {
      headers: getHeaders(),
    })
    if (response.ok) return { ok: true }

    // Try alternate endpoint
    const r2 = await fetch(`${BASE_URL}/v1/generations`, {
      method: 'OPTIONS',
      headers: getHeadersBearer(),
    })
    return { ok: r2.ok || r2.status === 405 } // 405 = method not allowed but server responds
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

/**
 * Resolution presets (aspect ratios for Flux/Nano Banana Pro).
 */
export const RESOLUTIONS = [
  { label: '1:1 (Cuadrado)', value: '1:1' },
  { label: '16:9 (Horizontal HD)', value: '16:9' },
  { label: '9:16 (Vertical / Stories)', value: '9:16' },
  { label: '3:2 (Foto clasica)', value: '3:2' },
  { label: '2:3 (Retrato)', value: '2:3' },
  { label: '4:3 (Pantalla clasica)', value: '4:3' },
  { label: '3:4 (Retrato medio)', value: '3:4' },
  { label: '21:9 (Ultra-wide)', value: '21:9' },
]

/**
 * Video model options.
 */
export const VIDEO_MODELS = [
  { value: 'dop-turbo', label: 'DoP Turbo (Rapido)' },
  { value: 'dop', label: 'DoP (Alta calidad)' },
]
