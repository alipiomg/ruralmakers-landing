import { notifications } from '../data/mockData'

export default function Notifications() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Notificaciones</h2>
      <div className="space-y-2">
        {notifications.map(n => (
          <div key={n.id} className={`card flex items-start gap-3 p-3 ${!n.read ? 'border-l-2 border-rural-green' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${!n.read ? 'bg-rural-green/10 text-rural-green' : 'bg-gray-100 text-gray-400'}`}>
              {n.type === 'badge' ? '⭐' : n.type === 'facendera' ? '📅' : n.type === 'proyecto' ? '📋' : '👥'}
            </div>
            <div className="flex-1">
              <p className={`text-sm ${!n.read ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{n.message}</p>
              <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
