import { useState, useMemo } from 'react'
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'
import { storyboardTemplate, sceneCycles, videoTools, videoEffects, productionWorkflow, technicalSpecs } from '../../data/videoPrompts'
import { seedanceImageChain, seedanceClips, capcutInserts, finalTimeline, audioDesign, productionSteps as seedanceSteps, seedanceTips, checklist as seedanceChecklist } from '../../data/seedanceProduction'

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

// ─── TAB: SEEDANCE 2 ───────────────────────────────────────────
function SeedanceTab() {
  const [expandedClip, setExpandedClip] = useState(null)
  const [expandedImage, setExpandedImage] = useState(null)
  const [checkState, setCheckState] = useLocalStorage('rm-seedance-checklist', {})
  const [copiedId, setCopiedId] = useState('')
  const [view, setView] = useState('clips') // clips | chain | timeline | checklist

  const copyPrompt = (text, id) => {
    copyToClipboard(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(''), 2000)
  }

  const toggleCheck = (task) => {
    setCheckState(prev => ({ ...prev, [task]: !prev[task] }))
  }

  const completedCount = Object.values(checkState).filter(Boolean).length
  const totalTasks = seedanceChecklist.length

  const subviews = [
    { id: 'clips', label: 'Clips Seedance' },
    { id: 'chain', label: 'Cadena de Imagenes' },
    { id: 'timeline', label: 'Timeline Final' },
    { id: 'checklist', label: `Checklist (${completedCount}/${totalTasks})` },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
        <h3 className="text-lg font-bold">Seedance 2 — Produccion</h3>
        <p className="text-sm opacity-90 mt-1">
          13 imagenes encadenadas → 12 clips de 15s + 3 inserts CapCut = ~3:19 de video fluido
        </p>
        <div className="flex items-center gap-3 mt-3 text-xs">
          <span className="bg-white/20 px-2 py-1 rounded">Foto inicio + Foto final = 15s video</span>
          <span className="bg-white/20 px-2 py-1 rounded">Foto final clip N = Foto inicio clip N+1</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="card text-center py-3">
          <div className="text-xl font-bold text-cyan-600">13</div>
          <div className="text-xs text-gray-500">Imagenes</div>
        </div>
        <div className="card text-center py-3">
          <div className="text-xl font-bold text-teal-600">12</div>
          <div className="text-xs text-gray-500">Clips Seedance</div>
        </div>
        <div className="card text-center py-3">
          <div className="text-xl font-bold text-amber-600">3</div>
          <div className="text-xs text-gray-500">Inserts CapCut</div>
        </div>
        <div className="card text-center py-3">
          <div className="text-xl font-bold text-purple-600">3:19</div>
          <div className="text-xs text-gray-500">Duracion total</div>
        </div>
        <div className="card text-center py-3">
          <div className="text-xl font-bold text-rural-green">{completedCount}/{totalTasks}</div>
          <div className="text-xs text-gray-500">Completado</div>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg">
        {subviews.map(sv => (
          <button key={sv.id} onClick={() => setView(sv.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex-1 min-w-[80px] text-center ${view === sv.id ? 'bg-white shadow text-cyan-700' : 'text-gray-600 hover:text-gray-800'}`}>
            {sv.label}
          </button>
        ))}
      </div>

      {/* ─── VIEW: CLIPS SEEDANCE ─── */}
      {view === 'clips' && (
        <div className="space-y-3">
          <div className="card bg-cyan-50 border border-cyan-200">
            <p className="text-sm text-cyan-700">Cada clip usa <strong>foto inicio + foto final</strong>. Seedance 2 genera 15 segundos de video fluido entre ambas. Haz click en cada clip para ver los detalles y copiar prompts.</p>
          </div>

          {seedanceClips.map(clip => {
            const startImg = seedanceImageChain.find(i => i.id === clip.startImage)
            const endImg = seedanceImageChain.find(i => i.id === clip.endImage)
            const isExpanded = expandedClip === clip.clip
            const isStarClip = clip.name.includes('★')

            return (
              <div key={clip.clip} className={`card border-2 transition ${isStarClip ? 'border-amber-300 bg-amber-50/30' : 'border-gray-100'}`}>
                {/* Clip header */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpandedClip(isExpanded ? null : clip.clip)}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isStarClip ? 'bg-amber-500 text-white' : 'bg-cyan-100 text-cyan-700'}`}>
                    {clip.clip}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-800">{clip.name}</div>
                    <div className="text-xs text-gray-400 flex flex-wrap gap-x-2 gap-y-0.5">
                      <span>{clip.startImage} → {clip.endImage}</span>
                      <span>|</span>
                      <span>{clip.time}</span>
                      <span>|</span>
                      <span className="text-gray-500">{clip.act}</span>
                    </div>
                  </div>
                  <Badge color={
                    clip.act.includes('GANCHO') ? 'bg-blue-100 text-blue-700' :
                    clip.act.includes('PROBLEMA') ? 'bg-gray-200 text-gray-700' :
                    clip.act.includes('GIRO') ? 'bg-amber-100 text-amber-700' :
                    clip.act.includes('SOLUCION') ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                  }>{clip.act}</Badge>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-4">
                    {/* Start + End images */}
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="rounded-lg border-2 border-cyan-200 overflow-hidden">
                        <div className="bg-cyan-50 px-3 py-1.5 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[10px] font-bold">A</span>
                          <span className="font-semibold text-cyan-800 text-xs">FOTO INICIO: {clip.startImage}</span>
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-gray-600 mb-2">{startImg?.name}</p>
                          <div className="bg-gray-50 rounded p-2">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] text-gray-500 font-semibold uppercase">Prompt imagen</span>
                              <button onClick={(e) => { e.stopPropagation(); copyPrompt(startImg?.imagePrompt.prompt, clip.startImage) }}
                                className={`text-[10px] px-2 py-0.5 rounded font-medium ${copiedId === clip.startImage ? 'bg-green-100 text-green-700' : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'}`}>
                                {copiedId === clip.startImage ? 'Copiado!' : 'Copiar'}
                              </button>
                            </div>
                            <p className="text-[11px] text-gray-600 font-mono leading-relaxed line-clamp-4">{startImg?.imagePrompt.prompt}</p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border-2 border-teal-200 overflow-hidden">
                        <div className="bg-teal-50 px-3 py-1.5 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center text-[10px] font-bold">B</span>
                          <span className="font-semibold text-teal-800 text-xs">FOTO FINAL: {clip.endImage}</span>
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-gray-600 mb-2">{endImg?.name}</p>
                          <div className="bg-gray-50 rounded p-2">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] text-gray-500 font-semibold uppercase">Prompt imagen</span>
                              <button onClick={(e) => { e.stopPropagation(); copyPrompt(endImg?.imagePrompt.prompt, clip.endImage) }}
                                className={`text-[10px] px-2 py-0.5 rounded font-medium ${copiedId === clip.endImage ? 'bg-green-100 text-green-700' : 'bg-teal-100 text-teal-700 hover:bg-teal-200'}`}>
                                {copiedId === clip.endImage ? 'Copiado!' : 'Copiar'}
                              </button>
                            </div>
                            <p className="text-[11px] text-gray-600 font-mono leading-relaxed line-clamp-4">{endImg?.imagePrompt.prompt}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transition note */}
                    {endImg?.transitionNote && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <span className="text-xs font-semibold text-amber-700">Nota de transicion: </span>
                        <span className="text-xs text-amber-600">{endImg.transitionNote}</span>
                      </div>
                    )}

                    {/* Seedance prompt */}
                    <div className="rounded-lg border-2 border-purple-200 overflow-hidden">
                      <div className="bg-purple-50 px-4 py-2 flex items-center gap-2">
                        <span className="font-semibold text-purple-800 text-sm">Prompt Seedance 2</span>
                        <Badge color="bg-purple-100 text-purple-700">15 segundos</Badge>
                      </div>
                      <div className="p-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs text-gray-500 font-semibold uppercase">Prompt de movimiento/transicion</span>
                            <button onClick={(e) => { e.stopPropagation(); copyPrompt(clip.seedancePrompt, `sd-${clip.clip}`) }}
                              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${copiedId === `sd-${clip.clip}` ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>
                              {copiedId === `sd-${clip.clip}` ? 'Copiado!' : 'Copiar prompt'}
                            </button>
                          </div>
                          <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap leading-relaxed">{clip.seedancePrompt}</p>
                        </div>
                      </div>
                    </div>

                    {/* Subtitle + mood + sound */}
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Subtitulo</div>
                        <p className="text-sm text-gray-800 font-medium whitespace-pre-wrap">{clip.subtitle}</p>
                        <div className="mt-1">
                          <CopyButton text={clip.subtitle} label="Copiar" />
                        </div>
                      </div>
                      <div className="bg-pink-50 rounded-lg p-3">
                        <div className="text-xs font-semibold text-pink-600 uppercase mb-1">Mood / Emocion</div>
                        <p className="text-xs text-pink-700">{clip.mood}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-xs font-semibold text-blue-600 uppercase mb-1">Sonido</div>
                        <p className="text-xs text-blue-700">{clip.soundDesign}</p>
                      </div>
                    </div>

                    {/* Production note */}
                    {clip.productionNote && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <span className="text-xs font-bold text-red-700">IMPORTANTE: </span>
                        <span className="text-xs text-red-600">{clip.productionNote}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* CapCut inserts */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Inserts CapCut (motion graphics, NO Seedance)</h4>
            {capcutInserts.map(insert => (
              <div key={insert.id} className="card border border-green-200 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge color="bg-green-100 text-green-700">CapCut</Badge>
                  <span className="font-semibold text-sm text-gray-800">{insert.name}</span>
                  <Badge>{insert.duration}</Badge>
                </div>
                <p className="text-xs text-gray-600">{insert.description}</p>
                <p className="text-xs text-gray-400 mt-1">Insertar: {insert.insertAfter}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── VIEW: CADENA DE IMAGENES ─── */}
      {view === 'chain' && (
        <div className="space-y-3">
          <div className="card bg-blue-50 border border-blue-200">
            <h4 className="font-semibold text-blue-800 text-sm">Cadena de 13 imagenes</h4>
            <p className="text-xs text-blue-600 mt-1">Cada imagen es un nodo. Los clips Seedance se forman con pares consecutivos. La imagen final de un clip ES la imagen inicial del siguiente.</p>
          </div>

          {/* Visual chain */}
          <div className="card overflow-x-auto">
            <div className="flex items-center gap-1 min-w-max pb-2">
              {seedanceImageChain.map((img, i) => (
                <div key={img.id} className="flex items-center">
                  <div className={`flex flex-col items-center cursor-pointer group ${expandedImage === img.id ? 'scale-105' : ''}`}
                    onClick={() => setExpandedImage(expandedImage === img.id ? null : img.id)}>
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      img.id === 'SD_05' || img.id === 'SD_06' ? 'bg-amber-100 text-amber-700 border-2 border-amber-400' :
                      i <= 4 ? 'bg-gray-100 text-gray-600 border border-gray-300' :
                      'bg-cyan-100 text-cyan-700 border border-cyan-300'
                    } group-hover:shadow-md`}>
                      {img.id.replace('SD_', '')}
                    </div>
                    <span className="text-[9px] text-gray-500 mt-1 text-center max-w-[60px] leading-tight">{img.name.split(' ').slice(0, 2).join(' ')}</span>
                  </div>
                  {i < seedanceImageChain.length - 1 && (
                    <div className="flex flex-col items-center mx-1">
                      <svg className="w-5 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="text-[8px] text-gray-400">Clip {i + 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Expanded image detail */}
          {expandedImage && (() => {
            const img = seedanceImageChain.find(i => i.id === expandedImage)
            if (!img) return null
            return (
              <div className="card border-2 border-cyan-300">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-cyan-700">{img.id}</span>
                  <span className="font-semibold text-gray-800">{img.name}</span>
                  <Badge color="bg-cyan-100 text-cyan-700">{img.chainRole}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{img.description}</p>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-semibold uppercase">Prompt de imagen</span>
                      <Badge>{img.imagePrompt.tool}</Badge>
                    </div>
                    <button onClick={() => copyPrompt(img.imagePrompt.prompt, img.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${copiedId === img.id ? 'bg-green-100 text-green-700' : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'}`}>
                      {copiedId === img.id ? 'Copiado!' : 'Copiar prompt'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap leading-relaxed">{img.imagePrompt.prompt}</p>
                </div>

                {img.imagePrompt.tips && (
                  <div className="bg-amber-50 rounded-lg p-2 mb-2">
                    <span className="text-xs font-semibold text-amber-700">Tips: </span>
                    <span className="text-xs text-amber-600">{img.imagePrompt.tips}</span>
                  </div>
                )}
                {img.transitionNote && (
                  <div className="bg-purple-50 rounded-lg p-2 mb-2">
                    <span className="text-xs font-semibold text-purple-700">Transicion: </span>
                    <span className="text-xs text-purple-600">{img.transitionNote}</span>
                  </div>
                )}
                <div className="text-xs text-gray-400">
                  Composicion: {img.compositionGuide}
                  {img.basedOn && <span className="ml-2">| Basado en: {img.basedOn}</span>}
                </div>
              </div>
            )
          })()}

          {/* All image prompts quick copy */}
          <div className="card">
            <h4 className="font-semibold text-gray-800 text-sm mb-3">Todos los prompts de imagen</h4>
            <div className="space-y-2">
              {seedanceImageChain.map(img => (
                <div key={img.id} className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs font-bold text-cyan-600 shrink-0 w-12">{img.id}</span>
                  <span className="text-xs text-gray-600 flex-1 line-clamp-1">{img.name} — {img.imagePrompt.tool}</span>
                  <button onClick={() => copyPrompt(img.imagePrompt.prompt, `all-${img.id}`)}
                    className={`text-[10px] px-2 py-0.5 rounded font-medium shrink-0 ${copiedId === `all-${img.id}` ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {copiedId === `all-${img.id}` ? 'OK' : 'Copiar'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card bg-yellow-50 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 text-sm mb-2">Tips Seedance 2</h4>
            <div className="space-y-1.5">
              {seedanceTips.map((tip, i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <span className="text-yellow-600 shrink-0 font-bold">{i + 1}.</span>
                  <span className="text-yellow-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── VIEW: TIMELINE FINAL ─── */}
      {view === 'timeline' && (
        <div className="space-y-4">
          <div className="card bg-purple-50 border border-purple-200">
            <h4 className="font-semibold text-purple-800 text-sm">Timeline Final — 3:19</h4>
            <p className="text-xs text-purple-600 mt-1">Orden de montaje en CapCut. Los clips Seedance van encadenados con cross-dissolve de 0.3s. Los inserts CapCut son motion graphics.</p>
          </div>

          <div className="card">
            <div className="space-y-0">
              {finalTimeline.map((item, i) => {
                const isSeedance = item.type === 'seedance'
                const clip = isSeedance ? seedanceClips.find(c => `Clip ${c.clip}` === item.ref) : null
                return (
                  <div key={i} className={`flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 ${!isSeedance ? 'bg-green-50/50 -mx-4 px-4 rounded' : ''}`}>
                    <span className="text-xs text-gray-400 w-16 shrink-0 font-mono">{item.time}</span>
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isSeedance ? 'bg-cyan-400' : 'bg-green-400'}`} />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-800">{item.name}</span>
                      {clip && <span className="text-xs text-gray-400 ml-2">{clip.startImage} → {clip.endImage}</span>}
                    </div>
                    <Badge color={isSeedance ? 'bg-cyan-100 text-cyan-700' : 'bg-green-100 text-green-700'}>
                      {isSeedance ? 'Seedance' : 'CapCut'}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Audio structure */}
          <div className="card">
            <h4 className="font-semibold text-gray-800 text-sm mb-3">Estructura Musical</h4>
            <div className="space-y-1">
              {audioDesign.music.structure.map((s, i) => (
                <div key={i} className="flex gap-3 py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-400 w-20 shrink-0 font-mono">{s.time}</span>
                  <span className="text-xs text-gray-700">{s.mood}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 bg-blue-50 rounded-lg p-2">
              <span className="text-xs font-semibold text-blue-700">Donde buscar: </span>
              <span className="text-xs text-blue-600">{audioDesign.music.freeSources.join(' | ')}</span>
            </div>
          </div>

          {/* Ambient sounds */}
          <div className="card">
            <h4 className="font-semibold text-gray-800 text-sm mb-3">Sonidos Ambiente por Clip</h4>
            <div className="space-y-1">
              {audioDesign.ambientSounds.layers.map((l, i) => (
                <div key={i} className="flex gap-3 py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-400 w-16 shrink-0">Clip {l.clips}</span>
                  <span className="text-xs text-gray-700 flex-1">{l.sound}</span>
                  <span className="text-[10px] text-gray-400 shrink-0">{l.source}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Production steps */}
          <div className="card">
            <h4 className="font-semibold text-gray-800 text-sm mb-3">Pasos de Produccion</h4>
            <div className="space-y-3">
              {seedanceSteps.map(step => (
                <div key={step.step} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">{step.step}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-800">{step.title}</span>
                      <Badge>{step.time}</Badge>
                    </div>
                    <ul className="mt-1 space-y-0.5">
                      {step.details.map((d, i) => (
                        <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                          <span className="text-gray-400 shrink-0">-</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── VIEW: CHECKLIST ─── */}
      {view === 'checklist' && (
        <div className="space-y-4">
          <div className="card bg-green-50 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-800 text-sm">Checklist de Produccion</h4>
                <p className="text-xs text-green-600 mt-0.5">Marca cada tarea al completarla. Se guarda automaticamente.</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-rural-green">{completedCount}/{totalTasks}</div>
                <div className="text-xs text-gray-500">{Math.round((completedCount / totalTasks) * 100)}%</div>
              </div>
            </div>
            <div className="mt-2 w-full bg-green-200 rounded-full h-2">
              <div className="h-full bg-rural-green rounded-full transition-all"
                style={{ width: `${(completedCount / totalTasks) * 100}%` }} />
            </div>
          </div>

          {['imagenes', 'seedance', 'capcut', 'montaje'].map(phase => {
            const phaseLabels = { imagenes: 'Generar Imagenes', seedance: 'Clips Seedance', capcut: 'Inserts CapCut', montaje: 'Montaje Final' }
            const phaseColors = { imagenes: 'blue', seedance: 'cyan', capcut: 'green', montaje: 'purple' }
            const items = seedanceChecklist.filter(c => c.phase === phase)
            const phaseDone = items.filter(c => checkState[c.task]).length
            const color = phaseColors[phase]

            return (
              <div key={phase} className="card">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className={`font-semibold text-sm text-${color}-700`}>{phaseLabels[phase]}</h4>
                  <span className="text-xs text-gray-400">{phaseDone}/{items.length}</span>
                </div>
                <div className="space-y-1">
                  {items.map(item => (
                    <label key={item.task} className="flex items-center gap-2.5 py-1.5 cursor-pointer hover:bg-gray-50 rounded px-1 -mx-1">
                      <input type="checkbox" checked={!!checkState[item.task]} onChange={() => toggleCheck(item.task)}
                        className="w-4 h-4 rounded border-gray-300 text-rural-green focus:ring-rural-green" />
                      <span className={`text-sm ${checkState[item.task] ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {item.task}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────
export default function VideoProduction() {
  const [activeTab, setActiveTab] = useState('seedance')

  const tabs = [
    { id: 'seedance', label: 'Seedance 2' },
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
      {activeTab === 'seedance' && <SeedanceTab />}
      {activeTab === 'storyboard' && <StoryboardTab />}
      {activeTab === 'cycles' && <CyclesTab />}
      {activeTab === 'tools' && <ToolsTab />}
      {activeTab === 'effects' && <EffectsTab />}
      {activeTab === 'workflow' && <WorkflowTab />}
      {activeTab === 'notes' && <NotesTab />}
    </div>
  )
}
