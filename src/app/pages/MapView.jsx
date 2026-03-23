import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { facenderas, categories } from '../data/mockData'

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
      width: 24px;
      height: 24px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  })
}

export default function MapView() {
  const [activeFilter, setActiveFilter] = useState('todas')

  const filtered = activeFilter === 'todas'
    ? facenderas
    : facenderas.filter(f => f.category === activeFilter)

  const getCategoryColor = (catId) => {
    const cat = categories.find(c => c.id === catId)
    return cat ? cat.color : '#6b7280'
  }

  const getCategoryLabel = (catId) => {
    const cat = categories.find(c => c.id === catId)
    return cat ? cat.label : catId
  }

  // Only categories that have facenderas
  const usedCategories = categories.filter(cat =>
    facenderas.some(f => f.category === cat.id)
  )

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="relative" style={{ height: 'calc(100vh - 56px - 64px)' }}>
      {/* Filter pills overlay */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveFilter('todas')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md transition ${
            activeFilter === 'todas'
              ? 'bg-rural-green text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Todas
        </button>
        {usedCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md transition ${
              activeFilter === cat.id
                ? 'text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            style={activeFilter === cat.id ? { backgroundColor: cat.color } : {}}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <MapContainer
        center={[42.6, -5.8]}
        zoom={9}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filtered.map(f => (
          <Marker
            key={f.id}
            position={[f.lat, f.lng]}
            icon={createCategoryIcon(getCategoryColor(f.category))}
          >
            <Popup>
              <div className="min-w-[180px]">
                <div
                  className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block text-white mb-1"
                  style={{ backgroundColor: getCategoryColor(f.category) }}
                >
                  {getCategoryLabel(f.category)}
                </div>
                <h3 className="font-bold text-sm text-gray-800 leading-tight mb-1">
                  {f.title}
                </h3>
                <p className="text-xs text-gray-500 mb-0.5">
                  {formatDate(f.date)} - {f.time}
                </p>
                <p className="text-xs text-gray-500 mb-1">
                  {f.location}
                </p>
                <p className="text-xs text-gray-600 mb-2">
                  {f.participants.length}/{f.maxParticipants} participantes
                </p>
                <Link
                  to={`/app/facendera/${f.id}`}
                  className="text-xs font-semibold text-rural-green hover:underline"
                >
                  Ver detalle →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
