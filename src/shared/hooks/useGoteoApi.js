import { useState, useCallback } from 'react'
import { PROJECT_SLUG } from '../lib/constants'

// NOTE: Solo disponible en local con el proxy de Vite activo (localhost:3001).
// En produccion (Vercel) no hay backend proxy — NO llamar automaticamente.
const IS_LOCAL = import.meta.env.DEV

export function useGoteoApi() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProject = useCallback(async () => {
    if (!IS_LOCAL) {
      setError('API de Goteo solo disponible en local (requiere proxy)')
      return
    }
    try {
      setLoading(true)
      const res = await fetch(`/api/goteo/projects/${PROJECT_SLUG}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Sin polling automatico — solo se lanza al pulsar un boton (refetch manual)
  return { data, loading, error, refetch: fetchProject }
}
