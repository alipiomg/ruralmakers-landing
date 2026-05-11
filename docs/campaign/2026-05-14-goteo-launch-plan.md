# Plan de lanzamiento Goteo — Rural Makers · Tejiendo Facenderas

**Fuente**: mensaje del equipo de Goteo a Alipio, recibido **2026-05-12**.
**D-Day**: **14 de mayo de 2026 a las 07:30h** (publicación automática).

---

## 1. Datos duros de la campaña

| Concepto | Valor |
|---|---|
| Slug del proyecto | `camino-rural-tejiendo-facenderas` |
| Lanzamiento | **2026-05-14 · 07:30h** (automático) |
| Ronda 1 | **40 días** — termina **2026-06-23** |
| Ronda 2 | **20 días** — termina **~2026-07-13** |
| Mínimo Ronda 1 | **10.700 €** (`FUNDING_MIN`) |
| Óptimo Ronda 2 | **55.000 €** (`FUNDING_OPT`) |

### URLs oficiales

| Tipo | URL | Disponible desde |
|---|---|---|
| Larga | https://www.goteo.org/project/camino-rural-tejiendo-facenderas | 14/05 07:30h |
| Corta | `goteo.cc/facenderas` | 14/05 07:30h |
| Widget iframe (300×492) | `//www.goteo.org/widget/project/camino-rural-tejiendo-facenderas` | 14/05 07:30h |
| Cofinancia (landing alternativa) | https://www.goteo.org/invest/camino-rural-tejiendo-facenderas | 14/05 07:30h |
| Dashboard | https://www.goteo.org/dashboard/project/camino-rural-tejiendo-facenderas | ya |

> **La página de Cofinancia** lista todas las recompensas y permite donar sin recompensa o donar más de lo estipulado. Útil para enviar a contactos VIP/institucionales en momentos puntuales junto con la URL principal.

### ⛔ Restricción dura

**No compartir NINGUNA URL del proyecto antes del 14/05 a las 07:30h.** Lo prohíbe Goteo expresamente. Aplica a todos los canales (redes, email, prensa, WhatsApp, web pública).

---

## 2. Implementación web pendiente

### Antes del 14/05 (preparar pero NO desplegar referencias visibles)

- [ ] **Añadir constantes nuevas en `src/shared/lib/constants.js`**:
  ```js
  export const GOTEO_SHORT_URL = 'https://goteo.cc/facenderas'
  export const GOTEO_WIDGET_URL = 'https://www.goteo.org/widget/project/camino-rural-tejiendo-facenderas'
  export const GOTEO_COFINANCIA_URL = 'https://www.goteo.org/invest/camino-rural-tejiendo-facenderas'
  export const CAMPAIGN_LAUNCH = '2026-05-14T07:30:00+02:00'
  export const CAMPAIGN_R1_END = '2026-06-23T23:59:59+02:00'
  export const CAMPAIGN_R2_END = '2026-07-13T23:59:59+02:00'
  ```
- [ ] **Componente `<GoteoWidget />`** que embebe el iframe de Goteo (responsivo, con borde redondeado y placeholder mientras carga). Mantenerlo desmontado hasta el D-Day vía flag.
- [ ] **(Opcional) Countdown** en Hero o en una sección dedicada hasta el lanzamiento (si Alipio lo quiere; descartable).
- [ ] **Reactivar form newsletter** con `<NewsletterConsentCheckbox />` ya creado (decisión pendiente: ¿captar leads ANTES del lanzamiento sin difundir URLs?).
- [ ] Verificar que el `polling Goteo` en backend siga DESACTIVADO en producción (per `Appclaude/Ruralmakers-1/CLAUDE.md`).

### A partir del 14/05 07:30h (desplegar)

- [ ] Activar `<GoteoWidget />` en Hero o sección dedicada de la landing.
- [ ] Sustituir CTAs principales: revisar todos los `GOTEO_PROJECT_URL` y plantear donde usar la URL corta (`goteo.cc/facenderas`) para enlaces sociales.
- [ ] Añadir CTA secundaria a la **landing de cofinancia** (`/invest/...`) en el detalle de recompensas — contexto: "¿Quieres donar sin recompensa? Pulsa aquí".
- [ ] Reactivar polling Goteo si interesa mostrar progreso en tiempo real (decisión: solo si tiene caching backend que evite rate-limit).
- [ ] Actualizar `og:image` con un visual específico de campaña activa si se ha generado.

### Tras Ronda 1 (2026-06-23+)

- [ ] Si se llega al óptimo: pivotar mensajes a "ronda 2 · objetivo óptimo".
- [ ] Si NO se llega al mínimo: comunicar transparentemente y empujar Ronda 2.

---

## 3. Plan de marketing

### Pre-launch (hoy → 14/05 06:30h)

| Día | Acción | Canal | URL |
|---|---|---|---|
| Hoy → 13/05 | **Preparar** materiales (gráficos, textos, vídeo, lista de contactos prensa, lista de contactos personales, calendario de posts pre-cocinados) | interno | — |
| Hoy → 13/05 | Preparar email de aviso a la lista (sin URL todavía) "esta semana lanzamos" | newsletter | — |
| 13/05 22:00h | Mensaje "mañana arrancamos" — sin URL aún | redes propias | — |
| 14/05 06:30h | Equipo en posición, gráficos finales subidos a programador de redes | interno | — |

### D-Day · 14/05 07:30h → 14/05 23:59h (1ª oleada)

| Hora | Acción | Canal |
|---|---|---|
| 07:31 | Anuncio principal en redes (post + storie + reel) | IG, FB, X, LinkedIn |
| 07:35 | Email masivo a lista propia con URL larga + corta + recompensas destacadas | Newsletter |
| 08:00 | WhatsApp broadcast a contactos personales | WhatsApp |
| 09:00–11:00 | Llamadas a contactos VIP institucionales con la URL de cofinancia | Llamada/email |
| 12:00 | Nota de prensa enviada a Diario de León, Radio Bierzo, ILEÓN, infoBierzo | Prensa |
| 16:00 | Push a comunidades amigas (cooperativas, asociaciones rurales) | Email/WhatsApp |
| 20:00 | Recap del día con primeros aportantes (testimonios) | IG storie/reel |

### Semana 1 (15/05 → 21/05) — empuje fuerte

- Diario: 1 post propio + 2 reposts de aportantes/colaboradores
- 3 hilos en X explicando profundamente el proyecto (1 cada 2 días)
- 1 reel de testimonio de aportante real
- 1 directo en IG con Alipio respondiendo dudas
- Email recordatorio mid-week con progreso

### Semana 2-4 (22/05 → 11/06) — ritmo sostenido

- Posts cada 2 días alternando: recompensas destacadas, hitos territoriales, vídeos del territorio
- Colaboraciones con micro-influencers rurales/sostenibilidad
- Eventos físicos en pueblos de La Omaña / El Bierzo si los hay
- Push semanal a la lista

### Semana 5-6 (12/06 → 23/06) — sprint final Ronda 1

- Recordatorios diarios de "quedan X días"
- Email diario los últimos 3 días
- Push a contactos VIP que aún no han aportado
- Si vamos por debajo del mínimo: SOS + plan B
- Último día: live + actualizaciones cada 2 horas

### Ronda 2 (24/06 → 13/07) — empuje al óptimo

- Comunicación clara del logro de Ronda 1 (gracias)
- Nuevo objetivo Ronda 2 con mensaje de "ahora vamos al ÓPTIMO"
- Push final con storytelling sobre qué se desbloquea con cada tramo

---

## 4. Checklist accionable inmediato (esta semana)

- [ ] Confirmar con Alipio: ¿generamos un visual específico para D-Day y lo subimos como `og-image-launch.jpg`?
- [ ] Confirmar con Alipio: ¿countdown visible en Hero antes del 14/05? (preferentemente NO, para no distraer del CTA actual)
- [ ] Crear lista cerrada de contactos VIP institucionales para llamadas el día D
- [ ] Preparar email pre-cocinado para newsletter (sin URL en el cuerpo, lista de prueba)
- [ ] Programar posts en herramienta (Buffer, Metricool, etc.) para 14/05 desde 07:31h
- [ ] Validar que `<GoteoWidget />` está implementado y testeado (sin desplegar referencia visible)
- [ ] Revisar a qué CTAs del sitio actual conviene cambiar URL larga → corta tras lanzamiento
- [ ] Decidir si reactivamos el form newsletter ahora (captación pre-lanzamiento) o el día D

---

## 5. Recursos Goteo enviados

- **Guía "Cómo aportar en Goteo"** (para compartir con personas que no han usado la plataforma): https://goteo.org/blog/566
- Goteo enviará periódicamente "consejos e indicaciones para mover la campaña" — añadirlos aquí según lleguen.

---

## 6. Notas

- La memoria persistente del proyecto (resumen 1-pager) vive en `~/.claude/projects/<ruralmakers>/memory/goteo-campaign-2026.md`.
- Este documento se actualiza con los nuevos consejos de Goteo según vayan llegando.
