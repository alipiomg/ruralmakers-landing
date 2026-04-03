import { useState } from 'react'

const ADMIN_PIN = 'Graciasalegria8'

export default function AdminAuth({ children }) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('rm-admin-auth') === 'true'
  )
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem('rm-admin-auth', 'true')
      setAuthenticated(true)
      setError(false)
    } else {
      setError(true)
      setPin('')
    }
  }

  if (authenticated) return children

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
                onChange={e => { setPin(e.target.value); setError(false) }}
                placeholder="PIN de acceso"
                autoFocus
                className={`w-full px-4 py-3 border rounded-xl text-center text-lg tracking-widest focus:ring-2 focus:ring-rural-green focus:border-transparent transition ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
              />
              {error && (
                <p className="text-xs text-red-500 text-center mt-2">PIN incorrecto</p>
              )}
            </div>
            <button
              type="submit"
              disabled={!pin.trim()}
              className="w-full py-3 bg-rural-green text-white rounded-xl font-semibold hover:bg-rural-green-dark transition disabled:opacity-50"
            >
              Acceder
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
