import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { storyboardTemplate, videoPromptsHiggsfield, videoPromptsKling, imagePrompts } from '../data/videoPrompts'

function copyToClipboard(text) {
  if (navigator.clipboard && document.hasFocus()) {
    return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text))
  }
  return fallbackCopy(text)
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0'
  document.body.appendChild(ta)
  ta.select()
  try { document.execCommand('copy') } catch {}
  document.body.removeChild(ta)
  return Promise.resolve()
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition">
      {copied ? 'Copiado!' : 'Copiar'}
    </button>
  )
}

function StoryboardTab() {
  const [scenes, setScenes] = useLocalStorage('rm-storyboard', storyboardTemplate)

  const updateScene = (id, field, value) => {
    setScenes(scenes.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const totalDuration = scenes.reduce((sum, s) => {
    const secs = parseInt(s.duration) || 0
    return sum + secs
  }, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">Guion / Storyboard (max 4 min)</h3>
        <span className={`text-sm font-medium ${totalDuration > 240 ? 'text-red-500' : 'text-rural-green'}`}>
          Duracion total: {Math.floor(totalDuration / 60)}:{String(totalDuration % 60).padStart(2, '0')}
        </span>
      </div>

      {scenes.map((scene, idx) => (
        <div key={scene.id} className="card border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 bg-rural-green text-white rounded-full flex items-center justify-center text-sm font-bold">
              {idx + 1}
            </span>
            <input
              value={scene.scene}
              onChange={e => updateScene(scene.id, 'scene', e.target.value)}
              className="font-semibold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-rural-green focus:outline-none flex-1"
            />
            <input
              value={scene.duration}
              onChange={e => updateScene(scene.id, 'duration', e.target.value)}
              className="w-16 text-sm text-center bg-gray-50 rounded px-2 py-1 border border-gray-200"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Descripcion visual</label>
              <textarea
                value={scene.description}
                onChange={e => updateScene(scene.id, 'description', e.target.value)}
                rows={3}
                className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:border-rural-green focus:outline-none resize-y"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Locucion / Voiceover</label>
              <textarea
                value={scene.voiceover}
                onChange={e => updateScene(scene.id, 'voiceover', e.target.value)}
                rows={3}
                className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:border-rural-green focus:outline-none resize-y"
              />
            </div>
          </div>
          <div className="mt-2">
            <label className="text-xs text-gray-500 block mb-1">Notas visuales</label>
            <input
              value={scene.visualNotes}
              onChange={e => updateScene(scene.id, 'visualNotes', e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:border-rural-green focus:outline-none"
            />
          </div>
        </div>
      ))}

      {/* Export script */}
      <div className="card bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Guion completo (para locucion)</h4>
        <div className="bg-white rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
          {scenes.map(s => s.voiceover).filter(Boolean).join('\n\n')}
        </div>
        <CopyButton text={scenes.map(s => s.voiceover).filter(Boolean).join('\n\n')} />
      </div>
    </div>
  )
}

function PromptsTab({ title, prompts: defaultPrompts, storageKey }) {
  const [prompts, setPrompts] = useLocalStorage(storageKey, defaultPrompts)

  const updatePrompt = (id, field, value) => {
    setPrompts(prompts.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">{title}</h3>
      {prompts.map(p => (
        <div key={p.id} className="card border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <input
              value={p.title}
              onChange={e => updatePrompt(p.id, 'title', e.target.value)}
              className="font-medium text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-rural-green focus:outline-none"
            />
            <CopyButton text={p.prompt} />
          </div>
          <textarea
            value={p.prompt}
            onChange={e => updatePrompt(p.id, 'prompt', e.target.value)}
            rows={4}
            className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:border-rural-green focus:outline-none resize-y mb-2"
          />
          <input
            value={p.params}
            onChange={e => updatePrompt(p.id, 'params', e.target.value)}
            className="w-full text-xs text-gray-500 bg-gray-50 rounded px-2 py-1 border border-gray-200"
            placeholder="Parametros..."
          />
        </div>
      ))}
    </div>
  )
}

function ImagePromptsTab() {
  const [prompts, setPrompts] = useLocalStorage('rm-image-prompts', imagePrompts)

  const updatePrompt = (id, field, value) => {
    setPrompts(prompts.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">Prompts para Imagenes</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {prompts.map(p => (
          <div key={p.id} className="card border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-rural-green/10 text-rural-green px-2 py-0.5 rounded-full">{p.category}</span>
              <input
                value={p.title}
                onChange={e => updatePrompt(p.id, 'title', e.target.value)}
                className="font-medium text-sm text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-rural-green focus:outline-none flex-1"
              />
              <CopyButton text={p.prompt} />
            </div>
            <textarea
              value={p.prompt}
              onChange={e => updatePrompt(p.id, 'prompt', e.target.value)}
              rows={4}
              className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:border-rural-green focus:outline-none resize-y mb-2"
            />
            <input
              value={p.imageUrl || ''}
              onChange={e => updatePrompt(p.id, 'imageUrl', e.target.value)}
              className="w-full text-xs text-gray-500 bg-gray-50 rounded px-2 py-1 border border-gray-200"
              placeholder="Pega aqui la URL de la imagen generada..."
            />
            {p.imageUrl && (
              <img src={p.imageUrl} alt={p.title} className="mt-2 rounded-lg max-h-40 object-cover w-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function NotesTab() {
  const [notes, setNotes] = useLocalStorage('rm-video-notes', `# Ideas para el Agente IA de Video

## Direccion artistica
- Estilo documentalista pero con toques cinematograficos
- Paleta de colores: verdes rurales, marrones tierra, dorados de Leon
- Musica: acustica, guitarra espanola, sonidos de naturaleza

## Herramientas
- Higgsfield: escenas cortas de transicion (3-5s)
- Kling 3.0: escenas principales cinematograficas (6-8s)
- Imagenes: usar como base para video con IA

## Ideas adicionales
- Incluir testimonios reales de personas de La Omana
- Mostrar la app RuralMakers en funcionamiento
- Grabar facendera real y usar como material base
- Integrar el logo y branding de Rural Makers
- Terminar con llamada a goteo.org

## Recursos
- Logo: www.goteo.org/img/700x0/logoruralmakers-4.jpg
- Fotos equipo: en carpeta goteo-preview
- Prototipo app: ruralmakers.net
- Landing: ruralmakers.base44.app
`)

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">Notas del Agente IA</h3>
      <div className="card">
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={20}
          className="w-full text-sm border border-gray-200 rounded-lg p-3 focus:border-rural-green focus:outline-none resize-y font-mono"
          placeholder="Escribe aqui ideas, direcciones y notas para el agente IA..."
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400">Auto-guardado en localStorage</span>
          <CopyButton text={notes} />
        </div>
      </div>
    </div>
  )
}

export default function VideoProduction() {
  const [activeTab, setActiveTab] = useState('storyboard')

  const tabs = [
    { id: 'storyboard', label: 'Guion / Storyboard' },
    { id: 'higgsfield', label: 'Prompts Higgsfield' },
    { id: 'kling', label: 'Prompts Kling 3.0' },
    { id: 'images', label: 'Prompts Imagenes' },
    { id: 'notes', label: 'Notas Agente IA' },
  ]

  return (
    <div className="space-y-4">
      <div className="card bg-red-50 border border-red-200">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎬</span>
          <div>
            <h2 className="font-semibold text-red-800">Video de Presentacion - PENDIENTE</h2>
            <p className="text-sm text-red-600">
              El video es obligatorio en Goteo (max 4 minutos). Subelo a YouTube, Vimeo o PeerTube y pega la URL.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'storyboard' && <StoryboardTab />}
        {activeTab === 'higgsfield' && (
          <PromptsTab title="Prompts para Higgsfield" prompts={videoPromptsHiggsfield} storageKey="rm-prompts-hf" />
        )}
        {activeTab === 'kling' && (
          <PromptsTab title="Prompts para Kling 3.0" prompts={videoPromptsKling} storageKey="rm-prompts-kl" />
        )}
        {activeTab === 'images' && <ImagePromptsTab />}
        {activeTab === 'notes' && <NotesTab />}
      </div>
    </div>
  )
}
