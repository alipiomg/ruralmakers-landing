import { routes, facenderas } from '../data/mockData'

export default function RuralRoutes() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Rutas Rurales</h2>
      <p className="text-sm text-gray-600">Recorre la provincia conectando pueblos, facenderas y saberes.</p>
      {routes.map(route => {
        const completed = route.checkpoints.filter(c => c.visited).length
        const total = route.checkpoints.length
        const pct = (completed / total) * 100
        return (
          <div key={route.id} className="card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">{route.name}</h3>
              <span className="text-xs text-gray-400">{route.distance}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-rural-green rounded-full h-2 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="text-xs text-gray-500">{completed}/{total} checkpoints visitados</div>
            <div className="space-y-2">
              {route.checkpoints.map((cp, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${cp.visited ? 'bg-rural-green text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {cp.visited ? '✓' : i + 1}
                  </div>
                  <span className={`text-sm ${cp.visited ? 'text-gray-800' : 'text-gray-400'}`}>{cp.name}</span>
                  {i < route.checkpoints.length - 1 && <span className="text-xs text-gray-300 ml-auto">---</span>}
                </div>
              ))}
            </div>
            {route.facenderasLinked.length > 0 && (
              <div className="text-xs text-gray-400 pt-1 border-t border-gray-100">
                {route.facenderasLinked.length} facenderas vinculadas a esta ruta
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
