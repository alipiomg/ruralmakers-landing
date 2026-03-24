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

## Variables de entorno
- `VITE_GEMINI_API_KEY` - Google Gemini API (imagenes/video IA)
- `VITE_HIGGSFIELD_API_KEY_ID` / `VITE_HIGGSFIELD_API_SECRET` - Higgsfield (backup)

## Notas
- La API de Goteo solo funciona en local (requiere proxy en vite.config.js a localhost:3001)
- En produccion NO hay polling automatico a Goteo (desactivado intencionalmente)
- `ruralmakers.net` es el dominio marketing; `ruralmakers.vercel.app` es la URL tecnica
