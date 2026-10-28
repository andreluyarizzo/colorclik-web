# ColorClik

Sitio de ColorClik, con personajes animados y videos de servicios con audio al pasar el cursor.

## Publicación gratuita

En GitHub: **Settings → Pages → Deploy from a branch → main → /docs → Save**.
Los cambios guardados en `docs/` se publican automáticamente. El repositorio y el sitio son públicos.

## Editar desde el teléfono

Abre los archivos en GitHub y usa el lápiz para editar y guardar los cambios.
- `docs/index.html`: textos y estructura.
- `docs/styles.css`: diseño adaptable y estilos.
- `docs/ui.js`: scroll, fondos de los servicios y audio.
- `docs/experience.js`: precarga, proyectos y reseñas.
- `src/gaze.jsx`: interacción del personaje del hero.
- `src/quote.tsx`: formulario de cotización con componentes shadcn/ui.
- `src/styles/ui.css`: colores y estilos de esos componentes.

La página puede verse y estos archivos pueden editarse sin encender el computador original.
Para pedir cambios a un agente con el PC apagado, usa un entorno de trabajo en la nube conectado a este repositorio; el chat local original sigue necesitando su computador.

## Desarrollo

Se requiere Node.js 22 o posterior.

```sh
npm install
npm run build
npm start
```

`npm run build` compila `src/main.tsx` (personaje y formulario React) a `docs/app.js` y genera `docs/ui-components.css` desde Tailwind.
Publica ambos archivos generados cuando cambies `src/`. Los demás archivos de `docs/` se editan directamente.

La base shadcn/ui y sus instrucciones de uso están documentadas en [UI.md](UI.md).

Los testimonios son ejemplos ilustrativos, no reseñas reales. El formulario guarda un resumen local y no envía mensajes.

### Páginas de servicios

`docs/marketing-digital.html` y `docs/desarrollo-web.html` siguen los esquemas
suministrados y comparten navegación (`navigation.js`), efectos de letras/scroll
(`script.js`, `ui.js`), estilos/interacciones (`marketing.css`, `marketing.js`) y el
formulario shadcn/ui. El menú y las tarjetas del inicio enlazan a ambas páginas.

Los PNG originales están en `docs/assets/marketing` y `docs/assets/web`, junto con
codificaciones WebP optimizadas para servir en la web. No se regeneran personajes.
Los heroes de servicios usan los MP4 suministrados, en bucle y sin audio, con
controles de pausa y pausa automática fuera de pantalla. Se conserva el video
original en 720p sin recodificar y se sirve una versión 480p en teléfonos. Los
posters provienen del mismo video; con movimiento reducido, ahorro de datos o
fallo de carga se conserva la imagen estática. El hero interactivo del inicio
no cambia.

Los planes abren el formulario con servicio, nombre, precio y tipo de cobro:
Marketing Digital es mensual; Desarrollo Web es pago único. El resumen descargable
incluye esa selección y las exclusiones correspondientes. No hay cobros ni envío
de mensajes. Los botones también funcionan con el formulario nativo si falla React.
No se instalan dependencias adicionales.

### Footer compartido

El footer de todas las páginas se edita en `src/templates/footer.html`.
`npm run build` lo incorpora en los HTML estaticos; el estilo comun esta en
`docs/styles.css` (`.site-footer`). No depende de JavaScript en el navegador.

### Servicios de Branding, Redes y Soluciones a Medida

Las páginas `branding-diseno.html`, `redes-contenido.html` y
`soluciones-medida.html` se generan con `npm run build` desde
`src/data/remaining-services.json` y `src/templates/service-page.html`.
Los textos, precios, modalidades, entregables y exclusiones se editan en ese JSON;
`src/templates/header.html` centraliza la navegación de las seis páginas.
`scripts/service-pages.cjs` genera los HTML y `docs/services.css` contiene los
colores específicos. El footer sigue usando la plantilla compartida.

Los PNG originales de los ZIP se conservan en `docs/assets/branding`,
`docs/assets/social` y `docs/assets/custom`; se sirven codificaciones WebP.
Cada hero utiliza el video suministrado, sin audio, con versión móvil y poster.
Branding y Soluciones son de pago único; Redes es mensual. Los precios de
Soluciones a Medida son referenciales, tal como indica el esquema suministrado.

### Cotizadores por servicio

`src/quote.tsx` reutiliza el Dialog de Radix/shadcn: proyecto y plan → datos de contacto → resumen editable. `src/data/quote-services.json` contiene los cinco servicios, preguntas, colores y los 15 planes; mantener sus precios, periodicidad y exclusiones sincronizados con las páginas de servicio. Cada botón `data-quote` admite `data-quote-service` y `data-plan` para abrir la selección correspondiente. Los personajes se cargan desde los WebP originales de cada servicio.

Los destinos están definidos en `src/quote.tsx`: WhatsApp **+56 9 6450 5484**, correo **hola@colorclik.cl**. WhatsApp abre una pestaña con el mensaje completo y correo usa `mailto:` con asunto y cuerpo codificados. El visitante confirma el envío en la aplicación elegida; la web no puede confirmar entrega. No hay envío automático, servidor de correo ni almacenamiento de datos. Para entrega automática al correo será necesario conectar un endpoint de formularios y verificar el destinatario; no incluir credenciales en el bundle público. El formulario nativo de respaldo sigue permitiendo descargar el resumen si el bundle no carga.

Verificar antes de publicar: apertura desde los 15 planes, validación de pasos, edición sin pérdida de datos, mensaje y destino correctos, teclado/Escape y devolución de foco, vistas móvil/tablet/escritorio y `prefers-reduced-motion`.
