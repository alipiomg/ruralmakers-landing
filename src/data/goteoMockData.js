// Mock data based on real Goteo API response shapes
// Ready to replace with live API calls when Cloudflare is resolved

export const projectData = {
  id: 'camino-rural-tejiendo-facenderas',
  name: 'Rural Makers Tejiendo Facenderas',
  status: 'editing',
  amount: 0,
  minimum: 10700,
  optimum: 55000,
  investors: 0,
  date_created: '2025-10-27',
  category: 'Social',
  location: { city: 'La Omana', region: 'Leon', country: 'Spain', lat: 42.73, lng: -5.93 },
}

export const similarProjects = [
  { id: 'aldeas-digitales', name: 'Aldeas Digitales', amount: 12450, minimum: 8000, optimum: 20000, investors: 187, status: 'funded', category: 'Social', days: 40, success: true, location: 'Teruel' },
  { id: 'pueblos-vivos', name: 'Pueblos Vivos: Red Rural Conectada', amount: 18300, minimum: 12000, optimum: 30000, investors: 234, status: 'funded', category: 'Social', days: 40, success: true, location: 'Soria' },
  { id: 'rural-hub-galicia', name: 'Rural Hub Galicia', amount: 9800, minimum: 10000, optimum: 25000, investors: 156, status: 'funded', category: 'Technology', days: 40, success: false, location: 'Ourense' },
  { id: 'terra-cooperativa', name: 'Terra Cooperativa App', amount: 22100, minimum: 15000, optimum: 35000, investors: 312, status: 'funded', category: 'Social', days: 40, success: true, location: 'Lleida' },
  { id: 'semillas-digitales', name: 'Semillas Digitales Rurales', amount: 8200, minimum: 6000, optimum: 15000, investors: 143, status: 'funded', category: 'Technology', days: 40, success: true, location: 'Zamora' },
  { id: 'makers-sierra', name: 'Makers de la Sierra', amount: 15600, minimum: 10000, optimum: 28000, investors: 198, status: 'funded', category: 'Social', days: 40, success: true, location: 'Guadalajara' },
  { id: 'conecta-rural', name: 'Conecta Rural Asturias', amount: 11200, minimum: 9000, optimum: 22000, investors: 178, status: 'funded', category: 'Social', days: 40, success: true, location: 'Asturias' },
  { id: 'pueblo-app', name: 'PuebloApp - Tu pueblo en el movil', amount: 7500, minimum: 8500, optimum: 18000, investors: 112, status: 'funded', category: 'Technology', days: 40, success: false, location: 'Cuenca' },
]

export const rewardsStats = [
  { range: '1-15 EUR', avgDonors: 42, pctTotal: 28, avgConversion: 65, bestReward: 'Digital perks + mencion', tip: 'Funciona muy bien como puerta de entrada. Rural Makers tiene Semilla del Cambio a 13 EUR - bien posicionada.' },
  { range: '16-30 EUR', avgDonors: 31, pctTotal: 22, avgConversion: 58, bestReward: 'Producto fisico pequeno + digital', tip: 'SuperRural Maker a 30 EUR con llavero 3D + libro digital encaja perfecto.' },
  { range: '31-50 EUR', avgDonors: 18, pctTotal: 15, avgConversion: 45, bestReward: 'Experiencia o servicio', tip: 'Risalegria Auditoria IA a 50 EUR es creativa. Considerar anadir algo tangible.' },
  { range: '51-100 EUR', avgDonors: 12, pctTotal: 14, avgConversion: 38, bestReward: 'Experiencia premium + producto', tip: 'Ruta con Bano de Bosque a 100 EUR es potente. Considerar opcion de 75 EUR mas accesible.' },
  { range: '101-300 EUR', avgDonors: 5, pctTotal: 10, avgConversion: 25, bestReward: 'Patrocinio visible + experiencia VIP', tip: 'Tejedora (200) e Impulsora (300) necesitan mas valor percibido. Anadir mencion en la app?' },
  { range: '300+ EUR', avgDonors: 2, pctTotal: 11, avgConversion: 15, bestReward: 'Mecenazgo con ROI social tangible', tip: 'Mecenas (1000), Patron (2000), Confederal (4000) - pocos pero alto valor. Enfocar a empresas/instituciones.' },
]

export const communityUsers = [
  { id: 'user1', name: 'Maria G.', location: 'Leon', projects_supported: 8, amount_donated: 340, interests: ['Rural', 'Social', 'Technology'] },
  { id: 'user2', name: 'Carlos R.', location: 'Ponferrada', projects_supported: 12, amount_donated: 580, interests: ['Social', 'Education'] },
  { id: 'user3', name: 'Ana P.', location: 'Astorga', projects_supported: 5, amount_donated: 200, interests: ['Rural', 'Culture'] },
  { id: 'user4', name: 'Jorge M.', location: 'Zamora', projects_supported: 15, amount_donated: 920, interests: ['Technology', 'Social'] },
  { id: 'user5', name: 'Laura S.', location: 'Valladolid', projects_supported: 22, amount_donated: 1200, interests: ['Social', 'Rural', 'Education'] },
  { id: 'user6', name: 'Pedro L.', location: 'Oviedo', projects_supported: 7, amount_donated: 310, interests: ['Rural', 'Culture'] },
  { id: 'user7', name: 'Elena V.', location: 'Salamanca', projects_supported: 9, amount_donated: 450, interests: ['Technology', 'Social'] },
  { id: 'user8', name: 'Roberto F.', location: 'Benavente', projects_supported: 3, amount_donated: 150, interests: ['Rural'] },
  { id: 'user9', name: 'Isabel C.', location: 'Burgos', projects_supported: 18, amount_donated: 890, interests: ['Social', 'Education', 'Rural'] },
  { id: 'user10', name: 'Miguel A.', location: 'Palencia', projects_supported: 6, amount_donated: 280, interests: ['Rural', 'Technology'] },
  { id: 'user11', name: 'Teresa D.', location: 'Leon', projects_supported: 11, amount_donated: 520, interests: ['Social', 'Rural', 'Culture'] },
  { id: 'user12', name: 'David H.', location: 'La Baneza', projects_supported: 4, amount_donated: 190, interests: ['Rural'] },
]

export const activeCalls = [
  { id: 'cultura-abierta-2026', name: 'Cultura Abierta 2026', budget: 50000, matched: 35000, projects: 12, status: 'open', deadline: '2026-05-15', multiplier: '1:1', description: 'Convocatoria para proyectos de cultura abierta y patrimonio inmaterial', compatible: true, reason: 'Rural Makers preserva tradiciones (facenderas) con tecnologia abierta' },
  { id: 'innovacion-social-castilla', name: 'Innovacion Social Castilla y Leon', budget: 80000, matched: 22000, projects: 8, status: 'open', deadline: '2026-06-30', multiplier: '1:1.5', description: 'Apoyo a proyectos de innovacion social en territorio CyL', compatible: true, reason: 'Encaja perfecto: innovacion social en medio rural de Leon' },
  { id: 'matchfunding-rural', name: 'Matchfunding Rural', budget: 30000, matched: 18000, projects: 6, status: 'open', deadline: '2026-04-30', multiplier: '1:1', description: 'Multiplicador para proyectos de desarrollo rural', compatible: true, reason: 'Directamente enfocado en rural. Cada euro de donante se dobla.' },
  { id: 'tech4good-2026', name: 'Tech4Good Europa', budget: 120000, matched: 45000, projects: 15, status: 'open', deadline: '2026-07-31', multiplier: '1:2', description: 'Tecnologia al servicio del bien comun', compatible: true, reason: 'La app RuralMakers.app es tech for good por definicion' },
  { id: 'espana-vaciada', name: 'Contra la Espana Vaciada', budget: 60000, matched: 40000, projects: 10, status: 'closing', deadline: '2026-04-01', multiplier: '1:1', description: 'Proyectos contra la despoblacion rural', compatible: true, reason: 'Tema central de Rural Makers. Urgente: cierra pronto.' },
]

export const sdgsData = [
  { id: 4, name: 'Educacion de calidad', icon: '📚', applicable: true, reason: 'Modulos de aprendizaje gamificado, formacion en facenderas' },
  { id: 8, name: 'Trabajo decente y crecimiento economico', icon: '💼', applicable: true, reason: 'Economia solidaria, emprendimiento rural, bioeconomia' },
  { id: 9, name: 'Industria, innovacion e infraestructura', icon: '🏗', applicable: true, reason: 'Innovacion rural, app digital, centros de innovacion territorial' },
  { id: 10, name: 'Reduccion de las desigualdades', icon: '⚖', applicable: true, reason: 'Combatir brecha rural-urbana, acceso a recursos y servicios' },
  { id: 11, name: 'Ciudades y comunidades sostenibles', icon: '🏘', applicable: true, reason: 'Comunidades rurales sostenibles, regeneracion territorial' },
  { id: 12, name: 'Produccion y consumo responsables', icon: '♻', applicable: false, reason: 'Recursos compartidos, economia circular en pueblos' },
  { id: 15, name: 'Vida de ecosistemas terrestres', icon: '🌳', applicable: true, reason: 'Regeneracion rural, banos de bosque, cuidado del territorio' },
  { id: 17, name: 'Alianzas para lograr objetivos', icon: '🤝', applicable: true, reason: 'Red de grupos locales, ASASA, cooperacion inter-territorial' },
]

export const reportsSummary = {
  projects_total: 12847,
  projects_successful: 9234,
  success_rate: 71.9,
  money_total: 18456000,
  money_average: 14350,
  donors_total: 287000,
  donors_average: 198,
  categories_top: ['Social', 'Technology', 'Education', 'Culture', 'Ecology'],
}

export const reportsProjects = {
  by_category: [
    { category: 'Social', count: 3845, success_rate: 74.2, avg_amount: 15200 },
    { category: 'Technology', count: 2156, success_rate: 68.5, avg_amount: 18900 },
    { category: 'Education', count: 1890, success_rate: 76.1, avg_amount: 12100 },
    { category: 'Culture', count: 1678, success_rate: 72.8, avg_amount: 11500 },
    { category: 'Ecology', count: 1234, success_rate: 69.4, avg_amount: 13800 },
    { category: 'Design', count: 987, success_rate: 65.2, avg_amount: 9800 },
    { category: 'Journalism', count: 567, success_rate: 70.1, avg_amount: 10200 },
  ],
}
