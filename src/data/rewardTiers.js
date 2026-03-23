export const rewardTiers = [
  {
    amount: 13, name: 'Semilla del Cambio', badge: null, color: '#6B9E50',
    type: 'digital', typeLabel: 'Digital',
    tagline: 'Tu primera semilla en la red',
    image: '', imagePrompt: 'A glowing seed sprouting from rich dark soil, with tiny roots forming a network pattern below ground, golden morning light, lush green sprout reaching upward, photorealistic macro photography, rural Spanish landscape in soft bokeh background, warm earth tones --ar 1:1',
    own: ['Llavero 3D Rural Makers personalizado', 'Pasaporte digital Rural Maker', 'Postal numerada edicion limitada', 'Newsletter exclusiva de la comunidad', 'Creditos iniciales en la app'],
    inherited: [],
    description: 'Tu entrada a la comunidad Rural Makers. Recibes tu pasaporte digital, un llavero 3D unico y acceso prioritario a las novedades del proyecto.',
  },
  {
    amount: 30, name: 'SuperRural Maker', badge: 'Mas popular', color: '#6B9E50',
    type: 'digital', typeLabel: 'Digital',
    tagline: 'Impulsores del movimiento rural',
    image: '', imagePrompt: 'A superhero cape made of sunflower petals draped over a rustic wooden workbench with maker tools, 3D printed keychain glowing in foreground, warm sunlight through barn window, vibrant yellow and green palette, photorealistic --ar 1:1',
    own: ['Llavero SuperRural edicion especial', 'Libro digital "Facenderas del Siglo XXI"', 'Tu nombre en agradecimientos de la app'],
    inherited: ['Todo de Semilla del Cambio (13 EUR)'],
    description: 'Conviertete en SuperRural Maker con contenido exclusivo. El libro digital documenta la historia y futuro de las facenderas como herramienta de transformacion rural.',
  },
  {
    amount: 50, name: 'Risalegria AuditorIA', badge: null, color: '#8B5CF6',
    type: 'digital', typeLabel: 'Digital',
    tagline: 'Quienes quieren innovar con IA etica',
    image: '', imagePrompt: 'A friendly robot made of reclaimed wood and vines sitting in a rustic countryside office, reviewing documents with a warm smile, holographic data floating above a weathered oak desk, Spanish rural village visible through window, warm lighting, photorealistic --ar 1:1',
    own: ['Sesion personalizada de asesoria en IA', 'Manual del juego de mesa Rural Makers', 'Sello digital coleccionable unico'],
    inherited: ['Todo de SuperRural Maker (30 EUR)'],
    description: 'Una sesion 1:1 donde exploramos como la IA puede ayudar a tu proyecto rural. Mas el juego de mesa para aprender facenderas jugando.',
  },
  {
    amount: 75, name: 'El Arte de SuperArte', badge: null, color: '#E86A33',
    type: 'experiencia', typeLabel: 'Experiencia',
    tagline: 'Amantes del arte y la cultura rural',
    image: '', imagePrompt: 'Artists laughing joyfully while painting colorful murals on a stone wall in a Spanish village plaza, paint splashes in vibrant colors, warm golden hour light, community celebration atmosphere, photorealistic --ar 1:1',
    own: ['Sesion de Risalegria (taller de humor y creatividad)', 'Espectaculo artistico en vivo', 'Sello exclusivo de arte rural'],
    inherited: ['Todo de Risalegria AuditorIA (50 EUR)'],
    description: 'Vive el arte rural en primera persona. Una sesion de Risalegria donde el humor y la creatividad se unen para generar conexiones autenticas.',
  },
  {
    amount: 100, name: 'Ruta Bano de Bosque', badge: 'Mejor valor', color: '#E86A33',
    type: 'experiencia', typeLabel: 'Experiencia',
    tagline: 'Conectar con la naturaleza y la comunidad',
    image: '', imagePrompt: 'People walking through a misty ancient oak forest in Leon Spain, golden sunlight filtering through canopy, moss-covered trees, group doing breathing exercises, Spanish countryside path, peaceful and immersive atmosphere, photorealistic --ar 1:1',
    own: ['Ruta guiada por el Valle Bello de Leon', 'Sesion de risoterapia en plena naturaleza', 'Degustacion de productos locales artesanales', 'Pasaporte Guardian del Territorio'],
    inherited: ['Todo de El Arte de SuperArte (75 EUR)'],
    description: 'Una experiencia inmersiva: senderismo por el Valle Bello, bano de bosque, risoterapia al aire libre y degustacion de productos de la tierra leonesa. Sales siendo Guardian del Territorio.',
  },
  {
    amount: 175, name: 'Taller de Domo', badge: null, color: '#E86A33',
    type: 'experiencia', typeLabel: 'Experiencia',
    tagline: 'Aprende a construir domos geodesicos',
    image: '', imagePrompt: 'A geodesic dome structure being built by community members in a green Spanish rural valley, wooden framework against blue sky, hands working together, architectural plans visible, warm afternoon light, photorealistic --ar 1:1',
    own: ['Curso completo de construccion de domos geodesicos', 'Acceso permanente al curso online', 'Planos y materiales descargables', 'Certificado de asistencia'],
    inheritsUpTo: 100,
    description: 'Taller practico donde aprenderas a disenar y construir domos geodesicos. Incluye acceso al curso online, planos descargables y certificado. Una experiencia unica para quienes quieren construir con sus propias manos.',
  },
  {
    amount: 200, name: 'Tejedora de Encuentros', badge: null, color: '#C8A96E',
    type: 'experiencia', typeLabel: 'Experiencia',
    tagline: 'Liderar y facilitar el cambio rural',
    image: '', imagePrompt: 'Hands weaving a colorful tapestry that transforms into a map of rural Spanish villages connected by golden threads, overhead view, warm natural fibers, traditional loom with modern digital patterns emerging, photorealistic --ar 1:1',
    own: ['Jornada formativa exclusiva de facilitacion', 'Acceso a la red de facilitadores rurales', 'Grupo privado de gobernanza del proyecto', 'Participacion en decisiones estrategicas'],
    inheritsUpTo: 100,
    description: 'Formacion para convertirte en facilitador/a de facenderas. Acceso al circulo de gobernanza donde se toman las decisiones del proyecto.',
  },
  {
    amount: 300, name: 'Impulsora de Facendera', badge: null, color: '#C8A96E',
    type: 'mecenazgo', typeLabel: 'Mecenazgo',
    tagline: 'Tu nombre vinculado a una facendera real',
    image: '', imagePrompt: 'A person planting a flag with the Rural Makers logo on a hilltop overlooking a patchwork of Spanish rural fields, golden wheat, community gathering below, sunrise, heroic and inspiring composition, photorealistic --ar 1:1',
    own: ['Tu nombre vinculado a UNA facendera piloto', 'Video-resumen personalizado de la jornada', 'Mencion en el documental del proyecto'],
    inheritsUpTo: 100,
    description: 'Apadrina una facendera real. Tu nombre quedara vinculado a una de las 5 facenderas piloto, con video personalizado de la experiencia.',
  },
  {
    amount: 1000, name: 'Sembradora de Facenderas', badge: 'Limitado', color: '#D4A843',
    type: 'mecenazgo', typeLabel: 'Mecenazgo',
    tagline: 'Dejar huella permanente en el territorio',
    image: '', imagePrompt: 'A beautiful memorial garden in a Spanish rural valley, stone pathway with engraved nameplates, native wildflowers and young trees with name tags, morning dew, peaceful and dignified atmosphere, aerial view showing the pattern, photorealistic --ar 1:1',
    own: ['10m2 en el Jardin-Homenaje NaturArt', 'Plantacion de arbol o flores a tu nombre', 'Nombramiento Guardian/a del Jardin', 'Sesion estrategica 1:1 con Alipio', 'Tu logo/nombre en la app durante 1 ano'],
    inheritsUpTo: 100,
    description: 'Tu legado vivo en el territorio. Un espacio permanente en el Jardin-Homenaje con un arbol a tu nombre, mas visibilidad en la plataforma durante un ano.',
  },
  {
    amount: 2000, name: 'Hilandera de Facenderas', badge: 'Exclusivo', color: '#E86A33',
    type: 'mecenazgo', typeLabel: 'Mecenazgo',
    tagline: 'Impacto multiplicado en el territorio',
    image: '', imagePrompt: 'Aerial view of a magnificent garden with a stone monument bearing a golden nameplate, surrounded by four distinct themed garden areas each with native trees, connected by stone paths forming a compass pattern, Leon countryside, photorealistic --ar 1:1',
    own: ['20m2 en el Jardin-Homenaje', '2 arboles plantados a tu nombre', 'Vinculacion a 4 facenderas piloto', 'Mencion especial permanente en la plataforma'],
    inheritsUpTo: 100,
    description: 'Cuadruplica tu impacto: 4 facenderas, 2 arboles, 20m2 de jardin. Tu nombre permanece vinculado al proyecto de forma permanente.',
  },
  {
    amount: 4000, name: 'Eco del Valle', badge: 'Exclusivo', color: '#6B9E50',
    type: 'mecenazgo', typeLabel: 'Mecenazgo',
    tagline: 'El mayor impacto posible',
    image: '', imagePrompt: 'A grand estate garden in a wide Spanish valley, panoramic view showing 50 square meters of beautifully landscaped native garden with 5 majestic trees, stone monument with engraved name, surrounded by wildflower meadows, dramatic cloud-streaked sky, photorealistic --ar 1:1',
    own: ['50m2 en el Jardin-Homenaje NaturArt', '5 arboles plantados a tu nombre', 'Vinculacion a 10 facenderas', 'Asiento en consejo asesor del proyecto', 'Sesion privada de innovacion rural'],
    inheritsUpTo: 100,
    description: 'El maximo nivel de impacto. 50m2 de jardin, 5 arboles, 10 facenderas, asiento permanente en el consejo asesor y sesion exclusiva de innovacion.',
  },
]

export const rewardTypes = [
  { id: 'all', label: 'Todas', icon: '🎁' },
  { id: 'digital', label: 'Digital', icon: '💻' },
  { id: 'experiencia', label: 'Experiencia', icon: '🌿' },
  { id: 'mecenazgo', label: 'Mecenazgo', icon: '🌳' },
]

// Dynamic getter: returns visible rewards (filters hidden ones) from localStorage if available
export function getRewardTiers() {
  try {
    const custom = JSON.parse(localStorage.getItem('rm-rewards-custom'))
    if (custom && Array.isArray(custom) && custom.length > 0) {
      return custom.filter(r => !r.hidden).sort((a, b) => a.amount - b.amount)
    }
  } catch { /* ignore parse errors */ }
  return rewardTiers.filter(r => !r.hidden)
}

// Admin getter: returns ALL rewards including hidden ones (for admin panel)
export function getAllRewardTiers() {
  try {
    const custom = JSON.parse(localStorage.getItem('rm-rewards-custom'))
    if (custom && Array.isArray(custom) && custom.length > 0) {
      return custom.sort((a, b) => a.amount - b.amount)
    }
  } catch { /* ignore parse errors */ }
  return rewardTiers
}

export const collaborations = [
  {
    title: 'Personas Programadoras con IA y Full-Stack',
    description: 'Disenar, implementar y optimizar modelos de IA e integrarlos en la app (frontend + backend). Se requiere Python, frameworks IA, Git y APIs.',
    category: 'Programacion', categoryColor: '#3B82F6',
    status: 'Buscando', statusColor: '#E86A33',
    commitment: '10-20h/mes',
    skills: 'Python, Node.js / Django, Docker, Git',
    icon: '💻',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=70&fit=crop',
  },
  {
    title: 'Expertos/as en Inteligencia Artificial',
    description: 'Colaborar en facenderas sobre IA, creacion de manuales y tutoriales practicos para aplicar IA etica en el mundo rural.',
    category: 'Inteligencia Artificial', categoryColor: '#8B5CF6',
    status: 'Buscando', statusColor: '#E86A33',
    commitment: 'Flexible',
    skills: 'ML, LLMs, Prompting, Pedagogia IA',
    icon: '🧠',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=70&fit=crop',
  },
  {
    title: 'Disenadores Graficos y Makers',
    description: 'Identidad visual, mapas ilustrados, folletos, merchandising sostenible y artesania con materiales naturales. Impresion 3D y grabado laser.',
    category: 'Diseno', categoryColor: '#EC4899',
    status: 'Buscando', statusColor: '#E86A33',
    commitment: 'Por proyecto',
    skills: 'Diseno grafico, impresion 3D, artesania',
    icon: '🎨',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=70&fit=crop',
  },
  {
    title: 'Documentacion y Narrativa Audiovisual',
    description: 'Fotografia, videografia, redaccion de cronicas y edicion para documentar facenderas, rutas del tesoro y momentos de comunidad.',
    category: 'Audiovisual', categoryColor: '#EF4444',
    status: 'Buscando', statusColor: '#E86A33',
    commitment: 'Eventos puntuales',
    skills: 'Fotografia, video, edicion, redaccion',
    icon: '🎬',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=70&fit=crop',
  },
  {
    title: 'Apoyo Logistico y Catering Local',
    description: 'Cocineras/os, productores locales y alojamiento rural para garantizar el bienestar y la magia durante facenderas intensivas.',
    category: 'Logistica', categoryColor: '#F97316',
    status: 'Buscando', statusColor: '#E86A33',
    commitment: 'Eventos presenciales',
    skills: 'Cocina local, alojamiento, transporte',
    icon: '🍳',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=70&fit=crop',
  },
  {
    title: 'Asesores Legales, Fiscales y Gestores',
    description: 'Constitucion de entidades, proteccion IP de la app, cumplimiento fiscal y acceso a fondos publicos europeos y nacionales.',
    category: 'Legal / Fiscal', categoryColor: '#94A3B8',
    status: 'Buscando', statusColor: '#E86A33',
    commitment: 'Consultivo',
    skills: 'Derecho, fiscal, gestion entidades sociales',
    icon: '⚖️',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=70&fit=crop',
  },
  {
    title: 'Espacios para Facenderas y Talleres',
    description: 'Ceder o alquilar espacios para facenderas, almacen de materiales o talleres temporales en la provincia de Leon.',
    category: 'Logistica', categoryColor: '#F97316',
    status: 'Buscando', statusColor: '#E86A33',
    commitment: 'Cesion puntual',
    skills: 'Espacio fisico, accesibilidad',
    icon: '🏠',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=70&fit=crop',
  },
  {
    title: 'Facilitar Rutas y Saberes de Leon',
    description: 'Aportar rutas, lugares de interes, fuentes y tesoros del territorio para el Camino Rural y sus rutas de aprendizaje colectivo.',
    category: 'Facilitacion', categoryColor: '#10B981',
    status: 'Buscando', statusColor: '#E86A33',
    commitment: 'Colaboracion digital',
    skills: 'Conocimiento territorial Leon',
    icon: '🗺',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=70&fit=crop',
  },
  {
    title: 'Fab Lab Leon',
    description: 'Colaboracion en espacio maker para facenderas tecnologicas y prototipado colaborativo. Ya confirmado como partner estrategico.',
    category: 'Artesania / Makers', categoryColor: '#EAB308',
    status: 'Confirmado', statusColor: '#6B9E50',
    commitment: 'Colaboracion estable',
    skills: 'Fabricacion digital',
    icon: '🔧',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=70&fit=crop',
  },
]
