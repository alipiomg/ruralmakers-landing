export const meta = {
  slug: 'privacidad',
  title: 'Política de Privacidad',
  version: '1.0',
  updatedAt: '2026-05-11',
  icon: '🔒',
}

export default function PoliticaPrivacidad() {
  return (
    <>
      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li><strong>Titular:</strong> Asociación Indira</li>
        <li><strong>CIF:</strong> G24730822</li>
        <li><strong>Domicilio:</strong> C/ Única, 7, 24127 La Urz, León, España</li>
        <li><strong>Contacto:</strong> <a href="mailto:hola@ruralmakers.net">hola@ruralmakers.net</a></li>
        <li><strong>Delegado de Protección de Datos:</strong> No designado (no concurren los supuestos del art. 37 RGPD).</li>
      </ul>

      <h2>2. Datos que tratamos</h2>
      <p>En este sitio podemos tratar las siguientes categorías de datos personales:</p>
      <ul>
        <li><strong>Suscripción al boletín</strong> (cuando esté activo): dirección de correo electrónico, dirección IP, fecha y hora de suscripción.</li>
        <li><strong>Comunicaciones</strong>: cuando nos escribes a <a href="mailto:hola@ruralmakers.net">hola@ruralmakers.net</a>, tratamos los datos que tú nos facilites en el mensaje.</li>
        <li><strong>Datos de navegación</strong>: información técnica básica recopilada por el hosting (logs de acceso, dirección IP, user-agent) durante un máximo de 12 meses por motivos de seguridad y diagnóstico.</li>
      </ul>
      <p><strong>No tratamos categorías especiales de datos</strong> (salud, ideología, origen, biometría, etc.) ni recogemos datos de personas menores de 14 años.</p>

      <h2>3. Finalidades del tratamiento</h2>
      <ul>
        <li>Atender tus consultas y comunicaciones.</li>
        <li>Gestionar tu suscripción al boletín y enviarte novedades del proyecto Rural Makers.</li>
        <li>Mantener el sitio operativo, seguro y libre de abuso.</li>
        <li>Cumplir con las obligaciones legales aplicables.</li>
      </ul>

      <h2>4. Base jurídica</h2>
      <ul>
        <li><strong>Consentimiento</strong> del interesado (art. 6.1.a RGPD) para la suscripción al boletín y para las cookies no técnicas.</li>
        <li><strong>Interés legítimo</strong> (art. 6.1.f RGPD) del responsable para el mantenimiento de logs técnicos y la seguridad del servicio.</li>
        <li><strong>Ejecución de la respuesta</strong> a tu solicitud (art. 6.1.b RGPD) cuando nos escribes una consulta.</li>
      </ul>

      <h2>5. Plazos de conservación</h2>
      <ul>
        <li><strong>Boletín</strong>: hasta que ejerzas tu derecho de baja voluntaria o supresión.</li>
        <li><strong>Logs técnicos</strong>: 12 meses.</li>
        <li><strong>Comunicaciones por email</strong>: el tiempo necesario para responder y, después, durante el plazo de prescripción de eventuales acciones legales.</li>
      </ul>

      <h2>6. Destinatarios y encargados del tratamiento</h2>
      <p>Para prestar el servicio recurrimos a los siguientes proveedores que actúan como encargados del tratamiento:</p>
      <ul>
        <li><strong>Vercel Inc.</strong> (Estados Unidos) — alojamiento del sitio web. Transferencia internacional amparada en cláusulas contractuales tipo aprobadas por la Comisión Europea.</li>
      </ul>
      <p>
        <strong>No cedemos tus datos a terceros con fines comerciales ni publicitarios.</strong>{' '}
        Cuando enlazamos a sitios externos (Goteo, YouTube, etc.) esos sitios
        aplican sus propias políticas de privacidad y no son responsabilidad
        nuestra.
      </p>

      <h2>7. Tus derechos</h2>
      <p>
        Puedes ejercer en cualquier momento tus derechos de{' '}
        <strong>acceso, rectificación, supresión, oposición, limitación del
        tratamiento y portabilidad</strong> de tus datos enviándonos un correo a{' '}
        <a href="mailto:hola@ruralmakers.net">hola@ruralmakers.net</a>{' '}
        indicando el derecho que deseas ejercer. También puedes retirar tu
        consentimiento en cualquier momento sin que ello afecte a la licitud
        del tratamiento previo.
      </p>
      <p>
        Si consideras que el tratamiento de tus datos no se ajusta a la
        normativa, tienes derecho a presentar una reclamación ante la{' '}
        <strong>Agencia Española de Protección de Datos</strong>{' '}
        (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>).
      </p>

      <h2>8. Menores de edad</h2>
      <p>
        No recogemos intencionadamente datos personales de personas menores de
        14 años. Si detectamos que se ha facilitado información de un menor sin
        el consentimiento parental correspondiente, procederemos a su
        supresión.
      </p>

      <h2>9. Cambios en esta política</h2>
      <p>
        Podemos actualizar esta política para reflejar cambios legales,
        técnicos u operativos. La versión y la fecha al inicio del documento
        indican siempre el estado vigente. Si los cambios son sustanciales, te
        lo comunicaremos por los canales habituales.
      </p>
    </>
  )
}
