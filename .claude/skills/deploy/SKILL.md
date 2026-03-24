---
name: deploy
description: Deploy rapido a produccion (commit + push a Vercel)
user_invocable: true
---

# Deploy a produccion

Ejecuta el flujo completo de deploy para Rural Makers:

1. **Mostrar cambios**: Ejecuta `git status -s` y `git diff --stat` para ver que archivos cambiaron
2. **Confirmar**: Pregunta al usuario si quiere continuar con un resumen de los cambios
3. **Commit**: Hace `git add` de los archivos modificados y `git commit` con mensaje descriptivo auto-generado
4. **Push**: Ejecuta `git push origin master` que dispara el auto-deploy en Vercel
5. **Resultado**: Muestra las URLs donde verificar:
   - Produccion: https://www.ruralmakers.net
   - Vercel: https://ruralmakers.vercel.app

**IMPORTANTE**:
- No pushear si no hay cambios
- No hacer `git add .` — solo los archivos relevantes
- El mensaje de commit debe ser descriptivo y en espanol
- Anadir `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>` al commit
