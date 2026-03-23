import { useState } from 'react'
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'
import { defaultEmailTemplates, defaultWhatsAppTemplates, sampleVariableData, templateCategories } from '../../data/diffusionData'

function replaceVariables(text, data) {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || match)
}

function highlightVariables(text) {
  return text.split(/(\{\{\w+\}\})/).map((part, i) =>
    part.match(/\{\{\w+\}\}/)
      ? <span key={i} className="bg-rural-green/20 text-rural-green font-medium px-1 rounded">{part}</span>
      : part
  )
}

function EmailTab({ templates, setTemplates, sampleData }) {
  const [selectedId, setSelectedId] = useState(templates[0]?.id || null)
  const [editing, setEditing] = useState(false)
  const [copied, setCopied] = useState(false)

  const selected = templates.find(t => t.id === selectedId)

  const updateTemplate = (field, value) => {
    setTemplates(templates.map(t => t.id === selectedId ? { ...t, [field]: value } : t))
  }

  const createTemplate = () => {
    const newT = { id: 'et' + Date.now(), name: 'Nueva plantilla', category: 'bienvenida', subject: '', body: '' }
    setTemplates([...templates, newT])
    setSelectedId(newT.id)
    setEditing(true)
  }

  const deleteTemplate = (id) => {
    if (!confirm('Eliminar esta plantilla?')) return
    const remaining = templates.filter(t => t.id !== id)
    setTemplates(remaining)
    if (selectedId === id) setSelectedId(remaining[0]?.id || null)
  }

  const copyBody = () => {
    if (!selected) return
    navigator.clipboard.writeText(replaceVariables(selected.body, sampleData))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Template List */}
      <div className="space-y-2">
        <button onClick={createTemplate}
          className="w-full px-3 py-2 bg-rural-green text-white rounded-lg text-sm font-medium hover:bg-rural-green-dark transition">
          + Nueva Plantilla
        </button>
        {templateCategories.map(cat => {
          const catTemplates = templates.filter(t => t.category === cat.id)
          if (catTemplates.length === 0) return null
          return (
            <div key={cat.id}>
              <div className="text-xs text-gray-500 uppercase tracking-wide px-2 pt-3 pb-1 font-semibold">{cat.label}</div>
              {catTemplates.map(t => (
                <button key={t.id} onClick={() => { setSelectedId(t.id); setEditing(false) }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${selectedId === t.id ? 'bg-rural-green/10 text-rural-green font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                  {t.name}
                </button>
              ))}
            </div>
          )
        })}
      </div>

      {/* Editor / Preview */}
      {selected && (
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button onClick={() => setEditing(!editing)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${editing ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {editing ? 'Editando' : 'Editar'}
              </button>
              <button onClick={copyBody}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200 transition">
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <button onClick={() => deleteTemplate(selected.id)}
              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100 transition">
              Eliminar
            </button>
          </div>

          {editing ? (
            <div className="card space-y-3">
              <input className="w-full px-3 py-2 border rounded-lg text-sm font-medium" placeholder="Nombre de la plantilla"
                value={selected.name} onChange={e => updateTemplate('name', e.target.value)} />
              <select className="px-3 py-2 border rounded-lg text-sm bg-white" value={selected.category}
                onChange={e => updateTemplate('category', e.target.value)}>
                {templateCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Asunto del email"
                value={selected.subject} onChange={e => updateTemplate('subject', e.target.value)} />
              <textarea className="w-full px-3 py-2 border rounded-lg text-sm font-mono" rows={12} placeholder="Cuerpo del email..."
                value={selected.body} onChange={e => updateTemplate('body', e.target.value)} />
              <p className="text-xs text-gray-400">Variables disponibles: {'{{nombre}}'}, {'{{grupo}}'}, {'{{facendera}}'}, {'{{fecha}}'}, {'{{organizacion}}'}, {'{{enlace_goteo}}'}</p>
            </div>
          ) : (
            <div className="card">
              <div className="border rounded-lg overflow-hidden">
                {/* Email header */}
                <div className="bg-rural-green p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">RM</div>
                    <span className="text-sm font-medium">Rural Makers</span>
                  </div>
                  <div className="text-sm opacity-90">Asunto: {highlightVariables(replaceVariables(selected.subject, sampleData))}</div>
                </div>
                {/* Email body */}
                <div className="p-4 bg-white">
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {highlightVariables(replaceVariables(selected.body, sampleData))}
                  </div>
                </div>
                {/* Email footer */}
                <div className="bg-gray-50 px-4 py-3 border-t">
                  <p className="text-xs text-gray-400 text-center">Rural Makers - Tejiendo Facenderas | Asociacion Indira</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function WhatsAppTab({ templates, setTemplates, sampleData }) {
  const [selectedId, setSelectedId] = useState(templates[0]?.id || null)
  const [editing, setEditing] = useState(false)
  const [copied, setCopied] = useState(false)

  const selected = templates.find(t => t.id === selectedId)

  const updateTemplate = (field, value) => {
    setTemplates(templates.map(t => t.id === selectedId ? { ...t, [field]: value } : t))
  }

  const createTemplate = () => {
    const newT = { id: 'wt' + Date.now(), name: 'Nuevo mensaje', category: 'bienvenida', body: '' }
    setTemplates([...templates, newT])
    setSelectedId(newT.id)
    setEditing(true)
  }

  const deleteTemplate = (id) => {
    if (!confirm('Eliminar esta plantilla?')) return
    const remaining = templates.filter(t => t.id !== id)
    setTemplates(remaining)
    if (selectedId === id) setSelectedId(remaining[0]?.id || null)
  }

  const copyBody = () => {
    if (!selected) return
    navigator.clipboard.writeText(replaceVariables(selected.body, sampleData))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = () => {
    if (!selected) return
    const text = encodeURIComponent(replaceVariables(selected.body, sampleData))
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Template List */}
      <div className="space-y-2">
        <button onClick={createTemplate}
          className="w-full px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition">
          + Nuevo Mensaje
        </button>
        {templates.map(t => (
          <button key={t.id} onClick={() => { setSelectedId(t.id); setEditing(false) }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${selectedId === t.id ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
            {t.name}
            <span className="block text-xs text-gray-400">{t.category}</span>
          </button>
        ))}
      </div>

      {/* Editor / Preview */}
      {selected && (
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button onClick={() => setEditing(!editing)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${editing ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {editing ? 'Editando' : 'Editar'}
              </button>
              <button onClick={copyBody}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200 transition">
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
              <button onClick={shareWhatsApp}
                className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition">
                Compartir via WhatsApp
              </button>
            </div>
            <button onClick={() => deleteTemplate(selected.id)}
              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100 transition">
              Eliminar
            </button>
          </div>

          {editing ? (
            <div className="card space-y-3">
              <input className="w-full px-3 py-2 border rounded-lg text-sm font-medium" placeholder="Nombre del mensaje"
                value={selected.name} onChange={e => updateTemplate('name', e.target.value)} />
              <select className="px-3 py-2 border rounded-lg text-sm bg-white" value={selected.category}
                onChange={e => updateTemplate('category', e.target.value)}>
                {templateCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={6} placeholder="Mensaje de WhatsApp..."
                value={selected.body} onChange={e => updateTemplate('body', e.target.value)} />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Variables: {'{{nombre}}'}, {'{{facendera}}'}, {'{{fecha}}'}</span>
                <span>{selected.body.length} caracteres</span>
              </div>
            </div>
          ) : (
            <div className="card">
              {/* WhatsApp preview */}
              <div className="bg-[#e5ddd5] rounded-lg p-4 min-h-[200px] flex items-end">
                <div className="bg-[#dcf8c6] rounded-lg rounded-br-none p-3 max-w-[80%] ml-auto shadow-sm">
                  <div className="text-sm text-gray-800 whitespace-pre-wrap">
                    {replaceVariables(selected.body, sampleData)}
                  </div>
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function VariablesTab({ sampleData, setSampleData }) {
  const variables = [
    { key: 'nombre', desc: 'Nombre completo del contacto' },
    { key: 'grupo', desc: 'Nombre del grupo al que pertenece' },
    { key: 'facendera', desc: 'Nombre de la facendera o evento' },
    { key: 'fecha', desc: 'Fecha del evento o actividad' },
    { key: 'organizacion', desc: 'Organizacion del contacto' },
    { key: 'enlace_goteo', desc: 'URL del proyecto en Goteo' },
  ]

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-3">Variables Disponibles</h3>
        <p className="text-sm text-gray-500 mb-4">Usa estas variables en tus plantillas. Se reemplazaran automaticamente con los datos del contacto.</p>
        <div className="space-y-3">
          {variables.map(v => (
            <div key={v.key} className="flex flex-col sm:flex-row sm:items-center gap-2 pb-3 border-b border-gray-100 last:border-0">
              <div className="sm:w-1/4">
                <code className="px-2 py-1 bg-rural-green/10 text-rural-green rounded text-sm font-mono">{`{{${v.key}}}`}</code>
              </div>
              <div className="sm:w-1/4 text-sm text-gray-500">{v.desc}</div>
              <div className="sm:w-1/2">
                <input className="w-full px-3 py-2 border rounded-lg text-sm" value={sampleData[v.key] || ''}
                  onChange={e => setSampleData({ ...sampleData, [v.key]: e.target.value })}
                  placeholder={`Valor de ejemplo para ${v.key}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-amber-50 border border-amber-200">
        <h4 className="font-medium text-amber-800 text-sm mb-1">Datos de ejemplo</h4>
        <p className="text-xs text-amber-600">Estos valores se usan para previsualizar las plantillas. Modifica los campos arriba para ver como quedan tus mensajes con datos reales.</p>
      </div>
    </div>
  )
}

export default function Templates() {
  const [emailTemplates, setEmailTemplates] = useLocalStorage('rm-templates-email', defaultEmailTemplates)
  const [whatsappTemplates, setWhatsappTemplates] = useLocalStorage('rm-templates-whatsapp', defaultWhatsAppTemplates)
  const [sampleData, setSampleData] = useLocalStorage('rm-templates-sample-data', sampleVariableData)
  const [activeTab, setActiveTab] = useState('Email')

  const tabs = ['Email', 'WhatsApp', 'Variables']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-rural-green to-rural-green-dark text-white">
        <h2 className="text-xl font-bold">Plantillas de Mensajes</h2>
        <p className="text-sm opacity-90 mt-1">Crea y gestiona plantillas para email y WhatsApp con variables dinamicas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Plantillas Email</div>
          <div className="text-2xl font-bold text-blue-600">{emailTemplates.length}</div>
        </div>
        <div className="card text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Plantillas WhatsApp</div>
          <div className="text-2xl font-bold text-green-600">{whatsappTemplates.length}</div>
        </div>
        <div className="card text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Variables</div>
          <div className="text-2xl font-bold text-amber-600">6</div>
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

      {activeTab === 'Email' && <EmailTab templates={emailTemplates} setTemplates={setEmailTemplates} sampleData={sampleData} />}
      {activeTab === 'WhatsApp' && <WhatsAppTab templates={whatsappTemplates} setTemplates={setWhatsappTemplates} sampleData={sampleData} />}
      {activeTab === 'Variables' && <VariablesTab sampleData={sampleData} setSampleData={setSampleData} />}
    </div>
  )
}
