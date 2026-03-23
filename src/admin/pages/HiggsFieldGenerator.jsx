import { useState, useRef } from 'react'
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'
import {
  generateImage as hfGenerateImage,
  generateVideo as hfGenerateVideo,
  pollUntilComplete as hfPoll,
  RESOLUTIONS as HF_RESOLUTIONS,
  VIDEO_MODELS as HF_VIDEO_MODELS,
} from '../../shared/lib/higgsfield'
import {
  generateImage as geminiGenerateImage,
  generateVideo as geminiGenerateVideo,
  pollVideoUntilComplete as geminiPollVideo,
  IMAGE_MODELS as GEMINI_IMAGE_MODELS,
  VIDEO_MODELS as GEMINI_VIDEO_MODELS,
  ASPECT_RATIOS as GEMINI_ASPECT_RATIOS,
  IMAGE_SIZES,
} from '../../shared/lib/gemini'
import {
  generateImage as pollinationsGenerateImage,
  buildImageUrl as pollinationsBuildUrl,
  openImageInNewTab as pollinationsOpenTab,
  POLLINATIONS_MODELS,
  POLLINATIONS_SIZES,
} from '../../shared/lib/pollinations'

// ─── STATUS BADGE ──────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    idle: { label: 'Listo', cls: 'bg-gray-100 text-gray-500' },
    pending: { label: 'En cola...', cls: 'bg-yellow-100 text-yellow-700' },
    processing: { label: 'Generando...', cls: 'bg-blue-100 text-blue-700' },
    completed: { label: 'Completado', cls: 'bg-green-100 text-green-700' },
    failed: { label: 'Error', cls: 'bg-red-100 text-red-700' },
  }
  const s = map[status] || map.idle
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.cls}`}>
      {(status === 'pending' || status === 'processing') && (
        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
      )}
      {s.label}
    </span>
  )
}

// ─── GALLERY ITEM ──────────────────────────────────────────────
function GalleryItem({ item, onDelete }) {
  const isVideo = item.type === 'video'
  return (
    <div className="card group relative overflow-hidden">
      {isVideo ? (
        <video src={item.url} controls className="w-full rounded-lg aspect-video object-cover" />
      ) : (
        <img src={item.url} alt={item.prompt} className="w-full rounded-lg aspect-square object-cover" />
      )}
      <div className="mt-2">
        <p className="text-xs text-gray-500 truncate" title={item.prompt}>{item.prompt}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-gray-400">
            {new Date(item.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </span>
          <div className="flex gap-1.5">
            <a href={item.url} target="_blank" rel="noopener noreferrer"
              className="text-[10px] text-rural-green hover:underline font-medium">Abrir</a>
            <button onClick={() => onDelete(item.id)}
              className="text-[10px] text-red-400 hover:text-red-600 font-medium">Borrar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PROGRESS BAR ──────────────────────────────────────────────
function ProgressBar({ status, elapsed }) {
  if (status === 'idle' || status === 'completed') return null
  const percent = status === 'processing' ? Math.min(90, (elapsed / 120) * 100) : 10
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{status === 'pending' ? 'Esperando...' : 'Procesando...'}</span>
        <span>{Math.floor(elapsed)}s</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-full rounded-full bg-rural-green transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

// ─── IMAGE TAB ─────────────────────────────────────────────────
function ImageTab({ gallery, setGallery, backend }) {
  const [prompt, setPrompt] = useState('')
  const [resIdx, setResIdx] = useState(0)
  const [modelIdx, setModelIdx] = useState(0)
  const [pollModelIdx, setPollModelIdx] = useState(0)
  const [sizeIdx, setSizeIdx] = useState(1)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef(null)

  const isPollinations = backend === 'pollinations'
  const isGemini = backend === 'gemini'
  const resolutions = isPollinations ? POLLINATIONS_SIZES : (isGemini ? GEMINI_ASPECT_RATIOS : HF_RESOLUTIONS)
  const models = isPollinations ? POLLINATIONS_MODELS : (isGemini ? GEMINI_IMAGE_MODELS : [])

  const startTimer = () => {
    setElapsed(0)
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
  }
  const stopTimer = () => clearInterval(timerRef.current)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setError(null)
    setPreview(null)
    setStatus('pending')
    startTimer()

    try {
      if (isPollinations) {
        setStatus('processing')
        const size = POLLINATIONS_SIZES[sizeIdx] || POLLINATIONS_SIZES[1]
        const model = POLLINATIONS_MODELS[pollModelIdx]?.value || 'turbo'
        const result = await pollinationsGenerateImage(prompt, {
          model,
          width: size.w,
          height: size.h,
        })

        stopTimer()
        setStatus('completed')
        setPreview(result.imageUrl)
        setGallery(prev => [{
          id: Date.now().toString(),
          type: 'image',
          url: result.imageUrl,
          prompt: prompt.trim(),
          resolution: size.label,
          backend: 'pollinations',
          createdAt: new Date().toISOString(),
        }, ...prev])
      } else if (isGemini) {
        setStatus('processing')
        const model = models[modelIdx]?.value || 'gemini-2.5-flash-image'
        const aspectRatio = resolutions[resIdx]?.value || '1:1'
        const result = await geminiGenerateImage(prompt, model, { aspectRatio })

        stopTimer()
        setStatus('completed')

        if (result.imageUrl) {
          setPreview(result.imageUrl)
          setGallery(prev => [{
            id: Date.now().toString(),
            type: 'image',
            url: result.imageUrl,
            prompt: prompt.trim(),
            resolution: `${aspectRatio} (${model})`,
            backend: 'gemini',
            createdAt: new Date().toISOString(),
          }, ...prev])
        }
      } else {
        // Higgsfield
        const aspectRatio = resolutions[resIdx]?.value
        const job = await hfGenerateImage(prompt, aspectRatio)
        setStatus('processing')

        const result = await hfPoll(job.id, (s) => {
          const state = (s.status || '').toLowerCase()
          if (state === 'processing' || state === 'running') setStatus('processing')
        })

        stopTimer()
        setStatus('completed')

        const outputUrl = result.jobs?.[0]?.results?.raw?.url || result.output?.url || result.output?.[0]?.url || result.url || result.output
        if (outputUrl) {
          setPreview(outputUrl)
          setGallery(prev => [{
            id: Date.now().toString(),
            type: 'image',
            url: outputUrl,
            prompt: prompt.trim(),
            resolution: resolutions[resIdx]?.label,
            backend: 'higgsfield',
            createdAt: new Date().toISOString(),
          }, ...prev])
        }
      }
    } catch (err) {
      stopTimer()
      setStatus('failed')
      setError(err.message)
    }
  }

  // Open in new tab as fallback for Pollinations
  const handleOpenInBrowser = () => {
    if (!prompt.trim()) return
    const size = POLLINATIONS_SIZES[sizeIdx] || POLLINATIONS_SIZES[1]
    const model = POLLINATIONS_MODELS[pollModelIdx]?.value || 'turbo'
    pollinationsOpenTab(prompt, { model, width: size.w, height: size.h })
  }

  return (
    <div className="space-y-6">
      {/* Pollinations info banner */}
      {isPollinations && (
        <div className="card bg-green-50 border border-green-200">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">🌱</span>
            <div>
              <p className="text-sm font-semibold text-green-800">Pollinations.ai - 100% Gratis</p>
              <p className="text-xs text-green-600 mt-0.5">Sin API key, sin limites, sin restricciones regionales. La imagen se genera directamente en tu navegador.</p>
            </div>
          </div>
        </div>
      )}

      {/* Prompt */}
      <div className="card">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Prompt de imagen</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={4}
          placeholder="Describe la imagen que quieres generar... Ej: Paisaje rural de montana leonesa al atardecer, campos verdes con comunidades trabajando juntas, estilo cinematografico"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rural-green focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{prompt.length} caracteres</p>
      </div>

      {/* Model + Size selectors */}
      <div className="card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Model */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Modelo</label>
            {isPollinations ? (
              <select value={pollModelIdx} onChange={e => setPollModelIdx(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rural-green">
                {POLLINATIONS_MODELS.map((m, i) => (
                  <option key={i} value={i}>{m.label}</option>
                ))}
              </select>
            ) : isGemini ? (
              <select value={modelIdx} onChange={e => setModelIdx(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rural-green">
                {GEMINI_IMAGE_MODELS.map((m, i) => (
                  <option key={i} value={i}>{m.label}{m.free ? '' : ' (de pago)'}</option>
                ))}
              </select>
            ) : null}
          </div>

          {/* Resolution / Size */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {isPollinations ? 'Tamano' : isGemini ? 'Aspect Ratio' : 'Resolucion'}
            </label>
            {isPollinations ? (
              <select value={sizeIdx} onChange={e => setSizeIdx(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rural-green">
                {POLLINATIONS_SIZES.map((s, i) => (
                  <option key={i} value={i}>{s.label}</option>
                ))}
              </select>
            ) : (
              <select value={resIdx} onChange={e => setResIdx(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rural-green">
                {resolutions.map((r, i) => (
                  <option key={i} value={i}>{r.label}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Generate buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || status === 'pending' || status === 'processing'}
            className="px-6 py-2.5 bg-rural-green text-white rounded-lg font-semibold text-sm hover:bg-rural-green-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {(status === 'pending' || status === 'processing') ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generando...
              </>
            ) : 'Generar Imagen'}
          </button>
          {isPollinations && (
            <button
              onClick={handleOpenInBrowser}
              disabled={!prompt.trim()}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50"
            >
              Abrir en navegador
            </button>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3">
        <StatusBadge status={status} />
        <ProgressBar status={status} elapsed={elapsed} />
      </div>

      {/* Error */}
      {error && (
        <div className="card bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
          {isPollinations && (
            <button onClick={handleOpenInBrowser}
              className="mt-2 text-xs px-3 py-1.5 bg-rural-green text-white rounded-lg font-medium hover:bg-rural-green-dark transition">
              Abrir imagen en nueva pestana
            </button>
          )}
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Resultado</h3>
          <img src={preview} alt="Generated" className="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          <div className="flex flex-wrap gap-2 mt-3">
            <a href={preview} download="rural-makers-image.png" target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-rural-green text-white rounded-lg font-medium hover:bg-rural-green-dark transition">
              Descargar
            </a>
            <button onClick={() => {
              try { navigator.clipboard.writeText(preview) } catch { /* fallback */ }
            }}
              className="text-xs px-3 py-1.5 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition">
              Copiar URL
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── VIDEO TAB ─────────────────────────────────────────────────
function VideoTab({ gallery, setGallery, backend }) {
  const [imageUrl, setImageUrl] = useState('')
  const [prompt, setPrompt] = useState('')
  const isGemini = backend === 'gemini'
  const videoModels = isGemini ? GEMINI_VIDEO_MODELS : HF_VIDEO_MODELS
  const [videoModel, setVideoModel] = useState(isGemini ? 'veo-3.1-generate-preview' : 'dop-turbo')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [uploadPreview, setUploadPreview] = useState(null)
  const timerRef = useRef(null)
  const fileRef = useRef(null)

  const startTimer = () => {
    setElapsed(0)
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
  }
  const stopTimer = () => clearInterval(timerRef.current)

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setUploadPreview(reader.result)
      setImageUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleGenerate = async () => {
    if (!imageUrl) return
    setError(null)
    setPreview(null)
    setStatus('pending')
    startTimer()

    try {
      let outputUrl
      if (isGemini) {
        setStatus('processing')
        const op = await geminiGenerateVideo(prompt, videoModel, { imageUrl })
        const result = await geminiPollVideo(op.name || op.operationName, (s) => {
          if (s.done === false) setStatus('processing')
        })
        stopTimer()
        setStatus('completed')
        outputUrl = result.response?.generatedVideos?.[0]?.video?.uri || result.videoUrl
      } else {
        const job = await hfGenerateVideo(imageUrl, prompt, videoModel)
        setStatus('processing')
        const result = await hfPoll(job.id, (s) => {
          const state = (s.status || '').toLowerCase()
          if (state === 'processing' || state === 'running') setStatus('processing')
        })
        stopTimer()
        setStatus('completed')
        outputUrl = result.jobs?.[0]?.results?.raw?.url || result.output?.url || result.output?.[0]?.url || result.url || result.output
      }
      if (outputUrl) {
        setPreview(outputUrl)
        const entry = {
          id: Date.now().toString(),
          type: 'video',
          url: outputUrl,
          prompt: prompt.trim() || `Video desde imagen (${videoModel})`,
          videoModel,
          createdAt: new Date().toISOString(),
        }
        setGallery(prev => [entry, ...prev])
      }
    } catch (err) {
      stopTimer()
      setStatus('failed')
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Image source */}
      <div className="card">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Imagen origen</label>
        <div className="space-y-3">
          <input
            type="text"
            value={imageUrl.startsWith('data:') ? '' : imageUrl}
            onChange={e => { setImageUrl(e.target.value); setUploadPreview(null) }}
            placeholder="https://... URL de la imagen"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rural-green focus:border-transparent"
          />
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">o bien</span>
            <button
              onClick={() => fileRef.current?.click()}
              className="text-xs px-3 py-1.5 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Subir imagen
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </div>
          {uploadPreview && (
            <img src={uploadPreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
          )}
          {imageUrl && !uploadPreview && imageUrl.startsWith('http') && (
            <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg border"
              onError={e => { e.target.style.display = 'none' }} />
          )}
        </div>
      </div>

      {/* Animation prompt */}
      <div className="card">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Prompt de animacion (opcional)</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={3}
          placeholder="Describe como quieres que se anime la imagen... Ej: La camara se acerca lentamente mientras las nubes se mueven suavemente"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rural-green focus:border-transparent resize-none"
        />
      </div>

      {/* Camera effect + Button */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Modelo de video</label>
            <select
              value={videoModel}
              onChange={e => setVideoModel(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rural-green"
            >
              {videoModels.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={!imageUrl || status === 'pending' || status === 'processing'}
            className="px-6 py-2.5 bg-rural-green text-white rounded-lg font-semibold text-sm hover:bg-rural-green-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            {(status === 'pending' || status === 'processing') ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generando...
              </>
            ) : 'Generar Video'}
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3">
        <StatusBadge status={status} />
        <ProgressBar status={status} elapsed={elapsed} />
      </div>

      {/* Error */}
      {error && (
        <div className="card bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Resultado</h3>
          <video src={preview} controls className="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          <div className="flex gap-2 mt-3">
            <a href={preview} download target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-rural-green text-white rounded-lg font-medium hover:bg-rural-green-dark transition">
              Descargar
            </a>
            <button onClick={() => navigator.clipboard.writeText(preview)}
              className="text-xs px-3 py-1.5 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition">
              Copiar URL
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── MAIN COMPONENT ────────────────────────────────────────────
export default function HiggsFieldGenerator() {
  const [tab, setTab] = useState('image')
  const [backend, setBackend] = useState('pollinations')
  const [gallery, setGallery] = useLocalStorage('rm-higgsfield-gallery', [])

  const deleteItem = (id) => {
    setGallery(prev => prev.filter(item => item.id !== id))
  }

  const clearGallery = () => {
    if (window.confirm('Borrar toda la galeria?')) {
      setGallery([])
    }
  }

  const tabs = [
    { id: 'image', label: 'Generar Imagen', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'video', label: 'Animar Imagen (Video)', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Generador IA
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Genera imagenes y videos con IA para la campana de Rural Makers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select value={backend} onChange={e => setBackend(e.target.value)}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg font-medium bg-white focus:ring-2 focus:ring-rural-green">
            <option value="pollinations">Pollinations.ai (Gratis, sin limites)</option>
            <option value="gemini">Google Gemini (requiere cuota)</option>
            <option value="higgsfield">Higgsfield</option>
          </select>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            backend === 'pollinations' ? 'bg-green-100 text-green-700' :
            backend === 'gemini' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
          }`}>
            {backend === 'pollinations' ? 'Gratis' : backend === 'gemini' ? 'API Gemini' : 'Higgsfield'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition ${
              tab === t.id
                ? 'border-rural-green text-rural-green'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
            </svg>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'image' ? (
        <ImageTab gallery={gallery} setGallery={setGallery} backend={backend} />
      ) : (
        <VideoTab gallery={gallery} setGallery={setGallery} backend={backend} />
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Galeria ({gallery.length})
            </h3>
            <button onClick={clearGallery}
              className="text-xs text-red-400 hover:text-red-600 font-medium">
              Limpiar todo
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map(item => (
              <GalleryItem key={item.id} item={item} onDelete={deleteItem} />
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card bg-gray-50 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Consejos para mejores resultados</h4>
        <ul className="text-xs text-gray-500 space-y-1.5 list-disc list-inside">
          <li>Usa prompts descriptivos en ingles para mejores resultados con el modelo Flux</li>
          <li>Para videos, imagenes con composiciones claras y pocos elementos dan mejores animaciones</li>
          <li>Los efectos de camara como Zoom In y Pan funcionan bien para escenas de paisaje</li>
          <li>La generacion de imagenes tarda 15-30 segundos, los videos pueden tardar 1-3 minutos</li>
          <li>Las imagenes generadas se guardan en el navegador (localStorage)</li>
        </ul>
      </div>
    </div>
  )
}
