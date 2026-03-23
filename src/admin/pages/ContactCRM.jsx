import { useState, useMemo } from 'react'
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'
import { defaultContacts, defaultGroups, availableTags } from '../../data/diffusionData'

function StatsCard({ label, value, color = 'text-gray-800' }) {
  return (
    <div className="card text-center">
      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  )
}

function ContactForm({ contact, groups, onSave, onCancel }) {
  const [form, setForm] = useState(contact || {
    name: '', email: '', phone: '', organization: '', tags: [], groups: [], notes: ''
  })

  const toggleTag = (tag) => {
    setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }))
  }

  const toggleGroup = (gid) => {
    setForm(f => ({ ...f, groups: f.groups.includes(gid) ? f.groups.filter(g => g !== gid) : [...f.groups, gid] }))
  }

  return (
    <div className="card border-2 border-rural-green/30 space-y-3">
      <h3 className="font-semibold text-gray-800">{contact ? 'Editar Contacto' : 'Nuevo Contacto'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Nombre *" value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Email" value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Telefono" value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Organizacion" value={form.organization}
          onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} />
      </div>
      <div>
        <div className="text-xs text-gray-500 mb-1">Tags</div>
        <div className="flex flex-wrap gap-1">
          {availableTags.map(tag => (
            <button key={tag} onClick={() => toggleTag(tag)}
              className={`px-2 py-0.5 rounded-full text-xs font-medium transition ${form.tags.includes(tag) ? 'bg-rural-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 mb-1">Grupos</div>
        <div className="flex flex-wrap gap-1">
          {groups.map(g => (
            <button key={g.id} onClick={() => toggleGroup(g.id)}
              className={`px-2 py-0.5 rounded-full text-xs font-medium transition`}
              style={form.groups.includes(g.id) ? { backgroundColor: g.color, color: 'white' } : { backgroundColor: '#f3f4f6', color: '#4b5563' }}>
              {g.name}
            </button>
          ))}
        </div>
      </div>
      <textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} placeholder="Notas"
        value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
      <div className="flex gap-2">
        <button onClick={() => { if (form.name.trim()) onSave(form) }}
          className="px-4 py-2 bg-rural-green text-white rounded-lg text-sm font-medium hover:bg-rural-green-dark transition">
          Guardar
        </button>
        <button onClick={onCancel} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition">
          Cancelar
        </button>
      </div>
    </div>
  )
}

function ContactosTab({ contacts, setContacts, groups, setGroups }) {
  const [search, setSearch] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [filterGroup, setFilterGroup] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [copied, setCopied] = useState('')

  const filtered = useMemo(() => {
    return contacts.filter(c => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.organization.toLowerCase().includes(search.toLowerCase())
      const matchTag = !filterTag || c.tags.includes(filterTag)
      const matchGroup = !filterGroup || c.groups.includes(filterGroup)
      return matchSearch && matchTag && matchGroup
    })
  }, [contacts, search, filterTag, filterGroup])

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email)
    setCopied(email)
    setTimeout(() => setCopied(''), 2000)
  }

  const saveContact = (form) => {
    if (editingContact) {
      setContacts(contacts.map(c => c.id === editingContact.id ? { ...form, id: c.id, createdAt: c.createdAt } : c))
    } else {
      setContacts([...contacts, { ...form, id: 'c' + Date.now(), createdAt: new Date().toISOString().split('T')[0] }])
    }
    setShowForm(false)
    setEditingContact(null)
  }

  const deleteContact = (id) => {
    if (confirm('Eliminar este contacto?')) {
      setContacts(contacts.filter(c => c.id !== id))
      setExpandedId(null)
    }
  }

  const addToGroup = (contactId, groupId) => {
    setContacts(contacts.map(c =>
      c.id === contactId && !c.groups.includes(groupId)
        ? { ...c, groups: [...c.groups, groupId] }
        : c
    ))
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input className="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="Buscar por nombre, email u organizacion..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="px-3 py-2 border rounded-lg text-sm bg-white" value={filterTag} onChange={e => setFilterTag(e.target.value)}>
          <option value="">Todos los tags</option>
          {availableTags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="px-3 py-2 border rounded-lg text-sm bg-white" value={filterGroup} onChange={e => setFilterGroup(e.target.value)}>
          <option value="">Todos los grupos</option>
          {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <button onClick={() => { setShowForm(true); setEditingContact(null) }}
          className="px-4 py-2 bg-rural-green text-white rounded-lg text-sm font-medium hover:bg-rural-green-dark transition whitespace-nowrap">
          + Contacto
        </button>
      </div>

      {showForm && (
        <ContactForm contact={editingContact} groups={groups} onSave={saveContact} onCancel={() => { setShowForm(false); setEditingContact(null) }} />
      )}

      {/* Contact List */}
      <div className="space-y-2">
        {filtered.map(c => (
          <div key={c.id} className="card">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}>
              <div className="w-10 h-10 rounded-full bg-rural-green/10 flex items-center justify-center text-rural-green font-bold text-sm shrink-0">
                {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-800 truncate">{c.name}</div>
                <div className="text-xs text-gray-500 truncate">{c.organization || c.email}</div>
              </div>
              <div className="hidden sm:flex gap-1">
                {c.tags.slice(0, 3).map(t => (
                  <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{t}</span>
                ))}
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedId === c.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {expandedId === c.id && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-500">Email:</span> <span className="text-gray-800">{c.email}</span></div>
                  <div><span className="text-gray-500">Telefono:</span> <span className="text-gray-800">{c.phone}</span></div>
                  <div><span className="text-gray-500">Organizacion:</span> <span className="text-gray-800">{c.organization || '-'}</span></div>
                  <div><span className="text-gray-500">Anadido:</span> <span className="text-gray-800">{c.createdAt}</span></div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {c.tags.map(t => <span key={t} className="px-2 py-0.5 bg-rural-green/10 text-rural-green rounded-full text-xs font-medium">{t}</span>)}
                </div>

                <div className="flex flex-wrap gap-1">
                  {c.groups.map(gid => {
                    const g = groups.find(gr => gr.id === gid)
                    return g ? <span key={gid} className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: g.color }}>{g.name}</span> : null
                  })}
                </div>

                {c.notes && <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{c.notes}</p>}

                <div className="flex flex-wrap gap-2">
                  <button onClick={() => copyEmail(c.email)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 transition">
                    {copied === c.email ? 'Copiado!' : 'Copiar email'}
                  </button>
                  {c.phone && (
                    <a href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition">
                      WhatsApp
                    </a>
                  )}
                  <div className="relative group">
                    <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs hover:bg-blue-100 transition">
                      + Grupo
                    </button>
                    <div className="hidden group-hover:block absolute left-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 p-1 min-w-[160px]">
                      {groups.filter(g => !c.groups.includes(g.id)).map(g => (
                        <button key={g.id} onClick={() => addToGroup(c.id, g.id)}
                          className="block w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 rounded">
                          {g.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => { setEditingContact(c); setShowForm(true) }}
                    className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs hover:bg-amber-100 transition">
                    Editar
                  </button>
                  <button onClick={() => deleteContact(c.id)}
                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100 transition">
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">No se encontraron contactos</div>
        )}
      </div>
    </div>
  )
}

function GruposTab({ contacts, setContacts, groups, setGroups }) {
  const [showForm, setShowForm] = useState(false)
  const [newGroup, setNewGroup] = useState({ name: '', description: '', color: '#4a7c59' })
  const [expandedGroup, setExpandedGroup] = useState(null)
  const presetColors = ['#4a7c59', '#D4A843', '#3b82f6', '#8b5cf6', '#ef4444', '#8B6914', '#06b6d4', '#f97316']

  const createGroup = () => {
    if (!newGroup.name.trim()) return
    setGroups([...groups, { ...newGroup, id: 'g' + Date.now() }])
    setNewGroup({ name: '', description: '', color: '#4a7c59' })
    setShowForm(false)
  }

  const deleteGroup = (gid) => {
    if (!confirm('Eliminar este grupo?')) return
    setGroups(groups.filter(g => g.id !== gid))
    setContacts(contacts.map(c => ({ ...c, groups: c.groups.filter(g => g !== gid) })))
  }

  const removeFromGroup = (contactId, groupId) => {
    setContacts(contacts.map(c =>
      c.id === contactId ? { ...c, groups: c.groups.filter(g => g !== groupId) } : c
    ))
  }

  return (
    <div className="space-y-4">
      <button onClick={() => setShowForm(!showForm)}
        className="px-4 py-2 bg-rural-green text-white rounded-lg text-sm font-medium hover:bg-rural-green-dark transition">
        + Nuevo Grupo
      </button>

      {showForm && (
        <div className="card border-2 border-rural-green/30 space-y-3">
          <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Nombre del grupo *"
            value={newGroup.name} onChange={e => setNewGroup(g => ({ ...g, name: e.target.value }))} />
          <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Descripcion"
            value={newGroup.description} onChange={e => setNewGroup(g => ({ ...g, description: e.target.value }))} />
          <div>
            <div className="text-xs text-gray-500 mb-1">Color</div>
            <div className="flex gap-2">
              {presetColors.map(c => (
                <button key={c} onClick={() => setNewGroup(g => ({ ...g, color: c }))}
                  className={`w-7 h-7 rounded-full border-2 transition ${newGroup.color === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={createGroup} className="px-4 py-2 bg-rural-green text-white rounded-lg text-sm font-medium hover:bg-rural-green-dark transition">Crear</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition">Cancelar</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map(g => {
          const members = contacts.filter(c => c.groups.includes(g.id))
          return (
            <div key={g.id} className="card">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpandedGroup(expandedGroup === g.id ? null : g.id)}>
                <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                <div className="flex-1">
                  <div className="font-medium text-sm">{g.name}</div>
                  <div className="text-xs text-gray-500">{members.length} miembros</div>
                </div>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedGroup === g.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {g.description && <p className="text-xs text-gray-500 mt-1">{g.description}</p>}

              {expandedGroup === g.id && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  {members.map(m => (
                    <div key={m.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{m.name}</span>
                      <button onClick={() => removeFromGroup(m.id, g.id)} className="text-xs text-red-500 hover:text-red-700">Quitar</button>
                    </div>
                  ))}
                  {members.length === 0 && <p className="text-xs text-gray-400">Sin miembros</p>}
                  <button onClick={() => deleteGroup(g.id)} className="text-xs text-red-500 hover:text-red-700 mt-2">Eliminar grupo</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ImportExportTab({ contacts, setContacts }) {
  const [preview, setPreview] = useState(null)

  const exportCSV = () => {
    const headers = 'Nombre,Email,Telefono,Organizacion,Tags,Grupos,Notas'
    const rows = contacts.map(c =>
      [c.name, c.email, c.phone, c.organization, c.tags.join(';'), c.groups.join(';'), `"${(c.notes || '').replace(/"/g, '""')}"`].join(',')
    )
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ruralmakers-contactos-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const lines = ev.target.result.split('\n').filter(l => l.trim())
      if (lines.length < 2) return
      const parsed = lines.slice(1).map((line, i) => {
        const parts = line.match(/(".*?"|[^,]+)/g) || []
        return {
          id: 'ci' + Date.now() + i,
          name: (parts[0] || '').replace(/"/g, '').trim(),
          email: (parts[1] || '').replace(/"/g, '').trim(),
          phone: (parts[2] || '').replace(/"/g, '').trim(),
          organization: (parts[3] || '').replace(/"/g, '').trim(),
          tags: (parts[4] || '').replace(/"/g, '').split(';').filter(Boolean),
          groups: (parts[5] || '').replace(/"/g, '').split(';').filter(Boolean),
          notes: (parts[6] || '').replace(/"/g, '').trim(),
          createdAt: new Date().toISOString().split('T')[0],
        }
      }).filter(c => c.name)
      setPreview(parsed)
    }
    reader.readAsText(file)
  }

  const confirmImport = () => {
    if (!preview) return
    setContacts([...contacts, ...preview])
    setPreview(null)
  }

  return (
    <div className="space-y-6">
      {/* Export */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-2">Exportar Contactos</h3>
        <p className="text-sm text-gray-500 mb-3">Descarga todos tus contactos en formato CSV.</p>
        <button onClick={exportCSV}
          className="px-4 py-2 bg-rural-green text-white rounded-lg text-sm font-medium hover:bg-rural-green-dark transition">
          Descargar CSV ({contacts.length} contactos)
        </button>
      </div>

      {/* Import */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-2">Importar Contactos</h3>
        <p className="text-sm text-gray-500 mb-3">Sube un archivo CSV con columnas: Nombre, Email, Telefono, Organizacion, Tags, Grupos, Notas</p>
        <input type="file" accept=".csv" onChange={handleImport}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-rural-green file:text-white hover:file:bg-rural-green-dark file:cursor-pointer" />

        {preview && (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium text-gray-700">{preview.length} contactos detectados:</p>
            <div className="max-h-60 overflow-auto border rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left">Nombre</th>
                    <th className="px-3 py-2 text-left">Email</th>
                    <th className="px-3 py-2 text-left">Organizacion</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map(c => (
                    <tr key={c.id} className="border-t">
                      <td className="px-3 py-1.5">{c.name}</td>
                      <td className="px-3 py-1.5">{c.email}</td>
                      <td className="px-3 py-1.5">{c.organization}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2">
              <button onClick={confirmImport}
                className="px-4 py-2 bg-rural-green text-white rounded-lg text-sm font-medium hover:bg-rural-green-dark transition">
                Importar {preview.length} contactos
              </button>
              <button onClick={() => setPreview(null)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ContactCRM() {
  const [contacts, setContacts] = useLocalStorage('rm-crm-contacts', defaultContacts)
  const [groups, setGroups] = useLocalStorage('rm-crm-groups', defaultGroups)
  const [activeTab, setActiveTab] = useState('Contactos')

  const tabs = ['Contactos', 'Grupos', 'Importar/Exportar']

  const uniqueTags = [...new Set(contacts.flatMap(c => c.tags))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-rural-green to-rural-green-dark text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">CRM de Contactos</h2>
            <p className="text-sm opacity-90 mt-1">Gestiona tu red de contactos y grupos para difusion</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard label="Total Contactos" value={contacts.length} color="text-rural-green" />
        <StatsCard label="Grupos Activos" value={groups.length} color="text-blue-600" />
        <StatsCard label="Tags" value={uniqueTags.length} color="text-amber-600" />
        <StatsCard label="Ultimos 7 dias" value={contacts.filter(c => {
          const d = new Date(c.createdAt)
          return (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000
        }).length} color="text-purple-600" />
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

      {/* Tab Content */}
      {activeTab === 'Contactos' && <ContactosTab contacts={contacts} setContacts={setContacts} groups={groups} setGroups={setGroups} />}
      {activeTab === 'Grupos' && <GruposTab contacts={contacts} setContacts={setContacts} groups={groups} setGroups={setGroups} />}
      {activeTab === 'Importar/Exportar' && <ImportExportTab contacts={contacts} setContacts={setContacts} />}
    </div>
  )
}
