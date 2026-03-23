import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { defaultDescription } from '../data/defaultDescription'

export default function DescriptionManager() {
  const [versions, setVersions] = useLocalStorage('rm-descriptions', [
    { id: 1, timestamp: new Date().toISOString(), content: defaultDescription, label: 'Inicial de Goteo' }
  ])
  const [activeId, setActiveId] = useLocalStorage('rm-desc-active', 1)
  const [label, setLabel] = useState('')
  const [copied, setCopied] = useState(false)

  const activeVersion = versions.find(v => v.id === activeId) || versions[versions.length - 1]
  const content = activeVersion?.content || ''

  const updateContent = (newContent) => {
    setVersions(versions.map(v =>
      v.id === activeId ? { ...v, content: newContent, timestamp: new Date().toISOString() } : v
    ))
  }

  const saveNewVersion = () => {
    const newId = Math.max(...versions.map(v => v.id)) + 1
    const newVersion = {
      id: newId,
      timestamp: new Date().toISOString(),
      content: content,
      label: label || `Version ${newId}`,
    }
    setVersions([...versions, newVersion])
    setActiveId(newId)
    setLabel('')
  }

  const restoreVersion = (id) => {
    const version = versions.find(v => v.id === id)
    if (version) {
      const newId = Math.max(...versions.map(v => v.id)) + 1
      setVersions([...versions, {
        id: newId,
        timestamp: new Date().toISOString(),
        content: version.content,
        label: `Restaurada de: ${version.label}`,
      }])
      setActiveId(newId)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const wordCount = content.split(/\s+/).filter(Boolean).length
  const charCount = content.length

  return (
    <div className="space-y-4">
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-center gap-2">
          <span className="text-xl">📝</span>
          <div>
            <h2 className="font-semibold text-blue-800">Descripcion del Proyecto</h2>
            <p className="text-sm text-blue-600">
              Edita la descripcion y guarda versiones. Usa "Copiar" para pegarla en Goteo.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Editor - 2/3 */}
        <div className="lg:col-span-2 space-y-3">
          {/* Toolbar */}
          <div className="card flex flex-wrap items-center gap-3 py-2">
            <span className="text-sm text-gray-500">{wordCount} palabras | {charCount} caracteres</span>
            <div className="ml-auto flex gap-2">
              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 bg-rural-green text-white text-sm rounded-lg hover:bg-rural-green-dark transition"
              >
                {copied ? 'Copiado!' : 'Copiar al portapapeles'}
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="card p-0">
            <textarea
              value={content}
              onChange={e => updateContent(e.target.value)}
              className="w-full min-h-[60vh] p-4 text-sm leading-relaxed border-0 rounded-xl focus:outline-none resize-y"
              placeholder="Escribe la descripcion del proyecto..."
            />
          </div>

          {/* Save new version */}
          <div className="card flex items-center gap-3">
            <input
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="Etiqueta de version (ej: 'Despues de revision')..."
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-rural-green focus:outline-none"
            />
            <button
              onClick={saveNewVersion}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
            >
              Guardar Version
            </button>
          </div>
        </div>

        {/* Version history - 1/3 */}
        <div className="space-y-3">
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Historial de Versiones</h3>
            <div className="space-y-2 max-h-[60vh] overflow-auto">
              {[...versions].reverse().map(v => (
                <div
                  key={v.id}
                  className={`p-2 rounded-lg border cursor-pointer transition ${
                    v.id === activeId
                      ? 'border-rural-green bg-rural-green/5'
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveId(v.id)}
                >
                  <div className="text-sm font-medium text-gray-800">{v.label}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(v.timestamp).toLocaleString('es-ES')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    {v.content.substring(0, 80)}...
                  </div>
                  {v.id !== activeId && (
                    <button
                      onClick={e => { e.stopPropagation(); restoreVersion(v.id) }}
                      className="text-xs text-blue-600 hover:underline mt-1"
                    >
                      Restaurar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
