import { NavLink } from 'react-router-dom'

const sections = [
  {
    title: null,
    links: [
      { to: '/', label: 'Inicio', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
    ],
  },
  {
    title: 'Landing & Web',
    links: [
      { to: '/landing', label: 'Landing Base44', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9' },
      { to: '/landing-optimizer', label: 'Optimizer', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    ],
  },
  {
    title: 'App',
    links: [
      { to: '/app', label: 'App Hub', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
    ],
  },
  {
    title: 'Campaña Goteo',
    links: [
      { to: '/goteo-preview', label: 'Preview Goteo', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
      { to: '/video', label: 'Video Presentacion', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
      { to: '/description', label: 'Descripcion', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { to: '/planning', label: 'Planificacion', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
      { to: '/goteo-optimizer', label: 'Optimizador', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
      { to: '/goteo-api', label: 'API Superpoderes', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    ],
  },
]

export default function Sidebar({ onClose }) {
  return (
    <aside className="h-full bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rural-green rounded-lg flex items-center justify-center text-lg font-bold">
              RM
            </div>
            <div>
              <div className="font-semibold text-sm">Rural Makers</div>
              <div className="text-xs text-gray-400">Tejiendo Facenderas</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-auto">
        {sections.map((section, si) => (
          <div key={si}>
            {section.title && (
              <div className="text-xs text-gray-500 uppercase tracking-wider px-3 pt-4 pb-1 font-semibold">
                {section.title}
              </div>
            )}
            {section.links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                </svg>
                {link.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer links */}
      <div className="p-3 border-t border-gray-700 space-y-2">
        <a href="https://ruralmakers.net" target="_blank" rel="noopener noreferrer"
          className="block text-xs text-gray-400 hover:text-white transition-colors">
          ruralmakers.net (prototipo)
        </a>
        <a href="https://www.goteo.org/dashboard/project/camino-rural-tejiendo-facenderas"
          target="_blank" rel="noopener noreferrer"
          className="block text-xs text-gray-400 hover:text-white transition-colors">
          Dashboard Goteo
        </a>
        <a href="https://developers.goteo.org/" target="_blank" rel="noopener noreferrer"
          className="block text-xs text-gray-400 hover:text-white transition-colors">
          API Goteo Docs
        </a>
      </div>
    </aside>
  )
}
