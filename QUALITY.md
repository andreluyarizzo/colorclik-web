# Correcciones de UX, UI, accesibilidad y seguridad

Implementadas el 9 de noviembre de 2026 sobre ColorClik.

- Los cinco personajes de Servicios abren el detalle del servicio correspondiente. Sus cinco botones principales dicen “Ver planes” y llevan a la sección de planes de cada servicio. Branding ya no lleva a Proyectos; Soluciones a Medida ya no lleva a Contacto. La vista previa responde a hover y foco, y los enlaces funcionan sin JavaScript.
- Tipografía legible en tablet, controles de proyectos de 44 px, contraste revisado también en los títulos de los servicios y navegación básica disponible sin JavaScript.
- Eliminado el preloader bloqueante. Audio solo mediante una acción explícita; videos de servicios con botón de reproducción, pausa automática fuera de pantalla y respeto por movimiento reducido.
- Contacto incluye su formulario en el HTML inicial y reutiliza el mismo componente React al hidratar, sin esperar a que se descargue el cotizador para mostrar la interfaz.
- Borrador del cotizador conservado al cerrar; reinicio explícito; copiar mensaje, selección manual si falla el portapapeles y descarga TXT como alternativas a WhatsApp/correo.
- Página de privacidad enlazada desde el footer y antes de compartir los datos; sin credenciales ni backend de envío añadidos.
- Recursos gráficos WebP/AVIF adaptables, miniaturas, fuentes WOFF2, imágenes inferiores diferidas con alternativa sin JavaScript y cotizador cargado bajo demanda. El JavaScript inicial del cotizador pasó de aproximadamente 315 KiB a 1,2 KiB; el módulo React se descarga al necesitarlo. Los originales se conservan.
- Enlaces del portafolio con HTTPS obligatorio en el catálogo. Toletitos e Indeed Insurance pudieron consultarse por HTTPS; la disponibilidad actual de SOKIME y Manton no pudo confirmarse con el verificador externo. No se sustituyeron sus dominios por otros destinos.
- CSP con recursos del propio sitio, script mínimo de navegación autorizado por hash, sin scripts inline arbitrarios ni `eval`; cabeceras de seguridad en el preview y archivo `_headers` para proveedores compatibles. Publicar todos los módulos de `docs/chunks/` junto con `docs/app.js`.

## Verificación

`npm run build`, `npm run typecheck`, `npm test` y `npm run test:browser` pasan. Nueve pruebas unitarias y una suite de navegador con 30 combinaciones de página/ancho sin infracciones detectadas por axe-core A/AA hasta WCAG 2.2. La suite comprueba además los cinco destinos de servicios, quince planes, Escape/foco, borrador, validación de correo, HTML tratado como texto, alternativas de contacto, navegación sin JavaScript y reproducción silenciada. No se enviaron mensajes reales.

No se encontraron archivos/anclas locales ausentes. `npm audit` reporta cero vulnerabilidades conocidas, incluidas las dependencias de desarrollo. Una segunda compilación no modifica los HTML, CSS o JavaScript generados.

Los informes Lighthouse se entregan en `/workspace/auditoria-colorclik/mejoras/`, con un resumen por página en `lighthouse-resumen.json`. Las puntuaciones se miden localmente con Lighthouse 12.8.2 en Chromium y sus perfiles móvil/escritorio; son mediciones de laboratorio, no una certificación de UX, conformidad WCAG o seguridad.

## Publicación

Esta versión reúne las mejoras de seguridad, UX/UI y rendimiento descritas arriba, junto con los cinco botones “Ver planes” que apuntan al ancla `#planes` de cada servicio. La publicación conserva los recursos originales e incluye todas las variantes gráficas y los módulos del cotizador de la misma compilación. GitHub Pages no aplica `_headers`: hay que verificar o configurar en el alojamiento real HTTPS, TLS, HSTS y cabeceras como `frame-ancestors`. La CSP en el HTML sí viaja con estas páginas, pero no sustituye las cabeceras exclusivas de servidor. Confirmar también los permisos de despliegue y el tratamiento real de comunicaciones al usar la política de privacidad.

## Lighthouse local — medición final

| Página | Perfil | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---:|---:|---:|---:|
| Inicio | Móvil | 99 | 100 | 100 | 100 |
| Inicio | Escritorio | 100 | 100 | 100 | 100 |
| Marketing Digital | Móvil | 100 | 100 | 100 | 100 |
| Desarrollo Web | Móvil | 100 | 100 | 100 | 100 |
| Branding y Diseño | Móvil | 100 | 100 | 100 | 100 |
| Redes y Contenido | Móvil | 100 | 100 | 100 | 100 |
| Soluciones a Medida | Móvil | 100 | 100 | 100 | 100 |
| Estudio | Móvil | 100 | 100 | 100 | 100 |
| Proyectos | Móvil | 99 | 100 | 100 | 100 |
| Contacto | Móvil | 99 | 100 | 100 | 100 |
| Privacidad | Móvil | 100 | 100 | 100 | 100 |

Las puntuaciones corresponden a esta ejecución local y pueden variar con la carga de CPU, la red y el alojamiento. Se informan los valores medidos, incluidos los inferiores a 100. Lighthouse no proporciona una certificación de seguridad.
