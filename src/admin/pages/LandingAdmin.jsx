import { useState, useRef } from 'react'
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'

const defaultConfig = {
  // Hero
  heroTitle: 'Tejemos futuro rural con',
  heroSubtitle: 'App de codigo abierto y red humana que conecta personas, proyectos y territorios rurales con la tradicion de las facenderas.',
  heroBgVideo: 'https://cdn.pixabay.com/video/2020/07/30/45717-445039937_large.mp4',
  heroPosterImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=60',
  heroCampaignVideo: '',
  heroCampaignVideoType: 'youtube',
  heroTags: 'Facenderas,IA Etica,Codigo Abierto,Procomun,Leon,Artesania,Saberes,Territorio',
  // About
  aboutTitle: 'Tu plataforma de cooperacion rural',
  aboutText1: 'Rural Makers Tejiendo Facenderas es un proyecto de impacto social que rescata la tradicion de las facenderas — trabajo colectivo y solidario — y la combina con tecnologia de codigo abierto e inteligencia artificial etica.',
  aboutText2: 'La campana busca financiar una app colaborativa que conecte personas, proyectos y saberes en el mundo rural de Leon y mas alla.',
  aboutText3: 'Impulsada por la comunidad Rural Makers y el Fab Lab Leon. Un proyecto de codigo abierto, licencia libre y retorno colectivo.',
  // Problem
  problemTitle: 'El mundo rural necesita una nueva red',
  problemQuote: 'Lo que afecta al campo acaba afectando a todos. La solucion tambien puede ser de todos.',
  problemItems: 'Despoblamiento acelerado de pueblos y aldeas|Iniciativas aisladas sin red de apoyo mutuo|Saberes tradicionales que se pierden sin documentar|Brecha digital que excluye al mundo rural|Proyectos valiosos que no despegan solos',
  // Solution
  solutionTitle: 'La app que une el campo y la cooperacion',
  solutionSubtitle: 'Rural Makers combina la sabiduria colectiva de las facenderas con tecnologia de codigo abierto e inteligencia artificial etica.',
  solutionText: 'La app conecta personas con proyectos, facilita encuentros presenciales y documenta saberes en un mapa vivo. No es solo una plataforma digital: es una red humana que se activa con cada facendera y crece con cada persona que se une.',
  // Progress
  statFacenderas: '127',
  statParticipantes: '1234',
  statComunidades: '23',
  statProyectos: '89',
  // Testimonials
  testimonials: 'Aprendi a instalar paneles solares con 60 anos.|Maria Gonzalez|Agricultora, Astorga\nEncontre mi comunidad sin salir del pueblo.|Javier Prieto|Programador, Bembibre\nMis ceramicas ahora llegan a toda la provincia.|Carmen Alvarez|Artesana, El Bierzo\nLa tecnologia no tiene que ser enemiga de lo rural.|Pablo Martinez|Bioconstructor, Villablino',
  // Team
  teamName: 'Alipio',
  teamRole: 'Impulsor del proyecto',
  teamOrg: 'Asociacion Indira',
  teamBio: 'Mas de 25 anos construyendo alternativas: fundador de Ecoalternative y Certyetic, coordinador de redes de economia social. Experto en WordPress, IA y blockchain al servicio del bien comun.',
  teamQuote: 'Demostrar que la tecnologia puede ponerse al servicio de la cooperacion rural, uniendo tradicion e innovacion.',
  teamPhoto: '',
  teamVideo: 'https://youtu.be/11Ud97j7MpE',
  // CTA
  ctaTitle: 'Tu tambien puedes ser parte de esta red',
  ctaText: 'Cada euro cuenta. Cada persona que se suma activa la red. La campana dura 40 dias — si no llegamos al minimo, se devuelve todo.',
  // Visual
  logoUrl: '/logo-ruralmakers.png',
  primaryColor: '#6B9E50',
  accentColor: '#E86A33',
  goldColor: '#C8A96E',
}

// ─── SHARED COMPONENTS ──────────────────────────────────────────
function Field({ label, help, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block">{label}</label>
      {children}
      {help && <p className="text-xs text-gray-400">{help}</p>}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, multiline, rows = 3 }) {
  const cls = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-rural-green focus:outline-none focus:ring-2 focus:ring-rural-green/10 transition"
  return multiline
    ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} className={cls + " resize-y"} />
    : <input value={value} onChange={onChange} placeholder={placeholder} className={cls} />
}

function ImageUpload({ value, onChange, label }) {
  const fileRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onChange(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input value={value} onChange={e => onChange(e.target.value)} placeholder="URL de la imagen..."
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-rural-green focus:outline-none" />
        <button onClick={() => fileRef.current?.click()}
          className="px-4 py-2 bg-rural-green text-white rounded-lg text-sm font-medium hover:bg-rural-green-dark transition whitespace-nowrap">
          Subir archivo
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
      {value && (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
          <img src={value} alt={label} className="w-full h-32 object-cover" />
          <button onClick={() => onChange('')}
            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            x
          </button>
        </div>
      )}
    </div>
  )
}

function VideoUpload({ value, onChange }) {
  const fileRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onChange(url)
  }

  return (
    <div className="flex gap-2">
      <input value={value} onChange={e => onChange(e.target.value)} placeholder="URL del video MP4..."
        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-rural-green focus:outline-none" />
      <button onClick={() => fileRef.current?.click()}
        className="px-4 py-2 bg-rural-green text-white rounded-lg text-sm font-medium hover:bg-rural-green-dark transition whitespace-nowrap">
        Subir video
      </button>
      <input ref={fileRef} type="file" accept="video/mp4,video/webm" onChange={handleFile} className="hidden" />
    </div>
  )
}

function ColorInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input type="color" value={value} onChange={onChange} className="w-8 h-8 rounded border cursor-pointer" />
      <input value={value} onChange={onChange} className="w-24 px-2 py-1 border rounded text-xs font-mono" />
    </div>
  )
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

// ─── TABS CONTENT ───────────────────────────────────────────────
function HeroTab({ config, update }) {
  return (
    <div className="space-y-6">
      <SectionCard title="Contenido del Hero" icon="📝">
        <Field label="Titulo principal" help="Las palabras rotantes se anaden automaticamente despues del titulo.">
          <TextInput value={config.heroTitle} onChange={e => update('heroTitle', e.target.value)} />
        </Field>
        <Field label="Subtitulo">
          <TextInput value={config.heroSubtitle} onChange={e => update('heroSubtitle', e.target.value)} multiline rows={2} />
        </Field>
        <Field label="Tags (separados por coma)" help="Se muestran como pills debajo del subtitulo.">
          <TextInput value={config.heroTags} onChange={e => update('heroTags', e.target.value)} />
        </Field>
      </SectionCard>

      <SectionCard title="Video de Fondo (Ambiente)" icon="🎬">
        <Field label="Video MP4 de fondo" help="Se reproduce en loop al 30% de opacidad con efecto parallax.">
          <VideoUpload value={config.heroBgVideo} onChange={v => update('heroBgVideo', v)} />
        </Field>
        <Field label="Imagen de precarga (poster)" help="Se muestra mientras el video carga. Lazy loading.">
          <ImageUpload value={config.heroPosterImage} onChange={v => update('heroPosterImage', v)} label="Poster" />
        </Field>
      </SectionCard>

      <SectionCard title="Video de Campana (Embebido)" icon="📹">
        <Field label="Tipo de video">
          <select value={config.heroCampaignVideoType} onChange={e => update('heroCampaignVideoType', e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white w-full">
            <option value="youtube">YouTube</option>
            <option value="vimeo">Vimeo</option>
            <option value="mp4">MP4 directo</option>
          </select>
        </Field>
        <Field label="URL o ID del video" help={
          config.heroCampaignVideoType === 'youtube' ? 'Solo el ID (ej: dQw4w9WgXcQ), no la URL completa.' :
          config.heroCampaignVideoType === 'vimeo' ? 'Solo el ID numerico de Vimeo.' : 'URL directa al MP4.'
        }>
          <TextInput value={config.heroCampaignVideo} onChange={e => update('heroCampaignVideo', e.target.value)} />
        </Field>
        {!config.heroCampaignVideo && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-700 font-medium">El video de campana es obligatorio en Goteo (max 4 min). Pega aqui el ID cuando lo tengas.</p>
          </div>
        )}
      </SectionCard>
    </div>
  )
}

function AboutTab({ config, update }) {
  return (
    <div className="space-y-6">
      <SectionCard title='Seccion "Que es Rural Makers"' icon="📖">
        <Field label="Titulo"><TextInput value={config.aboutTitle} onChange={e => update('aboutTitle', e.target.value)} /></Field>
        <Field label="Parrafo 1"><TextInput value={config.aboutText1} onChange={e => update('aboutText1', e.target.value)} multiline /></Field>
        <Field label="Parrafo 2"><TextInput value={config.aboutText2} onChange={e => update('aboutText2', e.target.value)} multiline /></Field>
        <Field label="Parrafo 3"><TextInput value={config.aboutText3} onChange={e => update('aboutText3', e.target.value)} multiline /></Field>
      </SectionCard>
    </div>
  )
}

function ProblemTab({ config, update }) {
  return (
    <div className="space-y-6">
      <SectionCard title='Seccion "El Problema"' icon="🏚">
        <Field label="Titulo"><TextInput value={config.problemTitle} onChange={e => update('problemTitle', e.target.value)} /></Field>
        <Field label="Cita destacada"><TextInput value={config.problemQuote} onChange={e => update('problemQuote', e.target.value)} multiline rows={2} /></Field>
        <Field label="Problemas (uno por linea, separados con |)" help="Se muestran como tarjetas con iconos.">
          <TextInput value={config.problemItems} onChange={e => update('problemItems', e.target.value)} multiline rows={5} />
        </Field>
      </SectionCard>
    </div>
  )
}

function SolutionTab({ config, update }) {
  return (
    <div className="space-y-6">
      <SectionCard title='Seccion "La Solucion"' icon="💡">
        <Field label="Titulo"><TextInput value={config.solutionTitle} onChange={e => update('solutionTitle', e.target.value)} /></Field>
        <Field label="Subtitulo"><TextInput value={config.solutionSubtitle} onChange={e => update('solutionSubtitle', e.target.value)} multiline rows={2} /></Field>
        <Field label="Texto principal"><TextInput value={config.solutionText} onChange={e => update('solutionText', e.target.value)} multiline /></Field>
      </SectionCard>
    </div>
  )
}

function StatsTab({ config, update }) {
  return (
    <div className="space-y-6">
      <SectionCard title="Estadisticas / Impacto" icon="📊">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Facenderas realizadas"><TextInput value={config.statFacenderas} onChange={e => update('statFacenderas', e.target.value)} /></Field>
          <Field label="Participantes activos"><TextInput value={config.statParticipantes} onChange={e => update('statParticipantes', e.target.value)} /></Field>
          <Field label="Comunidades conectadas"><TextInput value={config.statComunidades} onChange={e => update('statComunidades', e.target.value)} /></Field>
          <Field label="Proyectos completados"><TextInput value={config.statProyectos} onChange={e => update('statProyectos', e.target.value)} /></Field>
        </div>
      </SectionCard>
    </div>
  )
}

function TestimonialsTab({ config, update }) {
  return (
    <div className="space-y-6">
      <SectionCard title="Testimonios" icon="💬">
        <Field label="Testimonios" help="Formato: cita|nombre|rol (un testimonio por linea). Ejemplo: Mi vida cambio.|Maria|Agricultora">
          <TextInput value={config.testimonials} onChange={e => update('testimonials', e.target.value)} multiline rows={8} />
        </Field>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 font-semibold mb-2">Preview:</div>
          {config.testimonials.split('\n').filter(Boolean).map((line, i) => {
            const parts = line.split('|')
            return (
              <div key={i} className="border-l-2 border-rural-green pl-3 py-1 mb-2 text-sm">
                <p className="text-gray-700 italic">"{parts[0]}"</p>
                <p className="text-xs text-gray-500 mt-0.5">{parts[1]} - {parts[2]}</p>
              </div>
            )
          })}
        </div>
      </SectionCard>
    </div>
  )
}

function TeamTab({ config, update }) {
  return (
    <div className="space-y-6">
      <SectionCard title="Equipo" icon="👥">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nombre"><TextInput value={config.teamName} onChange={e => update('teamName', e.target.value)} /></Field>
          <Field label="Rol"><TextInput value={config.teamRole} onChange={e => update('teamRole', e.target.value)} /></Field>
        </div>
        <Field label="Organizacion"><TextInput value={config.teamOrg} onChange={e => update('teamOrg', e.target.value)} /></Field>
        <Field label="Bio"><TextInput value={config.teamBio} onChange={e => update('teamBio', e.target.value)} multiline /></Field>
        <Field label="Cita / Motivacion"><TextInput value={config.teamQuote} onChange={e => update('teamQuote', e.target.value)} multiline rows={2} /></Field>
      </SectionCard>

      <SectionCard title="Foto del impulsor" icon="📸">
        <Field label="Foto de perfil" help="Se muestra en la seccion de equipo junto a la bio. Si no hay foto, se muestra una inicial.">
          <ImageUpload value={config.teamPhoto} onChange={v => update('teamPhoto', v)} label="Foto Alipio" />
        </Field>
      </SectionCard>

      <SectionCard title="Video destacado" icon="🎥">
        <Field label="Video de YouTube (URL o ID)" help="Se muestra embebido debajo del perfil. Ejemplo: CowoCyL — Lugar de Sinergias.">
          <TextInput value={config.teamVideo} onChange={e => update('teamVideo', e.target.value)} placeholder="https://youtu.be/11Ud97j7MpE" />
        </Field>
        {config.teamVideo && (
          <div className="rounded-lg overflow-hidden bg-gray-100 aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${(() => {
                const v = config.teamVideo
                const match = v.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&/]+)/)
                return match ? match[1] : v
              })()}?rel=0`}
              className="w-full h-full"
              allow="encrypted-media"
              allowFullScreen
              title="Preview video"
            />
          </div>
        )}
      </SectionCard>
    </div>
  )
}

function CTATab({ config, update }) {
  return (
    <div className="space-y-6">
      <SectionCard title="Llamada a la Accion Final" icon="🎯">
        <Field label="Titulo"><TextInput value={config.ctaTitle} onChange={e => update('ctaTitle', e.target.value)} /></Field>
        <Field label="Texto"><TextInput value={config.ctaText} onChange={e => update('ctaText', e.target.value)} multiline /></Field>
      </SectionCard>
    </div>
  )
}

function VisualTab({ config, update, resetDefaults }) {
  return (
    <div className="space-y-6">
      <SectionCard title="Logo" icon="🖼">
        <Field label="Logo de la web">
          <ImageUpload value={config.logoUrl} onChange={v => update('logoUrl', v)} label="Logo" />
        </Field>
      </SectionCard>

      <SectionCard title="Colores" icon="🎨">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Verde principal"><ColorInput value={config.primaryColor} onChange={e => update('primaryColor', e.target.value)} /></Field>
          <Field label="Coral acento"><ColorInput value={config.accentColor} onChange={e => update('accentColor', e.target.value)} /></Field>
          <Field label="Dorado"><ColorInput value={config.goldColor} onChange={e => update('goldColor', e.target.value)} /></Field>
        </div>
      </SectionCard>

      <div className="card bg-gray-50">
        <h3 className="font-semibold text-gray-800 mb-3">Acciones</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={resetDefaults}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition font-medium">
            Restaurar defaults
          </button>
          <button onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(config, null, 2))
            alert('Config copiada al portapapeles')
          }}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition">
            Exportar JSON
          </button>
          <button onClick={() => {
            const input = prompt('Pega el JSON de configuracion:')
            if (input) try { const parsed = JSON.parse(input); update('_bulk', parsed) } catch { alert('JSON invalido') }
          }}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition">
            Importar JSON
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ───────────────────────────────────────────────────────
export default function LandingAdmin() {
  const [config, setConfig] = useLocalStorage('rm-landing-config', defaultConfig)
  const [activeTab, setActiveTab] = useState('hero')
  const [saved, setSaved] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const update = (key, value) => {
    if (key === '_bulk') {
      setConfig(prev => ({ ...prev, ...value }))
    } else {
      setConfig(prev => ({ ...prev, [key]: value }))
    }
    setHasChanges(true)
    setSaved(false)
  }

  const save = () => {
    setSaved(true)
    setHasChanges(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const resetDefaults = () => {
    if (confirm('Restaurar todos los valores por defecto? Se perderan los cambios.')) {
      setConfig(defaultConfig)
      setHasChanges(true)
    }
  }

  const tabs = [
    { id: 'hero', label: 'Hero', icon: '🏠' },
    { id: 'about', label: 'Que es', icon: '📖' },
    { id: 'problem', label: 'Problema', icon: '🏚' },
    { id: 'solution', label: 'Solucion', icon: '💡' },
    { id: 'stats', label: 'Impacto', icon: '📊' },
    { id: 'testimonials', label: 'Testimonios', icon: '💬' },
    { id: 'team', label: 'Equipo', icon: '👥' },
    { id: 'cta', label: 'CTA Final', icon: '🎯' },
    { id: 'visual', label: 'Visual', icon: '🎨' },
  ]

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="card bg-gradient-to-r from-rural-green to-rural-green-dark text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Administrar Landing</h2>
            <p className="text-sm opacity-90 mt-1">Gestiona todos los contenidos de la pagina de inicio</p>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition text-center font-medium">
            Ver Landing
          </a>
        </div>
      </div>

      {/* Section tabs - scrollable */}
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg min-w-max">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`tab-btn whitespace-nowrap flex items-center gap-1.5 ${activeTab === tab.id ? 'active' : ''}`}>
              <span className="text-sm">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'hero' && <HeroTab config={config} update={update} />}
      {activeTab === 'about' && <AboutTab config={config} update={update} />}
      {activeTab === 'problem' && <ProblemTab config={config} update={update} />}
      {activeTab === 'solution' && <SolutionTab config={config} update={update} />}
      {activeTab === 'stats' && <StatsTab config={config} update={update} />}
      {activeTab === 'testimonials' && <TestimonialsTab config={config} update={update} />}
      {activeTab === 'team' && <TeamTab config={config} update={update} />}
      {activeTab === 'cta' && <CTATab config={config} update={update} />}
      {activeTab === 'visual' && <VisualTab config={config} update={update} resetDefaults={resetDefaults} />}

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between z-40 shadow-lg shadow-black/5">
        <div className="flex items-center gap-2">
          {hasChanges && !saved && <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />}
          <span className="text-sm text-gray-500">
            {saved ? 'Cambios guardados' : hasChanges ? 'Cambios sin guardar' : 'Sin cambios'}
          </span>
        </div>
        <div className="flex gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition">
            Preview
          </a>
          <button onClick={save}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${saved ? 'bg-rural-green text-white' : hasChanges ? 'bg-rural-green text-white hover:bg-rural-green-dark shadow-md shadow-rural-green/20' : 'bg-gray-100 text-gray-400 cursor-default'}`}>
            {saved ? '✓ Guardado' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
