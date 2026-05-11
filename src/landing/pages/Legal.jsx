import { useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import PoliticaCookies, { meta as cookiesMeta } from '../legal/PoliticaCookies'
import PoliticaPrivacidad, { meta as privacidadMeta } from '../legal/PoliticaPrivacidad'
import AvisoLegal, { meta as avisoMeta } from '../legal/AvisoLegal'
import CondicionesUso, { meta as condicionesMeta } from '../legal/CondicionesUso'

const DOCS = [
  { ...cookiesMeta, Component: PoliticaCookies },
  { ...privacidadMeta, Component: PoliticaPrivacidad },
  { ...avisoMeta, Component: AvisoLegal },
  { ...condicionesMeta, Component: CondicionesUso },
]

// Crawlers a los que pedimos explícitamente NO indexar las páginas legales.
// LSSI obliga a publicarlas; nosotros las mantenemos accesibles para humanos
// pero invisibles para buscadores y LLMs.
const NOINDEX_BOTS = [
  'robots',
  'googlebot',
  'bingbot',
  'GPTBot',
  'ChatGPT-User',
  'Google-Extended',
  'CCBot',
  'anthropic-ai',
  'ClaudeBot',
  'PerplexityBot',
  'Applebot-Extended',
  'Bytespider',
]

// Etiquetas que queremos suprimir en /legal/* para evitar previsualización
// social y caché por crawlers cuando alguien pegue la URL en redes.
const OG_TWITTER_TAGS_TO_SUPPRESS = [
  'meta[property^="og:"]',
  'meta[name^="twitter:"]',
]

function useNoIndexHead(title) {
  useEffect(() => {
    const previousTitle = document.title
    const noindexValue = 'noindex, nofollow, noarchive, nosnippet, noimageindex'

    // 1) Inyectar meta robots para cada bot
    const inserted = []
    NOINDEX_BOTS.forEach((bot) => {
      const tag = document.createElement('meta')
      tag.setAttribute('name', bot)
      tag.setAttribute('content', noindexValue)
      tag.setAttribute('data-rm-legal-meta', 'true')
      document.head.appendChild(tag)
      inserted.push(tag)
    })

    // 2) Quitar OG / Twitter Cards mientras estemos en /legal/*
    const removed = []
    OG_TWITTER_TAGS_TO_SUPPRESS.forEach((selector) => {
      document.querySelectorAll(selector).forEach((node) => {
        removed.push({ node, parent: node.parentNode, next: node.nextSibling })
        node.parentNode.removeChild(node)
      })
    })

    // 3) Título de la pestaña + canonical noindex
    if (title) document.title = `${title} · Rural Makers`

    return () => {
      inserted.forEach((tag) => tag.parentNode?.removeChild(tag))
      removed.forEach(({ node, parent, next }) => {
        if (next && next.parentNode === parent) parent.insertBefore(node, next)
        else parent.appendChild(node)
      })
      document.title = previousTitle
    }
  }, [title])
}

export default function Legal() {
  const location = useLocation()
  const navigate = useNavigate()

  const activeIndex = useMemo(() => {
    const slug = location.pathname.replace(/^\/legal\/?/, '').split('/')[0]
    if (!slug) return 0
    const idx = DOCS.findIndex((d) => d.slug === slug)
    return idx >= 0 ? idx : 0
  }, [location.pathname])

  const active = DOCS[activeIndex]
  useNoIndexHead(active.title)

  const goToTab = (slug) => {
    navigate(`/legal/${slug}`, { replace: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="bg-[#2C2A25] min-h-screen pt-[120px] pb-24">
      <div className="max-w-[900px] mx-auto px-6 md:px-10">
        <header className="text-center mb-10">
          <p className="text-[10px] text-[#6B9E50] tracking-[0.25em] uppercase font-bold mb-3">Información legal</p>
          <h1 className="landing-heading text-[2rem] md:text-[2.6rem] text-[#F0EBE0]">{active.title}</h1>
          <div className="title-divider" />
          <p className="text-[12px] text-[#B0A898]/70 mt-4">
            Versión {active.version} · Actualizada el {active.updatedAt}
          </p>
        </header>

        <nav aria-label="Documentos legales" className="flex flex-wrap justify-center gap-2 mb-10 border-b border-white/10 pb-3">
          {DOCS.map((doc, i) => {
            const isActive = i === activeIndex
            return (
              <button
                key={doc.slug}
                onClick={() => goToTab(doc.slug)}
                className={`tab-btn-dark text-[12px] px-4 py-2 rounded-full transition ${
                  isActive
                    ? 'bg-[#6B9E50] text-white font-bold shadow-lg shadow-[#6B9E50]/20'
                    : 'bg-white/5 text-[#B0A898] hover:bg-white/10 hover:text-[#F0EBE0]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="mr-1.5" aria-hidden="true">{doc.icon}</span>
                {doc.title}
              </button>
            )
          })}
        </nav>

        <article className="prose-rural">
          <active.Component />
        </article>

        <footer className="mt-16 pt-6 border-t border-white/10 text-center">
          <p className="text-[12px] text-[#B0A898] leading-[1.7]">
            Para ejercer cualquier derecho relacionado con tus datos o resolver
            dudas legales, escríbenos a{' '}
            <a href="mailto:hola@ruralmakers.net" className="text-[#6B9E50] underline underline-offset-2 hover:text-[#8BC06A]">
              hola@ruralmakers.net
            </a>
            .
          </p>
          <Link to="/" className="inline-block mt-4 text-[12px] text-[#6B9E50] hover:text-[#8BC06A] transition">
            ← Volver al inicio
          </Link>
        </footer>
      </div>
    </main>
  )
}
