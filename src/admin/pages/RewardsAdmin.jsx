import { useState } from 'react'
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'
import { rewardTiers, rewardTypes, getRewardTiers } from '../../data/rewardTiers'
import { generateImage as pollinationsGenerateImage } from '../../shared/lib/pollinations'

const typeColors = {
  digital: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-300' },
  experiencia: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-300' },
  mecenazgo: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-400' },
}

const typeLabels = { digital: 'Digital', experiencia: 'Experiencia', mecenazgo: 'Mecenazgo' }

function emptyReward() {
  return {
    amount: '', name: '', type: 'digital', typeLabel: 'Digital',
    color: '#6B9E50', badge: '', tagline: '', description: '',
    image: '', imagePrompt: '',
    own: [], inherited: [], inheritsUpTo: undefined,
  }
}

// ─── REWARD CARD PREVIEW (dark, landing-style) ─────────────────
function RewardCardPreview({ r }) {
  const [expanded, setExpanded] = useState(false)
  const tc = typeColors[r.type] || typeColors.digital

  return (
    <div className="bg-[#2A2A24] rounded-xl overflow-hidden border border-[#444]">
      {r.image ? (
        <div className="relative">
          <img src={r.image} alt={r.name} className="w-full h-36 object-cover rounded-t-xl" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#2A2A24] to-transparent" />
        </div>
      ) : (
        <div className="h-[3px]" style={{ background: r.color }} />
      )}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-[11px] px-2 py-0.5 rounded-full border ${tc.border} ${tc.text} ${tc.bg}`}>
            {r.typeLabel || typeLabels[r.type]}
          </span>
          {r.badge && (
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">{r.badge}</span>
          )}
        </div>
        <div className="text-white">
          <span className="text-2xl font-bold">{r.amount}</span>
          <span className="text-sm text-gray-400 ml-1">EUR</span>
        </div>
        <p className="text-white font-semibold text-sm">{r.name}</p>
        {r.tagline && <p className="text-gray-400 text-xs italic">{r.tagline}</p>}
        {r.description && <p className="text-gray-300 text-xs leading-relaxed">{r.description}</p>}
        {r.own && r.own.length > 0 && (
          <ul className="space-y-1.5 pt-1">
            {r.own.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-200">
                <span style={{ color: r.color }} className="mt-0.5">&#9733;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
        {r.inheritsUpTo != null && (
          <div className="pt-2 border-t border-[#444]">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[11px] text-gray-400 hover:text-gray-200 flex items-center gap-1"
            >
              <span className={`transition-transform ${expanded ? 'rotate-90' : ''}`}>&#9654;</span>
              Hereda hasta {r.inheritsUpTo} EUR
            </button>
            {expanded && (
              <p className="text-[11px] text-gray-500 mt-1 pl-4">
                Incluye todas las recompensas de niveles anteriores hasta {r.inheritsUpTo} EUR.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────
export default function RewardsAdmin() {
  const [rewards, setRewards] = useLocalStorage('rm-rewards-custom', null)
  const [editing, setEditing] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [imageError, setImageError] = useState(null)

  const tiers = rewards || rewardTiers

  // ── Handlers ──────────────────────────────────────────────────
  const openNew = () => {
    setEditing(emptyReward())
    setIsNew(true)
  }

  const openEdit = (r) => {
    setEditing({ ...r, own: [...(r.own || [])] })
    setIsNew(false)
  }

  const closeEditor = () => {
    setEditing(null)
    setIsNew(false)
    setShowConfirm(false)
    setGeneratingImage(false)
    setImageError(null)
  }

  const saveReward = () => {
    const cleaned = {
      ...editing,
      amount: Number(editing.amount),
      typeLabel: typeLabels[editing.type] || editing.type,
      badge: editing.badge || null,
      inheritsUpTo: editing.inheritsUpTo === '' || editing.inheritsUpTo === undefined
        ? undefined
        : Number(editing.inheritsUpTo),
      own: editing.own.filter(Boolean),
    }
    let next
    if (isNew) {
      next = [...tiers, cleaned]
    } else {
      next = tiers.map((t) => (t.amount === cleaned.amount ? cleaned : t))
    }
    next.sort((a, b) => a.amount - b.amount)
    setRewards(next)
    closeEditor()
  }

  const confirmDelete = () => {
    if (pendingDelete == null) return
    const next = tiers.filter((t) => t.amount !== pendingDelete)
    setRewards(next.length > 0 ? next : null)
    setPendingDelete(null)
  }

  const resetDefaults = () => {
    if (!window.confirm('Se restauraran las recompensas originales. Los cambios se perderan.')) return
    setRewards(null)
  }

  const exportJSON = () => {
    const json = JSON.stringify(tiers, null, 2)
    navigator.clipboard.writeText(json).then(
      () => alert('JSON copiado al portapapeles'),
      () => alert('Error al copiar')
    )
  }

  const importJSON = () => {
    const raw = window.prompt('Pega aqui el JSON de recompensas:')
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) throw new Error('not array')
      parsed.sort((a, b) => a.amount - b.amount)
      setRewards(parsed)
    } catch {
      alert('JSON invalido. Debe ser un array de objetos.')
    }
  }

  // ── Clipboard copy with fallback ─────────────────────────────
  const copyText = (text) => {
    if (navigator.clipboard && document.hasFocus()) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text))
    } else {
      fallbackCopy(text)
    }
  }
  const fallbackCopy = (text) => {
    const ta = document.createElement('textarea')
    ta.value = text; ta.style.cssText = 'position:fixed;left:-9999px'
    document.body.appendChild(ta); ta.select()
    try { document.execCommand('copy') } catch {}
    document.body.removeChild(ta)
  }

  // ── Image generation ────────────────────────────────────────
  const handleGenerateImage = async () => {
    if (!editing?.imagePrompt) return
    setGeneratingImage(true)
    setImageError(null)
    try {
      const result = await pollinationsGenerateImage(editing.imagePrompt, { model: 'turbo', width: 768, height: 768 })
      set('image', result.imageUrl)
    } catch (err) {
      setImageError(err.message || 'Error al generar imagen')
    } finally {
      setGeneratingImage(false)
    }
  }

  // ── Image upload from file ──────────────────────────────────
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => set('image', ev.target.result)
    reader.readAsDataURL(file)
  }

  // ── Field updater ─────────────────────────────────────────────
  const set = (field, value) => setEditing((prev) => ({ ...prev, [field]: value }))

  const addOwnItem = () => setEditing((prev) => ({ ...prev, own: [...prev.own, ''] }))

  const updateOwnItem = (idx, val) =>
    setEditing((prev) => ({
      ...prev,
      own: prev.own.map((it, i) => (i === idx ? val : it)),
    }))

  const removeOwnItem = (idx) =>
    setEditing((prev) => ({
      ...prev,
      own: prev.own.filter((_, i) => i !== idx),
    }))

  // ── Possible inherit targets ──────────────────────────────────
  const inheritOptions = editing
    ? tiers
        .filter((t) => Number(t.amount) < Number(editing.amount))
        .sort((a, b) => a.amount - b.amount)
    : []

  const pendingReward = pendingDelete != null ? tiers.find((t) => t.amount === pendingDelete) : null

  // ── RENDER ────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="card bg-gradient-to-r from-rural-green/10 to-rural-green/5 border-rural-green/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Gestion de Recompensas</h1>
            <p className="text-sm text-gray-500 mt-1">
              Administra los niveles de recompensa de la campana de crowdfunding
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-rural-green hover:underline"
            >
              Ver Landing &rarr;
            </a>
            <span className="bg-rural-green text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {tiers.length} recompensas
            </span>
          </div>
        </div>
      </div>

      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={openNew}
          className="bg-rural-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rural-green/90 transition"
        >
          + Anadir recompensa
        </button>
        <button
          onClick={resetDefaults}
          className="border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition"
        >
          Restaurar defaults
        </button>
        <button
          onClick={exportJSON}
          className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          Exportar JSON
        </button>
        <button
          onClick={importJSON}
          className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          Importar JSON
        </button>
      </div>

      {/* ── Rewards Grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tiers.map((r) => {
          const tc = typeColors[r.type] || typeColors.digital
          return (
            <div key={r.amount} className="card p-0 overflow-hidden relative group">
              <div className="h-[2px]" style={{ background: r.color }} />
              {r.badge && (
                <span className="absolute top-3 right-3 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  {r.badge}
                </span>
              )}
              {r.image && (
                <img src={r.image} alt={r.name} className="h-20 w-full rounded-t-lg object-cover" />
              )}
              <div className="p-4 space-y-2">
                <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full border ${tc.border} ${tc.text} ${tc.bg}`}>
                  {r.typeLabel || typeLabels[r.type]}
                </span>
                <div>
                  <span className="text-2xl font-bold text-gray-800">{r.amount}</span>
                  <span className="text-sm text-gray-400 ml-1">EUR</span>
                </div>
                <p className="font-semibold text-sm text-gray-700">{r.name}</p>
                {r.tagline && <p className="text-xs text-gray-400 italic">{r.tagline}</p>}
                {r.own && r.own.length > 0 && (
                  <p className="text-xs text-gray-500">{r.own.length} items exclusivos</p>
                )}
                {r.inheritsUpTo != null && (
                  <p className="text-[11px] text-gray-400">Hereda hasta {r.inheritsUpTo} EUR</p>
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => openEdit(r)}
                    className="flex-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setPendingDelete(r.amount)}
                    className="flex-1 text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Edit Modal ───────────────────────────────────────── */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-800">
                {isNew ? 'Nueva recompensa' : 'Editar recompensa'}
              </h2>
              <button
                onClick={closeEditor}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Modal body — two columns on lg */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* ── Form Column ──────────────────────────────── */}
              <div className="space-y-4">
                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block">
                    Cantidad (EUR) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editing.amount}
                    onChange={(e) => set('amount', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-rural-green focus:outline-none focus:ring-1 focus:ring-rural-green/20 transition"
                    placeholder="Ej: 50"
                  />
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => set('name', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-rural-green focus:outline-none focus:ring-1 focus:ring-rural-green/20 transition"
                    placeholder="Ej: Semilla del Cambio"
                  />
                </div>

                {/* Type */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block">
                    Tipo
                  </label>
                  <select
                    value={editing.type}
                    onChange={(e) => {
                      set('type', e.target.value)
                      set('typeLabel', typeLabels[e.target.value] || e.target.value)
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-rural-green focus:outline-none focus:ring-1 focus:ring-rural-green/20 transition bg-white"
                  >
                    {rewardTypes.filter((t) => t.id !== 'all').map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block">
                    Color
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={editing.color}
                      onChange={(e) => set('color', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={editing.color}
                      onChange={(e) => set('color', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-rural-green focus:outline-none focus:ring-1 focus:ring-rural-green/20 transition font-mono"
                      placeholder="#6B9E50"
                    />
                  </div>
                </div>

                {/* Badge */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block">
                    Badge (opcional)
                  </label>
                  <input
                    type="text"
                    value={editing.badge || ''}
                    onChange={(e) => set('badge', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-rural-green focus:outline-none focus:ring-1 focus:ring-rural-green/20 transition"
                    placeholder="Ej: Mas popular"
                  />
                </div>

                {/* Tagline */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={editing.tagline || ''}
                    onChange={(e) => set('tagline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-rural-green focus:outline-none focus:ring-1 focus:ring-rural-green/20 transition"
                    placeholder="Frase corta descriptiva"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block">
                    Descripcion
                  </label>
                  <textarea
                    value={editing.description || ''}
                    onChange={(e) => set('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-rural-green focus:outline-none focus:ring-1 focus:ring-rural-green/20 transition resize-y"
                    placeholder="Descripcion detallada de la recompensa"
                  />
                </div>

                {/* Own Items */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block">
                    Items exclusivos
                  </label>
                  <div className="space-y-2">
                    {editing.own.map((item, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateOwnItem(idx, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-rural-green focus:outline-none focus:ring-1 focus:ring-rural-green/20 transition"
                          placeholder={`Item ${idx + 1}`}
                        />
                        <button
                          onClick={() => removeOwnItem(idx)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 rounded-lg transition text-lg font-bold"
                          title="Eliminar item"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addOwnItem}
                    className="text-sm text-rural-green hover:text-rural-green/80 font-medium mt-1"
                  >
                    + Anadir item
                  </button>
                </div>

                {/* Imagen de la recompensa */}
                <div className="space-y-2 border-t pt-4 mt-4">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block">
                    📷 Imagen de la recompensa
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editing.image || ''}
                      onChange={(e) => set('image', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-rural-green focus:outline-none focus:ring-1 focus:ring-rural-green/20 transition"
                      placeholder="URL de imagen o sube un archivo"
                    />
                    <label className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition cursor-pointer whitespace-nowrap">
                      Subir imagen
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {editing.image && (
                    <img src={editing.image} alt="Preview" className="h-32 rounded-lg object-cover" />
                  )}
                  <textarea
                    value={editing.imagePrompt || ''}
                    onChange={(e) => set('imagePrompt', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-rural-green focus:outline-none focus:ring-1 focus:ring-rural-green/20 transition resize-y"
                    placeholder="Prompt IA para generar la imagen..."
                  />
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => copyText(editing.imagePrompt || '')}
                      className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition"
                    >
                      Copiar prompt
                    </button>
                    <button
                      onClick={handleGenerateImage}
                      disabled={generatingImage || !editing.imagePrompt}
                      className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {generatingImage && (
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      )}
                      Generar con IA ✨
                    </button>
                  </div>
                  {imageError && (
                    <p className="text-xs text-red-500">{imageError}</p>
                  )}
                </div>

                {/* InheritsUpTo */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block">
                    Hereda hasta
                  </label>
                  <select
                    value={editing.inheritsUpTo ?? ''}
                    onChange={(e) => {
                      const v = e.target.value
                      set('inheritsUpTo', v === '' ? undefined : Number(v))
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-rural-green focus:outline-none focus:ring-1 focus:ring-rural-green/20 transition bg-white"
                  >
                    <option value="">Sin herencia</option>
                    <option value="0">Hereda todos los anteriores</option>
                    {inheritOptions.map((t) => (
                      <option key={t.amount} value={t.amount}>
                        Hasta {t.amount} EUR - {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ── Preview Column ───────────────────────────── */}
              <div className="space-y-3">
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block">
                  Vista previa (landing)
                </label>
                <div className="bg-[#3A3830] p-6 rounded-xl">
                  <RewardCardPreview r={{ ...editing, amount: Number(editing.amount) || 0 }} />
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={closeEditor}
                className="px-5 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={!editing.amount || !editing.name}
                className="px-5 py-2 bg-rural-green text-white rounded-lg text-sm font-medium hover:bg-rural-green/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Guardar
              </button>
            </div>
          </div>

          {/* ── Confirm Save Dialog ──────────────────────────── */}
          {showConfirm && (
            <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
                <h3 className="font-bold text-gray-800">Confirmar cambios?</h3>
                <p className="text-sm text-gray-600">
                  Se va a {isNew ? 'anadir' : 'actualizar'} la recompensa &lsquo;{editing.name}&rsquo; por{' '}
                  {editing.amount} EUR.
                </p>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveReward}
                    className="px-4 py-2 bg-rural-green text-white rounded-lg text-sm font-medium hover:bg-rural-green/90 transition"
                  >
                    Confirmar y guardar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Delete Confirm Dialog ──────────────────────────────── */}
      {pendingReward && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-gray-800">Eliminar recompensa</h3>
            <p className="text-sm text-gray-600">
              Eliminar &lsquo;{pendingReward.name}&rsquo; ({pendingReward.amount} EUR)?
              Los datos se pueden restaurar con &lsquo;Restaurar defaults&rsquo;.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setPendingDelete(null)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
