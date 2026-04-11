import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { redes, redesCategorias } from '../data/mockData'

export default function RedDetail() {
  const { slug } = useParams()
  const red = redes.find(r => r.slug === slug)
  const [joined, setJoined] = useState(false)

  if (!red) {
    return (
      <div className="p-6 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <h2 className="font-bold text-lg text-gray-800">Red no encontrada</h2>
        <Link to="/app/grupos" className="text-sm text-rural-green mt-2 inline-block">← Volver a Redes</Link>
      </div>
    )
  }

  const catInfo = redesCategorias.find(c => c.id === red.categoria)

  return (
    <div className="space-y-0">
      {/* Hero image */}
      <div className="relative h-48 overflow-hidden">
        <img src={red.imagen} alt={red.nombre} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${red.color}DD, ${red.color}44, transparent)` }} />
        {/* Back button */}
        <Link to="/app/grupos" className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        {/* Title */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-black/30 backdrop-blur-sm">
              {catInfo?.icono} {red.categoria}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${red.estado === 'activa' ? 'bg-green-500/90 text-white' : 'bg-amber-500/90 text-white'}`}>
              {red.estado === 'activa' ? 'Activa' : 'En formación'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{red.icono}</span>
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">{red.nombre}</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Stats + Join */}
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-xl font-bold" style={{ color: red.color }}>{joined ? red.miembros + 1 : red.miembros}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">miembros</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold" style={{ color: red.color }}>{red.facenderasCount}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">facenderas</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold" style={{ color: red.color }}>{red.subRedes.length}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">sub-redes</div>
            </div>
          </div>
          <button onClick={() => setJoined(!joined)}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition ${joined ? 'bg-gray-200 text-gray-600' : 'text-white shadow-lg'}`}
            style={joined ? {} : { backgroundColor: red.color, boxShadow: `0 4px 14px ${red.color}40` }}>
            {joined ? '✓ Unido' : 'Unirme'}
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 leading-relaxed">{red.descripcion}</p>

        {/* Sub-redes */}
        <div>
          <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full" style={{ background: red.color }} />
            Especialidades
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {red.subRedes.map((sr, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ backgroundColor: red.color }}>
                  {sr.nombre[0]}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">{sr.nombre}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{sr.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Próximas facenderas */}
        {red.proximasFacenderas.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full" style={{ background: red.color }} />
              Próximas Facenderas
            </h3>
            <div className="space-y-2">
              {red.proximasFacenderas.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{f.titulo}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{f.fecha}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold" style={{ color: red.color }}>{f.participantes} inscritos</div>
                    <button className="text-[10px] font-bold mt-1 px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: red.color }}>
                      Apuntarme
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/app/facenderas/crear"
              className="flex items-center justify-center gap-2 mt-3 py-2.5 rounded-lg border-2 border-dashed text-sm font-medium transition hover:bg-gray-50"
              style={{ borderColor: `${red.color}40`, color: red.color }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Proponer facendera para esta red
            </Link>
          </div>
        )}

        {/* Recursos */}
        {red.recursos.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full" style={{ background: red.color }} />
              Recursos
            </h3>
            <div className="space-y-2">
              {red.recursos.map((r, i) => {
                const tipoIconos = { guía: '📖', proyecto: '💻', vídeo: '🎬', mapa: '🗺', archivo: '📁' }
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white">
                    <span className="text-lg">{tipoIconos[r.tipo] || '📄'}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm">{r.titulo}</h4>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">{r.tipo}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Miembros preview */}
        <div>
          <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full" style={{ background: red.color }} />
            Miembros ({joined ? red.miembros + 1 : red.miembros})
          </h3>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(joined ? red.miembros + 1 : red.miembros, 8) }).map((_, i) => (
              <div key={i} className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white -ml-1 first:ml-0 border-2 border-white"
                style={{ backgroundColor: `${red.color}${90 - i * 10}`, zIndex: 10 - i }}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            {(joined ? red.miembros + 1 : red.miembros) > 8 && (
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 -ml-1 border-2 border-white">
                +{(joined ? red.miembros + 1 : red.miembros) - 8}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
