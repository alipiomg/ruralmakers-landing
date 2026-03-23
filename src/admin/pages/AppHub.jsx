import { useState } from 'react'
import { RURALMAKERS_NET } from '../../shared/lib/constants'

const tabs = ['Prototipo Readdy', 'Arquitectura', 'Demo para Video', 'Modulos & Roadmap', 'IA Rural', 'Agentes Dev']

const READDY_URL = 'https://readdy.cc/preview/06a8d4c3-d3e9-4497-93df-3882bbde8bc0/4542990'
const READDY_PROJECTS = 'https://readdy.cc/preview/06a8d4c3-d3e9-4497-93df-3882bbde8bc0/4542990/proyectos'

// ─── READDY APP ANALYSIS ───────────────────────────────────────
const reddyAnalysis = {
  identified: [
    { section: 'Home / Feed', description: 'Vista principal con actividad reciente de la red, facenderas proximas y proyectos destacados', status: 'visible' },
    { section: 'Proyectos', description: 'Listado y fichas de proyectos rurales con detalles, participantes y estado', status: 'visible' },
    { section: 'Facenderas', description: 'Calendario/listado de facenderas con inscripcion y detalles', status: 'parcial' },
    { section: 'Mapa', description: 'Mapa interactivo con localizacion de grupos, facenderas y recursos', status: 'parcial' },
    { section: 'Perfil / Comunidad', description: 'Perfiles de usuarios con saberes, participacion y badges', status: 'parcial' },
    { section: 'Recursos', description: 'Directorio de herramientas, espacios y saberes compartidos', status: 'idea' },
  ],
  strengths: [
    'Estructura basica de navegacion definida',
    'Concepto de proyecto como entidad central',
    'Integracion visual con la identidad Rural Makers',
    'Enfoque mobile-first adecuado para contexto rural',
  ],
  improvements: [
    'Falta sistema de autenticacion y perfiles reales',
    'Los proyectos necesitan mas interactividad (comentarios, seguimiento, colaborar)',
    'No hay chat ni mensajeria entre usuarios',
    'El mapa deberia ser el corazon de la app (geolocalizar todo)',
    'Falta gamificacion real (puntos, badges, niveles por participacion)',
    'No hay integracion con calendario del dispositivo',
    'Falta seccion de notificaciones y actividad en tiempo real',
    'PWA: necesita service worker para offline y push notifications',
  ],
}

// ─── ARCHITECTURE OPTIONS ──────────────────────────────────────
const archOptions = [
  {
    name: 'Opcion A: App Web desde este Dashboard',
    description: 'Crear la app como extension de este proyecto React + Vite. Anadir carpeta /app con sus propias rutas.',
    pros: ['Reutiliza todo el stack actual (React 19, Vite 8, Tailwind 4)', 'Compartir componentes con el dashboard', 'Un solo repo, un solo deploy', 'Rapido para hacer la demo del video'],
    cons: ['El dashboard y la app se mezclan conceptualmente', 'Escalabilidad limitada a largo plazo', 'No es ideal para produccion con muchos usuarios'],
    ideal: 'Demo para el video del crowdfunding y primera version funcional',
    effort: 'Bajo (1-2 semanas para demo)',
  },
  {
    name: 'Opcion B: App Web separada (Next.js / Vite)',
    description: 'Crear proyecto nuevo en carpeta separada. App independiente con su propio backend.',
    pros: ['Separacion limpia de concerns', 'Puedes elegir el stack optimo (Next.js para SSR, Supabase para backend)', 'Escalable en produccion', 'Deploy independiente'],
    cons: ['Mas tiempo de setup inicial', 'Duplicar configuracion de estilos/componentes', 'Dos proyectos que mantener'],
    ideal: 'Version de produccion post-crowdfunding',
    effort: 'Medio (3-4 semanas para MVP)',
  },
  {
    name: 'Opcion C: Landing + App Web integrada',
    description: 'La landing de Base44 como puerta de entrada, que conecta con la app web (subdirectorio o subdominio).',
    pros: ['Landing optimizada para conversion (Base44)', 'App con funcionalidad completa detras', 'SEO de la landing + funcionalidad de la app', 'URL unica: ruralmakers.app'],
    cons: ['Dos tecnologias distintas (Base44 + React)', 'Transicion entre landing y app puede no ser fluida', 'Mas complejo de mantener'],
    ideal: 'Produccion final con landing de alto impacto',
    effort: 'Alto (6-8 semanas completo)',
  },
  {
    name: 'Opcion D: PWA (mi recomendacion para demo)',
    description: 'Crear una PWA dentro de este repo que se pueda instalar en movil. Ideal para la demo del video.',
    pros: ['Se instala como app nativa', 'Funciona offline con service worker', 'Push notifications', 'Una sola base de codigo web', 'Grabar la demo desde el movil para el video'],
    cons: ['No esta en app stores (aunque se puede con TWA)', 'Funcionalidades nativas limitadas vs nativo'],
    ideal: 'Demo interactiva para el video + primera version publica',
    effort: 'Bajo-Medio (2-3 semanas para demo completa)',
  },
]

// ─── DEMO STRATEGY ─────────────────────────────────────────────
const demoScreens = [
  {
    screen: 'Splash / Onboarding',
    duration: '5s',
    description: 'Logo Rural Makers con animacion, luego 3 slides de onboarding explicando la app',
    elements: ['Logo animado', 'Slide 1: "Conecta con tu comarca"', 'Slide 2: "Participa en facenderas"', 'Slide 3: "Comparte y aprende"'],
    demoAction: 'Swipe entre slides, tap en "Empezar"',
  },
  {
    screen: 'Feed Principal',
    duration: '8s',
    description: 'Vista principal con facenderas proximas, actividad reciente y mapa mini',
    elements: ['Header con busqueda', 'Cards de proximas facenderas', 'Mini mapa con puntos', 'Feed de actividad', 'Bottom nav bar'],
    demoAction: 'Scroll por el feed, ver facenderas proximas, tap en una',
  },
  {
    screen: 'Detalle de Facendera',
    duration: '10s',
    description: 'Ficha completa de una facendera con mapa, participantes, descripcion y boton de unirse',
    elements: ['Imagen header', 'Titulo y fecha', 'Mapa con ubicacion', 'Lista de participantes con avatares', 'Descripcion', 'Boton "Unirme"', 'Chat grupal preview'],
    demoAction: 'Ver detalles, scroll, tap en "Unirme", ver confirmacion',
  },
  {
    screen: 'Mapa Interactivo',
    duration: '8s',
    description: 'Mapa de la comarca con pins de facenderas, grupos y recursos',
    elements: ['Mapa fullscreen con pins de colores', 'Filtros: facenderas, grupos, recursos', 'Pop-ups al tap en pin', 'Boton de "Mi ubicacion"'],
    demoAction: 'Hacer zoom, filtrar por tipo, tap en pins',
  },
  {
    screen: 'Crear Facendera',
    duration: '8s',
    description: 'Formulario para crear nueva facendera con datos basicos',
    elements: ['Titulo', 'Categoria (selector)', 'Fecha y hora', 'Ubicacion en mapa', 'Descripcion', 'Foto', 'Boton "Publicar"'],
    demoAction: 'Rellenar campos rapido, seleccionar ubicacion en mapa, publicar',
  },
  {
    screen: 'Perfil & Logros',
    duration: '6s',
    description: 'Perfil del usuario con sus badges, facenderas realizadas y saberes',
    elements: ['Avatar y nombre', 'Nivel: "Rural Maker Nivel 3"', 'Badges ganados', 'Facenderas completadas', 'Saberes ofrecidos', 'Estadisticas de impacto'],
    demoAction: 'Ver badges, scroll por historial',
  },
  {
    screen: 'Chat IA Rural',
    duration: '8s',
    description: 'Conversacion con el asistente IA mostrando ayuda contextualizada',
    elements: ['Chat interface', 'Pregunta: "Que facenderas hay este finde?"', 'Respuesta con sugerencias', 'Boton de crear facendera desde el chat'],
    demoAction: 'Escribir pregunta, ver respuesta con sugerencias, tap en sugerencia',
  },
]

// ─── APP MODULES ───────────────────────────────────────────────
const appModules = [
  {
    module: 'Facenderas',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    status: 'prototipo',
    priority: 'critica',
    description: 'CRUD de facenderas con mapa, calendario e inscripcion',
    forDemo: true,
    tasks: ['Modelo de datos: titulo, fecha, ubicacion, categoria, creador, participantes', 'Vista de lista con filtros', 'Vista de mapa con pins', 'Ficha detalle con inscripcion', 'Formulario de creacion', 'Chat grupal por facendera'],
  },
  {
    module: 'Mapa Interactivo',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    status: 'prototipo',
    priority: 'critica',
    description: 'Mapa central con todas las entidades geolocalizadas',
    forDemo: true,
    tasks: ['Integracion Leaflet/Mapbox', 'Pins por tipo (facenderas, grupos, recursos)', 'Filtros por categoria', 'Pop-ups informativos', 'Cluster para densidad', 'Geolocalizacion del usuario'],
  },
  {
    module: 'Perfiles & Comunidad',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    status: 'idea',
    priority: 'alta',
    description: 'Perfiles con saberes, badges y conexiones',
    forDemo: true,
    tasks: ['Auth (OAuth social + email)', 'Perfil con bio, saberes, ubicacion', 'Sistema de badges por participacion', 'Directorio de personas', 'Seguir a otros usuarios'],
  },
  {
    module: 'Proyectos Rurales',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    status: 'prototipo',
    priority: 'alta',
    description: 'Hub de proyectos con colaboradores y seguimiento',
    forDemo: false,
    tasks: ['CRUD de proyectos', 'Estados: idea, en marcha, completado', 'Solicitar colaboradores', 'Timeline de avance', 'Conexion con facenderas del proyecto'],
  },
  {
    module: 'Recursos Compartidos',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    status: 'idea',
    priority: 'media',
    description: 'Inventario compartido de herramientas, espacios y saberes',
    forDemo: false,
    tasks: ['Catalogo con categorias', 'Sistema de prestamo/intercambio', 'Reputacion por intercambios', 'Busqueda por proximidad'],
  },
  {
    module: 'Asistente IA Rural',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    status: 'desarrollo',
    priority: 'alta',
    description: 'Chat IA con contexto local entrenable',
    forDemo: true,
    tasks: ['UI de chat', 'Integracion con Claude API', 'Contexto local inyectable', 'Sugerencias de facenderas', 'Generacion de contenido', 'Asesoria de tramites'],
  },
  {
    module: 'Gamificacion & Rutas',
    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    status: 'idea',
    priority: 'media',
    description: 'Puntos, badges, rutas rurales interconectadas',
    forDemo: true,
    tasks: ['Sistema de puntos por participacion', 'Badges desbloqueables', 'Rutas entre pueblos con checkpoints', 'Leaderboard comarcal', 'Retos semanales'],
  },
]

// ─── IA FEATURES ───────────────────────────────────────────────
const iaFeatures = [
  {
    title: 'Contexto Local Entrenable',
    description: 'La IA se entrena con datos especificos de cada comarca. Cada grupo local personaliza su asistente.',
    useCases: ['Que subvenciones hay para mi pueblo?', 'Quien sabe de apicultura en la comarca?', 'Como organizar una facendera de limpieza de rio?'],
    techNotes: 'Claude API con system prompt inyectando contexto local. RAG con embeddings de docs comarcales.',
  },
  {
    title: 'Generador de Contenido',
    description: 'Crea publicaciones para redes, carteles, actas y documentacion automaticamente.',
    useCases: ['Genera un cartel para la facendera del sabado', 'Escribe el resumen de la reunion', 'Crea un hilo para redes sobre nuestro huerto'],
    techNotes: 'Claude API con tool_use para formatear outputs. Plantillas predefinidas por tipo de contenido.',
  },
  {
    title: 'Asesoria de Tramites',
    description: 'Base de conocimiento sobre ayudas, subvenciones, normativas locales.',
    useCases: ['Como solicito la PAC?', 'Permisos para obrador artesanal?', 'Ayudas para rehabilitar casa rural?'],
    techNotes: 'RAG con documentos de BOE/BOCYL, PAC, convocatorias. Actualizacion periodica.',
  },
  {
    title: 'Facilitador de Facenderas',
    description: 'Sugiere, coordina y hace seguimiento de impacto de las facenderas.',
    useCases: ['Que facenderas necesita mi pueblo?', 'Cuantas personas se apuntaron?', 'Informe de impacto de la ultima facendera'],
    techNotes: 'Acceso a la DB de facenderas via tool_use. Analisis de necesidades por historial.',
  },
]

// ─── DEV AGENTS ────────────────────────────────────────────────
const devAgents = [
  {
    name: 'Agente de Diseno UI/UX',
    description: 'Genera componentes React, pantallas completas y flujos de usuario para la app',
    skills: ['Crear componentes React con Tailwind', 'Generar mockups interactivos', 'Disenar flujos de usuario', 'Adaptar a mobile-first'],
    prompt: 'Eres un disenador UI/UX experto en apps moviles. Diseña componentes para RuralMakers.app con React + Tailwind. Sigue la paleta rural: verde #4a7c59, dorado #D4A843, crema #fdf8f0. Mobile-first, accesible, con animaciones sutiles.',
  },
  {
    name: 'Agente de Backend & API',
    description: 'Diseña modelos de datos, endpoints y logica de negocio',
    skills: ['Modelar base de datos', 'Crear endpoints REST/GraphQL', 'Autenticacion y permisos', 'Integracion con Goteo API'],
    prompt: 'Eres un arquitecto backend. Diseña la API de RuralMakers.app. Modelos principales: User, Facendera, Project, Resource, Group, Badge. Usa Supabase (PostgreSQL + Auth + Realtime). Diseña endpoints RESTful con validacion.',
  },
  {
    name: 'Agente de Mapa & Geo',
    description: 'Implementa todo lo relacionado con mapas, geolocalizacion y rutas',
    skills: ['Integrar Leaflet/Mapbox', 'Geocoding y reverse geocoding', 'Clustering de markers', 'Rutas entre puntos', 'Offline maps'],
    prompt: 'Eres experto en GIS web. Implementa el sistema de mapas de RuralMakers.app con Leaflet + OpenStreetMap. Pins por tipo (facenderas=verde, grupos=azul, recursos=dorado). Clusters, filtros, pop-ups informativos. Geolocalizacion del usuario. Offline con tiles cacheados.',
  },
  {
    name: 'Agente IA Rural',
    description: 'Construye el asistente IA con contexto local entrenable',
    skills: ['Integrar Claude API', 'RAG con docs locales', 'Tool use para acciones', 'System prompts contextuales'],
    prompt: 'Eres un ingeniero de IA. Construye el asistente rural de RuralMakers.app usando Claude API. El agente debe: responder preguntas sobre el territorio, sugerir facenderas, generar contenido, asesorar en tramites. Usa tool_use para consultar la DB de facenderas y recursos. RAG para documentacion local.',
  },
  {
    name: 'Agente de Demo & Video',
    description: 'Crea versiones demo interactivas optimizadas para grabar el video del crowdfunding',
    skills: ['Crear pantallas demo con datos mock', 'Optimizar para grabacion de pantalla', 'Transiciones fluidas', 'Estados pre-cargados'],
    prompt: 'Eres un especialista en demos de producto. Crea una version demo de RuralMakers.app optimizada para grabar el video del crowdfunding de Goteo. Usa datos mock realistas (nombres de pueblos de Leon, facenderas reales). Todas las pantallas deben estar pre-cargadas sin esperas. Animaciones suaves. 7 pantallas clave: splash, feed, detalle facendera, mapa, crear facendera, perfil, chat IA.',
  },
]

const statusColors = {
  'prototipo': 'bg-amber-100 text-amber-700',
  'desarrollo': 'bg-blue-100 text-blue-700',
  'idea': 'bg-gray-100 text-gray-600',
  'listo': 'bg-green-100 text-green-700',
}

const priorityColors = {
  'critica': 'text-red-700 font-bold',
  'alta': 'text-red-600',
  'media': 'text-amber-600',
  'baja': 'text-gray-500',
}

function CopyButton({ text, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 transition shrink-0"
    >
      {copied ? 'Copiado!' : label}
    </button>
  )
}

export default function AppHub() {
  const [tab, setTab] = useState(0)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-800">App Development Hub</h2>
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">RuralMakers.app</span>
        <div className="flex gap-2 ml-auto">
          <a href={READDY_URL} target="_blank" rel="noopener noreferrer"
            className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition">
            Readdy
          </a>
          <a href={RURALMAKERS_NET} target="_blank" rel="noopener noreferrer"
            className="px-3 py-1.5 bg-rural-green text-white text-sm rounded-lg hover:bg-rural-green-dark transition">
            ruralmakers.net
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

      {/* Tab 0: Readdy Prototype */}
      {tab === 0 && (
        <div className="space-y-4">
          <div className="card bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
            <h3 className="font-bold mb-1">Prototipo actual en Readdy</h3>
            <p className="text-sm opacity-90">
              Analisis del prototipo creado en Readdy. Lo que hay sirve como base conceptual.
              El objetivo es replicar esto con mucha mas potencia y construir la demo para el video del crowdfunding.
            </p>
          </div>

          {/* Embed */}
          <div className="card p-0 overflow-hidden">
            <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Readdy Preview</span>
              <div className="flex gap-2">
                <a href={READDY_PROJECTS} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-indigo-600 hover:underline">Proyectos</a>
                <a href={READDY_URL} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-indigo-600 hover:underline">Abrir</a>
              </div>
            </div>
            <iframe src={READDY_URL} className="w-full border-0" style={{ height: '500px' }} title="Readdy App" />
          </div>

          {/* Analysis */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Secciones identificadas</h4>
              <div className="space-y-2">
                {reddyAnalysis.identified.map((s, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${s.status === 'visible' ? 'bg-green-100 text-green-700' : s.status === 'parcial' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                      {s.status}
                    </span>
                    <div>
                      <span className="text-sm font-medium text-gray-800">{s.section}</span>
                      <p className="text-xs text-gray-500">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="card">
                <h4 className="text-sm font-semibold text-green-700 mb-2">Lo que funciona</h4>
                <ul className="space-y-1">
                  {reddyAnalysis.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                      <span className="text-green-500">+</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card">
                <h4 className="text-sm font-semibold text-red-700 mb-2">Que falta / mejorar</h4>
                <ul className="space-y-1">
                  {reddyAnalysis.improvements.map((s, i) => (
                    <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                      <span className="text-red-400">!</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Architecture */}
      {tab === 1 && (
        <div className="space-y-4">
          <div className="card bg-amber-50 border border-amber-200">
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Decision clave: donde construir la app?</h3>
            <p className="text-xs text-amber-700">
              Recomendacion: <strong>Opcion D (PWA)</strong> para la demo del video + primera version publica.
              Despues del crowdfunding, migrar a Opcion B con stack de produccion.
            </p>
          </div>

          {archOptions.map((opt, i) => (
            <div key={i} className={`card border ${i === 3 ? 'border-rural-green bg-green-50/30' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{opt.name}</h4>
                {i === 3 && <span className="text-xs px-2 py-0.5 bg-rural-green text-white rounded-full">Recomendada</span>}
              </div>
              <p className="text-sm text-gray-600 mb-3">{opt.description}</p>
              <div className="grid md:grid-cols-2 gap-3 mb-2">
                <div>
                  <h5 className="text-xs font-semibold text-green-700 uppercase mb-1">Ventajas</h5>
                  <ul className="space-y-0.5">
                    {opt.pros.map((p, j) => (
                      <li key={j} className="text-xs text-gray-600">+ {p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-red-700 uppercase mb-1">Inconvenientes</h5>
                  <ul className="space-y-0.5">
                    {opt.cons.map((c, j) => (
                      <li key={j} className="text-xs text-gray-600">- {c}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex justify-between text-xs mt-2 pt-2 border-t border-gray-100">
                <span className="text-gray-500">Ideal para: <span className="text-gray-700 font-medium">{opt.ideal}</span></span>
                <span className="text-gray-500">Esfuerzo: <span className="font-medium">{opt.effort}</span></span>
              </div>
            </div>
          ))}

          <div className="card bg-blue-50 border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Stack recomendado para la demo</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="bg-white rounded p-2 text-center"><span className="font-bold text-blue-700">React 19</span><br/>UI Components</div>
              <div className="bg-white rounded p-2 text-center"><span className="font-bold text-blue-700">Tailwind 4</span><br/>Styling</div>
              <div className="bg-white rounded p-2 text-center"><span className="font-bold text-blue-700">Leaflet</span><br/>Mapas</div>
              <div className="bg-white rounded p-2 text-center"><span className="font-bold text-blue-700">Claude API</span><br/>IA Rural</div>
              <div className="bg-white rounded p-2 text-center"><span className="font-bold text-blue-700">Supabase</span><br/>DB + Auth</div>
              <div className="bg-white rounded p-2 text-center"><span className="font-bold text-blue-700">Vite PWA</span><br/>Instalable</div>
              <div className="bg-white rounded p-2 text-center"><span className="font-bold text-blue-700">Goteo API</span><br/>Crowdfunding</div>
              <div className="bg-white rounded p-2 text-center"><span className="font-bold text-blue-700">Framer Motion</span><br/>Animaciones</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Demo for Video */}
      {tab === 2 && (
        <div className="space-y-4">
          <div className="card bg-gradient-to-r from-red-600 to-pink-700 text-white">
            <h3 className="font-bold mb-1">Demo Interactiva para el Video del Crowdfunding</h3>
            <p className="text-sm opacity-90">
              7 pantallas clave que demuestran el potencial de la app. Datos mock realistas de pueblos de Leon.
              Optimizado para grabar en movil y usar en el video de presentacion de Goteo.
            </p>
          </div>

          <div className="card bg-amber-50 border border-amber-200">
            <h4 className="text-sm font-semibold text-amber-800 mb-1">Duracion total de la demo: ~53 segundos</h4>
            <p className="text-xs text-amber-700">
              Tiempo ideal para incluir en el video de 4 min max de Goteo.
              Se graba en movil real (PWA) o emulador para aspecto nativo.
            </p>
          </div>

          <div className="space-y-3">
            {demoScreens.map((screen, i) => (
              <div key={i} className="card border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 bg-red-100 text-red-700 rounded-lg flex items-center justify-center text-sm font-bold">{i + 1}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{screen.screen}</h4>
                    <span className="text-xs text-gray-400">{screen.duration}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{screen.description}</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <h5 className="text-xs font-semibold text-gray-500 uppercase mb-1">Elementos UI</h5>
                    <ul className="space-y-0.5">
                      {screen.elements.map((el, j) => (
                        <li key={j} className="text-xs text-gray-600">- {el}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-gray-500 uppercase mb-1">Accion en la demo</h5>
                    <p className="text-xs text-gray-600 bg-gray-50 rounded p-2">{screen.demoAction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Modules & Roadmap */}
      {tab === 3 && (
        <div className="space-y-3">
          <div className="card bg-gray-50 border border-gray-200 flex items-center gap-3">
            <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">Demo</span>
            <span className="text-xs text-gray-600">= incluido en la demo del video</span>
            <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-600 font-bold ml-2">critica</span>
            <span className="text-xs text-gray-600">= necesaria para el MVP</span>
          </div>

          {appModules.map((mod, i) => (
            <div key={i} className={`card border ${mod.forDemo ? 'border-red-200 bg-red-50/20' : 'border-gray-100'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 ${mod.forDemo ? 'bg-red-100' : 'bg-rural-green/10'} rounded-lg flex items-center justify-center shrink-0`}>
                  <svg className={`w-5 h-5 ${mod.forDemo ? 'text-red-600' : 'text-rural-green'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={mod.icon} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-semibold text-gray-800">{mod.module}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[mod.status]}`}>{mod.status}</span>
                    <span className={`text-xs ${priorityColors[mod.priority]}`}>P: {mod.priority}</span>
                    {mod.forDemo && <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">Demo</span>}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{mod.description}</p>
                  <ul className="space-y-1">
                    {mod.tasks.map((t, j) => (
                      <li key={j} className="text-xs text-gray-500 flex gap-1.5">
                        <span className="text-gray-300">-</span>{t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: IA Rural */}
      {tab === 4 && (
        <div className="space-y-4">
          <div className="card bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
            <h3 className="font-semibold mb-1">Asistente IA Rural Maker</h3>
            <p className="text-sm opacity-90">
              IA entrenable con contexto local. Integrable con Claude API + tool_use + RAG.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {iaFeatures.map((feat, i) => (
              <div key={i} className="card border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-2">{feat.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{feat.description}</p>
                <div className="mb-2">
                  <h5 className="text-xs font-semibold text-purple-600 uppercase mb-1">Casos de uso</h5>
                  <ul className="space-y-1">
                    {feat.useCases.map((uc, j) => (
                      <li key={j} className="text-xs text-gray-500 bg-purple-50 rounded px-2 py-1">"{uc}"</li>
                    ))}
                  </ul>
                </div>
                <div className="text-xs bg-gray-50 rounded p-2 text-gray-500">
                  <span className="font-semibold">Tech:</span> {feat.techNotes}
                </div>
              </div>
            ))}
          </div>

          <div className="card bg-amber-50 border border-amber-200">
            <h4 className="text-sm font-semibold text-amber-800 mb-2">Ideas para potenciar el agente</h4>
            <ul className="space-y-2 text-sm text-amber-700">
              <li className="flex gap-2"><span>1.</span> Entrenar con docs locales: ordenanzas, recursos comarcales, directorio</li>
              <li className="flex gap-2"><span>2.</span> Conectar APIs publicas: AEMET, catastro, BOE/BOCYL</li>
              <li className="flex gap-2"><span>3.</span> Cada facendera genera datos que mejoran la IA</li>
              <li className="flex gap-2"><span>4.</span> Modo offline: cache local para zonas sin cobertura</li>
              <li className="flex gap-2"><span>5.</span> Multi-idioma: castellano, leones, gallego</li>
              <li className="flex gap-2"><span>6.</span> Tool use: crear facenderas, buscar recursos, generar informes desde el chat</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 5: Dev Agents */}
      {tab === 5 && (
        <div className="space-y-4">
          <div className="card bg-gradient-to-r from-gray-800 to-gray-900 text-white">
            <h3 className="font-bold mb-1">Agentes de Desarrollo</h3>
            <p className="text-sm opacity-80">
              Prompts especializados para usar con Claude Code o Base44.
              Cada agente se enfoca en un area del desarrollo de la app.
              Copia el prompt y usalo como contexto en tu sesion de desarrollo.
            </p>
          </div>

          {devAgents.map((agent, i) => (
            <div key={i} className="card border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{agent.name}</h4>
                  <p className="text-sm text-gray-600">{agent.description}</p>
                </div>
                <CopyButton text={agent.prompt} label="Copiar Prompt" />
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {agent.skills.map((s, j) => (
                  <span key={j} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{s}</span>
                ))}
              </div>
              <pre className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap font-mono max-h-32 overflow-auto">
                {agent.prompt}
              </pre>
            </div>
          ))}

          <div className="card bg-green-50 border border-green-200">
            <h4 className="text-sm font-semibold text-green-800 mb-2">Como usar los agentes</h4>
            <ol className="space-y-1 text-sm text-green-700">
              <li>1. Copia el prompt del agente que necesites</li>
              <li>2. Abre una nueva sesion de Claude Code</li>
              <li>3. Pega el prompt como instruccion inicial</li>
              <li>4. Pide la tarea especifica (ej: "Crea la pantalla de detalle de facendera")</li>
              <li>5. El agente generara codigo listo para usar en la app</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
