import { useState } from 'react'
import { agendaEvents } from '../data/mockData'

const typeConfig = {
  facendera: { label: 'Facendera', color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50' },
  taller: { label: 'Taller', color: 'bg-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50' },
  reunion: { label: 'Reunion', color: 'bg-purple-500', textColor: 'text-purple-700', bgLight: 'bg-purple-50' },
  celebracion: { label: 'Celebracion', color: 'bg-pink-500', textColor: 'text-pink-700', bgLight: 'bg-pink-50' },
}

const categoryFilters = ['Todos', 'Facenderas', 'Talleres', 'Reuniones', 'Celebraciones']
const categoryMap = { Facenderas: 'facendera', Talleres: 'taller', Reuniones: 'reunion', Celebraciones: 'celebracion' }
const locations = ['Todas las ubicaciones', 'Astorga', 'Ponferrada', 'La Baneza', 'Online']

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return `${dayNames[d.getDay()]}, ${d.getDate()} de ${monthNames[d.getMonth()]} ${d.getFullYear()}`
}

export default function Agenda() {
  const [view, setView] = useState('Lista')
  const [categoryFilter, setCategoryFilter] = useState('Todos')
  const [locationFilter, setLocationFilter] = useState('Todas las ubicaciones')
  const [search, setSearch] = useState('')
  const [selectedDay, setSelectedDay] = useState(null)

  const filtered = agendaEvents.filter(e => {
    if (categoryFilter !== 'Todos' && e.type !== categoryMap[categoryFilter]) return false
    if (locationFilter !== 'Todas las ubicaciones' && e.location !== locationFilter) return false
    if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.description.toLowerCase().includes(search.toLowerCase())) return false
    if (selectedDay && view === 'Mes') {
      const eventDay = new Date(e.date + 'T00:00:00').getDate()
      if (eventDay !== selectedDay) return false
    }
    return true
  })

  // Month view helpers
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1)
  // Monday = 0 in our grid (L-D)
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const eventDays = {}
  agendaEvents.forEach(e => {
    const d = new Date(e.date + 'T00:00:00')
    if (d.getMonth() === month && d.getFullYear() === year) {
      if (!eventDays[d.getDate()]) eventDays[d.getDate()] = []
      eventDays[d.getDate()].push(e)
    }
  })

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Agenda Colaborativa</h2>
        <p className="text-sm text-gray-500 mt-0.5">Eventos, facenderas y encuentros de la comunidad rural</p>
      </div>

      {/* View toggle */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {['Mes', 'Lista', 'Proximos'].map(v => (
          <button key={v} onClick={() => { setView(v); setSelectedDay(null) }}
            className={`flex-1 text-sm py-1.5 rounded-md font-medium transition-colors ${view === v ? 'bg-white text-rural-green shadow-sm' : 'text-gray-500'}`}>
            {v}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {categoryFilters.map(c => (
          <button key={c} onClick={() => setCategoryFilter(c)}
            className={`text-xs px-2.5 py-1 rounded-full shrink-0 ${categoryFilter === c ? 'bg-rural-green text-white' : 'bg-gray-100 text-gray-600'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Location filter + Search */}
      <div className="flex gap-2">
        <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rural-green bg-white">
          {locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar eventos..."
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rural-green" />
      </div>

      {/* Month view */}
      {view === 'Mes' && (
        <div className="card p-3">
          <div className="text-center font-semibold text-gray-800 mb-3">{monthNames[month]} {year}</div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
              <div key={d} className="font-semibold text-gray-400 py-1">{d}</div>
            ))}
            {Array.from({ length: startOffset }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const hasEvents = eventDays[day]
              const isToday = day === now.getDate()
              const isSelected = selectedDay === day
              return (
                <button key={day} onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                  className={`py-1.5 rounded-md relative transition-colors ${isSelected ? 'bg-rural-green text-white' : isToday ? 'bg-rural-green/10 text-rural-green font-bold' : 'text-gray-700 hover:bg-gray-50'}`}>
                  {day}
                  {hasEvents && (
                    <div className="flex justify-center gap-0.5 mt-0.5">
                      {hasEvents.slice(0, 3).map(ev => (
                        <span key={ev.id} className={`w-1.5 h-1.5 rounded-full ${typeConfig[ev.type].color}`} />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          {selectedDay && eventDays[selectedDay] && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
              <div className="text-xs font-semibold text-gray-500">{selectedDay} de {monthNames[month]}</div>
              {eventDays[selectedDay].map(ev => {
                const tc = typeConfig[ev.type]
                return (
                  <div key={ev.id} className={`p-2 rounded-lg ${tc.bgLight}`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full text-white ${tc.color}`}>{tc.label}</span>
                      <span className="text-xs text-gray-500">{ev.time}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-800 mt-1">{ev.title}</div>
                    <div className="text-xs text-gray-500">{ev.location}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* List / Proximos views */}
      {(view === 'Lista' || view === 'Proximos') && (
        <>
          <div className="text-xs text-gray-400">{filtered.length} eventos</div>
          <div className="space-y-3">
            {(view === 'Proximos'
              ? [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5)
              : filtered
            ).map(ev => {
              const tc = typeConfig[ev.type]
              return (
                <div key={ev.id} className="card p-4 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full text-white ${tc.color}`}>{tc.label}</span>
                    <span className="text-xs text-gray-400">{ev.participants} participantes</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{ev.title}</h3>
                  <p className="text-sm text-gray-600">{ev.description}</p>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <span>📅</span>
                      <span>{formatDate(ev.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>🕐</span>
                      <span>{ev.time}h</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>📍</span>
                      <span>{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>👤</span>
                      <span>Organiza: {ev.organizer}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button className="flex-1 text-xs py-2 bg-rural-green text-white rounded-lg font-medium hover:bg-rural-green/90 transition-colors">Inscribirse</button>
                    <button className="flex-1 text-xs py-2 border border-rural-green text-rural-green rounded-lg font-medium hover:bg-rural-green/5 transition-colors">Contactar</button>
                    <button className="flex-1 text-xs py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors">Compartir</button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* CTA */}
      <div className="card p-4 bg-rural-green/5 border-rural-green/20 text-center space-y-2">
        <p className="font-semibold text-gray-800">Quieres Organizar una Facendera?</p>
        <p className="text-xs text-gray-500">Comparte tu evento con la comunidad rural</p>
        <button className="px-6 py-2 bg-rural-green text-white rounded-lg text-sm font-medium hover:bg-rural-green/90 transition-colors">Crear Evento</button>
      </div>
    </div>
  )
}
