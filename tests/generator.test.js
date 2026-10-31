'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const Gen = require('../js/generator.js');
const D = require('../js/data.js');

const CHOICES = ['sorpresa', 'multiverso'].concat(D.WORLDS.map((w) => w.id));
const LENGTHS = Object.keys(D.LENGTHS);
const TRAITS = Object.keys(D.TRAITS);
const SEEDS_PER_COMBO = 25;

function storiesFor(choice, length, n, prefix) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(Gen.generateStory({ worldId: choice, length, seed: (prefix || 's') + i }));
  return out;
}

function allText(story) {
  return Object.values(story.nodes).map((n) => n.paragraphs.join(' ') + ' ' + n.choices.map((c) => c.label).join(' ') + ' ' + (n.chapterTitle || '')).join(' ');
}

function pathText(story, path) {
  return path.map((id) => story.nodes[id].paragraphs.join(' ')).join(' ');
}

// Un set grande y fijo de cuentos para varias pruebas.
const CORPUS = [];
for (const c of CHOICES) for (const l of LENGTHS) CORPUS.push(...storiesFor(c, l, SEEDS_PER_COMBO, c + l));

test('genera cuentos para todos los mundos, modos y largos', () => {
  assert.equal(CORPUS.length, CHOICES.length * LENGTHS.length * SEEDS_PER_COMBO);
  for (const s of CORPUS) {
    assert.ok(s.nodes[s.start], 'existe el nodo inicial');
    assert.ok(s.title && s.subtitle && s.emoji, 'tiene título, subtítulo y emoji');
  }
});

test('ningún cuento ni página sale vacía, ni con marcadores sin completar', () => {
  for (const s of CORPUS) {
    for (const node of Object.values(s.nodes)) {
      assert.ok(node.paragraphs.length >= 1, 'el nodo tiene texto');
      for (const p of node.paragraphs) {
        assert.equal(typeof p, 'string');
        assert.ok(p.trim().length > 30, 'párrafo con contenido: ' + p);
        assert.doesNotMatch(p, /[{}]|undefined|null|NaN|\[object/, 'texto limpio: ' + p);
        assert.doesNotMatch(p, /(^|\s)(a|de) el [A-ZÁÉÍÓÚ]/, 'contracciones al/del: ' + p);
        assert.doesNotMatch(p, /\s{2,}/, 'sin espacios dobles');
      }
      for (const c of node.choices) {
        assert.ok(c.label && c.label.length > 5, 'opción con texto');
        assert.doesNotMatch(c.label, /[{}]|undefined/);
        assert.ok(c.emoji, 'opción con emoji');
      }
      if (node.chapterTitle) assert.doesNotMatch(node.chapterTitle, /[{}]|undefined|(^|\s)(a|de) el [A-Z]/);
    }
  }
});

test('Bruno es siempre el protagonista', () => {
  for (const s of CORPUS) {
    // Bruno aparece en cada página del cuento.
    for (const node of Object.values(s.nodes)) {
      assert.match(node.paragraphs.join(' '), /Bruno/, 'Bruno aparece en el nodo ' + node.id + ' de ' + s.id);
    }
    // El final lo resuelve Bruno: el primer párrafo del final (el desenlace del clímax) lo nombra.
    for (const path of Gen.allPaths(s)) {
      const end = s.nodes[path[path.length - 1]];
      assert.match(end.paragraphs[0], /Bruno/, 'Bruno resuelve el conflicto');
      // Y es el personaje más nombrado del camino.
      const text = pathText(s, path);
      const count = (name) => (text.match(new RegExp(name, 'g')) || []).length;
      const bruno = count('Bruno');
      const others = ['Amy', 'Perlita'].concat(...D.WORLDS.map((w) => w.hosts.concat([w.villain.replace(/^(el|la) /, '')])));
      for (const o of others) assert.ok(bruno > count(o), 'Bruno se nombra más que ' + o + ' (' + bruno + ' vs ' + count(o) + ')');
    }
  }
});

test('Amy y Perlita están en todos los cuentos y ayudan', () => {
  for (const s of CORPUS) {
    const intro = s.nodes[s.start].paragraphs.join(' ');
    assert.match(intro, /Amy/);
    assert.match(intro, /Perlita/);
    for (const path of Gen.allPaths(s)) {
      const t = pathText(s, path);
      assert.ok((t.match(/Amy/g) || []).length >= 2, 'Amy participa en el camino');
      assert.ok((t.match(/Perlita/g) || []).length >= 2, 'Perlita participa en el camino');
    }
  }
});

test('cada decisión tiene 2 o 3 opciones con continuación válida, y el árbol es completo', () => {
  for (const s of CORPUS) {
    const reachable = new Set();
    for (const path of Gen.allPaths(s)) {
      path.forEach((id) => reachable.add(id));
      assert.equal(path.length, s.decisions + 1, 'cantidad de decisiones según el largo');
      const end = s.nodes[path[path.length - 1]];
      assert.ok(end.ending, 'todo camino termina en un final');
      assert.ok(TRAITS.includes(end.ending.lessonTrait));
      assert.ok(TRAITS.includes(end.ending.climaxTrait));
      assert.ok(end.ending.title && end.ending.badge && end.ending.lessonLabel);
    }
    assert.equal(reachable.size, Object.keys(s.nodes).length, 'no hay nodos huérfanos');
    for (const node of Object.values(s.nodes)) {
      if (node.ending) { assert.equal(node.choices.length, 0); continue; }
      assert.ok(node.choices.length >= 2 && node.choices.length <= 3, '2 o 3 opciones');
      assert.ok(node.prompt, 'tiene la pregunta para Bruno');
      const traits = node.choices.map((c) => c.trait);
      assert.equal(new Set(traits).size, traits.length, 'cada opción es un camino distinto');
      for (const c of node.choices) {
        assert.ok(s.nodes[c.next], 'la opción lleva a un nodo que existe');
        assert.equal(s.nodes[c.next].depth, node.depth + 1);
      }
    }
  }
});

test('las elecciones cambian de verdad lo que sigue', () => {
  for (const s of CORPUS) {
    for (const node of Object.values(s.nodes)) {
      if (!node.choices.length) continue;
      const firsts = node.choices.map((c) => s.nodes[c.next].paragraphs[0]);
      assert.equal(new Set(firsts).size, firsts.length, 'cada opción tiene su propia continuación');
      if (node.kind === 'climax') {
        const titles = node.choices.map((c) => s.nodes[c.next].ending.title);
        assert.equal(new Set(titles).size, titles.length, 'cada opción final lleva a un final distinto');
      }
    }
  }
});

test('los largos se respetan: corto < mediano < largo, con capítulos solo en los largos', () => {
  const avg = {};
  for (const l of LENGTHS) {
    const stories = CORPUS.filter((s) => s.length === l);
    let words = 0, paths = 0;
    for (const s of stories) {
      for (const node of Object.values(s.nodes)) {
        if (l === 'largo') {
          assert.equal(node.chapter, node.depth + 1, 'capítulos numerados en orden');
          assert.ok(node.chapterTitle);
        } else {
          assert.equal(node.chapter, undefined);
        }
      }
      for (const p of Gen.allPaths(s)) { words += pathText(s, p).split(/\s+/).length; paths++; }
    }
    avg[l] = words / paths;
    assert.equal(stories[0].decisions, D.LENGTHS[l].decisions);
  }
  assert.ok(avg.corto < avg.mediano && avg.mediano < avg.largo, JSON.stringify(avg));
});

test('es determinístico: misma semilla, mismo cuento', () => {
  for (const c of CHOICES) {
    const a = Gen.generateStory({ worldId: c, length: 'largo', seed: 'fijo-' + c });
    const b = Gen.generateStory({ worldId: c, length: 'largo', seed: 'fijo-' + c });
    assert.deepEqual(a, b);
    // Reabrir desde el guardado (semilla final) da el mismo cuento aunque hubo reintentos.
    const withRecent = Gen.generateStory({ worldId: c, length: 'corto', seed: 'x', recent: [a.signature, 'z|z|o0|z|t0', 'z|z|o1|z|t0'] });
    const reopened = Gen.generateStory({ worldId: c, length: 'corto', seed: withRecent.seed });
    assert.deepEqual(reopened, withRecent);
  }
});

test('nunca dos cuentos iguales seguidos (simulando el uso real con historial)', () => {
  for (const c of CHOICES) {
    let recent = [];
    let prev = null;
    for (let i = 0; i < 120; i++) {
      const s = Gen.generateStory({ worldId: c, length: 'mediano', recent });
      if (prev) {
        assert.notEqual(s.signature, prev.signature, 'firma distinta a la anterior');
        assert.notEqual(s.nodes.r.paragraphs.join(), prev.nodes.r.paragraphs.join(), 'comienzo distinto');
        if (s.worlds[0] === prev.worlds[0]) assert.notEqual(s.missionId, prev.missionId, 'misión distinta a la anterior en el mismo mundo');
        assert.notEqual(s.openingIdx, prev.openingIdx, 'comienzo distinto al anterior');
      }
      recent = [s.signature].concat(recent.filter((x) => x !== s.signature)).slice(0, 12);
      prev = s;
    }
  }
});

test('hay variedad real entre sesiones', () => {
  for (const w of D.WORLDS) {
    const stories = storiesFor(w.id, 'mediano', 60, 'var');
    const sigs = new Set(stories.map((s) => s.signature));
    assert.ok(sigs.size >= 55, w.id + ': firmas distintas ' + sigs.size);
    assert.equal(new Set(stories.map((s) => s.missionId)).size, w.missions.length, 'todas las misiones aparecen');
    assert.ok(new Set(stories.map((s) => s.openingIdx)).size >= 8, 'muchos comienzos distintos');
    const texts = new Set(stories.map((s) => allText(s)));
    assert.equal(texts.size, stories.length, 'ningún cuento completo se repite');
  }
});

test('todos los mundos, personajes, misiones, desafíos y finales son alcanzables', () => {
  const big = [];
  for (const c of CHOICES) for (const l of LENGTHS) big.push(...storiesFor(c, l, 60, 'alc' + c + l));

  // Mundos por «¡Sorprendeme!» y por multiverso (como mundo A y como mundo B).
  const surprise = big.filter((s) => s.choice === 'sorpresa');
  for (const w of D.WORLDS) assert.ok(surprise.some((s) => s.worlds[0] === w.id && s.mode === 'mundo'), 'sorpresa llega a ' + w.id);
  assert.ok(surprise.some((s) => s.mode === 'multiverso'), 'sorpresa llega al multiverso');
  const multi = big.filter((s) => s.mode === 'multiverso');
  for (const w of D.WORLDS) {
    assert.ok(multi.some((s) => s.worlds[0] === w.id), w.id + ' como mundo principal del multiverso');
    assert.ok(multi.some((s) => s.worlds[1] === w.id), w.id + ' como mundo invitado del multiverso');
  }
  multi.forEach((s) => assert.notEqual(s.worlds[0], s.worlds[1], 'el multiverso mezcla dos mundos distintos'));

  // Personajes de cada mundo.
  for (const w of D.WORLDS) {
    const text = big.filter((s) => s.worlds.includes(w.id)).map(allText).join(' ');
    for (const name of w.hosts.concat(w.extras, [w.villain])) {
      const plain = name.replace(/^(el|la) /, '');
      assert.ok(text.includes(plain), w.id + ': aparece ' + name);
    }
  }
  // Misiones, desafíos, clímax y cada una de sus opciones.
  const allNodes = big.flatMap((s) => Object.values(s.nodes));
  const seenChallenges = new Set(allNodes.map((n) => n.challengeId).filter(Boolean));
  const seenLabels = new Set(allNodes.flatMap((n) => n.choices.map((c) => c.label)));
  for (const w of D.WORLDS) {
    for (const m of w.missions) assert.ok(big.some((s) => s.worlds[0] === w.id && s.missionId === m.id), 'misión ' + m.id);
    for (const c of w.challenges.concat(w.climaxes)) {
      assert.ok(seenChallenges.has(c.id), 'aparece ' + c.id);
      for (const o of c.options) assert.ok(seenLabels.has(o.label), 'opción alcanzable: ' + o.label);
    }
  }
  for (const c of D.GENERIC_CHALLENGES.concat(D.GENERIC_CLIMAXES)) assert.ok(seenChallenges.has(c.id), 'aparece ' + c.id);
  // Todas las enseñanzas y todos los finales.
  const endings = allNodes.filter((n) => n.ending);
  for (const t of TRAITS) {
    assert.ok(endings.some((n) => n.ending.lessonTrait === t), 'enseñanza alcanzable: ' + t);
    assert.ok(endings.some((n) => n.ending.title === D.TRAITS[t].ending), 'final alcanzable: ' + D.TRAITS[t].ending);
  }
});

test('la lectura en voz alta arma el texto del nodo con las opciones', () => {
  const s = Gen.generateStory({ worldId: 'hongos', length: 'largo', seed: 'voz' });
  const parts = Gen.nodeSpeech(s.nodes.r);
  assert.match(parts[0], /^Capítulo 1/);
  assert.match(parts[parts.length - 1], /^Opción \d: /);
  const Speech = require('../js/speech.js');
  const chunks = Speech.chunk(parts);
  assert.ok(chunks.length >= parts.length);
  for (const c of chunks) {
    assert.ok(c.length <= 400);
    assert.doesNotMatch(c, /\p{Extended_Pictographic}/u, 'sin emojis en la voz');
  }
});

test('datos rechazados: mundo o largo inexistentes dan error claro', () => {
  assert.throws(() => Gen.generateStory({ worldId: 'nada', length: 'corto', seed: 1 }), /Mundo desconocido/);
  assert.throws(() => Gen.generateStory({ worldId: 'hongos', length: 'eterno', seed: 1 }), /Largo desconocido/);
});
