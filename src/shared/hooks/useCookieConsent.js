import { useCallback, useEffect, useState } from 'react'
import {
  getConsent,
  setConsent,
  isConsentValid,
  OPEN_BANNER_EVENT,
} from '../lib/consent'

export function useCookieConsent() {
  const [consent, setConsentState] = useState(() => getConsent())
  const [forceVisible, setForceVisible] = useState(false)

  useEffect(() => {
    const onOpen = () => setForceVisible(true)
    window.addEventListener(OPEN_BANNER_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_BANNER_EVENT, onOpen)
  }, [])

  const isVisible = forceVisible || !isConsentValid()

  const persist = useCallback((method, categories) => {
    const saved = setConsent(method, categories)
    setConsentState(saved)
    setForceVisible(false)
  }, [])

  const accept = useCallback(() => {
    persist('accept-all', { necessary: true, thirdParty: true })
  }, [persist])

  const reject = useCallback(() => {
    persist('reject-all', { necessary: true, thirdParty: false })
  }, [persist])

  const save = useCallback((categories) => {
    persist('save-preferences', categories)
  }, [persist])

  const openBanner = useCallback(() => {
    setForceVisible(true)
  }, [])

  return { consent, isVisible, accept, reject, save, openBanner }
}
