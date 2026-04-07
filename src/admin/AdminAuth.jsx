import { useState, useEffect } from 'react'

export default function AdminAuth({ children }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'authenticated' | 'unauthenticated'
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check existing session on mount
  useEffect(() => {
    fetch('/api/admin-verify', { credentials: 'include' })
      .then(res => {
        setStatus(res.ok ? 'authenticated' : 'unauthenticated')
      })
      .catch(() => setStatus('unauthenticated'))
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pin }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('authenticated')
        setError('')
      } else if (res.status === 429) {
        const mins = Math.ceil((data.retryAfter || 1800) / 60)
        setError(`Demasiados intentos. Espera ${mins} minutos.`)
      } else {
        setError(data.error || 'PIN incorrecto')
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setPin('')
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin-logout', { method: 'POST', credentials: 'include' })
    setStatus('unauthenticated')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rural-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (status === 'authenticated') {
    return (
      <div>
        {/* Logout button accessible from admin */}
        <div className="fixed top-2 right-2 z-[60]">
          <button onClick={handleLogout}
            className="text-[10px] px-2 py-1 bg-gray-200 text-gray-600 rounded-full hover:bg-red-100 hover:text-red-600 transition opacity-50 hover:opacity-100"
            title="Cerrar sesión admin">
            Salir
          </button>
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-rural-green rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
              RM
            </div>
            <h1 className="text-xl font-bold text-gray-800">Rural Makers Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Introduce el PIN de acceso</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={pin}
                onChange={e => { setPin(e.target.value); setError('') }}
                placeholder="PIN de acceso"
                autoFocus
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-xl text-center text-lg tracking-widest focus:ring-2 focus:ring-rural-green focus:border-transparent transition ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  } ${loading ? 'opacity-50' : ''}`}
              />
              {error && (
                <p className="text-xs text-red-500 text-center mt-2">{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={!pin.trim() || loading}
              className="w-full py-3 bg-rural-green text-white rounded-xl font-semibold hover:bg-rural-green-dark transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Verificando...' : 'Acceder'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <a href="/" className="text-xs text-gray-400 hover:text-rural-green transition">
              Volver a la landing
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
