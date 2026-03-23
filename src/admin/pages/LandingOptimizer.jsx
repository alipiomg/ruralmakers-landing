import { useState } from 'react'
import { BASE44_LANDING } from '../../shared/lib/constants'

const tabs = ['Analisis & Copy', 'Prompts Base44', 'Buscar en 21st.dev', 'Hero Video', 'Skill Base44']

// ─── COPY ANALYSIS ──────────────────────────────────────────────
const copyReview = [
  {
    section: 'Hero / Encabezado',
    current: 'Rural Makers - Tejiendo Facenderas',
    issues: [
      'Falta subtitulo de propuesta de valor clara',
      'No hay urgencia ni CTA visible en el primer pantallazo',
      'El concepto "facendera" necesita contexto inmediato para quien no lo conoce',
    ],
    suggestions: [
      'Anadir subtitulo: "La red que conecta personas, saberes y proyectos para revivir el mundo rural"',
      'CTA principal visible: "Apoya en Goteo" con enlace directo',
      'Micro-copy bajo el titulo: "Facendera: tradicion leonesa de trabajo comunitario"',
      'Contador de dias restantes o barra de progreso del crowdfunding',
    ],
  },
  {
    section: 'Que es Rural Makers',
    current: 'Descripcion de la iniciativa colaborativa',
    issues: [
      'Texto demasiado largo sin jerarquia visual',
      'Mezcla conceptos (app, asociacion, facenderas) sin separar beneficios',
    ],
    suggestions: [
      'Dividir en 3 bloques con iconos: CONECTA (personas) + CREA (facenderas) + CRECE (territorio)',
      'Usar bullet points con emojis o iconos SVG en lugar de parrafos largos',
      'Anadir numeros concretos: "X pueblos participando" o "X facenderas realizadas"',
    ],
  },
  {
    section: 'Funcionalidades de la App',
    current: 'Lista de features de RuralMakers.app',
    issues: [
      'Las features se leen como lista tecnica, no como beneficios',
      'Falta captura o mockup de la app en uso',
    ],
    suggestions: [
      'Reformular como beneficios: "Encuentra facenderas cerca de ti" en vez de "Mapear facenderas"',
      'Anadir mockup del telefono con la app (usar prompt de imagen para generarlo)',
      'Incluir un mini-demo GIF o video corto del prototipo',
    ],
  },
  {
    section: 'Llamada a la Accion',
    current: 'Enlace a Goteo',
    issues: [
      'CTA no destaca visualmente',
      'Falta sentido de urgencia y social proof',
    ],
    suggestions: [
      'Boton grande con color contrastante (dorado #D4A843 sobre verde)',
      'Anadir: "Unete a los X primeros impulsores"',
      'Incluir las recompensas mas atractivas como preview: "Desde 13EUR eres parte del cambio"',
      'Timer de campana si ya esta activa',
    ],
  },
  {
    section: 'Prueba Social',
    current: 'Puede que no exista aun',
    issues: [
      'Sin testimonios, logos de apoyo ni menciones en prensa',
    ],
    suggestions: [
      'Anadir seccion "Quienes nos apoyan" con logos de Asociacion Indira, colaboradores',
      'Testimonios de participantes de facenderas anteriores (pueden ser generados como placeholder)',
      'Mencionar si hay apoyo institucional (Diputacion, etc.)',
    ],
  },
  {
    section: 'Footer',
    current: 'Enlaces y redes sociales',
    issues: [
      'Puede faltar enlace a ruralmakers.net como demo de la app',
    ],
    suggestions: [
      'Anadir enlace claro a ruralmakers.net como "Prueba el prototipo"',
      'Redes sociales con iconos grandes',
      'Newsletter o formulario de "mantente informado"',
    ],
  },
]

// ─── BASE44 PROMPTS ────────────────────────────────────────────
const base44Prompts = [
  {
    category: 'Hero con Video de Fondo',
    prompt: `Add a hero section with a fullscreen background video. Use a placeholder image that shows while the video loads. The video should autoplay muted and loop. Overlay the hero with a dark gradient (from black/60 to transparent). Center the title "Rural Makers" in large white text with subtitle "Tejiendo Facenderas - La red que revive el mundo rural" below. Add a primary CTA button "Apoya en Goteo" in golden color (#D4A843) and a secondary ghost button "Ver el prototipo". Make the hero take 100vh height.`,
    notes: 'El video se sube al media de Base44 o se usa un embed de YouTube',
  },
  {
    category: 'Seccion de Impacto con Contadores',
    prompt: `Create an impact section with 4 animated counter cards in a row. Each card has a large number, a label below, and a subtle icon. Numbers: "10+" label "Pueblos conectados", "50+" label "Personas activas", "15+" label "Facenderas realizadas", "1" label "App en desarrollo". Use green (#4a7c59) as accent color. Cards should have a slight elevation shadow and animate the numbers counting up when they scroll into view.`,
    notes: 'Numeros placeholder que se actualizaran con datos reales',
  },
  {
    category: 'Grid de Beneficios',
    prompt: `Add a 3-column feature grid section titled "Como funciona Rural Makers". Each feature card has an icon at top, a title, and 2-line description. Features: 1) Icon: map pin - "Encuentra Facenderas" - "Descubre encuentros colaborativos cerca de ti y unete a la accion comunitaria" 2) Icon: people - "Conecta y Comparte" - "Encuentra personas con tus mismos intereses y comparte herramientas, saberes y proyectos" 3) Icon: rocket - "Impulsa tu Territorio" - "Participa en rutas rurales, aprende con modulos gamificados y deja huella en tu comarca". Use subtle green backgrounds (#f0f7f2) and hover effects.`,
    notes: 'Clave: beneficios, no features tecnicas',
  },
  {
    category: 'Seccion de la App - Mockup',
    prompt: `Create a split section: left side has text content "RuralMakers.app" as title, subtitle "Tu herramienta para tejer comunidad rural", then 4 bullet points with check icons: "Crea y coordina facenderas", "Comparte recursos y saberes", "Explora rutas rurales interconectadas", "Aprende con modulos gamificados y IA". Below bullets add a link "Prueba el prototipo en ruralmakers.net". Right side shows a phone mockup frame with an iframe or screenshot of the app. Background: soft cream (#fdf8f0).`,
    notes: 'Usar una captura de ruralmakers.net para el mockup',
  },
  {
    category: 'Timeline del Proyecto',
    prompt: `Add a vertical timeline section titled "Hoja de Ruta Rural Makers". Use alternating left-right layout. Steps: 1) "Crowdfunding en Goteo" - "Lanzamos la campana para financiar el desarrollo de la plataforma" (status: active, highlighted green), 2) "Desarrollo de la App" - "Construccion de RuralMakers.app con la comunidad" (status: upcoming), 3) "Primeras Facenderas Digitales" - "Organizacion de los primeros encuentros coordinados con la app" (status: upcoming), 4) "Expansion Territorial" - "Crecimiento a mas comarcas y creacion de ASASA" (status: upcoming). Active step pulses with green glow.`,
    notes: 'Genera sensacion de progreso y plan claro',
  },
  {
    category: 'Seccion CTA Final con Recompensas',
    prompt: `Create a full-width CTA section with green gradient background (#4a7c59 to #3a6147). Center text: "Se parte del cambio rural" as title, "Desde 13 EUR puedes impulsar Rural Makers" as subtitle. Below, show 3 featured reward cards in a row (white cards on green bg): "13 EUR - Semilla del Cambio", "40 EUR - Amigo Rural Maker", "100 EUR - Impulsor del Cambio". Each card has the price, name, and a 1-line description. Below cards, a large golden button "Apoyar en Goteo" linking to the Goteo campaign.`,
    notes: 'Las recompensas destacadas deben ser las mas populares o las de mejor conversion',
  },
  {
    category: 'Preloader con imagen de fondo',
    prompt: `Add a page preloader that shows a fullscreen image of a rural landscape while the page loads. The image should fade out smoothly when the page is ready. Use a high-quality placeholder image with the Rural Makers logo centered and a subtle loading spinner below it. Transition: 0.8s fade-out with ease-in-out. The preloader div should have z-index 9999 and fixed position.`,
    notes: 'La imagen del preloader luego se reutiliza como fallback del video hero',
  },
  {
    category: 'Seccion Testimonios / Historias',
    prompt: `Add a testimonial carousel section titled "Historias del Rural". 3 cards that auto-rotate every 5 seconds with fade transition. Each card has: a quote in italic, person name, role/village. Quotes: 1) "Desde que participo en las facenderas, mi pueblo ha vuelto a tener vida los sabados" - Maria, Agricultora, La Omana. 2) "Rural Makers nos ha conectado con gente que tenia las mismas ganas de hacer cosas" - Pedro, Artesano, Riano. 3) "La tecnologia al servicio del pueblo, eso es lo que necesitabamos" - Ana, Profesora, Astorga. Subtle green quotation marks as decoration.`,
    notes: 'Historias placeholder - reemplazar con testimonios reales cuando los haya',
  },
]

// ─── 21ST.DEV SUGGESTIONS ──────────────────────────────────────
const suggestions21st = [
  {
    name: 'Particles / Nature Background',
    query: 'particle background nature organic',
    description: 'Fondo con particulas organicas flotando (semillas, hojas, estrellas). Da sensacion de vida y movimiento natural. Perfecto para el hero o secciones de transicion.',
    howToUse: 'Importar el componente, colocarlo como fondo absoluto del hero. Ajustar colores a verdes y dorados rurales.',
  },
  {
    name: 'Animated Counter / Stats',
    query: 'animated counter stats number',
    description: 'Contadores animados que suben al hacer scroll. Ideal para la seccion de impacto (pueblos, personas, facenderas).',
    howToUse: 'Usar con Intersection Observer. Poner en la seccion de metricas de impacto.',
  },
  {
    name: 'Gradient Mesh / Aurora',
    query: 'gradient mesh aurora background',
    description: 'Fondo mesh con gradiente tipo aurora boreal pero en tonos verdes y dorados. Efecto visual premium y organico.',
    howToUse: 'Como fondo de la seccion CTA final o del hero alternativo. Tonos: #4a7c59, #D4A843, #87CEEB.',
  },
  {
    name: 'Scroll Reveal / Fade In',
    query: 'scroll reveal fade in animation',
    description: 'Animaciones de entrada al hacer scroll. Componentes aparecen con fade, slide o scale. Muy profesional.',
    howToUse: 'Envolver cada seccion de la landing. Delays escalonados para las cards.',
  },
  {
    name: 'Interactive Map / Globe',
    query: 'interactive globe map 3d',
    description: 'Globo 3D o mapa interactivo. Podria mostrar la ubicacion de Rural Makers en Leon con puntos de luz.',
    howToUse: 'Seccion "Donde estamos" con zoom en la provincia de Leon. Puntos animados en los pueblos.',
  },
  {
    name: 'Bento Grid Layout',
    query: 'bento grid layout cards',
    description: 'Layout tipo bento (estilo Apple) con cards de diferentes tamanos. Muy moderno para mostrar features.',
    howToUse: 'Reemplazar el grid de beneficios actual. Cards grandes para features principales, pequenas para secundarias.',
  },
  {
    name: 'Text Reveal / Typewriter',
    query: 'text reveal typewriter animation',
    description: 'El titulo del hero se escribe letra a letra o se revela con efecto. Atrae la atencion inmediatamente.',
    howToUse: 'Aplicar al titulo principal del hero. "Rural Makers" aparece con efecto de escritura.',
  },
  {
    name: 'Card Hover 3D / Tilt',
    query: 'card hover 3d tilt effect',
    description: 'Cards que se inclinan siguiendo el cursor. Efecto de profundidad elegante.',
    howToUse: 'En las cards de recompensas o de features. Sutil, no exagerado.',
  },
  {
    name: 'Marquee / Infinite Scroll',
    query: 'marquee infinite scroll logos',
    description: 'Banda de logos que se mueve infinitamente. Para mostrar colaboradores, medios, o tecnologias usadas.',
    howToUse: 'Seccion "Nos apoyan" con logos de asociaciones, instituciones, etc.',
  },
  {
    name: 'Spotlight / Cursor Glow',
    query: 'spotlight cursor glow effect',
    description: 'Efecto de luz que sigue el cursor. Crea sensacion de profundidad y modernidad.',
    howToUse: 'En la seccion hero o en cards interactivas. Efecto sutil con color verde/dorado.',
  },
]

// ─── HERO VIDEO CONCEPT ────────────────────────────────────────
const heroVideoConcept = {
  strategy: [
    'Usar una imagen de alta calidad como fondo PRELOAD (se muestra instantaneamente)',
    'La imagen debe ser un frame representativo del video (amanecer rural, paisaje de Leon)',
    'El video se carga en background con <video preload="auto">',
    'Cuando el video esta listo, transicion suave (crossfade 1.5s) de imagen a video',
    'Si el video falla o en movil con datos, la imagen queda como fallback',
    'Video: loop, muted, autoplay, playsinline (para iOS)',
  ],
  imagePrompt: 'Panoramic landscape photograph of a misty green valley in Leon, Spain at golden hour. Traditional stone village nestled between mountains. Warm golden sunlight streaming through clouds. Cinematic composition, wide angle, National Geographic quality. Colors: deep greens, golden yellows, soft blue sky. No text or overlays.',
  videoPromptKling: 'Cinematic slow-motion aerial dolly shot over a lush green valley in Leon, Spain. Camera moves forward revealing a traditional stone village at golden hour. Mountains in background, gentle mist in the valley. Warm sunlight, long shadows. Ultra smooth camera movement. 8K cinematic quality. Duration: 15 seconds. Style: documentary, National Geographic.',
  videoPromptHiggsfield: 'Slow aerial flyover of green mountains and traditional Spanish village at sunrise. Golden hour lighting, mist in valleys. Smooth continuous camera movement forward. Cinematic quality, warm tones. 5 seconds.',
  cssImplementation: `/* En Base44, pedir que añada este patron al hero */
.hero-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}
.hero-bg-image {
  position: absolute;
  inset: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
  z-index: 1;
  transition: opacity 1.5s ease-in-out;
}
.hero-bg-image.hidden {
  opacity: 0;
}
.hero-video {
  position: absolute;
  inset: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.5) 0%,
    rgba(0,0,0,0.2) 50%,
    rgba(0,0,0,0.6) 100%
  );
  z-index: 2;
}
.hero-content {
  position: relative;
  z-index: 3;
  /* ... contenido centrado ... */
}`,
  base44Prompt: `Replace the current hero section with a fullscreen video hero. Structure:
1. A background <img> that loads instantly showing a rural landscape (this is the preloader image)
2. A <video> element behind the image: autoplay, muted, loop, playsinline
3. When video canplay event fires, fade out the image (opacity 0, transition 1.5s) revealing the video
4. Dark gradient overlay on top of both (rgba black 50% to 20% to 60%)
5. Hero content centered: "Rural Makers" large title, "Tejiendo Facenderas" subtitle, two CTA buttons
6. Scroll indicator arrow at bottom, animated bounce
7. On mobile, only show the image (skip video to save data)
The hero should be 100vh height. Use smooth fade transitions.`,
}

// ─── SKILL PROMPT FOR BASE44 ─────────────────────────────────
const skillBase44 = {
  name: 'Rural Makers Landing Optimizer',
  description: 'Skill para mejorar iterativamente la landing de Rural Makers en Base44',
  prompt: `Eres un experto en diseno de landing pages de crowdfunding y UX/UI. Tu mision es mejorar la landing page de Rural Makers en Base44.

CONTEXTO DEL PROYECTO:
- Rural Makers es una iniciativa colaborativa que impulsa el mundo rural en Leon, Espana
- Usa el concepto de "facenderas" (tradicion leonesa de trabajo comunitario)
- Tiene un crowdfunding activo en Goteo (objetivo minimo: 10.700 EUR, optimo: 55.000 EUR)
- La app RuralMakers.app conecta personas, facenderas y proyectos rurales
- Landing actual: ruralmakers.base44.app
- Prototipo de app: ruralmakers.net

PALETA DE COLORES:
- Verde principal: #4a7c59 (rural-green)
- Verde oscuro: #3a6147
- Dorado/tierra: #D4A843
- Marron: #8B6914
- Crema: #fdf8f0
- Cielo: #87CEEB

PRINCIPIOS DE DISENO:
1. Mobile-first: la mayoria del trafico vendra de redes sociales
2. Carga rapida: imagen de preload antes del video
3. Copy orientado a BENEFICIOS, no a features tecnicas
4. CTAs claros hacia Goteo en cada seccion
5. Prueba social: testimonios, numeros, logos de apoyo
6. Urgencia: timer de campana, plazas limitadas en recompensas
7. Storytelling visual: del problema (despoblacion) a la solucion (Rural Makers)
8. Conexion emocional: fotos reales > stock, historias de personas reales

CUANDO ME MENCIONES, HARÉ:
1. Revisar la seccion que quieras mejorar
2. Proponer copy mejorado (conciso, emocional, orientado a accion)
3. Dar el prompt exacto para Base44 para implementar el cambio
4. Sugerir componentes de 21st.dev relevantes
5. Verificar que el resultado es responsive y rapido

FORMATO DE RESPUESTA:
- Seccion a mejorar
- Problema actual
- Solucion propuesta
- Prompt para Base44
- Componente 21st.dev sugerido (si aplica)
- Copy final sugerido`,
  howToUse: [
    'Copia este prompt como instrucciones del chat de Base44',
    'O crealo como skill de Claude Code para mencionarlo con @',
    'Cada vez que quieras mejorar algo, describe que seccion y el skill te guia',
    'Ejemplo: "Mejora el hero para que tenga video de fondo y mejor CTA"',
    'El skill generara el prompt exacto para Base44',
  ],
}

// ─── COMPONENTS ────────────────────────────────────────────────
function CopyCard({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card border border-gray-100">
      <button onClick={() => setOpen(!open)} className="w-full text-left">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-800">{item.section}</h4>
          <svg className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <p className="text-xs text-gray-400 mt-1">Actual: {item.current}</p>
      </button>
      {open && (
        <div className="mt-4 space-y-4">
          <div>
            <h5 className="text-xs font-semibold text-red-600 uppercase mb-2">Problemas detectados</h5>
            <ul className="space-y-1">
              {item.issues.map((issue, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-red-400 shrink-0">!</span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-semibold text-rural-green uppercase mb-2">Sugerencias de mejora</h5>
            <ul className="space-y-1">
              {item.suggestions.map((sug, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-rural-green shrink-0">+</span>
                  {sug}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

function PromptCard({ item, index }) {
  const [copied, setCopied] = useState(false)
  const copyPrompt = () => {
    navigator.clipboard.writeText(item.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="card border border-gray-100">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs text-rural-green font-mono">#{index + 1}</span>
          <h4 className="font-semibold text-gray-800">{item.category}</h4>
        </div>
        <button onClick={copyPrompt} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 transition shrink-0">
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      <pre className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap font-mono leading-relaxed max-h-40 overflow-auto">
        {item.prompt}
      </pre>
      {item.notes && (
        <p className="text-xs text-amber-600 mt-2 italic">Nota: {item.notes}</p>
      )}
    </div>
  )
}

export default function LandingOptimizer() {
  const [tab, setTab] = useState(0)
  const [copiedSkill, setCopiedSkill] = useState(false)

  const copySkillPrompt = () => {
    navigator.clipboard.writeText(skillBase44.prompt)
    setCopiedSkill(true)
    setTimeout(() => setCopiedSkill(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-800">Landing Optimizer</h2>
        <span className="text-xs px-2 py-1 bg-rural-green/10 text-rural-green rounded-full">Base44</span>
        <div className="flex gap-2 ml-auto">
          <a href={BASE44_LANDING} target="_blank" rel="noopener noreferrer"
            className="px-3 py-1.5 bg-rural-green text-white text-sm rounded-lg hover:bg-rural-green-dark transition">
            Ver Landing
          </a>
          <a href="https://21st.dev" target="_blank" rel="noopener noreferrer"
            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition">
            21st.dev
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={`tab-btn ${tab === i ? 'active' : ''}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab: Copy Analysis */}
      {tab === 0 && (
        <div className="space-y-3">
          <div className="card bg-amber-50 border border-amber-200">
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Revision de Copy & UX</h3>
            <p className="text-xs text-amber-700">
              Analisis seccion por seccion de la landing actual con problemas detectados y sugerencias de mejora.
              Haz clic en cada seccion para expandir los detalles.
            </p>
          </div>
          {copyReview.map((item, i) => (
            <CopyCard key={i} item={item} />
          ))}
        </div>
      )}

      {/* Tab: Base44 Prompts */}
      {tab === 1 && (
        <div className="space-y-3">
          <div className="card bg-blue-50 border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-1">Prompts para Base44</h3>
            <p className="text-xs text-blue-700">
              Copia estos prompts y pegalos en el chat de Base44 para implementar cada mejora.
              Estan ordenados por prioridad de impacto en la conversion.
            </p>
          </div>
          {base44Prompts.map((item, i) => (
            <PromptCard key={i} item={item} index={i} />
          ))}
        </div>
      )}

      {/* Tab: 21st.dev */}
      {tab === 2 && (
        <div className="space-y-3">
          <div className="card bg-purple-50 border border-purple-200">
            <h3 className="text-sm font-semibold text-purple-800 mb-1">Componentes de 21st.dev</h3>
            <p className="text-xs text-purple-700">
              Busca estos componentes en <a href="https://21st.dev" target="_blank" rel="noopener noreferrer" className="underline">21st.dev</a> y pidele a Base44 que los integre en la landing.
              Cada uno tiene instrucciones de como aplicarlo al contexto Rural Makers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {suggestions21st.map((item, i) => (
              <div key={i} className="card border border-gray-100 hover:border-purple-200 transition">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                  <a
                    href={`https://21st.dev/search?q=${encodeURIComponent(item.query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-600 hover:underline shrink-0"
                  >
                    Buscar
                  </a>
                </div>
                <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                <div className="text-xs bg-purple-50 rounded p-2 text-purple-700">
                  <span className="font-semibold">Como usarlo:</span> {item.howToUse}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Hero Video */}
      {tab === 3 && (
        <div className="space-y-4">
          <div className="card bg-gradient-to-r from-gray-800 to-gray-900 text-white">
            <h3 className="text-sm font-semibold mb-2">Concepto: Hero con Preload de Imagen + Video de Fondo</h3>
            <p className="text-xs opacity-80">
              La imagen carga al instante como fondo del hero. El video se carga en segundo plano.
              Cuando esta listo, transicion suave de imagen a video. En movil, solo imagen.
            </p>
          </div>

          <div className="card">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Estrategia de implementacion</h4>
            <ol className="space-y-2">
              {heroVideoConcept.strategy.map((step, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-rural-green font-mono text-xs mt-0.5">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card border border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Prompt Imagen (Preload)</h4>
              <pre className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap font-mono">
                {heroVideoConcept.imagePrompt}
              </pre>
            </div>
            <div className="card border border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Prompt Video (Kling 3.0)</h4>
              <pre className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap font-mono">
                {heroVideoConcept.videoPromptKling}
              </pre>
            </div>
          </div>

          <div className="card border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Prompt Video (Higgsfield)</h4>
            <pre className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap font-mono">
              {heroVideoConcept.videoPromptHiggsfield}
            </pre>
          </div>

          <div className="card border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-700">Prompt para Base44 (implementar hero)</h4>
              <button
                onClick={() => { navigator.clipboard.writeText(heroVideoConcept.base44Prompt) }}
                className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                Copiar
              </button>
            </div>
            <pre className="text-xs text-gray-600 bg-blue-50 rounded-lg p-3 whitespace-pre-wrap font-mono">
              {heroVideoConcept.base44Prompt}
            </pre>
          </div>

          <div className="card border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">CSS de referencia</h4>
            <pre className="text-xs text-gray-600 bg-gray-900 text-green-400 rounded-lg p-3 whitespace-pre-wrap font-mono max-h-60 overflow-auto">
              {heroVideoConcept.cssImplementation}
            </pre>
          </div>
        </div>
      )}

      {/* Tab: Skill Base44 */}
      {tab === 4 && (
        <div className="space-y-4">
          <div className="card bg-gradient-to-r from-rural-green to-rural-green-dark text-white">
            <h3 className="text-sm font-semibold mb-1">{skillBase44.name}</h3>
            <p className="text-xs opacity-80">{skillBase44.description}</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">Prompt del Skill</h4>
              <button onClick={copySkillPrompt}
                className="px-3 py-1.5 bg-rural-green text-white text-xs rounded-lg hover:bg-rural-green-dark transition">
                {copiedSkill ? 'Copiado!' : 'Copiar Prompt Completo'}
              </button>
            </div>
            <pre className="text-xs text-gray-600 bg-gray-50 rounded-lg p-4 whitespace-pre-wrap font-mono leading-relaxed max-h-80 overflow-auto">
              {skillBase44.prompt}
            </pre>
          </div>

          <div className="card">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Como usar el Skill</h4>
            <ol className="space-y-2">
              {skillBase44.howToUse.map((step, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-3">
                  <span className="w-6 h-6 bg-rural-green/10 text-rural-green rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="card bg-amber-50 border border-amber-200">
            <h4 className="text-sm font-semibold text-amber-800 mb-2">Crear como Skill de Claude Code</h4>
            <p className="text-xs text-amber-700 mb-2">
              Tambien puedes crear este skill directamente en Claude Code para usarlo con el comando /base44-landing
              y que te asista en cada mejora sin salir del dashboard.
            </p>
            <code className="text-xs bg-white/50 rounded px-2 py-1 text-amber-800 font-mono">
              Usa /skill-creator para crear el skill "base44-landing"
            </code>
          </div>
        </div>
      )}
    </div>
  )
}
