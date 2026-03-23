import { useParams, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { facenderas, users, categories } from '../data/mockData'

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function createCategoryIcon(color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 20px;
      height: 20px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

export default function FacenderaDetail() {
  const { id } = useParams()
  const facendera = facenderas.find(f => f.id === id)

  if (!facendera) {
    return (
      <div className="p-4 text-center py-12">
        <p className="text-gray-500">Facendera no encontrada</p>
        <Link to="/app" className="text-rural-green font-semibold mt-4 inline-block">
          Volver
        </Link>
      </div>
    )
  }

  const category = categories.find(c => c.id === facendera.category)
  const catColor = category?.color || '#6b7280'
  const catLabel = category?.label || facendera.category

  const participantUsers = facendera.participants
    .map(pid => users.find(u => u.id === pid))
    .filter(Boolean)

  const spotsRemaining = facendera.maxParticipants - facendera.participants.length

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const getInitials = (name) => {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  const creatorUser = users.find(u => u.id === facendera.creator)

  return (
    <div className="pb-24">
      {/* Category color bar */}
      <div className="h-2" style={{ backgroundColor: catColor }} />

      {/* Back button */}
      <div className="p-4 pb-0">
        <Link
          to="/app"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>
      </div>

      {/* Header */}
      <div className="p-4 pt-2">
        <div
          className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full text-white mb-3"
          style={{ backgroundColor: catColor }}
        >
          {category?.icon} {catLabel}
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{facendera.title}</h1>
        <div className="space-y-1 text-sm text-gray-500">
          <p className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(facendera.date)} - {facendera.time}h
          </p>
          <p className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {facendera.location}
          </p>
          {creatorUser && (
            <p className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Organiza: {creatorUser.name}
            </p>
          )}
        </div>
      </div>

      {/* Mini map */}
      <div className="mx-4 rounded-xl overflow-hidden shadow-sm">
        <MapContainer
          center={[facendera.lat, facendera.lng]}
          zoom={13}
          style={{ height: '200px', width: '100%' }}
          zoomControl={false}
          scrollWheelZoom={false}
          dragging={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[facendera.lat, facendera.lng]}
            icon={createCategoryIcon(catColor)}
          />
        </MapContainer>
      </div>

      {/* Description */}
      <div className="p-4">
        <h2 className="font-bold text-gray-800 mb-2">Descripcion</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{facendera.description}</p>
      </div>

      {/* XP Reward */}
      <div className="mx-4 card flex items-center gap-3 bg-amber-50 border border-amber-200">
        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-lg">
          ⭐
        </div>
        <div>
          <p className="text-sm font-bold text-amber-800">+{facendera.xpReward} XP</p>
          <p className="text-xs text-amber-600">Recompensa por participar</p>
        </div>
      </div>

      {/* Participants */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-800">Participantes</h2>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {facendera.participants.length}/{facendera.maxParticipants}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${(facendera.participants.length / facendera.maxParticipants) * 100}%`,
              backgroundColor: catColor,
            }}
          />
        </div>

        <div className="space-y-2">
          {participantUsers.map(user => (
            <div key={user.id} className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: catColor }}
              >
                {getInitials(user.name)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-400">{user.location}</p>
              </div>
              {user.id === facendera.creator && (
                <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  Organiza
                </span>
              )}
            </div>
          ))}
        </div>

        {spotsRemaining > 0 && (
          <p className="text-xs text-gray-400 mt-3">
            {spotsRemaining} {spotsRemaining === 1 ? 'plaza disponible' : 'plazas disponibles'}
          </p>
        )}
      </div>

      {/* Sticky join button */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
        <button
          className="w-full py-3.5 rounded-xl font-bold text-white text-base shadow-lg active:scale-[0.98] transition"
          style={{ backgroundColor: '#16a34a' }}
        >
          Unirme a esta facendera
        </button>
      </div>
    </div>
  )
}
