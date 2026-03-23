import { Outlet } from 'react-router-dom'
import BottomNav from './components/BottomNav'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-rural-cream flex flex-col">
      {/* App header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 shrink-0 sticky top-0 z-40">
        <div className="w-8 h-8 bg-rural-green rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3">RM</div>
        <h1 className="text-lg font-semibold text-gray-800">Rural Makers</h1>
        <div className="ml-auto flex items-center gap-2">
          <a href="/app/chat" className="p-2 rounded-lg hover:bg-gray-100 transition">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </a>
          <a href="/app/notificaciones" className="p-2 rounded-lg hover:bg-gray-100 transition relative">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  )
}
