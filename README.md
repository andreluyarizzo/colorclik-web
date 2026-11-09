# ColorClik

Sitio de ColorClik, con personajes originales, enlaces directos a cada servicio y animaciones con controles explícitos. El audio permanece silenciado hasta activarlo.

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

`npm run build` compila `src/main.tsx` a `docs/app.js` y divide el cotizador en un módulo en `docs/chunks/` que se descarga al necesitarlo. También genera `docs/ui-components.css` desde Tailwind. El formulario inicial de Contacto se renderiza en el build con el mismo componente y se hidrata en el navegador, evitando un bloque vacío y saltos de diseño. El personaje del inicio usa `docs/gaze-direct.js`.
Publica también los módulos generados de `docs/chunks/` y las páginas/estilos generados cuando cambies `src/`. Los demás archivos de `docs/` se editan directamente.

La base shadcn/ui y sus instrucciones de uso están documentadas en [UI.md](UI.md).

La sección de experiencias describe proyectos; no presenta reseñas de clientes. El formulario prepara una solicitud que el visitante puede enviar en WhatsApp o correo, copiar o descargar. No hay envío automático.

### Páginas de servicios

`docs/marketing-digital.html` y `docs/desarrollo-web.html` siguen los esquemas
suministrados y comparten navegación (`navigation.js`), efectos de letras/scroll
(`script.js`, `ui.js`), estilos/interacciones (`marketing.css`, `marketing.js`) y el
formulario shadcn/ui. El menú y las tarjetas del inicio enlazan a ambas páginas.

Los PNG originales están en `docs/assets/marketing` y `docs/assets/web`, junto con
codificaciones WebP optimizadas para servir en la web. No se regeneran personajes.
Los heroes de servicios usan los MP4 suministrados, en bucle al pulsar Reproducir y sin audio, con
controles de pausa y pausa automática fuera de pantalla. Se conserva el video
original en 720p sin recodificar y se sirve una versión 480p en teléfonos. Los
posters provienen del mismo video; con movimiento reducido, ahorro de datos o
fallo de carga se conserva la imagen estática. El hero interactivo del inicio
no cambia.

Los planes abren el formulario con servicio, nombre, precio y tipo de cobro:
Marketing Digital es mensual; Desarrollo Web es pago único. El resumen descargable
incluye esa selección y las exclusiones correspondientes. No hay cobros ni envío
de mensajes. Los botones también funcionan con el formulario nativo si falla React.
Las dependencias de desarrollo incluyen Playwright y axe-core para verificar los flujos y la accesibilidad.

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

### Estudio

`src/data/studio.json` define Historia, Misión, Visión, El estudio y Lo que viene. `scripts/studio-page.cjs` genera `docs/estudio.html` desde `src/templates/studio-page.html`; el build inserta el header y footer compartidos. `docs/estudio.js` controla las pestañas con click, flechas, Inicio y Fin, sin avance automático. Un solo personaje original presenta cada tema; móvil usa una tira desplazable de retratos. Sin JavaScript, la historia y los demás temas siguen accesibles como contenido desplegable. Los siete años describen la trayectoria independiente previa a la identidad ColorClik, no la antigüedad de la marca ni un equipo ficticio.

### Proyectos y categorías

La página `proyectos.html` se genera desde `src/templates/projects-page.html` y `src/data/projects.json` mediante `scripts/projects-page.cjs`. Cada proyecto requiere `id` único, `name`, `image` dentro de `docs`, URL externa `https`, `categories` y palabras de búsqueda opcionales (`keywords`). Categorías admitidas: `web` (Página web), `branding`, `social` (Redes sociales), `ai` (Herramientas de IA). Un trabajo puede tener varias. Añadir el archivo de imagen, registrar el proyecto y ejecutar `npm run build`; el generador valida categorías, IDs, URL y existencia de la imagen.

La galería usa cuatro columnas a partir de 1024px, dos en tablet y una en móvil, con imágenes completas y apertura directa en otra pestaña. `docs/proyectos.js` filtra por categoría y búsqueda sin tildes, y muestra hasta 16 resultados por tanda (cuatro filas de cuatro en escritorio). “Ver más” aparece al superar esa cantidad. No se rellenan espacios con proyectos ficticios; las categorías vacías explican que se irán sumando trabajos. Sin JavaScript, todos los enlaces siguen accesibles. El personaje original nuevo de pelo negro y fucsia se conserva en `docs/assets/projects-character.png`, con WebP optimizado para el hero. No sustituye las mascotas existentes.

### Contacto y canal directo

`contacto.html` se genera desde `src/templates/contact-page.html`. El menú “Hagamos clik” de las nueve páginas lleva a `contacto.html#contact-form`; el footer enlaza a la página de contacto. El formulario usa el mismo componente `Quote` (`embedded`) que los cotizadores, con flujo de servicio → proyecto → datos → resumen, personajes y colores originales. Añade “Necesito orientación” para consultas genéricas sin seleccionar un plan; mantiene nombre/correo obligatorios y WhatsApp/empresa opcionales. El formulario vive en el flujo normal de la página, sin un contenedor con scroll interno.

`src/templates/whatsapp.html` proporciona un enlace flotante a +56 9 6450 5484 en todas las páginas; el build lo inserta una sola vez. Los enlaces de correo van a hola@colorclik.cl. La solicitud se prepara para WhatsApp o `mailto:` y el visitante confirma el envío en la aplicación: no se afirma recepción ni se almacenan datos en servidor. Si JavaScript no está disponible, los enlaces directos siguen funcionando. No se incluyen credenciales ni servicios de email automáticos en el frontend.

Los formularios preparan mensajes por canal con `src/quote-messages.mjs`: WhatsApp usa títulos en negrita y espacios entre bloques; el correo usa un asunto con servicio, plan y cliente, y una plantilla de texto organizada en contacto, objetivo, condiciones y mensaje. `mailto:` no admite una plantilla HTML fiable: se conserva formato de texto legible y no se afirma envío automático. En el resumen, “Ver cómo llegará tu solicitud” permite revisar el contenido antes de abrir la aplicación. Las consultas de orientación omiten el bloque de plan y valor.


### Calidad, privacidad y publicación

El cotizador conserva el borrador en memoria al cerrar y reabrir durante la misma visita. “Empezar de nuevo” lo borra de forma explícita; una recarga también lo elimina. Los enlaces de un plan diferente cambian la selección conservando el texto del proyecto y los datos de contacto. “Copiar mensaje” ofrece selección manual si el portapapeles no está disponible; “Descargar solicitud” prepara un TXT con destinatario, asunto y mensaje. La política de privacidad se edita en `src/templates/privacy-page.html`; debe mantenerse coherente con el tratamiento real de las comunicaciones.

Los cinco accesos con personajes abren la página de detalle correspondiente. Todos los botones principales de la sección Servicios dicen “Ver planes” y llevan a `#planes` de su servicio. Hover y foco muestran la vista previa; los enlaces funcionan también sin JavaScript. Las imágenes inferiores se solicitan al acercarse a la ventana, con imágenes HTML alternativas para navegación sin JavaScript. Las versiones optimizadas en `docs/assets/optimized/` conservan los originales; servir variantes nuevas si se reemplaza una imagen original. La fuente variable Montserrat en WOFF2 conserva todos los pesos y los caracteres latinos, acentos y signos usados en español. Su licencia se incluye en `docs/assets/fonts/OFL-Montserrat.txt`.

`docs/quality.css` reúne las correcciones compartidas de accesibilidad. `scripts/site-quality.cjs` se ejecuta al final del build: añade seguridad y metadatos, variantes adaptables, claves de caché, navegación inicial estable y estilos agrupados. Los estilos se incluyen en el HTML para evitar una petición bloqueante. Los comentarios `styles:` conservan la lista de archivos fuente; no editar el bloque de estilos generado. No borrar esos comentarios en las tres páginas editadas directamente. Los scripts del cotizador son módulos; publicar `docs/app.js` **junto con** `docs/chunks/` de la misma compilación.

La CSP en el HTML restringe scripts y recursos al propio sitio. Un script mínimo de navegación se autoriza por su hash, sin permitir scripts inline arbitrarios. `docs/_headers` añade protección contra iframes y otras cabeceras en proveedores que admiten este formato. **GitHub Pages no aplica `_headers`**: esas cabeceras, HSTS y la configuración TLS deben verificarse en el alojamiento real o configurarse mediante un proveedor/proxy compatible. No se pueden garantizar desde el HTML. El preview local aplica las cabeceras y compresión gzip; esto no modifica la configuración de producción.

Verificación local:

```sh
npm run build
npm run typecheck
npm test
npx playwright install chromium
npm run test:browser
```

La prueba de navegador inicia y cierra su propio preview en `127.0.0.1:4287`. Usa Chromium del sistema si está disponible; se puede indicar `CHROMIUM_PATH`. Revisa diez páginas en tres anchos con axe-core, destinos de los cinco servicios, los quince planes, conservación del borrador, validación del correo, entrada HTML como texto, copiar/descargar, navegación sin JavaScript y video silenciado. Los test no envían solicitudes reales a WhatsApp o correo. Lighthouse se mide por separado; una puntuación local no certifica UX o seguridad, y debe repetirse en la URL publicada.
