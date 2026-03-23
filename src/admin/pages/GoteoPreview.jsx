import { GOTEO_PREVIEW_FILE, GOTEO_PROJECT_URL } from '../../shared/lib/constants'

export default function GoteoPreview() {
  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="card mb-4 flex flex-wrap items-center gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Preview Pagina Goteo</h2>
          <p className="text-xs text-gray-500">Snapshot local del 21/03/2026 - Vista previa de como se vera la campana</p>
        </div>
        <div className="flex gap-2 ml-auto">
          <a href={GOTEO_PREVIEW_FILE} target="_blank" rel="noopener noreferrer"
            className="px-3 py-1.5 bg-rural-green text-white text-sm rounded-lg hover:bg-rural-green-dark transition">
            Abrir en nueva pestana
          </a>
          <a href={GOTEO_PROJECT_URL} target="_blank" rel="noopener noreferrer"
            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition">
            Ver en Goteo (live)
          </a>
        </div>
      </div>

      {/* iframe */}
      <div className="flex-1 card p-0 overflow-hidden" style={{ minHeight: '70vh' }}>
        <iframe
          src={GOTEO_PREVIEW_FILE}
          className="w-full h-full border-0"
          style={{ minHeight: '70vh' }}
          title="Preview Goteo Local"
        />
      </div>
    </div>
  )
}
