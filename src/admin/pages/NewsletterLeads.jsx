import { useState, useEffect } from 'react'

export default function NewsletterLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter-subscribe', { credentials: 'include' })
      if (!res.ok) throw new Error('No autorizado')
      const data = await res.json()
      setLeads(data.leads || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLeads() }, [])

  const deleteLead = async (email) => {
    if (!confirm(`¿Eliminar ${email}?`)) return
    await fetch('/api/newsletter-subscribe', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    })
    fetchLeads()
  }

  const exportCSV = () => {
    const header = 'Email,Fuente,Fecha,IP'
    const rows = leads.map(l =>
      `"${l.email}","${l.source}","${l.subscribedAt}","${l.ip || ''}"`
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = leads.filter(l =>
    l.email.includes(search.toLowerCase()) ||
    (l.source || '').includes(search.toLowerCase())
  )

  const sortedLeads = [...filtered].sort((a, b) =>
    new Date(b.subscribedAt) - new Date(a.subscribedAt)
  )

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-rural-green border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="card text-center py-12">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={fetchLeads} className="text-sm text-rural-green hover:underline">Reintentar</button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Newsletter Leads</h2>
          <p className="text-sm text-gray-500 mt-1">Suscriptores del formulario de la landing</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-rural-green bg-rural-green/10 px-3 py-1.5 rounded-full">
            {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
          </span>
          {leads.length > 0 && (
            <button onClick={exportCSV}
              className="text-sm px-4 py-2 bg-rural-green text-white rounded-lg hover:bg-rural-green-dark transition font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar CSV
            </button>
          )}
          <button onClick={fetchLeads}
            className="text-sm px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            Actualizar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-rural-green">{leads.length}</div>
          <div className="text-xs text-gray-500 mt-1">Total leads</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{leads.filter(l => l.source === 'landing').length}</div>
          <div className="text-xs text-gray-500 mt-1">Desde landing</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-amber-600">
            {leads.filter(l => {
              const d = new Date(l.subscribedAt)
              const now = new Date()
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            }).length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Este mes</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">
            {leads.filter(l => {
              const d = new Date(l.subscribedAt)
              const now = new Date()
              return (now - d) < 7 * 24 * 60 * 60 * 1000
            }).length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Últimos 7 días</div>
        </div>
      </div>

      {/* Search */}
      {leads.length > 0 && (
        <div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por email o fuente..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rural-green focus:border-transparent"
          />
        </div>
      )}

      {/* Table */}
      {sortedLeads.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-3">📬</div>
          <p className="text-gray-500 text-sm">
            {leads.length === 0
              ? 'Aún no hay suscriptores. El formulario de la landing empezará a captar leads.'
              : 'Sin resultados para esta búsqueda.'}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Email</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Fuente</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Fecha</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeads.map((lead, i) => (
                  <tr key={lead.email} className={`border-b border-gray-50 hover:bg-gray-50/50 transition ${i === 0 ? 'bg-rural-green/5' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-800">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">{lead.source}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(lead.subscribedAt).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteLead(lead.email)}
                        className="text-xs text-red-400 hover:text-red-600 transition">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
