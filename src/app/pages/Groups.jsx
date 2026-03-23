import { useState } from 'react'
import { groupsLocales, groupsTroncales, principios } from '../data/mockData'

const statusLabels = { activo: 'Activo', en_expansion: 'En expansion', recien_formado: 'Recien formado' }
const statusColors = { activo: 'bg-green-100 text-green-700', en_expansion: 'bg-blue-100 text-blue-700', recien_formado: 'bg-amber-100 text-amber-700' }

export default function Groups() {
  const [tab, setTab] = useState('locales')

  return (
    <div className="space-y-0">
      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 pb-8">
        <h1 className="text-2xl font-bold mb-4">Grupos de Organizacion de Facenderas</h1>
        <p className="text-sm text-gray-300 mb-3">
          En los pueblos, la vecindad siempre se ha reunido para echar una mano y sacar adelante lo comun:
          arreglar caminos, limpiar fuentes, atender la huerta o levantar un tejado entre todos.
        </p>
        <p className="text-sm text-gray-300 mb-3">
          Aunque hoy muchas de esas tareas parecen cosa de las administraciones, en RuralMakers queremos
          recuperar la autogestion y la cooperacion tradicional, reencontrandonos para aprender, compartir y hacer junt@s.
        </p>
        <p className="text-sm text-rural-earth font-medium italic">
          Las facenderas son la practica viva del apoyo mutuo, donde cada persona puede sumar conocimientos, manos y corazon.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 p-4 bg-rural-cream">
        <button onClick={() => setTab('locales')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition ${tab === 'locales' ? 'bg-rural-green text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
          Grupos Locales
        </button>
        <button onClick={() => setTab('troncales')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition ${tab === 'troncales' ? 'bg-rural-green text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Grupos Troncales
        </button>
      </div>

      <div className="p-4 space-y-4">
        {tab === 'locales' && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Grupos Locales por Comarca</h2>
              <p className="text-sm text-gray-600 mt-1">
                Comunidades territoriales organizadas por comarca, municipio o pueblo.
                Cada grupo trabaja en su territorio recuperando espacios y tradiciones.
              </p>
            </div>

            {groupsLocales.map(group => (
              <div key={group.id} className="card border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{group.name}</h3>
                    <span className="text-xs text-gray-500">{group.comarca}</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${statusColors[group.status]}`}>
                    {statusLabels[group.status]}
                  </span>
                </div>

                <div className="flex gap-4 text-sm text-gray-600">
                  <span>{group.members} miembros</span>
                  <span>{group.facenderasCount} facenderas</span>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">{group.description}</p>

                {group.proximasFacenderas.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Proximas Facenderas
                    </h4>
                    {group.proximasFacenderas.map((f, i) => (
                      <div key={i} className="text-xs text-gray-600">
                        <span className="font-semibold text-gray-800">{f.date}:</span> {f.title}
                      </div>
                    ))}
                  </div>
                )}

                {group.testimonio && (
                  <div className="bg-rural-green/5 rounded-lg p-3 text-xs text-gray-600 italic border-l-2 border-rural-green">
                    {group.testimonio.author}: "{group.testimonio.text}"
                  </div>
                )}

                <button className="w-full py-2.5 bg-rural-green text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                  Contactar Grupo
                </button>
              </div>
            ))}
          </>
        )}

        {tab === 'troncales' && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Grupos Troncales Tematicos</h2>
              <p className="text-sm text-gray-600 mt-1">
                Grupos organizados por tematica que conectan personas de toda la provincia con intereses comunes.
              </p>
            </div>

            {groupsTroncales.map(group => (
              <div key={group.id} className="card border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-rural-green/10 rounded-full flex items-center justify-center text-rural-green font-bold text-lg shrink-0">
                  {group.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{group.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[group.status]}`}>
                      {statusLabels[group.status]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{group.theme}</p>
                  <div className="flex gap-3 text-xs text-gray-400 mt-1">
                    <span>{group.members} miembros</span>
                    <span>{group.facenderasCount} facenderas</span>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-rural-green text-white text-xs rounded-lg shrink-0">Unirse</button>
              </div>
            ))}
          </>
        )}

        {/* CTA Proponer */}
        <div className="bg-rural-green rounded-xl p-6 text-white text-center space-y-4">
          <h3 className="text-xl font-bold">No ves tu comarca, municipio o tematica?</h3>
          <p className="text-sm opacity-90">
            Propon la creacion de un nuevo grupo aqui y sumate a la comunidad RuralMakers,
            donde el hacer colectivo es la base del cambio rural.
          </p>

          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Principios y Valores RuralMakers</h4>
            <div className="grid grid-cols-2 gap-3">
              {principios.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-lg">{p.icon}</span>
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs opacity-80">{p.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="px-6 py-3 bg-white text-rural-green rounded-lg font-medium flex items-center gap-2 mx-auto">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Proponer Nuevo Grupo
          </button>
        </div>
      </div>
    </div>
  )
}
