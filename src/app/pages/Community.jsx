import { Link } from 'react-router-dom'
import { users, globalStats } from '../data/mockData'

export default function Community() {
  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Comunidad Rural Makers</h1>
        <p className="text-sm text-gray-500">Conectamos personas, proyectos y saberes para construir un futuro rural prospero y sostenible</p>
        <Link to="/app/grupos" className="inline-block px-4 py-2 bg-rural-green text-white text-sm rounded-lg mt-2">
          Ver Grupos de Organizacion
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="card text-center p-3">
          <div className="text-lg font-bold text-rural-green">{globalStats.miembrosConectados.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Miembros</div>
        </div>
        <div className="card text-center p-3">
          <div className="text-lg font-bold text-blue-600">{globalStats.proyectosCompletados}</div>
          <div className="text-xs text-gray-500">Proyectos</div>
        </div>
        <div className="card text-center p-3">
          <div className="text-lg font-bold text-amber-600">{globalStats.facenderasRealizadas}</div>
          <div className="text-xs text-gray-500">Facenderas</div>
        </div>
        <div className="card text-center p-3">
          <div className="text-lg font-bold text-purple-600">{globalStats.comunidadesConectadas}</div>
          <div className="text-xs text-gray-500">Municipios</div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-3 gap-3">
        <Link to="/app/proyectos" className="card p-3 text-center hover:shadow-md transition">
          <div className="text-2xl mb-1">🏗</div>
          <div className="text-xs font-semibold text-gray-800">Proyectos Destacados</div>
          <div className="text-xs text-gray-500 mt-0.5">Iniciativas que transforman</div>
          <div className="text-xs text-rural-green font-medium mt-1">Ver Proyectos</div>
        </Link>
        <Link to="/app/facenderas" className="card p-3 text-center hover:shadow-md transition">
          <div className="text-2xl mb-1">🤝</div>
          <div className="text-xs font-semibold text-gray-800">Facenderas</div>
          <div className="text-xs text-gray-500 mt-0.5">Trabajo colaborativo</div>
          <div className="text-xs text-rural-green font-medium mt-1">Unirse</div>
        </Link>
        <Link to="/app/recursos" className="card p-3 text-center hover:shadow-md transition">
          <div className="text-2xl mb-1">📚</div>
          <div className="text-xs font-semibold text-gray-800">Centro de Recursos</div>
          <div className="text-xs text-gray-500 mt-0.5">Herramientas y guias</div>
          <div className="text-xs text-rural-green font-medium mt-1">Explorar</div>
        </Link>
      </div>

      {/* Members */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 text-center mb-4">Miembros de la Comunidad</h2>
        <div className="grid grid-cols-2 gap-3">
          {users.map(u => (
            <div key={u.id} className="card p-3 text-center relative">
              <div className="w-14 h-14 mx-auto bg-rural-green/10 text-rural-green rounded-full flex items-center justify-center text-xl font-bold mb-2 relative">
                {u.name[0]}
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${u.online ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
              <div className="font-semibold text-sm text-gray-800">{u.name}</div>
              <div className="text-xs text-gray-500">{u.location}</div>
              <div className="text-xs text-rural-green font-medium mt-1">{u.specialty}</div>
              <div className="text-xs text-gray-400">{u.metric}</div>
              <button className="mt-2 px-3 py-1 bg-rural-green text-white text-xs rounded-lg w-full">Conectar</button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="card p-3">
          <div className="text-xl font-bold text-rural-green">{globalStats.miembrosConectados.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Miembros Conectados</div>
        </div>
        <div className="card p-3">
          <div className="text-xl font-bold text-blue-600">{globalStats.conexionesActivas}</div>
          <div className="text-xs text-gray-500">Conexiones Activas</div>
        </div>
        <div className="card p-3">
          <div className="text-xl font-bold text-amber-600">{globalStats.gruposColaborativos}</div>
          <div className="text-xs text-gray-500">Grupos Colaborativos</div>
        </div>
      </div>

      {/* CTA */}
      <div className="card p-6 text-center space-y-3 bg-rural-green/5">
        <h3 className="text-lg font-bold text-gray-900">Listo para formar parte del cambio rural?</h3>
        <p className="text-sm text-gray-500">Unete a nuestra comunidad y contribuye al desarrollo sostenible</p>
        <div className="flex gap-3 justify-center">
          <button className="px-5 py-2.5 bg-rural-green text-white text-sm rounded-lg font-medium">Crear Cuenta</button>
          <Link to="/app/grupos" className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-lg font-medium">Explorar Grupos</Link>
        </div>
      </div>
    </div>
  )
}
