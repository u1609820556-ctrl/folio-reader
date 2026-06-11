# Folio — lector de libros (PWA)

Lector sin anuncios: descarga clásicos de Project Gutenberg, importa tus .txt/.epub
y retoma siempre donde lo dejaste. Los libros se guardan en el dispositivo (IndexedDB)
y se leen sin conexión.

## Desplegar en GitHub Pages

1. Crea un repositorio nuevo y sube estos 6 archivos a la raíz.
2. Settings → Pages → Source: "Deploy from a branch" → rama `main`, carpeta `/ (root)`.
3. Espera 1–2 min y abre la URL `https://TU_USUARIO.github.io/NOMBRE_REPO/`.

## Instalar en Android

1. Abre la URL en Chrome.
2. Toca el botón **Instalar** de la app (o menú ⋮ → "Instalar aplicación").
3. Aparece en tu cajón de apps con icono propio y se abre a pantalla completa.

## Archivos

- `index.html` — toda la app (UI, lector, búsqueda, IndexedDB)
- `manifest.json` — identidad de la app (nombre, iconos, pantalla completa)
- `sw.js` — service worker: shell offline; los libros van aparte en IndexedDB
- `icon-*.png` — iconos de la app
