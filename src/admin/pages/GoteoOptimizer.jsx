import { useState } from 'react'
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'
import { rewards, descriptionSections, rewardSuggestions, descriptionSuggestions, infographicPrompts } from '../../data/goteoContent'

const tabs = ['Recompensas', 'Descripcion', 'Imagenes', 'Infografias', 'Presentacion']

function CopyBtn({ text }) {
  const [ok, setOk] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500) }}
      className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition shrink-0">
      {ok ? 'Copiado!' : 'Copiar'}
    </button>
  )
}

function SuggestionCard({ suggestion, accepted, onAccept, onReject }) {
  const status = accepted[suggestion.id]
  return (
    <div className={`border rounded-lg p-3 text-sm ${status === 'accepted' ? 'border-green-300 bg-green-50/50' : status === 'rejected' ? 'border-gray-200 bg-gray-50 opacity-60' : 'border-amber-200 bg-amber-50/30'}`}>
      <div className="flex items-start gap-2 mb-2">
        <span className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${status === 'accepted' ? 'bg-green-100 text-green-700' : status === 'rejected' ? 'bg-gray-200 text-gray-500' : 'bg-amber-100 text-amber-700'}`}>
          {status === 'accepted' ? 'Aceptado' : status === 'rejected' ? 'Descartado' : 'Sugerencia'}
        </span>
        {suggestion.field && <span className="text-xs text-gray-400">{suggestion.field}{suggestion.index !== undefined ? ` [${suggestion.index + 1}]` : ''}</span>}
      </div>

      <div className="space-y-2">
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Actual:</div>
          <div className="text-xs text-gray-600 bg-red-50 rounded p-1.5 line-through">{suggestion.current}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Propuesta:</div>
          <div className="flex items-start gap-1">
            <div className="text-xs text-gray-800 bg-green-50 rounded p-1.5 flex-1">{suggestion.proposed}</div>
            <CopyBtn text={suggestion.proposed} />
          </div>
        </div>
        {suggestion.note && (
          <div className="text-xs text-blue-600 bg-blue-50 rounded p-1.5">
            {suggestion.note}
          </div>
        )}
      </div>

      {status !== 'accepted' && status !== 'rejected' && (
        <div className="flex gap-2 mt-2">
          <button onClick={() => onAccept(suggestion.id)} className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition">
            Aceptar
          </button>
          <button onClick={() => onReject(suggestion.id)} className="text-xs px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition">
            Descartar
          </button>
        </div>
      )}
    </div>
  )
}

// ─── RECOMPENSAS ───────────────────────────────────────────────
function RewardsTab({ accepted, onAccept, onReject }) {
  const [expanded, setExpanded] = useState(null)
  const acceptedCount = Object.values(accepted).filter(v => v === 'accepted').length
  const totalSuggestions = rewardSuggestions.reduce((s, r) => s + r.suggestions.length, 0)

  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <h3 className="font-bold mb-1">Optimizador de Recompensas</h3>
        <p className="text-sm opacity-90">
          {acceptedCount} de {totalSuggestions} mejoras aceptadas | {Object.values(accepted).filter(v => v === 'accepted').length} cambios pendientes de traducir (ES/CA/PT)
        </p>
      </div>

      {/* Legend */}
      <div className="card flex flex-wrap gap-4 items-center text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-200 rounded"></span> Sugerencia pendiente</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-200 rounded"></span> Aceptado (traducir)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-200 rounded"></span> Descartado</span>
        <span className="ml-auto text-gray-500">Idiomas pendientes: ES, CA, PT</span>
      </div>

      {rewards.map(reward => {
        const sug = rewardSuggestions.find(s => s.rewardId === reward.id)
        const isExpanded = expanded === reward.id

        return (
          <div key={reward.id} className="card border border-gray-100">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : reward.id)}>
              <span className="text-2xl">{reward.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{reward.name}</span>
                  <span className="text-sm font-bold text-rural-green">{reward.amount} EUR</span>
                  {sug && (
                    <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
                      {sug.suggestions.length} mejoras
                    </span>
                  )}
                  {sug && sug.suggestions.every(s => accepted[s.id]) && (
                    <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">Revisado</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{reward.tagline}</p>
              </div>
              <span className="text-gray-400 text-sm">{isExpanded ? '▲' : '▼'}</span>
            </div>

            {isExpanded && (
              <div className="mt-4 space-y-4">
                {/* Current items */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Contenido actual</h4>
                  <ul className="space-y-1">
                    {reward.items.map((item, i) => (
                      <li key={i} className="text-xs text-gray-600 bg-gray-50 rounded p-2">
                        <span className="text-gray-400 mr-1">{i + 1}.</span> {item}
                      </li>
                    ))}
                  </ul>
                  {reward.includesPrevious && (
                    <div className="text-xs text-gray-400 mt-1 italic">+ Incluye todas las recompensas anteriores</div>
                  )}
                </div>

                {/* Suggestions */}
                {sug && (
                  <div>
                    <h4 className="text-xs font-semibold text-amber-600 uppercase mb-2">Propuestas de mejora</h4>
                    <div className="space-y-2">
                      {sug.suggestions.map(s => (
                        <SuggestionCard key={s.id} suggestion={s} accepted={accepted} onAccept={onAccept} onReject={onReject} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Image prompt */}
                {sug && sug.imagePrompt && (
                  <div>
                    <h4 className="text-xs font-semibold text-purple-600 uppercase mb-2">Prompt para mejorar imagen</h4>
                    <div className="flex items-start gap-2">
                      <div className="text-xs text-purple-700 bg-purple-50 rounded p-2 flex-1 font-mono">
                        {sug.imagePrompt}
                      </div>
                      <CopyBtn text={sug.imagePrompt} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Usar en: Higgsfield / Kling 3.0 / Nano Banana Pro / Midjourney</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── DESCRIPCION ───────────────────────────────────────────────
function DescriptionTab({ accepted, onAccept, onReject }) {
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <h3 className="font-bold mb-1">Optimizador de Descripcion</h3>
        <p className="text-sm opacity-90">Mejoras puntuales al texto de Goteo. Acepta y copia a mano en el panel de Goteo.</p>
      </div>

      {descriptionSections.map(section => {
        const sug = descriptionSuggestions.find(s => s.sectionId === section.id)
        const isExpanded = expanded === section.id

        return (
          <div key={section.id} className="card border border-gray-100">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : section.id)}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{section.title}</span>
                  {section.maxLength && <span className="text-xs text-gray-400">max {section.maxLength} chars</span>}
                  {sug && <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">{sug.suggestions.length} mejoras</span>}
                </div>
                {section.hint && <p className="text-xs text-gray-500">{section.hint}</p>}
              </div>
              <span className="text-gray-400 text-sm">{isExpanded ? '▲' : '▼'}</span>
            </div>

            {isExpanded && (
              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase">Texto actual</h4>
                    <CopyBtn text={section.current} />
                    {section.maxLength && (
                      <span className={`text-xs ${section.current.length > section.maxLength ? 'text-red-500' : 'text-gray-400'}`}>
                        {section.current.length}/{section.maxLength}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 bg-gray-50 rounded p-3 whitespace-pre-line max-h-60 overflow-auto">
                    {section.current}
                  </div>
                </div>

                {sug && (
                  <div>
                    <h4 className="text-xs font-semibold text-amber-600 uppercase mb-2">Propuestas de mejora</h4>
                    <div className="space-y-2">
                      {sug.suggestions.map(s => (
                        <SuggestionCard key={s.id} suggestion={s} accepted={accepted} onAccept={onAccept} onReject={onReject} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── IMAGENES ──────────────────────────────────────────────────
function ImagesTab() {
  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <h3 className="font-bold mb-1">Prompts para Imagenes de Recompensas</h3>
        <p className="text-sm opacity-90">Genera mejores imagenes para cada recompensa con Higgsfield / Kling 3.0 / Nano Banana Pro</p>
      </div>

      <div className="space-y-3">
        {rewardSuggestions.map(rs => {
          const reward = rewards.find(r => r.id === rs.rewardId)
          if (!reward || !rs.imagePrompt) return null
          return (
            <div key={rs.rewardId} className="card border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{reward.emoji}</span>
                <div>
                  <span className="font-semibold text-gray-800">{reward.name}</span>
                  <span className="text-sm text-rural-green ml-2">{reward.amount} EUR</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {/* Current image */}
                <div>
                  <div className="text-xs text-gray-500 mb-1">Imagen actual en Goteo:</div>
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <img
                      src={`/goteo-preview/Rural Makers Tejiendo Facenderas21-3-26_files/${reward.image}`}
                      alt={reward.name}
                      className="max-h-40 mx-auto rounded"
                      onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<div class="text-xs text-gray-400 py-8">${reward.image}</div>` }}
                    />
                  </div>
                </div>

                {/* Prompt */}
                <div>
                  <div className="text-xs text-gray-500 mb-1">Prompt para nueva imagen:</div>
                  <div className="flex items-start gap-1">
                    <div className="text-xs font-mono text-purple-700 bg-purple-50 rounded p-2 flex-1 max-h-40 overflow-auto">
                      {rs.imagePrompt}
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <CopyBtn text={rs.imagePrompt} />
                    <CopyBtn text={`Higgsfield: ${rs.imagePrompt}`} />
                    <span className="text-xs text-gray-400 ml-1">Kling 3.0 / Nano Banana Pro</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── INFOGRAFIAS ───────────────────────────────────────────────
function InfographicsTab() {
  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-teal-600 to-emerald-700 text-white">
        <h3 className="font-bold mb-1">Prompts para Infografias</h3>
        <p className="text-sm opacity-90">Infografias para la campaña, landing y video. Usar con Nano Banana Pro / Higgsfield / Canva AI</p>
      </div>

      {infographicPrompts.map(ig => (
        <div key={ig.id} className="card border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-gray-800">{ig.title}</h4>
          </div>
          <div className="flex items-start gap-2">
            <div className="text-xs font-mono text-teal-700 bg-teal-50 rounded p-3 flex-1">{ig.prompt}</div>
            <CopyBtn text={ig.prompt} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── PRESENTACION ──────────────────────────────────────────────
function PresentationTab() {
  const text = `RURAL MAKERS: TEJIENDO FACENDERAS
La red que da vida a los pueblos

Imagina una red donde cada nudo es una persona, cada hilo una accion compartida, y cada tejido una comunidad mas fuerte.

Rural Makers nace para eso: conectar personas, proyectos y territorios rurales a traves de las facenderas — esos encuentros donde se coopera, se aprende y se construye futuro.

Y tu puedes ser parte desde hoy. Cada aportacion es una semilla:

🌿 SEMILLA DEL CAMBIO (13€) — Haz brotar la red. Con tu llavero 3D y tu pasaporte Rural Maker, ya eres parte.

🌻 SUPERRURAL MAKER (30€) — Multiplica la vida en los pueblos. Lleva contigo el libro "Saberes de las Facenderas".

🤖 RISALEGRIA (50€) — Inteligencia artificial al servicio del territorio. Tu asesoria IA personalizada para impulsar tu proyecto.

😄 EL ARTE DE SUPERARTE (75€) — Riete, renovate y reconecta. Risoterapia creativa y espectaculo en vivo.

🌳 RUTA DEL VALLE BELLO (100€) — Sumergete en la naturaleza. Bano de bosque, risas y productos locales km0.

🤝 TEJEDORA DE ENCUENTROS (200€) — Teje la red. Haces posible las jornadas donde nacen nuevas facenderas.

🌾 IMPULSORA DE FACENDERA (300€) — Activa una facendera con tu nombre. Tu eliges el tema, nosotros la hacemos realidad.

🌼 SEMBRADORA (1.000€) — Siembra raices en el Valle Bello. 10m2 de jardin, un arbol y tu nombre como Guardian/a.

🌾 HILANDERA (2.000€) — Tu nombre une caminos. 4 facenderas, 20m2 de jardin, tu programa facendero propio.

🌻 ECO DEL VALLE (4.000€) — Tu legado permanente. 10 facenderas, 50m2, un eco que resuena en la historia.

---

De semilla a bosque. De accion a red. De persona a comunidad.

Rural Makers no es solo una app. Es un movimiento que teje tradicion, innovacion y cooperacion para regenerar el mundo rural desde Leon al mundo.

Cada facendera es una rama. Cada rama da frutos. Cada fruto contiene semillas de nuevas facenderas.

¿Nos ayudas a tejer?

ruralmakers.net | Asociacion Indira | Goteo.org`

  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-rural-green to-rural-green-dark text-white">
        <h3 className="font-bold mb-1">Texto de Presentacion con Recompensas</h3>
        <p className="text-sm opacity-90">
          Un texto narrativo que integra todas las recompensas de forma natural. Util para video, landing, pitch y redes sociales.
        </p>
      </div>

      <div className="card border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <h4 className="text-sm font-semibold text-gray-700">Texto completo</h4>
          <CopyBtn text={text} />
          <span className="text-xs text-gray-400 ml-auto">{text.split(/\s+/).length} palabras</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed max-h-[70vh] overflow-auto">
          {text}
        </div>
      </div>

      <div className="card bg-blue-50 border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">Usos de este texto</h4>
        <ul className="space-y-1 text-xs text-blue-700">
          <li>- <strong>Video de Goteo:</strong> Usar como guion base para la locucion del video de presentacion</li>
          <li>- <strong>Landing Base44:</strong> Seccion de recompensas con este copy</li>
          <li>- <strong>Pitch en vivo:</strong> Estructura de presentacion ante inversores o instituciones</li>
          <li>- <strong>Redes sociales:</strong> Fragmentar en posts individuales por recompensa</li>
          <li>- <strong>Newsletter:</strong> Cuerpo del email de lanzamiento de campaña</li>
        </ul>
      </div>

      <div className="card bg-green-50 border border-green-200">
        <h4 className="text-sm font-semibold text-green-800 mb-2">Posts por recompensa (copiar individualmente)</h4>
        <div className="space-y-2">
          {rewards.map(r => {
            const post = `${r.emoji} ${r.name} (${r.amount}€)\n${r.tagline}\n\n#RuralMakers #TejiendoFacenderas #Goteo #CrowdfundingRural`
            return (
              <div key={r.id} className="flex items-start gap-2 p-2 bg-white rounded border border-green-100">
                <div className="text-xs text-gray-700 flex-1 whitespace-pre-line">{post}</div>
                <CopyBtn text={post} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ──────────────────────────────────────────────────────
export default function GoteoOptimizer() {
  const [tab, setTab] = useState(0)
  const [accepted, setAccepted] = useLocalStorage('rm-optimizer-accepted', {})

  const onAccept = (id) => setAccepted({ ...accepted, [id]: 'accepted' })
  const onReject = (id) => setAccepted({ ...accepted, [id]: 'rejected' })

  const acceptedCount = Object.values(accepted).filter(v => v === 'accepted').length

  const renderTab = () => {
    switch (tab) {
      case 0: return <RewardsTab accepted={accepted} onAccept={onAccept} onReject={onReject} />
      case 1: return <DescriptionTab accepted={accepted} onAccept={onAccept} onReject={onReject} />
      case 2: return <ImagesTab />
      case 3: return <InfographicsTab />
      case 4: return <PresentationTab />
      default: return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-800">Optimizador Goteo</h2>
        {acceptedCount > 0 && (
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
            {acceptedCount} cambios aceptados — pendiente traducir ES/CA/PT
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={`tab-btn ${tab === i ? 'active' : ''}`}>
            {t}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  )
}
