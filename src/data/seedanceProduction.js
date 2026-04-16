// ═══════════════════════════════════════════════════════════════════
// SEEDANCE 2 — CICLOS IMAGEN + VIDEO ADAPTADOS
// Rural Makers: Tejiendo Facenderas, Sembrando Futuro
// ═══════════════════════════════════════════════════════════════════
//
// DIFERENCIA CON sceneCycles (videoPrompts.js):
//   - sceneCycles: 1 imagen → animar esa imagen con Kling/Runway
//   - seedanceCycles: FOTO INICIO + FOTO FINAL → 15s video fluido con Seedance 2
//   - La FOTO FINAL del clip N = FOTO INICIO del clip N+1 (cadena encadenada)
//
// CAMBIOS vs original:
//   - ELIMINADOS: testimonios (cy14, cy15, cy16)
//   - SEPARADOS: motion graphics (logo, mapa, recompensas) → capcut inserts
//   - REORGANIZADOS: los prompts de imagen originales se reutilizan como nodos de cadena
//
// RESULTADO: 13 imagenes → 12 clips Seedance (12 × 15s = 3:00)
//            + 3 inserts CapCut (~20s) = ~3:20 total
// ═══════════════════════════════════════════════════════════════════

import { sceneCycles } from './videoPrompts.js'

// ─── CADENA DE IMAGENES (NODOS) ───────────────────────────────────
// Cada nodo es una imagen. Los clips Seedance se forman con pares consecutivos.
// Los imagePrompt reutilizan los de sceneCycles donde es posible.
// TODAS las imagenes deben ser 1920x1080 (16:9) exacto.

export const seedanceImageChain = [
  // ═══ ACTO 1: BELLEZA Y GANCHO (0:00 - 0:15) ═══
  {
    id: 'SD_01',
    basedOn: 'cy1 (Intro - Amanecer Leon)',
    name: 'Amanecer montanas de Leon',
    imagePrompt: {
      tool: 'Midjourney / DALL-E / Ideogram',
      // Mismo prompt que cy1 - paisaje aereo de Leon al amanecer
      prompt: 'Breathtaking panoramic landscape photograph of León province, Spain at golden hour sunrise. Misty green valleys between dramatic mountain ridges. A small traditional stone village with red clay tile roofs nestled in the valley below. Wildflowers in the immediate foreground, rolling hills in middle ground, snow-capped Cantabrian mountains in background. Volumetric fog in the valleys catching golden sunlight. Shot on Hasselblad medium format camera. National Geographic award-winning landscape photography. Aspect ratio 16:9. --ar 16:9 --v 6.1 --style raw',
      resolution: '1920x1080 (16:9 horizontal)',
      tips: 'Usar --ar 16:9 en Midjourney. La niebla en los valles da profundidad y ayuda a Seedance a crear movimiento fluido.',
    },
    chainRole: 'START del Clip 1',
    compositionGuide: 'Horizonte en tercio superior. Niebla en centro. Verde/flores abajo.',
  },
  {
    id: 'SD_02',
    basedOn: 'NUEVO (puente entre cy1 y cy3)',
    name: 'Calle de pueblo al amanecer (bella)',
    imagePrompt: {
      tool: 'Midjourney / DALL-E',
      prompt: 'Beautiful cobblestone street of a traditional stone village in León Spain at golden hour morning. Old stone houses with slate roofs, wooden balconies with flower pots. Warm golden sunlight streaming down the street. A cat sitting on a windowsill. The street is empty but feels alive and warm. Potted geraniums on doorsteps. Church bell tower visible at the end of the street. Documentary photography style, wide angle 24mm lens. Warm golden tones. --ar 16:9 --v 6.1 --style raw',
      resolution: '1920x1080 (16:9)',
      tips: 'COMPOSICION CLAVE: calle en perspectiva central. SD_03 tendra la MISMA composicion pero abandonada. Seedance morfeara el cambio de estado.',
    },
    chainRole: 'END del Clip 1 / START del Clip 2',
    compositionGuide: 'Calle centrada en perspectiva. Edificios a ambos lados. Cielo en banda superior.',
    transitionNote: 'Del aereo (SD_01) al nivel de calle (SD_02). Seedance hara descenso fluido. El color dorado conecta ambas.',
  },

  // ═══ ACTO 2: EL PROBLEMA (0:15 - 0:45) ═══
  {
    id: 'SD_03',
    basedOn: 'cy3 (Problema - Calle vacia)',
    name: 'Calle de pueblo abandonada',
    imagePrompt: {
      tool: 'Midjourney / DALL-E',
      // Adaptado de cy3 - MISMA composicion que SD_02 pero abandonada
      prompt: 'Empty cobblestone street in an abandoned Spanish village, SAME COMPOSITION as a warm village street but now desolate. Old stone houses with closed wooden shutters and peeling paint. A rusted "SE VENDE" (For Sale) sign on one door. Dead potted plant on a windowsill where there used to be flowers. Overcast grey sky replacing the golden light. A single dried leaf on the ground. Desolate, melancholic atmosphere. Desaturated cool blue-grey color palette. Documentary photography style, wide angle lens 24mm. --ar 16:9 --v 6.1 --style raw',
      resolution: '1920x1080 (16:9)',
      tips: 'CRITICO: misma perspectiva/angulo que SD_02. Solo cambia el estado: de vivo/dorado a muerto/gris. Seedance transicionara el color y estado fluidamente.',
    },
    chainRole: 'END del Clip 2 / START del Clip 3',
    compositionGuide: 'IDENTICA a SD_02: calle centrada en perspectiva. Misma direccion, misma distancia focal.',
    transitionNote: 'El truco: SD_02 y SD_03 son el MISMO lugar en distinto estado. Seedance creara una transicion devastadora de vida→abandono.',
  },
  {
    id: 'SD_04',
    basedOn: 'cy4 (Problema - Escuela cerrada)',
    name: 'Escuela rural cerrada',
    imagePrompt: {
      tool: 'Midjourney / DALL-E',
      // Mismo prompt que cy4
      prompt: 'Exterior of a closed rural school in Spain. Faded "COLEGIO PUBLICO" sign above the entrance. Rusty padlock on iron gate. Playground with overgrown weeds. Empty swings still slightly moving. Cloudy sky. Nostalgic, sad atmosphere. Documentary photography, slightly underexposed. Cool desaturated tones. --ar 16:9 --v 6.1',
      resolution: '1920x1080 (16:9)',
      tips: 'Los columpios vacios son un simbolo potente. Mantener tonos frios como SD_03.',
    },
    chainRole: 'END del Clip 3 / START del Clip 4',
    compositionGuide: 'Escuela centrada. Columpios en primer plano o lateral. Cielo gris arriba.',
    transitionNote: 'De calle a escuela: ambas abandonadas, misma paleta fria. Transicion natural.',
  },
  {
    id: 'SD_05',
    basedOn: 'cy5 (Problema - Ventana cerrada)',
    name: 'Interior oscuro, ventana cerrada',
    imagePrompt: {
      tool: 'Midjourney / DALL-E',
      // Primera parte de cy5 - la ventana CERRADA
      prompt: 'Interior of dark old stone house looking toward a wooden window that is CLOSED. Thin lines of light seep through the cracks of the closed shutters. The interior is cool and dark blue tones. Dust particles barely visible in the faint light. Stone walls, dusty wooden floor. Cobwebs in corners. The window is the central focal point of the composition. Melancholic, abandoned atmosphere. Cinematic composition, Vermeer lighting. --ar 16:9 --v 6.1',
      resolution: '1920x1080 (16:9)',
      tips: 'COMPOSICION CLAVE: ventana centrada. SD_06 tendra EXACTA misma composicion pero con ventana abierta. Seedance "abrira" la ventana.',
    },
    chainRole: 'END del Clip 4 / START del Clip 5',
    compositionGuide: 'Ventana centrada al fondo. Marco oscuro alrededor. Unica fuente de luz: rendijas.',
    transitionNote: 'De exterior escuela a interior casa. Seguimos en el mundo del abandono.',
  },

  // ═══ ACTO 3: EL GIRO - LA LUZ (0:45 - 1:00) ═══
  {
    id: 'SD_06',
    basedOn: 'cy5 (Problema - Ventana ABIERTA)',
    name: 'Ventana abierta, luz dorada inunda',
    imagePrompt: {
      tool: 'Midjourney / DALL-E',
      // Segunda parte de cy5 - la ventana ABIERTA. PUNTO DE GIRO del video.
      prompt: 'Interior of dark old stone house, SAME EXACT COMPOSITION AND ANGLE as the closed window shot. But now the wooden window is WIDE OPEN. Bright warm golden sunlight streaming through the opening, creating dramatic light beams with visible dust particles dancing in the golden light. The interior transforms from cool dark blue to warm golden. The window opens to a green landscape with rolling hills. Strong contrast between remaining shadows and the overwhelming warm light. Hopeful, transformative, magical atmosphere. Cinematic composition, Vermeer lighting. --ar 16:9 --v 6.1',
      resolution: '1920x1080 (16:9)',
      tips: 'LA IMAGEN MAS IMPORTANTE DEL VIDEO. Misma composicion EXACTA que SD_05. Solo cambia: ventana abierta + luz dorada inundando. Seedance hara magia con este par.',
    },
    chainRole: 'END del Clip 5 / START del Clip 6',
    compositionGuide: 'IDENTICA a SD_05. Ventana centrada. Pero ahora TODO es luz dorada.',
    transitionNote: '★★★ CLIP ESTRELLA. Seedance morfeara de oscuridad a luz. La ventana "se abre". Este momento cambia todo el tono del video.',
  },

  // ═══ ACTO 4: LA SOLUCION EN ACCION (1:00 - 2:00) ═══
  {
    id: 'SD_07',
    basedOn: 'cy6 (Solucion - Personas llegando al pueblo)',
    name: 'Grupo diverso caminando hacia pueblo',
    imagePrompt: {
      tool: 'Midjourney / DALL-E',
      // Mismo prompt que cy6
      prompt: 'Warm photograph of diverse group of people walking together toward a Spanish stone village. Young and old, some carrying laptops, others with gardening tools, one with a camera. Dirt path between green fields. Village visible in background with church tower. Late morning golden sunlight. Hopeful, energetic atmosphere. Documentary photography style. People laughing and talking. --ar 16:9 --v 6.1 --style raw',
      resolution: '1920x1080 (16:9)',
      tips: 'La diversidad de edades y herramientas (laptops + azadas) es clave para Rural Makers. Ver personas de espaldas caminando HACIA el pueblo.',
    },
    chainRole: 'END del Clip 6 / START del Clip 7',
    compositionGuide: 'Grupo centrado en camino. Pueblo al fondo. Campos a los lados. Camino en perspectiva.',
    transitionNote: 'De interior luminoso a exterior con personas. La luz dorada conecta ambas escenas. EXPLOSION de color y vida despues de la oscuridad.',
  },
  {
    id: 'SD_08',
    basedOn: 'cy7 (Solucion - Facendera huerto)',
    name: 'Manos plantando en huerto comunitario',
    imagePrompt: {
      tool: 'Midjourney / DALL-E',
      // Mismo prompt que cy7
      prompt: 'Close-up photograph of weathered hands planting seedlings in rich dark soil in a community garden. Other people working blurred in background. Small wooden signs marking different crops. A child handing a seedling to an elderly person. Warm afternoon sunlight creating rim light on the hands. Shallow depth of field, f/2.8. Documentary photography. --ar 16:9 --v 6.1 --style raw',
      resolution: '1920x1080 (16:9)',
      tips: 'Close-ups de manos son emotivos y Seedance los transiciona bien. El paso de planta entre generaciones = simbolismo.',
    },
    chainRole: 'END del Clip 7 / START del Clip 8',
    compositionGuide: 'Manos centradas. Tierra oscura abajo. Verde difuminado arriba. Luz lateral.',
    transitionNote: 'De plano general (grupo) a primer plano (manos). Seedance hara un zoom-in fluido natural.',
  },
  {
    id: 'SD_09',
    basedOn: 'cy8 (Solucion - Tecnologia)',
    name: 'Ensenanza tecnologica en plaza de pueblo',
    imagePrompt: {
      tool: 'Midjourney / DALL-E',
      // Mismo prompt que cy8
      prompt: 'Photograph of young woman teaching elderly man to use a tablet computer outdoors in a Spanish rural village plaza. Stone benches, ancient tree providing shade. Both are focused on the screen, the man is smiling with understanding. Solar panel visible on a nearby rooftop. Laptop on the bench beside them. Warm natural lighting, authentic documentary style. --ar 16:9 --v 6.1 --style raw',
      resolution: '1920x1080 (16:9)',
      tips: 'El intercambio intergeneracional es el core de Rural Makers. Panel solar en fondo refuerza innovacion.',
    },
    chainRole: 'END del Clip 8 / START del Clip 9',
    compositionGuide: 'Dos personas centradas en banco. Arbol arriba. Plaza alrededor. Plano medio.',
    transitionNote: 'De close-up manos a plano medio personas. Seedance transiciona de naturaleza a tecnologia.',
  },
  {
    id: 'SD_10',
    basedOn: 'cy9 (Solucion - Taller artesanal)',
    name: 'Taller de ceramica',
    imagePrompt: {
      tool: 'Midjourney / DALL-E',
      // Mismo prompt que cy9
      prompt: 'Interior of a rustic stone workshop in a Spanish village. A woman is shaping clay on a pottery wheel while two students watch and learn. Warm light from a window. Shelves with finished ceramics. Wooden tools hanging on wall. Clay dust particles visible in sunbeam. Rich earth tones, browns and terracotta. Artisan workshop photography. --ar 16:9 --v 6.1',
      resolution: '1920x1080 (16:9)',
      tips: 'La ceramica es saber tradicional de Leon. Particulas de polvo en la luz = profundidad cinematografica.',
    },
    chainRole: 'END del Clip 9 / START del Clip 10',
    compositionGuide: 'Interior. Persona con torno centrada. Luz de ventana lateral. Estanterias al fondo.',
    transitionNote: 'De exterior plaza a interior taller. La ventana con luz conecta ambas escenas.',
  },
  {
    id: 'SD_11',
    basedOn: 'cy10 (Facendera - Paneles solares)',
    name: 'Instalacion paneles solares comunitarios',
    imagePrompt: {
      tool: 'Midjourney / DALL-E',
      // Mismo prompt que cy10
      prompt: 'Photograph of diverse group installing solar panels on the roof of a rural community building in Spain. Blue sky with white clouds. The village visible in background with mountains. People on the roof working as a team, one pointing up, another holding a panel. Safety equipment visible. Bright, optimistic lighting. High angle shot showing both the workers and the landscape. --ar 16:9 --v 6.1 --style raw',
      resolution: '1920x1080 (16:9)',
      tips: 'Plano desde arriba para ver contexto. Paneles solares = innovacion rural. Cielo azul con nubes da textura.',
    },
    chainRole: 'END del Clip 10 / START del Clip 11',
    compositionGuide: 'Personas en tejado, cielo arriba, pueblo/montanas abajo. Angular.',
    transitionNote: 'De interior taller a exterior tejado. Ambos son "trabajo comunitario", la tematica conecta.',
  },
  {
    id: 'SD_12',
    basedOn: 'cy12 (App - Manos con movil en campo)',
    name: 'App Rural Makers en el campo',
    imagePrompt: {
      tool: 'Midjourney / DALL-E',
      // Mismo prompt que cy12
      prompt: 'Close-up photograph of hands holding a modern smartphone in a green rural landscape. The phone screen shows a colorful community app with a map displaying nearby events marked with green pins. Blurred background of rolling green hills and a stone village. Shallow depth of field f/1.8. The hands appear weathered but capable - a rural workers hands holding modern technology. Golden hour side lighting. --ar 16:9 --v 6.1 --style raw',
      resolution: '1920x1080 (16:9)',
      tips: 'Manos de trabajador rural + smartphone = esencia del proyecto. Shallow DOF para separar del fondo.',
    },
    chainRole: 'END del Clip 11 / START del Clip 12',
    compositionGuide: 'Manos con movil centradas. Paisaje difuminado de fondo. Primer plano.',
    transitionNote: 'De paneles/tejado a movil/campo. Ambos con paisaje de fondo verde que conecta.',
  },

  // ═══ ACTO 5: CIERRE EMOTIVO + CTA (2:00 - 3:00) ═══
  {
    id: 'SD_13',
    basedOn: 'cy19 (Cierre - Atardecer grupal)',
    name: 'Siluetas en colina al atardecer',
    imagePrompt: {
      tool: 'Midjourney / DALL-E',
      // Mismo prompt que cy19
      prompt: 'Silhouette of a group of 8-10 people standing together on a hilltop overlooking a vast rural Spanish landscape at sunset. Orange and purple sky with dramatic clouds. Green rolling hills below. Some people have arms around each others shoulders. One person points toward the horizon. Inspirational, hopeful composition. Epic wide shot. --ar 16:9 --v 6.1 --style raw',
      resolution: '1920x1080 (16:9)',
      tips: 'Siluetas al atardecer son IDEALES para Seedance: no necesita generar detalles faciales, solo formas. Resultado mas limpio.',
    },
    chainRole: 'END del Clip 12 / START del Clip 13 (si se usa clip CTA Seedance)',
    compositionGuide: 'Siluetas en tercio inferior. Cielo dramatico en 2/3 superiores. Horizonte bajo.',
    transitionNote: 'De close-up movil a wide shot siluetas. Gran cambio de escala pero el atardecer crea conexion emocional.',
  },
]

// ─── LOS 12 CLIPS SEEDANCE ───────────────────────────────────────
// Cada clip = 15 segundos generado por Seedance 2
// START de cada clip = imagen con id startImage
// END de cada clip = imagen con id endImage
// La END de clip N = START de clip N+1

export const seedanceClips = [
  {
    clip: 1,
    name: 'Descubriendo Leon',
    act: 'GANCHO',
    startImage: 'SD_01',
    endImage: 'SD_02',
    time: '0:00 - 0:15',
    seedancePrompt: 'Slow cinematic aerial camera descending from mountain panorama through golden morning mist. The camera gently pushes forward and descends, gradually revealing a traditional stone village street below. Golden sunrise light throughout. Warm tones. Smooth continuous movement from high to ground level.',
    subtitle: 'En los valles de Leon,\nlos pueblos guardan un secreto...',
    subtitleTiming: { start: 2, end: 13 },
    mood: 'Asombro, descubrimiento, belleza',
    soundDesign: 'Musica: guitarra suave, nota inicial | Ambiente: viento montanas, pajaros lejanos',
  },
  {
    clip: 2,
    name: 'El silencio llega',
    act: 'PROBLEMA',
    startImage: 'SD_02',
    endImage: 'SD_03',
    time: '0:15 - 0:30',
    seedancePrompt: 'The warm golden village street gradually and hauntingly loses its color and warmth. Light shifts from golden to grey overcast. Flowers wilt and fade. Paint slowly peels on walls. The vibrant atmosphere transforms into cold abandonment. Same street, same angle, but life drains away. Slow, melancholic, inevitable transformation.',
    subtitle: 'Pero cada ano,\nmas calles se quedan en silencio.',
    subtitleTiming: { start: 2, end: 13 },
    mood: 'Melancolia, perdida gradual',
    soundDesign: 'Musica: guitarra se apaga | Ambiente: pajaros desaparecen → viento frio, silencio',
    productionNote: '★ CRITICO: SD_02 y SD_03 deben tener MISMA composicion/angulo. Solo cambia color y estado. Es la clave para que Seedance haga un morph devastador.',
  },
  {
    clip: 3,
    name: 'Escuelas vacias',
    act: 'PROBLEMA',
    startImage: 'SD_03',
    endImage: 'SD_04',
    time: '0:30 - 0:45',
    seedancePrompt: 'Moving through the abandoned grey village street toward a closed school building. The scene transitions from the desolate street to the exterior of a rural school with a rusty padlock, overgrown weeds in the playground, and empty swings barely moving in the wind. Overcast, desaturated, documentary style. Slow forward movement.',
    subtitle: 'El 53% de los municipios espanoles\npierde poblacion.',
    subtitleTiming: { start: 2, end: 13 },
    mood: 'Dato impactante, desolacion',
    soundDesign: 'Ambiente: viento, crujido metalico de columpios | Sin musica (silencio dramatico)',
  },
  {
    clip: 4,
    name: 'Entrando en la oscuridad',
    act: 'PROBLEMA → GIRO',
    startImage: 'SD_04',
    endImage: 'SD_05',
    time: '0:45 - 1:00',
    seedancePrompt: 'From the exterior of the closed school, the view transitions into the dark interior of an abandoned stone house. The overcast grey exterior morphs into a dark dusty interior. A closed wooden window becomes visible at the far wall with thin lines of light seeping through cracks. The atmosphere shifts from exterior desolation to interior darkness. Cold blue-grey tones deepen.',
    subtitle: 'Y si pudieramos cambiarlo?',
    subtitleTiming: { start: 3, end: 12 },
    mood: 'Pregunta retorica, minimo de oscuridad antes del giro',
    soundDesign: 'Ambiente: silencio interior, crujido de madera vieja | Musica: nota grave sostenida',
  },
  {
    clip: 5,
    name: '★ LA LUZ ENTRA ★',
    act: 'GIRO NARRATIVO',
    startImage: 'SD_05',
    endImage: 'SD_06',
    time: '1:00 - 1:15',
    seedancePrompt: 'In the dark stone room, the closed wooden window slowly and magically opens. Golden sunlight floods in progressively, filling the entire room with warmth and hope. Dust particles begin dancing brilliantly in the expanding light beams. The room transforms completely from cold dark blue to warm golden. The transformation is gradual, beautiful, and dramatic. Pure visual poetry of darkness becoming light.',
    subtitle: 'En Leon existe una tradicion:\nla facendera.',
    subtitleTiming: { start: 2, end: 14 },
    mood: '★★★ PUNTO DE GIRO. De oscuridad total a luz total. El momento emotivo del video.',
    soundDesign: 'Crujido de ventana → pajaros entrando → guitarra vuelve con fuerza | Momento de escalofrios',
    productionNote: '★★★ EL CLIP MAS IMPORTANTE. SD_05 y SD_06 DEBEN tener MISMA composicion exacta. Solo cambia: ventana cerrada→abierta, oscuridad→luz. Generar 3-4 variantes y elegir la mas emotiva.',
  },
  {
    clip: 6,
    name: 'Personas llegan',
    act: 'SOLUCION',
    startImage: 'SD_06',
    endImage: 'SD_07',
    time: '1:15 - 1:30',
    seedancePrompt: 'Through the open window flooded with golden light, the view expands and transitions outward to a sunlit rural landscape. A diverse group of people appears walking together along a dirt path toward a stone village. The intimate interior space opens up into a wide, hopeful exterior. People carry tools, laptops, baskets. The golden light from the window connects seamlessly to the golden outdoor sunlight.',
    subtitle: 'Vecinos que se unen\npara construir juntos.',
    subtitleTiming: { start: 2, end: 13 },
    mood: 'Esperanza, comunidad, movimiento, energia',
    soundDesign: 'Interior silencio → exterior: pasos en camino, risas lejanas, pajaros | Musica sube de ritmo',
  },
  {
    clip: 7,
    name: 'Sembrando',
    act: 'SOLUCION',
    startImage: 'SD_07',
    endImage: 'SD_08',
    time: '1:30 - 1:45',
    seedancePrompt: 'The group walking toward the village gradually disperses. The wide exterior shot slowly transitions into an intimate close-up. Hands appear planting seedlings in rich dark soil. A child hand offers a seedling to elderly hands. The wide landscape transforms into a macro world of earth, roots, and green growth. Warm golden rim light on the hands.',
    subtitle: 'Huertos, talleres, energia solar,\ntecnologia... todo suma.',
    subtitleTiming: { start: 2, end: 13 },
    mood: 'Conexion con la tierra, trabajo manual, generaciones',
    soundDesign: 'Pasos → tierra removida, herramientas suaves, pajaros cercanos',
  },
  {
    clip: 8,
    name: 'Saberes compartidos',
    act: 'SOLUCION',
    startImage: 'SD_08',
    endImage: 'SD_09',
    time: '1:45 - 2:00',
    seedancePrompt: 'The close-up of hands planting in soil gradually pulls back. The earth and green plants transform into a stone village plaza. Two people come into focus sitting on a bench: a young woman teaching an elderly man to use a tablet. The intimate natural world opens to reveal technology meeting tradition. Warm dappled sunlight through tree leaves.',
    subtitle: 'Rural Makers conecta\npersonas, saberes y territorios.',
    subtitleTiming: { start: 2, end: 13 },
    mood: 'Intercambio intergeneracional, tecnologia accesible',
    soundDesign: 'Naturaleza suave → ambiente plaza pueblo, conversacion lejana',
  },
  {
    clip: 9,
    name: 'Artesania viva',
    act: 'SOLUCION',
    startImage: 'SD_09',
    endImage: 'SD_10',
    time: '2:00 - 2:15',
    seedancePrompt: 'From the outdoor village plaza scene, the view transitions into the warm interior of a stone workshop. A woman shapes clay on a pottery wheel. Students watch and learn. The outdoor light becomes warm window light illuminating the workshop. Clay dust particles dance in the sunbeam, connecting to the golden light throughout the video. Rich earth tones emerge.',
    subtitle: 'Cada persona aporta lo que sabe\ny recibe lo que necesita.',
    subtitleTiming: { start: 2, end: 13 },
    mood: 'Patrimonio cultural, aprendizaje, belleza del oficio',
    soundDesign: 'Plaza → interior silencioso, torno girando suave, ceramica',
  },
  {
    clip: 10,
    name: 'Energia colectiva',
    act: 'SOLUCION',
    startImage: 'SD_10',
    endImage: 'SD_11',
    time: '2:15 - 2:30',
    seedancePrompt: 'From the pottery workshop interior, the perspective rises upward and transitions to a rooftop. A group installs solar panels on a community building. The indoor craft space opens to bright blue sky. The intimate workshop transforms into an expansive elevated view with mountains and village below. Energy and teamwork atmosphere. Bright, optimistic.',
    subtitle: 'Una comunidad que construye\nsu propio futuro.',
    subtitleTiming: { start: 2, end: 13 },
    mood: 'Innovacion colectiva, progreso, energia',
    soundDesign: 'Interior → viento de altura, herramientas, trabajo en equipo',
  },
  {
    clip: 11,
    name: 'La herramienta',
    act: 'SOLUCION → CIERRE',
    startImage: 'SD_11',
    endImage: 'SD_12',
    time: '2:30 - 2:45',
    seedancePrompt: 'From the rooftop solar panel scene, the camera descends and focuses on a pair of hands holding a smartphone. The wide rooftop view transforms into a close-up of weathered rural hands on a modern phone screen showing a community map. The blue sky becomes a blurred green rural landscape behind the phone. Technology connecting to community.',
    subtitle: 'Descubre facenderas cerca de ti.\nConecta. Participa. Crea.',
    subtitleTiming: { start: 2, end: 13 },
    mood: 'La app como puente entre todo lo anterior',
    soundDesign: 'Exterior → enfoque intimo, sonido de notificacion suave',
  },
  {
    clip: 12,
    name: 'Horizonte',
    act: 'CIERRE EMOTIVO',
    startImage: 'SD_12',
    endImage: 'SD_13',
    time: '2:45 - 3:00',
    seedancePrompt: 'The close-up of hands with smartphone gradually expands into a majestic wide shot. The scene transforms to golden hour sunset. Silhouettes of 8-10 people stand together on a hilltop overlooking the vast rural landscape. The phone screen glow becomes the sunset glow. Orange and purple dramatic sky. One person points toward the horizon. Epic, emotional, cinematic finale. Camera slowly pulls back revealing the scale.',
    subtitle: 'Tejiendo facenderas,\nsembrando futuro.',
    subtitleTiming: { start: 3, end: 14 },
    mood: 'Epico, emotivo, vision de futuro compartido',
    soundDesign: 'Musica: crescendo final, todos los instrumentos | Viento suave → nota sostenida',
  },
]

// ─── SEGMENTOS CAPCUT (motion graphics, NO Seedance) ──────────────
// Estos se montan en CapCut entre/despues de los clips Seedance.
// NO usan Seedance 2. Se crean manualmente con motion graphics.

export const capcutInserts = [
  {
    id: 'CUT_01',
    basedOn: 'cy2 (Logo Rural Makers)',
    name: 'Logo reveal',
    insertAfter: 'Clip 1 (al inicio, antes de que empiece el problema)',
    duration: '3s',
    description: 'Logo Rural Makers con fade in, scale 1.1→1.0, glow verde suave. Texto "Tejiendo Facenderas" con typewriter.',
    tool: 'CapCut / DaVinci Resolve',
    notes: 'Transicion cross-dissolve de 0.5s desde el clip anterior. Musica: nota sostenida.',
  },
  {
    id: 'CUT_02',
    basedOn: 'cy13 (Mapa conexiones)',
    name: 'Mapa de comunidades conectadas',
    insertAfter: 'Clip 11 (despues de la app, antes del cierre)',
    duration: '5-6s',
    description: 'Mapa estilizado de Leon. Puntos verdes aparecen uno a uno (pop animation). Lineas se dibujan conectando pueblos. Pulso luminoso recorre la red. Texto: "23 comunidades conectadas".',
    tool: 'Figma (diseño) + CapCut (animacion)',
    notes: 'Disenar mapa en Figma con estilo flat. Animar en CapCut con keyframes. Sonido: "pop" suave por cada pueblo.',
  },
  {
    id: 'CUT_03',
    basedOn: 'cy18 (QR y CTA)',
    name: 'Llamada a accion + QR',
    insertAfter: 'Clip 12 (FINAL del video, despues del atardecer)',
    duration: '8-10s',
    description: 'Fondo verde Rural Makers (#4a7c59). Logo centrado con glow dorado. "Tejiendo Facenderas, Sembrando Futuro". QR funcional a goteo.org. "Apoyanos desde 13 EUR". URLs y redes sociales. Mantener minimo 5 segundos estatico para que escaneen el QR.',
    tool: 'Figma/Canva (diseño) + CapCut (animacion)',
    notes: 'Logo: bounce animation. Texto: typewriter. QR: pulso verde cada 2s. VERIFICAR que el QR funciona pausando el video.',
  },
]

// ─── TIMELINE FINAL COMPLETA ──────────────────────────────────────

export const finalTimeline = [
  { type: 'seedance', ref: 'Clip 1',  time: '0:00 - 0:15', name: 'Descubriendo Leon' },
  { type: 'capcut',   ref: 'CUT_01',  time: '0:15 - 0:18', name: 'Logo reveal (3s)' },
  { type: 'seedance', ref: 'Clip 2',  time: '0:18 - 0:33', name: 'El silencio llega' },
  { type: 'seedance', ref: 'Clip 3',  time: '0:33 - 0:48', name: 'Escuelas vacias' },
  { type: 'seedance', ref: 'Clip 4',  time: '0:48 - 1:03', name: 'Entrando en la oscuridad' },
  { type: 'seedance', ref: 'Clip 5',  time: '1:03 - 1:18', name: '★ LA LUZ ENTRA ★' },
  { type: 'seedance', ref: 'Clip 6',  time: '1:18 - 1:33', name: 'Personas llegan' },
  { type: 'seedance', ref: 'Clip 7',  time: '1:33 - 1:48', name: 'Sembrando' },
  { type: 'seedance', ref: 'Clip 8',  time: '1:48 - 2:03', name: 'Saberes compartidos' },
  { type: 'seedance', ref: 'Clip 9',  time: '2:03 - 2:18', name: 'Artesania viva' },
  { type: 'seedance', ref: 'Clip 10', time: '2:18 - 2:33', name: 'Energia colectiva' },
  { type: 'seedance', ref: 'Clip 11', time: '2:33 - 2:48', name: 'La herramienta' },
  { type: 'capcut',   ref: 'CUT_02',  time: '2:48 - 2:54', name: 'Mapa conexiones (6s)' },
  { type: 'seedance', ref: 'Clip 12', time: '2:54 - 3:09', name: 'Horizonte' },
  { type: 'capcut',   ref: 'CUT_03',  time: '3:09 - 3:19', name: 'CTA + QR (10s)' },
]
// TOTAL: ~3:19 (perfecto para Goteo: recomendado 2:30 - 3:30)

// ─── NARRATIVA COMPLETA (SUBTITULOS) ──────────────────────────────

export const subtitleScript = {
  style: {
    font: 'Inter, Helvetica Neue, sans-serif',
    size: '48px sobre 1080p',
    color: '#FFFFFF',
    shadow: '2px 2px 8px rgba(0,0,0,0.7)',
    position: 'Centro-inferior (tercio inferior)',
    background: 'rgba(0,0,0,0.3) padding 8px 16px, border-radius 8px',
    maxLines: 2,
    animation: 'Fade in 0.3s / mantener 10-11s / fade out 0.3s',
  },
  arcoNarrativo: 'Belleza → Abandono → Pregunta → Giro de luz → Solucion × 6 facetas → Vision → CTA',
}

// ─── SUGERENCIAS ALTERNATIVAS DE SUBTITULOS ──────────────────────
// Variantes por clip: poetica, directa, datos/impacto, emocional
// El usuario puede elegir o mezclar para construir su guion final

export const subtitleAlternatives = {
  1: {
    clip: 'Descubriendo Leon',
    act: 'GANCHO',
    options: [
      { tone: 'Poetica',    text: 'En los valles de Leon,\nlos pueblos guardan un secreto...' },
      { tone: 'Directa',    text: 'Leon. Tierra de valles, pueblos y tradiciones vivas.' },
      { tone: 'Pregunta',   text: 'Y si el futuro\nempezara en un pueblo pequeno?' },
      { tone: 'Emocional',  text: 'Aqui, donde el tiempo respira despacio,\nempieza algo nuevo.' },
    ],
  },
  2: {
    clip: 'El silencio llega',
    act: 'PROBLEMA',
    options: [
      { tone: 'Poetica',    text: 'Pero cada ano,\nmas calles se quedan en silencio.' },
      { tone: 'Directa',    text: 'Los pueblos se vacian.\nLas puertas se cierran.' },
      { tone: 'Emocional',  text: 'Las risas se apagan.\nLas luces, una a una, se van.' },
      { tone: 'Dato',       text: 'Cada dia,\nun pueblo espanol pierde a alguien mas.' },
    ],
  },
  3: {
    clip: 'Escuelas vacias',
    act: 'PROBLEMA',
    options: [
      { tone: 'Dato',       text: 'El 53% de los municipios espanoles\npierde poblacion.' },
      { tone: 'Impacto',    text: '82% de las escuelas rurales\nhan cerrado en 30 anos.' },
      { tone: 'Directa',    text: 'Sin escuela, no hay ninos.\nSin ninos, no hay futuro.' },
      { tone: 'Emocional',  text: 'Los columpios siguen ahi.\nYa no hay nadie que los mueva.' },
    ],
  },
  4: {
    clip: 'Entrando en la oscuridad',
    act: 'PROBLEMA → GIRO',
    options: [
      { tone: 'Pregunta',   text: 'Y si pudieramos cambiarlo?' },
      { tone: 'Directa',    text: 'Pero no tiene por que ser asi.' },
      { tone: 'Emocional',  text: 'Hay quien no se rinde.' },
      { tone: 'Poetica',    text: 'Basta con abrir una ventana.' },
    ],
  },
  5: {
    clip: '★ LA LUZ ENTRA ★',
    act: 'GIRO NARRATIVO',
    options: [
      { tone: 'Poetica',    text: 'En Leon existe una tradicion:\nla facendera.' },
      { tone: 'Directa',    text: 'Se llama facendera.\nY lleva siglos viva.' },
      { tone: 'Emocional',  text: 'Una palabra antigua\nque vuelve a tener sentido.' },
      { tone: 'Evocadora',  text: 'La facendera:\ncuando la comunidad se convierte en hogar.' },
    ],
  },
  6: {
    clip: 'Personas llegan',
    act: 'SOLUCION',
    options: [
      { tone: 'Poetica',    text: 'Vecinos que se unen\npara construir juntos.' },
      { tone: 'Directa',    text: 'Personas diversas.\nUn mismo proposito.' },
      { tone: 'Emocional',  text: 'No hace falta ser de aqui\npara hacer comunidad aqui.' },
      { tone: 'Evocadora',  text: 'Manos que llegan.\nCaminos que vuelven a vivir.' },
    ],
  },
  7: {
    clip: 'Sembrando',
    act: 'SOLUCION',
    options: [
      { tone: 'Enumerativa', text: 'Huertos, talleres, energia solar,\ntecnologia... todo suma.' },
      { tone: 'Poetica',     text: 'Se planta semilla.\nSe planta futuro.' },
      { tone: 'Directa',     text: 'Trabajar la tierra\nes trabajar el vinculo.' },
      { tone: 'Generacional', text: 'Lo que los mayores saben,\nlos jovenes lo continuan.' },
    ],
  },
  8: {
    clip: 'Saberes compartidos',
    act: 'SOLUCION',
    options: [
      { tone: 'Marca',      text: 'Rural Makers conecta\npersonas, saberes y territorios.' },
      { tone: 'Directa',    text: 'La sabiduria del pueblo\nencuentra las herramientas del siglo XXI.' },
      { tone: 'Emocional',  text: 'Ensenar. Aprender.\nEn el mismo banco de piedra.' },
      { tone: 'Generacional', text: 'Tradicion y tecnologia\nhablando el mismo idioma.' },
    ],
  },
  9: {
    clip: 'Artesania viva',
    act: 'SOLUCION',
    options: [
      { tone: 'Reciprocidad', text: 'Cada persona aporta lo que sabe\ny recibe lo que necesita.' },
      { tone: 'Poetica',      text: 'Las manos que moldean el barro\nmoldean tambien el pueblo.' },
      { tone: 'Directa',      text: 'Oficios que no se pierden.\nCultura que se transmite.' },
      { tone: 'Patrimonio',   text: 'El patrimonio vive\ncuando se sigue haciendo.' },
    ],
  },
  10: {
    clip: 'Energia colectiva',
    act: 'SOLUCION',
    options: [
      { tone: 'Directa',    text: 'Una comunidad que construye\nsu propio futuro.' },
      { tone: 'Emocional',  text: 'Energia. Autonomia.\nHecho entre todos.' },
      { tone: 'Innovacion', text: 'Los pueblos tambien\nson laboratorios de futuro.' },
      { tone: 'Poetica',    text: 'El sol se convierte\nen luz para el pueblo entero.' },
    ],
  },
  11: {
    clip: 'La herramienta',
    act: 'SOLUCION → CIERRE',
    options: [
      { tone: 'CTA funcional', text: 'Descubre facenderas cerca de ti.\nConecta. Participa. Crea.' },
      { tone: 'Directa',       text: 'Una app. Una red. Un territorio.' },
      { tone: 'Beneficio',     text: 'En tu movil:\ntodas las facenderas de tu comarca.' },
      { tone: 'Accion',        text: 'Abre la app.\nEncuentra a los tuyos.' },
    ],
  },
  12: {
    clip: 'Horizonte',
    act: 'CIERRE EMOTIVO',
    options: [
      { tone: 'Tagline',    text: 'Tejiendo facenderas,\nsembrando futuro.' },
      { tone: 'Emocional',  text: 'Somos muchos.\nY somos los que quedamos.' },
      { tone: 'Vision',     text: 'El pueblo no es pasado.\nEs proyecto.' },
      { tone: 'Directa',    text: 'Rural Makers.\nLa red que teje lo rural.' },
    ],
  },
  13: {
    clip: 'Llamada a la accion',
    act: 'CTA FINAL',
    options: [
      { tone: 'Directa CTA',   text: 'Apoyanos en goteo.org\nDesde 13 EUR eres parte del cambio.' },
      { tone: 'Urgencia',      text: 'Tu granito cuenta.\nDesde 13 EUR en goteo.org.' },
      { tone: 'Reciprocidad',  text: 'Aporta 13 EUR.\nRecibe una comunidad.' },
      { tone: 'Minimalista',   text: 'Ruralmakers.net\nApoyanos en Goteo.' },
    ],
  },
}

// ─── MUSICA Y SONIDO ──────────────────────────────────────────────

export const audioDesign = {
  music: {
    style: 'Acoustic folk cinematico. Guitarra espanola + cuerdas. Arco emocional.',
    structure: [
      { time: '0:00-0:18', mood: 'Guitarra suave, notas espaciadas, contemplativo, bello' },
      { time: '0:18-0:48', mood: 'Musica se apaga/silencio. Solo ambiente frio. Piano menor si algo.' },
      { time: '0:48-1:03', mood: 'Nota grave sostenida que CRECE. Tension antes del giro.' },
      { time: '1:03-1:18', mood: '★ EXPLOSION: guitarra vuelve + cuerdas. El giro musical.' },
      { time: '1:18-2:33', mood: 'Crecimiento progresivo: guitarra + cuerdas + percusion suave.' },
      { time: '2:33-3:09', mood: 'Climax: todos los instrumentos, crescendo final.' },
      { time: '3:09-3:19', mood: 'Resolucion: nota larga sostenida → fade out.' },
    ],
    freeSources: [
      'Pixabay Music: "cinematic acoustic spanish guitar folk"',
      'Freesound.org: "spanish guitar ambient documentary"',
      'Artlist.io (pago): "rural folk cinematic emotional"',
      'Epidemic Sound: "acoustic documentary spanish"',
    ],
    volume: '-14dB a -18dB (NO compite con lectura de subtitulos)',
  },
  ambientSounds: {
    layering: 'Siempre 1-2 capas de ambiente. Se notan subconscientemente.',
    volume: '-20dB a -26dB',
    layers: [
      { clips: '1', sound: 'Viento montanas + pajaros lejanos', source: 'Freesound: mountain wind, spanish birds' },
      { clips: '2-3', sound: 'Viento frio, silencio pesado', source: 'Freesound: cold wind desolate' },
      { clips: '3', sound: 'Columpios metalicos crujiendo', source: 'Freesound: rusty swing creak' },
      { clips: '4', sound: 'Interior vacio, crujido madera', source: 'Freesound: old house creaks' },
      { clips: '5', sound: 'Ventana abriendose + pajaros irrumpiendo', source: 'Freesound: wooden window open, bird burst' },
      { clips: '6', sound: 'Pasos en camino de tierra, risas', source: 'Freesound: group walking dirt path' },
      { clips: '7', sound: 'Herramientas huerto, tierra', source: 'Freesound: garden tools digging' },
      { clips: '8', sound: 'Plaza pueblo, fuente, conversacion', source: 'Freesound: village plaza ambient' },
      { clips: '9', sound: 'Torno ceramico, agua', source: 'Freesound: pottery wheel turning' },
      { clips: '10', sound: 'Viento altura, herramientas', source: 'Freesound: rooftop wind tools' },
      { clips: '11', sound: 'Notificacion suave movil', source: 'Freesound: phone notification gentle' },
      { clips: '12', sound: 'Viento atardecer, silencio epico', source: 'Freesound: sunset wind gentle' },
    ],
  },
}

// ─── WORKFLOW DE PRODUCCION ───────────────────────────────────────

export const productionSteps = [
  {
    step: 1,
    title: 'Generar las 13 imagenes de la cadena',
    time: '2-3 horas',
    details: [
      'Generar SD_01 a SD_13 usando los prompts de seedanceImageChain',
      'TODAS en 1920x1080 (--ar 16:9 en Midjourney)',
      'Generar 3-4 variantes por imagen, elegir la mejor',
      'PRIORIDAD MAXIMA: SD_02/SD_03 (misma calle, distinto estado)',
      'PRIORIDAD MAXIMA: SD_05/SD_06 (misma ventana, cerrada/abierta)',
      'Verificar que los pares criticos tienen composicion identica',
      'Guardar como PNG: SD_01.png, SD_02.png... en carpeta /seedance-imgs/',
    ],
  },
  {
    step: 2,
    title: 'Generar los 12 clips en Seedance 2',
    time: '3-4 horas (incluye espera y seleccion)',
    details: [
      'Para cada clip: subir FOTO INICIO (startImage) + FOTO FINAL (endImage)',
      'Usar el seedancePrompt como guia de movimiento/transicion',
      'EMPEZAR por Clip 5 (★ la luz) — es el mas importante',
      'Generar 2-3 variantes por clip, elegir la mas fluida',
      'Si un clip no queda fluido: ajustar imagenes para mas similitud',
      'Exportar como MP4: clip01.mp4, clip02.mp4...',
    ],
  },
  {
    step: 3,
    title: 'Crear los 3 inserts CapCut',
    time: '1-2 horas',
    details: [
      'CUT_01: Logo reveal (Figma/Canva → CapCut keyframes)',
      'CUT_02: Mapa conexiones (Figma diseño → CapCut animacion puntos y lineas)',
      'CUT_03: End card CTA con QR funcional (Figma → CapCut)',
      'Exportar como PNG secuencia o video corto',
    ],
  },
  {
    step: 4,
    title: 'Montar timeline segun finalTimeline',
    time: '1 hora',
    details: [
      'CapCut Desktop: 1920x1080, 30fps',
      'Seguir el orden de finalTimeline exactamente',
      'Cross-dissolve de 0.3-0.5s entre clips Seedance',
      'NO cortar primeros/ultimos frames (son puntos de union)',
    ],
  },
  {
    step: 5,
    title: 'Subtitulos + musica + sonido ambiente',
    time: '1-1.5 horas',
    details: [
      'Subtitulos: texto blanco, sombra, fondo semi-transparente',
      'Musica a -16dB. Buscar pista con arco emocional.',
      'Sonidos ambiente a -22dB segun audioDesign.ambientSounds',
      'J-cuts: audio siguiente escena empieza 0.5s antes del corte',
    ],
  },
  {
    step: 6,
    title: 'Color grading + exportar',
    time: '30 minutos',
    details: [
      'Clips 1: calido dorado (+10 temperatura)',
      'Clips 2-4: frio desaturado (-15 temp, -20 sat)',
      'Clip 5: transicion frio→calido (keyframes)',
      'Clips 6-12: calido saturado (+8 temp, +10 sat)',
      'Exportar: H.264, 1080p, 30fps, 15-20 Mbps, AAC 320kbps',
      'Ver 3 veces: flujo | subtitulos | audio',
    ],
  },
]

// ─── TIPS SEEDANCE 2 ──────────────────────────────────────────────

export const seedanceTips = [
  'MISMA COMPOSICION entre pares criticos (SD_02↔SD_03, SD_05↔SD_06) = transicion perfecta',
  'Color dominante compartido entre inicio/fin = morph mas natural',
  'Evitar saltos gigantes de escala (panoramica→macro). La cadena va graduando la escala.',
  'Siluetas (SD_13) son ideales: Seedance no necesita detalles faciales.',
  'Si un clip falla: crear imagen intermedia y dividir en 2 clips de 15s.',
  'TODAS las imagenes EXACTAMENTE 1920x1080. Seedance necesita dimensiones identicas.',
  'Empezar SIEMPRE por el Clip 5 (el giro). Si ese queda bien, el video funciona.',
]

// ─── CHECKLIST ────────────────────────────────────────────────────

export const checklist = [
  // Imagenes
  { task: 'SD_01 - Amanecer montanas', phase: 'imagenes', done: false },
  { task: 'SD_02 - Calle pueblo bella', phase: 'imagenes', done: false },
  { task: 'SD_03 - Calle pueblo abandonada (MISMA composicion que SD_02)', phase: 'imagenes', done: false },
  { task: 'SD_04 - Escuela cerrada', phase: 'imagenes', done: false },
  { task: 'SD_05 - Interior oscuro ventana cerrada', phase: 'imagenes', done: false },
  { task: 'SD_06 - Interior LUZ ventana abierta (MISMA composicion que SD_05)', phase: 'imagenes', done: false },
  { task: 'SD_07 - Grupo caminando a pueblo', phase: 'imagenes', done: false },
  { task: 'SD_08 - Manos plantando huerto', phase: 'imagenes', done: false },
  { task: 'SD_09 - Tecnologia en plaza', phase: 'imagenes', done: false },
  { task: 'SD_10 - Taller ceramica', phase: 'imagenes', done: false },
  { task: 'SD_11 - Paneles solares', phase: 'imagenes', done: false },
  { task: 'SD_12 - Movil con app en campo', phase: 'imagenes', done: false },
  { task: 'SD_13 - Siluetas atardecer', phase: 'imagenes', done: false },
  // Clips Seedance
  { task: 'Clip 5 ★ LA LUZ (SD_05→SD_06) — GENERAR PRIMERO', phase: 'seedance', done: false },
  { task: 'Clip 2 (SD_02→SD_03) — segundo en prioridad', phase: 'seedance', done: false },
  { task: 'Clip 1 (SD_01→SD_02)', phase: 'seedance', done: false },
  { task: 'Clip 3 (SD_03→SD_04)', phase: 'seedance', done: false },
  { task: 'Clip 4 (SD_04→SD_05)', phase: 'seedance', done: false },
  { task: 'Clip 6 (SD_06→SD_07)', phase: 'seedance', done: false },
  { task: 'Clip 7 (SD_07→SD_08)', phase: 'seedance', done: false },
  { task: 'Clip 8 (SD_08→SD_09)', phase: 'seedance', done: false },
  { task: 'Clip 9 (SD_09→SD_10)', phase: 'seedance', done: false },
  { task: 'Clip 10 (SD_10→SD_11)', phase: 'seedance', done: false },
  { task: 'Clip 11 (SD_11→SD_12)', phase: 'seedance', done: false },
  { task: 'Clip 12 (SD_12→SD_13)', phase: 'seedance', done: false },
  // CapCut
  { task: 'CUT_01 - Logo reveal', phase: 'capcut', done: false },
  { task: 'CUT_02 - Mapa conexiones', phase: 'capcut', done: false },
  { task: 'CUT_03 - End card CTA + QR', phase: 'capcut', done: false },
  // Montaje final
  { task: 'Buscar musica (Pixabay/Artlist)', phase: 'montaje', done: false },
  { task: 'Descargar sonidos ambiente (Freesound)', phase: 'montaje', done: false },
  { task: 'Montar timeline en CapCut', phase: 'montaje', done: false },
  { task: 'Subtitulos', phase: 'montaje', done: false },
  { task: 'Musica + sonido ambiente', phase: 'montaje', done: false },
  { task: 'Color grading', phase: 'montaje', done: false },
  { task: 'Exportar H.264 1080p', phase: 'montaje', done: false },
  { task: 'Verificar QR funcional', phase: 'montaje', done: false },
  { task: 'Subir YouTube (no listado)', phase: 'montaje', done: false },
]
