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

La página puede verse y estos archivos pueden editarse sin encender el computador original.
Para pedir cambios a un agente con el PC apagado, usa un entorno de trabajo en la nube conectado a este repositorio; el chat local original sigue necesitando su computador.

## Desarrollo

Se requiere Node.js 22 o posterior.

```sh
npm install
npm run build
npm start
```

`npm run build` reconstruye `docs/gaze.js` después de editar `src/gaze.jsx`.
Publica también ese archivo generado. Los demás archivos de `docs/` se editan directamente.

Los testimonios son ejemplos ilustrativos, no reseñas reales. El formulario guarda un resumen local y no envía mensajes.
