'use strict';
// Chequeos estáticos de la PWA: todo relativo (sirve bajo /cuentos-de-bruno/), sin recursos externos.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const exists = (f) => fs.existsSync(path.join(ROOT, f));

function pngSize(file) {
  const b = fs.readFileSync(path.join(ROOT, file));
  assert.equal(b.slice(1, 4).toString(), 'PNG', file + ' es PNG');
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

test('manifest válido con start_url y scope relativos', () => {
  const m = JSON.parse(read('manifest.webmanifest'));
  assert.equal(m.start_url, './');
  assert.equal(m.scope, './');
  assert.equal(m.display, 'standalone');
  assert.equal(m.lang, 'es');
  assert.ok(m.name && m.short_name);
  for (const icon of m.icons) {
    assert.ok(!icon.src.startsWith('/') && !/^https?:/.test(icon.src), 'ícono relativo: ' + icon.src);
    assert.ok(exists(icon.src), 'existe ' + icon.src);
    if (icon.type === 'image/png') {
      const [w, h] = pngSize(icon.src);
      assert.equal(icon.sizes, w + 'x' + h, 'tamaño declarado = tamaño real en ' + icon.src);
    }
  }
  const sizes = m.icons.map((i) => i.sizes);
  assert.ok(sizes.includes('192x192') && sizes.includes('512x512'));
  assert.ok(m.icons.some((i) => i.purpose === 'maskable' && i.sizes === '512x512'), 'hay ícono maskable');
});

test('el service worker precarga archivos que existen, con caché versionada', () => {
  const sw = read('sw.js');
  const sandbox = { self: { addEventListener() {} } };
  vm.runInNewContext(sw, sandbox);
  assert.match(sandbox.VERSION, /^v\d+\.\d+\.\d+$/);
  assert.ok(sandbox.CACHE.includes(sandbox.VERSION));
  for (const a of sandbox.ASSETS) {
    assert.ok(a.startsWith('./'), 'ruta relativa: ' + a);
    const f = a === './' ? 'index.html' : a.slice(2);
    assert.ok(exists(f), 'existe ' + f);
  }
  // Todo lo que carga index.html está precargado (para abrir sin conexión).
  const html = read('index.html');
  const refs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map((m) => m[1]);
  for (const r of refs) assert.ok(sandbox.ASSETS.includes('./' + r), 'precargado: ' + r);
});

test('index.html: todas las referencias son relativas y existen', () => {
  const html = read('index.html');
  const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]).filter((r) => !r.startsWith('#'));
  assert.ok(refs.length >= 8);
  for (const r of refs) {
    assert.ok(!r.startsWith('/'), 'no empieza con / (rompería el subpath): ' + r);
    assert.ok(!/^https?:/.test(r), 'sin recursos externos: ' + r);
    assert.ok(exists(r), 'existe ' + r);
  }
  assert.match(html, /<html lang="es">/);
  assert.match(html, /name="viewport"/);
  assert.match(html, /rel="manifest" href="manifest.webmanifest"/);
});

test('sin dependencias externas ni CDN en el código', () => {
  const files = ['index.html', 'css/styles.css', 'js/app.js', 'js/data.js', 'js/generator.js', 'js/storage.js', 'js/speech.js', 'sw.js'];
  for (const f of files) {
    const txt = read(f).replace(/http:\/\/www\.w3\.org\/2000\/svg/g, '');
    assert.doesNotMatch(txt, /https?:\/\//, f + ' no usa URLs externas');
    assert.doesNotMatch(txt, /@import/, f + ' no importa CSS externo');
  }
  const app = read('js/app.js');
  assert.match(app, /register\('\.\/sw\.js'/, 'registra el SW con ruta relativa');
  assert.ok(exists('.nojekyll'), '.nojekyll para GitHub Pages');
});
