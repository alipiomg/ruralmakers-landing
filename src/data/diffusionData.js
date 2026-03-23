// ─── DATOS SEED PARA SISTEMA DE DIFUSION ──────────────────────

// ─── CONTACTOS ──────────────────────────────────────────────────
export const defaultContacts = [
  { id: 'c1', name: 'Maria Gonzalez', email: 'maria.gonzalez@email.com', phone: '+34612345001', organization: 'Ayuntamiento de Astorga', tags: ['institucional', 'colaborador'], groups: ['g1', 'g4'], notes: 'Concejala de desarrollo rural. Muy interesada en facenderas.', createdAt: '2026-01-15' },
  { id: 'c2', name: 'Carlos Fernandez', email: 'carlos.fernandez@email.com', phone: '+34612345002', organization: 'Diputacion de Leon', tags: ['institucional'], groups: ['g4'], notes: 'Departamento de innovacion rural.', createdAt: '2026-01-20' },
  { id: 'c3', name: 'Elena Rodriguez', email: 'elena.rodriguez@email.com', phone: '+34612345003', organization: 'Cooperativa La Robla', tags: ['colaborador', 'agricultor'], groups: ['g1', 'g5'], notes: 'Permacultora, 15 facenderas completadas.', createdAt: '2026-01-22' },
  { id: 'c4', name: 'Javier Prieto', email: 'javier.prieto@email.com', phone: '+34612345004', organization: 'TechRural Leon', tags: ['colaborador', 'artesano'], groups: ['g1', 'g6'], notes: 'Especialista en IoT aplicado al campo.', createdAt: '2026-02-01' },
  { id: 'c5', name: 'Ana Martin', email: 'ana.martin@prensa.com', phone: '+34612345005', organization: 'Diario de Leon', tags: ['prensa'], groups: ['g3'], notes: 'Periodista seccion rural. Contactar para notas de prensa.', createdAt: '2026-02-05' },
  { id: 'c6', name: 'Roberto Garcia', email: 'roberto.garcia@email.com', phone: '+34612345006', organization: 'Radio Bierzo', tags: ['prensa'], groups: ['g3'], notes: 'Programa "Voces del Campo" los sabados.', createdAt: '2026-02-08' },
  { id: 'c7', name: 'Carmen Alvarez', email: 'carmen.alvarez@email.com', phone: '+34612345007', organization: 'Artesania del Bierzo', tags: ['artesano', 'colaborador'], groups: ['g1', 'g5'], notes: 'Ceramista y tejedora. 18 facenderas.', createdAt: '2026-02-10' },
  { id: 'c8', name: 'Pablo Martinez', email: 'pablo.martinez@email.com', phone: '+34612345008', organization: 'BioConstruct Leon', tags: ['colaborador'], groups: ['g1', 'g6'], notes: 'Experto en bioconstruccion y adobe.', createdAt: '2026-02-12' },
  { id: 'c9', name: 'Laura Sanchez', email: 'laura.sanchez@goteo.org', phone: '+34612345009', organization: 'Goteo', tags: ['donante', 'institucional'], groups: ['g2', 'g4'], notes: 'Coordinadora de proyectos en Goteo.', createdAt: '2026-02-15' },
  { id: 'c10', name: 'Miguel Fernandez', email: 'miguel.fernandez@email.com', phone: '+34612345010', organization: 'Turismo Rural Leon', tags: ['colaborador', 'vecino'], groups: ['g1', 'g5'], notes: 'Guia de rutas de senderismo por la montana leonesa.', createdAt: '2026-02-18' },
  { id: 'c11', name: 'Guillermo Sanchez', email: 'guillermo.sanchez@email.com', phone: '+34612345011', organization: 'Energia Verde Bierzo', tags: ['colaborador'], groups: ['g1'], notes: 'Instalador de paneles solares comunitarios.', createdAt: '2026-02-20' },
  { id: 'c12', name: 'Pilar Vega', email: 'pilar.vega@jcyl.es', phone: '+34612345012', organization: 'Junta de Castilla y Leon', tags: ['institucional'], groups: ['g4'], notes: 'Direccion General de Desarrollo Rural.', createdAt: '2026-02-25' },
  { id: 'c13', name: 'Fernando Lopez', email: 'fernando.lopez@email.com', phone: '+34612345013', organization: 'Universidad de Leon', tags: ['institucional', 'colaborador'], groups: ['g4', 'g6'], notes: 'Profesor de sociologia rural. Investigacion sobre despoblacion.', createdAt: '2026-03-01' },
  { id: 'c14', name: 'Isabel Ramos', email: 'isabel.ramos@email.com', phone: '+34612345014', organization: '', tags: ['vecino', 'donante'], groups: ['g2', 'g5'], notes: 'Vecina de Villafranca. Donante activa en Goteo.', createdAt: '2026-03-05' },
  { id: 'c15', name: 'David Cuesta', email: 'david.cuesta@email.com', phone: '+34612345015', organization: 'Asociacion Indira', tags: ['colaborador', 'vecino'], groups: ['g1', 'g5', 'g6'], notes: 'Miembro fundador. Coordinador de facenderas en La Omana.', createdAt: '2026-03-08' },
]

// ─── GRUPOS ─────────────────────────────────────────────────────
export const defaultGroups = [
  { id: 'g1', name: 'Colaboradores', description: 'Personas que participan activamente en facenderas y proyectos', color: '#4a7c59' },
  { id: 'g2', name: 'Donantes Goteo', description: 'Personas que han donado o estan interesadas en la campana Goteo', color: '#D4A843' },
  { id: 'g3', name: 'Medios de Comunicacion', description: 'Periodistas, medios locales y regionales', color: '#3b82f6' },
  { id: 'g4', name: 'Organizaciones', description: 'Instituciones, ayuntamientos, asociaciones y entidades publicas', color: '#8b5cf6' },
  { id: 'g5', name: 'Vecinos', description: 'Vecinos de pueblos de la provincia de Leon interesados', color: '#8B6914' },
  { id: 'g6', name: 'Embajadores', description: 'Personas clave que difunden el proyecto en sus redes', color: '#ef4444' },
]

// ─── TAGS DISPONIBLES ───────────────────────────────────────────
export const availableTags = [
  'colaborador', 'donante', 'prensa', 'institucional', 'vecino', 'artesano', 'agricultor'
]

// ─── PLANTILLAS EMAIL ───────────────────────────────────────────
export const defaultEmailTemplates = [
  {
    id: 'et1', name: 'Bienvenida', category: 'bienvenida',
    subject: 'Bienvenido/a a Rural Makers, {{nombre}}!',
    body: 'Hola {{nombre}},\n\nGracias por unirte a Rural Makers - Tejiendo Facenderas. Somos una comunidad de personas comprometidas con el desarrollo rural en la provincia de Leon.\n\nEn Rural Makers creemos que el trabajo comunitario (facenderas) es la clave para revitalizar nuestros pueblos. Puedes participar en facenderas, proponer proyectos y conectar con otros makers rurales.\n\nProximamente te enviaremos informacion sobre las proximas actividades.\n\nUn abrazo rural,\nEquipo Rural Makers\n\nAsociacion Indira | La Omana, Leon',
  },
  {
    id: 'et2', name: 'Invitacion a Facendera', category: 'evento',
    subject: 'Te invitamos a la facendera: {{facendera}}',
    body: 'Hola {{nombre}},\n\nQueremos invitarte a nuestra proxima facendera:\n\n{{facendera}}\nFecha: {{fecha}}\n\nLas facenderas son jornadas de trabajo comunitario donde vecinos y colaboradores nos unimos para mejorar nuestros pueblos y aprender juntos.\n\nTu participacion es muy valiosa. Puedes confirmar tu asistencia respondiendo a este email o a traves de la app.\n\nNos vemos!\nEquipo Rural Makers',
  },
  {
    id: 'et3', name: 'Actualizacion Campana', category: 'campana',
    subject: 'Novedades de nuestra campana en Goteo',
    body: 'Hola {{nombre}},\n\nTe escribimos para contarte como va nuestra campana de crowdfunding en Goteo para el proyecto Rural Makers - Tejiendo Facenderas.\n\nGracias al apoyo de personas como tu, estamos avanzando hacia nuestro objetivo. Cada aportacion nos acerca mas a construir la plataforma que conectara comunidades rurales.\n\nPuedes ver el progreso y apoyar en: https://www.goteo.org/project/camino-rural-tejiendo-facenderas\n\nGracias por creer en el mundo rural!\nEquipo Rural Makers',
  },
  {
    id: 'et4', name: 'Agradecimiento Donante', category: 'agradecimiento',
    subject: 'Gracias por tu apoyo, {{nombre}}!',
    body: 'Hola {{nombre}},\n\nQueríamos darte las gracias personalmente por tu apoyo a Rural Makers a traves de Goteo.\n\nTu contribucion no es solo economica: es un voto de confianza en el futuro de nuestros pueblos. Con tu ayuda estamos mas cerca de crear una herramienta que conecte comunidades rurales y facilite el trabajo colaborativo.\n\nTe mantendremos informado/a de cada avance.\n\nCon gratitud,\nAlipio y el equipo Rural Makers\nAsociacion Indira | La Omana, Leon',
  },
  {
    id: 'et5', name: 'Newsletter Mensual', category: 'newsletter',
    subject: 'Rural Makers al dia - Novedades de {{fecha}}',
    body: 'Hola {{nombre}},\n\nAqui tienes las novedades de Rural Makers este mes:\n\n--- FACENDERAS ---\n[Resumen de facenderas realizadas y proximas]\n\n--- PROYECTOS ---\n[Avances en proyectos comunitarios]\n\n--- COMUNIDAD ---\n[Nuevos miembros, logros, historias]\n\n--- CAMPANA GOTEO ---\n[Estado de la financiacion]\n\nSiguenos en redes sociales para estar al dia.\n\nUn abrazo,\nEquipo Rural Makers',
  },
]

// ─── PLANTILLAS WHATSAPP ────────────────────────────────────────
export const defaultWhatsAppTemplates = [
  {
    id: 'wt1', name: 'Bienvenida', category: 'bienvenida',
    body: 'Hola {{nombre}}! Bienvenido/a a Rural Makers - Tejiendo Facenderas. Somos una comunidad que trabaja por el desarrollo rural en Leon. Te mantendremos al tanto de las proximas facenderas y actividades. Un abrazo rural!',
  },
  {
    id: 'wt2', name: 'Invitacion Facendera', category: 'evento',
    body: 'Hola {{nombre}}! Te invitamos a la facendera *{{facendera}}* el {{fecha}}. Es una jornada de trabajo comunitario donde aprendemos y mejoramos nuestros pueblos juntos. Confirma tu asistencia! Mas info en la app Rural Makers.',
  },
  {
    id: 'wt3', name: 'Recordatorio', category: 'evento',
    body: 'Hola {{nombre}}! Recuerda que manana tenemos la facendera *{{facendera}}*. Te esperamos! No olvides traer ropa comoda y ganas de colaborar.',
  },
  {
    id: 'wt4', name: 'Compartir Campana', category: 'campana',
    body: 'Hola {{nombre}}! Estamos impulsando Rural Makers en Goteo. Si te parece interesante, te agradeceriamos mucho que compartieras el enlace: https://www.goteo.org/project/camino-rural-tejiendo-facenderas Cada difusion cuenta!',
  },
  {
    id: 'wt5', name: 'Gracias', category: 'agradecimiento',
    body: 'Hola {{nombre}}! Gracias por tu apoyo a Rural Makers. Tu contribucion marca la diferencia para el futuro de nuestros pueblos. Te mantendremos informado/a de cada avance!',
  },
]

// ─── PLANTILLAS CONTENIDO REDES SOCIALES ────────────────────────
export const defaultContentTemplates = [
  {
    id: 'st1', name: 'Anuncio de Facendera', category: 'facendera',
    platforms: {
      twitter: 'Nueva facendera en Rural Makers! Unete a "{{facendera}}" el {{fecha}}. Trabajo comunitario para revitalizar nuestros pueblos en Leon.',
      instagram: 'Nueva facendera en Rural Makers!\n\nUnete a "{{facendera}}" el {{fecha}}.\n\nEn las facenderas, vecinos y colaboradores nos unimos para trabajar juntos por nuestros pueblos. Es tradicion leonesa puesta al dia.\n\nApuntate y vive la experiencia del trabajo comunitario rural.',
      facebook: 'Nueva facendera en Rural Makers - Tejiendo Facenderas!\n\nOs invitamos a participar en "{{facendera}}" el proximo {{fecha}}.\n\nLas facenderas son jornadas de trabajo comunitario, una tradicion leonesa que estamos recuperando para revitalizar nuestros pueblos. Ven a aprender, colaborar y disfrutar del entorno rural.\n\nMas informacion en nuestra app: ruralmakers.net',
      linkedin: 'Organizamos una nueva facendera: "{{facendera}}" ({{fecha}})\n\nEn Rural Makers recuperamos la tradicion leonesa del trabajo comunitario para abordar los retos de la despoblacion rural con innovacion social y tecnologia.\n\nConectamos personas, saberes y territorios. Si tu organizacion trabaja en desarrollo rural, hablemos.',
    },
    hashtags: ['#RuralMakers', '#Facenderas', '#LeonRural', '#TrabajoComunitario'],
  },
  {
    id: 'st2', name: 'Actualizacion de Proyecto', category: 'proyecto',
    platforms: {
      twitter: 'Avance en el proyecto de Rural Makers! La comunidad sigue creciendo y los resultados son visibles. Gracias a todos los que haceis posible el cambio rural.',
      instagram: 'Avance en Rural Makers!\n\nNuestra comunidad sigue creciendo y los resultados del trabajo colaborativo son cada vez mas visibles.\n\nGracias a cada persona que participa, dona y difunde. Juntos estamos demostrando que otro rural es posible.',
      facebook: 'Actualizacion del proyecto Rural Makers - Tejiendo Facenderas\n\nQueremos compartir con vosotros los ultimos avances. Nuestra comunidad de makers rurales crece cada dia, conectando personas y saberes en la provincia de Leon.\n\nCada facendera, cada proyecto, cada conexion nos acerca al objetivo: un rural vivo, conectado y sostenible.',
      linkedin: 'Actualizacion del proyecto Rural Makers\n\nCompartimos los ultimos avances de nuestra plataforma de innovacion social rural. Estamos conectando comunidades, facilitando el trabajo colaborativo y demostrando que la tecnologia puede ser una herramienta de desarrollo territorial.\n\nBuscamos aliados institucionales y empresariales comprometidos con el reto demografico.',
    },
    hashtags: ['#RuralMakers', '#InnovacionRural', '#DesarrolloRural', '#EspanaVaciada'],
  },
  {
    id: 'st3', name: 'Hito de Comunidad', category: 'hito',
    platforms: {
      twitter: 'Hito Rural Makers! Ya somos mas de 100 makers rurales conectados en Leon. La comunidad crece y el impacto se multiplica. Gracias!',
      instagram: 'HITO alcanzado!\n\nYa somos mas de 100 makers rurales conectados en la provincia de Leon.\n\nCada persona que se une trae sus saberes, su energia y su compromiso con el mundo rural. Juntos estamos tejiendo una red que revitaliza nuestros pueblos.',
      facebook: 'Hito de comunidad en Rural Makers!\n\nEstamos orgullosos de anunciar que ya somos mas de 100 makers rurales conectados en la provincia de Leon. Cada persona aporta sus conocimientos unicos: agricultura, artesania, tecnologia, energia renovable...\n\nGracias a todos por hacer de Rural Makers una realidad.',
      linkedin: 'Rural Makers alcanza un hito significativo: mas de 100 profesionales y entusiastas del mundo rural conectados en nuestra plataforma en la provincia de Leon.\n\nEsta red multidisciplinar (agricultura, tecnologia, artesania, energia) demuestra el potencial de la colaboracion para abordar la despoblacion rural.',
    },
    hashtags: ['#RuralMakers', '#Comunidad', '#LeonRural', '#ImpactoSocial'],
  },
  {
    id: 'st4', name: 'Invitacion a Evento', category: 'evento',
    platforms: {
      twitter: 'Proximo evento Rural Makers! No te pierdas "{{facendera}}" el {{fecha}}. Abierto a todos los que quieran conocer el trabajo comunitario rural.',
      instagram: 'PROXIMO EVENTO\n\n"{{facendera}}"\nFecha: {{fecha}}\n\nUna oportunidad unica para vivir el trabajo comunitario rural en primera persona. Abierto a todos: vecinos, curiosos, profesionales.\n\nVen a descubrir las facenderas!',
      facebook: 'EVENTO: "{{facendera}}"\nFecha: {{fecha}}\n\nOs invitamos a nuestro proximo evento de Rural Makers. Las facenderas son jornadas de trabajo comunitario abiertas a todos. Una forma unica de conectar con el mundo rural, aprender oficios tradicionales y contribuir a la revitalizacion de nuestros pueblos.\n\nInscripcion gratuita. Plazas limitadas.',
      linkedin: 'Proximo evento de Rural Makers: "{{facendera}}" ({{fecha}})\n\nOrganizamos una jornada de trabajo comunitario (facendera) abierta a profesionales interesados en innovacion social rural. Una oportunidad de networking y aprendizaje experiencial en el entorno rural leones.',
    },
    hashtags: ['#RuralMakers', '#Evento', '#Facenderas', '#LeonRural'],
  },
  {
    id: 'st5', name: 'Campana Goteo', category: 'campana',
    platforms: {
      twitter: 'Apoya Rural Makers en @gaborigen! Estamos construyendo la app que conectara comunidades rurales. Cada euro cuenta para combatir la despoblacion con tecnologia y tradicion.',
      instagram: 'APOYA RURAL MAKERS EN GOTEO!\n\nEstamos en campana de crowdfunding para construir la app que conectara comunidades rurales en Leon.\n\nCon tu apoyo podemos crear una herramienta que facilite las facenderas, conecte personas y revitalice pueblos.\n\nEnlace en bio!',
      facebook: 'CAMPANA DE CROWDFUNDING - RURAL MAKERS\n\nEstamos recaudando fondos en Goteo para construir RuralMakers.app, la plataforma que conectara comunidades rurales en la provincia de Leon.\n\nCon tu aportacion podemos hacer realidad una herramienta de trabajo comunitario, conexion de saberes y desarrollo territorial.\n\nApoya en: https://www.goteo.org/project/camino-rural-tejiendo-facenderas',
      linkedin: 'Lanzamos campana de crowdfunding en Goteo para Rural Makers\n\nBuscamos financiacion para desarrollar RuralMakers.app, una plataforma de innovacion social que conecta comunidades rurales mediante el trabajo colaborativo (facenderas).\n\nEl proyecto aborda el reto demografico con un enfoque que combina tradicion comunitaria y tecnologia. Buscamos el apoyo de organizaciones comprometidas con el desarrollo rural.',
    },
    hashtags: ['#RuralMakers', '#Crowdfunding', '#Goteo', '#ApoyaLoRural', '#EspanaVaciada'],
  },
]

// ─── HASHTAGS PREDEFINIDOS ──────────────────────────────────────
export const defaultHashtags = [
  '#RuralMakers', '#Facenderas', '#TejiendoFacenderas', '#LeonRural',
  '#EspanaVaciada', '#ComunidadRural', '#InnovacionRural', '#TrabajoComunitario',
  '#DesarrolloRural', '#Crowdfunding', '#Goteo', '#ApoyaLoRural',
  '#ImpactoSocial', '#MundoRural', '#PueblosVivos', '#SaberesRurales',
]

// ─── PLATAFORMAS SOCIALES ───────────────────────────────────────
export const socialPlatforms = [
  { id: 'twitter', name: 'Twitter/X', maxChars: 280, color: '#000000', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { id: 'instagram', name: 'Instagram', maxChars: 2200, color: '#E1306C', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
  { id: 'facebook', name: 'Facebook', maxChars: 63206, color: '#1877F2', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  { id: 'linkedin', name: 'LinkedIn', maxChars: 3000, color: '#0A66C2', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
]

// ─── DATOS DE EJEMPLO PARA PREVIEW DE VARIABLES ────────────────
export const sampleVariableData = {
  nombre: 'Maria Gonzalez',
  grupo: 'Colaboradores',
  facendera: 'Restauracion Molino La Robla',
  fecha: '15 de abril 2026',
  organizacion: 'Asociacion Indira',
  enlace_goteo: 'https://www.goteo.org/project/camino-rural-tejiendo-facenderas',
}

// ─── CATEGORIAS DE PLANTILLAS ───────────────────────────────────
export const templateCategories = [
  { id: 'bienvenida', label: 'Bienvenida', color: '#4a7c59' },
  { id: 'evento', label: 'Evento', color: '#3b82f6' },
  { id: 'campana', label: 'Campana', color: '#D4A843' },
  { id: 'agradecimiento', label: 'Agradecimiento', color: '#ef4444' },
  { id: 'newsletter', label: 'Newsletter', color: '#8b5cf6' },
]

export const contentCategories = [
  { id: 'facendera', label: 'Facendera', color: '#4a7c59' },
  { id: 'proyecto', label: 'Proyecto', color: '#3b82f6' },
  { id: 'hito', label: 'Hito', color: '#D4A843' },
  { id: 'evento', label: 'Evento', color: '#ef4444' },
  { id: 'campana', label: 'Campana', color: '#8b5cf6' },
]
