# ColorClik — instrucciones para agentes

## Regla principal
No rediseñar ni reconstruir el sitio existente. Conservar todos los personajes 3D originales, sus imágenes, videos, colores, apariencia y personalidad. Los formularios y flujos existentes no se modifican sin una prueba que demuestre un problema real.

## Trabajo seguro
- Trabajar en ramas separadas; no publicar ni fusionar a main sin aprobación explícita.
- Inspeccionar el código antes de instalar paquetes o modificar animaciones.
- No ejecutar scripts de Skills de terceros sin revisar su contenido.
- No agregar credenciales, .env, datos de clientes ni secretos al repositorio o al build.
- No subir Blender ni herramientas MCP al servidor cPanel.

## Arquitectura observada
- Generador: node build.cjs; salida estática docs/.
- React/TypeScript para componentes específicos (src/main.tsx, src/gaze.jsx, src/quote.tsx), no migrar a SPA completa.
- Tailwind CSS, esbuild y JavaScript/CSS estático existente.
- Recursos de personajes en docs/assets/{marketing,web,branding,social,custom}/ y protagonista en docs/assets/gaze/.
- Mantener las versiones de video y posters como respaldo hasta aprobar modelos 3D reales.

## Skills recomendadas (optativas)
- nextlevelbuilder/ui-ux-pro-max-skill: revisión de UI/UX, licencia MIT.
- greensock/gsap-skills: gsap-react, gsap-performance y gsap-scrolltrigger si corresponde; licencia MIT.
- vercel-labs/agent-skills: react-best-practices y web-design-guidelines; licencia MIT.
Las Skills son instrucciones para agentes, no dependencias runtime. No instalar GSAP solo por instalar su Skill.

## Verificación
Ejecutar npm ci, npm run typecheck y npm run build cuando exista un entorno local. Ejecutar pruebas automatizadas de formularios y animación, accesibilidad, móvil y Lighthouse. Documentar qué se verificó realmente.

## Futuro despliegue
GitHub para versiones; cPanel para producción. Revisar servidor, PHP/SMTP y seguridad de formularios antes de definir arquitectura de backend. Publicar solamente los artefactos necesarios y mantener respaldos independientes.
