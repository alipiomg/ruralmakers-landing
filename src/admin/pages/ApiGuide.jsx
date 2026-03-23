import { useState } from 'react'

const sections = [
  'gemini',
  'higgsfield',
  'imagenes',
  'videos',
  'recursos',
]

function Accordion({ id, title, icon, openId, setOpenId, children }) {
  const isOpen = openId === id
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpenId(isOpen ? null : id)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
      >
        <div className="px-4 pb-5 pt-1 border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  )
}

function StepList({ steps }) {
  return (
    <ol className="space-y-2 mt-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rural-green text-white text-xs font-bold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <span className="text-sm text-gray-700">{step}</span>
        </li>
      ))}
    </ol>
  )
}

function WarningBox({ children }) {
  return (
    <div className="mt-4 p-4 bg-amber-50 border border-amber-300 rounded-lg">
      <div className="flex gap-2 items-start">
        <span className="text-amber-600 text-lg flex-shrink-0">&#9888;</span>
        <div className="text-sm text-amber-800 space-y-2">{children}</div>
      </div>
    </div>
  )
}

function CodeBlock({ children }) {
  return (
    <div className="mt-3 bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
      {children}
    </div>
  )
}

function DataTable({ headers, rows }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-rural-green text-white">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2 text-left font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 text-gray-700 border-t border-gray-100">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ExternalLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-rural-green hover:text-rural-green-dark underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  )
}

function LinkCard({ href, title, description, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 border border-gray-200 rounded-lg hover:border-rural-green hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="font-medium text-rural-green group-hover:text-rural-green-dark transition-colors">{title}</div>
          <div className="text-xs text-gray-500 mt-0.5">{description}</div>
        </div>
      </div>
    </a>
  )
}

function SectionTitle({ children }) {
  return <h4 className="text-base font-semibold text-gray-800 mt-5 mb-2">{children}</h4>
}

function BulletList({ items }) {
  return (
    <ul className="space-y-1.5 mt-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 items-start text-sm text-gray-700">
          <span className="text-rural-green mt-1">&#8226;</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────

export default function ApiGuide() {
  const [openId, setOpenId] = useState('gemini')

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="card bg-gradient-to-r from-rural-green to-rural-green-dark text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Guia de APIs - Generacion de Imagenes y Videos</h2>
            <p className="text-sm opacity-90 mt-1">
              Manual completo para configurar y usar las APIs de generacion de contenido IA
            </p>
          </div>
          <a
            href="https://ai.google.dev/gemini-api/docs?hl=es-419"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition flex-shrink-0 text-center"
          >
            Documentacion Gemini
          </a>
        </div>
      </div>

      {/* ── Section 1: Google Gemini ───────────────────────── */}
      <Accordion
        id="gemini"
        title="Google Gemini API (Nano Banana Pro)"
        icon="&#129302;"
        openId={openId}
        setOpenId={setOpenId}
      >
        <SectionTitle>Como obtener tu API Key</SectionTitle>
        <StepList steps={[
          <>Ve a <ExternalLink href="https://aistudio.google.com/apikey">aistudio.google.com/apikey</ExternalLink></>,
          'Inicia sesion con tu cuenta de Google',
          'Clic en "Create API Key"',
          'Selecciona o crea un proyecto de Google Cloud (gratis)',
          'Copia la key generada (formato: AIzaSy...)',
          <>Pegala en el archivo <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-gray-800">.env</code> como <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-gray-800">VITE_GEMINI_API_KEY</code></>,
        ]} />

        <WarningBox>
          <p className="font-semibold">IMPORTANTE - Posibles problemas:</p>
          <p>
            Si al acceder a Google AI Studio te redirige a una pagina de "Regiones disponibles",
            significa que tu cuenta de Google tiene restricciones regionales o de verificacion de edad.
          </p>
          <p className="font-medium mt-1">Soluciones:</p>
          <ol className="list-decimal list-inside space-y-1 ml-1">
            <li>Prueba con otra cuenta de Google</li>
            <li>Verifica tu edad en la configuracion de tu cuenta</li>
            <li>Usa una VPN a un pais compatible (EEUU, UK, etc.)</li>
          </ol>
          <p className="mt-2">
            <ExternalLink href="https://ai.google.dev/gemini-api/docs/available-regions?hl=es-419">
              Ver regiones disponibles
            </ExternalLink>
          </p>
        </WarningBox>

        <SectionTitle>Plan gratuito - Limites</SectionTitle>
        <DataTable
          headers={['Modelo', 'Uso gratuito', 'Velocidad']}
          rows={[
            ['Nano Banana Flash (gemini-2.5-flash-image)', '~500 imagenes/dia', 'Rapido'],
            ['Nano Banana 3.1 Flash (gemini-3.1-flash-image-preview)', '~500 imagenes/dia', 'Rapido'],
            ['Nano Banana Pro (gemini-3-pro-image-preview)', '~3 imagenes/dia', 'Lento, alta calidad'],
            ['Veo 3.1 (video)', 'Limitado', '1-3 min generacion'],
          ]}
        />
      </Accordion>

      {/* ── Section 2: Higgsfield ──────────────────────────── */}
      <Accordion
        id="higgsfield"
        title="Higgsfield API"
        icon="&#127916;"
        openId={openId}
        setOpenId={setOpenId}
      >
        <SectionTitle>Como obtener tu API Key</SectionTitle>
        <StepList steps={[
          <>Ve a <ExternalLink href="https://cloud.higgsfield.ai">cloud.higgsfield.ai</ExternalLink></>,
          'Crea una cuenta o inicia sesion',
          'Ve a Dashboard > API Keys',
          'Crea una nueva API key',
          'Copia el Key ID y el Key Secret',
          <>Pegalos en <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-gray-800">.env</code> como <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-gray-800">VITE_HIGGSFIELD_API_KEY_ID</code> y <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-gray-800">VITE_HIGGSFIELD_API_SECRET</code></>,
        ]} />

        <SectionTitle>Modelos disponibles</SectionTitle>
        <BulletList items={[
          'Flux Pro / Kontext Max - Generacion de imagenes desde texto',
          'DoP / DoP Turbo - Generacion de video desde imagen',
        ]} />
      </Accordion>

      {/* ── Section 3: Manual - Imagenes ───────────────────── */}
      <Accordion
        id="imagenes"
        title="Manual de uso - Generacion de Imagenes"
        icon="&#128444;"
        openId={openId}
        setOpenId={setOpenId}
      >
        <SectionTitle>Flujo basico</SectionTitle>
        <StepList steps={[
          'Escribes un prompt descriptivo (mejor en ingles)',
          'Eliges modelo y aspect ratio',
          'La API genera la imagen (15-30 segundos)',
          'Recibes la imagen en base64',
          'Se muestra en el admin y se guarda en galeria',
        ]} />

        <SectionTitle>Tips para mejores prompts</SectionTitle>
        <BulletList items={[
          'Usa ingles para mejores resultados',
          'Se descriptivo: "A cinematic wide shot of..." en vez de "landscape"',
          'Especifica estilo: "photorealistic", "oil painting", "watercolor"',
          'Incluye iluminacion: "golden hour", "dramatic lighting", "soft diffused light"',
          'Anade composicion: "rule of thirds", "leading lines", "aerial view"',
        ]} />

        <SectionTitle>Ejemplo de prompt para Rural Makers</SectionTitle>
        <CodeBlock>
{`Breathtaking panoramic photograph of Leon province Spain
at golden hour. Misty green valleys, traditional stone
village with red tile roofs, wildflowers in foreground,
Cantabrian mountains in background. National Geographic
photography style. --ar 16:9`}
        </CodeBlock>
      </Accordion>

      {/* ── Section 4: Manual - Videos ─────────────────────── */}
      <Accordion
        id="videos"
        title="Manual de uso - Generacion de Videos"
        icon="&#127910;"
        openId={openId}
        setOpenId={setOpenId}
      >
        <SectionTitle>Flujo</SectionTitle>
        <StepList steps={[
          'Necesitas una imagen base (generada o subida)',
          'Describes la animacion deseada',
          'Eliges modelo de video y parametros',
          'La API genera el video (1-5 minutos)',
          'Se descarga y se muestra en galeria',
        ]} />

        <SectionTitle>Parametros de video</SectionTitle>
        <DataTable
          headers={['Parametro', 'Opciones']}
          rows={[
            ['Duracion', '4s, 6s, 8s'],
            ['Resolucion', '720p, 1080p, 4K'],
            ['Aspect Ratio', '16:9, 9:16'],
          ]}
        />

        <SectionTitle>Tips para video</SectionTitle>
        <BulletList items={[
          'Imagenes con composiciones claras funcionan mejor',
          'Prompts de animacion: describe el movimiento, no la escena',
          'Ejemplo: "Slow camera dolly forward, clouds moving gently, birds flying"',
          'Evita movimientos bruscos en el prompt',
        ]} />
      </Accordion>

      {/* ── Section 5: Links y Recursos ────────────────────── */}
      <Accordion
        id="recursos"
        title="Links y Recursos"
        icon="&#128279;"
        openId={openId}
        setOpenId={setOpenId}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <LinkCard
            href="https://ai.google.dev/gemini-api/docs?hl=es-419"
            title="Documentacion Gemini API"
            description="Guia oficial de Google para la API de Gemini"
            icon="&#128214;"
          />
          <LinkCard
            href="https://aistudio.google.com"
            title="Google AI Studio"
            description="Playground para probar modelos de Gemini"
            icon="&#128300;"
          />
          <LinkCard
            href="https://aistudio.google.com/apikey"
            title="Obtener API Key"
            description="Crear o gestionar tus API keys de Gemini"
            icon="&#128273;"
          />
          <LinkCard
            href="https://ai.google.dev/gemini-api/docs/available-regions?hl=es-419"
            title="Regiones disponibles"
            description="Paises y regiones con acceso a Gemini API"
            icon="&#127758;"
          />
          <LinkCard
            href="https://ai.google.dev/gemini-api/docs/rate-limits"
            title="Rate Limits"
            description="Limites de uso por modelo y plan"
            icon="&#9889;"
          />
          <LinkCard
            href="https://cloud.higgsfield.ai"
            title="Higgsfield Cloud"
            description="Panel de control y API keys de Higgsfield"
            icon="&#127916;"
          />
          <LinkCard
            href="https://github.com/higgsfield-ai/higgsfield-js"
            title="Higgsfield JS SDK"
            description="SDK de JavaScript para integracion con Higgsfield"
            icon="&#128187;"
          />
        </div>
      </Accordion>
    </div>
  )
}
