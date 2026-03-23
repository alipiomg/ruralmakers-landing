// Mock data aligned with Readdy prototype - Real Leon province data

// ─── STATS GLOBALES ────────────────────────────────────────────
export const globalStats = {
  facenderasRealizadas: 127,
  participantesActivos: 1234,
  proyectosCompletados: 89,
  comunidadesConectadas: 23,
  miembrosConectados: 1234,
  conexionesActivas: 456,
  gruposColaborativos: 89,
}

// ─── USUARIO ACTUAL ────────────────────────────────────────────
export const currentUser = {
  id: 'u1',
  name: 'Alipio Gutierrez',
  avatar: null,
  level: 3,
  levelName: 'Arbol',
  xp: 340,
  xpNext: 500,
  location: 'Astorga, Leon',
  saberes: ['IA', 'Programacion', 'WordPress', 'Blockchain', 'Agricultura Ecologica'],
  facenderasCount: 12,
  badges: ['b1', 'b2', 'b3', 'b5', 'b7'],
  bio: 'Impulsor de Rural Makers. Conectando tecnologia y tradicion en la provincia de Leon.',
  specialty: 'Agricultura Ecologica',
  metric: '12 facenderas',
}

// ─── USUARIOS / MIEMBROS ──────────────────────────────────────
export const users = [
  { id: 'u1', name: 'Alipio Gutierrez', location: 'Astorga, Leon', saberes: ['IA', 'Programacion', 'WordPress'], level: 3, levelName: 'Arbol', facenderasCount: 12, specialty: 'Agricultura Ecologica', metric: '12 facenderas', online: true },
  { id: 'u2', name: 'Guillermo Sanchez', location: 'Ponferrada, Leon', saberes: ['Energias Renovables', 'Electricidad', 'Solar'], level: 2, levelName: 'Brote', facenderasCount: 8, specialty: 'Energias Renovables', metric: '8 proyectos', online: true },
  { id: 'u3', name: 'Pablo Martinez', location: 'El Bierzo, Leon', saberes: ['Bioconstruccion', 'Adobe', 'Carpinteria'], level: 4, levelName: 'Bosque', facenderasCount: 23, specialty: 'Bioconstruccion', metric: '15 construcciones', online: false },
  { id: 'u4', name: 'Karmen Lopez', location: 'Villafranca del Bierzo', saberes: ['Comunicacion Rural', 'Redes sociales', 'Fotografia'], level: 2, levelName: 'Brote', facenderasCount: 6, specialty: 'Comunicacion Rural', metric: '20 eventos', online: true },
  { id: 'u5', name: 'Elena Rodriguez', location: 'La Robla, Leon', saberes: ['Permacultura', 'Huerta', 'Compost'], level: 3, levelName: 'Arbol', facenderasCount: 15, specialty: 'Permacultura', metric: '9 huertos', online: true },
  { id: 'u6', name: 'Miguel Fernandez', location: 'Canales, Leon', saberes: ['Turismo Rural', 'Senderismo', 'Rutas'], level: 2, levelName: 'Brote', facenderasCount: 9, specialty: 'Turismo Rural', metric: '6 rutas', online: false },
  { id: 'u7', name: 'Carmen Alvarez', location: 'Matallana de Torio', saberes: ['Artesania', 'Ceramica', 'Textil'], level: 3, levelName: 'Arbol', facenderasCount: 18, specialty: 'Artesania Tradicional', metric: '25 talleres', online: true },
  { id: 'u8', name: 'Javier Prieto', location: 'Bembibre, Leon', saberes: ['Tecnologia Rural', 'IoT', 'Apps'], level: 2, levelName: 'Brote', facenderasCount: 7, specialty: 'Tecnologia Rural', metric: '11 innovaciones', online: true },
  { id: 'u9', name: 'Maria Gonzalez', location: 'Astorga, Leon', saberes: ['Ganaderia', 'Queso artesanal', 'Conservas'], level: 3, levelName: 'Arbol', facenderasCount: 14, specialty: 'Ganaderia Sostenible', metric: '14 facenderas', online: false },
  { id: 'u10', name: 'Carlos Fernandez', location: 'Ponferrada, Leon', saberes: ['Educacion', 'STEM', 'Robotica'], level: 2, levelName: 'Brote', facenderasCount: 5, specialty: 'Educacion Rural', metric: '5 talleres', online: true },
  { id: 'u11', name: 'Ana Martin', location: 'La Baneza, Leon', saberes: ['Semillas', 'Agroecologia', 'Mapeo'], level: 3, levelName: 'Arbol', facenderasCount: 11, specialty: 'Mapeo Participativo', metric: '11 mapeos', online: true },
  { id: 'u12', name: 'Roberto Garcia', location: 'Sahagun, Leon', saberes: ['Cooperativismo', 'Gestion', 'Economia social'], level: 2, levelName: 'Brote', facenderasCount: 10, specialty: 'Cooperativismo', metric: '10 proyectos', online: false },
]

// ─── CATEGORIAS ────────────────────────────────────────────────
export const categories = [
  { id: 'agricultura', label: 'Agricultura', color: '#16a34a', icon: '🌾' },
  { id: 'construccion', label: 'Construccion', color: '#d97706', icon: '🏗' },
  { id: 'artesania', label: 'Artesania', color: '#f59e0b', icon: '🎨' },
  { id: 'tecnologia', label: 'Tecnologia', color: '#8b5cf6', icon: '💻' },
  { id: 'educacion', label: 'Educacion', color: '#3b82f6', icon: '📚' },
  { id: 'energia', label: 'Energia', color: '#eab308', icon: '⚡' },
  { id: 'medioambiente', label: 'Medio ambiente', color: '#4a7c59', icon: '🌿' },
  { id: 'cultura', label: 'Cultura', color: '#e11d48', icon: '🎭' },
  { id: 'salud', label: 'Salud', color: '#ec4899', icon: '🩺' },
  { id: 'agroecologia', label: 'Agroecologia', color: '#059669', icon: '🌱' },
  { id: 'bioconstruccion', label: 'Bioconstruccion', color: '#92400e', icon: '🧱' },
  { id: 'arte', label: 'Arte', color: '#7c3aed', icon: '🖼' },
  { id: 'mapeo', label: 'Mapeo', color: '#0891b2', icon: '🗺' },
  { id: 'semillas', label: 'Semillas', color: '#65a30d', icon: '🌻' },
  { id: 'recoleccion', label: 'Recoleccion', color: '#b45309', icon: '🧺' },
]

// ─── FACENDERAS (con modalidad, duracion, actividades, organizador) ─
export const facenderas = [
  {
    id: 'f1', title: 'Facendera de Siembra Comunitaria',
    description: 'Jornada colaborativa de siembra de hortalizas de temporada en el huerto comunitario. Aprenderemos tecnicas tradicionales y ecologicas mientras trabajamos juntos.',
    category: 'agricultura', date: '2026-04-20', time: '09:00', location: 'Astorga',
    lat: 42.46, lng: -6.06, creator: 'u1',
    participants: ['u1', 'u9', 'u11', 'u5', 'u12'], maxParticipants: 40,
    status: 'proxima', modalidad: 'presencial', duracion: '8 horas',
    actividades: ['Preparacion del terreno', 'Siembra directa', 'Instalacion de riego', 'Almuerzo comunitario'],
    organizador: 'Grupo Agroecologico de Astorga',
    tags: ['Ecologica', 'Comunitaria', 'Educativa'], xpReward: 30,
  },
  {
    id: 'f2', title: 'Facendera Virtual de Planificacion Agricola',
    description: 'Encuentro online para planificar la temporada agricola. Compartiremos conocimientos sobre rotacion de cultivos y tecnicas sostenibles.',
    category: 'agricultura', date: '2026-04-25', time: '20:00', location: 'Online (Zoom)',
    lat: null, lng: null, creator: 'u11',
    participants: ['u11', 'u1', 'u5', 'u9', 'u12'], maxParticipants: 30,
    status: 'proxima', modalidad: 'virtual', duracion: '2 horas',
    actividades: ['Planificacion de cultivos', 'Intercambio de experiencias', 'Calendario agricola', 'Asignacion de tareas'],
    organizador: 'Red de Agricultores de Leon',
    tags: ['Virtual', 'Planificacion', 'Colaborativa'], xpReward: 15,
  },
  {
    id: 'f3', title: 'Facendera de Construccion de Invernadero',
    description: 'Trabajo colaborativo para construir un invernadero comunitario usando tecnicas de bioconstruccion y materiales locales.',
    category: 'construccion', date: '2026-05-01', time: '08:00', location: 'Finca Experimental La Encina',
    lat: 42.65, lng: -5.99, creator: 'u3',
    participants: ['u3', 'u2', 'u6', 'u8', 'u1'], maxParticipants: 50,
    status: 'proxima', modalidad: 'presencial', duracion: '10 horas',
    actividades: ['Preparacion de cimientos', 'Montaje de estructura', 'Instalacion de cubierta', 'Acabados y riego'],
    organizador: 'Colectivo de Bioconstruccion',
    tags: ['Construccion', 'Sostenible', 'Comunitaria'], xpReward: 45,
  },
  {
    id: 'f4', title: 'Facendera de Intercambio de Saberes',
    description: 'Encuentro intergeneracional donde los mayores ensenan oficios tradicionales a los jovenes. Preservamos el conocimiento ancestral.',
    category: 'artesania', date: '2026-05-10', time: '16:00', location: 'La Baneza',
    lat: 42.30, lng: -5.90, creator: 'u7',
    participants: ['u7', 'u4', 'u10', 'u11'], maxParticipants: 25,
    status: 'proxima', modalidad: 'presencial', duracion: '5 horas',
    actividades: ['Taller de cesteria', 'Trabajo en cuero', 'Tejido tradicional', 'Merienda compartida'],
    organizador: 'Asociacion de Artesanos',
    tags: ['Artesanal', 'Intergeneracional', 'Cultural'], xpReward: 25,
  },
  {
    id: 'f5', title: 'Facendera de Instalacion Solar Comunitaria',
    description: 'Trabajo colaborativo para instalar paneles solares en el centro comunitario. Aprenderemos sobre energias renovables mientras trabajamos.',
    category: 'energia', date: '2026-05-15', time: '09:00', location: 'Ponferrada',
    lat: 42.55, lng: -6.59, creator: 'u2',
    participants: ['u2', 'u8', 'u1', 'u3'], maxParticipants: 20,
    status: 'proxima', modalidad: 'presencial', duracion: '6 horas',
    actividades: ['Montaje de paneles', 'Conexionado electrico', 'Configuracion del sistema', 'Taller explicativo'],
    organizador: 'Cooperativa Energetica',
    tags: ['Energetica', 'Sostenible', 'Tecnica'], xpReward: 40,
  },
  {
    id: 'f6', title: 'Facendera de Formacion Digital Rural',
    description: 'Taller colaborativo para mejorar las competencias digitales en el entorno rural. Aprenderemos herramientas utiles para nuestros proyectos.',
    category: 'tecnologia', date: '2026-05-22', time: '10:00', location: 'Astorga',
    lat: 42.46, lng: -6.06, creator: 'u8',
    participants: ['u8', 'u1', 'u4', 'u10', 'u6'], maxParticipants: 30,
    status: 'proxima', modalidad: 'presencial', duracion: '4 horas',
    actividades: ['Uso de aplicaciones moviles', 'Gestion de redes sociales', 'Herramientas de comunicacion', 'IA para el rural'],
    organizador: 'Asociacion de Desarrollo Rural',
    tags: ['Digital', 'Formativa', 'Inclusiva'], xpReward: 20,
  },
  {
    id: 'f7', title: 'Recoleccion de Semillas Autoctonas',
    description: 'Jornada de recoleccion e intercambio de semillas locales y variedades tradicionales para preservar la biodiversidad.',
    category: 'semillas', date: '2026-03-15', time: '09:00', location: 'Astorga',
    lat: 42.46, lng: -6.06, creator: 'u11',
    participants: ['u11', 'u9', 'u5', 'u1', 'u7', 'u12'], maxParticipants: 30,
    status: 'completada', modalidad: 'presencial', duracion: '6 horas',
    actividades: ['Recogida de semillas', 'Catalogacion', 'Intercambio', 'Charla biodiversidad'],
    organizador: 'Semilleros del Bierzo',
    tags: ['Ecologica', 'Patrimonio', 'Biodiversidad'], xpReward: 25,
  },
  {
    id: 'f8', title: 'Hackathon IA Rural',
    description: 'Jornada intensiva para crear soluciones tecnologicas con IA aplicadas al medio rural. Equipos de 3-5 personas.',
    category: 'tecnologia', date: '2026-03-22', time: '09:00', location: 'Ponferrada',
    lat: 42.55, lng: -6.59, creator: 'u1',
    participants: ['u1', 'u8', 'u2', 'u4', 'u10', 'u3'], maxParticipants: 32,
    status: 'completada', modalidad: 'presencial', duracion: '12 horas',
    actividades: ['Formacion de equipos', 'Ideacion', 'Desarrollo', 'Presentacion y premios'],
    organizador: 'Tech Rural Leon',
    tags: ['Tecnologia', 'IA', 'Innovacion'], xpReward: 50,
  },
  {
    id: 'f9', title: 'Mapeo Turistico Participativo',
    description: 'Creamos un mapa colaborativo de rutas, senderos y puntos de interes turistico de la comarca.',
    category: 'mapeo', date: '2026-03-28', time: '08:00', location: 'El Bierzo',
    lat: 42.60, lng: -6.50, creator: 'u6',
    participants: ['u6', 'u4', 'u11', 'u1'], maxParticipants: 18,
    status: 'completada', modalidad: 'presencial', duracion: '8 horas',
    actividades: ['Recorrido de senderos', 'Registro GPS', 'Fotografia', 'Documentacion'],
    organizador: 'Exploradores del Bierzo',
    tags: ['Mapeo', 'Turismo', 'Patrimonio'], xpReward: 35,
  },
]

// ─── PROYECTOS (con progreso %, tags, fecha) ───────────────────
export const projects = [
  {
    id: 'p1', title: 'Huerto Comunitario Inteligente',
    description: 'Sistema de riego automatizado con sensores IoT para optimizar el cultivo de hortalizas locales',
    status: 'en_curso', progress: 75, category: 'agroecologia', location: 'Astorga',
    creator: 'u1', collaborators: ['u1', 'u5', 'u9', 'u8'],
    tags: ['Innovacion', 'Sostenibilidad', 'Colaborativo'],
    date: '2024-01-15', participants: 15,
  },
  {
    id: 'p2', title: 'Taller de Bioconstruccion con Adobe',
    description: 'Construccion colaborativa de una casa piloto usando tecnicas tradicionales de adobe y materiales locales',
    status: 'planificacion', progress: 30, category: 'bioconstruccion', location: 'El Bierzo',
    creator: 'u3', collaborators: ['u3', 'u2', 'u6'],
    tags: ['Tradicional', 'Ecologico', 'Formativo'],
    date: '2024-04-01', participants: 22,
  },
  {
    id: 'p3', title: 'Red de Energia Solar Comunitaria',
    description: 'Instalacion de paneles solares compartidos para reducir costes energeticos en 5 pueblos de la comarca',
    status: 'en_curso', progress: 60, category: 'energia', location: 'Comarca de Luna',
    creator: 'u2', collaborators: ['u2', 'u8', 'u12'],
    tags: ['Renovable', 'Comunitario', 'Ahorro'],
    date: '2023-09-01', participants: 45,
  },
  {
    id: 'p4', title: 'Escuela Rural de Artes Tradicionales',
    description: 'Programa educativo para preservar y ensenar oficios tradicionales: ceramica, tejido, carpinteria',
    status: 'en_curso', progress: 85, category: 'educacion', location: 'Ponferrada',
    creator: 'u7', collaborators: ['u7', 'u10', 'u4'],
    tags: ['Cultural', 'Educativo', 'Patrimonio'],
    date: '2023-10-01', participants: 28,
  },
  {
    id: 'p5', title: 'Plataforma de Telemedicina Rural',
    description: 'Sistema digital para conectar pacientes rurales con especialistas medicos mediante videoconferencia',
    status: 'planificacion', progress: 20, category: 'salud', location: 'Toda la provincia',
    creator: 'u8', collaborators: ['u8', 'u1'],
    tags: ['Digital', 'Salud', 'Accesible'],
    date: '2024-05-01', participants: 12,
  },
  {
    id: 'p6', title: 'Laboratorio de Innovacion Educativa',
    description: 'Espacio maker para que estudiantes rurales experimenten con robotica, programacion y ciencias',
    status: 'completado', progress: 100, category: 'educacion', location: 'La Baneza',
    creator: 'u10', collaborators: ['u10', 'u8', 'u1', 'u4'],
    tags: ['STEM', 'Juventud', 'Innovacion'],
    date: '2023-02-01', participants: 35,
  },
]

// ─── ORGANIZACIONES ────────────────────────────────────────────
export const organizations = [
  { id: 'o1', name: 'Cooperativa Agricola El Bierzo', location: 'El Bierzo', category: 'agricultura', description: 'Cooperativa especializada en produccion ecologica y comercializacion de productos locales', products: ['Vino ecologico', 'Aceite de oliva', 'Miel artesanal'], employees: 45, founded: 1987 },
  { id: 'o2', name: 'TechRural Innovacion', location: 'Ponferrada', category: 'tecnologia', description: 'Empresa de desarrollo tecnologico especializada en soluciones para el sector rural', products: ['Apps moviles', 'Sistemas IoT', 'Plataformas web'], employees: 12, founded: 2019 },
  { id: 'o3', name: 'Artesanos de Leon', location: 'Leon', category: 'artesania', description: 'Asociacion de artesanos que preserva y promociona las tradiciones artesanales leonesas', products: ['Ceramica tradicional', 'Textiles artesanales', 'Carpinteria'], employees: 25, founded: 1995 },
  { id: 'o4', name: 'EcoEnergia Rural', location: 'Astorga', category: 'energia', description: 'Empresa especializada en energias renovables y eficiencia energetica para el medio rural', products: ['Instalaciones solares', 'Sistemas eolicos', 'Biomasa'], employees: 18, founded: 2015 },
  { id: 'o5', name: 'Ganaderia Sostenible Maragatos', location: 'Astorga', category: 'ganaderia', description: 'Empresa familiar dedicada a la ganaderia extensiva y productos carnicos de calidad', products: ['Carne de ternera', 'Embutidos artesanales', 'Quesos'], employees: 8, founded: 2001 },
  { id: 'o6', name: 'Turismo Rural Bierzo Experience', location: 'El Bierzo', category: 'turismo', description: 'Empresa de turismo rural especializada en experiencias autenticas del Bierzo', products: ['Rutas senderismo', 'Turismo enologico', 'Alojamientos rurales'], employees: 15, founded: 2012 },
]

// ─── GRUPOS DE ORGANIZACION ────────────────────────────────────
export const groupsLocales = [
  {
    id: 'gl1', name: 'Canales', comarca: 'Montana Central', status: 'activo',
    members: 23, facenderasCount: 5,
    description: 'El grupo de Canales surgio en 2024 para recuperar senderos y fuentes abandonadas. Han organizado cinco facenderas y crearon una red de intercambio de semillas autoctonas. Participar es sencillo: basta sumarse al grupo de WhatsApp y venir cuando puedas.',
    proximasFacenderas: [
      { date: '15 Mayo 2024', title: 'Limpieza de fuente del pueblo' },
      { date: '22 Mayo 2024', title: 'Arreglo de sendero al monte' },
    ],
    testimonio: { author: 'Maria', text: 'Recuperar la fuente fue emocionante, todos pusimos nuestro granito de arena' },
  },
  {
    id: 'gl2', name: 'La Robla', comarca: 'Montana Central', status: 'en_expansion',
    members: 18, facenderasCount: 3,
    description: 'Grupo joven enfocado en recuperacion de espacios comunes y huertos urbanos. Organizan talleres mensuales de permacultura y compostaje comunitario.',
    proximasFacenderas: [
      { date: '18 Mayo 2024', title: 'Taller de compostaje' },
      { date: '25 Mayo 2024', title: 'Siembra colectiva en huerto' },
    ],
    testimonio: { author: 'Carlos', text: 'El huerto comunitario nos ha unido como vecinos' },
  },
  {
    id: 'gl3', name: 'Matallana de Torio', comarca: 'Montana Central', status: 'recien_formado',
    members: 12, facenderasCount: 1,
    description: 'Grupo recien constituido con ganas de recuperar tradiciones y espacios. Primera facendera exitosa limpiando el lavadero antiguo del pueblo.',
    proximasFacenderas: [
      { date: '20 Mayo 2024', title: 'Reunion organizativa mensual' },
    ],
    testimonio: { author: 'Ana', text: 'Empezar con el lavadero fue simbolico, ahora queremos mas' },
  },
]

export const groupsTroncales = [
  { id: 'gt1', name: 'IA & Tecnologia Rural', theme: 'Innovacion tecnologica aplicada al campo', members: 34, facenderasCount: 8, status: 'activo' },
  { id: 'gt2', name: 'Agroecologia y Semillas', theme: 'Cultivo sostenible y preservacion de variedades locales', members: 45, facenderasCount: 12, status: 'activo' },
  { id: 'gt3', name: 'Energia Comunitaria', theme: 'Autogestion energetica y renovables', members: 28, facenderasCount: 6, status: 'activo' },
  { id: 'gt4', name: 'Patrimonio y Saberes', theme: 'Preservacion de oficios y conocimiento tradicional', members: 31, facenderasCount: 9, status: 'en_expansion' },
  { id: 'gt5', name: 'Bioconstruccion', theme: 'Tecnicas constructivas sostenibles y materiales locales', members: 19, facenderasCount: 4, status: 'recien_formado' },
]

// ─── EVENTOS DE AGENDA ─────────────────────────────────────────
export const agendaEvents = [
  { id: 'e1', title: 'Facendera de Siembra Comunitaria', type: 'facendera', date: '2026-04-20', time: '09:00', location: 'Astorga', organizer: 'Grupo Agroecologico', participants: 25, description: 'Jornada colaborativa de siembra en huerto comunitario' },
  { id: 'e2', title: 'Taller de Bioconstruccion', type: 'taller', date: '2026-04-18', time: '10:00', location: 'Ponferrada', organizer: 'Constructores Naturales', participants: 15, description: 'Construccion de horno de barro con tecnicas tradicionales' },
  { id: 'e3', title: 'Reunion Virtual - Planificacion Primavera', type: 'reunion', date: '2026-04-20', time: '19:00', location: 'Online', organizer: 'Coordinacion Rural Makers', participants: 45, description: 'Coordinacion de actividades para la temporada' },
  { id: 'e4', title: 'Celebracion del Equinoccio', type: 'celebracion', date: '2026-04-21', time: '18:00', location: 'La Baneza', organizer: 'Colectivo Astorga', participants: 67, description: 'Encuentro festivo con musica, danza y saberes' },
  { id: 'e5', title: 'Hackathon IA Rural', type: 'facendera', date: '2026-04-22', time: '09:00', location: 'Ponferrada', organizer: 'Tech Rural Leon', participants: 32, description: 'Jornada de innovacion con IA para el rural' },
  { id: 'e6', title: 'Taller de Ceramica', type: 'taller', date: '2026-04-25', time: '11:00', location: 'Leon', organizer: 'Artesanos de Leon', participants: 12, description: 'Aprendemos tecnicas tradicionales de ceramica' },
  { id: 'e7', title: 'Reunion Mensual Grupos Locales', type: 'reunion', date: '2026-04-28', time: '20:00', location: 'Online', organizer: 'ASASA', participants: 30, description: 'Coordinacion entre grupos locales' },
  { id: 'e8', title: 'Filandon Nocturno', type: 'celebracion', date: '2026-05-02', time: '20:00', location: 'Ponferrada', organizer: 'Memoria Rural', participants: 40, description: 'Encuentro de historias, cantos y saberes al calor del fuego' },
]

// ─── RECURSOS ──────────────────────────────────────────────────
export const recursos = {
  bitacoras: [
    { id: 'rb1', title: 'Bitacora de Facenderas 2024', description: 'Registro completo de todas las facenderas realizadas durante el ano', format: 'PDF', category: 'Agricultura', source: 'Facendera de Siembra Comunitaria', group: 'Grupo Agroecologico de Astorga', support: 'Diputacion de Leon', location: 'Astorga', size: '4.2 MB', downloads: 892 },
    { id: 'rb2', title: 'Diario de Campo - Semillas Autoctonas', description: 'Observaciones y seguimiento de variedades locales de cultivos', format: 'PDF', category: 'Alimentacion', source: 'Facendera de Intercambio de Semillas', group: 'Red de Agricultores de Leon', support: 'Universidad de Leon', location: 'Leon', size: '2.8 MB', downloads: 634 },
    { id: 'rb3', title: 'Bitacora de Construccion Natural', description: 'Proceso paso a paso de construcciones con materiales locales', format: 'PDF', category: 'Construccion', source: 'Facendera de Construccion de Invernadero', group: 'Colectivo de Bioconstruccion', support: 'Ayuntamiento de Ponferrada', location: 'Ponferrada', size: '6.1 MB', downloads: 445 },
  ],
  manuales: [
    { id: 'rm1', title: 'Guia de Permacultura Rural', description: 'Manual completo de tecnicas de permacultura para el medio rural', format: 'PDF', category: 'Agricultura', location: 'Online', size: '8.5 MB', downloads: 1200 },
    { id: 'rm2', title: 'Manual de Instalacion Solar', description: 'Paso a paso para instalar paneles solares en comunidad', format: 'PDF', category: 'Energia', location: 'Online', size: '5.2 MB', downloads: 890 },
  ],
  espacios: [
    { id: 're1', name: 'Casa de Cultura de Astorga', type: 'Sala multiusos', location: 'Astorga', capacity: 50, available: true },
    { id: 're2', name: 'Telecentro Rural de La Baneza', type: 'Espacio digital', location: 'La Baneza', capacity: 20, available: true },
    { id: 're3', name: 'Finca Experimental La Encina', type: 'Espacio al aire libre', location: 'Riello', capacity: 100, available: true },
  ],
  herramientas: [
    { id: 'rh1', name: 'Motosierra Stihl', owner: 'u3', location: 'Astorga', available: true },
    { id: 'rh2', name: 'Furgoneta de transporte', owner: 'u5', location: 'La Robla', available: false },
    { id: 'rh3', name: 'Proyector + pantalla', owner: 'u12', location: 'Leon', available: true },
    { id: 'rh4', name: 'Impresora 3D', owner: 'u1', location: 'Astorga', available: true },
    { id: 'rh5', name: 'Kit analisis de suelos', owner: 'u11', location: 'La Baneza', available: true },
    { id: 'rh6', name: 'Torno de ceramica', owner: 'u7', location: 'Matallana', available: true },
  ],
  multimedia: [
    { id: 'rmu1', title: 'Facendera de Recoleccion', location: 'Astorga', type: 'foto' },
    { id: 'rmu2', title: 'Filandon Nocturno', location: 'Ponferrada', type: 'foto' },
    { id: 'rmu3', title: 'Mapeo Participativo', location: 'El Bierzo', type: 'foto' },
    { id: 'rmu4', title: 'Construccion Colaborativa', location: 'La Baneza', type: 'foto' },
  ],
  agentesIA: [
    { id: 'ria1', name: 'Asistente Rural Maker', description: 'IA entrenada con datos locales para asesorar sobre facenderas, tramites y recursos rurales', status: 'activo' },
    { id: 'ria2', name: 'Generador de Carteles', description: 'Crea carteles y material visual para facenderas automaticamente', status: 'en_desarrollo' },
    { id: 'ria3', name: 'Asesoria de Tramites', description: 'Base de conocimiento sobre ayudas, subvenciones y normativas', status: 'planificado' },
  ],
}

// ─── TESTIMONIOS ───────────────────────────────────────────────
export const testimonios = [
  { id: 't1', name: 'Maria Gonzalez', location: 'Astorga', quote: 'Las facenderas han transformado nuestra comunidad. Hemos recuperado tradiciones y creado nuevas oportunidades.' },
  { id: 't2', name: 'Carlos Fernandez', location: 'Ponferrada', quote: 'La tecnologia y la tradicion pueden ir de la mano. Rural Makers nos ha demostrado que es posible.' },
  { id: 't3', name: 'Ana Martin', location: 'La Baneza', quote: 'Participar en el mapeo de senderos ha sido una experiencia increible. Conoces gente y tu territorio.' },
]

// ─── BADGES Y NIVELES (sin cambios) ────────────────────────────
export const badges = [
  { id: 'b1', name: 'Primera Facendera', icon: '🌱', description: 'Participaste en tu primera facendera', xp: 10 },
  { id: 'b2', name: 'Manos a la obra', icon: '🔨', description: '5 facenderas completadas', xp: 50 },
  { id: 'b3', name: 'Saber compartido', icon: '📚', description: 'Ensenaste un saber en una facendera', xp: 30 },
  { id: 'b4', name: 'Caminante', icon: '🥾', description: 'Completaste tu primera ruta rural', xp: 20 },
  { id: 'b5', name: 'Digital Maker', icon: '💻', description: 'Participaste en una facendera tecnologica', xp: 25 },
  { id: 'b6', name: 'Guardian del bosque', icon: '🌳', description: 'Plantaste un arbol en facendera', xp: 30 },
  { id: 'b7', name: 'Tejedor/a', icon: '🧶', description: 'Conectaste 3 personas de pueblos distintos', xp: 40 },
  { id: 'b8', name: 'Impulsora', icon: '🚀', description: 'Creaste tu primera facendera', xp: 50 },
  { id: 'b9', name: 'Piedra angular', icon: '🪨', description: '10 facenderas completadas', xp: 100 },
  { id: 'b10', name: 'Raiz profunda', icon: '🌿', description: 'Un ano activo en la red', xp: 200 },
]

export const levels = [
  { level: 1, name: 'Semilla', xpMin: 0, xpMax: 100, icon: '🌱' },
  { level: 2, name: 'Brote', xpMin: 100, xpMax: 250, icon: '🌿' },
  { level: 3, name: 'Arbol', xpMin: 250, xpMax: 500, icon: '🌳' },
  { level: 4, name: 'Bosque', xpMin: 500, xpMax: 1000, icon: '🌲' },
  { level: 5, name: 'Ecosistema', xpMin: 1000, xpMax: Infinity, icon: '🏔' },
]

// ─── RUTAS ─────────────────────────────────────────────────────
export const routes = [
  {
    id: 'rt1', name: 'Ruta de los Valles',
    checkpoints: [
      { name: 'La Omana', lat: 42.73, lng: -5.93, visited: true },
      { name: 'Riello', lat: 42.65, lng: -5.99, visited: true },
      { name: 'Murias de Paredes', lat: 42.84, lng: -6.15, visited: false },
      { name: 'Villablino', lat: 42.94, lng: -6.31, visited: false },
    ],
    distance: '85 km', facenderasLinked: ['f1', 'f3'],
  },
  {
    id: 'rt2', name: 'Camino de las Facenderas',
    checkpoints: [
      { name: 'Astorga', lat: 42.46, lng: -6.06, visited: true },
      { name: 'La Baneza', lat: 42.30, lng: -5.90, visited: false },
      { name: 'Bembibre', lat: 42.62, lng: -6.42, visited: false },
      { name: 'Ponferrada', lat: 42.55, lng: -6.59, visited: false },
    ],
    distance: '120 km', facenderasLinked: ['f5', 'f8'],
  },
]

// ─── NOTIFICACIONES ────────────────────────────────────────────
export const notifications = [
  { id: 'n1', type: 'facendera', message: 'Maria se ha apuntado a "Facendera de Siembra Comunitaria"', time: 'Hace 2h', read: false },
  { id: 'n2', type: 'badge', message: 'Has desbloqueado el badge "Tejedor/a"!', time: 'Hace 1 dia', read: false },
  { id: 'n3', type: 'proyecto', message: 'Carlos ha comentado en "Huerto Comunitario Inteligente"', time: 'Hace 2 dias', read: true },
  { id: 'n4', type: 'comunidad', message: 'Laura se ha unido a Rural Makers', time: 'Hace 3 dias', read: true },
  { id: 'n5', type: 'facendera', message: 'Recordatorio: "Taller de Bioconstruccion" es manana a las 10:00', time: 'Hace 3 dias', read: true },
]

// ─── CHAT IA ───────────────────────────────────────────────────
export const chatResponses = [
  { q: 'que facenderas hay', a: 'Tienes 6 facenderas proximas! La mas cercana es "Facendera de Siembra Comunitaria" en Astorga el 20 de abril. Tambien hay un "Taller de Bioconstruccion" en Ponferrada. Quieres que te apunte a alguna?' },
  { q: 'como organizar facendera', a: 'Para organizar una facendera necesitas: 1) Elegir tema y categoria, 2) Fijar fecha, hora y lugar, 3) Describir actividades y que traer, 4) Crear un grupo organizador, 5) Publicarla en la app. Yo puedo ayudarte a redactar la descripcion. Quieres crear una ahora?' },
  { q: 'quien sabe de apicultura', a: 'Maria Gonzalez de Astorga tiene conocimientos en ganaderia y conservas. Tambien Jorge de La Baneza sabe de agroecologia y semillas. Puedo ponerles un mensaje si quieres.' },
  { q: 'subvenciones', a: 'Hay varias lineas de ayuda: PAC (Politica Agraria Comun), Leader Leon (desarrollo rural), ayudas de la Diputacion para asociaciones, y convocatorias de Goteo con matchers que doblan tu recaudacion. Quieres info de alguna en concreto?' },
  { q: 'grupos', a: 'Hay 3 grupos locales activos: Canales (23 miembros), La Robla (18 miembros) y Matallana de Torio (12 miembros). Tambien 5 grupos troncales tematicos. Puedes unirte o proponer uno nuevo en /app/grupos.' },
]

// ─── PRINCIPIOS Y VALORES ──────────────────────────────────────
export const principios = [
  { title: 'Apoyo Mutuo', description: 'Nos ayudamos entre todos', icon: '🤝' },
  { title: 'Aprendizaje Compartido', description: 'Todos ensenamos y aprendemos', icon: '📖' },
  { title: 'Cooperacion', description: 'Juntos somos mas fuertes', icon: '👥' },
  { title: 'Sostenibilidad', description: 'Cuidamos el territorio', icon: '🌿' },
]
