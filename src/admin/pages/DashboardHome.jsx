import { useGoteoApi } from '../../shared/hooks/useGoteoApi'
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'
import { FUNDING_MIN, FUNDING_OPT, BASE44_LANDING, RURALMAKERS_NET, GOTEO_PROJECT_URL } from '../../shared/lib/constants'
import { getRewardTiers } from '../../data/rewardTiers'
import { campaignChecklist } from '../../data/campaignChecklist'

function StatsCard({ label, value, sub, color = 'text-gray-800' }) {
  return (
    <div className="card text-center">
      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

function FundingMeter({ raised = 0, min = FUNDING_MIN, opt = FUNDING_OPT }) {
  const pctMin = Math.min((raised / min) * 100, 100)
  const pctOpt = Math.min((raised / opt) * 100, 100)

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Progreso de Financiacion</h3>
      <div className="relative">
        {/* Bar */}
        <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pctOpt}%`,
              background: pctMin >= 100 ? '#4a7c59' : '#D4A843',
            }}
          />
        </div>
        {/* Markers */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>0</span>
          <span className="text-amber-600 font-medium">Min: {min.toLocaleString('es')} EUR</span>
          <span className="text-rural-green font-medium">Opt: {opt.toLocaleString('es')} EUR</span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <span className="text-3xl font-bold text-rural-green">{raised.toLocaleString('es')} EUR</span>
        <span className="text-sm text-gray-500 ml-2">recaudados ({pctOpt.toFixed(1)}%)</span>
      </div>
    </div>
  )
}

export default function DashboardHome() {
  const { data, loading, error } = useGoteoApi()
  const [checklist] = useLocalStorage('rm-checklist', campaignChecklist)

  const raised = data?.amount || 0
  const investors = data?.investors || 0
  const status = data?.status || 'Editandose'

  const totalItems = checklist.reduce((sum, cat) => sum + cat.items.length, 0)
  const doneItems = checklist.reduce((sum, cat) => sum + cat.items.filter(i => i.done).length, 0)

  return (
    <div className="space-y-6">
      {/* Status banner */}
      <div className="card bg-gradient-to-r from-rural-green to-rural-green-dark text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Rural Makers Tejiendo Facenderas</h2>
            <p className="text-sm opacity-90 mt-1">Asociacion Indira | La Omana, Leon, Espana</p>
          </div>
          <div className="flex gap-2">
            <a href={GOTEO_PROJECT_URL} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition">
              Ver en Goteo
            </a>
            <a href={BASE44_LANDING} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition">
              Landing
            </a>
            <a href={RURALMAKERS_NET} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition">
              App Prototipo
            </a>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Recaudado" value={`${raised.toLocaleString('es')} EUR`} color="text-rural-green" />
        <StatsCard label="Cofinanciadores" value={investors} />
        <StatsCard label="Estado" value={status} sub={loading ? 'Actualizando...' : error ? 'API no disponible' : 'Via API Goteo'} />
        <StatsCard label="Preparacion" value={`${doneItems}/${totalItems}`} sub="tareas completadas" color={doneItems === totalItems ? 'text-rural-green' : 'text-amber-600'} />
      </div>

      {/* Funding meter */}
      <FundingMeter raised={raised} />

      {/* Two column layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Checklist summary */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Checklist de Preparacion</h3>
          <div className="space-y-3">
            {checklist.map(cat => {
              const done = cat.items.filter(i => i.done).length
              const total = cat.items.length
              return (
                <div key={cat.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{cat.category}</span>
                    <span className={done === total ? 'text-rural-green font-medium' : 'text-gray-400'}>
                      {done}/{total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-full rounded-full bg-rural-green transition-all"
                      style={{ width: `${(done / total) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <a href="/planning" className="block mt-3 text-sm text-rural-green hover:underline">
            Ver checklist completo →
          </a>
        </div>

        {/* Rewards overview */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Recompensas ({getRewardTiers().length} niveles)</h3>
          <div className="space-y-2 max-h-64 overflow-auto">
            {getRewardTiers().map(r => (
              <div key={r.amount} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <span className="text-sm font-bold text-rural-green w-16 text-right">{r.amount} EUR</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{r.name}</div>
                  <div className="text-xs text-gray-500 truncate">{r.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Acciones Rapidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a href="/video" className="p-3 bg-red-50 rounded-lg text-center hover:bg-red-100 transition">
            <div className="text-2xl mb-1">🎬</div>
            <div className="text-xs font-medium text-red-700">Crear Video</div>
            <div className="text-xs text-red-500">Pendiente</div>
          </a>
          <a href="/description" className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition">
            <div className="text-2xl mb-1">📝</div>
            <div className="text-xs font-medium text-blue-700">Editar Descripcion</div>
          </a>
          <a href="/planning" className="p-3 bg-amber-50 rounded-lg text-center hover:bg-amber-100 transition">
            <div className="text-2xl mb-1">📋</div>
            <div className="text-xs font-medium text-amber-700">Planificar</div>
          </a>
          <a href="https://www.goteo.org/dashboard/project/camino-rural-tejiendo-facenderas/apply"
            target="_blank" rel="noopener noreferrer"
            className="p-3 bg-green-50 rounded-lg text-center hover:bg-green-100 transition">
            <div className="text-2xl mb-1">🚀</div>
            <div className="text-xs font-medium text-green-700">Enviar a Revision</div>
          </a>
        </div>
      </div>
    </div>
  )
}
