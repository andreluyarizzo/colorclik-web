# Inventario remoto de personajes y optimización — 2026-10-29

Este documento registra lo observado en el árbol de main. No se ha cambiado la web ni sus medios.

## Recursos existentes (mantener originales)
- Hero principal: `docs/assets/gaze/original.webp`, `center.webp`, `hero-scrub.mp4`.
- Marketing: `docs/assets/marketing/` con hero.webp/png, pointing.webp/png, laptop.webp/png, video de hero escritorio/móvil y poster.
- Desarrollo Web: `docs/assets/web/` con hero.webp/png, pointing.webp/png, laptop.webp/png, contact.webp/png, video de hero escritorio/móvil y poster.
- Branding: `docs/assets/branding/` con hero.webp/png, pointing.webp/png, feature.webp/png, contact.webp/png, video de hero escritorio/móvil y poster.
- Redes: `docs/assets/social/` con hero.webp/png, pointing.webp/png, feature.webp/png, contact.webp/png, video de hero escritorio/móvil y poster.
- Soluciones: `docs/assets/custom/` con hero.webp/png, pointing.webp/png, feature.webp/png, contact.webp/png, video de hero escritorio/móvil y poster.
- Hay 92 archivos de medios PNG, WebP o MP4 en el árbol; incluye proyectos y recursos auxiliares.
- No se encontraron modelos .glb, .gltf, .fbx o .blend en el árbol de main. Una reconstrucción 3D necesita prueba piloto, no sustituir el video inmediatamente.

## Prioridades de optimización (pendientes de medir)
1. Medir peso real de cada MP4/WebP y dimensiones, sin borrar archivos.
2. Verificar qué recurso se carga en móvil vs escritorio; posters antes de video.
3. Comprobar autoplay, preload, visibility pause, reduced-motion y fallbacks.
4. Analizar código duplicado en JS/CSS y eventos de pointermove.
5. Ejecutar Lighthouse en móvil y desktop, registrar LCP, INP, CLS.
6. Probar el comportamiento de formularios existentes, sin reemplazarlos.
7. Validar accesibilidad de menú, modales, navegación por teclado y contrastes.

## Prototipo 3D sin riesgo
- Empezar con protagonista de `docs/assets/gaze/`.
- Conservar video y WebP de respaldo.
- Preparar modelo GLB de prueba en carpeta aislada, sin insertarlo en producción.
- Comparar semejanza visual, movimientos (ojos, cabeza, parpadeo), peso, FPS y móviles.
- No sustituir videos hasta aprobar resultado.

## Mañana en PC
1. `git fetch origin && git switch chore/skills-colorclik`
2. Revisar `AGENTS.md` y `docs/skills-integration-plan.md`.
3. Instalar una Skill de UI/UX, comprobar detección en Codex.
4. Ejecutar `npm ci`, `npm run typecheck`, `npm run build` y pruebas existentes.
5. Configurar BlendRelay en Blender y probar una escena de copia.
6. Mantener main intacta; abrir PR solo tras revisar resultados.

## Seguridad posterior
- Auditoría de secretos en el historial y repositorio público.
- Revisar cotizaciones y su backend previsto para cPanel, validación, SMTP, rate limits y antispam.
- HTTPS, CSP, cabeceras, permisos y respaldos independientes.
- Despliegue desde artefactos verificados de docs/, no desde todo el repositorio.
