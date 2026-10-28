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

### Página de Marketing Digital

`docs/marketing-digital.html` reutiliza la navegación (`navigation.js`), los efectos
compartidos (`script.js`, `ui.js`), el hero React y el formulario shadcn/ui del inicio.
Su diseño e interacciones específicas están en `docs/marketing.css` y
`docs/marketing.js`. La tarjeta y el menú de Marketing Digital del inicio enlazan a
esta página.

Los tres planes del esquema abren el formulario con servicio, nombre y precio
preseleccionados. El resumen descargable incluye esa selección; no hay pago ni
envío de mensajes. Los botones también abren el formulario nativo si el bundle de
React falla. No se instalan dependencias adicionales.
