import { useParams, Link } from 'react-router-dom'
import { projects, users, facenderas, categories } from '../data/mockData'

export default function ProjectDetail() {
  const { id } = useParams()
  const project = projects.find(p => p.id === id)
  if (!project) return <div className="p-4 text-center text-gray-500">Proyecto no encontrado</div>

  const cat = categories.find(c => c.id === project.category)
  const creator = users.find(u => u.id === project.creator)
  const collabs = project.collaborators.map(uid => users.find(u => u.id === uid)).filter(Boolean)
  const linkedFacenderas = project.facenderas.map(fid => facenderas.find(f => f.id === fid)).filter(Boolean)

  return (
    <div className="p-4 space-y-4">
      <Link to="/app/proyectos" className="text-sm text-rural-green flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Proyectos
      </Link>

      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{cat?.icon}</span>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{project.title}</h2>
            <span className="text-xs text-gray-500">{project.location} | {cat?.label}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600">{project.description}</p>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Colaboradores ({collabs.length})</h3>
        <div className="space-y-2">
          {collabs.map(u => (
            <div key={u.id} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-rural-green/10 text-rural-green rounded-full flex items-center justify-center text-sm font-bold">{u.name[0]}</div>
              <div>
                <div className="text-sm font-medium text-gray-800">{u.name}</div>
                <div className="text-xs text-gray-400">{u.location} | {u.saberes[0]}</div>
              </div>
              {u.id === project.creator && <span className="text-xs px-1.5 py-0.5 bg-rural-earth/20 text-rural-brown rounded-full ml-auto">Creador</span>}
            </div>
          ))}
        </div>
      </div>

      {linkedFacenderas.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Facenderas vinculadas</h3>
          {linkedFacenderas.map(f => (
            <Link key={f.id} to={`/app/facenderas/${f.id}`} className="block p-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700">
              {f.title} - {f.date}
            </Link>
          ))}
        </div>
      )}

      <button className="w-full py-3 bg-rural-green text-white rounded-lg font-medium">Unirme al proyecto</button>
    </div>
  )
}
