import { useState } from 'react'
import { Link } from 'react-router-dom'
import { facenderas, users, categories } from '../data/mockData'

const categoryFilters = ['agricultura', 'construccion', 'artesania', 'tecnologia', 'educacion', 'energia']
const modalidadOptions = [
  { key: 'all', label: 'Todas' },
  { key: 'presencial', label: 'Presencial' },
  { key: 'virtual', label: 'Virtual' },
]

const tagColors = {
  Ecologica: 'bg-green-100 text-green-700',
  Comunitaria: 'bg-blue-100 text-blue-700',
  Educativa: 'bg-purple-100 text-purple-700',
  Virtual: 'bg-indigo-100 text-indigo-700',
  Planificacion: 'bg-amber-100 text-amber-700',
  Colaborativa: 'bg-teal-100 text-teal-700',
  Construccion: 'bg-orange-100 text-orange-700',
  Sostenible: 'bg-emerald-100 text-emerald-700',
  Artesanal: 'bg-yellow-100 text-yellow-700',
  Intergeneracional: 'bg-rose-100 text-rose-700',
  Cultural: 'bg-pink-100 text-pink-700',
  Energetica: 'bg-amber-100 text-amber-700',
  Tecnica: 'bg-slate-100 text-slate-700',
  Digital: 'bg-violet-100 text-violet-700',
  Formativa: 'bg-cyan-100 text-cyan-700',
  Inclusiva: 'bg-lime-100 text-lime-700',
  Patrimonio: 'bg-stone-100 text-stone-700',
  Biodiversidad: 'bg-green-100 text-green-800',
  Tecnologia: 'bg-purple-100 text-purple-700',
  IA: 'bg-indigo-100 text-indigo-700',
  Innovacion: 'bg-blue-100 text-blue-700',
  Mapeo: 'bg-cyan-100 text-cyan-700',
  Turismo: 'bg-teal-100 text-teal-700',
  STEM: 'bg-violet-100 text-violet-700',
  Juventud: 'bg-pink-100 text-pink-700',
}

export default function FacenderasList() {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [modalidadFilter, setModalidadFilter] = useState('all')

  const filtered = facenderas.filter(f => {
    if (categoryFilter !== 'all' && f.category !== categoryFilter) return false
    if (modalidadFilter !== 'all' && f.modalidad !== modalidadFilter) return false
    return true
  })

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">Facenderas Rurales</h1>
        <p className="text-sm text-gray-500">Trabajo comunitario colaborativo en la provincia de Leon</p>
        <div className="flex gap-3 justify-center">
          <Link to="/app/facenderas/crear" className="px-4 py-2 bg-rural-green text-white text-sm font-medium rounded-lg hover:opacity-90 transition">
            Proponer Facendera
          </Link>
          <Link to="/app/facenderas/organizar" className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition">
            Organizar Facendera
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Category filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`text-xs px-3 py-1.5 rounded-full shrink-0 font-medium transition ${
              categoryFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {categoryFilters.map(catId => {
            const cat = categories.find(c => c.id === catId)
            if (!cat) return null
            return (
              <button
                key={catId}
                onClick={() => setCategoryFilter(catId)}
                className={`text-xs px-3 py-1.5 rounded-full shrink-0 font-medium transition ${
                  categoryFilter === catId ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={categoryFilter === catId ? { background: cat.color } : {}}
              >
                {cat.icon} {cat.label}
              </button>
            )
          })}
        </div>

        {/* Modalidad filter */}
        <div className="flex gap-2">
          {modalidadOptions.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setModalidadFilter(key)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                modalidadFilter === key
                  ? 'bg-rural-green text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map(f => {
          const organizer = users.find(u => u.id === f.creator)
          const activitiesShown = f.actividades?.slice(0, 3) || []
          const activitiesExtra = (f.actividades?.length || 0) - 3

          return (
            <div key={f.id} className="card p-4 space-y-3">
              {/* Top badges */}
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1 ${
                  f.modalidad === 'presencial'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {f.modalidad === 'presencial' ? (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  ) : (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  )}
                  {f.modalidad === 'presencial' ? 'Presencial' : 'Virtual'}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                  {f.duracion}
                </span>
              </div>

              {/* Title & description */}
              <div>
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{f.description}</p>
              </div>

              {/* Date + location */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {f.date} {f.time}
                </span>
                <span className="inline-flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {f.location}
                </span>
              </div>

              {/* Actividades */}
              {activitiesShown.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Actividades:</p>
                  <ul className="space-y-0.5">
                    {activitiesShown.map((a, i) => (
                      <li key={i} className="text-xs text-gray-500 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-rural-green shrink-0" />
                        {a}
                      </li>
                    ))}
                    {activitiesExtra > 0 && (
                      <li className="text-xs text-rural-green font-medium">+{activitiesExtra} mas</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {f.tags && f.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {f.tags.map(tag => (
                    <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[tag] || 'bg-gray-100 text-gray-600'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Bottom: participants + organizer */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {f.participants.length}/{f.maxParticipants} participantes
                  </span>
                  <span>Org: {f.organizador}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-1">
                <Link
                  to={`/app/facenderas/${f.id}`}
                  className="flex-1 text-center px-3 py-2 bg-rural-green text-white text-sm font-medium rounded-lg hover:opacity-90 transition"
                >
                  Inscribirse
                </Link>
                <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
                  Contactar
                </button>
                <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
                  Compartir
                </button>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-12">No hay facenderas con estos filtros</div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="card p-6 text-center space-y-3 bg-rural-green/5 border-rural-green/20">
        <h3 className="text-lg font-bold text-gray-900">Quieres Organizar una Facendera?</h3>
        <p className="text-sm text-gray-500">Crea tu propia facendera y convoca a la comunidad rural</p>
        <div className="flex gap-3 justify-center">
          <Link to="/app/facenderas/crear" className="px-4 py-2 bg-rural-green text-white text-sm font-medium rounded-lg hover:opacity-90 transition">
            Proponer Facendera
          </Link>
          <Link to="/app/facenderas/organizar" className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition">
            Organizar Facendera
          </Link>
        </div>
      </div>
    </div>
  )
}
