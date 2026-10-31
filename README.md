# Los Multiversos de Bruno

Cuentos interactivos en español donde **Bruno (10 años) es siempre el protagonista**. Viaja con su equipo, **Amy** (valiente, con su martillo) y **Perlita** (la guardiana de las perlas-portal), por el Reino Champiñón con Mario y Luigi, el mundo veloz de Sonic, el taller de Gepeto y Pinocho, la vecindad del Chavo, el puerto de Popeye y Olivia, y por el **multiverso**, donde un portal mezcla dos mundos en la misma aventura.

- Cada cuento es nuevo: se arma en el momento, en el dispositivo, combinando mundo, misión, objeto mágico, giro, desafíos y final.
- En 2 o 3 momentos la historia se detiene y Bruno elige qué hacer. Cada elección cambia lo que sigue y lleva a finales distintos.
- Cada final deja una enseñanza contada dentro de la aventura (valentía, amistad, ingenio, honestidad o trabajo en equipo) y una insignia.
- Lectura en voz alta con la voz en español del dispositivo (si no hay voz en español, la app lo avisa y se sigue leyendo el texto).
- Mis cuentos (historial y favoritos) y Logros, guardados solo en el dispositivo (localStorage).
- PWA instalable que funciona sin conexión después de la primera visita.
- HTML, CSS y JavaScript sin dependencias, sin servidor, sin claves y sin publicidad.

## Publicarla con GitHub Pages

Settings → Pages → *Build and deployment* → **Deploy from a branch** → rama `main`, carpeta `/ (root)`.
La app queda en `https://<usuario>.github.io/cuentos-de-bruno/`. Todas las rutas son relativas, así que funciona dentro de ese subpath.

**Al publicar cambios:** subí `VERSION` en `sw.js` (por ejemplo `v1.0.1`) para que los dispositivos que ya la tienen instalada descarguen la versión nueva.

## Cómo funciona el generador

`js/generator.js` construye cada cuento a partir de una **semilla** (`seed`), de forma determinística: la misma semilla, mundo y largo dan siempre el mismo cuento. Por eso «Mis cuentos» guarda solo la semilla y no el texto.

1. Con la semilla elige el mundo (o dos mundos en el multiverso), la misión, el comienzo, el objeto mágico, el color de la perla-portal y el giro.
2. Arma un **árbol de decisiones completo**: cada nodo tiene texto y 2 o 3 opciones; cada opción tiene su propia consecuencia y lleva a un nodo distinto. Los desafíos de cada rama se eligen por separado, así que las ramas cuentan cosas diferentes.
3. La última decisión es el enfrentamiento final. El final depende de esa elección y la enseñanza depende de cómo jugó Bruno todo el camino.
4. Para no repetir, la app pasa las firmas de los últimos cuentos y el generador evita la misma combinación, la misma misión del mismo mundo y el mismo comienzo que los dos cuentos anteriores.

Largos: **corto** (2 decisiones), **mediano** (3 decisiones) y **largo** (3 decisiones, capítulos numerados y más escenas).

Todo el contenido está en `js/data.js`. Para agregar una misión, un desafío o un mundo, se suma ahí con el mismo formato; los tests verifican que todo siga siendo alcanzable y coherente.

## Archivos

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | La app (inicio, cuento, mis cuentos, logros) |
| `css/styles.css` | Diseño mobile-first, modo oscuro espacial y modo claro |
| `js/data.js` | Mundos, personajes, misiones, desafíos y textos (todo original) |
| `js/generator.js` | Generador de cuentos con semilla |
| `js/storage.js` | Historial, favoritos, logros y ajustes en localStorage |
| `js/speech.js` | Lectura en voz alta (Web Speech API) |
| `js/app.js` | Interfaz y navegación |
| `sw.js` | Service worker con caché versionada (funciona sin conexión) |
| `manifest.webmanifest` | Manifest de la PWA (rutas relativas) |
| `icons/` | Iconos 192, 512, maskable 512, Apple y SVG |
| `tests/` | Tests del generador, del guardado y de la PWA, más una prueba en navegador |
| `tools/serve.js` | Servidor local que imita GitHub Pages bajo `/cuentos-de-bruno/` |
| `tools/make-icons.js` | Regenera los PNG de los iconos desde `icons/icon.svg` |

## Probar en la compu

```bash
npm test
```

```bash
npm run test:e2e
```

```bash
npm run serve
```

`npm test` usa solo Node (18 o más nuevo), sin instalar nada. `npm run test:e2e` necesita Playwright con Chromium. `npm run serve` abre la app en `http://localhost:8080/cuentos-de-bruno/`.

---

App familiar y gratuita, hecha para Bruno. Las historias y los diálogos son originales; los personajes conocidos pertenecen a sus creadores y aparecen acá solo como homenaje, sin fines comerciales.
