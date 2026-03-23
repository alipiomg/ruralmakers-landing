/**
 * Pollinations.ai Service
 * API 100% gratuita sin API key para generacion de imagenes.
 * Funciona via URL directa - el navegador hace la peticion.
 */

export const POLLINATIONS_MODELS = [
  { value: 'turbo', label: 'Turbo (Rapido, buena calidad)' },
  { value: 'sana', label: 'Sana (Detallado)' },
  { value: 'zimage', label: 'Zimage (Artistico)' },
]

export const POLLINATIONS_SIZES = [
  { value: '512x512', label: '512x512 (Rapido)', w: 512, h: 512 },
  { value: '768x768', label: '768x768 (Medio)', w: 768, h: 768 },
  { value: '1024x1024', label: '1024x1024 (Alta calidad)', w: 1024, h: 1024 },
  { value: '1024x576', label: '1024x576 (16:9 Horizontal)', w: 1024, h: 576 },
  { value: '576x1024', label: '576x1024 (9:16 Vertical)', w: 576, h: 1024 },
  { value: '1024x768', label: '1024x768 (4:3)', w: 1024, h: 768 },
]

/**
 * Construye la URL de Pollinations para generar una imagen.
 * La imagen se genera al cargar la URL en un <img> o al abrirla en el navegador.
 */
export function buildImageUrl(prompt, options = {}) {
  const {
    model = 'turbo',
    width = 768,
    height = 768,
    seed,
    nologo = true,
    enhance = true,
  } = options

  const encodedPrompt = encodeURIComponent(prompt)
  const params = new URLSearchParams({
    model,
    width: String(width),
    height: String(height),
    nologo: String(nologo),
    enhance: String(enhance),
  })
  if (seed !== undefined) params.set('seed', String(seed))

  return `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`
}

/**
 * Genera una imagen usando Pollinations.
 * Carga la imagen en un <img> element y la convierte a base64 data URL.
 * Esto evita los problemas de CORS y rate-limiting del server-side.
 */
export function generateImage(prompt, options = {}) {
  return new Promise((resolve, reject) => {
    const url = buildImageUrl(prompt, options)
    const img = new Image()
    img.crossOrigin = 'anonymous'

    const timeout = setTimeout(() => {
      img.src = ''
      reject(new Error('Tiempo agotado (60s). Intenta con un prompt mas corto o otro modelo.'))
    }, 60000)

    img.onload = () => {
      clearTimeout(timeout)
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const dataUrl = canvas.toDataURL('image/png')
        resolve({
          imageUrl: dataUrl,
          sourceUrl: url,
          width: img.naturalWidth,
          height: img.naturalHeight,
        })
      } catch (err) {
        // CORS issue - fall back to URL
        resolve({
          imageUrl: url,
          sourceUrl: url,
          width: img.naturalWidth,
          height: img.naturalHeight,
        })
      }
    }

    img.onerror = () => {
      clearTimeout(timeout)
      // Try fallback - open URL directly
      resolve({
        imageUrl: url,
        sourceUrl: url,
        width: options.width || 768,
        height: options.height || 768,
        fallback: true,
      })
    }

    img.src = url
  })
}

/**
 * Abre la imagen en una nueva pestana del navegador.
 * Util cuando el <img> loading falla.
 */
export function openImageInNewTab(prompt, options = {}) {
  const url = buildImageUrl(prompt, options)
  window.open(url, '_blank')
  return url
}
