import { useState, useEffect, useCallback } from 'react'
import { PROJECT_SLUG } from '../lib/constants'

export function useGoteoApi() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProject = useCallback(async () => {
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

  useEffect(() => {
    fetchProject()
    const interval = setInterval(fetchProject, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchProject])

  return { data, loading, error, refetch: fetchProject }
}
