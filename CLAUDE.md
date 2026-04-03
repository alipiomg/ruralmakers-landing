# Rural Makers - Tejiendo Facenderas

## URLs del proyecto
| Entorno | URL |
|---------|-----|
| **Produccion** | https://www.ruralmakers.net |
| **Vercel (tecnica)** | https://ruralmakers.vercel.app |
| **Local dev** | http://localhost:5173 |
| **Admin** | /admin |
| **App** | /app |
| **GitHub** | https://github.com/alipiomg/ruralmakers-landing |
| **Vercel Dashboard** | https://vercel.com/alipiomgs-projects/ruralmakers |

## Deploy
Push a `master` dispara auto-deploy en Vercel (~10s build).
```bash
git add <archivos> && git commit -m "mensaje" && git push origin master
```

## Estructura clave
```
src/
  landing/pages/Home.jsx    # Landing publica (/)
  admin/                     # Panel admin (/admin/*)
    pages/LandingAdmin.jsx   # Editor de contenido landing
    pages/RewardsAdmin.jsx   # Gestion recompensas
    pages/HiggsFieldGenerator.jsx  # Generador IA
    components/Sidebar.jsx   # Menu lateral admin
  app/                       # App interna (/app/*)
  data/rewardTiers.js        # Datos de recompensas
  shared/lib/constants.js    # Constantes globales
```

## Variables de entorno (solo backend, SIN prefijo VITE_)
- `GOTEO_USER` / `GOTEO_KEY` - Credenciales API Goteo (backend proxy)
- `GEMINI_API_KEY` - Google Gemini API (desactivada hasta implementar proxy backend)
- `HIGGSFIELD_API_KEY_ID` / `HIGGSFIELD_API_SECRET` - Higgsfield (desactivada)

**IMPORTANTE**: NUNCA usar prefijo `VITE_` para API keys. Las variables con `VITE_` se exponen en el JS del navegador.

## Notas
- La API de Goteo solo funciona en local (requiere proxy en vite.config.js a localhost:3001)
- En produccion NO hay polling automatico a Goteo (desactivado intencionalmente)
- `ruralmakers.net` es el dominio marketing; `ruralmakers.vercel.app` es la URL tecnica
