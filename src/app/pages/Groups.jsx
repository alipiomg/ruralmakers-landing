import { useState } from 'react'
import { Link } from 'react-router-dom'
import { groupsLocales, redes, redesCategorias, principios } from '../data/mockData'

const statusLabels = { activo: 'Activo', en_expansion: 'En expansión', recien_formado: 'Recién formado' }
const statusColors = { activo: 'bg-green-100 text-green-700', en_expansion: 'bg-blue-100 text-blue-700', recien_formado: 'bg-amber-100 text-amber-700' }
const estadoLabels = { activa: 'Activa', en_formación: 'En formación', propuesta: 'Propuesta' }
const estadoColors = { activa: 'bg-green-100 text-green-700', 'en_formación': 'bg-amber-100 text-amber-700', propuesta: 'bg-gray-100 text-gray-600' }

export default function Groups() {
  const [tab, setTab] = useState('redes')
  const [catFilter, setCatFilter] = useState('todas')
  const [propuesta, setPropuesta] = useState({ nombre: '', categoria: 'tecnología', descripcion: '', motivo: '' })
  const [propuestaEnviada, setPropuestaEnviada] = useState(false)

  const filteredRedes = catFilter === 'todas' ? redes : redes.filter(r => r.categoria === catFilter)

  const handlePropuesta = (e) => {
    e.preventDefault()
    const stored = JSON.parse(localStorage.getItem('rm-propuestas-redes') || '[]')
    stored.push({ ...propuesta, fecha: new Date().toISOString() })
    localStorage.setItem('rm-propuestas-redes', JSON.stringify(stored))
    setPropuestaEnviada(true)
    setPropuesta({ nombre: '', categoria: 'tecnología', descripcion: '', motivo: '' })
  }

  return (
    <div className="space-y-0">
      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 pb-8">
        <h1 className="text-2xl font-bold mb-2">Red de Redes</h1>
        <p className="text-sm text-gray-300 mb-3">
          Redes temáticas transversales donde las personas se agrupan por intereses,
          oficios y saberes para cooperar mediante facenderas especializadas.
        </p>
        <p className="text-sm text-rural-earth font-medium italic">
          Cada red es una semilla. Cada persona que se une, la hace crecer.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-3 bg-rural-cream overflow-x-auto">
        {[
          { id: 'redes', label: 'Redes Temáticas', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
          { id: 'locales', label: 'Grupos Locales', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
          { id: 'proponer', label: 'Proponer Red', icon: 'M12 4v16m8-8H4' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${tab === t.id ? 'bg-rural-green text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
            </svg>
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        {/* ── TAB REDES ── */}
        {tab === 'redes' && (
          <>
            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {redesCategorias.map(c => (
                <button key={c.id} onClick={() => setCatFilter(c.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${catFilter === c.id ? 'bg-rural-green text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                  <span>{c.icono}</span> {c.label}
                </button>
              ))}
            </div>

            {/* Redes grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRedes.map(red => (
                <Link key={red.id} to={`/app/redes/${red.slug}`}
                  className="block rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition group">
                  {/* Image header */}
                  <div className="relative h-32 overflow-hidden">
                    <img src={red.imagen} alt={red.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${red.color}CC, ${red.color}33, transparent)` }} />
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-black/40 backdrop-blur-sm">
                        {redesCategorias.find(c => c.id === red.categoria)?.icono} {red.categoria}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${red.estado === 'activa' ? 'bg-green-500/90 text-white' : 'bg-amber-500/90 text-white'}`}>
                        {estadoLabels[red.estado]}
                      </span>
                    </div>
                    {/* Title over image */}
                    <div className="absolute bottom-2 left-3 right-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{red.icono}</span>
                        <h3 className="font-bold text-white text-lg drop-shadow-lg leading-tight">{red.nombre}</h3>
                      </div>
                    </div>
                  </div>
                  {/* Body */}
                  <div className="p-3">
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{red.descripcion}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3 text-xs text-gray-500">
                        <span className="font-medium">{red.miembros} miembros</span>
                        <span>{red.facenderasCount} facenderas</span>
                      </div>
                      <span className="text-xs font-bold text-rural-green group-hover:translate-x-1 transition-transform">Ver →</span>
                    </div>
                    {/* Sub-redes pills */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {red.subRedes.slice(0, 3).map((sr, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                          style={{ color: red.color, borderColor: `${red.color}40`, background: `${red.color}10` }}>
                          {sr.nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* ── TAB LOCALES ── */}
        {tab === 'locales' && (
          <>
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Grupos Locales por Comarca</h2>
              <p className="text-sm text-gray-600 mt-1">
                Comunidades territoriales que trabajan en su territorio recuperando espacios y tradiciones.
              </p>
            </div>

            {groupsLocales.map(group => (
              <div key={group.id} className="card border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{group.name}</h3>
                    <span className="text-xs text-gray-500">{group.comarca}</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${statusColors[group.status]}`}>
                    {statusLabels[group.status]}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>{group.members} miembros</span>
                  <span>{group.facenderasCount} facenderas</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{group.description}</p>
                {group.testimonio && (
                  <div className="bg-rural-green/5 rounded-lg p-3 text-xs text-gray-600 italic border-l-2 border-rural-green">
                    {group.testimonio.author}: "{group.testimonio.text}"
                  </div>
                )}
                <button className="w-full py-2.5 bg-rural-green text-white rounded-lg text-sm font-medium">
                  Contactar Grupo
                </button>
              </div>
            ))}
          </>
        )}

        {/* ── TAB PROPONER ── */}
        {tab === 'proponer' && (
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Proponer una nueva Red</h2>
              <p className="text-sm text-gray-600 mt-1">
                ¿Tienes una temática que no está cubierta? Propón una nueva red y encuentra personas que compartan tu interés.
              </p>
            </div>

            {propuestaEnviada ? (
              <div className="card border border-green-200 bg-green-50 text-center py-8">
                <div className="text-4xl mb-3">🌱</div>
                <h3 className="font-bold text-green-800 text-lg">¡Propuesta registrada!</h3>
                <p className="text-sm text-green-700 mt-2">Tu propuesta será revisada por la comunidad. Te avisaremos cuando haya novedades.</p>
                <button onClick={() => setPropuestaEnviada(false)}
                  className="mt-4 px-4 py-2 bg-rural-green text-white rounded-lg text-sm font-medium">
                  Proponer otra
                </button>
              </div>
            ) : (
              <form onSubmit={handlePropuesta} className="card border border-gray-100 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Red</label>
                  <input type="text" required value={propuesta.nombre}
                    onChange={e => setPropuesta({ ...propuesta, nombre: e.target.value })}
                    placeholder="Ej: Apicultura Sostenible"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rural-green focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <div className="grid grid-cols-3 gap-2">
                    {redesCategorias.filter(c => c.id !== 'todas').map(c => (
                      <button key={c.id} type="button"
                        onClick={() => setPropuesta({ ...propuesta, categoria: c.id })}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${propuesta.categoria === c.id ? 'bg-rural-green text-white' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                        <span>{c.icono}</span> {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea required value={propuesta.descripcion}
                    onChange={e => setPropuesta({ ...propuesta, descripcion: e.target.value })}
                    placeholder="¿De qué trata esta red? ¿Qué tipo de facenderas se organizarían?"
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rural-green focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">¿Por qué es necesaria?</label>
                  <textarea value={propuesta.motivo}
                    onChange={e => setPropuesta({ ...propuesta, motivo: e.target.value })}
                    placeholder="¿Qué problema resuelve? ¿Quién se beneficiaría?"
                    rows={2}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rural-green focus:border-transparent" />
                </div>
                <button type="submit"
                  className="w-full py-3 bg-rural-green text-white rounded-lg font-medium flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Enviar Propuesta
                </button>
              </form>
            )}

            {/* Principios */}
            <div className="mt-6 bg-rural-green/5 rounded-xl p-5 border border-rural-green/10">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm">Principios de las Redes</h4>
              <div className="grid grid-cols-2 gap-3">
                {principios.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="text-base">{p.icon}</span>
                    <div>
                      <div className="font-medium text-gray-800">{p.title}</div>
                      <div className="text-gray-500">{p.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
