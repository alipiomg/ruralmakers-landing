import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/mockData'

export default function FacenderaCreate() {
  const [form, setForm] = useState({ title: '', description: '', category: '', date: '', time: '', location: '', maxParticipants: 15 })
  const [submitted, setSubmitted] = useState(false)

  const update = (key, val) => setForm({ ...form, [key]: val })

  if (submitted) {
    return (
      <div className="p-4 text-center py-20">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Facendera creada!</h2>
        <p className="text-gray-600 mb-6">"{form.title}" esta lista. Comparte el enlace para que se apunte gente.</p>
        <Link to="/app" className="px-6 py-3 bg-rural-green text-white rounded-lg">Volver al Feed</Link>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Link to="/app" className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h2 className="text-xl font-bold text-gray-800">Crear Facendera</h2>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titulo</label>
          <input value={form.title} onChange={e => update('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rural-green"
            placeholder="Ej: Taller de poda en el comunal" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(c => (
              <button key={c.id} onClick={() => update('category', c.id)}
                className={`text-left text-xs p-2 rounded-lg border transition ${form.category === c.id ? 'border-rural-green bg-rural-green/5' : 'border-gray-200'}`}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input type="date" value={form.date} onChange={e => update('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rural-green" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <input type="time" value={form.time} onChange={e => update('time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rural-green" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ubicacion</label>
          <input value={form.location} onChange={e => update('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rural-green"
            placeholder="Ej: La Omana, Leon" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
          <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rural-green resize-none"
            placeholder="Describe que se va a hacer, que traer, horarios..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Participantes maximo</label>
          <input type="number" value={form.maxParticipants} onChange={e => update('maxParticipants', parseInt(e.target.value))}
            className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rural-green" />
        </div>

        <button onClick={() => setSubmitted(true)} disabled={!form.title || !form.category || !form.date}
          className="w-full py-3 bg-rural-green text-white rounded-lg font-medium hover:bg-rural-green-dark transition disabled:opacity-50 disabled:cursor-not-allowed">
          Publicar Facendera
        </button>
      </div>
    </div>
  )
}
