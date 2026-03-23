import { useState, useMemo } from 'react'
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'
import { storyboardTemplate, sceneCycles, videoTools, videoEffects, productionWorkflow, technicalSpecs } from '../../data/videoPrompts'

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

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="text-xs px-2.5 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium">
      {copied ? 'Copiado!' : label || 'Copiar'}
    </button>
  )
}

function Badge({ children, color = 'bg-gray-100 text-gray-600' }) {
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{children}</span>
}

// ─── TAB: STORYBOARD ────────────────────────────────────────────
function StoryboardTab() {
  const [scenes, setScenes] = useLocalStorage('rm-storyboard', storyboardTemplate)
  const totalDuration = scenes.reduce((sum, s) => {
    const match = s.duration.match(/(\d+)/)
    return sum + (match ? parseInt(match[1]) : 0)
  }, 0)

  const updateScene = (id, field, value) => {
    setScenes(scenes.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  return (
    <div className="space-y-4">
      <div className="card bg-amber-50 border border-amber-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-amber-800">Guion / Storyboard</h3>
            <p className="text-xs text-amber-600 mt-1">8 escenas optimizadas para contar la historia de Rural Makers en menos de 4 minutos</p>
          </div>
          <div className={`text-right ${totalDuration > 240 ? 'text-red-600' : 'text-rural-green'}`}>
            <div className="text-2xl font-bold">{Math.floor(totalDuration / 60)}:{String(totalDuration % 60).padStart(2, '0')}</div>
            <div className="text-xs">/ 4:00 max</div>
          </div>
        </div>
        <div className="mt-3 w-full bg-amber-200 rounded-full h-2">
          <div className={`h-full rounded-full transition-all ${totalDuration > 240 ? 'bg-red-500' : 'bg-rural-green'}`}
            style={{ width: `${Math.min((totalDuration / 240) * 100, 100)}%` }} />
        </div>
      </div>

      {scenes.map((scene, idx) => (
        <div key={scene.id} className="card border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 bg-rural-green text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">{idx + 1}</span>
            <input value={scene.scene} onChange={e => updateScene(scene.id, 'scene', e.target.value)}
              className="font-semibold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-rural-green focus:outline-none flex-1" />
            <input value={scene.duration} onChange={e => updateScene(scene.id, 'duration', e.target.value)}
              className="w-16 text-sm text-center bg-gray-50 rounded px-2 py-1 border border-gray-200" />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Descripcion visual</label>
              <textarea value={scene.description} onChange={e => updateScene(scene.id, 'description', e.target.value)}
                rows={3} className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:border-rural-green focus:outline-none resize-y" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Voiceover</label>
              <textarea value={scene.voiceover} onChange={e => updateScene(scene.id, 'voiceover', e.target.value)}
                rows={3} className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:border-rural-green focus:outline-none resize-y" />
            </div>
          </div>
          <div className="mt-2">
            <label className="text-xs text-gray-500 block mb-1">Notas visuales / Direccion artistica</label>
            <input value={scene.visualNotes} onChange={e => updateScene(scene.id, 'visualNotes', e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:border-rural-green focus:outline-none" />
          </div>
        </div>
      ))}

      <div className="card bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Guion completo para locucion</h4>
        <div className="bg-white rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-60 overflow-auto">
          {scenes.map((s, i) => `[ESCENA ${i+1} - ${s.scene}]\n${s.voiceover}`).join('\n\n')}
        </div>
        <div className="mt-2">
          <CopyButton text={scenes.map((s, i) => `[ESCENA ${i+1}]\n${s.voiceover}`).join('\n\n')} label="Copiar guion completo" />
        </div>
      </div>
    </div>
  )
}

// ─── TAB: CICLOS IMAGEN + VIDEO ─────────────────────────────────
function CyclesTab() {
  const [expandedId, setExpandedId] = useState(null)
  const [filterScene, setFilterScene] = useState(0)
  const [copiedId, setCopiedId] = useState('')

  const sceneNumbers = [...new Set(sceneCycles.map(c => c.sceneNumber))]
  const filtered = filterScene ? sceneCycles.filter(c => c.sceneNumber === filterScene) : sceneCycles

  const copyPrompt = (text, id) => {
    copyToClipboard(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(''), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
        <h3 className="font-semibold text-purple-800">Ciclo Imagen + Video</h3>
        <p className="text-sm text-purple-600 mt-1">Cada plano sigue el mismo flujo: <strong>1) Generar imagen</strong> con IA → <strong>2) Animar la imagen</strong> con video IA → <strong>3) Editar en CapCut</strong></p>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">1</div>
            <span className="text-xs text-gray-600">Imagen IA</span>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">2</div>
            <span className="text-xs text-gray-600">Video IA</span>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-rural-green text-white flex items-center justify-center text-xs font-bold">3</div>
            <span className="text-xs text-gray-600">Editar + Efectos</span>
          </div>
        </div>
      </div>

      {/* Scene filter */}
      <div className="flex flex-wrap gap-1">
        <button onClick={() => setFilterScene(0)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${!filterScene ? 'bg-rural-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          Todos ({sceneCycles.length})
        </button>
        {sceneNumbers.map(n => (
          <button key={n} onClick={() => setFilterScene(n)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterScene === n ? 'bg-rural-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            Escena {n}
          </button>
        ))}
      </div>

      {/* Cycles */}
      {filtered.map(cycle => (
        <div key={cycle.id} className="card border border-gray-100">
          {/* Header */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpandedId(expandedId === cycle.id ? null : cycle.id)}>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
              {cycle.sceneNumber}.{cycle.order}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-800">{cycle.scene}</div>
              <div className="text-xs text-gray-400 flex gap-2">
                <span>{cycle.imagePrompt.tool}</span>
                <span>→</span>
                <span>{cycle.videoPrompt.tool}</span>
                <span>|</span>
                <span>{cycle.videoPrompt.duration}</span>
              </div>
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${expandedId === cycle.id ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {expandedId === cycle.id && (
            <div className="mt-4 space-y-4">
              {/* PASO 1: IMAGEN */}
              <div className="rounded-lg border-2 border-blue-200 overflow-hidden">
                <div className="bg-blue-50 px-4 py-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                  <span className="font-semibold text-blue-800 text-sm">Generar Imagen</span>
                  <Badge color="bg-blue-100 text-blue-700">{cycle.imagePrompt.tool}</Badge>
                  <Badge color="bg-blue-100 text-blue-700">{cycle.imagePrompt.resolution}</Badge>
                </div>
                <div className="p-4 space-y-2">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs text-gray-500 font-semibold uppercase">Prompt de imagen</span>
                      <button onClick={() => copyPrompt(cycle.imagePrompt.prompt, cycle.id + '-img')}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${copiedId === cycle.id + '-img' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
                        {copiedId === cycle.id + '-img' ? 'Copiado!' : 'Copiar prompt'}
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-mono">{cycle.imagePrompt.prompt}</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-2">
                    <span className="text-xs font-semibold text-amber-700">Tips: </span>
                    <span className="text-xs text-amber-600">{cycle.imagePrompt.tips}</span>
                  </div>
                </div>
              </div>

              {/* PASO 2: VIDEO */}
              <div className="rounded-lg border-2 border-purple-200 overflow-hidden">
                <div className="bg-purple-50 px-4 py-2 flex items-center gap-2 flex-wrap">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">2</div>
                  <span className="font-semibold text-purple-800 text-sm">Animar con Video IA</span>
                  <Badge color="bg-purple-100 text-purple-700">{cycle.videoPrompt.tool}</Badge>
                  <Badge color="bg-purple-100 text-purple-700">{cycle.videoPrompt.duration}</Badge>
                  <Badge color="bg-purple-100 text-purple-700">{cycle.videoPrompt.movement}</Badge>
                </div>
                <div className="p-4 space-y-2">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs text-gray-500 font-semibold uppercase">Prompt de video (animar la imagen)</span>
                      <button onClick={() => copyPrompt(cycle.videoPrompt.prompt, cycle.id + '-vid')}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${copiedId === cycle.id + '-vid' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>
                        {copiedId === cycle.id + '-vid' ? 'Copiado!' : 'Copiar prompt'}
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-mono">{cycle.videoPrompt.prompt}</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-2">
                    <span className="text-xs font-semibold text-amber-700">Tips: </span>
                    <span className="text-xs text-amber-600">{cycle.videoPrompt.tips}</span>
                  </div>
                </div>
              </div>

              {/* PASO 3: EDICION */}
              <div className="rounded-lg border-2 border-green-200 overflow-hidden">
                <div className="bg-green-50 px-4 py-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-rural-green text-white flex items-center justify-center text-xs font-bold">3</div>
                  <span className="font-semibold text-green-800 text-sm">Editar + Efectos en CapCut</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700">{cycle.effectNotes}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── TAB: HERRAMIENTAS ──────────────────────────────────────────
function ToolsTab() {
  const [expandedId, setExpandedId] = useState(null)
  const typeColors = {
    'Video IA (Image-to-Video)': 'bg-purple-100 text-purple-700',
    'Video IA (Text/Image-to-Video)': 'bg-purple-100 text-purple-700',
    'Imagen IA': 'bg-blue-100 text-blue-700',
    'Editor de Video': 'bg-green-100 text-green-700',
    'Editor de Video Pro': 'bg-green-100 text-green-700',
  }

  return (
    <div className="space-y-4">
      <div className="card bg-blue-50 border border-blue-200">
        <h3 className="font-semibold text-blue-800">Herramientas Recomendadas</h3>
        <p className="text-sm text-blue-600 mt-1">Todas las herramientas que necesitas para crear el video, con tips especificos para Rural Makers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {videoTools.map(tool => (
          <div key={tool.id} className="card border border-gray-100">
            <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => setExpandedId(expandedId === tool.id ? null : tool.id)}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 text-sm">{tool.name}</span>
                  <Badge color={typeColors[tool.type] || 'bg-gray-100 text-gray-600'}>{tool.type.split(' (')[0]}</Badge>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{tool.best}</div>
              </div>
              <Badge color={tool.free.startsWith('Si') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                {tool.free.startsWith('Si') ? 'Gratis' : 'Pago'}
              </Badge>
            </div>

            {expandedId === tool.id && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gray-500">URL:</span> <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{tool.url}</a></div>
                  <div><span className="text-gray-500">Gratis:</span> <span className="text-gray-800">{tool.free}</span></div>
                  <div><span className="text-gray-500">Resolucion:</span> <span className="text-gray-800">{tool.resolution}</span></div>
                  <div><span className="text-gray-500">Max duracion:</span> <span className="text-gray-800">{tool.maxDuration}</span></div>
                </div>
                {tool.promptStructure !== 'N/A - herramienta de edicion manual' && (
                  <div className="bg-gray-50 rounded-lg p-2 mt-2">
                    <span className="text-xs font-semibold text-gray-600">Estructura del prompt: </span>
                    <span className="text-xs text-gray-700 font-mono">{tool.promptStructure}</span>
                  </div>
                )}
                <div className="space-y-1 mt-2">
                  <span className="text-xs font-semibold text-gray-600">Tips:</span>
                  {tool.tips.map((tip, i) => (
                    <div key={i} className="flex gap-2 text-xs text-gray-600">
                      <span className="text-rural-green shrink-0">-</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comparativa rapida */}
      <div className="card">
        <h4 className="font-semibold text-gray-800 text-sm mb-3">Comparativa rapida: CapCut vs DaVinci Resolve</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left">Aspecto</th>
                <th className="px-3 py-2 text-left">CapCut</th>
                <th className="px-3 py-2 text-left">DaVinci Resolve</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Facilidad', 'Muy facil, intuitivo', 'Curva aprendizaje media'],
                ['Color grading', 'Basico (LUTs)', 'Profesional (Hollywood)'],
                ['Motion graphics', 'Templates basicos', 'Fusion: profesional'],
                ['Audio', 'Basico', 'Fairlight: profesional'],
                ['Precio', 'Gratis (con marca agua Pro)', 'Gratis (sin marca agua!)'],
                ['Recomendacion', 'Para empezar rapido', 'Para calidad maxima'],
              ].map(([aspect, capcut, davinci], i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-3 py-1.5 font-medium">{aspect}</td>
                  <td className="px-3 py-1.5">{capcut}</td>
                  <td className="px-3 py-1.5">{davinci}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2 font-medium">Recomendacion: Empieza con CapCut. Si quieres un resultado mas cinematografico, pasa a DaVinci. Ambos son gratuitos.</p>
      </div>
    </div>
  )
}

// ─── TAB: EFECTOS ───────────────────────────────────────────────
function EffectsTab() {
  const categories = [...new Set(videoEffects.map(e => e.category))]

  return (
    <div className="space-y-4">
      <div className="card bg-pink-50 border border-pink-200">
        <h3 className="font-semibold text-pink-800">Efectos y Tecnicas</h3>
        <p className="text-sm text-pink-600 mt-1">10 tecnicas que transformaran tus clips de IA en un video profesional. Cada una con "como hacerlo" paso a paso.</p>
      </div>

      {categories.map(cat => (
        <div key={cat}>
          <div className="text-xs text-gray-500 uppercase tracking-wide px-1 pt-3 pb-2 font-semibold">{cat}</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {videoEffects.filter(e => e.category === cat).map(effect => (
              <div key={effect.id} className="card border border-gray-100">
                <h4 className="font-semibold text-sm text-gray-800 mb-1">{effect.name}</h4>
                <p className="text-xs text-gray-600 mb-2">{effect.description}</p>
                <div className="bg-gray-50 rounded-lg p-2 mb-2">
                  <span className="text-xs font-semibold text-gray-600">Como hacerlo: </span>
                  <span className="text-xs text-gray-700">{effect.howTo}</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 mb-2">
                  <span className="text-xs font-semibold text-blue-700">Cuando usarlo: </span>
                  <span className="text-xs text-blue-600">{effect.when}</span>
                </div>
                <div className="bg-rural-green/10 rounded-lg p-2">
                  <span className="text-xs font-semibold text-rural-green">Ejemplo Rural Makers: </span>
                  <span className="text-xs text-green-700">{effect.example}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── TAB: WORKFLOW ──────────────────────────────────────────────
function WorkflowTab() {
  const [completed, setCompleted] = useLocalStorage('rm-video-workflow', [])

  const toggleStep = (step) => {
    setCompleted(prev => prev.includes(step) ? prev.filter(s => s !== step) : [...prev, step])
  }

  const totalHours = productionWorkflow.reduce((sum, s) => {
    const match = s.duration.match(/(\d+)-?(\d+)?/)
    return sum + (match ? (parseInt(match[1]) + (match[2] ? parseInt(match[2]) : parseInt(match[1]))) / 2 : 0)
  }, 0)

  return (
    <div className="space-y-4">
      <div className="card bg-green-50 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-green-800">Workflow de Produccion</h3>
            <p className="text-sm text-green-600 mt-1">8 pasos para crear tu video de principio a fin. Tiempo estimado: {totalHours} horas.</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-rural-green">{completed.length}/{productionWorkflow.length}</div>
            <div className="text-xs text-gray-500">completados</div>
          </div>
        </div>
        <div className="mt-3 w-full bg-green-200 rounded-full h-2">
          <div className="h-full bg-rural-green rounded-full transition-all"
            style={{ width: `${(completed.length / productionWorkflow.length) * 100}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        {productionWorkflow.map(step => (
          <div key={step.step} className={`card border transition ${completed.includes(step.step) ? 'border-green-300 bg-green-50/50' : 'border-gray-100'}`}>
            <div className="flex items-start gap-3">
              <button onClick={() => toggleStep(step.step)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition ${completed.includes(step.step) ? 'bg-rural-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {completed.includes(step.step) ? '✓' : step.step}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className={`font-semibold text-sm ${completed.includes(step.step) ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                    {step.title}
                  </h4>
                  <Badge>{step.duration}</Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                <div className="text-xs text-gray-400 mt-1">Herramientas: {step.tools}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Technical specs */}
      <div className="card">
        <h4 className="font-semibold text-gray-800 text-sm mb-3">Especificaciones Tecnicas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Requisitos Goteo</div>
            {Object.entries(technicalSpecs.goteo).map(([key, val]) => (
              <div key={key} className="flex justify-between text-xs py-1 border-b border-gray-50">
                <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-gray-800 font-medium">{val}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Exportacion</div>
            {Object.entries(technicalSpecs.export).map(([key, val]) => (
              <div key={key} className="flex justify-between text-xs py-1 border-b border-gray-50">
                <span className="text-gray-500 capitalize">{key}</span>
                <span className="text-gray-800 font-medium">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Config YouTube</div>
        <div className="space-y-1">
          {Object.entries(technicalSpecs.youtube).map(([key, val]) => (
            <div key={key} className="flex gap-2 text-xs py-1">
              <span className="text-gray-500 capitalize w-24 shrink-0">{key}:</span>
              <span className="text-gray-700">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Organizacion de Archivos</div>
        <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-700">
          <pre>{`video-rural-makers/
├── 01_guion/
│   └── guion_voiceover.txt
├── 02_imagenes/
│   ├── escena01_intro/
│   │   ├── escena01_plano01_v1.png
│   │   ├── escena01_plano01_v2.png  (variantes)
│   │   └── escena01_plano02_v1.png
│   ├── escena02_problema/
│   └── ...
├── 03_videos_ia/
│   ├── escena01_intro/
│   │   ├── escena01_plano01_kling_v1.mp4
│   │   └── escena01_plano01_kling_v2.mp4
│   └── ...
├── 04_motion_graphics/
│   ├── mapa_leon.png
│   ├── tarjetas_recompensas/
│   └── logo_animacion/
├── 05_audio/
│   ├── voiceover.mp3
│   ├── musica_fondo.mp3
│   └── sfx/  (sonidos ambiente)
└── 06_export/
    ├── rural_makers_v1.mp4
    └── rural_makers_FINAL.mp4`}</pre>
        </div>
      </div>
    </div>
  )
}

// ─── TAB: NOTAS ─────────────────────────────────────────────────
function NotesTab() {
  const [notes, setNotes] = useLocalStorage('rm-video-notes', `# Notas de Produccion - Video Rural Makers

## Direccion artistica
- Estilo: documentalista cinematografico (como los documentales de Netflix sobre comunidades)
- Paleta: verdes rurales (#4a7c59), marrones tierra (#8B6914), dorados (#D4A843), crema (#fdf8f0)
- Musica: acustica espanola, guitarra, sonidos de naturaleza. Buscar en Epidemic Sound o Artlist
- Tipografia: sans-serif limpia para textos en pantalla (Montserrat o similar)

## Tono narrativo
- Esperanzador pero realista. No dramatizar en exceso el problema.
- La voz debe ser cercana, como un amigo que te cuenta algo que le apasiona.
- Evitar tono institucional o corporativo.

## Prioridades de produccion
1. Primero: voiceover (marca el ritmo de todo)
2. Segundo: imagenes clave (intro, transicion ventana, cierre)
3. Tercero: animaciones con IA
4. Cuarto: motion graphics (mapa, recompensas)
5. Ultimo: efectos, color grading, sonido ambiente

## Recursos existentes
- Logo: www.goteo.org/img/700x0/logoruralmakers-4.jpg
- Prototipo app: ruralmakers.net (para screencast)
- Landing: ruralmakers.base44.app
- Fotos equipo: pendiente (usar IA mientras tanto)

## Musica libre sugerida
- Buscar en: pixabay.com/music, freesound.org, bensound.com
- Keywords: "acoustic spanish guitar", "rural ambient", "hopeful documentary"
- La musica debe subir de intensidad en las escenas 3-4 y hacer crescendo en el cierre

## Voiceover
- Opcion 1: Grabar tu propia voz (mas autentico)
- Opcion 2: ElevenLabs (elevenlabs.io) - voz IA en espanol
- Opcion 3: Contratar locutor en Fiverr (10-30 EUR)
- Grabar en sitio silencioso, micro cerca de la boca, formato WAV
`)

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">Notas de Produccion</h3>
      <div className="card">
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          rows={25} className="w-full text-sm border border-gray-200 rounded-lg p-3 focus:border-rural-green focus:outline-none resize-y font-mono" />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400">Auto-guardado en localStorage</span>
          <CopyButton text={notes} />
        </div>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────
export default function VideoProduction() {
  const [activeTab, setActiveTab] = useState('cycles')

  const tabs = [
    { id: 'storyboard', label: 'Guion' },
    { id: 'cycles', label: 'Ciclos Img+Video' },
    { id: 'tools', label: 'Herramientas' },
    { id: 'effects', label: 'Efectos' },
    { id: 'workflow', label: 'Workflow' },
    { id: 'notes', label: 'Notas' },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Video de Presentacion</h2>
            <p className="text-sm opacity-90 mt-1">20 planos con ciclo completo: prompt de imagen + prompt de video + edicion. Todo listo para copiar y crear.</p>
          </div>
          <div className="flex gap-2">
            <Badge color="bg-white/20 text-white">Goteo: max 4 min</Badge>
            <Badge color="bg-white/20 text-white">1920x1080</Badge>
            <Badge color="bg-white/20 text-white">16:9</Badge>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="card text-center py-3">
          <div className="text-xl font-bold text-purple-600">{sceneCycles.length}</div>
          <div className="text-xs text-gray-500">Planos con prompts</div>
        </div>
        <div className="card text-center py-3">
          <div className="text-xl font-bold text-blue-600">{sceneCycles.filter(c => c.imagePrompt.tool.includes('Midjourney')).length}</div>
          <div className="text-xs text-gray-500">Imagenes IA</div>
        </div>
        <div className="card text-center py-3">
          <div className="text-xl font-bold text-green-600">{videoTools.length}</div>
          <div className="text-xs text-gray-500">Herramientas</div>
        </div>
        <div className="card text-center py-3">
          <div className="text-xl font-bold text-pink-600">{videoEffects.length}</div>
          <div className="text-xs text-gray-500">Efectos/Tecnicas</div>
        </div>
        <div className="card text-center py-3">
          <div className="text-xl font-bold text-amber-600">8</div>
          <div className="text-xs text-gray-500">Escenas</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`tab-btn flex-1 min-w-[80px] ${activeTab === tab.id ? 'active' : ''}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'storyboard' && <StoryboardTab />}
      {activeTab === 'cycles' && <CyclesTab />}
      {activeTab === 'tools' && <ToolsTab />}
      {activeTab === 'effects' && <EffectsTab />}
      {activeTab === 'workflow' && <WorkflowTab />}
      {activeTab === 'notes' && <NotesTab />}
    </div>
  )
}
