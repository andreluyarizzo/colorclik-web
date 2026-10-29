# Auditoría estática de animaciones — ColorClik

Fecha: 2026-10-29. Rama de trabajo: `chore/skills-colorclik`. Alcance: inspección de código; **no** es una medición de navegador ni una prueba visual. Ninguna página, video, CSS o dependencia runtime se modificó.

## Arquitectura confirmada
- `src/gaze.jsx` + `src/gaze-motion.mjs`: React para scrub del video del personaje principal. El movimiento utiliza interpolación angular, damping, RAF, serialización de seeks, poster estático, observador de visibilidad, `prefers-reduced-motion`, detección de puntero fino y limpieza de listeners. Mantener este sistema hasta superar sus pruebas.
- `docs/experience.js`: preloader, efectos de letras, glow en tarjetas, reveal de proyectos, carrusel de reseñas, reproducción de video condicionada por visibilidad y estado de la pestaña.
- `docs/ui.js`: barra de progreso de scroll con RAF, animaciones ligadas al scroll, videos, estado de visibilidad y controles.
- `docs/marketing.js`: hero de video, marquesina y videos secundarios con pausa al salir del viewport; aplica reduced motion.
- `docs/script.js`, `docs/navigation.js`, `docs/estudio.js`: menús, animaciones de textos y escenas del estudio.
- `docs/styles.css`: CSS extenso con transiciones, transforms, media queries y reglas reduced-motion.
- `package.json`: React 19, Tailwind 4, esbuild; GSAP no aparece como dependencia directa.

## Lo que ya está bien y NO conviene rehacer
1. El hero de mirada no es un video convencional: calcula dirección desde el cursor y busca frames específicos. Incluye poster y fallback.
2. El proyecto ya usa IntersectionObserver para evitar trabajo fuera de pantalla en varias secciones.
3. Muchos efectos respetan `prefers-reduced-motion`; varias animaciones de scroll están limitadas con RAF.
4. Hay controles de pausa/reproducción en medios y lógica de visibilidad.
5. Las páginas de servicios y estudio ya usan recursos originales por servicio.

## Oportunidades concretas, priorizadas

### P0 — Proteger y medir (sin efectos nuevos)
- Ejecutar pruebas existentes y `tests/character-assets.test.cjs`; confirmar que el build reproduce `docs/` sin cambios no deseados.
- Registrar Lighthouse móvil/escritorio (LCP, CLS, INP) y Web Vitals. Sin medición no afirmar mejoras de FPS o velocidad.
- Medir tamaños reales de videos hero, posters y duplicados para priorizar transferencia.
- Verificar visualmente menú, diálogos, cotizaciones, navegación con teclado y reduced motion.

### P1 — Optimizar videos y scroll sin alterar diseño
- Revisar si todos los videos de `docs/ui.js` quedan pausados al ocultar la pestaña y fuera del viewport; el bloque de `sync()` de línea ~102 llama `video.play()` cuando no hay reduced motion, y su pausa al ocultarse no es evidente en ese bloque. Confirmar contexto antes de editar.
- Revisar coexistencia de listeners de scroll/resize entre `docs/ui.js`, `docs/experience.js` y otras páginas; no unificar sin medición.
- Revisar si las tarjetas glow con `getBoundingClientRect()` en cada `pointermove` generan coste medible; cachear dimensiones solo si se justifica y se invalidan al redimensionar.
- Revisar la precarga del hero principal: `preload="none"` y poster prioritario. No cambiar a `auto` sin medir impacto en móvil.
- Mantener fallback estático cuando el scrub del video falle o el usuario prefiera movimiento reducido.

### P2 — Mejoras visuales en prototipo aislado
- Microinteracciones de tarjetas y CTA con transform/opacity, sin introducir desplazamientos de layout.
- Refinar ritmo de aparición y transiciones del estudio manteniendo personajes, textos y paleta.
- Mejorar respuesta táctil de servicios; sin depender exclusivamente de hover.
- Probar GSAP ScrollTrigger **solo en un componente aislado**, comparando con IntersectionObserver/CSS actuales. No agregar GSAP a toda la web por instalar su Skill.

### P3 — Piloto 3D real
- Construir escena Blender de prueba con una copia de la protagonista.
- Exportar GLB y comparar fidelidad, tamaño, render, CPU/GPU, móviles y accesibilidad contra el video actual.
- No reemplazar el hero publicado hasta que el modelo gane en fidelidad y rendimiento.

## Riesgos y verificaciones
- `docs/` es salida del build y también contenido publicado; evitar editar directamente sin entender los generadores.
- La lógica de gaze usa `video.currentTime` y seeks frecuentes; el comportamiento real varía según navegador/codec. Probar en Chrome/Edge Windows y Android.
- `ResizeObserver`, IntersectionObserver y CSS animations requieren pruebas visuales; una auditoría estática no detecta saltos o jank.
- GSAP Skills son instrucciones para agentes, no pruebas de rendimiento ni una necesidad de instalar GSAP runtime.
- No tocar formularios funcionales ni backend durante esta fase.

## Criterios de aceptación para primera mejora
1. Capturas antes/después en móvil y escritorio; mismos personajes, textos, layout y colores.
2. Sin regresiones en formularios, navegación, teclado o reduced-motion.
3. `npm ci`, `npm run typecheck`, `npm run build`, `node --test tests/*.test.mjs tests/*.test.cjs` sin errores (ejecutar en PC).
4. Sin nuevos errores en consola, sin assets faltantes, sin incremento significativo de transferencia.
5. Si GSAP no mejora claramente el prototipo, conservar CSS/JS existente.

## Próximo paso recomendado
Desde PC, abrir `chore/skills-colorclik`, instalar Skills y ejecutar pruebas. Luego seleccionar **un** piloto: tarjetas de servicios y sus transiciones, con implementación reversible y revisión visual antes de fusionar.
