import { useState } from 'react'
import { FUNDING_MIN, FUNDING_OPT } from '../../shared/lib/constants'
import {
  projectData, similarProjects, rewardsStats, communityUsers,
  activeCalls, sdgsData, reportsSummary, reportsProjects
} from '../../data/goteoMockData'

const tabs = ['Monitor', 'Benchmarking', 'Recompensas', 'Comunidad', 'Convocatorias', 'Impacto ODS', 'Endpoints', 'API Tester']

// ─── SHARED COMPONENTS ─────────────────────────────────────────
function ApiStatus() {
  return (
    <div className="card bg-amber-50 border border-amber-200 text-sm">
      <div className="flex items-start gap-2">
        <span className="text-amber-500 mt-0.5">!</span>
        <div>
          <span className="font-semibold text-amber-800">API con Cloudflare Challenge</span>
          <p className="text-xs text-amber-700 mt-1">
            La API de Goteo (api.goteo.org) tiene proteccion Cloudflare que bloquea acceso desde servidor.
            Los datos mostrados son realistas basados en la estructura de la API.
            Para activar datos en vivo: contactar a Goteo para whitelistear tu IP o conseguir token sin Cloudflare.
          </p>
        </div>
      </div>
    </div>
  )
}

function BarChart({ value, max, color = 'bg-rural-green', height = 'h-4' }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className={`w-full bg-gray-100 rounded-full ${height} overflow-hidden`}>
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  )
}

// ─── TAB: MONITOR ──────────────────────────────────────────────
function MonitorTab() {
  const raised = projectData.amount
  const pctMin = ((raised / FUNDING_MIN) * 100).toFixed(1)
  const pctOpt = ((raised / FUNDING_OPT) * 100).toFixed(1)

  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-rural-green to-rural-green-dark text-white">
        <h3 className="font-bold mb-1">Monitor en Tiempo Real</h3>
        <p className="text-sm opacity-90">
          Seguimiento automatico via <code className="bg-white/20 px-1 rounded text-xs">GET /projects/{'{id}'}</code> +
          <code className="bg-white/20 px-1 rounded text-xs ml-1">GET /invests/</code>
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-xs text-gray-500 uppercase mb-1">Recaudado</div>
          <div className="text-2xl font-bold text-rural-green">{raised.toLocaleString('es')} EUR</div>
          <div className="text-xs text-gray-400">{pctOpt}% del optimo</div>
        </div>
        <div className="card text-center">
          <div className="text-xs text-gray-500 uppercase mb-1">Cofinanciadores</div>
          <div className="text-2xl font-bold text-gray-800">{projectData.investors}</div>
        </div>
        <div className="card text-center">
          <div className="text-xs text-gray-500 uppercase mb-1">Objetivo Minimo</div>
          <div className="text-2xl font-bold text-amber-600">{FUNDING_MIN.toLocaleString('es')} EUR</div>
          <div className="text-xs text-gray-400">{pctMin}% alcanzado</div>
        </div>
        <div className="card text-center">
          <div className="text-xs text-gray-500 uppercase mb-1">Estado</div>
          <div className="text-2xl font-bold text-blue-600">Editandose</div>
        </div>
      </div>

      <div className="card">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Progreso</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Hacia minimo ({FUNDING_MIN.toLocaleString('es')} EUR)</span>
              <span className="text-amber-600 font-medium">{pctMin}%</span>
            </div>
            <BarChart value={raised} max={FUNDING_MIN} color="bg-amber-500" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Hacia optimo ({FUNDING_OPT.toLocaleString('es')} EUR)</span>
              <span className="text-rural-green font-medium">{pctOpt}%</span>
            </div>
            <BarChart value={raised} max={FUNDING_OPT} />
          </div>
        </div>
      </div>

      <div className="card bg-blue-50 border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">Endpoints usados</h4>
        <div className="space-y-1 text-xs font-mono text-blue-700">
          <div><span className="text-blue-500">GET</span> /projects/camino-rural-tejiendo-facenderas → datos del proyecto</div>
          <div><span className="text-blue-500">GET</span> /projects/camino-rural-tejiendo-facenderas/donors/ → lista de donantes</div>
          <div><span className="text-blue-500">GET</span> /invests/?project=camino-rural-tejiendo-facenderas → inversiones detalladas</div>
        </div>
        <p className="text-xs text-blue-600 mt-2">Implementado en: useGoteoApi.js (polling cada 5 min)</p>
      </div>
    </div>
  )
}

// ─── TAB: BENCHMARKING ─────────────────────────────────────────
function BenchmarkingTab() {
  const [sortBy, setSortBy] = useState('amount')
  const sorted = [...similarProjects].sort((a, b) => b[sortBy] - a[sortBy])

  const avgAmount = Math.round(sorted.reduce((s, p) => s + p.amount, 0) / sorted.length)
  const avgInvestors = Math.round(sorted.reduce((s, p) => s + p.investors, 0) / sorted.length)
  const successRate = Math.round((sorted.filter(p => p.success).length / sorted.length) * 100)

  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <h3 className="font-bold mb-1">Benchmarking: Proyectos Similares</h3>
        <p className="text-sm opacity-90">
          Analisis de proyectos rurales/sociales en Goteo para optimizar tu campana.
          Via <code className="bg-white/20 px-1 rounded text-xs">GET /projects/?category=Social</code> +
          <code className="bg-white/20 px-1 rounded text-xs ml-1">GET /reports/projects/</code>
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-xs text-gray-500 uppercase mb-1">Media recaudada</div>
          <div className="text-xl font-bold text-indigo-600">{avgAmount.toLocaleString('es')} EUR</div>
          <div className={`text-xs ${FUNDING_MIN <= avgAmount ? 'text-green-600' : 'text-amber-600'}`}>
            Tu minimo: {FUNDING_MIN.toLocaleString('es')} EUR {FUNDING_MIN <= avgAmount ? '(alcanzable)' : '(por encima de media)'}
          </div>
        </div>
        <div className="card text-center">
          <div className="text-xs text-gray-500 uppercase mb-1">Media donantes</div>
          <div className="text-xl font-bold text-indigo-600">{avgInvestors}</div>
          <div className="text-xs text-gray-400">por proyecto similar</div>
        </div>
        <div className="card text-center">
          <div className="text-xs text-gray-500 uppercase mb-1">Tasa de exito</div>
          <div className="text-xl font-bold text-green-600">{successRate}%</div>
          <div className="text-xs text-gray-400">alcanzan minimo</div>
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex gap-2 items-center">
        <span className="text-xs text-gray-500">Ordenar por:</span>
        {[['amount', 'Recaudado'], ['investors', 'Donantes']].map(([key, label]) => (
          <button key={key} onClick={() => setSortBy(key)}
            className={`text-xs px-2 py-1 rounded ${sortBy === key ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Projects list */}
      <div className="space-y-2">
        {sorted.map((p, i) => (
          <div key={p.id} className="card border border-gray-100 p-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-5 text-right font-mono">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-800 truncate">{p.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${p.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {p.success ? 'Exitoso' : 'No alcanzo'}
                  </span>
                  <span className="text-xs text-gray-400">{p.location}</span>
                </div>
                <BarChart value={p.amount} max={Math.max(...sorted.map(x => x.amount))} height="h-2" color={p.success ? 'bg-indigo-500' : 'bg-red-400'} />
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-gray-800">{p.amount.toLocaleString('es')} EUR</div>
                <div className="text-xs text-gray-400">{p.investors} donantes</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-green-50 border border-green-200">
        <h4 className="text-sm font-semibold text-green-800 mb-2">Conclusiones para Rural Makers</h4>
        <ul className="space-y-1 text-xs text-green-700">
          <li>- Tu minimo (10.700 EUR) esta por debajo de la media (buena senal, alcanzable)</li>
          <li>- Necesitaras ~190 donantes para alcanzar el minimo (media del sector)</li>
          <li>- Los proyectos rurales exitosos suelen tener muy buen storytelling en video</li>
          <li>- Los que fallan suelen tener recompensas poco atractivas o sin comunidad previa</li>
          <li>- Recomendacion: conseguir 50 compromisos antes de lanzar (amigos, familia, contactos)</li>
        </ul>
      </div>

      {/* Category stats */}
      <div className="card">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Estadisticas por Categoria en Goteo</h4>
        <div className="space-y-2">
          {reportsProjects.by_category.map(cat => (
            <div key={cat.category} className="flex items-center gap-3">
              <span className={`text-xs w-20 text-right ${cat.category === 'Social' ? 'font-bold text-indigo-700' : 'text-gray-600'}`}>
                {cat.category}
              </span>
              <div className="flex-1">
                <BarChart value={cat.count} max={reportsProjects.by_category[0].count} height="h-3" color={cat.category === 'Social' ? 'bg-indigo-500' : 'bg-gray-300'} />
              </div>
              <span className="text-xs text-gray-500 w-32 text-right">
                {cat.count} proy. | {cat.success_rate}% exito | ~{cat.avg_amount.toLocaleString('es')} EUR
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-indigo-600 mt-2 font-medium">
          Tu categoria "Social" tiene la mayor tasa de exito (74.2%) y la media mas alta de recaudacion.
        </p>
      </div>
    </div>
  )
}

// ─── TAB: RECOMPENSAS ──────────────────────────────────────────
function RewardsTab() {
  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <h3 className="font-bold mb-1">Analisis de Recompensas Ganadoras</h3>
        <p className="text-sm opacity-90">
          Que recompensas funcionan mejor en Goteo y como optimizar las tuyas.
          Via <code className="bg-white/20 px-1 rounded text-xs">GET /reports/rewards/</code>
        </p>
      </div>

      <div className="space-y-3">
        {rewardsStats.map((range, i) => (
          <div key={i} className="card border border-gray-100">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-800">{range.range}</h4>
                <p className="text-xs text-gray-500">Mejor recompensa tipo: {range.bestReward}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                {range.pctTotal}% del total
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="bg-gray-50 rounded p-2 text-center">
                <div className="text-lg font-bold text-gray-800">{range.avgDonors}</div>
                <div className="text-xs text-gray-500">donantes medios</div>
              </div>
              <div className="bg-gray-50 rounded p-2 text-center">
                <div className="text-lg font-bold text-gray-800">{range.pctTotal}%</div>
                <div className="text-xs text-gray-500">del total recaudado</div>
              </div>
              <div className="bg-gray-50 rounded p-2 text-center">
                <div className="text-lg font-bold text-gray-800">{range.avgConversion}%</div>
                <div className="text-xs text-gray-500">conversion</div>
              </div>
            </div>

            <BarChart value={range.avgConversion} max={100} height="h-2" color="bg-amber-500" />

            <div className="mt-2 text-xs bg-amber-50 rounded p-2 text-amber-800">
              <span className="font-semibold">Consejo para Rural Makers:</span> {range.tip}
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-green-50 border border-green-200">
        <h4 className="text-sm font-semibold text-green-800 mb-2">Estrategia de recompensas recomendada</h4>
        <ul className="space-y-1 text-xs text-green-700">
          <li>- El 50% de la recaudacion viene de recompensas de 1-30 EUR: asegurar que sean irresistibles</li>
          <li>- La conversion cae drasticamente a partir de 100 EUR: enfocar esfuerzo en las baratas</li>
          <li>- Recompensas con "experiencia" convierten mejor que solo "producto fisico"</li>
          <li>- Anadir una opcion de "donacion libre" sin recompensa (muchos donantes la prefieren)</li>
          <li>- Los early birds con descuento generan urgencia en las primeras 48h</li>
        </ul>
      </div>
    </div>
  )
}

// ─── TAB: COMUNIDAD ────────────────────────────────────────────
function CommunityTab() {
  const [filter, setFilter] = useState('all')
  const [radius, setRadius] = useState(100)

  const filtered = communityUsers.filter(u => {
    if (filter === 'all') return true
    return u.interests.includes(filter)
  })

  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-teal-600 to-cyan-700 text-white">
        <h3 className="font-bold mb-1">Explorador de Comunidad Goteo</h3>
        <p className="text-sm opacity-90">
          Encuentra donantes y colaboradores potenciales cerca de Leon.
          Via <code className="bg-white/20 px-1 rounded text-xs">GET /users/?location=42.73,-5.93,{'{radio}'}</code>
        </p>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap items-center gap-3">
        <span className="text-xs text-gray-500">Filtrar por interes:</span>
        {['all', 'Rural', 'Social', 'Technology', 'Education', 'Culture'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-2 py-1 rounded ${filter === f ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`}>
            {f === 'all' ? 'Todos' : f}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-500">Radio:</span>
          <select value={radius} onChange={e => setRadius(Number(e.target.value))}
            className="text-xs border border-gray-200 rounded px-2 py-1">
            <option value={50}>50 km</option>
            <option value={100}>100 km</option>
            <option value={200}>200 km</option>
            <option value={500}>500 km</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-xl font-bold text-teal-600">{filtered.length}</div>
          <div className="text-xs text-gray-500">usuarios encontrados</div>
        </div>
        <div className="card text-center">
          <div className="text-xl font-bold text-teal-600">
            {filtered.reduce((s, u) => s + u.projects_supported, 0)}
          </div>
          <div className="text-xs text-gray-500">proyectos apoyados en total</div>
        </div>
        <div className="card text-center">
          <div className="text-xl font-bold text-teal-600">
            {filtered.reduce((s, u) => s + u.amount_donated, 0).toLocaleString('es')} EUR
          </div>
          <div className="text-xs text-gray-500">donados en total</div>
        </div>
      </div>

      {/* Users list */}
      <div className="card">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Potenciales colaboradores ({filtered.length})
        </h4>
        <div className="space-y-2">
          {filtered.map(u => (
            <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
              <div className="w-9 h-9 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800">{u.name}</div>
                <div className="text-xs text-gray-500">{u.location} | {u.projects_supported} proyectos apoyados</div>
              </div>
              <div className="flex flex-wrap gap-1 shrink-0">
                {u.interests.map(int => (
                  <span key={int} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{int}</span>
                ))}
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-teal-600">{u.amount_donated} EUR</div>
                <div className="text-xs text-gray-400">donados</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-teal-50 border border-teal-200">
        <h4 className="text-sm font-semibold text-teal-800 mb-2">Como usar esta informacion</h4>
        <ul className="space-y-1 text-xs text-teal-700">
          <li>- Los usuarios con interes "Rural" + "Social" son tu audiencia perfecta</li>
          <li>- Los que han apoyado 10+ proyectos son "super donantes" - contactar directamente</li>
          <li>- Buscar usuarios en Leon, Zamora, Palencia, Asturias (proximidad)</li>
          <li>- Preparar mensajes personalizados segun sus intereses</li>
          <li>- Con datos reales, podrias exportar la lista para difusion targetizada</li>
        </ul>
      </div>
    </div>
  )
}

// ─── TAB: CONVOCATORIAS ────────────────────────────────────────
function CallsTab() {
  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-purple-600 to-violet-700 text-white">
        <h3 className="font-bold mb-1">Convocatorias y Matchers (Multiplicadores)</h3>
        <p className="text-sm opacity-90">
          Un matcher puede DOBLAR cada euro que recibes. Estas convocatorias son tu arma secreta.
          Via <code className="bg-white/20 px-1 rounded text-xs">GET /calls/</code> +
          <code className="bg-white/20 px-1 rounded text-xs ml-1">GET /matchers/</code>
        </p>
      </div>

      <div className="card bg-purple-50 border border-purple-200">
        <h4 className="text-sm font-semibold text-purple-800 mb-1">Que es un Matcher?</h4>
        <p className="text-xs text-purple-700">
          Un matcher es una entidad (institucion, empresa, fundacion) que aporta fondos paralelos.
          Si tu proyecto esta en un matcher 1:1, por cada euro que dona alguien, el matcher pone otro euro.
          Un matcher 1:2 pone 2 EUR por cada 1 EUR donado. <strong>Esto puede duplicar o triplicar tu recaudacion.</strong>
        </p>
      </div>

      <div className="space-y-3">
        {activeCalls.map((call, i) => (
          <div key={call.id} className={`card border ${call.status === 'closing' ? 'border-red-300 bg-red-50/20' : 'border-purple-200'}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-800">{call.name}</h4>
                  {call.status === 'closing' && <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full animate-pulse">Cierra pronto!</span>}
                  {call.status === 'open' && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Abierta</span>}
                </div>
                <p className="text-xs text-gray-500 mt-1">{call.description}</p>
              </div>
              <span className="text-lg font-bold text-purple-600 shrink-0">{call.multiplier}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="bg-gray-50 rounded p-2 text-center">
                <div className="text-sm font-bold text-gray-800">{call.budget.toLocaleString('es')} EUR</div>
                <div className="text-xs text-gray-500">Presupuesto</div>
              </div>
              <div className="bg-gray-50 rounded p-2 text-center">
                <div className="text-sm font-bold text-gray-800">{(call.budget - call.matched).toLocaleString('es')} EUR</div>
                <div className="text-xs text-gray-500">Disponible</div>
              </div>
              <div className="bg-gray-50 rounded p-2 text-center">
                <div className="text-sm font-bold text-gray-800">{call.projects}</div>
                <div className="text-xs text-gray-500">Proyectos</div>
              </div>
              <div className="bg-gray-50 rounded p-2 text-center">
                <div className="text-sm font-bold text-gray-800">{call.deadline}</div>
                <div className="text-xs text-gray-500">Fecha limite</div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs bg-green-50 rounded p-2">
              <span className="text-green-600 font-bold shrink-0">Compatible:</span>
              <span className="text-green-700">{call.reason}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-green-50 border border-green-200">
        <h4 className="text-sm font-semibold text-green-800 mb-2">Plan de accion</h4>
        <ol className="space-y-1 text-xs text-green-700">
          <li>1. <strong>Urgente:</strong> "Contra la Espana Vaciada" cierra 2026-04-01. Postular YA.</li>
          <li>2. "Matchfunding Rural" es el mas directo para Rural Makers (1:1, enfoque rural)</li>
          <li>3. "Innovacion Social CyL" tiene el mejor multiplicador (1:1.5) y es de tu comunidad</li>
          <li>4. "Tech4Good Europa" ofrece 1:2 - podria triplicar cada aportacion</li>
          <li>5. Postular a varias a la vez - no son excluyentes si los requisitos lo permiten</li>
        </ol>
      </div>
    </div>
  )
}

// ─── TAB: ODS ──────────────────────────────────────────────────
function OdsTab() {
  const applicable = sdgsData.filter(s => s.applicable)

  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-blue-700 to-sky-600 text-white">
        <h3 className="font-bold mb-1">Mapa de Impacto ODS</h3>
        <p className="text-sm opacity-90">
          Alinea Rural Makers con los Objetivos de Desarrollo Sostenible de la ONU.
          Via <code className="bg-white/20 px-1 rounded text-xs">GET /sdgs/</code> +
          <code className="bg-white/20 px-1 rounded text-xs ml-1">GET /footprints/</code>
        </p>
      </div>

      <div className="card text-center">
        <div className="text-3xl font-bold text-blue-600">{applicable.length} de 17</div>
        <div className="text-sm text-gray-500">ODS aplicables a Rural Makers</div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {sdgsData.map(ods => (
          <div key={ods.id} className={`card border ${ods.applicable ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 opacity-60'}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{ods.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">ODS {ods.id}</span>
                  {ods.applicable && <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">Aplica</span>}
                </div>
                <h4 className="text-sm font-semibold text-gray-800">{ods.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{ods.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-blue-50 border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">Como usar esto en la campaña</h4>
        <ul className="space-y-1 text-xs text-blue-700">
          <li>- Incluir los ODS en la descripcion de Goteo (da credibilidad institucional)</li>
          <li>- Crear una seccion "Impacto" en la landing con los iconos ODS</li>
          <li>- Mencionarlos en el video: "Rural Makers contribuye a 7 ODS de la ONU"</li>
          <li>- Las convocatorias y matchers valoran la alineacion con ODS</li>
          <li>- Ideal para presentarse a instituciones y conseguir apoyo formal</li>
        </ul>
      </div>
    </div>
  )
}

// ─── TAB: ENDPOINTS ────────────────────────────────────────────
const endpoints = [
  {
    category: 'Proyecto (tu campaña)',
    description: 'Acceso a toda la informacion de tu proyecto y sus donantes',
    items: [
      { method: 'GET', path: '/projects/{id}', desc: 'Datos completos del proyecto', params: 'lang', returns: 'id, name, amount, minimum, optimum, investors, status, date_created, rewards[], costs[]', superpower: 'Monitor', connection: 'Usado en DashboardHome para mostrar recaudacion y estado en tiempo real' },
      { method: 'GET', path: '/projects/{id}/donors/', desc: 'Lista de donantes', params: 'page, limit', returns: 'Array de {id, name, amount, date, anonymous}', superpower: 'Monitor', connection: 'Permite agradecer donantes, analizar patron de donaciones, segmentar' },
      { method: 'GET', path: '/projects/', desc: 'Buscar proyectos', params: 'page, limit, category, location, lang', returns: 'Array de proyectos con datos basicos', superpower: 'Benchmarking', connection: 'Buscar proyectos similares por categoria o ubicacion para comparar' },
    ],
  },
  {
    category: 'Inversiones (donaciones)',
    description: 'Tracking detallado de cada aportacion a tu proyecto',
    items: [
      { method: 'GET', path: '/invests/', desc: 'Listar inversiones', params: 'page, limit, project, user, from_date, to_date', returns: 'Array de {id, amount, user, project, date, reward, status}', superpower: 'Monitor', connection: 'Filtrar por tu proyecto para ver historial de donaciones. Detectar picos de actividad.' },
      { method: 'GET', path: '/invests/{id}', desc: 'Detalle de inversion', params: '', returns: 'Inversion individual con todos los campos', superpower: 'Monitor', connection: 'Ver detalles de una aportacion especifica' },
    ],
  },
  {
    category: 'Reportes (analytics de Goteo)',
    description: 'Estadisticas agregadas de toda la plataforma Goteo',
    items: [
      { method: 'GET', path: '/reports/summary/', desc: 'Resumen global', params: 'from_date, to_date, category, location', returns: 'total proyectos, exitos, dinero total, media, donantes...', superpower: 'Benchmarking', connection: 'Datos globales para contextualizar tu campaña. "De X proyectos en Goteo, Y% tienen exito"' },
      { method: 'GET', path: '/reports/projects/', desc: 'Stats de proyectos', params: 'from_date, to_date, category, location', returns: 'Desglose por categoria: count, success_rate, avg_amount', superpower: 'Benchmarking', connection: 'Saber que categoria funciona mejor y donde posicionar Rural Makers' },
      { method: 'GET', path: '/reports/rewards/', desc: 'Stats de recompensas', params: 'from_date, to_date, category', returns: 'Distribucion por rango, conversion, favoritas', superpower: 'Recompensas', connection: 'Optimizar tus recompensas basandote en lo que funciona en Goteo' },
      { method: 'GET', path: '/reports/community/', desc: 'Stats de comunidad', params: 'from_date, to_date, location', returns: 'media colaboradores, donantes, perfil de la comunidad', superpower: 'Comunidad', connection: 'Entender quien dona en Goteo: perfil, frecuencia, cantidades medias' },
      { method: 'GET', path: '/reports/money/', desc: 'Stats de dinero', params: 'from_date, to_date, category, location', returns: 'Flujo de dinero, medias, totales por periodo', superpower: 'Benchmarking', connection: 'Cuanto dinero se mueve en Goteo, tendencias temporales, estacionalidad' },
    ],
  },
  {
    category: 'Usuarios',
    description: 'Buscar y analizar usuarios de la plataforma Goteo',
    items: [
      { method: 'GET', path: '/users/', desc: 'Buscar usuarios', params: 'page, limit, location, lang', returns: 'Array de {id, name, location, projects_supported}', superpower: 'Comunidad', connection: 'Encontrar potenciales donantes por ubicacion. Filtrar por Leon y alrededores.' },
      { method: 'GET', path: '/users/{id}', desc: 'Detalle de usuario', params: 'lang', returns: 'Perfil completo con proyectos apoyados y creados', superpower: 'Comunidad', connection: 'Analizar "super donantes" para contacto directo' },
    ],
  },
  {
    category: 'Convocatorias y Matchers',
    description: 'Multiplicadores que doblan (o triplican) tus donaciones',
    items: [
      { method: 'GET', path: '/calls/', desc: 'Convocatorias activas', params: 'page, limit, lang', returns: 'Array de convocatorias con presupuesto, estado, plazo', superpower: 'Convocatorias', connection: 'Listar convocatorias abiertas compatibles con Rural Makers' },
      { method: 'GET', path: '/calls/{id}', desc: 'Detalle convocatoria', params: 'lang', returns: 'Todos los campos + requisitos', superpower: 'Convocatorias', connection: 'Ver requisitos exactos antes de postular' },
      { method: 'GET', path: '/calls/{id}/projects/', desc: 'Proyectos en convocatoria', params: 'page, limit', returns: 'Proyectos que participan', superpower: 'Convocatorias', connection: 'Ver la "competencia" dentro de cada convocatoria' },
      { method: 'GET', path: '/matchers/', desc: 'Matchers activos', params: 'page, limit, lang', returns: 'Multiplicadores disponibles', superpower: 'Convocatorias', connection: 'Encontrar matchers que doblen cada euro donado a tu proyecto' },
      { method: 'GET', path: '/matchers/{id}/projects/', desc: 'Proyectos en matcher', params: 'page, limit', returns: 'Proyectos beneficiados por el matcher', superpower: 'Convocatorias', connection: 'Ver que proyectos ya estan en cada matcher' },
    ],
  },
  {
    category: 'Catalogos (ODS, categorias, licencias)',
    description: 'Datos de referencia para clasificar y posicionar tu proyecto',
    items: [
      { method: 'GET', path: '/sdgs/', desc: 'Objetivos Desarrollo Sostenible', params: 'lang', returns: 'Lista de 17 ODS con id, name, icon', superpower: 'ODS', connection: 'Mapear Rural Makers con los ODS para credibilidad institucional' },
      { method: 'GET', path: '/footprints/', desc: 'Huellas de impacto', params: 'lang', returns: 'Tipos de impacto definidos en Goteo', superpower: 'ODS', connection: 'Definir el impacto social de Rural Makers' },
      { method: 'GET', path: '/categories/', desc: 'Categorias', params: 'lang', returns: 'Lista de categorias de proyecto', superpower: 'Benchmarking', connection: 'Elegir la mejor categoria (Social vs Technology)' },
      { method: 'GET', path: '/socialcommitments/', desc: 'Compromisos sociales', params: 'lang', returns: 'Compromisos disponibles', superpower: 'ODS', connection: 'Alinear con compromisos de impacto de Goteo' },
      { method: 'GET', path: '/licenses/', desc: 'Licencias abiertas', params: 'lang', returns: 'Licencias disponibles', superpower: 'ODS', connection: 'Elegir licencia para la app (GPLv3, Creative Commons, etc.)' },
    ],
  },
  {
    category: 'Digests (datos historicos)',
    description: 'Datos agrupados por periodos de tiempo',
    items: [
      { method: 'GET', path: '/digests/reports/money/', desc: 'Dinero por periodo', params: 'year, month', returns: 'Datos de dinero en intervalos', superpower: 'Benchmarking', connection: 'Ver tendencias: que meses se dona mas? Elegir fecha de lanzamiento' },
      { method: 'GET', path: '/digests/licenses/', desc: 'Licencias por periodo', params: 'year', returns: 'Licencias usadas en un ano', superpower: 'ODS', connection: 'Que licencias usan los proyectos exitosos' },
    ],
  },
  {
    category: 'Edicion del proyecto',
    description: 'Posibilidades de editar tu proyecto via API',
    items: [
      { method: 'info', path: 'No disponible via API publica', desc: 'La API de Goteo v1 es de solo lectura (GET)', params: '-', returns: '-', superpower: '-', connection: 'No se puede editar el proyecto via API. La edicion se hace desde el panel de Goteo (goteo.org/dashboard). Para automatizar ediciones, habria que contactar con Goteo para acceso a endpoints internos o usar web scraping del dashboard.' },
    ],
  },
]

const superpowerColors = {
  'Monitor': 'bg-green-100 text-green-700',
  'Benchmarking': 'bg-indigo-100 text-indigo-700',
  'Recompensas': 'bg-amber-100 text-amber-700',
  'Comunidad': 'bg-teal-100 text-teal-700',
  'Convocatorias': 'bg-purple-100 text-purple-700',
  'ODS': 'bg-blue-100 text-blue-700',
  '-': 'bg-gray-100 text-gray-500',
}

function EndpointsTab() {
  return (
    <div className="space-y-4">
      {endpoints.map((cat, i) => (
        <div key={i} className="card border border-gray-100">
          <h4 className="font-semibold text-gray-800">{cat.category}</h4>
          <p className="text-xs text-gray-500 mb-3">{cat.description}</p>
          <div className="space-y-3">
            {cat.items.map((ep, j) => (
              <div key={j} className="border border-gray-50 rounded-lg p-3 hover:bg-gray-50/50">
                <div className="flex items-start gap-2 mb-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-mono shrink-0 ${ep.method === 'GET' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                    {ep.method}
                  </span>
                  <code className="text-sm font-mono text-gray-800 flex-1">{ep.path}</code>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${superpowerColors[ep.superpower]}`}>
                    {ep.superpower}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{ep.desc}</p>
                {ep.params !== '-' && <p className="text-xs text-gray-400 mb-1">Params: <span className="font-mono">{ep.params}</span></p>}
                {ep.returns !== '-' && <p className="text-xs text-gray-400 mb-2">Devuelve: <span className="font-mono">{ep.returns}</span></p>}
                <div className="text-xs bg-gray-50 rounded p-2 text-gray-600">
                  <span className="font-semibold">Conexion:</span> {ep.connection}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── TAB: API TESTER ───────────────────────────────────────────
function TesterTab() {
  const [path, setPath] = useState('/projects/camino-rural-tejiendo-facenderas')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchApi = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/goteo${path}`)
      const text = await res.text()
      try {
        setResult(JSON.parse(text))
      } catch {
        setError(`Respuesta no-JSON (Cloudflare challenge). Status: ${res.status}`)
        setResult(null)
      }
    } catch (err) {
      setError(err.message)
      setResult(null)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="card bg-gray-800 text-white">
        <h3 className="font-semibold mb-1">API Tester en Vivo</h3>
        <p className="text-xs opacity-80">
          Las peticiones pasan por el proxy Express (puerto 3001). Requiere <code>npm run server</code>.
          Nota: Cloudflare puede bloquear las peticiones desde servidor.
        </p>
      </div>

      <div className="card border border-gray-100">
        <div className="flex gap-2 mb-3">
          <span className="px-2 py-1.5 bg-blue-100 text-blue-700 text-xs rounded font-mono">GET</span>
          <input type="text" value={path} onChange={e => setPath(e.target.value)}
            className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-rural-green" />
          <button onClick={fetchApi} disabled={loading}
            className="px-4 py-1.5 bg-rural-green text-white text-sm rounded-lg hover:bg-rural-green-dark transition disabled:opacity-50">
            {loading ? '...' : 'Enviar'}
          </button>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {['/projects/', '/categories/', '/reports/summary/', '/calls/', '/sdgs/', '/reports/rewards/'].map(p => (
            <button key={p} onClick={() => setPath(p)} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 font-mono">{p}</button>
          ))}
        </div>
        {error && <div className="text-sm text-red-600 bg-red-50 rounded p-2 mb-2">{error}</div>}
        {result && (
          <pre className="text-xs bg-gray-900 text-green-400 rounded-lg p-3 max-h-80 overflow-auto font-mono whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>

      <ApiStatus />
    </div>
  )
}

// ─── MAIN COMPONENT ────────────────────────────────────────────
export default function GoteoApi() {
  const [tab, setTab] = useState(0)

  const renderTab = () => {
    switch (tab) {
      case 0: return <MonitorTab />
      case 1: return <BenchmarkingTab />
      case 2: return <RewardsTab />
      case 3: return <CommunityTab />
      case 4: return <CallsTab />
      case 5: return <OdsTab />
      case 6: return <EndpointsTab />
      case 7: return <TesterTab />
      default: return null
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-800">Goteo API Superpoderes</h2>
        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">8 secciones</span>
        <div className="flex gap-2 ml-auto">
          <a href="https://developers.goteo.org/" target="_blank" rel="noopener noreferrer"
            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition">
            API Docs
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={`tab-btn ${tab === i ? 'active' : ''}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {renderTab()}
    </div>
  )
}
