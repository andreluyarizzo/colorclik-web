# Integración de Skills existentes — ColorClik

Estado: planificación técnica en la rama chore/skills-colorclik. No cambia el sitio ni la rama main.

## Hallazgos del repositorio
- Sitio multipágina compilado a docs/ por build.cjs. No es una SPA React completa.
- React 19.3.1, Tailwind 4.3.3, TypeScript 5.9.3, esbuild 0.28.2.
- src/main.tsx incorpora gaze.jsx y quote.tsx; docs/ contiene páginas estáticas, CSS y JS de interacciones.
- Ya existe lógica de animación con reduced motion, IntersectionObserver y hero de video.
- Recursos originales de cinco servicios: docs/assets/marketing, web, branding, social y custom; videos y posters específicos por servicio. Hero principal: docs/assets/gaze/.
- No se observaron archivos .blend/.glb/.gltf/.fbx en el árbol de main. Los personajes parecen distribuidos como imágenes y videos, no como modelos 3D editables.
- El repositorio es público. Evitar cualquier secreto o credencial.

## Compatibilidad y licencias
1. UI UX Pro Max: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill — licencia MIT para el repositorio; la herramienta ofrece funciones premium opcionales. Compatible con Codex CLI vía instalador uipro.
2. GSAP Skills: https://github.com/greensock/gsap-skills — licencia MIT; soporta Codex. Empezar con gsap-react, gsap-performance y gsap-scrolltrigger solo si se justifica.
3. Vercel Agent Skills: https://github.com/vercel-labs/agent-skills — licencia MIT; elegir react-best-practices y web-design-guidelines. No instalar deploy-to-vercel porque el destino es cPanel.
4. BlendRelay MCP: https://github.com/shefq/blendrelay-mcp — servidor Python MIT y extensión Blender GPL-3.0-or-later. Se ejecuta localmente en Windows, no en producción.

## Instalación propuesta en PC (PowerShell)
Desde la carpeta del repositorio, después de revisar código y dependencias:
```powershell
git checkout chore/skills-colorclik
npx ui-ux-pro-max-cli init --ai codex
npx skills add https://github.com/greensock/gsap-skills
npx skills add https://github.com/vercel-labs/agent-skills --skill react-best-practices
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines
git status
git diff
npm ci
npm run typecheck
npm run build
```
Revisar cada instalador y su salida antes de ejecutarlo. La CLI skills puede pedir selección de agente y alcance; escoger Codex y alcance de proyecto. No instalar dependencias de animación en producción en esta etapa.

## BlendRelay en Windows
Requiere Blender 4.5+, uvx (uv) o Python 3.11+, Codex CLI autenticado.
```powershell
uvx blendrelay-mcp setup
codex mcp add blendrelay -- uvx blendrelay-mcp mcp
codex mcp list
uvx blendrelay-mcp doctor
```
Reiniciar Blender > Edit > Preferences > Add-ons/Get Extensions > habilitar BlendRelay MCP. En el viewport, N > BlendRelay > Connect. Probar sobre copia de escena y referencias de la protagonista. Primero cabeza/ojos/parpadeo; comparar render con video original antes de proponer sustitución. Un MCP no convierte automáticamente PNG a geometría idéntica.

## Validaciones antes de cualquier PR
- Preservar hero, cinco personajes, sus archivos y formularios.
- Comprobar no se alteraron docs/ ni la salida visual.
- Ejecutar pruebas existentes, npm run typecheck, npm run build y comparar diffs.
- Lighthouse, Playwright, reduced-motion, rendimiento móvil.
- Revisar cambios de lockfile y dependencias; no añadir paquetes innecesarios.

## Fase posterior: backend y seguridad para cPanel
- Confirmar infraestructura PHP, versión, SMTP, dominio, SSL y mecanismo actual de cotizaciones.
- Revisar validación del servidor, CSRF si aplica, rate limits, antispam, inyección de cabeceras y almacenamiento de datos.
- Auditoría de dependencias, secretos, políticas de seguridad HTTP, permisos y logs.
- Respaldo de código en GitHub y backup independiente de hosting/datos.
- Preparar despliegue desde docs/ o artefactos de build verificados, excluyendo .git, node_modules, .env y archivos privados.
- Probar staging, envío de correos, HTTPS, accesibilidad y rollback antes del dominio final.

## Regla de aprobación
La rama se mantiene aislada. No fusionar ni publicar sin revisión explícita.
