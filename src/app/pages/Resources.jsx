import { useState } from 'react'
import { recursos, users } from '../data/mockData'

const tabs = [
  { id: 'bitacoras', label: 'Bitacoras', icon: '📓' },
  { id: 'manuales', label: 'Manuales y Guias', icon: '📖' },
  { id: 'espacios', label: 'Espacios Fisicos', icon: '🏠' },
  { id: 'herramientas', label: 'Herramientas', icon: '🔧' },
  { id: 'multimedia', label: 'Multimedia', icon: '📸' },
  { id: 'agentesIA', label: 'Agentes IA', icon: '🤖' },
  { id: 'openSource', label: 'Open Source', icon: '💻' },
]

export default function Resources() {
  const [activeTab, setActiveTab] = useState('bitacoras')
  const [catFilter, setCatFilter] = useState('')
  const [locFilter, setLocFilter] = useState('')

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Centro de Recursos</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition ${activeTab === t.id ? 'bg-rural-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5">
          <option value="">Todas las categorias</option>
          <option>Agricultura</option><option>Alimentacion</option><option>Construccion</option>
          <option>Organizacion</option><option>Tecnologia</option><option>Educacion</option>
        </select>
        <select value={locFilter} onChange={e => setLocFilter(e.target.value)}
          className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5">
          <option value="">Todas las localizaciones</option>
          <option>Astorga</option><option>Leon</option><option>Ponferrada</option>
          <option>La Baneza</option><option>Online</option><option>Global</option>
        </select>
      </div>

      {/* Content by tab */}
      {activeTab === 'bitacoras' && (
        <div className="space-y-3">
          {recursos.bitacoras.map(b => (
            <div key={b.id} className="card border border-gray-100 space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-800 text-sm">{b.title}</h3>
                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">{b.format}</span>
              </div>
              <p className="text-xs text-gray-600">{b.description}</p>
              <div className="text-xs text-gray-400 space-y-0.5">
                <div><span className="text-gray-500">Categoria:</span> {b.category}</div>
                <div><span className="text-gray-500">Procedencia:</span> {b.source}</div>
                <div><span className="text-gray-500">Grupo:</span> {b.group}</div>
                <div><span className="text-gray-500">Apoyo:</span> {b.support}</div>
                <div><span className="text-gray-500">Localizacion:</span> {b.location}</div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400">{b.size} | {b.downloads} descargas</span>
                <button className="px-3 py-1.5 bg-rural-green text-white text-xs rounded-lg">Descargar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'manuales' && (
        <div className="space-y-3">
          {recursos.manuales.map(m => (
            <div key={m.id} className="card border border-gray-100 space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-800 text-sm">{m.title}</h3>
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">{m.format}</span>
              </div>
              <p className="text-xs text-gray-600">{m.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{m.size} | {m.downloads} descargas</span>
                <button className="px-3 py-1.5 bg-rural-green text-white text-xs rounded-lg">Descargar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'espacios' && (
        <div className="space-y-3">
          {recursos.espacios.map(e => (
            <div key={e.id} className="card border border-gray-100 flex items-center gap-3">
              <div className="w-12 h-12 bg-rural-green/10 rounded-lg flex items-center justify-center text-2xl shrink-0">🏠</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm">{e.name}</h3>
                <div className="text-xs text-gray-500">{e.type} | {e.location}</div>
                <div className="text-xs text-gray-400">Capacidad: {e.capacity} personas</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${e.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {e.available ? 'Disponible' : 'Ocupado'}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'herramientas' && (
        <div className="space-y-2">
          {recursos.herramientas.map(h => {
            const owner = users.find(u => u.id === h.owner)
            return (
              <div key={h.id} className="card border border-gray-100 flex items-center gap-3 p-3">
                <span className="text-2xl">🔧</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-800">{h.name}</div>
                  <div className="text-xs text-gray-500">{owner?.name} | {h.location}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${h.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {h.available ? 'Disponible' : 'En uso'}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'multimedia' && (
        <div className="grid grid-cols-2 gap-3">
          {recursos.multimedia.map(m => (
            <div key={m.id} className="card border border-gray-100 p-3 text-center">
              <div className="w-full h-24 bg-gray-200 rounded-lg mb-2 flex items-center justify-center text-3xl text-gray-400">
                {m.type === 'foto' ? '📸' : '🎬'}
              </div>
              <div className="text-xs font-semibold text-gray-800">{m.title}</div>
              <div className="text-xs text-gray-400">{m.location}</div>
            </div>
          ))}
          <div className="col-span-2 text-center py-4">
            <p className="text-sm text-gray-600 mb-3">Has participado en una facendera? Comparte tu experiencia!</p>
            <div className="flex gap-2 justify-center">
              <button className="px-4 py-2 bg-rural-green text-white text-xs rounded-lg">Subir Foto</button>
              <button className="px-4 py-2 bg-rural-earth text-white text-xs rounded-lg">Subir Video</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'agentesIA' && (
        <div className="space-y-3">
          {recursos.agentesIA.map(a => (
            <div key={a.id} className="card border border-gray-100 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <h3 className="font-semibold text-gray-800">{a.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${a.status === 'activo' ? 'bg-green-100 text-green-700' : a.status === 'en_desarrollo' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                  {a.status === 'activo' ? 'Activo' : a.status === 'en_desarrollo' ? 'En desarrollo' : 'Planificado'}
                </span>
              </div>
              <p className="text-xs text-gray-600">{a.description}</p>
              {a.status === 'activo' && (
                <button className="px-4 py-2 bg-rural-green text-white text-xs rounded-lg">Usar Agente</button>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'openSource' && (
        <div className="space-y-4">
          <div className="card bg-gray-800 text-white space-y-3">
            <h3 className="font-bold text-lg">Recursos Open Source</h3>
            <p className="text-sm text-gray-300">
              Fomentamos el uso de herramientas, plataformas y recursos de codigo abierto para la
              ingenieria colaborativa y el desarrollo sostenible de las comunidades rurales.
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-rural-green text-white text-xs rounded-lg">Explorar Repositorios</button>
              <button className="px-4 py-2 bg-white/10 text-white text-xs rounded-lg border border-white/20">Contribuir al Proyecto</button>
            </div>
          </div>
          <div className="card border border-gray-100 space-y-2">
            <h4 className="font-semibold text-gray-800">RuralMakers.app</h4>
            <p className="text-xs text-gray-600">Plataforma web colaborativa - React + Vite + Tailwind</p>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">React 19</span>
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">Tailwind 4</span>
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">Open Source</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
