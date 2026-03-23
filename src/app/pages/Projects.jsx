import { useState } from 'react'
import { Link } from 'react-router-dom'
import { projects, users, categories } from '../data/mockData'

const categoryFilters = ['arte', 'energia', 'educacion', 'bioconstruccion', 'salud', 'agroecologia', 'tecnologia']

const statusOptions = [
  { key: 'all', label: 'Todos los estados' },
  { key: 'planificacion', label: 'En Planificacion' },
  { key: 'en_curso', label: 'En Curso' },
  { key: 'completado', label: 'Completados' },
]

const statusBadge = {
  en_curso: { label: 'En Curso', classes: 'bg-blue-100 text-blue-700' },
  planificacion: { label: 'Planificacion', classes: 'bg-amber-100 text-amber-700' },
  completado: { label: 'Completado', classes: 'bg-green-100 text-green-700' },
  idea: { label: 'Idea', classes: 'bg-gray-100 text-gray-600' },
}

const tagColors = {
  Innovacion: 'bg-blue-100 text-blue-700',
  Sostenibilidad: 'bg-green-100 text-green-700',
  Colaborativo: 'bg-teal-100 text-teal-700',
  Tradicional: 'bg-amber-100 text-amber-700',
  Ecologico: 'bg-emerald-100 text-emerald-700',
  Formativo: 'bg-purple-100 text-purple-700',
  Renovable: 'bg-yellow-100 text-yellow-700',
  Comunitario: 'bg-cyan-100 text-cyan-700',
  Ahorro: 'bg-lime-100 text-lime-700',
  Cultural: 'bg-pink-100 text-pink-700',
  Educativo: 'bg-violet-100 text-violet-700',
  Patrimonio: 'bg-stone-100 text-stone-700',
  Digital: 'bg-indigo-100 text-indigo-700',
  Salud: 'bg-rose-100 text-rose-700',
  Accesible: 'bg-sky-100 text-sky-700',
  STEM: 'bg-purple-100 text-purple-700',
  Juventud: 'bg-pink-100 text-pink-700',
}

export default function Projects() {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = projects.filter(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    return true
  })

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">Proyectos Colaborativos</h1>
        <p className="text-sm text-gray-500">Iniciativas comunitarias para transformar el medio rural</p>
        <Link to="/app/proyectos/crear" className="inline-block px-4 py-2 bg-rural-green text-white text-sm font-medium rounded-lg hover:opacity-90 transition">
          Crear Nuevo Proyecto
        </Link>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Category filter pills */}
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

        {/* Status filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusOptions.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`text-xs px-3 py-1.5 rounded-full shrink-0 font-medium transition ${
                statusFilter === key
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
        {filtered.map(p => {
          const creator = users.find(u => u.id === p.creator)
          const badge = statusBadge[p.status] || statusBadge.idea

          return (
            <div key={p.id} className="card p-4 space-y-3">
              {/* Top: status badge + location */}
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badge.classes}`}>
                  {badge.label}
                </span>
                <span className="text-xs text-gray-500 inline-flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {p.location}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-900">{p.title}</h3>

              {/* Description */}
              <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Progreso</span>
                  <span className="font-semibold text-gray-700">{p.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${p.progress}%`,
                      background: p.progress === 100 ? '#16a34a' : p.progress >= 60 ? '#3b82f6' : '#d97706',
                    }}
                  />
                </div>
              </div>

              {/* Tags */}
              {p.tags && p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map(tag => (
                    <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[tag] || 'bg-gray-100 text-gray-600'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Bottom: participants + date */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
                <span className="inline-flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {p.participants || p.collaborators?.length || 0} participantes
                </span>
                <span className="inline-flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {p.date}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-1">
                <Link
                  to={`/app/proyectos/${p.id}`}
                  className="flex-1 text-center px-3 py-2 bg-rural-green text-white text-sm font-medium rounded-lg hover:opacity-90 transition"
                >
                  Ver Detalles
                </Link>
                <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
                  Seguir
                </button>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-12">No hay proyectos con estos filtros</div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="card p-6 text-center space-y-3 bg-rural-green/5 border-rural-green/20">
        <h3 className="text-lg font-bold text-gray-900">Tienes una Idea de Proyecto?</h3>
        <p className="text-sm text-gray-500">Comparte tu vision y encuentra colaboradores en la comunidad</p>
        <div className="flex gap-3 justify-center">
          <Link to="/app/proyectos/crear" className="px-4 py-2 bg-rural-green text-white text-sm font-medium rounded-lg hover:opacity-90 transition">
            Proponer Proyecto
          </Link>
          <Link to="/app/proyectos/guia" className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
            Guia de Proyectos
          </Link>
        </div>
      </div>
    </div>
  )
}
