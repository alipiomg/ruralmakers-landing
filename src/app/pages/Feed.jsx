import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { globalStats, facenderas, users, currentUser, categories, testimonios, notifications } from '../data/mockData'

// ── Animated counter hook ────────────────────────────────────
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            setCount(Math.floor(progress * target))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

// ── Stat card ────────────────────────────────────────────────
function StatCard({ value, label, suffix = '' }) {
  const { count, ref } = useCounter(value)
  return (
    <div ref={ref} className="text-center p-6">
      <p className="text-4xl font-extrabold text-white">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-white/80 mt-1">{label}</p>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────
export default function Feed() {
  const [email, setEmail] = useState('')
  const proximasFacenderas = facenderas.filter(f => f.status === 'proxima').slice(0, 3)

  // ── Modern facendera examples ──────────────────────────────
  const modernFacenderas = [
    { title: 'Facendera de IA', desc: 'Aplicar inteligencia artificial a retos rurales concretos', tags: ['Tecnologia', 'Innovacion'] },
    { title: 'Arreglar Caminos y Mapear', desc: 'Mantenimiento de caminos rurales y mapeo digital participativo', tags: ['Territorio', 'Mapeo'] },
    { title: 'Mapear Empresas y Asociaciones', desc: 'Crear un directorio vivo del tejido productivo local', tags: ['Economia', 'Directorio'] },
    { title: 'Desbroce Preventivo', desc: 'Limpieza de parcelas y franjas forestales contra incendios', tags: ['Prevencion', 'Medioambiente'] },
    { title: 'Limpieza de Fuentes', desc: 'Recuperacion y mantenimiento de fuentes y manantiales naturales', tags: ['Agua', 'Patrimonio'] },
    { title: 'Huerto Comunitario', desc: 'Creacion y mantenimiento colectivo de huertos compartidos', tags: ['Agricultura', 'Comunidad'] },
  ]

  // ── Process steps ──────────────────────────────────────────
  const processSteps = [
    { num: 1, title: 'Propuesta', desc: 'Alguien identifica una necesidad y propone una facendera a la comunidad' },
    { num: 2, title: 'Convocatoria', desc: 'Se difunde la llamada, se fija fecha y se organizan los recursos necesarios' },
    { num: 3, title: 'Trabajo Colectivo', desc: 'La comunidad se reune y trabaja codo con codo en la tarea acordada' },
    { num: 4, title: 'Celebracion', desc: 'Se comparten resultados, se documenta y se celebra el logro comunitario' },
  ]

  // ── Red Colaborativa features ──────────────────────────────
  const redFeatures = [
    { title: 'Proyectos Colaborativos', desc: 'Impulsa iniciativas comunitarias con el apoyo de toda la red', icon: '🚀', link: '/app/proyectos' },
    { title: 'Filandones', desc: 'Encuentros culturales para compartir historias, musica y tradicion oral', icon: '🎭', link: null },
    { title: 'Agenda Colaborativa', desc: 'Calendario compartido con todas las actividades de la red', icon: '📅', link: '/app/agenda' },
    { title: 'Financiacion Participativa', desc: 'Crowdfunding comunitario para hacer realidad los proyectos', icon: '💰', link: null },
    { title: 'Perfiles Comunitarios', desc: 'Conoce a las personas que forman parte de la red colaborativa', icon: '👥', link: '/app/comunidad' },
    { title: 'Transparencia', desc: 'Rendicion de cuentas abierta sobre recursos, gastos y resultados', icon: '📊', link: null },
  ]

  // ── Advantages for final CTA ───────────────────────────────
  const advantages = [
    'Acceso a una red de personas comprometidas con el territorio',
    'Herramientas digitales para organizar facenderas y proyectos',
    'Formacion continua en saberes tradicionales y nuevas tecnologias',
    'Visibilidad para tus iniciativas y proyectos rurales',
    'Financiacion participativa para hacer realidad tus ideas',
    'Conexion con otras comunidades rurales de toda la provincia',
  ]

  return (
    <div className="min-h-screen">

      {/* ═══════════ 1. HERO ═══════════ */}
      <section className="bg-gradient-to-br from-rural-green via-rural-green-dark to-rural-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-rural-earth rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Red Colaborativa de Innovacion Rural
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            Conectamos personas, proyectos y saberes mediante facenderas, filandones y encuentros cooperativos.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/app/proyectos"
              className="inline-flex items-center px-6 py-3 bg-white text-rural-green font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition"
            >
              Explorar Proyectos
            </Link>
            <Link
              to="/app/facenderas"
              className="inline-flex items-center px-6 py-3 bg-rural-earth text-white font-semibold rounded-lg shadow-lg hover:bg-rural-earth/90 transition"
            >
              Descubrir Facenderas
            </Link>
            <Link
              to="/app/comunidad"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
            >
              Unirse a la Comunidad
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ 2. STATS ROW ═══════════ */}
      <section className="bg-gradient-to-r from-rural-green-dark to-rural-green">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          <StatCard value={globalStats.facenderasRealizadas} label="Facenderas Realizadas" />
          <StatCard value={globalStats.participantesActivos} label="Participantes Activos" />
          <StatCard value={globalStats.proyectosCompletados} label="Proyectos Completados" />
          <StatCard value={globalStats.comunidadesConectadas} label="Comunidades Conectadas" />
        </div>
      </section>

      {/* ═══════════ 3. CUIDADO ACTIVO DEL TERRITORIO ═══════════ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Cuidado Activo del Territorio
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Prevencion, accion y respuesta solidaria ante emergencias. La comunidad como primera linea de defensa del territorio.
            </p>
          </div>

          {/* 3 main cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Acciones de Emergencia */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-6 shadow-lg">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3">Acciones de Emergencia</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
                  Protocolos de emergencia coordinados
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
                  Red de comunicacion vecinal
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
                  Brigadas voluntarias de actuacion
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
                  Banco de herramientas compartido
                </li>
              </ul>
            </div>

            {/* Acciones Preventivas */}
            <div className="bg-gradient-to-br from-rural-green to-rural-green-dark text-white rounded-xl p-6 shadow-lg">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3">Acciones Preventivas</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full shrink-0" />
                  Desbroces comunitarios organizados
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full shrink-0" />
                  Limpieza de senderos y caminos
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full shrink-0" />
                  Mapeo de puntos de agua
                </li>
              </ul>
            </div>

            {/* Respuesta Solidaria */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-6 shadow-lg">
              <div className="w-10 h-10 bg-rural-earth/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-rural-earth" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3">Respuesta Solidaria</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rural-earth rounded-full shrink-0" />
                  Coordinacion rapida entre pueblos
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rural-earth rounded-full shrink-0" />
                  Apoyo mutuo y acogida
                </li>
              </ul>
            </div>
          </div>

          {/* 3 smaller cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="card flex items-center gap-4 p-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Prevencion de Incendios</h4>
                <p className="text-xs text-gray-500">Desbroces, vigilancia y cortafuegos comunitarios</p>
              </div>
            </div>
            <div className="card flex items-center gap-4 p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Red de Comunicacion</h4>
                <p className="text-xs text-gray-500">Canales de alerta y coordinacion vecinal</p>
              </div>
            </div>
            <div className="card flex items-center gap-4 p-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Banco de Herramientas</h4>
                <p className="text-xs text-gray-500">Recursos compartidos para emergencias y trabajos</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/app/facenderas"
              className="inline-flex items-center px-6 py-3 bg-rural-green text-white font-semibold rounded-lg shadow hover:bg-rural-green-dark transition"
            >
              Proponer Accion Comunitaria
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ 4. CONVOCATORIA ABIERTA ═══════════ */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Tienes una idea para mejorar tu comunidad?
            </h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              La convocatoria esta abierta. Comparte tu propuesta y encuentra colaboradores para hacerla realidad.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="card p-6 text-center hover:shadow-lg transition">
              <div className="w-12 h-12 bg-rural-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-rural-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Ideas Innovadoras</h3>
              <p className="text-sm text-gray-600">Propuestas creativas para resolver retos del territorio con nuevas perspectivas</p>
            </div>

            <div className="card p-6 text-center hover:shadow-lg transition">
              <div className="w-12 h-12 bg-rural-earth/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-rural-earth" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Colaboraciones</h3>
              <p className="text-sm text-gray-600">Conecta con otras personas y organizaciones para sumar fuerzas y conocimientos</p>
            </div>

            <div className="card p-6 text-center hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Retos Comunitarios</h3>
              <p className="text-sm text-gray-600">Desafios concretos que necesitan la colaboracion de la comunidad para resolverse</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/app/facenderas"
              className="inline-flex items-center gap-2 px-6 py-3 bg-rural-earth text-white font-semibold rounded-lg shadow hover:bg-rural-earth/90 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Propon tu Facendera
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ 5. NUESTRA RED COLABORATIVA ═══════════ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Nuestra Red Colaborativa
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Herramientas y espacios para fortalecer la colaboracion rural.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {redFeatures.map((f, i) => {
              const inner = (
                <div className="card p-6 hover:shadow-lg transition h-full">
                  <span className="text-3xl mb-4 block">{f.icon}</span>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600">{f.desc}</p>
                </div>
              )
              return f.link ? (
                <Link key={i} to={f.link} className="block">
                  {inner}
                </Link>
              ) : (
                <div key={i}>{inner}</div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ 6. QUE ES UNA FACENDERA ═══════════ */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Que es una Facendera?
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto leading-relaxed">
              La facendera es una tradicion leonesa de trabajo comunitario. Cuando habia una tarea que beneficiaba a todos — arreglar un camino, limpiar una fuente, construir un puente — el pueblo entero se organizaba para hacerla juntos. Hoy la reinventamos con herramientas digitales para afrontar los retos del siglo XXI.
            </p>
          </div>

          {/* Modern facendera examples */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mb-14">
            {modernFacenderas.map((mf, i) => (
              <div key={i} className="card p-5 hover:shadow-lg transition">
                <h4 className="font-bold text-gray-900 mb-2">{mf.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{mf.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {mf.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-rural-green/10 text-rural-green rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Como Funciona el Proceso */}
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              Como Funciona el Proceso
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {processSteps.map(step => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 bg-rural-green text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  {step.num}
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 7. PROXIMAS FACENDERAS ═══════════ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Proximas Facenderas
            </h2>
            <Link to="/app/facenderas" className="text-rural-green font-semibold hover:underline">
              Ver todas
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {proximasFacenderas.map(f => {
              const dateObj = new Date(f.date + 'T00:00:00')
              const day = dateObj.getDate()
              const month = dateObj.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()
              return (
                <div key={f.id} className="card p-0 overflow-hidden hover:shadow-lg transition">
                  {/* Date strip */}
                  <div className="bg-rural-green text-white px-5 py-3 flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold leading-none">{day}</p>
                      <p className="text-xs uppercase tracking-wide">{month}</p>
                    </div>
                    <div className="text-sm opacity-90">{f.time}h</div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {f.location}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {f.participants.length}/{f.maxParticipants} participantes
                      </span>
                      <Link
                        to={`/app/facenderas/${f.id}`}
                        className="text-sm font-semibold text-rural-green hover:underline"
                      >
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ 8. TESTIMONIOS ═══════════ */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
            Voces de la Comunidad
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonios.map(t => (
              <div key={t.id} className="card p-6">
                <svg className="w-8 h-8 text-rural-green/30 mb-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
                </svg>
                <p className="text-gray-700 italic mb-4 leading-relaxed">{t.quote}</p>
                <div className="border-t pt-3">
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 9. CTA FINAL ═══════════ */}
      <section className="bg-gradient-to-br from-rural-green via-rural-green-dark to-rural-green text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Listo para Transformar tu Comunidad?
          </h2>
          <ul className="text-left max-w-lg mx-auto space-y-3 mb-8">
            {advantages.map((adv, i) => (
              <li key={i} className="flex items-start gap-3 text-white/90">
                <svg className="w-5 h-5 text-rural-earth shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">{adv}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/app/proyectos"
              className="inline-flex items-center px-6 py-3 bg-white text-rural-green font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition"
            >
              Explorar Proyectos
            </Link>
            <Link
              to="/app/comunidad"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
            >
              Unirse a la Comunidad
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ 10. NEWSLETTER ═══════════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            Mantente Conectado
          </h2>
          <p className="text-gray-600 mb-6">
            Recibe noticias sobre facenderas, proyectos y encuentros de la red colaborativa directamente en tu correo.
          </p>
          <form
            onSubmit={e => {
              e.preventDefault()
              if (email) {
                setEmail('')
                alert('Gracias por suscribirte!')
              }
            }}
            className="flex gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rural-green focus:border-transparent outline-none text-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-rural-green text-white font-semibold rounded-lg hover:bg-rural-green-dark transition shrink-0"
            >
              Suscribirme
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
