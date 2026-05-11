// Cookie consent storage helper.
// LSSI-CE art. 22.2 + RGPD art. 7 + Guía AEPD cookies (rev. 2023).
//
// Almacenamos el consentimiento en localStorage (no en cookie) para no
// necesitar consentimiento previo para guardar el propio consentimiento.

export const CONSENT_VERSION = '1.0'
export const CONSENT_KEY = 'rm-cookie-consent'
export const CONSENT_TTL_MS = 365 * 24 * 60 * 60 * 1000 // 12 meses (recomendación AEPD)

export const CATEGORIES = {
  necessary: true,
  thirdParty: false,
}

export function getConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setConsent(method, categories) {
  const payload = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    method, // 'accept-all' | 'reject-all' | 'save-preferences'
    categories: {
      necessary: true,
      thirdParty: !!categories?.thirdParty,
    },
  }
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(payload))
  } catch {
    // localStorage no disponible (modo privado, etc.)
  }
  return payload
}

export function clearConsent() {
  try {
    localStorage.removeItem(CONSENT_KEY)
  } catch {
    // noop
  }
}

export function hasConsentFor(category) {
  const c = getConsent()
  if (!c || !isConsentValid()) return false
  return !!c.categories?.[category]
}

export function isConsentValid() {
  const c = getConsent()
  if (!c) return false
  if (c.version !== CONSENT_VERSION) return false
  const ageMs = Date.now() - new Date(c.timestamp).getTime()
  if (Number.isNaN(ageMs) || ageMs > CONSENT_TTL_MS) return false
  return true
}

export const OPEN_BANNER_EVENT = 'rm:open-cookie-banner'
