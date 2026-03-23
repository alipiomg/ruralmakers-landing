import { useState, useMemo } from 'react'
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'
import { defaultContacts, defaultGroups, defaultEmailTemplates, defaultWhatsAppTemplates, socialPlatforms, sampleVariableData } from '../../data/diffusionData'

function replaceVariables(text, data) {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || match)
}

function ChannelCard({ icon, name, color, count, lastDate }) {
  return (
    <div className="card flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: color + '15' }}>
        <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-800">{name}</div>
        <div className="text-xs text-gray-400">{lastDate || 'Sin actividad'}</div>
      </div>
      <div className="text-lg font-bold" style={{ color }}>{count}</div>
    </div>
  )
}

function PanelTab({ publishLog, calendar }) {
  const emailCount = publishLog.filter(p => p.channel === 'email').length
  const whatsappCount = publishLog.filter(p => p.channel === 'whatsapp').length
  const socialCount = publishLog.filter(p => p.channel === 'social').length

  const lastEmail = publishLog.filter(p => p.channel === 'email').pop()
  const lastWhatsApp = publishLog.filter(p => p.channel === 'whatsapp').pop()
  const lastSocial = publishLog.filter(p => p.channel === 'social').pop()

  const upcoming = calendar.filter(c => c.status === 'programado').sort((a, b) => a.scheduledDate?.localeCompare(b.scheduledDate)).slice(0, 5)

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : null

  return (
    <div className="space-y-6">
      {/* Channel cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ChannelCard icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          name="Email" color="#3b82f6" count={emailCount} lastDate={formatDate(lastEmail?.date)} />
        <ChannelCard icon="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          name="WhatsApp" color="#25D366" count={whatsappCount} lastDate={formatDate(lastWhatsApp?.date)} />
        <ChannelCard icon="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          name="Redes Sociales" color="#8b5cf6" count={socialCount} lastDate={formatDate(lastSocial?.date)} />
        <ChannelCard icon="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
          name="Web/Blog" color="#f97316" count={0} lastDate={null} />
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Proximas publicaciones</h3>
          <div className="space-y-2">
            {upcoming.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="flex gap-1 shrink-0">
                  {p.platforms?.map(pid => {
                    const pl = socialPlatforms.find(x => x.id === pid)
                    return pl ? (
                      <svg key={pid} className="w-4 h-4" viewBox="0 0 24 24" fill={pl.color}><path d={pl.icon} /></svg>
                    ) : null
                  })}
                </div>
                <div className="flex-1 text-sm text-gray-700 truncate">{p.content}</div>
                <div className="text-xs text-gray-400 shrink-0">{formatDate(p.scheduledDate)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {publishLog.length > 0 ? (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Actividad reciente</h3>
          <div className="space-y-2">
            {publishLog.slice(-10).reverse().map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <span className={`w-2 h-2 rounded-full shrink-0 ${p.channel === 'email' ? 'bg-blue-500' : p.channel === 'whatsapp' ? 'bg-green-500' : 'bg-purple-500'}`} />
                <div className="flex-1 text-sm text-gray-700 truncate">{p.content}</div>
                <span className="text-xs text-gray-400">{formatDate(p.date)}</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 text-sm">
          Sin actividad aun. Usa la pestana "Componer" para enviar tu primer mensaje.
        </div>
      )}
    </div>
  )
}

function ComponerTab({ contacts, groups, emailTemplates, whatsappTemplates, publishLog, setPublishLog }) {
  const [channel, setChannel] = useState('email')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState(['twitter'])
  const [scheduleDate, setScheduleDate] = useState('')

  const audienceCount = selectedGroup
    ? contacts.filter(c => c.groups.includes(selectedGroup)).length
    : contacts.length

  const loadTemplate = (templateId) => {
    if (channel === 'email') {
      const t = emailTemplates.find(x => x.id === templateId)
      if (t) { setSubject(t.subject); setBody(t.body) }
    } else if (channel === 'whatsapp') {
      const t = whatsappTemplates.find(x => x.id === templateId)
      if (t) setBody(t.body)
    }
  }

  const simulatePublish = () => {
    if (!body.trim()) return
    const entry = {
      id: 'pub' + Date.now(),
      channel,
      content: channel === 'email' ? subject : body.slice(0, 80),
      fullContent: body,
      audience: selectedGroup ? groups.find(g => g.id === selectedGroup)?.name : 'Todos',
      audienceCount,
      date: scheduleDate || new Date().toISOString(),
      status: 'simulado',
      platforms: channel === 'social' ? selectedPlatforms : [],
    }
    setPublishLog([...publishLog, entry])
    setSubject('')
    setBody('')
    alert(`Envio simulado a ${audienceCount} contactos via ${channel}`)
  }

  return (
    <div className="space-y-4">
      {/* Channel selector */}
      <div className="flex gap-2">
        {[
          { id: 'email', label: 'Email', color: 'blue' },
          { id: 'whatsapp', label: 'WhatsApp', color: 'green' },
          { id: 'social', label: 'Red Social', color: 'purple' },
        ].map(ch => (
          <button key={ch.id} onClick={() => setChannel(ch.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${channel === ch.id ? `bg-${ch.color}-100 text-${ch.color}-700 ring-2 ring-${ch.color}-300` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {ch.label}
          </button>
        ))}
      </div>

      {/* Audience */}
      {channel !== 'social' && (
        <div className="card">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">Audiencia</div>
          <div className="flex items-center gap-3">
            <select className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white"
              value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
              <option value="">Todos los contactos ({contacts.length})</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name} ({contacts.filter(c => c.groups.includes(g.id)).length})</option>
              ))}
            </select>
            <span className="text-sm font-medium text-rural-green">{audienceCount} destinatarios</span>
          </div>
        </div>
      )}

      {/* Template quick select */}
      {(channel === 'email' || channel === 'whatsapp') && (
        <div className="card">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">Plantilla rapida</div>
          <div className="flex flex-wrap gap-2">
            {(channel === 'email' ? emailTemplates : whatsappTemplates).map(t => (
              <button key={t.id} onClick={() => loadTemplate(t.id)}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200 transition">
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Composer */}
      <div className="card space-y-3">
        {channel === 'email' && (
          <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Asunto del email"
            value={subject} onChange={e => setSubject(e.target.value)} />
        )}

        {channel === 'social' && (
          <div className="flex flex-wrap gap-2">
            {socialPlatforms.map(p => (
              <button key={p.id} onClick={() => setSelectedPlatforms(prev =>
                prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id]
              )}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${selectedPlatforms.includes(p.id) ? 'border-gray-800 bg-gray-50' : 'border-gray-200 text-gray-400'}`}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill={selectedPlatforms.includes(p.id) ? p.color : '#9ca3af'}><path d={p.icon} /></svg>
                {p.name}
              </button>
            ))}
          </div>
        )}

        <textarea className="w-full px-3 py-3 border rounded-lg text-sm resize-none" rows={6}
          placeholder={channel === 'email' ? 'Cuerpo del email...' : channel === 'whatsapp' ? 'Mensaje de WhatsApp...' : 'Escribe tu publicacion...'}
          value={body} onChange={e => setBody(e.target.value)} />

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Programar (opcional)</label>
            <input type="datetime-local" className="w-full px-3 py-2 border rounded-lg text-sm"
              value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
          </div>
          <button onClick={simulatePublish} disabled={!body.trim()}
            className="px-6 py-2 bg-rural-green text-white rounded-lg text-sm font-medium hover:bg-rural-green-dark transition disabled:opacity-40 whitespace-nowrap">
            Simular Envio
          </button>
        </div>
      </div>
    </div>
  )
}

function HistorialTab({ publishLog, setPublishLog }) {
  const [filterChannel, setFilterChannel] = useState('')

  const filtered = filterChannel
    ? publishLog.filter(p => p.channel === filterChannel)
    : publishLog

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <select className="px-3 py-2 border rounded-lg text-sm bg-white" value={filterChannel} onChange={e => setFilterChannel(e.target.value)}>
          <option value="">Todos los canales</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="social">Red Social</option>
        </select>
        {publishLog.length > 0 && (
          <button onClick={() => { if (confirm('Limpiar historial?')) setPublishLog([]) }}
            className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100 transition">
            Limpiar
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-2">
          {[...filtered].reverse().map(p => (
            <div key={p.id} className="card">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.channel === 'email' ? 'bg-blue-100 text-blue-700' : p.channel === 'whatsapp' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                  {p.channel}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(p.date).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs ml-auto">{p.status}</span>
              </div>
              <p className="text-sm text-gray-700">{p.fullContent || p.content}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <span>Audiencia: {p.audience}</span>
                <span>({p.audienceCount} contactos)</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 text-sm">Sin publicaciones en el historial</div>
      )}
    </div>
  )
}

function EstadisticasTab({ publishLog }) {
  const stats = useMemo(() => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const thisWeek = publishLog.filter(p => new Date(p.date) > weekAgo)
    const thisMonth = publishLog.filter(p => new Date(p.date) > monthAgo)

    const byChannel = { email: 0, whatsapp: 0, social: 0 }
    publishLog.forEach(p => { byChannel[p.channel] = (byChannel[p.channel] || 0) + 1 })

    // Daily activity for last 7 days
    const daily = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now)
      d.setDate(now.getDate() - (6 - i))
      const dateStr = d.toISOString().split('T')[0]
      return {
        day: d.toLocaleDateString('es', { weekday: 'short' }),
        count: publishLog.filter(p => p.date.startsWith(dateStr)).length,
      }
    })
    const maxDaily = Math.max(...daily.map(d => d.count), 1)

    return { total: publishLog.length, thisWeek: thisWeek.length, thisMonth: thisMonth.length, byChannel, daily, maxDaily }
  }, [publishLog])

  const maxChannel = Math.max(...Object.values(stats.byChannel), 1)

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Enviados</div>
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
        </div>
        <div className="card text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Esta Semana</div>
          <div className="text-2xl font-bold text-rural-green">{stats.thisWeek}</div>
        </div>
        <div className="card text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Este Mes</div>
          <div className="text-2xl font-bold text-blue-600">{stats.thisMonth}</div>
        </div>
        <div className="card text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Contactos Alcanzados</div>
          <div className="text-2xl font-bold text-amber-600">{publishLog.reduce((sum, p) => sum + (p.audienceCount || 0), 0)}</div>
        </div>
      </div>

      {/* By channel */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Por canal</h3>
        <div className="space-y-3">
          {[
            { key: 'email', label: 'Email', color: '#3b82f6' },
            { key: 'whatsapp', label: 'WhatsApp', color: '#25D366' },
            { key: 'social', label: 'Redes Sociales', color: '#8b5cf6' },
          ].map(ch => (
            <div key={ch.key} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-28">{ch.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(stats.byChannel[ch.key] / maxChannel) * 100}%`, backgroundColor: ch.color }} />
              </div>
              <span className="text-sm font-bold text-gray-700 w-8 text-right">{stats.byChannel[ch.key]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily activity */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Actividad diaria (ultimos 7 dias)</h3>
        <div className="flex items-end gap-2 h-32">
          {stats.daily.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-gray-700">{d.count}</span>
              <div className="w-full bg-gray-100 rounded-t flex-1 relative">
                <div className="absolute bottom-0 w-full bg-rural-green rounded-t transition-all duration-500"
                  style={{ height: `${(d.count / stats.maxDaily) * 100}%`, minHeight: d.count > 0 ? '4px' : '0' }} />
              </div>
              <span className="text-xs text-gray-500">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PublishPanel() {
  const [contacts] = useLocalStorage('rm-crm-contacts', defaultContacts)
  const [groups] = useLocalStorage('rm-crm-groups', defaultGroups)
  const [emailTemplates] = useLocalStorage('rm-templates-email', defaultEmailTemplates)
  const [whatsappTemplates] = useLocalStorage('rm-templates-whatsapp', defaultWhatsAppTemplates)
  const [calendar] = useLocalStorage('rm-content-calendar', [])
  const [publishLog, setPublishLog] = useLocalStorage('rm-publish-log', [])
  const [activeTab, setActiveTab] = useState('Panel')

  const tabs = ['Panel', 'Componer', 'Historial', 'Estadisticas']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-rural-green to-rural-green-dark text-white">
        <h2 className="text-xl font-bold">Panel de Publicacion</h2>
        <p className="text-sm opacity-90 mt-1">Gestiona y rastrea todas tus comunicaciones desde un solo lugar</p>
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

      {activeTab === 'Panel' && <PanelTab publishLog={publishLog} calendar={calendar} />}
      {activeTab === 'Componer' && (
        <ComponerTab contacts={contacts} groups={groups}
          emailTemplates={emailTemplates} whatsappTemplates={whatsappTemplates}
          publishLog={publishLog} setPublishLog={setPublishLog} />
      )}
      {activeTab === 'Historial' && <HistorialTab publishLog={publishLog} setPublishLog={setPublishLog} />}
      {activeTab === 'Estadisticas' && <EstadisticasTab publishLog={publishLog} />}
    </div>
  )
}
