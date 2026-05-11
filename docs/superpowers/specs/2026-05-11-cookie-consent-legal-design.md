# Cookie Consent + Páginas Legales — Diseño

**Fecha:** 2026-05-11
**Proyecto:** Rural Makers · Tejiendo Facenderas (`ruralmakers.net`)
**Responsable legal:** Asociación Indira (CIF G24730822) · C/ Única, 7, La Urz, León
**Marco legal:** LSSI-CE art. 22.2 · RGPD (UE 2016/679) · LOPDGDD (LO 3/2018) · Guía AEPD cookies (rev. 2023)

---

## 1. Objetivo

Añadir un sistema de consentimiento de cookies y los 4 documentos legales necesarios para que la web de Rural Makers cumpla la normativa española y europea aplicable, manteniendo la coherencia visual con el diseño actual de la landing (paleta dark, paleta verde rural, cards glass, botones rounded-full).

## 2. Decisiones tomadas durante el brainstorming

| # | Decisión | Valor |
|---|---|---|
| 1 | **Alcance** | Landing pública (`/` y `/conoce-la-app`) + `/app` + 4 documentos + checkbox RGPD newsletter (preparado pero no activado, porque el form actualmente está comentado) |
| 2 | **Datos del responsable** | Asociación Indira · CIF G24730822 · C/ Única, 7, La Urz (León) · `hola@ruralmakers.net` · sin DPD · sin tratamiento de menores · newsletter conservado hasta baja voluntaria |
| 3 | **Estrategia de cookies** | Banner simple (Aceptar / Rechazar / Configurar). Iframes de YouTube/Vimeo NO se bloquean a la espera de consentimiento (decisión del responsable, opción C del brainstorming) |
| 4 | **Estilo visual del banner** | Card flotante esquina inferior izquierda, glass + slideUp, paleta dark del sitio |
| 5 | **Estructura de páginas legales** | Una sola página `/legal` con tabs sincronizadas a la URL (`/legal/cookies`, `/legal/privacidad`, etc.) para mejor SEO sin perder la simplicidad de un único componente |

## 3. Arquitectura

### 3.1 Componentes y archivos nuevos

```
src/
├── shared/
│   ├── components/
│   │   ├── CookieBanner.jsx            # Card flotante (banner + panel "Configurar")
│   │   ├── LegalLink.jsx               # Link reutilizable a /legal#tab
│   │   └── NewsletterConsentCheckbox.jsx  # Listo para futuro
│   ├── hooks/
│   │   └── useCookieConsent.js         # Hook lectura/escritura del consentimiento
│   └── lib/
│       └── consent.js                  # Helpers consent storage + versionado
└── landing/
    ├── pages/
    │   └── Legal.jsx                   # Página única con tabs (4 documentos)
    └── legal/
        ├── PoliticaCookies.jsx
        ├── PoliticaPrivacidad.jsx
        ├── AvisoLegal.jsx
        └── CondicionesUso.jsx
```

### 3.2 Cambios en archivos existentes

| Archivo | Cambio |
|---|---|
| `src/main.jsx` | Añadir 5 rutas legales dentro de `<Route element={<LandingLayout />}>` |
| `src/landing/LandingLayout.jsx` | Montar `<CookieBanner />` al final del layout |
| `src/app/AppLayout.jsx` | Montar `<CookieBanner />` al final del layout |
| `src/landing/pages/Home.jsx` (Footer, líneas 1727-1735) | Reemplazar columna "Legal" placeholder con enlaces reales + botón "Configurar cookies" |
| `src/landing/pages/AppShowcase.jsx` (Footer línea 468) | Aplicar los mismos enlaces legales |
| `src/index.css` | Añadir clases `.prose-rural` y refinar `.tab-btn` para versión dark |

### 3.3 Lo que NO se modifica

- `AdminLayout` y todo `src/admin/**`: el banner no se muestra en el panel privado interno.
- El form de newsletter de `Home.jsx:1656`: actualmente comentado/desactivado. No se activa, pero se entrega `NewsletterConsentCheckbox` listo para integrar cuando se reactive.
- Backend en `server/` y `api/`: el sistema de consentimiento es 100% client-side (localStorage).

## 4. CookieBanner — comportamiento detallado

### 4.1 Estados

| Estado | Condición | UI |
|---|---|---|
| A — Sin decisión | `!isConsentValid()` | Card visible, slideUp anim |
| B — Decidido y vigente | `isConsentValid()` | Oculto |
| C — Configurando | Click en "Configurar" | Card expandido con toggles |

El banner reaparece automáticamente si:
- Usuario borra `localStorage`
- Han pasado más de 365 días desde el último consentimiento
- La versión de la política (constante `CONSENT_VERSION`) ha cambiado

### 4.2 Layout visual del banner

```
┌─────────────────────────────────────┐
│  🍪 Cookies                         │
│                                     │
│  Usamos cookies técnicas necesarias │
│  para que la web funcione. Con tu   │
│  consentimiento, también de         │
│  terceros (vídeos, mapas).          │
│  Más info en Política de cookies.   │
│                                     │
│  [Rechazar] [Configurar] [Aceptar]  │
└─────────────────────────────────────┘
```

**Especificaciones:**
- Posición: `fixed bottom-6 left-6`. En mobile (`< 640px`): `bottom-4 left-4 right-4` (full width).
- Ancho máx: `380px`. Mobile: full width.
- Z-index: `60` (encima del StickyCTA que está en `z-40`).
- Fondo: `bg-[#2C2A25]/95 backdrop-blur-xl border border-[#6B9E50]/20 rounded-2xl shadow-2xl shadow-black/50`
- Padding: `p-5`
- Animación entrada: `animate-[slideUp_0.4s_ease-out]` (keyframe ya existente)
- Tipografía: Lato 13px (cuerpo), Playfair 14px bold (título)

### 4.3 Botones — jerarquía visual (requisito AEPD)

Botones "Aceptar" y "Rechazar" deben tener **misma jerarquía visual**: mismo tamaño, ambos rounded-full sólidos:

| Botón | Estilo | Acción |
|---|---|---|
| **Rechazar** | `bg-white/10 text-[#F0EBE0] hover:bg-white/15` rounded-full px-4 py-2 text-[12px] font-bold | `setConsent("reject-all", { necessary: true, thirdParty: false })` |
| **Configurar** | Texto plano `text-[#B0A898] hover:text-[#F0EBE0] underline-offset-2 hover:underline` text-[12px] | Expande el card al panel de configuración |
| **Aceptar** | `bg-[#6B9E50] text-white hover:bg-[#4E7A38]` rounded-full px-4 py-2 text-[12px] font-bold | `setConsent("accept-all", { necessary: true, thirdParty: true })` |

### 4.4 Panel "Configurar"

Mismo card, expandido a ~480px alto:

```
┌─────────────────────────────────────┐
│  🍪 Configurar cookies        ✕     │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ ✅ Técnicas        [LOCKED]   │  │
│  │ Necesarias para el            │  │
│  │ funcionamiento del sitio.     │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ ⬜ Multimedia y terceros [⚙️]  │  │
│  │ YouTube, Vimeo, Google Fonts, │  │
│  │ mapa Leaflet.                 │  │
│  └───────────────────────────────┘  │
│                                     │
│  [Guardar preferencias] [Aceptar]   │
└─────────────────────────────────────┘
```

- Toggle "Técnicas" siempre activo (disabled, no se puede desmarcar — es legal).
- Toggle "Multimedia y terceros" opt-in (default OFF).
- Botón "Guardar preferencias" → `setConsent("save-preferences", { necessary: true, thirdParty: <toggle> })`.
- Botón ✕ cierra el panel sin guardar (vuelve al banner inicial).

### 4.5 Reapertura del banner

- Link **"Configurar cookies"** en el footer (en la columna Legal).
- Click dispara: `window.dispatchEvent(new CustomEvent('rm:open-cookie-banner'))`.
- El componente `CookieBanner` escucha ese evento y vuelve al estado A (banner visible) ignorando temporalmente `isConsentValid()`.

### 4.6 Accesibilidad

- `role="dialog"` + `aria-label="Consentimiento de cookies"`.
- Navegable con teclado (Tab order: Rechazar → Configurar → Aceptar).
- Focus-trap en el panel Configurar (cuando está expandido).
- `Esc` cierra el panel Configurar (no el banner inicial — esa decisión debe ser explícita).
- Contraste WCAG AA verificado para todos los textos.

## 5. Página `/legal` — estructura

### 5.1 Layout

Usa `LandingLayout` (hereda Nav + Footer existentes). Container: `max-w-[900px] mx-auto px-6 py-24`.

```
[Nav existente]
─────────────────────────────────────────────
  Información legal
  ─── (title-divider verde) ───

  [Cookies] [Privacidad] [Aviso legal] [Condiciones]   ← tabs
  ────────────────────────────────────────────

  ## Política de Cookies
  Versión 1.0 · Actualizada: 2026-05-11

  [contenido scrolleable, prose dark]

[Footer existente]
```

### 5.2 Tabs sincronizadas con URL

| URL | Tab activa |
|---|---|
| `/legal` | Cookies (default) |
| `/legal/cookies` | Cookies |
| `/legal/privacidad` | Privacidad |
| `/legal/aviso-legal` | Aviso legal |
| `/legal/condiciones-uso` | Condiciones |

- Click en tab → `navigate('/legal/<slug>')`.
- Lectura del slug con `useParams` o `useLocation`.
- Mismo componente `Legal.jsx` para todas las URLs (resuelve qué tab mostrar leyendo el path).

### 5.3 Estilo

- Tabs reutilizan `.tab-btn` (existente en `index.css`), versión dark añadida.
- Contenido envuelto en `.prose-rural` (clase nueva): tipografía Lato 15px, headings Playfair, color `#F0EBE0`, links verde `#6B9E50`, separadores `border-white/10`.
- Cada documento incluye al final: enlace `mailto:hola@ruralmakers.net` para ejercer derechos RGPD.

## 6. Contenido de los 4 documentos

### 6.1 🍪 Política de Cookies (~600 palabras)

- Qué son las cookies + base legal (LSSI art. 22.2 + RGPD art. 6.1.a)
- **Tabla detallada** de cookies y almacenamiento de Rural Makers:

| Nombre | Tipo | Categoría | Duración | Finalidad |
|---|---|---|---|---|
| `rm-landing-config` | localStorage | Técnica | Persistente | Configuración visual de la landing (admin) |
| `rm-cookie-consent` | localStorage | Técnica | 12 meses | Almacenar la decisión del usuario sobre cookies |
| `VISITOR_INFO1_LIVE`, `YSC`, `PREF`… | Cookie 3rd party | Multimedia | YouTube | Reproducción de vídeos embebidos |
| Cookies de Vimeo (si aplica) | Cookie 3rd party | Multimedia | Vimeo | Reproducción de vídeos embebidos |
| Google Fonts (sin cookies, IP) | Solicitud HTTP | Multimedia | — | Tipografías Playfair + Lato |
| OpenStreetMap tiles (sin cookies, IP) | Solicitud HTTP | Multimedia | — | Visualización del mapa Leaflet |

- Cómo aceptar/rechazar/revocar
- Configurar el navegador (links a docs oficiales de Chrome / Firefox / Safari / Edge)
- Versión y fecha de la política

### 6.2 🔒 Política de Privacidad (~800 palabras)

**Estructura:**
1. Responsable del tratamiento — Asociación Indira (CIF G24730822) · C/ Única, 7, La Urz (León) · `hola@ruralmakers.net`
2. Datos que tratamos:
   - Newsletter (cuando esté activo): email, IP, fecha/hora suscripción
   - Datos de navegación: logs técnicos
   - Formulario de contacto: email, contenido del mensaje
3. Finalidades:
   - Comunicación con personas interesadas
   - Gestión de suscripciones y bajas
   - Mejora del servicio y seguridad
4. Base jurídica: consentimiento explícito (art. 6.1.a RGPD) + interés legítimo para logs técnicos (art. 6.1.f)
5. Conservación:
   - Newsletter: hasta baja voluntaria
   - Logs técnicos: 12 meses
6. Destinatarios y encargados del tratamiento:
   - Vercel Inc. (hosting EEUU, transferencia internacional con cláusulas contractuales tipo)
   - No se comparten datos con terceros con fines de marketing
7. Derechos del interesado: acceso, rectificación, supresión, oposición, portabilidad, limitación → ejercer vía `hola@ruralmakers.net`
8. Reclamación ante autoridad: AEPD (`www.aepd.es`)
9. Menores: no se recogen datos de personas menores de 14 años
10. Cambios en la política

### 6.3 ⚖️ Aviso Legal (~400 palabras, LSSI art. 10)

- Titular: Asociación Indira · CIF G24730822 · C/ Única, 7, **[CP pendiente de confirmar — La Urz, León]** · `hola@ruralmakers.net`
- Inscripción: Registro de Asociaciones de Castilla y León — **[Nº inscripción pendiente]**
- Objeto del sitio: web informativa de la iniciativa Rural Makers · Tejiendo Facenderas
- Propiedad intelectual:
  - Código fuente: AGPL-3.0 (ya en footer)
  - Contenidos: CC BY-SA 4.0 (ya en footer)
- Limitación de responsabilidad
- Enlaces externos (Goteo, YouTube, OSM): se enlazan pero no se asume responsabilidad por su contenido
- Legislación aplicable: España. Jurisdicción: tribunales de León

### 6.4 📜 Condiciones de Uso del Sitio (~500 palabras)

- Aceptación implícita al navegar
- Uso permitido: informativo, no comercial sin permiso
- Prohibiciones: scraping masivo, ingeniería inversa para uso lucrativo, suplantación, ataques DoS
- Disponibilidad: "best effort" (sin SLA — entidad asociativa)
- Modificaciones del servicio: sin aviso previo
- Ley aplicable: España. Jurisdicción: León

### 6.5 Disclaimer (interno, no se publica)

Las plantillas están adaptadas al caso real de la asociación con los datos proporcionados, pero no sustituyen asesoría jurídica profesional. Para el alcance actual (asociación rural pequeña, sin tratamiento masivo, sin publicidad, sin marketing automatizado), están alineadas con plantillas AEPD y suficientes para la actividad descrita.

## 7. Sistema de almacenamiento del consentimiento

### 7.1 Storage

**Key:** `rm-cookie-consent` (localStorage).

**Valor (JSON):**
```json
{
  "version": "1.0",
  "timestamp": "2026-05-11T14:32:18.123Z",
  "categories": {
    "necessary": true,
    "thirdParty": false
  },
  "method": "reject-all"
}
```

**Campos:**
- `version` — string. Si cambia `CONSENT_VERSION` en código, el banner reaparece.
- `timestamp` — ISO 8601 UTC.
- `categories.necessary` — siempre `true`.
- `categories.thirdParty` — `boolean`.
- `method` — `"accept-all" | "reject-all" | "save-preferences"`. Prueba del método de consentimiento (RGPD art. 7.1).

### 7.2 Caducidad

12 meses desde `timestamp`. Pasado ese plazo, `isConsentValid()` retorna `false` y el banner reaparece.

### 7.3 API del helper `consent.js`

```js
export const CONSENT_VERSION = '1.0'
export const CONSENT_KEY = 'rm-cookie-consent'
export const CONSENT_TTL_MS = 365 * 24 * 60 * 60 * 1000

export function getConsent() { /* ... */ }
export function setConsent(method, categories) { /* ... */ }
export function clearConsent() { /* ... */ }
export function hasConsentFor(category) { /* ... */ }
export function isConsentValid() { /* ... */ }
```

### 7.4 Hook `useCookieConsent`

```js
const {
  consent,        // objeto completo o null
  isVisible,      // boolean: ¿debe mostrarse el banner?
  accept,         // () => void
  reject,         // () => void
  save,           // (categories) => void
  openBanner,     // () => void (forzar reapertura)
} = useCookieConsent()
```

Internamente escucha el evento `rm:open-cookie-banner` para reapertura desde el footer.

## 8. Footer — actualización de la columna "Legal"

### 8.1 Estado actual (`Home.jsx:1727-1735`)

```jsx
<div>
  <div className="text-[10px] ... uppercase ... mb-4 font-bold">Legal</div>
  <div className="space-y-2.5 text-[13px]">
    <a href="mailto:hola@ruralmakers.net">hola@ruralmakers.net</a>
    <p>Licencia: AGPL-3.0</p>
    <p>Contenido: CC BY-SA 4.0</p>
    <p>Beneficiaria: Asoc. Indira</p>
  </div>
</div>
```

### 8.2 Estado futuro

```jsx
<div>
  <div className="text-[10px] ... uppercase ... mb-4 font-bold">Legal</div>
  <div className="space-y-2.5 text-[13px]">
    <Link to="/legal/aviso-legal">Aviso legal</Link>
    <Link to="/legal/privacidad">Política de privacidad</Link>
    <Link to="/legal/cookies">Política de cookies</Link>
    <Link to="/legal/condiciones-uso">Condiciones de uso</Link>
    <button onClick={openCookieBanner}>Configurar cookies</button>
    <p className="pt-2 border-t border-white/5">Licencia código: AGPL-3.0</p>
    <p>Contenido: CC BY-SA 4.0</p>
    <p>Titular: Asoc. Indira (G24730822)</p>
    <a href="mailto:hola@ruralmakers.net">hola@ruralmakers.net</a>
  </div>
</div>
```

Mismo cambio aplicado a `AppShowcase.jsx` (Footer en la línea 468).

## 9. Cumplimiento normativo — checklist

| Requisito | Cumplimiento |
|---|---|
| LSSI art. 22.2: información clara antes de instalar cookies no técnicas | ✅ Banner antes de carga de iframes (atención: opción C elegida no bloquea iframes — el responsable asume el riesgo informado) |
| AEPD 2023: botones aceptar/rechazar misma jerarquía visual | ✅ Mismo tamaño, mismo estilo rounded-full sólido |
| AEPD 2023: opción de rechazo accesible en primera capa | ✅ Botón "Rechazar" en banner inicial |
| AEPD 2023: granularidad por categoría | ✅ Panel "Configurar" con toggles |
| RGPD art. 7: prueba del consentimiento | ✅ `method` + `timestamp` + `version` almacenados |
| RGPD art. 7.3: revocar tan fácil como dar | ✅ "Configurar cookies" en footer reabre banner |
| Caducidad consentimiento (recomendación AEPD: 24m máx, 12m recomendado) | ✅ 12 meses |
| LSSI art. 10: identificación del prestador | ✅ Aviso legal completo |
| RGPD art. 13: información al recoger datos | ✅ Política de privacidad enlazada en footer y banner |
| LOPDGDD: derechos ARCO-POL | ✅ Sección dedicada en política de privacidad |

## 10. Fuera de alcance

Decisiones explícitamente NO incluidas en este diseño:

- **Geo-targeting**: el banner se muestra a todos los visitantes (no solo EU). Simplifica y no perjudica.
- **Multilenguaje**: el sitio es es-ES only; los documentos se redactan solo en español.
- **Backend de logging del consentimiento**: localStorage + versionado son suficientes para una asociación pequeña sin tratamiento masivo.
- **Bloqueo de iframes hasta consentimiento**: descartado por decisión del responsable (opción C). Si en el futuro se añade Google Analytics o publicidad, sería conveniente revisar esta decisión y migrar a opción A (granular estricto con bloqueo).
- **Activación del newsletter**: el form sigue comentado en `Home.jsx:1656`. Se entrega `NewsletterConsentCheckbox` listo para usar cuando se reactive.
- **Cambios en el admin (`/admin/*`)**: el banner no se monta ahí porque es panel privado interno.

## 11. Pendientes a confirmar por el responsable (placeholders en los documentos)

- **Código postal completo** de C/ Única, 7, La Urz (probablemente 24127 — código de Riello, León — pero a confirmar).
- **Número y fecha de inscripción** en el Registro de Asociaciones de Castilla y León.

Estos dos campos quedarán como `[CP pendiente]` y `[Nº inscripción pendiente]` en el aviso legal hasta que se faciliten.
