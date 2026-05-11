import { Link } from 'react-router-dom'

// Checkbox RGPD para el formulario de newsletter (cuando se reactive en
// la landing). Marcar como obligatorio en el form padre para validar.
//
// Uso:
//   <NewsletterConsentCheckbox checked={accepted} onChange={setAccepted} />
//   <button disabled={!accepted}>Suscribir</button>

export default function NewsletterConsentCheckbox({ checked, onChange }) {
  return (
    <label className="flex items-start gap-2 text-[11.5px] text-[#B0A898] leading-[1.5] cursor-pointer">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        required
        className="mt-0.5 shrink-0 accent-[#6B9E50]"
      />
      <span>
        He leído y acepto la{' '}
        <Link to="/legal/privacidad" rel="nofollow noopener" className="text-[#6B9E50] underline underline-offset-2 hover:text-[#8BC06A]">
          Política de Privacidad
        </Link>
        . Mis datos serán tratados por Asociación Indira para enviarme
        novedades de Rural Makers. Puedo darme de baja en cualquier momento.
      </span>
    </label>
  )
}
