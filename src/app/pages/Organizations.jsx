import { useState } from 'react'
import { organizations } from '../data/mockData'

const categoryColors = {
  agricultura: { bg: 'bg-green-100', text: 'text-green-700' },
  tecnologia: { bg: 'bg-purple-100', text: 'text-purple-700' },
  artesania: { bg: 'bg-amber-100', text: 'text-amber-700' },
  energia: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  ganaderia: { bg: 'bg-orange-100', text: 'text-orange-700' },
  turismo: { bg: 'bg-blue-100', text: 'text-blue-700' },
}

const categoryOptions = ['Todas', 'agricultura', 'tecnologia', 'artesania', 'energia', 'ganaderia', 'turismo']
const territoryOptions = ['Todos', 'Astorga', 'Ponferrada', 'El Bierzo', 'Leon', 'La Baneza', 'Villablino', 'Sahagun']

export default function Organizations() {
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const [territoryFilter, setTerritoryFilter] = useState('Todos')
  const [search, setSearch] = useState('')

  const filtered = organizations.filter(o => {
    if (categoryFilter !== 'Todas' && o.category !== categoryFilter) return false
    if (territoryFilter !== 'Todos' && o.location !== territoryFilter) return false
    if (search && !o.name.toLowerCase().includes(search.toLowerCase()) && !o.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-800">Directorio de Organizaciones Rurales</h2>

      {/* Filters */}
      <div className="flex gap-2">
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rural-green bg-white capitalize">
          {categoryOptions.map(c => (
            <option key={c} value={c} className="capitalize">{c === 'Todas' ? 'Todas las categorias' : c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <select value={territoryFilter} onChange={e => setTerritoryFilter(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rural-green bg-white">
          {territoryOptions.map(t => (
            <option key={t} value={t}>{t === 'Todos' ? 'Todos los territorios' : t}</option>
          ))}
        </select>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar organizaciones..."
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rural-green" />

      <div className="text-xs text-gray-400">{filtered.length} organizaciones</div>

      {/* Organization cards */}
      <div className="space-y-3">
        {filtered.map(o => {
          const cc = categoryColors[o.category] || { bg: 'bg-gray-100', text: 'text-gray-700' }
          return (
            <div key={o.id} className="card p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-gray-800">{o.name}</h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2 py-0.5 bg-rural-earth/10 text-rural-earth rounded-full">{o.location}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${cc.bg} ${cc.text} capitalize`}>{o.category}</span>
              </div>
              <p className="text-sm text-gray-600">{o.description}</p>
              <div>
                <span className="text-xs font-medium text-gray-500">Productos:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {o.products.map(p => (
                    <span key={p} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{p}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{o.employees} empleados</span>
                <span>Fundada en {o.founded}</span>
              </div>
              <button className="w-full py-2 bg-rural-green text-white rounded-lg text-sm font-medium hover:bg-rural-green/90 transition-colors">Ver Perfil</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
