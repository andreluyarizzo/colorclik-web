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
Los heroes de servicios usan estas imágenes con un desplazamiento suave y limitado
en escritorio; en táctiles o movimiento reducido permanecen estáticas. El hero
interactivo de video del inicio no cambia.

Los planes abren el formulario con servicio, nombre, precio y tipo de cobro:
Marketing Digital es mensual; Desarrollo Web es pago único. El resumen descargable
incluye esa selección y las exclusiones correspondientes. No hay cobros ni envío
de mensajes. Los botones también funcionan con el formulario nativo si falla React.
No se instalan dependencias adicionales.
