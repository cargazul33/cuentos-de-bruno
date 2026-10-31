'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const Store = require('../js/storage.js');
const Gen = require('../js/generator.js');

function story(world, seed, length) {
  return Gen.generateStory({ worldId: world, length: length || 'corto', seed });
}
function endingOf(s) {
  let id = s.start;
  while (s.nodes[id].choices.length) id = s.nodes[id].choices[0].next;
  return s.nodes[id].ending;
}

test('empieza vacío y guarda un cuento en el historial', () => {
  const backend = Store.memoryBackend();
  const st = Store.createStore(backend);
  assert.equal(st.list().length, 0);
  const s = story('hongos', 'a');
  const entry = st.addStory(s);
  assert.equal(entry.id, s.id);
  assert.equal(entry.seed, s.seed);
  assert.equal(st.list().length, 1);
  assert.equal(st.state.stats.started, 1);
  assert.deepEqual(st.recent(), [s.signature]);
  // Se persiste en el backend como JSON.
  const raw = JSON.parse(backend.getItem(Store.KEY));
  assert.equal(raw.history[0].id, s.id);
});

test('lo guardado sobrevive a recargar la app y regenera el mismo cuento', () => {
  const backend = Store.memoryBackend();
  const a = Store.createStore(backend);
  const s = story('veloz', 'b', 'largo');
  a.addStory(s);
  a.setCurrent(s.id, ['r', 'r1']);
  const b = Store.createStore(backend);
  const entry = b.get(s.id);
  assert.ok(entry);
  assert.deepEqual(b.getCurrent(), { id: s.id, path: ['r', 'r1'] });
  const again = Gen.generateStory({ worldId: entry.choice, length: entry.length, seed: entry.seed });
  assert.deepEqual(again, s);
});

test('favoritos: marcar, filtrar y desmarcar', () => {
  const st = Store.createStore(Store.memoryBackend());
  const s1 = story('taller', 'c1');
  const s2 = story('puerto', 'c2');
  st.addStory(s1); st.addStory(s2);
  assert.equal(st.toggleFavorite(s1.id), true);
  assert.deepEqual(st.list('favoritos').map((e) => e.id), [s1.id]);
  assert.equal(st.toggleFavorite(s1.id), false);
  assert.equal(st.list('favoritos').length, 0);
  assert.equal(st.toggleFavorite('no-existe'), false);
});

test('terminar un cuento suma estadísticas, mundos e insignias una sola vez', () => {
  const st = Store.createStore(Store.memoryBackend());
  const s = story('vecindad', 'd');
  st.addStory(s);
  const end = endingOf(s);
  assert.equal(st.finishStory(s.id, end, s.worlds), true);
  assert.equal(st.finishStory(s.id, end, s.worlds), false, 'releer no vuelve a sumar');
  assert.equal(st.state.stats.finished, 1);
  assert.equal(st.state.stats.worlds.vecindad, 1);
  assert.equal(st.state.stats.traits[end.lessonTrait], 1);
  assert.deepEqual(st.worldsVisited(), ['vecindad']);
  const e = st.get(s.id);
  assert.equal(e.finished, true);
  assert.equal(e.endingTitle, end.title);
  assert.equal(e.badge, end.badge);
});

test('logros: se desbloquean con el uso', () => {
  const st = Store.createStore(Store.memoryBackend());
  const done = () => st.achievements().filter((a) => a.done).map((a) => a.id);
  assert.deepEqual(done(), []);
  const worlds = ['hongos', 'veloz', 'taller', 'vecindad', 'puerto'];
  worlds.forEach((w, i) => {
    const s = story(w, 'e' + i);
    st.addStory(s);
    st.recordChoice(); st.recordChoice();
    st.finishStory(s.id, endingOf(s), s.worlds);
  });
  const m = Gen.generateStory({ worldId: 'multiverso', length: 'corto', seed: 'mv' });
  st.addStory(m);
  st.finishStory(m.id, endingOf(m), m.worlds);
  [m.id, st.list()[1].id, st.list()[2].id].forEach((id) => st.toggleFavorite(id));
  const got = done();
  for (const id of ['primer', 'lector5', 'explorador', 'viajero', 'multiversal', 'favoritos']) assert.ok(got.includes(id), 'logro ' + id);
  assert.ok(!got.includes('lector15'));
  const l15 = st.achievements().find((a) => a.id === 'lector15');
  assert.deepEqual(l15.progress, [6, 15]);
});

test('borrar un cuento lo saca del historial y del cuento actual', () => {
  const st = Store.createStore(Store.memoryBackend());
  const s = story('hongos', 'f');
  st.addStory(s);
  st.setCurrent(s.id, ['r']);
  assert.equal(st.remove(s.id), true);
  assert.equal(st.get(s.id), null);
  assert.equal(st.getCurrent(), null);
  assert.equal(st.remove(s.id), false);
});

test('el historial tiene tope pero nunca borra favoritos', () => {
  const st = Store.createStore(Store.memoryBackend());
  const first = story('hongos', 'fav-viejo');
  st.addStory(first);
  st.toggleFavorite(first.id);
  for (let i = 0; i < 140; i++) st.addStory(story('veloz', 'h' + i));
  assert.ok(st.list().length <= 120);
  assert.ok(st.get(first.id), 'el favorito viejo sigue guardado');
});

test('si los datos guardados están rotos, arranca limpio sin romperse', () => {
  const backend = Store.memoryBackend();
  backend.setItem(Store.KEY, '{esto no es json');
  const st = Store.createStore(backend);
  assert.equal(st.list().length, 0);
  backend.setItem(Store.KEY, JSON.stringify({ history: [null, { id: 'x' }, 5], stats: { finished: -3 }, settings: { theme: 'raro', fontScale: 99 } }));
  const st2 = Store.createStore(backend);
  assert.equal(st2.list().length, 0);
  assert.equal(st2.state.stats.finished, 0);
  assert.equal(st2.getSettings().theme, 'oscuro');
  assert.equal(st2.getSettings().fontScale, 1.6);
});

test('si el navegador no deja guardar (almacenamiento lleno o bloqueado), sigue funcionando', () => {
  const broken = { getItem() { throw new Error('bloqueado'); }, setItem() { throw new Error('lleno'); }, removeItem() {} };
  const st = Store.createStore(broken);
  const s = story('puerto', 'g');
  assert.doesNotThrow(() => st.addStory(s));
  assert.equal(st.list().length, 1);
  assert.doesNotThrow(() => st.finishStory(s.id, endingOf(s), s.worlds));
});

test('ajustes: tema, tamaño de letra y última elección se recuerdan', () => {
  const backend = Store.memoryBackend();
  const st = Store.createStore(backend);
  st.setSetting('theme', 'claro');
  st.setSetting('fontScale', 1.3);
  st.setSetting('lastWorld', 'multiverso');
  st.setSetting('lastLength', 'largo');
  const again = Store.createStore(backend).getSettings();
  assert.equal(again.theme, 'claro');
  assert.equal(again.fontScale, 1.3);
  assert.equal(again.lastWorld, 'multiverso');
  assert.equal(again.lastLength, 'largo');
});

test('usa localStorage real si existe (navegador)', () => {
  const mem = Store.memoryBackend();
  global.localStorage = mem;
  try {
    const st = Store.createStore();
    st.addStory(story('hongos', 'ls'));
    assert.ok(mem.getItem(Store.KEY), 'escribió en localStorage');
  } finally {
    delete global.localStorage;
  }
});
