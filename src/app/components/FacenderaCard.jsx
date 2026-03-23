import { Link } from 'react-router-dom'
import { categories } from '../data/mockData'

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

const statusStyles = {
  proxima: 'bg-rural-green/10 text-rural-green',
  completada: 'bg-gray-100 text-gray-500',
  cancelada: 'bg-red-50 text-red-500',
}

const statusLabels = {
  proxima: 'Proxima',
  completada: 'Completada',
  cancelada: 'Cancelada',
}

export default function FacenderaCard({ facendera, users }) {
  const category = categories.find(c => c.id === facendera.category)
  const creator = users.find(u => u.id === facendera.creator)

  return (
    <Link to={`/app/facenderas/${facendera.id}`} className="card block hover:shadow-md transition">
      <div className="flex items-start gap-3">
        {/* Category icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: category ? category.color + '18' : '#4a7c5918' }}
        >
          {category?.icon || '?'}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title and status */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-800 text-sm leading-tight truncate">
              {facendera.title}
            </h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${statusStyles[facendera.status] || 'bg-gray-100 text-gray-500'}`}>
              {statusLabels[facendera.status] || facendera.status}
            </span>
          </div>

          {/* Date and location */}
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(facendera.date)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {facendera.location}
            </span>
          </div>

          {/* Bottom row: participants, XP, creator */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {facendera.participants.length}/{facendera.maxParticipants}
              </span>
              <span className="flex items-center gap-1 text-rural-earth font-medium">
                +{facendera.xpReward} XP
              </span>
            </div>
            {creator && (
              <span className="text-xs text-gray-400">
                por {creator.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
