import { useState } from 'react'
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'
import { campaignChecklist } from '../../data/campaignChecklist'

function ChecklistTab() {
  const [checklist, setChecklist] = useLocalStorage('rm-checklist', campaignChecklist)

  const toggleItem = (catIdx, itemIdx) => {
    const updated = checklist.map((cat, ci) => {
      if (ci !== catIdx) return cat
      return {
        ...cat,
        items: cat.items.map((item, ii) => {
          if (ii !== itemIdx) return item
          return { ...item, done: !item.done }
        })
      }
    })
    setChecklist(updated)
  }

  const totalItems = checklist.reduce((sum, cat) => sum + cat.items.length, 0)
  const doneItems = checklist.reduce((sum, cat) => sum + cat.items.filter(i => i.done).length, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">Checklist de Campana</h3>
        <span className={`text-sm font-medium ${doneItems === totalItems ? 'text-rural-green' : 'text-amber-600'}`}>
          {doneItems}/{totalItems} completadas
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className="h-full rounded-full bg-rural-green transition-all duration-500"
          style={{ width: `${(doneItems / totalItems) * 100}%` }}
        />
      </div>

      {checklist.map((cat, catIdx) => {
        const catDone = cat.items.filter(i => i.done).length
        return (
          <div key={cat.category} className="card">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700">{cat.category}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                catDone === cat.items.length
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {catDone}/{cat.items.length}
              </span>
            </div>
            <div className="space-y-2">
              {cat.items.map((item, itemIdx) => (
                <label key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleItem(catIdx, itemIdx)}
                    className="w-4 h-4 rounded border-gray-300 text-rural-green focus:ring-rural-green"
                  />
                  <span className={`text-sm ${item.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TimelineTab() {
  const [milestones, setMilestones] = useLocalStorage('rm-timeline', [
    { id: 1, date: '', label: 'Video de presentacion listo', done: false },
    { id: 2, date: '', label: 'Enviar a revision en Goteo', done: false },
    { id: 3, date: '', label: 'Aprobacion de Goteo', done: false },
    { id: 4, date: '', label: 'Inicio de campana', done: false },
    { id: 5, date: '', label: 'Primera ronda (40 dias)', done: false },
    { id: 6, date: '', label: 'Meta minima alcanzada (10.700 EUR)', done: false },
    { id: 7, date: '', label: 'Segunda ronda (40 dias)', done: false },
    { id: 8, date: '', label: 'Meta optima (55.000 EUR)', done: false },
    { id: 9, date: '', label: 'Fin de campana', done: false },
    { id: 10, date: '', label: 'Entrega de recompensas', done: false },
  ])

  const updateMilestone = (id, field, value) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">Timeline de la Campana</h3>
      <div className="card">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-4">
            {milestones.map((m, idx) => (
              <div key={m.id} className="flex items-start gap-4 relative">
                {/* Dot */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  m.done ? 'bg-rural-green text-white' : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}>
                  {m.done ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={m.done}
                        onChange={e => updateMilestone(m.id, 'done', e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-rural-green"
                      />
                      <span className={`text-sm font-medium ${m.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {m.label}
                      </span>
                    </label>
                  </div>
                  <input
                    type="date"
                    value={m.date}
                    onChange={e => updateMilestone(m.id, 'date', e.target.value)}
                    className="mt-1 text-xs border border-gray-200 rounded px-2 py-1 focus:border-rural-green focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SocialMediaTab() {
  const platforms = ['Twitter/X', 'Instagram', 'Facebook', 'Telegram', 'WhatsApp']
  const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

  const [posts, setPosts] = useLocalStorage('rm-social', {})

  const getKey = (platform, day) => `${platform}-${day}`
  const getPost = (platform, day) => posts[getKey(platform, day)] || ''
  const setPost = (platform, day, value) => {
    setPosts({ ...posts, [getKey(platform, day)]: value })
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">Calendario Redes Sociales</h3>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2 text-gray-500 font-medium w-28">Plataforma</th>
              {days.map(d => (
                <th key={d} className="p-2 text-gray-500 font-medium text-center">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {platforms.map(platform => (
              <tr key={platform} className="border-t border-gray-100">
                <td className="p-2 font-medium text-gray-700 whitespace-nowrap">{platform}</td>
                {days.map(day => (
                  <td key={day} className="p-1">
                    <textarea
                      value={getPost(platform, day)}
                      onChange={e => setPost(platform, day, e.target.value)}
                      placeholder="..."
                      rows={2}
                      className="w-full text-xs border border-gray-100 rounded p-1 focus:border-rural-green focus:outline-none resize-none hover:border-gray-300"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function CampaignPlanning() {
  const [activeTab, setActiveTab] = useState('checklist')

  const tabs = [
    { id: 'checklist', label: 'Checklist' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'social', label: 'Redes Sociales' },
  ]

  return (
    <div className="space-y-4">
      <div className="card bg-amber-50 border border-amber-200">
        <div className="flex items-center gap-2">
          <span className="text-xl">📋</span>
          <div>
            <h2 className="font-semibold text-amber-800">Planificacion de Campana</h2>
            <p className="text-sm text-amber-600">
              Organiza las tareas, hitos y comunicacion para lanzar y gestionar la campana en Goteo.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'checklist' && <ChecklistTab />}
        {activeTab === 'timeline' && <TimelineTab />}
        {activeTab === 'social' && <SocialMediaTab />}
      </div>
    </div>
  )
}
