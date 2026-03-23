import { useState, useMemo } from 'react'
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'
import { defaultContentTemplates, defaultHashtags, socialPlatforms, contentCategories, sampleVariableData } from '../../data/diffusionData'

function replaceVariables(text, data) {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || match)
}

function PlatformIcon({ platform, size = 'w-5 h-5' }) {
  return (
    <svg className={size} viewBox="0 0 24 24" fill={platform.color}>
      <path d={platform.icon} />
    </svg>
  )
}

function CrearTab({ drafts, setDrafts, calendar, setCalendar }) {
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState(['twitter'])
  const [showSchedule, setShowSchedule] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [copied, setCopied] = useState(false)

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const addHashtag = (tag) => {
    if (!content.includes(tag)) {
      setContent(prev => prev + (prev.endsWith(' ') || !prev ? '' : ' ') + tag)
    }
  }

  const copyContent = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveDraft = () => {
    if (!content.trim()) return
    setDrafts(prev => [...prev, {
      id: 'd' + Date.now(),
      content,
      platforms: selectedPlatforms,
      createdAt: new Date().toISOString(),
      status: 'borrador'
    }])
    setContent('')
  }

  const schedulePost = () => {
    if (!content.trim() || !scheduleDate) return
    setCalendar(prev => [...prev, {
      id: 'cal' + Date.now(),
      content,
      platforms: selectedPlatforms,
      scheduledDate: scheduleDate,
      status: 'programado',
      hashtags: defaultHashtags.filter(h => content.includes(h)),
    }])
    setContent('')
    setScheduleDate('')
    setShowSchedule(false)
  }

  return (
    <div className="space-y-4">
      {/* Platform Selector */}
      <div className="card">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">Plataformas</div>
        <div className="flex flex-wrap gap-2">
          {socialPlatforms.map(p => (
            <button key={p.id} onClick={() => togglePlatform(p.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition border ${selectedPlatforms.includes(p.id) ? 'border-gray-800 bg-gray-50' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
              <PlatformIcon platform={p} />
              <span className={selectedPlatforms.includes(p.id) ? 'text-gray-800' : 'text-gray-400'}>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="card">
        <textarea className="w-full px-3 py-3 border rounded-lg text-sm resize-none" rows={6}
          placeholder="Escribe tu publicacion aqui..."
          value={content} onChange={e => setContent(e.target.value)} />

        {/* Character counts */}
        <div className="flex flex-wrap gap-3 mt-2">
          {selectedPlatforms.map(pid => {
            const p = socialPlatforms.find(pl => pl.id === pid)
            if (!p) return null
            const pct = (content.length / p.maxChars) * 100
            const color = pct > 100 ? 'text-red-600' : pct > 90 ? 'text-amber-600' : 'text-gray-500'
            return (
              <div key={pid} className={`text-xs ${color} flex items-center gap-1`}>
                <PlatformIcon platform={p} size="w-3 h-3" />
                {content.length}/{p.maxChars}
                {pct > 100 && <span className="text-red-600 font-medium">!</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Hashtags */}
      <div className="card">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">Hashtags sugeridos</div>
        <div className="flex flex-wrap gap-1">
          {defaultHashtags.map(tag => (
            <button key={tag} onClick={() => addHashtag(tag)}
              className={`px-2 py-1 rounded-full text-xs font-medium transition ${content.includes(tag) ? 'bg-rural-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button onClick={copyContent} disabled={!content.trim()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition disabled:opacity-40">
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
        <button onClick={saveDraft} disabled={!content.trim()}
          className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200 transition disabled:opacity-40">
          Guardar Borrador
        </button>
        <button onClick={() => setShowSchedule(!showSchedule)} disabled={!content.trim()}
          className="px-4 py-2 bg-rural-green text-white rounded-lg text-sm font-medium hover:bg-rural-green-dark transition disabled:opacity-40">
          Programar
        </button>
      </div>

      {showSchedule && (
        <div className="card border-2 border-rural-green/30">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Fecha y hora de publicacion</label>
              <input type="datetime-local" className="w-full px-3 py-2 border rounded-lg text-sm"
                value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
            </div>
            <button onClick={schedulePost}
              className="px-4 py-2 bg-rural-green text-white rounded-lg text-sm font-medium hover:bg-rural-green-dark transition">
              Confirmar
            </button>
          </div>
        </div>
      )}

      {/* Drafts */}
      {drafts.length > 0 && (
        <div className="card">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">Borradores ({drafts.length})</div>
          <div className="space-y-2">
            {drafts.map(d => (
              <div key={d.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                <div className="flex-1 text-sm text-gray-700 line-clamp-2">{d.content}</div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => { setContent(d.content); setSelectedPlatforms(d.platforms); setDrafts(drafts.filter(x => x.id !== d.id)) }}
                    className="text-xs text-blue-600 hover:text-blue-800">Usar</button>
                  <button onClick={() => setDrafts(drafts.filter(x => x.id !== d.id))}
                    className="text-xs text-red-500 hover:text-red-700">Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PlantillasTab({ templates, setContent, setTab }) {
  const sampleData = sampleVariableData

  const loadTemplate = (template, platformId) => {
    const text = replaceVariables(template.platforms[platformId], sampleData)
    // We can't directly set parent state easily, so we use a simple approach
    navigator.clipboard.writeText(text)
    alert('Contenido copiado al portapapeles. Pegalo en el compositor.')
  }

  return (
    <div className="space-y-4">
      {contentCategories.map(cat => {
        const catTemplates = templates.filter(t => t.category === cat.id)
        if (catTemplates.length === 0) return null
        return (
          <div key={cat.id}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-sm font-semibold text-gray-700">{cat.label}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {catTemplates.map(t => (
                <div key={t.id} className="card">
                  <h4 className="font-medium text-sm text-gray-800 mb-2">{t.name}</h4>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {t.hashtags.map(h => (
                      <span key={h} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">{h}</span>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {socialPlatforms.map(p => {
                      if (!t.platforms[p.id]) return null
                      return (
                        <div key={p.id} className="group">
                          <button onClick={() => loadTemplate(t, p.id)}
                            className="w-full text-left p-2 rounded-lg border border-gray-100 hover:border-gray-300 transition">
                            <div className="flex items-center gap-2 mb-1">
                              <PlatformIcon platform={p} size="w-4 h-4" />
                              <span className="text-xs font-medium text-gray-600">{p.name}</span>
                              <span className="text-xs text-gray-400 ml-auto opacity-0 group-hover:opacity-100">Copiar</span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {replaceVariables(t.platforms[p.id], sampleData).slice(0, 100)}...
                            </p>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function CalendarioTab({ calendar, setCalendar }) {
  const [weekOffset, setWeekOffset] = useState(0)

  const weekDays = useMemo(() => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7) // Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      return d
    })
  }, [weekOffset])

  const dayNames = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

  const getPostsForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return calendar.filter(p => p.scheduledDate && p.scheduledDate.startsWith(dateStr))
  }

  const deletePost = (id) => {
    setCalendar(calendar.filter(p => p.id !== id))
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setWeekOffset(w => w - 1)}
          className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition">
          Anterior
        </button>
        <span className="text-sm font-medium text-gray-700">
          {weekDays[0].toLocaleDateString('es', { day: 'numeric', month: 'short' })} - {weekDays[6].toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <button onClick={() => setWeekOffset(w => w + 1)}
          className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition">
          Siguiente
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((date, i) => {
          const posts = getPostsForDay(date)
          return (
            <div key={i} className={`card min-h-[120px] ${isToday(date) ? 'ring-2 ring-rural-green' : ''}`}>
              <div className={`text-xs font-medium mb-1 ${isToday(date) ? 'text-rural-green' : 'text-gray-500'}`}>
                {dayNames[i]}
              </div>
              <div className={`text-lg font-bold mb-2 ${isToday(date) ? 'text-rural-green' : 'text-gray-800'}`}>
                {date.getDate()}
              </div>
              <div className="space-y-1">
                {posts.map(p => (
                  <div key={p.id} className="group relative">
                    <div className={`px-1.5 py-0.5 rounded text-xs truncate cursor-pointer ${p.status === 'publicado' ? 'bg-green-100 text-green-700' : p.status === 'programado' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                      {p.content.slice(0, 20)}
                    </div>
                    <button onClick={() => deletePost(p.id)}
                      className="hidden group-hover:block absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs leading-none">
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Upcoming posts */}
      {calendar.length > 0 && (
        <div className="card">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">
            Publicaciones programadas ({calendar.length})
          </div>
          <div className="space-y-2">
            {calendar.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate)).map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="flex gap-1 shrink-0">
                  {p.platforms.map(pid => {
                    const pl = socialPlatforms.find(x => x.id === pid)
                    return pl ? <PlatformIcon key={pid} platform={pl} size="w-4 h-4" /> : null
                  })}
                </div>
                <div className="flex-1 text-sm text-gray-700 truncate">{p.content}</div>
                <div className="text-xs text-gray-400 shrink-0">
                  {p.scheduledDate ? new Date(p.scheduledDate).toLocaleDateString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'publicado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {calendar.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          No hay publicaciones programadas. Crea contenido en la pestana "Crear" y programalo.
        </div>
      )}
    </div>
  )
}

export default function ContentGenerator() {
  const [contentTemplates] = useLocalStorage('rm-content-templates', defaultContentTemplates)
  const [calendar, setCalendar] = useLocalStorage('rm-content-calendar', [])
  const [drafts, setDrafts] = useLocalStorage('rm-content-drafts', [])
  const [activeTab, setActiveTab] = useState('Crear')

  const tabs = ['Crear', 'Plantillas', 'Calendario']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-rural-green to-rural-green-dark text-white">
        <h2 className="text-xl font-bold">Generador de Contenido</h2>
        <p className="text-sm opacity-90 mt-1">Crea y programa publicaciones para redes sociales</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Plantillas</div>
          <div className="text-2xl font-bold text-rural-green">{contentTemplates.length}</div>
        </div>
        <div className="card text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Programados</div>
          <div className="text-2xl font-bold text-amber-600">{calendar.filter(c => c.status === 'programado').length}</div>
        </div>
        <div className="card text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Borradores</div>
          <div className="text-2xl font-bold text-blue-600">{drafts.length}</div>
        </div>
        <div className="card text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Publicados</div>
          <div className="text-2xl font-bold text-green-600">{calendar.filter(c => c.status === 'publicado').length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`tab-btn flex-1 ${activeTab === tab ? 'active' : ''}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Crear' && <CrearTab drafts={drafts} setDrafts={setDrafts} calendar={calendar} setCalendar={setCalendar} />}
      {activeTab === 'Plantillas' && <PlantillasTab templates={contentTemplates} />}
      {activeTab === 'Calendario' && <CalendarioTab calendar={calendar} setCalendar={setCalendar} />}
    </div>
  )
}
