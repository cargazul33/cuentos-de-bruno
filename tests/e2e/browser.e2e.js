'use strict';
// Prueba de punta a punta en Chromium, con la app servida bajo /cuentos-de-bruno/ (como GitHub Pages).
// Uso: npm run test:e2e   (necesita Playwright con Chromium; si no está, la prueba se saltea)
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const { createServer, BASE } = require('../../tools/serve.js');

let chromium = null;
try { ({ chromium } = require('playwright')); } catch (e) { /* sin Playwright */ }

const SHOTS = process.env.SCREENSHOT_DIR || null;

test('la app funciona de punta a punta bajo /cuentos-de-bruno/', { skip: !chromium && 'Playwright no está instalado' }, async (t) => {
  const served = [];
  const server = createServer((code, p) => served.push([code, p]));
  await new Promise((r) => server.listen(0, r));
  const origin = 'http://localhost:' + server.address().port;
  const url = origin + BASE;

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-AR'
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const badResponses = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  page.on('response', (r) => { if (r.status() >= 400) badResponses.push(r.status() + ' ' + r.url()); });
  page.on('dialog', (d) => d.accept());

  const shot = async (name) => { if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + '.png'), fullPage: false }); };
  const noOverflow = async (where) => {
    const o = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(o <= 0, 'sin scroll horizontal en ' + where + ' (' + o + 'px)');
  };
  const playToEnd = async (pick) => {
    for (let guard = 0; guard < 6; guard++) {
      const buttons = page.locator('.choice-btn');
      const n = await buttons.count();
      if (!n) break;
      await buttons.nth(pick(n)).click();
    }
    await page.locator('#ending').waitFor();
  };

  try {
    await t.test('carga sin 404 y con el service worker dentro del subpath', async () => {
      await page.goto(url, { waitUntil: 'load' });
      await page.locator('#btn-create').waitFor();
      assert.equal(await page.title(), 'Los Multiversos de Bruno');
      const sw = await page.evaluate(async () => {
        const reg = await navigator.serviceWorker.ready;
        return { scope: reg.scope, script: reg.active && reg.active.scriptURL };
      });
      assert.equal(sw.scope, url);
      assert.equal(sw.script, url + 'sw.js');
      const manifestHref = await page.evaluate(() => document.querySelector('link[rel=manifest]').href);
      assert.equal(manifestHref, url + 'manifest.webmanifest');
      const m = await page.evaluate(async (h) => (await fetch(h)).json(), manifestHref);
      assert.equal(new URL(m.start_url, manifestHref).href, url);
      assert.equal(new URL(m.scope, manifestHref).href, url);
      await noOverflow('inicio');
      await shot('1-inicio');
    });

    await t.test('Chromium la considera instalable (sin errores de manifest)', async () => {
      const cdp = await context.newCDPSession(page);
      const manifest = await cdp.send('Page.getAppManifest');
      assert.deepEqual(manifest.errors, [], JSON.stringify(manifest.errors));
      const inst = await cdp.send('Page.getInstallabilityErrors');
      assert.deepEqual(inst.installabilityErrors, [], JSON.stringify(inst.installabilityErrors));
    });

    let firstIntro;
    await t.test('crear un cuento corto del Reino Champiñón y llegar a un final', async () => {
      await page.click('[data-world="hongos"]');
      await page.click('[data-length="corto"]');
      await page.click('#btn-create');
      await page.locator('#view-cuento:not([hidden])').waitFor();
      const intro = await page.locator('.page').first().innerText();
      firstIntro = intro;
      assert.match(intro, /Bruno/);
      assert.match(intro, /Amy/);
      assert.match(intro, /Perlita/);
      assert.match(await page.locator('#story-head').innerText(), /Reino Champiñón/);
      // Lectura en voz alta: o hay voz en español, o se avisa con elegancia.
      const voiceNote = page.locator('#voice-note');
      const playDisabled = await page.locator('#btn-play').isDisabled();
      if (playDisabled) assert.match(await voiceNote.innerText(), /voz|leer/i);
      await noOverflow('cuento');
      await shot('2-cuento');
      await playToEnd(() => 0);
      const ending = await page.locator('#ending').innerText();
      assert.match(ending, /FIN/);
      assert.match(ending, /Insignia ganada/);
      assert.equal(await page.locator('.chosen').count(), 2, 'se ven las 2 decisiones tomadas');
      await page.click('#btn-fav');
      assert.equal(await page.getAttribute('#btn-fav', 'aria-pressed'), 'true');
      await shot('3-final');
    });

    await t.test('«Elegir otro camino» y «Otro cuento nuevo» funcionan', async () => {
      await page.click('#btn-restart');
      assert.equal(await page.locator('.page').count(), 1);
      await playToEnd((n) => n - 1);
      await page.click('#btn-new');
      await page.locator('.page').first().waitFor();
      const intro2 = await page.locator('.page').first().innerText();
      assert.notEqual(intro2, firstIntro, 'el cuento nuevo es distinto');
    });

    await t.test('largo con capítulos, multiverso y sorpresa', async () => {
      await page.goto(url + '#/inicio');
      await page.click('[data-world="sorpresa"]');
      await page.click('[data-length="largo"]');
      await page.click('#btn-create');
      await page.locator('h2.chapter').first().waitFor();
      assert.match(await page.locator('h2.chapter').first().innerText(), /Capítulo 1/i);
      await playToEnd((n) => Math.min(1, n - 1));
      assert.equal(await page.locator('h2.chapter').count(), 4);

      await page.goto(url + '#/inicio');
      await page.click('[data-world="multiverso"]');
      await page.click('[data-length="mediano"]');
      await page.click('#btn-create');
      await page.locator('#story-head').waitFor();
      assert.match(await page.locator('#story-head').innerText(), /\+/);
      await playToEnd((n) => n - 1);
      await shot('4-multiverso');
    });

    await t.test('Mis cuentos y Logros guardan el progreso, también al recargar', async () => {
      await page.goto(url + '#/mis-cuentos');
      await page.reload();
      await page.locator('.lib-item').first().waitFor();
      assert.ok(await page.locator('.lib-item').count() >= 4);
      await page.click('[data-filter="favoritos"]');
      assert.equal(await page.locator('.lib-item').count(), 1);
      await noOverflow('mis cuentos');
      await shot('5-mis-cuentos');
      await page.locator('.lib-open').first().click();
      await page.locator('#view-cuento:not([hidden])').waitFor();
      await page.goto(url + '#/logros');
      await page.locator('.stat b').first().waitFor();
      const finished = Number(await page.locator('.stat b').first().innerText());
      assert.equal(finished, 3, 'terminados: corto + largo + multiverso (releer o crear sin terminar no suma)');
      assert.ok(await page.locator('.achv:not(.off)').count() >= 2);
      await noOverflow('logros');
      await shot('6-logros');
    });

    await t.test('tema claro y tamaño de letra', async () => {
      await page.goto(url + '#/inicio');
      await page.click('#btn-theme');
      assert.equal(await page.getAttribute('html', 'data-theme'), 'claro');
      await shot('7-claro');
      await page.click('#btn-theme');
      assert.equal(await page.getAttribute('html', 'data-theme'), 'oscuro');
    });

    await t.test('abre y crea cuentos sin conexión, desde la caché', async () => {
      await context.setOffline(true);
      await page.goto(url, { waitUntil: 'load' });
      await page.locator('#btn-create').waitFor();
      await page.click('[data-world="puerto"]');
      await page.click('#btn-create');
      await page.locator('.choice-btn').first().waitFor();
      assert.match(await page.locator('#story-head').innerText(), /Puerto de Popeye/);
      await playToEnd(() => 0);
      await context.setOffline(false);
    });

    await t.test('sin errores de consola ni respuestas 404', async () => {
      assert.deepEqual(consoleErrors, []);
      assert.deepEqual(badResponses, []);
      const served404 = served.filter(([code]) => code >= 400);
      assert.deepEqual(served404, []);
      assert.ok(served.every(([, p]) => p.startsWith(BASE)), 'todo se pidió dentro del subpath');
    });
  } finally {
    await browser.close();
    server.close();
  }
});

function mockVoices(voices) {
  return (list) => {
    const spoken = [];
    window.__spoken = spoken;
    window.SpeechSynthesisUtterance = function (text) { this.text = text; };
    const synth = {
      getVoices() { return list; },
      speak(u) {
        spoken.push({ text: u.text, lang: u.lang, voice: u.voice && u.voice.name, rate: u.rate, pitch: u.pitch, t: performance.now() });
        setTimeout(() => u.onend && u.onend(), 120);
      },
      cancel() {}, pause() {}, resume() {}, addEventListener() {}, onvoiceschanged: null
    };
    Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
  };
}

async function openStoryWithVoices(browser, url, voices) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(mockVoices(), voices);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(url);
  await page.click('[data-world="vecindad"]');
  await page.click('[data-length="largo"]');
  await page.click('#btn-create');
  await page.locator('.choice-btn').first().waitFor();
  return { page, errors };
}

test('lectura en voz alta: mejor voz, ritmo de narrador, pausas y velocidad', { skip: !chromium && 'Playwright no está instalado' }, async () => {
  const server = createServer();
  await new Promise((r) => server.listen(0, r));
  const url = 'http://localhost:' + server.address().port + BASE;
  const browser = await chromium.launch();
  try {
    const { page, errors } = await openStoryWithVoices(browser, url, [
      { name: 'English', lang: 'en-US', voiceURI: 'en' },
      { name: 'Spanish basic', lang: 'es-ES', voiceURI: 'es-basic' },
      { name: 'Google español de Estados Unidos', lang: 'es-US', voiceURI: 'google-es-us' }
    ]);
    assert.equal(await page.locator('#voice-note').isHidden(), true, 'con voz natural no hay aviso');
    await page.click('#btn-play');
    await page.waitForFunction(() => window.__spoken.length >= 4);
    await page.click('#btn-pause');
    assert.match(await page.locator('#btn-play').innerText(), /Seguir/);
    let spoken = await page.evaluate(() => window.__spoken);
    assert.ok(spoken.every((u) => u.voice === 'Google español de Estados Unidos' && u.lang === 'es-US'), 'usa la voz de Google');
    assert.ok(spoken.every((u) => u.rate > 0.91 && u.rate < 0.96), 'velocidad de cuento: ' + spoken[0].rate);
    assert.match(spoken[0].text, /^Capítulo 1\./, 'empieza por el capítulo');
    assert.ok(spoken.every((u) => u.text.length <= 230), 'habla oración por oración');
    assert.ok(spoken[1].t - spoken[0].t >= 120 + 800, 'pausa larga después del título');
    assert.ok(spoken[2].t - spoken[1].t >= 120 + 200, 'pausa entre oraciones');
    assert.ok(spoken.every((u) => !/\p{Extended_Pictographic}/u.test(u.text)), 'no lee emojis');

    // Velocidad lenta: se guarda y se aplica al seguir.
    await page.click('[data-speed="lenta"]');
    assert.equal(await page.getAttribute('[data-speed="lenta"]', 'aria-checked'), 'true');
    const before = spoken.length;
    await page.click('#btn-play');
    await page.waitForFunction((n) => window.__spoken.length > n + 1, before);
    spoken = await page.evaluate(() => window.__spoken);
    assert.ok(spoken[spoken.length - 1].rate < 0.85, 'más lenta: ' + spoken[spoken.length - 1].rate);
    await page.click('#btn-stop');
    assert.equal(await page.locator('#btn-stop').isDisabled(), true);
    await page.reload();
    await page.locator('#view-cuento:not([hidden])').waitFor();
    assert.equal(await page.getAttribute('[data-speed="lenta"]', 'aria-checked'), 'true', 'la velocidad quedó guardada');
    assert.deepEqual(errors, []);

    // Solo una voz básica: se puede escuchar, con un aviso amable.
    const basic = await openStoryWithVoices(browser, url, [{ name: 'Spanish basic', lang: 'es-ES', voiceURI: 'es-basic' }]);
    assert.match(await basic.page.locator('#voice-note').innerText(), /voz básica/);
    assert.equal(await basic.page.locator('#btn-play').isEnabled(), true);

    // Sin voz en español: aviso y botones desactivados.
    const none = await openStoryWithVoices(browser, url, [{ name: 'English', lang: 'en-US', voiceURI: 'en' }]);
    await none.page.waitForTimeout(1700);
    assert.match(await none.page.locator('#voice-note').innerText(), /No encontramos una voz en español/);
    assert.equal(await none.page.locator('#btn-play').isDisabled(), true);
    assert.deepEqual(basic.errors.concat(none.errors), []);
  } finally {
    await browser.close();
    server.close();
  }
});

test('el subpath raíz sin barra redirige y nada se sirve fuera de /cuentos-de-bruno/', async () => {
  const server = createServer();
  await new Promise((r) => server.listen(0, r));
  const origin = 'http://localhost:' + server.address().port;
  try {
    const r1 = await fetch(origin + '/cuentos-de-bruno', { redirect: 'manual' });
    assert.equal(r1.status, 301);
    const r2 = await fetch(origin + '/index.html');
    assert.equal(r2.status, 404);
    for (const f of ['', 'manifest.webmanifest', 'sw.js', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'js/app.js']) {
      const r = await fetch(origin + BASE + f);
      assert.equal(r.status, 200, f);
    }
  } finally {
    server.close();
  }
  assert.ok(fs.existsSync(path.join(__dirname, '../../index.html')));
});
