export const meta = {
  slug: 'cookies',
  title: 'Política de Cookies',
  version: '1.0',
  updatedAt: '2026-05-11',
  icon: '🍪',
}

export default function PoliticaCookies() {
  return (
    <>
      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Una cookie es un pequeño archivo de texto que un sitio web almacena en
        tu navegador. Junto a las cookies utilizamos otros mecanismos de
        almacenamiento local del navegador (<code>localStorage</code>) que la
        normativa equipara a las cookies a efectos de información y
        consentimiento.
      </p>
      <p>
        El uso de cookies y almacenamiento local en este sitio se rige por el
        artículo 22.2 de la Ley 34/2002 de Servicios de la Sociedad de la
        Información (LSSI-CE) y el Reglamento (UE) 2016/679 (RGPD), así como
        por la Guía de Cookies de la Agencia Española de Protección de Datos
        (AEPD) en su revisión vigente.
      </p>

      <h2>2. ¿Qué cookies utilizamos?</h2>
      <p>
        En <strong>www.ruralmakers.net</strong> utilizamos los siguientes
        almacenamientos:
      </p>

      <div className="overflow-x-auto -mx-2 my-4">
        <table className="w-full text-[12.5px] min-w-[640px]">
          <thead>
            <tr className="border-b border-white/10 text-[#6B9E50]">
              <th className="text-left py-2 pl-2 pr-3 font-bold">Nombre</th>
              <th className="text-left py-2 px-3 font-bold">Tipo</th>
              <th className="text-left py-2 px-3 font-bold">Categoría</th>
              <th className="text-left py-2 px-3 font-bold">Duración</th>
              <th className="text-left py-2 pl-3 pr-2 font-bold">Finalidad</th>
            </tr>
          </thead>
          <tbody className="text-[#C8BEB0]">
            <tr className="border-b border-white/5">
              <td className="py-2 pl-2 pr-3"><code>rm-landing-config</code></td>
              <td className="py-2 px-3">localStorage</td>
              <td className="py-2 px-3">Técnica</td>
              <td className="py-2 px-3">Persistente</td>
              <td className="py-2 pl-3 pr-2">Configuración visual de la landing</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pl-2 pr-3"><code>rm-cookie-consent</code></td>
              <td className="py-2 px-3">localStorage</td>
              <td className="py-2 px-3">Técnica</td>
              <td className="py-2 px-3">12 meses</td>
              <td className="py-2 pl-3 pr-2">Almacenar tu decisión sobre cookies</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pl-2 pr-3">YouTube (<code>VISITOR_INFO1_LIVE</code>, <code>YSC</code>, <code>PREF</code>...)</td>
              <td className="py-2 px-3">Cookie 3rd party</td>
              <td className="py-2 px-3">Multimedia</td>
              <td className="py-2 px-3">Variable (Google)</td>
              <td className="py-2 pl-3 pr-2">Reproducción de vídeos embebidos</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pl-2 pr-3">Vimeo</td>
              <td className="py-2 px-3">Cookie 3rd party</td>
              <td className="py-2 px-3">Multimedia</td>
              <td className="py-2 px-3">Variable (Vimeo)</td>
              <td className="py-2 pl-3 pr-2">Reproducción de vídeos embebidos</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pl-2 pr-3">Google Fonts</td>
              <td className="py-2 px-3">Solicitud HTTP</td>
              <td className="py-2 px-3">Multimedia</td>
              <td className="py-2 px-3">—</td>
              <td className="py-2 pl-3 pr-2">Tipografías del sitio (no instala cookies, expone IP a Google)</td>
            </tr>
            <tr>
              <td className="py-2 pl-2 pr-3">OpenStreetMap tiles</td>
              <td className="py-2 px-3">Solicitud HTTP</td>
              <td className="py-2 px-3">Multimedia</td>
              <td className="py-2 px-3">—</td>
              <td className="py-2 pl-3 pr-2">Visualización del mapa Leaflet (no instala cookies, expone IP)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3. ¿Cómo gestionas tu consentimiento?</h2>
      <p>
        Al entrar por primera vez en el sitio, te mostramos un panel de cookies
        donde puedes <strong>aceptar todas</strong>, <strong>rechazar todas</strong>{' '}
        o <strong>configurar</strong> tus preferencias por categoría. Las
        cookies técnicas no se pueden desactivar porque son necesarias para el
        funcionamiento del sitio.
      </p>
      <p>
        Puedes <strong>revocar o modificar tu consentimiento</strong> en
        cualquier momento desde el enlace <em>"Configurar cookies"</em> del pie
        de página. Tu decisión se conserva durante 12 meses; pasado ese tiempo
        te volveremos a preguntar.
      </p>

      <h2>4. Configurar cookies en tu navegador</h2>
      <p>
        Independientemente de nuestro panel, puedes configurar la aceptación,
        rechazo o eliminación de cookies directamente en tu navegador:
      </p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/es/kb/proteccion-mejorada-contra-rastreo-firefox-escrito" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
        <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
      </ul>

      <h2>5. Cambios en esta política</h2>
      <p>
        Si modificamos esta política de cookies de manera sustancial,
        actualizaremos la versión y la fecha que figuran al inicio del
        documento, y volveremos a solicitar tu consentimiento.
      </p>

      <h2>6. Contacto</h2>
      <p>
        Para cualquier duda relacionada con cookies o privacidad, escríbenos a{' '}
        <a href="mailto:hola@ruralmakers.net">hola@ruralmakers.net</a>.
      </p>
    </>
  )
}
