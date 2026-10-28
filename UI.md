# Componentes de interfaz de ColorClik

La base utiliza componentes shadcn/ui (estilo New York, primitivas Radix), React y Tailwind CSS 4. Los componentes se incorporan como código editable, no como un paquete de temas.

## Código instalado

- `src/components/ui/`: Button, Dialog, Select y Textarea, extraídos de `apps/v4/registry/new-york-v4/ui/` del ZIP `ui-main.zip`. Se adaptaron las rutas de importación y las etiquetas de cierre al español.
- `src/lib/utils.ts`: combina clases con `clsx` y `tailwind-merge`.
- `src/styles/ui.css`: utilidades y colores de los componentes de ColorClik. No incluye Preflight para conservar los estilos de la web existente.
- `src/quote.tsx`: formulario de cotización con validación, confirmación de descarga y navegación por teclado. Genera el mismo resumen local; no envía datos a un servidor.
- `components.json`: configuración para añadir componentes con la CLI de shadcn/ui.
- `docs/assets/licenses/shadcn-ui.txt`: licencia MIT del código incorporado.

El ZIP completo contiene además la documentación, demos y herramientas de publicación del proyecto shadcn/ui. Esas aplicaciones no forman parte de la web de ColorClik.

## Desarrollo

```sh
npm ci
npm run typecheck
npm run build
npm start
```

`src/main.tsx` reúne el personaje del hero y el formulario en un solo bundle React (`docs/app.js`), evitando duplicar React. Tailwind genera `docs/ui-components.css` como parte de la misma compilación. Ambos archivos se incluyen en GitHub Pages.

El formulario nativo existente sigue disponible como alternativa si el bundle React no carga. Cuando el formulario mejorado se monta, asume la apertura del botón de cotización y devuelve el foco a ese botón al cerrar.

Para añadir otro componente en el futuro:

```sh
npx shadcn@latest add nombre-del-componente
npm run typecheck
npm run build
```

Revisar los estilos globales si la CLI propone modificarlos: los colores y utilidades de esta integración están en `src/styles/ui.css`, mientras que el diseño de la página sigue en `docs/styles.css`.
