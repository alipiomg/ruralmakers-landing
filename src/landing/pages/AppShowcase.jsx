import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { GOTEO_PROJECT_URL } from '../../shared/lib/constants'

// ─── HOOKS ──────────────────────────────────────────────────────
function useCounter(target, duration = 2000, enabled = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!enabled) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setVal(target); clearInterval(timer) }
      else setVal(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, enabled])
  return val
}

// ─── MOTION WRAPPER (respects prefers-reduced-motion) ───────────
function Reveal({ children, className = '', delay = 0, y = 24 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      style={{ willChange: 'opacity, transform' }}>
      {children}
    </motion.div>
  )
}

// ─── SVG ICONS (no emojis per ui-ux-pro-max) ────────────────────
const icons = {
  handshake: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />,
  map: <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />,
  link: <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />,
  cpu: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5M4.5 15.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 004.5 8.25v9a2.25 2.25 0 002.25 2.25z" />,
  route: <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />,
  users: <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />,
}

function Icon({ name, size = 'w-6 h-6', color = 'currentColor', strokeWidth = 1.5 }) {
  return (
    <svg className={size} fill="none" stroke={color} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {icons[name]}
    </svg>
  )
}

// ─── NAV (floating, per ui-ux-pro-max guidelines) ───────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#2C2A25]/90 backdrop-blur-xl shadow-2xl shadow-black/20 border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-[1200px] mx-auto px-6 h-[60px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 cursor-pointer group">
          <img src="/logo-ruralmakers.png" alt="Rural Makers" className="h-8 w-auto rounded-lg transition-transform duration-200 group-hover:scale-105" />
          <div className="hidden sm:block">
            <span className="font-bold text-[#F0EBE0] text-[13px] block leading-tight">Rural Makers</span>
            <span className="text-[9px] text-[#6B9E50] tracking-[0.2em] uppercase font-bold">La App</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-[12px] text-[#C8BEB0] hover:text-[#F0EBE0] transition-colors duration-200 cursor-pointer hidden sm:inline-block">Crowdfunding</Link>
          <Link to="/app" className="text-[13px] px-5 py-2 bg-[#6B9E50] text-white rounded-full font-bold hover:bg-[#4E7A38] transition-all duration-200 shadow-lg shadow-[#6B9E50]/20 cursor-pointer hover:shadow-[#6B9E50]/40">
            Explorar App
          </Link>
        </div>
      </div>
    </nav>
  )
}

// ─── HERO (bg image + video lazy + phone mockup) ────────────────
function Hero() {
  const ref = useRef(null)
  const [bgLoaded, setBgLoaded] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const posterImg = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=60'
  const bgVideo = 'https://cdn.pixabay.com/video/2020/07/30/45717-445039937_large.mp4'

  return (
    <section ref={ref} className="relative min-h-[100svh] flex items-center overflow-hidden bg-[#1A1A14]">
      {/* Background video (ambient, muted, lazy) */}
      <div className="absolute inset-0" style={{ transform: 'scale(1.1)' }}>
        <video autoPlay muted loop playsInline onLoadedData={() => setBgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2500ms] ${bgLoaded ? 'opacity-25' : 'opacity-0'}`}
          poster={posterImg}>
          <source src={bgVideo} type="video/mp4" />
        </video>
        {/* Poster image as preload fallback */}
        <img src={posterImg} alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${bgLoaded ? 'opacity-0' : 'opacity-25'}`}
          loading="eager" />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(44,42,37,0.92) 0%, rgba(44,42,37,0.75) 40%, rgba(44,42,37,0.85) 100%)' }} />

      {/* Ambient glow orbs */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#6B9E50] opacity-[0.06] blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] rounded-full bg-[#E86A33] opacity-[0.04] blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-[1200px] mx-auto px-6 pt-28 pb-20 md:pt-32 md:pb-24">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
          {/* Left: Text — takes up remaining space */}
          <div className="flex-1 text-center lg:text-left">
            <Reveal>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#6B9E50]/10 border border-[#6B9E50]/20 text-[#6B9E50] text-[11px] rounded-full font-bold tracking-[0.12em] uppercase mb-7">
                <span className="w-1.5 h-1.5 bg-[#6B9E50] rounded-full animate-pulse" />
                Versión prototipo
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="landing-heading mb-5 leading-[1.05] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', color: '#F0EBE0' }}>
                Tu red rural,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B9E50] via-[#C8A96E] to-[#E86A33] block md:inline"
                  style={{ backgroundSize: '200% 200%', animation: 'gradientText 6s ease infinite' }}>
                  en tu bolsillo
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-[1.05rem] md:text-[1.15rem] text-[#D0C8BC] mb-8 leading-[1.75] max-w-[500px] mx-auto lg:mx-0">
                Facenderas, saberes, mapa vivo y comunidad — todo conectado en una app
                de <strong className="text-[#F0EBE0]">código abierto</strong> que crece con cada persona que se une.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link to="/app" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#E86A33] text-white rounded-full font-bold text-[14px] shadow-xl shadow-[#E86A33]/20 hover:shadow-[#E86A33]/40 hover:bg-[#d35a25] transition-all duration-200 cursor-pointer">
                  Explorar la App
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
                <Link to="/" className="inline-flex items-center px-7 py-3.5 bg-transparent text-[#F0EBE0] border border-[#F0EBE0]/20 rounded-full font-bold text-[14px] hover:bg-white/5 hover:border-[#F0EBE0]/40 transition-all duration-200 cursor-pointer backdrop-blur-sm">
                  Apoyar en Goteo
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right: Phone mockup — fixed width, stays in place */}
          <Reveal delay={0.2} y={40}>
            <motion.div className="relative mx-auto lg:mx-0 mt-12 lg:mt-0 shrink-0" style={{ width: 240, y: phoneY }}>
              <div className="relative rounded-[2.2rem] border-[4px] border-[#3A3830] bg-[#1A1A14] shadow-2xl shadow-black/60 overflow-hidden" style={{ aspectRatio: '9/19' }}>
                {/* Notch */}
                <div className="h-5 bg-[#1A1A14] flex items-center justify-center">
                  <div className="w-14 h-3 bg-[#2C2A25] rounded-full" />
                </div>
                {/* App header */}
                <div className="h-8 bg-white flex items-center px-2 border-b border-gray-100">
                  <div className="w-4 h-4 bg-[#6B9E50] rounded flex items-center justify-center">
                    <span className="text-white text-[5px] font-bold">RM</span>
                  </div>
                  <span className="text-[7px] font-semibold text-gray-800 ml-1">Rural Makers</span>
                </div>
                {/* Content */}
                <div className="bg-[#F5F0E6] p-1.5 space-y-1 overflow-hidden" style={{ fontSize: 0 }}>
                  <div className="bg-gradient-to-br from-[#6B9E50] to-[#4E7A38] rounded-md p-2 text-white">
                    <div className="text-[6px] font-bold uppercase tracking-wider opacity-80">Red Colaborativa</div>
                    <div className="text-[9px] font-bold mt-0.5">Tejiendo Facenderas</div>
                  </div>
                  <div className="flex gap-0.5">
                    {[{ n: '127', l: 'Facenderas' }, { n: '23', l: 'Municipios' }, { n: '8', l: 'Redes' }].map(s => (
                      <div key={s.l} className="flex-1 bg-white rounded p-0.5 text-center">
                        <div className="text-[8px] font-bold text-[#6B9E50]">{s.n}</div>
                        <div className="text-[4px] text-gray-500 font-medium">{s.l}</div>
                      </div>
                    ))}
                  </div>
                  {[
                    { title: 'Facendera de Siembra', color: '#6B9E50', tag: 'Presencial' },
                    { title: 'Claude Makers', color: '#8B5CF6', tag: 'Red activa' },
                    { title: 'Mapa del Territorio', color: '#C8A96E', tag: '8 puntos' },
                  ].map(c => (
                    <div key={c.title} className="bg-white rounded p-1.5 flex items-center gap-1">
                      <div className="w-5 h-5 rounded flex items-center justify-center shrink-0" style={{ background: `${c.color}15` }}>
                        <div className="w-2 h-2 rounded-full" style={{ background: c.color, opacity: 0.6 }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[7px] font-semibold text-gray-800 truncate">{c.title}</div>
                        <div className="text-[5px] text-gray-500">{c.tag}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Bottom nav */}
                <div className="absolute bottom-0 left-0 right-0 h-7 bg-white border-t border-gray-200 flex items-center justify-around px-2">
                  {['M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
                    'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437',
                    'M12 4v16m8-8H4',
                    'M15 19.128a9.38 9.38 0 002.625.372',
                    'M4 6h16M4 12h16M4 18h16',
                  ].map((d, i) => (
                    <svg key={i} className={`w-3 h-3 ${i === 0 ? 'text-[#6B9E50]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={d} />
                    </svg>
                  ))}
                </div>
              </div>
              {/* Glow behind phone */}
              <div className="absolute -inset-8 bg-[#6B9E50]/5 rounded-[3rem] blur-3xl -z-10 pointer-events-none" />
            </motion.div>
          </Reveal>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-5 h-7 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

// ─── BENTO GRID — 6 FEATURES (Apple-style per landing.csv) ──────
function Features() {
  const features = [
    { title: 'Facenderas', desc: 'Organiza y participa en encuentros cooperativos. Categorías, inscripción, seguimiento y documentación de cada jornada colectiva.', icon: 'handshake', color: '#6B9E50', large: true },
    { title: 'Mapa Vivo', desc: 'Geolocalización interactiva de facenderas, proyectos, saberes y puntos de interés del territorio leonés.', icon: 'map', color: '#C8A96E', large: true },
    { title: 'Red de Redes', desc: 'Redes temáticas transversales — tecnología, alimentación, oficios, arte — con sub-especialidades y facenderas propias.', icon: 'link', color: '#3B82F6', large: false },
    { title: 'IA Rural', desc: 'Chat inteligente que conoce el territorio, las personas y los proyectos. Tu asistente para todo lo rural.', icon: 'cpu', color: '#8B5CF6', large: false },
    { title: 'Rutas del Tesoro', desc: 'Recorre la provincia conectando pueblos, facenderas y saberes. Sistema gamificado con checkpoints y recompensas.', icon: 'route', color: '#E86A33', large: false },
    { title: 'Comunidad', desc: 'Perfiles con saberes, niveles de experiencia, badges y conexiones. La red humana que sostiene todo.', icon: 'users', color: '#10B981', large: false },
  ]

  return (
    <section className="py-20 md:py-28 bg-[#2C2A25]">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <h2 className="landing-heading text-[#F0EBE0] mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
              Todo lo que necesitas para cooperar
            </h2>
            <p className="text-[15px] text-[#D0C8BC] max-w-xl mx-auto leading-[1.7]">
              6 herramientas integradas que conectan personas, proyectos y saberes en el mundo rural.
            </p>
          </div>
        </Reveal>

        {/* Bento grid: 2 large + 4 small */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {features.map((f, i) => (
            <Reveal key={i} delay={0.06 * i}>
              <div className={`${f.large ? 'sm:col-span-2 lg:col-span-2' : ''} group cursor-pointer rounded-2xl p-6 relative overflow-hidden transition-all duration-250 hover:translate-y-[-2px]`}
                style={{
                  background: `linear-gradient(145deg, ${f.color}0D 0%, ${f.color}04 100%)`,
                  border: `1px solid ${f.color}18`,
                  minHeight: f.large ? '220px' : '180px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${f.color}40`
                  e.currentTarget.style.boxShadow = `0 8px 32px ${f.color}12, 0 0 0 1px ${f.color}20`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${f.color}18`
                  e.currentTarget.style.boxShadow = 'none'
                }}>
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110"
                  style={{ background: `${f.color}12` }}>
                  <Icon name={f.icon} size="w-5 h-5" color={f.color} />
                </div>
                <h3 className="font-bold text-[16px] mb-2 transition-colors duration-200" style={{ color: f.color }}>{f.title}</h3>
                <p className="text-[13px] text-[#D0C8BC] leading-[1.65]">{f.desc}</p>
                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CASES OF USE ────────────────────────────────────────────────
function UseCases() {
  const personas = [
    { role: 'Agricultor/a', quote: 'Organizo facenderas de siembra, comparto semillas y encuentro grupo de consumo eco.', color: '#6B9E50', icon: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' },
    { role: 'Programador/a', quote: 'Aprendo con Claude Makers, creo herramientas para mi pueblo y conecto con tech rurales.', color: '#8B5CF6', icon: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5' },
    { role: 'Artista', quote: 'Monto teatro foro, conecto con músicos y pintores, documento tradiciones con vídeo-arte.', color: '#EC4899', icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42' },
    { role: 'Profesional', quote: 'Ofrezco fontanería o carpintería, comparto herramientas y aprendo de otros oficios.', color: '#F97316', icon: 'M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.653-4.655m2.588 2.588l6.468-6.468' },
    { role: 'Vecino/a', quote: 'Me entero de todo, participo en lo que puedo y conozco gente nueva con ganas de hacer.', color: '#C8A96E', icon: 'M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819' },
  ]

  return (
    <section className="py-20 md:py-28 bg-[#3A3830]">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="landing-heading text-[#F0EBE0] mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
              ¿Quién eres tú en la red?
            </h2>
            <p className="text-[15px] text-[#D0C8BC] max-w-md mx-auto">Cada persona aporta algo único. Encuentra tu lugar.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {personas.map((p, i) => (
            <Reveal key={i} delay={0.08 * i}>
              <div className="rounded-2xl p-5 text-center group cursor-pointer transition-all duration-200 hover:translate-y-[-2px] h-full flex flex-col"
                style={{ background: `linear-gradient(180deg, ${p.color}0A 0%, transparent 100%)`, border: `1px solid ${p.color}15` }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${p.color}35`}
                onMouseLeave={e => e.currentTarget.style.borderColor = `${p.color}15`}>
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                  style={{ background: `${p.color}12` }}>
                  <svg className="w-5 h-5" fill="none" stroke={p.color} strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={p.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-[14px] mb-2" style={{ color: p.color }}>{p.role}</h3>
                <p className="text-[12px] text-[#D0C8BC] leading-[1.6] italic flex-1">&ldquo;{p.quote}&rdquo;</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── HOW IT WORKS ────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: '01', title: 'Entra', desc: 'Créate un perfil, cuenta tus saberes y explora', color: '#6B9E50', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0' },
    { num: '02', title: 'Conecta', desc: 'Únete a redes temáticas y grupos de tu zona', color: '#3B82F6', icon: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244' },
    { num: '03', title: 'Participa', desc: 'Apúntate a facenderas, aporta tiempo o saberes', color: '#E86A33', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
    { num: '04', title: 'Crece', desc: 'Sube de nivel, gana badges, lidera facenderas', color: '#C8A96E', icon: 'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941' },
  ]

  return (
    <section className="py-20 md:py-28 bg-[#2C2A25]">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <h2 className="landing-heading text-[#F0EBE0] mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>De semilla a bosque</h2>
            <p className="text-[15px] text-[#D0C8BC]">4 pasos para activar tu cooperación rural</p>
          </div>
        </Reveal>

        <div className="relative max-w-3xl mx-auto">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-px bg-gradient-to-r from-[#6B9E50]/25 via-[#E86A33]/20 to-[#C8A96E]/25 -translate-y-1/2" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {steps.map((s, i) => (
              <Reveal key={i} delay={0.12 * i}>
                <div className="text-center group cursor-default">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                    style={{ background: `${s.color}10`, border: `1.5px solid ${s.color}20` }}>
                    <svg className="w-6 h-6" fill="none" stroke={s.color} strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                    </svg>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: s.color }}>{s.num}</div>
                  <h3 className="font-bold text-[#F0EBE0] text-[15px] mb-1.5">{s.title}</h3>
                  <p className="text-[12px] text-[#D0C8BC] leading-[1.6]">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── STATS ──────────────────────────────────────────────────────
function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const facenderas = useCounter(127, 2000, isInView)
  const miembros = useCounter(1234, 2500, isInView)
  const redes = useCounter(8, 1200, isInView)
  const municipios = useCounter(23, 1800, isInView)

  const stats = [
    { value: facenderas, label: 'Facenderas organizadas', color: '#6B9E50', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
    { value: miembros.toLocaleString('es'), label: 'Miembros activos', color: '#E86A33', icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' },
    { value: redes, label: 'Redes temáticas', color: '#8B5CF6', icon: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244' },
    { value: municipios, label: 'Municipios conectados', color: '#C8A96E', icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' },
  ]

  return (
    <section ref={ref} className="py-16 bg-[#3A3830] border-y border-white/5">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <Reveal key={i} delay={0.08 * i}>
              <div className="text-center group">
                <div className="w-9 h-9 mx-auto mb-2 rounded-lg flex items-center justify-center" style={{ background: `${s.color}10` }}>
                  <svg className="w-4.5 h-4.5" fill="none" stroke={s.color} strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                  </svg>
                </div>
                <div className="text-[2.2rem] font-bold landing-heading leading-none mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[11px] text-[#D0C8BC]/50 uppercase tracking-[0.12em] font-bold">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA FINAL ──────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="relative py-24 md:py-28 overflow-hidden" style={{ background: 'linear-gradient(135deg, #2C2A25 0%, #1A1A14 100%)' }}>
      <div className="absolute top-[-80px] left-[30%] w-[450px] h-[450px] rounded-full bg-[#6B9E50] opacity-[0.06] blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[20%] w-[350px] h-[350px] rounded-full bg-[#E86A33] opacity-[0.05] blur-[150px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#6B9E50]/10 border border-[#6B9E50]/18 text-[#6B9E50] text-[10px] rounded-full font-bold tracking-[0.12em] uppercase mb-6">
            Código abierto | AGPL-3.0
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="landing-heading text-[#F0EBE0] mb-5 leading-[1.1]" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            La app es gratuita, abierta y crece contigo
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-[1rem] text-[#D0C8BC] mb-9 leading-[1.75]">
            Versión prototipo en fase de desarrollo. Cada persona que se une aporta su semilla.
            Apoya la campaña de crowdfunding para hacer crecer el bosque.
          </p>
        </Reveal>
        <Reveal delay={0.22}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/app" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#E86A33] text-white rounded-full font-bold text-[14px] shadow-xl shadow-[#E86A33]/20 hover:shadow-[#E86A33]/40 hover:bg-[#d35a25] transition-all duration-200 cursor-pointer">
              Explorar la App
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
            <a href={GOTEO_PROJECT_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-4 bg-transparent text-[#F0EBE0] border border-[#F0EBE0]/20 rounded-full font-bold text-[14px] hover:bg-white/5 hover:border-[#F0EBE0]/40 transition-all duration-200 cursor-pointer">
              Apoyar en Goteo
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── FOOTER ─────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-8 bg-[#2C2A25] border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#6B9E50] rounded-lg flex items-center justify-center text-white text-[10px] font-bold">RM</div>
          <span className="text-[12px] text-[#C8BEB0]/60">Rural Makers — Tejiendo Facenderas</span>
        </div>
        <div className="flex items-center gap-5 text-[11px] text-[#C8BEB0]/45">
          <Link to="/" className="hover:text-[#F0EBE0] transition-colors duration-200 cursor-pointer">Crowdfunding</Link>
          <Link to="/app" className="hover:text-[#F0EBE0] transition-colors duration-200 cursor-pointer">App</Link>
          <a href="mailto:hola@ruralmakers.net" className="hover:text-[#F0EBE0] transition-colors duration-200 cursor-pointer">Contacto</a>
          <a href="https://www.gnu.org/licenses/copyleft.es.html" target="_blank" rel="noopener noreferrer" className="hover:text-[#F0EBE0] transition-colors duration-200 cursor-pointer">Copyleft</a>
        </div>
      </div>
    </footer>
  )
}

// ─── BACK TO TOP ────────────────────────────────────────────────
function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const h = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  if (!show) return null
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-5 right-5 z-40 w-10 h-10 rounded-full bg-[#6B9E50] text-white shadow-lg shadow-[#6B9E50]/25 flex items-center justify-center hover:bg-[#4E7A38] transition-colors duration-200 cursor-pointer"
      aria-label="Volver arriba">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </motion.button>
  )
}

// ─── CSS KEYFRAMES ──────────────────────────────────────────────
const css = `
@keyframes gradientShift { 0%,100% { background-position: 0% 50% } 50% { background-position: 100% 50% } }
@keyframes gradientText { 0%,100% { background-position: 0% 50% } 50% { background-position: 100% 50% } }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
`

// ─── MAIN ───────────────────────────────────────────────────────
export default function AppShowcase() {
  return (
    <div className="overflow-hidden">
      <style>{css}</style>
      <Nav />
      <BackToTop />
      <Hero />
      <Features />
      <UseCases />
      <HowItWorks />
      <Stats />
      <FinalCTA />
      <Footer />
    </div>
  )
}
