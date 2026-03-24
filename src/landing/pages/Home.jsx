import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { GOTEO_PROJECT_URL, FUNDING_MIN, FUNDING_OPT } from '../../shared/lib/constants'
import { rewardTiers, rewardTypes, collaborations, getRewardTiers } from '../../data/rewardTiers'

// ─── HOOKS ──────────────────────────────────────────────────────
function useInView(ref, threshold = 0.12) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref, threshold])
  return visible
}

function useParallax(speed = 0.3) {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const h = () => setOffset(window.scrollY * speed)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [speed])
  return offset
}

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

// ─── COMPONENTS ─────────────────────────────────────────────────
function FadeIn({ children, className = '', delay = 0, direction = 'up', scale = false }) {
  const ref = useRef(null)
  const visible = useInView(ref)
  const transforms = { up: 'translate-y-8', down: '-translate-y-8', left: 'translate-x-12', right: '-translate-x-12' }
  const scaleClass = scale ? (visible ? 'scale-100' : 'scale-[0.92]') : ''
  return (
    <div ref={ref} className={`transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${visible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${transforms[direction]}`} ${scaleClass} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>{children}</div>
  )
}

// ─── STICKY CTA (appears after hero scrolls out) ────────────────
function StickyCTA() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const h = () => setShow(window.scrollY > window.innerHeight * 0.9)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  if (!show) return null
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-[slideUp_0.4s_ease-out]">
      <div className="bg-[#2C2A25]/95 backdrop-blur-xl border-t border-[#6B9E50]/15 shadow-2xl shadow-black/40">
        <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <img src="/logo-ruralmakers.png" alt="" className="h-8 w-auto rounded-md" />
            <div>
              <p className="text-[12px] text-[#F0EBE0] font-bold leading-tight">Rural Makers</p>
              <p className="text-[10px] text-[#B0A898]/60">Crowdfunding activo en Goteo.org</p>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <a href="#rewards" onClick={e => { e.preventDefault(); document.querySelector('#rewards')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="text-[12px] text-[#6B9E50] font-bold hover:text-[#8BC06A] transition hidden sm:inline-block">
              Ver recompensas
            </a>
            <a href={GOTEO_PROJECT_URL} target="_blank" rel="noopener noreferrer"
              className="btn-coral text-[12px] px-6 py-2.5 shadow-lg shadow-[#E86A33]/20">
              Apoyar en Goteo
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function WaveDivider({ flip, type = 'wave', from = '#2C2A25', to = '#3A3830' }) {
  const paths = {
    wave: 'M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,101.3C960,117,1056,139,1152,138.7C1248,139,1344,117,1392,106.7L1440,96L1440,0L0,0Z',
    mountain: 'M0,96L120,112C240,128,480,160,720,154.7C960,149,1200,107,1320,85.3L1440,64L1440,0L0,0Z',
    gentle: 'M0,24L240,48Q480,72,720,48Q960,24,1200,48L1440,24L1440,0L0,0Z',
  }
  return (
    <div className={`relative w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''}`} style={{ marginTop: '-2px', marginBottom: '-2px' }}>
      {/* Gradient blend for smoother transition */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${from} 0%, transparent 100%)` }} />
      <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className="w-full h-[50px] md:h-[70px] relative">
        <defs>
          <linearGradient id={`wave-grad-${type}-${flip ? 'f' : 'n'}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={to} stopOpacity="0.8" />
            <stop offset="100%" stopColor={to} stopOpacity="1" />
          </linearGradient>
        </defs>
        <path d={paths[type]} fill={to} />
      </svg>
    </div>
  )
}

function GlowOrb({ color, size, top, left, right, bottom, blur = 150, opacity = 0.1 }) {
  return (
    <div className="absolute rounded-full pointer-events-none" style={{
      width: size, height: size, top, left, right, bottom,
      background: color, filter: `blur(${blur}px)`, opacity,
    }} />
  )
}

// ─── NAV ────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const links = [
    { label: 'El Proyecto', href: '#about' },
    { label: 'Facenderas', href: '#solution' },
    { label: 'Recompensas', href: '#rewards' },
    { label: 'Mapa', href: '#map' },
    { label: 'Colabora', href: '#cta' },
    { label: 'FAQ', href: '#faq' },
  ]

  const go = (id) => { setOpen(false); document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' }) }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#2C2A25]/95 backdrop-blur-xl shadow-2xl shadow-black/30' : 'bg-gradient-to-b from-black/40 to-transparent'}`}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-[72px] flex items-center justify-between">
        <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className="flex items-center gap-3 group">
          <img src="/logo-ruralmakers.png" alt="Rural Makers" className="h-11 w-auto rounded-lg shadow-lg group-hover:shadow-[#6B9E50]/30 transition-shadow" />
          <div className="hidden sm:block">
            <span className="font-bold text-[#F0EBE0] text-sm tracking-wide block leading-tight">Rural Makers</span>
            <span className="text-[10px] text-[#6B9E50] tracking-[0.2em] uppercase font-bold">Tejiendo Facenderas</span>
          </div>
        </a>
        <div className="hidden lg:flex items-center gap-7">
          {links.map(l => (
            <button key={l.label} onClick={() => go(l.href)}
              className="text-[13px] text-[#B0A898] hover:text-[#F0EBE0] transition-colors font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#6B9E50] after:transition-all hover:after:w-full">
              {l.label}
            </button>
          ))}
          <Link to="/app" className="text-[13px] text-[#6B9E50] font-bold hover:text-[#8BC06A] transition">App</Link>
          <a href={GOTEO_PROJECT_URL} target="_blank" rel="noopener noreferrer"
            className="btn-primary-landing text-[13px] py-2.5 px-6 shadow-lg shadow-[#6B9E50]/20 hover:shadow-[#6B9E50]/40">
            Apoyar en Goteo
          </a>
        </div>
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-[#F0EBE0]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-[#2C2A25]/98 backdrop-blur-xl border-t border-white/5 px-6 py-5 space-y-1 animate-[fadeInDown_0.3s_ease]">
          {links.map(l => <button key={l.label} onClick={() => go(l.href)} className="block text-[#B0A898] text-sm py-2.5 hover:text-[#F0EBE0] hover:pl-2 transition-all w-full text-left">{l.label}</button>)}
          <div className="pt-3 mt-3 border-t border-white/5 space-y-3">
            <Link to="/app" onClick={() => setOpen(false)} className="block text-[#6B9E50] font-bold text-sm py-1">Abrir App</Link>
            <a href={GOTEO_PROJECT_URL} target="_blank" rel="noopener noreferrer" className="btn-coral w-full text-sm py-3">Apoyar en Goteo</a>
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── HERO ────────────────────────────────────────────────────────
function useLandingConfig() {
  try {
    const stored = localStorage.getItem('rm-landing-config')
    return stored ? JSON.parse(stored) : {}
  } catch { return {} }
}

function Hero() {
  const cfg = useLandingConfig()
  const [wi, setWi] = useState(0)
  const [bgLoaded, setBgLoaded] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const parallax = useParallax(0.3)
  const WORDS = ['Cooperacion', 'Facenderas', 'Codigo abierto', 'IA etica', 'Procomun', 'Artesania', 'Leon rural', 'Sostenibilidad', 'Territorio', 'Red humana', 'Innovacion', 'Saberes']
  const bgVideo = cfg.heroBgVideo || 'https://cdn.pixabay.com/video/2020/07/30/45717-445039937_large.mp4'
  const posterImg = cfg.heroPosterImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=60'
  const heroTitle = cfg.heroTitle || 'Tejemos futuro rural con'
  const heroSub = cfg.heroSubtitle || 'App de codigo abierto y red humana que conecta personas, proyectos y territorios rurales con la tradicion de las facenderas.'
  const campaignVideoId = cfg.heroCampaignVideo || ''
  const campaignVideoType = cfg.heroCampaignVideoType || 'youtube'

  useEffect(() => { const t = setInterval(() => setWi(i => (i + 1) % WORDS.length), 2800); return () => clearInterval(t) }, [])

  const milestones = [
    { icon: '🌐', label: 'Red de cooperacion', value: 'Activas tu pasaporte Rural Maker', sub: 'y entras en la red', color: '#6B9E50' },
    { icon: '🎯', label: 'Minimo', value: `${FUNDING_MIN.toLocaleString('es')} EUR`, sub: 'App + 5 facenderas piloto en Leon', color: '#6B9E50' },
    { icon: '🚀', label: 'Optimo', value: `${FUNDING_OPT.toLocaleString('es')} EUR`, sub: 'Red estatal, jardin-homenaje, formacion', color: '#C8A96E' },
  ]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#1A1A14]">
      {/* Background video (ambient, muted, behind everything) */}
      <div className="absolute inset-0" style={{ transform: `translateY(${parallax}px) scale(1.15)` }}>
        <video autoPlay muted loop playsInline onLoadedData={() => setBgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2500ms] ${bgLoaded ? 'opacity-30' : 'opacity-0'}`}
          poster={posterImg}>
          <source src={bgVideo} type="video/mp4" />
        </video>
        {/* Poster image as preload fallback */}
        <img src={posterImg} alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${bgLoaded ? 'opacity-0' : 'opacity-30'}`}
          loading="eager" />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(44,42,37,0.95) 0%, rgba(44,42,37,0.8) 35%, rgba(44,42,37,0.55) 100%)' }} />

      {/* Glow orbs */}
      <GlowOrb color="#6B9E50" size="700px" top="-200px" right="-200px" blur={200} opacity={0.07} />
      <GlowOrb color="#E86A33" size="400px" bottom="-100px" left="-100px" blur={150} opacity={0.05} />

      <div className="relative w-full max-w-[1280px] mx-auto px-6 md:px-10 pt-28 pb-16 md:pt-36 md:pb-20">
        {/* Centered hero with video below on mobile, side by side on desktop */}
        <div className="grid lg:grid-cols-[1fr,0.85fr] gap-10 lg:gap-14 items-center">
          {/* LEFT/CENTER: Text content - centered on mobile */}
          <div className="text-center lg:text-left">
            <FadeIn>
              <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-[#6B9E50]/12 border border-[#6B9E50]/25 text-[#6B9E50] text-[13px] rounded-full mb-8 font-bold tracking-[0.15em] uppercase backdrop-blur-sm">
                <span className="w-2 h-2 bg-[#6B9E50] rounded-full animate-pulse shadow-lg shadow-[#6B9E50]/50" />
                Crowdfunding en Goteo.org
              </div>
            </FadeIn>

            <FadeIn delay={150}>
              <h1 className="landing-heading text-[2.5rem] sm:text-[3rem] md:text-[3.8rem] lg:text-[4.2rem] text-[#F0EBE0] mb-6 leading-[1.08] tracking-[-0.02em]">
                {heroTitle}{' '}
                <span key={WORDS[wi]} className="text-[#6B9E50] italic block md:inline animate-[fadeInUp_0.5s_ease]">
                  {WORDS[wi]}
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={300}>
              <p className="text-[1rem] md:text-[1.15rem] text-[#B0A898] mb-6 leading-[1.8] font-light max-w-lg mx-auto lg:mx-0">
                {heroSub}
              </p>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
                {['Facenderas', 'IA Etica', 'Codigo Abierto', 'Procomun', 'Leon', 'Artesania', 'Saberes', 'Territorio'].map(tag => (
                  <span key={tag} className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B9E50] bg-[#6B9E50]/8 border border-[#6B9E50]/15 rounded-full backdrop-blur-sm hover:bg-[#6B9E50]/15 transition-all cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={500}>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <a href={GOTEO_PROJECT_URL} target="_blank" rel="noopener noreferrer"
                  className="btn-coral text-[14px] px-8 py-[14px] shadow-xl shadow-[#E86A33]/20 hover:shadow-[#E86A33]/40">
                  Apoyar en Goteo
                </a>
                <a href="#rewards" onClick={e => { e.preventDefault(); document.querySelector('#rewards')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="btn-outline-landing text-[14px] px-8 py-[14px] backdrop-blur-sm">
                  Ver recompensas
                </a>
              </div>
            </FadeIn>
          </div>

          {/* RIGHT: Campaign video embed */}
          <FadeIn delay={400} direction="right">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 bg-[#1A1A14] aspect-video">
                {showVideo ? (
                  <iframe
                    src={campaignVideoType === 'vimeo' ? `https://player.vimeo.com/video/${campaignVideoId}?autoplay=1` : `https://www.youtube.com/embed/${campaignVideoId || 'dQw4w9WgXcQ'}?autoplay=1&rel=0`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media" allowFullScreen
                    title="Video de campana Rural Makers" />
                ) : (
                  <div className="relative w-full h-full cursor-pointer group" onClick={() => setShowVideo(true)}>
                    {/* Video poster/thumbnail */}
                    <img src={posterImg} alt="Video de campana"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A25]/80 via-transparent to-[#2C2A25]/30" />
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#E86A33] flex items-center justify-center shadow-2xl shadow-[#E86A33]/40 group-hover:scale-110 group-hover:shadow-[#E86A33]/60 transition-all duration-300">
                        <svg className="w-7 h-7 md:w-8 md:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {/* Label */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-[#2C2A25]/80 backdrop-blur-sm rounded-full border border-white/10">
                      <span className="text-sm">🎬</span>
                      <span className="text-[12px] text-[#F0EBE0] font-medium">Video de campana</span>
                    </div>
                  </div>
                )}
              </div>
              {/* Decorative glow behind video */}
              <div className="absolute -inset-4 bg-[#6B9E50]/5 rounded-3xl blur-2xl -z-10" />
            </div>
          </FadeIn>
        </div>

        {/* Milestone cards - full width below */}
        <FadeIn delay={650}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-14 max-w-4xl mx-auto">
            {milestones.map((m, i) => (
              <div key={i} className="group bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 backdrop-blur-sm hover:bg-white/[0.08] hover:-translate-y-1 transition-all duration-300 cursor-default flex items-start gap-4">
                <div className="text-2xl shrink-0">{m.icon}</div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1" style={{ color: m.color }}>{m.label}</div>
                  <div className="text-[15px] font-bold text-[#F0EBE0] landing-heading leading-tight">{m.value}</div>
                  <div className="text-[11px] text-[#B0A898]/70 mt-0.5 font-light">{m.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-5 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

// ─── ABOUT ──────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-[#3A3830]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="landing-heading text-[2rem] md:text-[2.8rem] text-[#F0EBE0] mb-3">Tu plataforma de cooperacion rural</h2>
            <div className="title-divider" />
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          <FadeIn delay={100} direction="left">
            <div className="space-y-5">
              <p className="text-[#B0A898] leading-[1.8] font-light text-[15px]">
                <strong className="text-[#F0EBE0] font-bold">Rural Makers Tejiendo Facenderas</strong> es un proyecto de impacto social
                que rescata la tradicion de las facenderas — trabajo colectivo y solidario — y la combina con tecnologia
                de codigo abierto e inteligencia artificial etica.
              </p>
              <p className="text-[#B0A898] leading-[1.8] font-light text-[15px]">
                La campana busca financiar una app colaborativa que conecte personas, proyectos y saberes en el mundo rural
                de Leon y mas alla. Con tu apoyo, organizamos facenderas piloto, documentamos la metodologia y lanzamos la plataforma.
              </p>
              <p className="text-[#B0A898] leading-[1.8] font-light text-[15px]">
                Impulsada por la comunidad Rural Makers y el Fab Lab Leon. Un proyecto de <strong className="text-[#F0EBE0] font-bold">codigo abierto,
                licencia libre y retorno colectivo</strong>.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={250} direction="right">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '📜', label: 'Licencia', value: 'AGPL-3.0', desc: 'Codigo libre y abierto' },
                { icon: '🎨', label: 'Contenido', value: 'CC BY-SA 4.0', desc: 'Compartir y adaptar' },
                { icon: '🏛', label: 'Entidad', value: 'Asoc. Indira', desc: 'La Omana, Leon' },
                { icon: '📍', label: 'Territorio', value: 'Leon, Espana', desc: 'Castilla y Leon' },
              ].map(item => (
                <div key={item.label} className="card-dark group text-center py-5">
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <div className="text-[10px] text-[#B0A898]/60 uppercase tracking-[0.15em] font-bold">{item.label}</div>
                  <div className="text-sm font-bold text-[#F0EBE0] mt-1">{item.value}</div>
                  <div className="text-[11px] text-[#B0A898]/50 mt-0.5 font-light">{item.desc}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// ─── PROBLEM ────────────────────────────────────────────────────
function Problem() {
  const challenges = [
    {
      stat: '53%',
      statLabel: 'municipios en riesgo',
      action: 'Mapeamos oportunidades',
      description: 'Cada pueblo esconde tesoros: personas, oficios, tierras y proyectos. Los conectamos en un mapa vivo.',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=70',
      color: '#E86A33',
      gradient: 'from-orange-900/90',
    },
    {
      stat: '1 de 3',
      statLabel: 'iniciativas muere sola',
      action: 'Tejemos red de apoyo mutuo',
      description: 'Las facenderas unen lo que la distancia separa. Ningun proyecto camina solo cuando hay red.',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=70',
      color: '#6B9E50',
      gradient: 'from-green-900/90',
    },
    {
      stat: '+200',
      statLabel: 'saberes por documentar',
      action: 'Recopilamos saberes vivos',
      description: 'Oficios, recetas, tecnicas y relatos que se transmitian de boca en boca, ahora documentados y accesibles.',
      image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&q=70',
      color: '#C8A96E',
      gradient: 'from-amber-900/90',
    },
    {
      stat: '2x',
      statLabel: 'brecha digital vs urbana',
      action: 'Cerramos la brecha digital y natural',
      description: 'La tecnologia al servicio del campo, no al reves. Herramientas abiertas que cualquiera puede usar.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=70',
      color: '#7C8CF0',
      gradient: 'from-indigo-900/90',
    },
    {
      stat: '89%',
      statLabel: 'proyectos necesitan red',
      action: 'Incubamos proyectos rurales',
      description: 'Acompanamos desde la semilla hasta el fruto. Mentoria, recursos compartidos y comunidad que sostiene.',
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=70',
      color: '#6B9E50',
      gradient: 'from-emerald-900/90',
    },
    {
      stat: '4M+',
      statLabel: 'casas vacias en pueblos',
      action: 'Rehabilitar rehabitando',
      description: 'Facilitamos encontrar lugares, espacios y oportunidades para acercarse a un pueblo. Para generar recursos, negocios o vida personal.',
      image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&q=70',
      color: '#C8A96E',
      gradient: 'from-yellow-900/90',
    },
  ]

  return (
    <section className="py-24 md:py-36 bg-[#1E1D1A] relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #F0EBE0 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <GlowOrb color="#6B9E50" size="800px" top="-300px" left="-300px" blur={250} opacity={0.05} />
      <GlowOrb color="#E86A33" size="600px" bottom="-200px" right="-200px" blur={200} opacity={0.04} />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 bg-[#6B9E50]/10 border border-[#6B9E50]/20 text-[#6B9E50] text-[11px] font-bold tracking-[0.2em] uppercase rounded-full mb-6">Donde otros ven problemas, nosotros vemos semillas</span>
            <h2 className="landing-heading text-[2.2rem] md:text-[3.2rem] lg:text-[3.8rem] text-[#F0EBE0] mb-4 leading-[1.1]">
              El mundo rural tiene<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B9E50] via-[#C8A96E] to-[#E86A33]">todo lo que necesita</span>
            </h2>
            <div className="title-divider" />
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <blockquote className="text-center text-[1.2rem] md:text-[1.5rem] max-w-3xl mx-auto mb-20 leading-[1.7]">
            <span className="text-[#B0A898] font-light">"Lo que afecta al campo nos afecta a todos.</span>
            <br />
            <span className="text-[#C8A96E] landing-heading italic font-medium">La solucion tambien nace de todos."</span>
          </blockquote>
        </FadeIn>

        {/* Bento grid layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {challenges.map((c, i) => (
            <FadeIn key={i} delay={200 + i * 120}>
              <div className="group relative rounded-2xl overflow-hidden cursor-default transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/30 h-full"
                style={{ minHeight: '280px' }}>
                {/* Background image */}
                <img src={c.image} alt="" loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${c.gradient} via-black/70 to-black/30`} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-7 md:p-8">
                  {/* Stat badge top-right */}
                  <div className="self-end">
                    <div className="text-right">
                      <div className="text-[2.5rem] md:text-[3rem] font-black leading-none tracking-tight"
                        style={{ color: c.color, textShadow: `0 0 40px ${c.color}40` }}>
                        {c.stat}
                      </div>
                      <div className="text-[10px] text-white/50 uppercase tracking-[0.15em] font-semibold mt-1">{c.statLabel}</div>
                    </div>
                  </div>

                  {/* Action + description bottom */}
                  <div>
                    <h3 className="text-[1.4rem] md:text-[1.6rem] font-bold text-white leading-tight mb-2 drop-shadow-lg group-hover:translate-x-1 transition-transform duration-300">
                      {c.action}
                    </h3>
                    <p className="text-[0.9rem] text-white/70 leading-[1.7] font-light max-w-md drop-shadow-md">
                      {c.description}
                    </p>
                    {/* Animated line */}
                    <div className="mt-4 h-[2px] rounded-full transition-all duration-500 group-hover:w-24 w-12"
                      style={{ backgroundColor: c.color }} />
                  </div>
                </div>

                {/* Hover glow border */}
                <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/10 transition-all duration-500" />
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Bottom text */}
        <FadeIn delay={800}>
          <div className="text-center mt-12">
            <p className="text-[#B0A898] text-sm font-light">Cada facendera es una oportunidad. Cada persona que se suma, multiplica.</p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── SOLUTION ───────────────────────────────────────────────────
function Solution() {
  const features = [
    { icon: '🤝', title: 'Facenderas', desc: 'Encuentros cooperativos tradicionales reinventados para conectar personas y proyectos', color: '#6B9E50' },
    { icon: '💻', title: 'App abierta', desc: 'Plataforma digital de codigo abierto, accesible desde cualquier dispositivo', color: '#3B82F6' },
    { icon: '🤖', title: 'IA Etica', desc: 'Inteligencia artificial al servicio del procomun: herramientas y agentes rurales', color: '#8B5CF6' },
    { icon: '🗺', title: 'Mapa vivo', desc: 'Red geolocalizada de iniciativas, rutas y saberes del territorio leones', color: '#C8A96E' },
    { icon: '🔓', title: 'Procomun', desc: 'Todo el codigo y metodologia en abierto, licencia libre para replicar', color: '#10B981' },
    { icon: '👥', title: 'Red humana', desc: 'Comunidad de makers, artesanos, facilitadores y vecinos que cooperan', color: '#E86A33' },
  ]

  return (
    <section id="solution" className="py-24 md:py-32 bg-[#2C2A25]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <FadeIn>
          <div className="text-center mb-6">
            <h2 className="landing-heading text-[2rem] md:text-[2.8rem] text-[#F0EBE0] mb-3">La app que une el campo y la cooperacion</h2>
            <div className="title-divider" />
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <p className="text-center text-[#B0A898] max-w-3xl mx-auto mb-16 font-light text-[15px] leading-[1.8]">
            La app conecta personas con proyectos, facilita encuentros presenciales y documenta saberes en un mapa vivo.
            No es solo una plataforma digital: <strong className="text-[#F0EBE0]">es una red humana que se activa con cada facendera
            y crece con cada persona que se une.</strong>
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FadeIn key={i} delay={150 + i * 80}>
              <div className="card-dark group cursor-default relative overflow-hidden">
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ background: `${f.color}15`, boxShadow: 'none' }}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-[#F0EBE0] mb-2 text-[15px] group-hover:text-[#6B9E50] transition-colors">{f.title}</h3>
                <p className="text-[13px] text-[#B0A898] leading-[1.7] font-light">{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── HOW IT WORKS ───────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { icon: '🌱', title: 'Semilla', desc: 'Apoya el crowdfunding y planta tu semilla' },
    { icon: '🌿', title: 'Brote', desc: 'Participa en facenderas, conecta tu comarca' },
    { icon: '🌳', title: 'Arbol', desc: 'Impulsa proyectos, comparte saberes' },
    { icon: '🌲', title: 'Bosque', desc: 'La red crece con cada nueva facendera' },
  ]

  return (
    <section className="py-24 md:py-32 bg-[#3A3830]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="landing-heading text-[2rem] md:text-[2.8rem] text-[#F0EBE0] mb-3">De semilla a bosque</h2>
            <p className="text-[15px] text-[#B0A898] font-light mt-4">Tu participacion hace crecer la red paso a paso</p>
            <div className="title-divider" />
          </div>
        </FadeIn>

        <div className="relative max-w-4xl mx-auto">
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#6B9E50]/20 via-[#6B9E50]/40 to-[#6B9E50]/20 -translate-y-1/2 z-0" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((s, i) => (
              <FadeIn key={i} delay={100 + i * 150}>
                <div className="card-dark text-center py-8 group">
                  <div className="w-9 h-9 bg-[#6B9E50] text-white text-sm rounded-full flex items-center justify-center font-bold mx-auto mb-4 shadow-lg shadow-[#6B9E50]/30 group-hover:shadow-[#6B9E50]/50 group-hover:scale-110 transition-all">{i + 1}</div>
                  <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-500">{s.icon}</div>
                  <h3 className="font-bold text-[#F0EBE0] mb-1 text-[15px]">{s.title}</h3>
                  <p className="text-[12px] text-[#B0A898] font-light leading-[1.6]">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PROGRESS / STATS ───────────────────────────────────────────
function Progress() {
  const ref = useRef(null)
  const visible = useInView(ref, 0.2)
  const facenderas = useCounter(127, 2000, visible)
  const participantes = useCounter(1234, 2500, visible)
  const comunidades = useCounter(23, 1500, visible)
  const proyectos = useCounter(89, 1800, visible)

  const stats = [
    { value: facenderas, label: 'Facenderas realizadas', icon: '🤝', color: '#6B9E50', pct: 85 },
    { value: participantes.toLocaleString('es'), label: 'Participantes activos', icon: '👥', color: '#E86A33', pct: 62 },
    { value: comunidades, label: 'Comunidades conectadas', icon: '📍', color: '#C8A96E', pct: 46 },
    { value: proyectos, label: 'Proyectos completados', icon: '🚀', color: '#8B5CF6', pct: 74 },
  ]

  return (
    <section id="progress" ref={ref} className="py-24 md:py-32 bg-[#2C2A25] relative overflow-hidden">
      <GlowOrb color="#6B9E50" size="500px" top="50%" left="-200px" blur={200} opacity={0.06} />
      <GlowOrb color="#C8A96E" size="400px" bottom="-100px" right="-100px" blur={150} opacity={0.05} />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="landing-heading text-[2rem] md:text-[2.8rem] text-[#F0EBE0] mb-3">Impacto de la comunidad</h2>
            <p className="text-[15px] text-[#B0A898] font-light mt-4">Numeros que crecen con cada facendera</p>
            <div className="title-divider" />
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {stats.map((s, i) => (
            <FadeIn key={i} delay={100 + i * 120}>
              <div className="card-dark text-center py-8 group">
                <div className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-300">{s.icon}</div>
                <div className="text-[2.5rem] font-bold text-[#F0EBE0] landing-heading leading-none mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[11px] text-[#B0A898]/60 uppercase tracking-[0.15em] font-bold mb-4">{s.label}</div>
                {/* Progress bar */}
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-[2000ms] ease-out"
                    style={{ width: visible ? `${s.pct}%` : '0%', backgroundColor: s.color }} />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── TESTIMONIALS ───────────────────────────────────────────────
function Testimonials() {
  const [idx, setIdx] = useState(0)
  const testimonials = [
    { quote: 'Aprendi a instalar paneles solares con 60 anos. Las facenderas me devolvieron las ganas de aprender.', name: 'Maria Gonzalez', role: 'Agricultora, Astorga' },
    { quote: 'Encontre mi comunidad sin salir del pueblo. Rural Makers conecta personas que comparten vision.', name: 'Javier Prieto', role: 'Programador, Bembibre' },
    { quote: 'Mis ceramicas ahora llegan a toda la provincia gracias a la red de makers rurales.', name: 'Carmen Alvarez', role: 'Artesana, El Bierzo' },
    { quote: 'La tecnologia no tiene que ser enemiga de lo rural. Aqui demostramos que puede ser aliada.', name: 'Pablo Martinez', role: 'Bioconstructor, Villablino' },
  ]

  useEffect(() => { const t = setInterval(() => setIdx(i => (i + 1) % testimonials.length), 6000); return () => clearInterval(t) }, [])

  return (
    <section className="py-24 md:py-32 bg-[#3A3830] relative overflow-hidden">
      <GlowOrb color="#6B9E50" size="400px" top="-100px" left="50%" blur={180} opacity={0.05} />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10">
        <FadeIn>
          <div className="text-center mb-14">
            <h2 className="landing-heading text-[2rem] md:text-[2.8rem] text-[#F0EBE0] mb-3">Voces de la comunidad</h2>
            <div className="title-divider" />
          </div>
        </FadeIn>

        <div className="max-w-3xl mx-auto">
          <div className="relative min-h-[200px] flex items-center justify-center">
            <div key={idx} className="text-center animate-[fadeInUp_0.6s_ease]">
              <div className="text-5xl text-[#6B9E50]/30 landing-heading mb-4">"</div>
              <p className="text-[1.2rem] md:text-[1.5rem] text-[#F0EBE0] landing-heading italic leading-[1.5] mb-8">
                {testimonials[idx].quote}
              </p>
              <div>
                <div className="text-sm font-bold text-[#F0EBE0]">{testimonials[idx].name}</div>
                <div className="text-[12px] text-[#6B9E50] font-medium tracking-wide">{testimonials[idx].role}</div>
              </div>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === i ? 'w-8 bg-[#6B9E50]' : 'w-2 bg-white/20 hover:bg-white/40'}`} />
            ))}
          </div>

          {/* Prev/Next */}
          <div className="flex justify-center gap-4 mt-6">
            <button onClick={() => setIdx(i => (i - 1 + testimonials.length) % testimonials.length)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#B0A898] hover:bg-white/10 hover:text-white transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => setIdx(i => (i + 1) % testimonials.length)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#B0A898] hover:bg-white/10 hover:text-white transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── REWARD DETAIL (cumulative view) ────────────────────────────
function RewardDetail({ reward, allRewards }) {
  const [showPrevious, setShowPrevious] = useState(false)
  // If reward has inheritsUpTo, only inherit tiers up to that amount
  // Otherwise inherit all previous tiers (normal accumulation for <=100 EUR tiers)
  const maxInherit = reward.inheritsUpTo || reward.amount
  const previousTiers = allRewards.filter(r => r.amount < reward.amount && r.amount <= maxInherit)

  // Collect ALL items from inherited tiers
  const allPreviousItems = previousTiers.flatMap(tier =>
    tier.own.map(item => ({ item, from: tier.name, amount: tier.amount, color: tier.color }))
  )

  return (
    <div className="space-y-2 mb-3 animate-[fadeInDown_0.3s_ease]">
      {/* OWN - exclusive to this level */}
      <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3">
        <div className="text-[10px] text-[#C8A96E] font-bold uppercase tracking-wider mb-2">+ Exclusivo de este nivel:</div>
        {reward.own.map((item, j) => (
          <div key={j} className="text-[11px] text-[#F0EBE0] font-light flex items-start gap-1.5 py-0.5">
            <span className="shrink-0 mt-0.5" style={{ color: reward.color }}>★</span> {item}
          </div>
        ))}
      </div>

      {/* INHERITED - expandable cumulative view */}
      {previousTiers.length > 0 && (
        <div className="bg-[#6B9E50]/6 border border-[#6B9E50]/12 rounded-lg overflow-hidden">
          <button onClick={() => setShowPrevious(!showPrevious)}
            className="w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 hover:bg-[#6B9E50]/10 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#6B9E50] font-bold uppercase tracking-wider">
                Incluye todo de {previousTiers.length} {previousTiers.length === 1 ? 'nivel anterior' : 'niveles anteriores'}
              </span>
              <span className="text-[10px] text-[#6B9E50]/60">({allPreviousItems.length} items)</span>
            </div>
            <svg className={`w-3.5 h-3.5 text-[#6B9E50] transition-transform ${showPrevious ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showPrevious && (
            <div className="px-3 pb-3 space-y-2 animate-[fadeInDown_0.2s_ease]">
              {previousTiers.slice().reverse().map(tier => (
                <div key={tier.amount} className="bg-white/[0.03] rounded-lg p-2.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: tier.color }}>
                      {tier.name}
                    </span>
                    <span className="text-[9px] text-[#B0A898]/40">{tier.amount} EUR</span>
                  </div>
                  {tier.own.map((item, j) => (
                    <div key={j} className="text-[11px] text-[#B0A898]/70 font-light flex items-start gap-1.5 py-0.5">
                      <span className="shrink-0 mt-0.5 text-[#6B9E50]">✓</span> {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Total summary */}
      <div className="text-center py-1.5">
        <span className="text-[10px] text-[#B0A898]/40">
          Total: <strong className="text-[#F0EBE0]">{reward.own.length + allPreviousItems.length}</strong> recompensas por <strong style={{ color: reward.color }}>{reward.amount} EUR</strong>
        </span>
      </div>
    </div>
  )
}

// ─── REWARDS ────────────────────────────────────────────────────
function Rewards() {
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const tiers = getRewardTiers()
  const filtered = filter === 'all' ? tiers : tiers.filter(r => r.type === filter)

  return (
    <section id="rewards" className="py-24 md:py-32 bg-[#3A3830]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <FadeIn>
          <div className="text-center mb-6">
            <div className="text-[11px] text-[#6B9E50] uppercase tracking-[0.25em] font-bold mb-3">Gracias por apoyar</div>
            <h2 className="landing-heading text-[2rem] md:text-[2.8rem] text-[#F0EBE0] mb-4">Elige tu recompensa</h2>
            <p className="text-[15px] text-[#B0A898] font-light max-w-2xl mx-auto leading-[1.7]">
              Cada aportacion activa la red. Ademas de las recompensas individuales, recuerda que <strong className="text-[#F0EBE0]">todo lo que creamos es procomun</strong>: codigo abierto, metodologias libres, documentacion accesible.
            </p>
            <div className="title-divider" />
          </div>
        </FadeIn>

        {/* Filter tabs */}
        <FadeIn delay={100}>
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {rewardTypes.map(t => (
              <button key={t.id} onClick={() => setFilter(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold transition-all ${filter === t.id ? 'bg-[#6B9E50] text-white shadow-lg shadow-[#6B9E50]/30' : 'bg-white/5 border border-white/10 text-[#B0A898] hover:bg-white/10 hover:text-[#F0EBE0]'}`}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Reward cards - alternating slide directions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((r, i) => {
            const isExpanded = expandedId === r.amount
            const directions = ['left', 'up', 'right', 'up']
            return (
              <FadeIn key={r.amount} delay={80 + i * 60} direction={directions[i % 4]} scale>
                <div className="reward-card card-dark flex flex-col group relative h-full"
                  style={{ boxShadow: `0 0 0 0 ${r.color}00` }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 25px ${r.color}30, 0 8px 30px rgba(0,0,0,0.3), inset 0 1px 0 ${r.color}20`}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 0 0 ${r.color}00`}>
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 w-full h-[2px] group-hover:h-[3px] transition-all duration-300" style={{ background: `linear-gradient(90deg, transparent, ${r.color}, transparent)`, opacity: 0.5 }} />

                  {/* Reward image */}
                  {r.image && (
                    <div className="relative -mx-5 -mt-5 mb-4 rounded-t-xl overflow-hidden">
                      <img src={r.image} alt={r.name} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A25] via-transparent to-transparent" />
                    </div>
                  )}

                  {/* Badge */}
                  {r.badge && (
                    <div className={`absolute ${r.image ? 'top-2' : 'top-4'} right-4 px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-lg z-10`} style={{ backgroundColor: r.color }}>
                      {r.badge}
                    </div>
                  )}

                  {/* Type pill */}
                  <div className="inline-flex self-start px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] mb-3 border"
                    style={{ color: r.color, borderColor: `${r.color}30`, background: `${r.color}10` }}>
                    {r.typeLabel}
                  </div>

                  {/* Price + Name */}
                  <div className="text-[2rem] font-bold landing-heading mb-0.5 leading-none" style={{ color: r.color }}>
                    {r.amount} <span className="text-[14px] font-normal text-[#B0A898]">EUR</span>
                  </div>
                  <div className="font-bold text-[#F0EBE0] text-[14px] mb-1 group-hover:text-[#6B9E50] transition-colors">{r.name}</div>
                  <div className="text-[11px] text-[#B0A898]/50 italic mb-3 font-light">{r.tagline}</div>

                  {/* Description */}
                  <p className="text-[12px] text-[#B0A898]/80 leading-[1.7] font-light mb-3">{r.description}</p>

                  {/* Expand/collapse for details */}
                  <button onClick={() => setExpandedId(isExpanded ? null : r.amount)}
                    className="text-[11px] text-[#6B9E50] font-bold mb-2 text-left hover:text-[#8BC06A] transition-colors flex items-center gap-1">
                    {isExpanded ? 'Ocultar detalle' : 'Ver que incluye'}
                    <svg className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {isExpanded && (
                    <RewardDetail reward={r} allRewards={tiers} />
                  )}

                  {/* CTA */}
                  <div className="mt-auto pt-4 border-t border-white/5">
                    <a href={GOTEO_PROJECT_URL} target="_blank" rel="noopener noreferrer"
                      className="text-[11px] text-[#6B9E50] font-bold group-hover:text-[#8BC06A] transition-colors uppercase tracking-[0.15em] flex items-center gap-1">
                      Seleccionar en Goteo <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                    </a>
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>

        {/* Jardín-Homenaje explanation for mecenazgo */}
        {(filter === 'all' || filter === 'mecenazgo') && (
          <FadeIn delay={300}>
            <div className="mt-14 card-dark relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(200,169,110,0.08) 0%, rgba(200,169,110,0.02) 100%)', borderColor: 'rgba(200,169,110,0.2)' }}>
              <GlowOrb color="#C8A96E" size="250px" top="-80px" right="-80px" blur={100} opacity={0.1} />
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="text-[10px] text-[#C8A96E] uppercase tracking-[0.25em] font-bold mb-2">Mecenazgo de alto impacto</div>
                  <h3 className="landing-heading text-[1.5rem] md:text-[1.8rem] text-[#F0EBE0] mb-4">El Jardin-Homenaje NaturArt</h3>
                  <p className="text-[14px] text-[#B0A898] leading-[1.8] font-light mb-4">
                    Un espacio fisico permanente en la provincia de Leon donde cada mecenas deja su huella viva.
                    Arboles plantados a tu nombre, espacios dedicados y un jardin que crece con la comunidad.
                  </p>
                  <p className="text-[14px] text-[#B0A898] leading-[1.8] font-light">
                    El Jardin-Homenaje es parte del <strong className="text-[#F0EBE0]">plan de consolidacion</strong> del proyecto (fase 4, agosto-diciembre 2026).
                    Sera inaugurado con una facendera especial donde los mecenas plantaran sus arboles en persona.
                    Un legado vivo que trasciende lo digital.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { amount: '1.000 EUR', area: '10m2', trees: '1 arbol', label: 'Sembradora' },
                    { amount: '2.000 EUR', area: '20m2', trees: '2 arboles', label: 'Hilandera' },
                    { amount: '4.000 EUR', area: '50m2', trees: '5 arboles', label: 'Eco del Valle' },
                  ].map((m, i) => (
                    <div key={i} className="card-dark text-center py-4 group hover:border-[#C8A96E]/30">
                      <div className="text-2xl mb-2">🌳</div>
                      <div className="text-[14px] font-bold text-[#C8A96E] landing-heading">{m.amount}</div>
                      <div className="text-[11px] text-[#F0EBE0] font-bold mt-1">{m.label}</div>
                      <div className="text-[10px] text-[#B0A898]/60 mt-2 space-y-0.5">
                        <div>{m.area} de jardin</div>
                        <div>{m.trees}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        <FadeIn delay={400}>
          <div className="text-center mt-14">
            <a href={GOTEO_PROJECT_URL} target="_blank" rel="noopener noreferrer"
              className="btn-coral text-[15px] px-12 py-[18px] shadow-2xl shadow-[#E86A33]/20 hover:shadow-[#E86A33]/40">
              Apoyar en Goteo
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── COLLABORATIONS ─────────────────────────────────────────────
function CollabCard({ c, i }) {
  const ref = useRef(null)
  const visible = useInView(ref, 0.1)
  const isConfirmed = c.status === 'Confirmado'

  return (
    <div ref={ref}
      className="group relative overflow-hidden rounded-2xl cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.95)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms`,
      }}
    >
      {/* Background image with overlay */}
      <div className="relative h-[320px] overflow-hidden">
        <img
          src={c.image}
          alt={c.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Dark gradient overlay - stronger at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
        {/* Color tint from category */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
          style={{ background: `linear-gradient(135deg, ${c.categoryColor}, transparent)` }} />

        {/* Neon border glow on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1.5px ${c.categoryColor}60, 0 0 30px ${c.categoryColor}20` }} />

        {/* Status badge top-right */}
        <div className="absolute top-4 right-4">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold backdrop-blur-md border ${isConfirmed ? 'bg-[#6B9E50]/20 border-[#6B9E50]/40 text-[#6B9E50]' : 'bg-[#E86A33]/15 border-[#E86A33]/30 text-[#E86A33]'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConfirmed ? 'bg-[#6B9E50]' : 'bg-[#E86A33] animate-pulse'}`} />
            {c.status}
          </div>
        </div>

        {/* Category chip top-left */}
        <div className="absolute top-4 left-4">
          <div className="px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border"
            style={{ color: c.categoryColor, borderColor: `${c.categoryColor}40`, background: `${c.categoryColor}15` }}>
            {c.category}
          </div>
        </div>

        {/* Content at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-bold text-white text-[15px] leading-tight mb-2 group-hover:text-[#6B9E50] transition-colors duration-300">
            {c.title}
          </h3>
          <p className="text-[12px] text-white/70 leading-[1.65] font-light mb-3 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
            {c.description}
          </p>

          {/* Skills + commitment row */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-white/40 italic truncate">{c.skills}</span>
            <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/10 text-white/70 border border-white/10">
              {c.commitment}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Collaborations() {
  const [filter, setFilter] = useState('Todas')
  const filters = ['Todas', 'Buscando', 'Confirmado']

  const filtered = filter === 'Todas'
    ? collaborations
    : collaborations.filter(c => c.status === filter)

  // Group by category for the "pills" strip
  const categories = [...new Set(collaborations.map(c => c.category))]

  return (
    <section id="colabora" className="py-24 md:py-36 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #1E1D19 0%, #2C2A25 40%, #1E1D19 100%)' }}>
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[120px]" style={{ background: '#6B9E50' }} />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[100px]" style={{ background: '#E86A33' }} />

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 relative">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6B9E50]/10 border border-[#6B9E50]/20 text-[#6B9E50] text-[11px] font-bold uppercase tracking-[0.2em] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6B9E50] animate-pulse" />
              Únete al Movimiento
            </div>
            <h2 className="landing-heading text-[2.4rem] md:text-[3.2rem] lg:text-[3.8rem] text-[#F0EBE0] mb-5 leading-[1.05]">
              Aporta tu talento,<br />
              <span className="text-[#6B9E50]">construye el rural</span>
            </h2>
            <p className="text-[16px] md:text-[17px] text-[#B0A898] font-light max-w-2xl mx-auto leading-[1.75]">
              Rural Makers crece con cada persona que aporta su talento. Aqui puedes ver que necesitamos — sin dinero, con tiempo, saberes o espacio.
            </p>
            <div className="title-divider" />
          </div>
        </FadeIn>

        {/* Filter bar */}
        <FadeIn delay={100}>
          <div className="flex items-center justify-center gap-3 mb-12 flex-wrap">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-300 ${filter === f
                  ? 'bg-[#6B9E50] text-white shadow-lg shadow-[#6B9E50]/25 scale-105'
                  : 'bg-white/5 text-[#B0A898] border border-white/10 hover:bg-white/10 hover:text-white'}`}>
                {f}
                {f !== 'Todas' && (
                  <span className={`ml-1.5 text-[10px] ${filter === f ? 'text-white/70' : 'text-[#B0A898]/50'}`}>
                    ({collaborations.filter(c => c.status === f).length})
                  </span>
                )}
              </button>
            ))}
            <span className="text-[11px] text-[#B0A898]/40 ml-2">{filtered.length} perfiles</span>
          </div>
        </FadeIn>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filtered.map((c, i) => (
            <CollabCard key={c.title} c={c} i={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <FadeIn delay={500}>
          <div className="mt-16 relative">
            <div className="rounded-2xl overflow-hidden relative">
              {/* BG */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a2d1a 0%, #2C2A25 50%, #2d1a10 100%)' }} />
              <div className="absolute inset-0 opacity-30" style={{ background: 'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=60&fit=crop) center/cover no-repeat' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(107,158,80,0.4) 0%, rgba(44,42,37,0.9) 50%, rgba(232,106,51,0.3) 100%)' }} />

              <div className="relative px-8 py-10 md:px-14 md:py-12 text-center">
                <div className="text-[12px] text-[#6B9E50] uppercase tracking-[0.2em] font-bold mb-3">Tu perfil no esta en la lista?</div>
                <h3 className="landing-heading text-[1.6rem] md:text-[2rem] text-[#F0EBE0] mb-3">Cuéntanos que puedes aportar</h3>
                <p className="text-[14px] text-[#B0A898] font-light mb-7 max-w-lg mx-auto">
                  Si tienes algun saber, recurso o idea que pueda ayudar al movimiento rural, queremos escucharte.
                </p>
                <a href="mailto:hola@ruralmakers.net"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#6B9E50] text-white font-bold text-[14px] hover:bg-[#7ab55c] transition-all duration-300 shadow-xl shadow-[#6B9E50]/25 hover:scale-105 hover:shadow-[#6B9E50]/35">
                  hola@ruralmakers.net
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── BUDGET ─────────────────────────────────────────────────────
function Budget() {
  const items = [
    { label: 'Coordinacion desarrollo app', amount: 2000, pct: 19 },
    { label: 'Herramientas IA y agentes', amount: 2000, pct: 19 },
    { label: 'Facilitacion desarrollo humano', amount: 2000, pct: 19 },
    { label: 'Programacion frontend + backend', amount: 1500, pct: 14 },
    { label: 'Comisiones y llaveros', amount: 1100, pct: 10 },
    { label: 'Diseno UX/UI colaborativo', amount: 1000, pct: 9 },
    { label: 'Identidad grafica', amount: 600, pct: 6 },
    { label: 'Comunicacion y redes', amount: 500, pct: 5 },
  ]

  const ref = useRef(null)
  const visible = useInView(ref, 0.2)

  return (
    <section ref={ref} className="py-24 md:py-32 bg-[#2C2A25]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="landing-heading text-[2rem] md:text-[2.8rem] text-[#F0EBE0] mb-3">Presupuesto transparente</h2>
            <p className="text-[15px] text-[#B0A898] font-light mt-4">Cada euro tiene su destino</p>
            <div className="title-divider" />
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <FadeIn delay={100} direction="left">
            <div className="card-dark">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[#F0EBE0] text-[15px]">Objetivo Minimo</h3>
                <span className="text-xl font-bold text-[#6B9E50] landing-heading">{FUNDING_MIN.toLocaleString('es')} EUR</span>
              </div>
              <div className="space-y-4">
                {items.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[13px] mb-1">
                      <span className="text-[#B0A898] font-light">{item.label}</span>
                      <span className="font-bold text-[#F0EBE0]">{item.amount.toLocaleString('es')} EUR</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#6B9E50] rounded-full transition-all duration-[1500ms] ease-out"
                        style={{ width: visible ? `${item.pct}%` : '0%', transitionDelay: `${i * 100}ms` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={250} direction="right">
            <div className="card-dark relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(107,158,80,0.12) 0%, rgba(107,158,80,0.04) 100%)', borderColor: 'rgba(107,158,80,0.2)' }}>
              <GlowOrb color="#6B9E50" size="200px" top="-50px" right="-50px" blur={80} opacity={0.1} />
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-[#F0EBE0] text-[15px]">Objetivo Optimo</h3>
                  <span className="text-xl font-bold text-[#C8A96E] landing-heading">{FUNDING_OPT.toLocaleString('es')} EUR</span>
                </div>
                <p className="text-[13px] text-[#B0A898] mb-5 font-light">Todo lo del minimo + expansion a red estatal:</p>
                {['Fondo impulso facenderas — 6.000 EUR', 'Soporte legal integral — 5.000 EUR', 'Jardin-Homenaje NaturArt — 3.000 EUR', 'Promocion y difusion — 3.000 EUR',
                  'Comisiones Goteo y bancos — 3.000 EUR', 'Expansion territorial estatal', 'Formacion avanzada facilitadores', 'Documentacion audiovisual'].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-[13px] py-1.5 font-light">
                    <span className="text-[#6B9E50] mt-0.5 shrink-0">→</span>
                    <span className="text-[#B0A898]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// ─── TIMELINE ───────────────────────────────────────────────────
function Timeline() {
  const phases = [
    {
      phase: 'Campana activa', date: 'Mar - May 2026', active: true,
      items: ['Crowdfunding en Goteo.org (40 dias)', 'Difusion y construccion de comunidad', 'Entrega inmediata de recompensas digitales'],
      color: '#6B9E50', icon: '🌱',
    },
    {
      phase: 'Desarrollo', date: 'May - Jul 2026',
      items: ['Desarrollo de la app Rural Makers', 'Integracion de IA etica y agentes', '5 facenderas piloto en Leon'],
      color: '#3B82F6', icon: '⚙️',
    },
    {
      phase: 'Lanzamiento', date: 'Ago - Oct 2026',
      items: ['App publica y codigo abierto', 'Entrega de recompensas experienciales', 'Rutas bano de bosque y talleres de domo'],
      color: '#E86A33', icon: '🚀',
    },
    {
      phase: 'Consolidacion', date: 'Nov 2026 - Mar 2027',
      items: ['Publicacion de metodologia libre', 'Inauguracion del Jardin-Homenaje NaturArt', 'Expansion de red a escala estatal'],
      color: '#C8A96E', icon: '🌳',
    },
  ]

  return (
    <section className="py-24 md:py-32 bg-[#3A3830]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <FadeIn>
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6B9E50]/10 border border-[#6B9E50]/20 text-[#6B9E50] text-[11px] font-bold uppercase tracking-[0.2em] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6B9E50] animate-pulse" />
              Campana activa ahora mismo
            </div>
            <h2 className="landing-heading text-[2rem] md:text-[2.8rem] text-[#F0EBE0] mb-3">Cronograma del proyecto</h2>
            <p className="text-[14px] text-[#B0A898] font-light mb-6">Arrancamos en marzo 2026. Cada fase depende del exito de la campana.</p>
            <div className="title-divider" />
          </div>
        </FadeIn>
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line (desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#6B9E50]/60 via-[#E86A33]/30 to-[#C8A96E]/20 -translate-x-1/2" />

          <div className="space-y-8 lg:space-y-12">
            {phases.map((p, i) => (
              <FadeIn key={i} delay={100 + i * 150} direction={i % 2 === 0 ? 'left' : 'right'}>
                <div className={`lg:flex items-center gap-8 ${i % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'lg:text-right' : ''}`}>
                    <div className="card-dark relative overflow-hidden" style={p.active ? { borderColor: `${p.color}50`, boxShadow: `0 0 30px ${p.color}15` } : {}}>
                      {/* Top accent */}
                      <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${p.color}, transparent)`, opacity: p.active ? 0.9 : 0.35 }} />

                      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{p.icon}</span>
                          <div>
                            <h3 className="font-bold text-[#F0EBE0] text-[15px]">{p.phase}</h3>
                            <p className="text-[11px] font-medium" style={{ color: p.color }}>{p.date}</p>
                          </div>
                        </div>
                        {p.active && (
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#6B9E50]/15 border border-[#6B9E50]/30 text-[#6B9E50]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6B9E50] animate-pulse" />
                            AHORA
                          </div>
                        )}
                      </div>
                      {p.items.map((item, j) => (
                        <div key={j} className="text-[13px] font-light py-1 flex gap-2" style={{ color: p.active ? '#D0C8BC' : '#B0A898' }}>
                          <span style={{ color: p.color }}>→</span> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Center dot */}
                  <div className="hidden lg:flex w-5 h-5 rounded-full border-[3px] shrink-0 shadow-lg"
                    style={{ borderColor: p.color, backgroundColor: '#3A3830', boxShadow: p.active ? `0 0 20px ${p.color}70` : `0 0 10px ${p.color}30` }} />
                  <div className="flex-1 hidden lg:block" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── TEAM CARD ──────────────────────────────────────────────────
function TeamVideoEmbed({ videoUrl }) {
  const id = (() => {
    const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&/]+)/)
    return match ? match[1] : videoUrl
  })()
  return (
    <iframe
      src={`https://www.youtube.com/embed/${id}?rel=0`}
      className="w-full h-full"
      allow="encrypted-media"
      allowFullScreen
      loading="lazy"
      title="CowoCyL — Lugar de Sinergias"
    />
  )
}

function TeamCard({ cfg }) {
  const videoUrl = cfg.teamVideo || 'https://youtu.be/11Ud97j7MpE'

  return (
    <div className="card-dark relative overflow-hidden mb-8" style={{ background: 'linear-gradient(135deg, rgba(107,158,80,0.08) 0%, rgba(107,158,80,0.02) 100%)', borderColor: 'rgba(107,158,80,0.15)' }}>
      <GlowOrb color="#6B9E50" size="200px" top="-50px" right="-50px" blur={100} opacity={0.08} />
      <style>{`@media(min-width:768px){.team-row{flex-direction:row!important}.team-vid-side{display:flex!important}}`}</style>

      <div className="relative team-row flex flex-col gap-7" style={{ flexDirection: 'column' }}>
        {/* Info */}
        <div style={{ flex: 1 }}>
          <div className="flex items-center gap-4 mb-5">
            {cfg.teamPhoto ? (
              <img src={cfg.teamPhoto} alt="Alipio" className="w-20 h-20 rounded-2xl object-cover shadow-xl shadow-[#6B9E50]/20 border-2 border-[#6B9E50]/20" style={{ flexShrink: 0 }} />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-[#6B9E50] to-[#4E7A38] rounded-2xl flex items-center justify-center text-white text-3xl font-bold landing-heading shadow-xl shadow-[#6B9E50]/20" style={{ flexShrink: 0 }}>A</div>
            )}
            <div>
              <div className="text-[10px] text-[#6B9E50] uppercase tracking-[0.2em] font-bold mb-0.5">Impulsor del proyecto</div>
              <h3 className="text-xl font-bold text-[#F0EBE0] landing-heading">{cfg.teamName || 'Alipio'}</h3>
              <p className="text-[12px] text-[#B0A898]/60 font-light">{cfg.teamOrg || 'Asociacion Indira'} | La Omana, Leon</p>
            </div>
          </div>
          <p className="text-[14px] text-[#B0A898] leading-[1.8] mb-4 font-light">
            {cfg.teamBio || 'Mas de 25 anos construyendo alternativas: fundador de Ecoalternative y Certyetic, coordinador de redes de economia social. Experto en WordPress, IA y blockchain al servicio del bien comun.'}
          </p>
          <p className="text-[14px] text-[#C8A96E] italic landing-heading leading-[1.6]">
            &ldquo;{cfg.teamQuote || 'Demostrar que la tecnologia puede ponerse al servicio de la cooperacion rural, uniendo tradicion e innovacion.'}&rdquo;
          </p>
        </div>

        {/* Video vertical — visible solo en desktop via CSS */}
        <div className="team-vid-side flex-col items-center" style={{ display: 'none', width: 220, flexShrink: 0 }}>
          <div className="text-[9px] text-[#6B9E50] uppercase tracking-[0.2em] font-bold mb-2 text-center">CowoCyL — Sinergias</div>
          <div className="rounded-xl overflow-hidden bg-black/40 w-full" style={{ aspectRatio: '9/16' }}>
            <TeamVideoEmbed videoUrl={videoUrl} />
          </div>
        </div>
      </div>

      {/* Video mobile fallback (solo visible <768px, oculto por CSS en desktop via team-vid-side) */}
      <div className="mt-6 pt-5 border-t border-white/5 team-vid-mobile">
        <style>{`@media(min-width:768px){.team-vid-mobile{display:none!important}}`}</style>
        <div className="text-[9px] text-[#6B9E50] uppercase tracking-[0.2em] font-bold mb-2">CowoCyL — Lugar de Sinergias</div>
        <div className="rounded-xl overflow-hidden bg-black/40 mx-auto" style={{ aspectRatio: '9/16', maxWidth: 280 }}>
          <TeamVideoEmbed videoUrl={videoUrl} />
        </div>
      </div>
    </div>
  )
}

// ─── TEAM ───────────────────────────────────────────────────────
function Team() {
  const cfg = useLandingConfig()
  return (
    <section id="team" className="py-24 md:py-32 bg-[#2C2A25]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="landing-heading text-[2rem] md:text-[2.8rem] text-[#F0EBE0] mb-3">El equipo</h2>
            <div className="title-divider" />
          </div>
        </FadeIn>

        <div className="max-w-4xl mx-auto">
          <FadeIn delay={100}>
            <TeamCard cfg={cfg} />
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            <FadeIn delay={200} direction="left">
              <div className="card-dark">
                <h4 className="font-bold text-[#F0EBE0] mb-5 text-[11px] uppercase tracking-[0.2em]">Roles del equipo</h4>
                {[{ r: 'Desarrollo tech', s: 'Buscando', c: '#E86A33' }, { r: 'Coordinacion', s: 'Alipio + equipo', c: '#6B9E50' }, { r: 'Comunicacion', s: 'En formacion', c: '#C8A96E' }, { r: 'Facilitacion', s: 'Red activa', c: '#6B9E50' }, { r: 'Diseno', s: 'Buscando', c: '#E86A33' }].map((item, i) => (
                  <div key={i} className="flex justify-between py-2.5 border-b border-white/5 last:border-0 text-[13px]">
                    <span className="text-[#B0A898] font-light">{item.r}</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full border font-medium" style={{ color: item.c, borderColor: `${item.c}30` }}>{item.s}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={300} direction="right">
              <div className="card-dark">
                <h4 className="font-bold text-[#F0EBE0] mb-5 text-[11px] uppercase tracking-[0.2em]">Alianzas</h4>
                {[
                  { n: 'Fab Lab Leon', desc: 'Espacio maker para prototipado y facenderas tecnologicas', c: '#6B9E50' },
                  { n: 'Canal Rural Goteo', desc: 'Plataforma de crowdfunding civico que acoge la campana', c: '#6B9E50' },
                  { n: 'REAS CyL', desc: 'Red de economia alternativa y solidaria de Castilla y Leon', c: '#C8A96E' },
                  { n: 'Grupos rurales Leon', desc: 'Comunidades locales que activan facenderas en el territorio', c: '#E86A33' },
                  { n: 'Entidades tech eticas', desc: 'Colectivos tecnologicos que comparten valores de procomun', c: '#E86A33' },
                ].map((a, i) => (
                  <div key={i} className="py-3 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: a.c }} />
                      <span className="text-[#F0EBE0] text-[13px] font-medium">{a.n}</span>
                    </div>
                    <p className="text-[11px] text-[#B0A898]/60 font-light pl-3.5 leading-snug">{a.desc}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ────────────────────────────────────────────────────────
function FAQ() {
  const [openIdx, setOpenIdx] = useState(null)
  const faqs = [
    { q: 'Que pasa si no se llega al objetivo minimo?', a: 'Si la campana no alcanza los 10.700 EUR, se devuelve todo el dinero a los mecenas. Goteo funciona con el modelo de "todo o nada" en la primera ronda.' },
    { q: 'Cual es la diferencia entre minimo y optimo?', a: 'El minimo (10.700 EUR) cubre el desarrollo de la app y 5 facenderas piloto en Leon. El optimo (55.000 EUR) permite expandir a red estatal, crear el Jardin-Homenaje, formacion avanzada y documentacion profesional.' },
    { q: 'Cuando se entregan las recompensas?', a: 'Las recompensas digitales se entregan nada mas finalizar la campana (mayo 2026). Las experienciales (rutas, talleres, bano de bosque, taller de domo) entre agosto y diciembre de 2026.' },
    { q: 'El codigo de la app sera realmente abierto?', a: 'Si. Publicaremos todo el codigo bajo licencia AGPL-3.0 y el contenido bajo CC BY-SA 4.0. Cualquier persona o comunidad podra replicar, adaptar y mejorar la plataforma.' },
    { q: 'Puedo colaborar sin dinero?', a: 'Por supuesto. Necesitamos personas que difundan, que participen en facenderas, que aporten saberes, que ayuden con traduccion, diseno, codigo... Contacta en hola@ruralmakers.net.' },
    { q: 'Quien gestiona los fondos?', a: 'La Asociacion Indira es la entidad beneficiaria inicial. El proyecto evoluciona hacia una estructura confederal (ASASA) con gobernanza participativa.' },
    { q: 'Es deducible fiscalmente?', a: 'Las donaciones a traves de Goteo pueden tener ventajas fiscales. Consulta con tu asesor fiscal las deducciones aplicables en tu comunidad autonoma.' },
    { q: 'Como puedo contactar?', a: 'Escribe a hola@ruralmakers.net o visitanos en ruralmakers.net. Tambien en redes sociales como @ruralmakers.' },
  ]

  return (
    <section id="faq" className="py-24 md:py-32 bg-[#3A3830]">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="landing-heading text-[2rem] md:text-[2.8rem] text-[#F0EBE0] mb-3">Preguntas frecuentes</h2>
            <div className="title-divider" />
          </div>
        </FadeIn>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={40 + i * 40}>
              <div className={`card-dark overflow-hidden transition-all duration-300 ${openIdx === i ? 'ring-1 ring-[#6B9E50]/30' : ''}`}>
                <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full text-left px-1 flex items-center justify-between gap-4 group">
                  <span className="font-medium text-[#F0EBE0] text-[14px] group-hover:text-[#6B9E50] transition-colors">{faq.q}</span>
                  <div className={`w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 transition-all ${openIdx === i ? 'bg-[#6B9E50]/20 rotate-180' : ''}`}>
                    <svg className="w-3.5 h-3.5 text-[#6B9E50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openIdx === i ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                  <p className="text-[13px] text-[#B0A898] leading-[1.8] font-light px-1">{faq.a}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── MAP (interactive La Omaña) ─────────────────────────────────
function MapSection() {
  const locations = [
    { name: 'La Omana', lat: 42.82, lng: -6.05, type: 'base', desc: 'Sede del proyecto' },
    { name: 'Murias de Paredes', lat: 42.85, lng: -6.20, type: 'facendera', desc: 'Facendera de bioconstruccion' },
    { name: 'Riello', lat: 42.79, lng: -6.07, type: 'facendera', desc: 'Taller de artesania en cuero' },
    { name: 'Villablino', lat: 42.94, lng: -6.32, type: 'planned', desc: 'Ruta de saberes en preparacion' },
    { name: 'Leon capital', lat: 42.60, lng: -5.57, type: 'hub', desc: 'Fab Lab Leon - Alianza confirmada' },
    { name: 'Astorga', lat: 42.46, lng: -6.06, type: 'planned', desc: 'Facendera digital rural' },
    { name: 'Bembibre', lat: 42.62, lng: -6.42, type: 'planned', desc: 'Cooperativa energetica solar' },
    { name: 'Riano', lat: 42.98, lng: -5.07, type: 'planned', desc: 'Ruta de bano de bosque' },
  ]

  const [active, setActive] = useState(null)
  const typeColors = { base: '#E86A33', facendera: '#6B9E50', planned: '#C8A96E', hub: '#3B82F6' }
  const typeLabels = { base: 'Sede', facendera: 'Facendera activa', planned: 'Planificada', hub: 'Hub aliado' }

  // Simple SVG map centered on León province
  const project = (lat, lng) => {
    const x = ((lng - (-7.0)) / ((-4.5) - (-7.0))) * 100
    const y = ((43.3 - lat) / (43.3 - 42.0)) * 100
    return [x, y]
  }

  return (
    <section id="map" className="py-24 md:py-32 bg-[#2C2A25] relative overflow-hidden">
      <GlowOrb color="#6B9E50" size="500px" top="-100px" right="-200px" blur={200} opacity={0.06} />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10">
        <FadeIn>
          <div className="text-center mb-14">
            <h2 className="landing-heading text-[2rem] md:text-[2.8rem] text-[#F0EBE0] mb-3">Mapa del territorio</h2>
            <p className="text-[15px] text-[#B0A898] font-light mt-4">Donde nacen y crecen las facenderas</p>
            <div className="title-divider" />
          </div>
        </FadeIn>

        <FadeIn delay={150} scale>
          <div className="card-dark relative overflow-hidden max-w-5xl mx-auto" style={{ background: 'linear-gradient(135deg, rgba(107,158,80,0.06) 0%, rgba(44,42,37,1) 100%)' }}>
            <div className="grid lg:grid-cols-[1fr,320px] gap-6">
              {/* SVG map */}
              <div className="relative aspect-[16/10] bg-[#1A1A14]/50 rounded-xl overflow-hidden border border-white/5">
                <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  {/* Province outline (simplified) */}
                  <path d="M15,20 Q25,8 45,12 Q60,10 75,18 Q85,25 82,45 Q88,60 78,75 Q65,88 45,85 Q25,90 18,75 Q8,55 12,35 Z"
                    fill="none" stroke="#6B9E50" strokeWidth="0.5" strokeDasharray="2,1" opacity="0.3" />
                  <path d="M15,20 Q25,8 45,12 Q60,10 75,18 Q85,25 82,45 Q88,60 78,75 Q65,88 45,85 Q25,90 18,75 Q8,55 12,35 Z"
                    fill="#6B9E50" opacity="0.03" />

                  {/* Connection lines */}
                  {locations.map((loc, i) => {
                    const [x, y] = project(loc.lat, loc.lng)
                    const [bx, by] = project(locations[0].lat, locations[0].lng)
                    return loc.type !== 'base' ? (
                      <line key={`line-${i}`} x1={bx} y1={by} x2={x} y2={y}
                        stroke="#6B9E50" strokeWidth="0.3" opacity="0.2" strokeDasharray="1,2" />
                    ) : null
                  })}

                  {/* Location markers */}
                  {locations.map((loc, i) => {
                    const [x, y] = project(loc.lat, loc.lng)
                    const isActive = active === i
                    const color = typeColors[loc.type]
                    return (
                      <g key={i} className="cursor-pointer" onClick={() => setActive(isActive ? null : i)}>
                        {/* Pulse ring for active */}
                        {isActive && (
                          <circle cx={x} cy={y} r="4" fill="none" stroke={color} strokeWidth="0.5" opacity="0.5">
                            <animate attributeName="r" from="2" to="6" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                          </circle>
                        )}
                        {/* Marker dot */}
                        <circle cx={x} cy={y} r={isActive ? '2.5' : loc.type === 'base' ? '2.2' : '1.6'}
                          fill={color} stroke="#1A1A14" strokeWidth="0.4"
                          className="transition-all duration-300" />
                        {/* Label */}
                        {(isActive || loc.type === 'base') && (
                          <text x={x} y={y - 4} textAnchor="middle" fill="#F0EBE0" fontSize="2.2" fontWeight="bold" fontFamily="sans-serif">
                            {loc.name}
                          </text>
                        )}
                      </g>
                    )
                  })}
                </svg>

                {/* Legend */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                  {Object.entries(typeLabels).map(([type, label]) => (
                    <div key={type} className="flex items-center gap-1.5 px-2 py-1 bg-[#2C2A25]/80 backdrop-blur-sm rounded-full border border-white/5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: typeColors[type] }} />
                      <span className="text-[9px] text-[#B0A898]/70 font-medium">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar: location details */}
              <div className="space-y-2">
                <div className="text-[10px] text-[#B0A898]/50 uppercase tracking-[0.2em] font-bold mb-3">Localizaciones</div>
                {locations.map((loc, i) => (
                  <button key={i} onClick={() => setActive(active === i ? null : i)}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-300 ${active === i ? 'bg-white/[0.06] border-white/15 shadow-lg' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'}`}>
                    <div className="flex items-start gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full mt-1 shrink-0 shadow-lg" style={{ backgroundColor: typeColors[loc.type], boxShadow: active === i ? `0 0 8px ${typeColors[loc.type]}50` : 'none' }} />
                      <div>
                        <div className="text-[13px] text-[#F0EBE0] font-medium leading-tight">{loc.name}</div>
                        <div className="text-[11px] text-[#B0A898]/60 font-light mt-0.5">{loc.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── CTA FINAL ──────────────────────────────────────────────────
function FinalCTA() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = (e) => {
    e.preventDefault()
    if (email.includes('@')) { setSubscribed(true); setEmail('') }
  }

  return (
    <section id="cta" className="relative py-28 md:py-36 overflow-hidden" style={{ background: 'linear-gradient(135deg, #2C2A25 0%, #1A1A14 100%)' }}>
      <GlowOrb color="#6B9E50" size="600px" top="-100px" left="30%" blur={200} opacity={0.1} />
      <GlowOrb color="#E86A33" size="500px" bottom="-100px" right="20%" blur={180} opacity={0.08} />

      <div className="relative max-w-3xl mx-auto px-6 md:px-10 text-center">
        <FadeIn>
          <h2 className="landing-heading text-[2.2rem] md:text-[3.5rem] text-[#F0EBE0] mb-8 leading-[1.1]">
            Tu tambien puedes ser parte de esta red
          </h2>
        </FadeIn>
        <FadeIn delay={100}>
          <p className="text-[1.05rem] text-[#B0A898] mb-4 leading-[1.8] font-light">
            Cada euro cuenta. Cada persona que se suma activa la red.
            La campana dura 40 dias — si no llegamos al minimo, se devuelve todo.
          </p>
        </FadeIn>
        <FadeIn delay={200}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14 mt-10">
            <a href={GOTEO_PROJECT_URL} target="_blank" rel="noopener noreferrer"
              className="btn-coral text-[15px] px-14 py-[20px] shadow-2xl shadow-[#E86A33]/30 hover:shadow-[#E86A33]/50">
              Apoyar en Goteo
            </a>
            <a href="mailto:hola@ruralmakers.net"
              className="btn-outline-landing text-[15px] px-14 py-[20px] backdrop-blur-sm">
              Colaborar sin dinero
            </a>
          </div>
        </FadeIn>

        {/* Newsletter */}
        <FadeIn delay={350}>
          <div className="max-w-md mx-auto">
            <p className="text-[12px] text-[#B0A898]/60 uppercase tracking-[0.2em] font-bold mb-4">Mantente informado</p>
            {subscribed ? (
              <div className="bg-[#6B9E50]/15 border border-[#6B9E50]/30 rounded-2xl p-4 text-[#6B9E50] text-sm font-medium">
                Gracias! Te mantendremos al dia.
              </div>
            ) : (
              <form onSubmit={subscribe} className="flex gap-2">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="flex-1 px-5 py-3 bg-white/5 border border-white/10 rounded-full text-sm text-[#F0EBE0] placeholder:text-[#B0A898]/40 focus:outline-none focus:border-[#6B9E50]/50 transition" />
                <button type="submit" className="btn-primary-landing text-sm py-3 px-6">Suscribir</button>
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── FOOTER ─────────────────────────────────────────────────────
function Footer() {
  const socialLinks = [
    { label: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
    { label: 'Twitter', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
    { label: 'Email', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', stroke: true },
  ]

  return (
    <footer className="py-16 bg-[#2C2A25] border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#6B9E50] rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-[#6B9E50]/20">RM</div>
              <div>
                <span className="font-bold text-[#F0EBE0] block text-sm">Rural Makers</span>
                <span className="text-[10px] text-[#6B9E50] tracking-[0.2em] uppercase font-bold">Tejiendo Facenderas</span>
              </div>
            </div>
            <p className="text-[13px] text-[#B0A898]/60 font-light leading-[1.7] max-w-sm mb-5">
              Proyecto de codigo abierto para conectar comunidades rurales. Impulsado por Asociacion Indira desde La Omana, Leon.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(s => (
                <a key={s.label} href={s.label === 'Email' ? 'mailto:hola@ruralmakers.net' : '#'} target={s.label !== 'Email' ? '_blank' : undefined}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#6B9E50]/20 hover:border-[#6B9E50]/30 transition-all group">
                  <svg className="w-4 h-4 text-[#B0A898] group-hover:text-[#6B9E50] transition-colors" viewBox="0 0 24 24"
                    fill={s.stroke ? 'none' : 'currentColor'} stroke={s.stroke ? 'currentColor' : 'none'} strokeWidth={s.stroke ? 1.5 : 0}>
                    <path d={s.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#B0A898]/40 uppercase tracking-[0.2em] mb-4 font-bold">Enlaces</div>
            <div className="space-y-2.5 text-[13px]">
              <a href="https://ruralmakers.net" target="_blank" rel="noopener noreferrer" className="block text-[#B0A898]/60 hover:text-[#F0EBE0] transition font-light">ruralmakers.net</a>
              <a href={GOTEO_PROJECT_URL} target="_blank" rel="noopener noreferrer" className="block text-[#B0A898]/60 hover:text-[#F0EBE0] transition font-light">Campana en Goteo</a>
              <Link to="/app" className="block text-[#B0A898]/60 hover:text-[#F0EBE0] transition font-light">Abrir App</Link>
              <Link to="/admin" className="block text-[#B0A898]/60 hover:text-[#F0EBE0] transition font-light">Dashboard Admin</Link>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#B0A898]/40 uppercase tracking-[0.2em] mb-4 font-bold">Legal</div>
            <div className="space-y-2.5 text-[13px]">
              <a href="mailto:hola@ruralmakers.net" className="block text-[#B0A898]/60 hover:text-[#F0EBE0] transition font-light">hola@ruralmakers.net</a>
              <p className="text-[#B0A898]/40 font-light">Licencia: AGPL-3.0</p>
              <p className="text-[#B0A898]/40 font-light">Contenido: CC BY-SA 4.0</p>
              <p className="text-[#B0A898]/40 font-light">Beneficiaria: Asoc. Indira</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-wrap justify-between items-center gap-4">
          <p className="text-[11px] text-[#B0A898]/30">2026-2027 Rural Makers. Proyecto de codigo abierto.</p>
          <a href={GOTEO_PROJECT_URL} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#B0A898]/30 hover:text-[#6B9E50] transition">
            Impulsado con Goteo.org
          </a>
        </div>
      </div>
    </footer>
  )
}

// ─── MAIN ───────────────────────────────────────────────────────
export default function LandingHome() {
  return (
    <div className="overflow-hidden">
      <Nav />
      <StickyCTA />
      <Hero />
      <WaveDivider from="#1A1A14" to="#3A3830" type="mountain" />
      <About />
      <WaveDivider from="#3A3830" to="#2C2A25" type="wave" flip />
      <Problem />
      <WaveDivider from="#2C2A25" to="#2C2A25" type="gentle" />
      <Solution />
      <WaveDivider from="#2C2A25" to="#3A3830" type="wave" />
      <HowItWorks />
      <WaveDivider from="#3A3830" to="#3A3830" type="mountain" flip />
      <Testimonials />
      <WaveDivider from="#3A3830" to="#3A3830" type="wave" flip />
      <Rewards />
      <WaveDivider from="#3A3830" to="#2C2A25" type="mountain" />
      <Collaborations />
      <WaveDivider from="#2C2A25" to="#2C2A25" type="gentle" />
      <Budget />
      <WaveDivider from="#2C2A25" to="#3A3830" type="wave" flip />
      <Timeline />
      <WaveDivider from="#3A3830" to="#2C2A25" type="gentle" />
      <MapSection />
      <WaveDivider from="#2C2A25" to="#2C2A25" type="wave" />
      <Team />
      <WaveDivider from="#2C2A25" to="#3A3830" type="gentle" />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}
