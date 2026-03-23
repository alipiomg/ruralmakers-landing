import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const mainItems = [
  { to: '/app', label: 'Inicio', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4', end: true },
  { to: '/app/mapa', label: 'Mapa', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
  { to: '/app/facenderas/crear', label: 'Crear', icon: 'M12 4v16m8-8H4', fab: true },
  { to: '/app/comunidad', label: 'Gente', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { to: '#menu', label: 'Menu', icon: 'M4 6h16M4 12h16M4 18h16', isMenu: true },
]

const menuItems = [
  { to: '/app/proyectos', label: 'Proyectos', icon: '🏗' },
  { to: '/app/facenderas', label: 'Facenderas', icon: '🤝' },
  { to: '/app/agenda', label: 'Agenda', icon: '📅' },
  { to: '/app/organizaciones', label: 'Organizaciones', icon: '🏢' },
  { to: '/app/recursos', label: 'Recursos', icon: '📚' },
  { to: '/app/grupos', label: 'Grupos', icon: '👥' },
  { to: '/app/rutas', label: 'Rutas', icon: '🥾' },
  { to: '/app/chat', label: 'Chat IA', icon: '🤖' },
  { to: '/app/perfil', label: 'Mi Perfil', icon: '👤' },
]

export default function BottomNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Slide-up menu */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setMenuOpen(false)} />
          <div className="fixed bottom-16 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 p-4 max-w-lg mx-auto">
            <div className="w-8 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
            <div className="grid grid-cols-3 gap-3">
              {menuItems.map(item => (
                <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-gray-50 transition">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs text-gray-700 font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {mainItems.map(item => {
            if (item.isMenu) {
              return (
                <button key="menu" onClick={() => setMenuOpen(!menuOpen)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1 ${menuOpen ? 'text-rural-green' : 'text-gray-400'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                  <span className="text-xs">{item.label}</span>
                </button>
              )
            }

            if (item.fab) {
              return (
                <NavLink key={item.to} to={item.to}
                  className="flex flex-col items-center gap-0.5 px-3 py-1">
                  <div className="w-12 h-12 bg-rural-green rounded-full flex items-center justify-center -mt-4 shadow-lg shadow-rural-green/30">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                </NavLink>
              )
            }

            return (
              <NavLink key={item.to} to={item.to} end={item.end}
                className={({ isActive }) => `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition ${isActive ? 'text-rural-green' : 'text-gray-400 hover:text-gray-600'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                <span className="text-xs">{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </>
  )
}
