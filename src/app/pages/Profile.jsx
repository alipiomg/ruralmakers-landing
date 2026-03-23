import { Link } from 'react-router-dom'
import { currentUser, badges, levels, facenderas } from '../data/mockData'

export default function Profile() {
  const userLevel = levels.find(l => l.level === currentUser.level)
  const xpProgress = userLevel
    ? ((currentUser.xp - userLevel.xpMin) / (userLevel.xpMax - userLevel.xpMin)) * 100
    : 0

  const completedFacenderas = facenderas.filter(
    f => f.status === 'completada' && f.participants.includes(currentUser.id)
  )

  const initials = currentUser.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Profile Header */}
      <div className="card text-center">
        <div className="w-20 h-20 rounded-full bg-rural-green text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3">
          {initials}
        </div>
        <h1 className="text-xl font-bold text-gray-800">{currentUser.name}</h1>
        <p className="text-sm text-rural-earth font-medium">{currentUser.location}</p>
        <p className="text-sm text-gray-500 mt-2">{currentUser.bio}</p>
        <Link
          to="/app/perfil/editar"
          className="inline-block mt-3 text-sm text-rural-green font-medium hover:underline"
        >
          Editar perfil
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center py-3">
          <div className="text-2xl font-bold text-rural-green">{currentUser.facenderasCount}</div>
          <div className="text-xs text-gray-500">Facenderas</div>
        </div>
        <div className="card text-center py-3">
          <div className="text-2xl font-bold text-rural-green">{currentUser.badges.length}</div>
          <div className="text-xs text-gray-500">Badges</div>
        </div>
        <div className="card text-center py-3">
          <div className="text-2xl font-bold text-rural-green">{currentUser.level}</div>
          <div className="text-xs text-gray-500">Nivel</div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{userLevel?.icon}</span>
            <span className="font-bold text-gray-800">Nivel {currentUser.level}: {currentUser.levelName}</span>
          </div>
          <span className="text-sm text-gray-500">
            {currentUser.xp} / {userLevel?.xpMax} XP
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-rural-green h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(xpProgress, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {userLevel?.xpMax - currentUser.xp} XP para el siguiente nivel
        </p>
      </div>

      {/* Pasaporte Rural Maker */}
      <div className="border-2 border-rural-earth/40 rounded-xl bg-amber-50/50 p-4">
        <div className="flex items-center gap-2 mb-4 border-b border-rural-earth/20 pb-3">
          <span className="text-xl">📜</span>
          <h2 className="text-lg font-bold text-rural-earth tracking-wide uppercase">
            Pasaporte Rural Maker
          </h2>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {badges.map(badge => {
            const earned = currentUser.badges.includes(badge.id)
            return (
              <div
                key={badge.id}
                className={`flex flex-col items-center text-center gap-1 p-2 rounded-lg transition ${
                  earned
                    ? 'bg-white shadow-sm'
                    : 'opacity-30 grayscale'
                }`}
              >
                <span className="text-2xl">{badge.icon}</span>
                <span className="text-[10px] leading-tight text-gray-700 font-medium">
                  {badge.name}
                </span>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-rural-earth/60 mt-3 text-center italic">
          {currentUser.badges.length} de {badges.length} sellos conseguidos
        </p>
      </div>

      {/* Mis Saberes */}
      <div className="card">
        <h2 className="font-bold text-gray-800 mb-3">Mis Saberes</h2>
        <div className="flex flex-wrap gap-2">
          {currentUser.saberes.map(saber => (
            <span
              key={saber}
              className="px-3 py-1 bg-rural-green/10 text-rural-green text-sm font-medium rounded-full"
            >
              {saber}
            </span>
          ))}
        </div>
      </div>

      {/* Facenderas completadas */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Facenderas completadas</h2>
          <span className="text-2xl font-bold text-rural-green">{completedFacenderas.length}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Has participado en {currentUser.facenderasCount} facenderas en total
        </p>
        <Link
          to="/app/facenderas"
          className="inline-block mt-2 text-sm text-rural-green font-medium hover:underline"
        >
          Ver historial completo
        </Link>
      </div>
    </div>
  )
}
