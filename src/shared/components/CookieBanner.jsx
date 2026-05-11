import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCookieConsent } from '../hooks/useCookieConsent'

export default function CookieBanner() {
  const { consent, isVisible, accept, reject, save } = useCookieConsent()
  const [expanded, setExpanded] = useState(false)
  const [thirdParty, setThirdParty] = useState(consent?.categories?.thirdParty ?? false)
  const dialogRef = useRef(null)

  useEffect(() => {
    setThirdParty(consent?.categories?.thirdParty ?? false)
  }, [consent])

  useEffect(() => {
    if (!expanded) return
    const onKey = (e) => { if (e.key === 'Escape') setExpanded(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [expanded])

  if (!isVisible) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-label="Consentimiento de cookies"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 z-[60] max-w-full sm:max-w-[380px] animate-[slideUp_0.4s_ease-out]"
    >
      <div className="bg-[#2C2A25]/95 backdrop-blur-xl border border-[#6B9E50]/20 rounded-2xl shadow-2xl shadow-black/50 p-5">
        {!expanded ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span aria-hidden="true" className="text-base">🍪</span>
              <h2 className="landing-heading text-[14px] font-bold text-[#F0EBE0]">Cookies</h2>
            </div>
            <p className="text-[12.5px] text-[#C8BEB0] leading-[1.55] mb-4">
              Usamos cookies técnicas necesarias para que la web funcione. Con tu
              consentimiento, también de terceros (vídeos, mapas).{' '}
              <Link to="/legal/cookies" rel="nofollow noopener" className="text-[#6B9E50] underline underline-offset-2 hover:text-[#8BC06A]">
                Política de cookies
              </Link>
              .
            </p>
            <div className="flex flex-wrap items-center gap-2 justify-end">
              <button
                onClick={reject}
                className="bg-white/10 hover:bg-white/15 text-[#F0EBE0] rounded-full px-4 py-2 text-[12px] font-bold transition"
              >
                Rechazar
              </button>
              <button
                onClick={() => setExpanded(true)}
                className="text-[#B0A898] hover:text-[#F0EBE0] underline-offset-2 hover:underline px-2 py-2 text-[12px] font-medium transition"
              >
                Configurar
              </button>
              <button
                onClick={accept}
                className="bg-[#6B9E50] hover:bg-[#4E7A38] text-white rounded-full px-4 py-2 text-[12px] font-bold transition shadow-lg shadow-[#6B9E50]/20"
              >
                Aceptar
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="text-base">🍪</span>
                <h2 className="landing-heading text-[14px] font-bold text-[#F0EBE0]">Configurar cookies</h2>
              </div>
              <button
                onClick={() => setExpanded(false)}
                aria-label="Cerrar configuración"
                className="text-[#B0A898] hover:text-[#F0EBE0] w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/5 transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <CategoryToggle
                title="Técnicas"
                description="Necesarias para el funcionamiento del sitio. No se pueden desactivar."
                checked={true}
                disabled
                onChange={() => {}}
              />
              <CategoryToggle
                title="Multimedia y terceros"
                description="YouTube, Vimeo, Google Fonts y mapa Leaflet. Activarlas permite ver contenido externo."
                checked={thirdParty}
                onChange={(v) => setThirdParty(v)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 justify-end">
              <button
                onClick={() => save({ necessary: true, thirdParty })}
                className="bg-white/10 hover:bg-white/15 text-[#F0EBE0] rounded-full px-4 py-2 text-[12px] font-bold transition"
              >
                Guardar preferencias
              </button>
              <button
                onClick={accept}
                className="bg-[#6B9E50] hover:bg-[#4E7A38] text-white rounded-full px-4 py-2 text-[12px] font-bold transition shadow-lg shadow-[#6B9E50]/20"
              >
                Aceptar todo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function CategoryToggle({ title, description, checked, disabled, onChange }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
      <label className={`flex items-start gap-3 ${disabled ? 'opacity-100' : 'cursor-pointer'}`}>
        <span className="relative inline-flex items-center mt-0.5 shrink-0">
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
            aria-label={title}
          />
          <span className={`w-9 h-5 rounded-full transition-colors ${checked ? 'bg-[#6B9E50]' : 'bg-white/20'} ${disabled ? 'opacity-70' : ''}`} />
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
        </span>
        <span className="flex-1">
          <span className="block text-[12.5px] font-bold text-[#F0EBE0]">
            {title} {disabled && <span className="text-[10px] text-[#6B9E50] font-normal ml-1">(siempre activas)</span>}
          </span>
          <span className="block text-[11px] text-[#B0A898] leading-[1.5] mt-0.5">{description}</span>
        </span>
      </label>
    </div>
  )
}
