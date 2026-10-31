/*
 * Los Multiversos de Bruno — generador de cuentos.
 * Determinístico: la misma semilla + mundo + largo produce siempre el mismo cuento,
 * así se pueden guardar y reabrir sin guardar el texto completo.
 * Cada cuento es un árbol de decisiones precalculado: todas las ramas existen
 * desde el principio, y cada elección lleva a un nodo distinto.
 */
(function (root, factory) {
  var isNode = typeof module === 'object' && module.exports;
  var data = isNode ? require('./data.js') : root.BrunoData;
  var gen = factory(data);
  if (isNode) module.exports = gen;
  else root.BrunoGen = gen;
})(typeof self !== 'undefined' ? self : this, function (D) {
  'use strict';

  /* ---------- Azar con semilla ---------- */
  function hashString(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15;
    return h >>> 0;
  }

  function makeRng(seed) {
    var a = hashString(String(seed));
    function next() {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    return {
      next: next,
      int: function (n) { return Math.floor(next() * n); },
      pick: function (arr) { return arr[Math.floor(next() * arr.length)]; },
      chance: function (p) { return next() < p; },
      shuffle: function (arr) {
        var c = arr.slice();
        for (var i = c.length - 1; i > 0; i--) {
          var j = Math.floor(next() * (i + 1));
          var tmp = c[i]; c[i] = c[j]; c[j] = tmp;
        }
        return c;
      }
    };
  }

  function randomSeed() {
    return Date.now().toString(36) + '-' + Math.floor(Math.random() * 1e9).toString(36);
  }

  /* ---------- Plantillas ---------- */
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* «a el» → «al», «de el» → «del» (pasa cuando un nombre empieza con «el»). */
  function contract(text) {
    return text.replace(/(^|[\s(«"¡¿—])(a|A|de|De) el\b/g, function (m, pre, w) {
      var c = w === 'a' ? 'al' : w === 'A' ? 'Al' : w === 'de' ? 'del' : 'Del';
      return pre + c;
    });
  }

  function fill(tpl, ctx) {
    return contract(tpl.replace(/\{(\w+)\}/g, function (m, key) {
      if (Object.prototype.hasOwnProperty.call(ctx, key)) return ctx[key];
      var lower = key.charAt(0).toLowerCase() + key.slice(1);
      if (lower !== key && Object.prototype.hasOwnProperty.call(ctx, lower)) return capitalize(ctx[lower]);
      throw new Error('Marcador sin valor: {' + key + '}');
    }));
  }

  function assign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var src = arguments[i];
      for (var k in src) if (Object.prototype.hasOwnProperty.call(src, k)) target[k] = src[k];
    }
    return target;
  }

  function worldById(id) {
    for (var i = 0; i < D.WORLDS.length; i++) if (D.WORLDS[i].id === id) return D.WORLDS[i];
    return null;
  }

  var TRAIT_ORDER = ['valentia', 'amistad', 'ingenio', 'honestidad', 'equipo'];

  function dominantTrait(traits, tieBreaker) {
    var counts = {};
    var max = 0;
    traits.forEach(function (t) { counts[t] = (counts[t] || 0) + 1; if (counts[t] > max) max = counts[t]; });
    var tied = TRAIT_ORDER.filter(function (t) { return counts[t] === max; });
    if (tied.indexOf(tieBreaker) !== -1) return tieBreaker;
    for (var i = traits.length - 1; i >= 0; i--) if (tied.indexOf(traits[i]) !== -1) return traits[i];
    return tieBreaker;
  }

  /* ---------- Construcción de un cuento ---------- */
  function build(choice, lengthId, seed) {
    var L = D.LENGTHS[lengthId];
    if (!L) throw new Error('Largo desconocido: ' + lengthId);
    var rng = makeRng(seed + '|base');

    var mode = 'mundo';
    var A = null, B = null;
    if (choice === 'sorpresa') {
      var roll = rng.int(D.WORLDS.length + 1);
      if (roll === D.WORLDS.length) mode = 'multiverso';
      else A = D.WORLDS[roll];
    } else if (choice === 'multiverso') {
      mode = 'multiverso';
    } else {
      A = worldById(choice);
      if (!A) throw new Error('Mundo desconocido: ' + choice);
    }
    if (mode === 'multiverso') {
      var pair = rng.shuffle(D.WORLDS);
      A = pair[0]; B = pair[1];
    }

    var mission = rng.pick(A.missions);
    var openingIdx = rng.int(D.OPENINGS.length);
    var object = rng.pick(D.OBJECTS);
    var color = rng.pick(D.PEARL_COLORS);
    var twistIdx = rng.int(D.TWISTS.length);
    var placesA = rng.shuffle(A.places);
    var placesB = B ? rng.shuffle(B.places) : null;

    var base = {
      mundo: A.name, mundoCorto: A.short,
      aliado: A.hosts[0], aliado2: A.hosts[1],
      extra: rng.pick(A.extras),
      villano: A.villain,
      lugar: placesA[0],
      meta: mission.meta,
      colorPerla: color,
      objeto: object.objeto, unObjeto: object.unObjeto,
      poderObjeto: object.poderObjeto, usoObjeto: object.usoObjeto
    };
    if (B) {
      assign(base, {
        mundoB: B.name, mundoCortoB: B.short,
        aliadoB: B.hosts[0], villanoB: B.villain, lugarB: placesB[0]
      });
    }
    var extraB = B ? rng.pick(B.extras) : null;

    function ctxFor(world, nodeRng) {
      var places = world === B ? placesB : placesA;
      var ctx = assign({}, base);
      if (world === B) {
        assign(ctx, {
          mundo: B.name, mundoCorto: B.short, aliado: B.hosts[0], aliado2: B.hosts[1],
          extra: extraB, lugar: placesB[0]
        });
      }
      ctx.lugar2 = places[1 + nodeRng.int(places.length - 1)];
      return ctx;
    }

    var worldsInPlay = B ? [A, B] : [A];
    var challengePool = [];
    worldsInPlay.forEach(function (w) {
      w.challenges.forEach(function (c) { challengePool.push({ world: w, def: c, generic: false }); });
    });
    var genericPool = D.GENERIC_CHALLENGES.map(function (c) { return { world: A, def: c, generic: true }; });

    var climaxPool = A.climaxes.map(function (c) { return { world: A, def: c }; });
    if (!A.noGenericClimax) {
      D.GENERIC_CLIMAXES.forEach(function (c) { climaxPool.push({ world: A, def: c }); });
    }

    function pickChallenge(nodeRng, used) {
      var preferWorld = nodeRng.chance(0.72);
      var primary = (preferWorld ? challengePool : genericPool).filter(function (c) { return used.indexOf(c.def.id) === -1; });
      var secondary = (preferWorld ? genericPool : challengePool).filter(function (c) { return used.indexOf(c.def.id) === -1; });
      var pool = primary.length ? primary : secondary;
      return nodeRng.pick(pool);
    }

    var decisions = L.decisions;
    var nodes = {};

    function decisionBlock(entry, nodeRng, isClimax) {
      var ctx = ctxFor(entry.world, nodeRng);
      var opts = entry.def.options.map(function (o) {
        return {
          emoji: o.emoji,
          label: fill(o.label, ctx),
          trait: o.trait,
          outcome: fill(o.outcome, ctx),
          memory: o.memory ? fill(o.memory, ctx) : null
        };
      });
      // A veces un desafío ofrece solo dos caminos, para que no todos se sientan iguales.
      if (!isClimax && opts.length > 2 && nodeRng.chance(0.3)) {
        opts.splice(nodeRng.int(opts.length), 1);
      }
      return { situation: fill(entry.def.situation, ctx), options: opts, ctx: ctx };
    }

    function buildNode(path, depth, state) {
      var nodeRng = makeRng(seed + '|' + path);
      var seen = state.seen.slice();
      // Elige un relleno que no se haya usado antes en este mismo camino.
      function fresh(list, key) {
        var free = [];
        for (var i = 0; i < list.length; i++) if (seen.indexOf(key + i) === -1) free.push(i);
        var idx = free.length ? nodeRng.pick(free) : nodeRng.int(list.length);
        seen.push(key + idx);
        return list[idx];
      }
      var ctxA = ctxFor(A, nodeRng);
      var paragraphs = [];
      var node = { id: path, depth: depth, paragraphs: paragraphs, choices: [], ending: null };

      if (lengthId === 'largo') {
        var titles = D.CHAPTER_TITLES[Math.min(depth, D.CHAPTER_TITLES.length - 1)];
        node.chapter = depth + 1;
        node.chapterTitle = fill(nodeRng.pick(titles), ctxA);
      }

      if (depth === 0) {
        paragraphs.push(fill(D.OPENINGS[openingIdx], ctxA));
        paragraphs.push(fill(nodeRng.pick(D.ARRIVALS), ctxA));
        paragraphs.push(fill(nodeRng.pick(A.flavor), ctxA));
        if (A.homeLine) paragraphs.push(A.homeLine);
        paragraphs.push(fill(mission.setup, ctxA));
        paragraphs.push(fill(nodeRng.pick(D.OBJECT_LINES), ctxA));
        if (B) paragraphs.push(fill(nodeRng.pick(D.MULTIVERSE.portals), ctxA));
        if (lengthId === 'largo') paragraphs.push(fill(fresh(D.BANTER, 'b'), ctxA));
      } else {
        paragraphs.push(state.lastOutcome);
        if (depth < decisions) {
          if (lengthId === 'largo') paragraphs.push(fill(fresh(D.TRAVEL, 't'), ctxA));
          if (B) paragraphs.push(fill(fresh(D.MULTIVERSE.crossovers, 'x'), ctxA));
          if (lengthId === 'largo' || (lengthId === 'mediano' && depth === 1)) {
            paragraphs.push(fill(fresh(D.BANTER, 'b'), ctxA));
          }
        }
      }

      if (depth < decisions) {
        var isClimax = depth === decisions - 1;
        var entry, block;
        if (isClimax) {
          if (lengthId !== 'corto' || nodeRng.chance(0.5)) {
            paragraphs.push(fill(D.TWISTS[(twistIdx + depth) % D.TWISTS.length], ctxA));
          }
          entry = nodeRng.pick(climaxPool);
        } else {
          entry = pickChallenge(nodeRng, state.used);
        }
        block = decisionBlock(entry, nodeRng, isClimax);
        paragraphs.push(block.situation);
        paragraphs.push(fill(fresh(D.HUDDLES, 'h'), ctxA));
        node.prompt = nodeRng.pick(D.PROMPTS);
        node.kind = isClimax ? 'climax' : 'desafio';
        node.challengeId = entry.def.id;
        node.world = entry.world.id;
        block.options.forEach(function (opt, i) {
          var childId = path + i;
          node.choices.push({ emoji: opt.emoji, label: opt.label, trait: opt.trait, next: childId });
          nodes[childId] = buildNode(childId, depth + 1, {
            traits: state.traits.concat([opt.trait]),
            memories: opt.memory ? state.memories.concat([opt.memory]) : state.memories,
            used: state.used.concat([entry.def.id]),
            seen: seen,
            lastOutcome: opt.outcome
          });
        });
      } else {
        // Final
        var climaxTrait = state.traits[state.traits.length - 1];
        var lessonTrait = dominantTrait(state.traits, climaxTrait);
        if (B) paragraphs.push(fill(nodeRng.pick(D.MULTIVERSE.closings), ctxA));
        paragraphs.push(fill(mission.resolution, ctxA));
        if (lengthId !== 'corto') {
          paragraphs.push(fill(nodeRng.pick(D.CELEBRATIONS), ctxA));
          if (state.memories.length) {
            var mctx = assign({}, ctxA, { m0: state.memories[0], m1: state.memories[1] || '' });
            var mem = fill(nodeRng.pick(D.MEMORY_LINES), mctx);
            if (state.memories.length > 1) mem += ' ' + fill(nodeRng.pick(D.MEMORY_LINES_2), mctx);
            paragraphs.push(mem);
          }
        }
        paragraphs.push(fill(nodeRng.pick(D.LESSONS[lessonTrait]), ctxA));
        paragraphs.push(fill(nodeRng.pick(D.RETURNS), ctxA));
        paragraphs.push(fill(nodeRng.pick(D.CLOSINGS), ctxA));
        var T = D.TRAITS;
        node.ending = {
          title: T[climaxTrait].ending,
          climaxTrait: climaxTrait,
          lessonTrait: lessonTrait,
          lessonLabel: T[lessonTrait].label,
          badge: T[lessonTrait].badge,
          badgeEmoji: T[lessonTrait].emoji,
          traits: state.traits.slice()
        };
      }
      return node;
    }

    nodes.r = buildNode('r', 0, { traits: [], memories: [], used: [], seen: [], lastOutcome: null });

    var signature = A.id + (B ? '+' + B.id : '') + '|' + mission.id + '|o' + openingIdx + '|' + object.objeto + '|t' + twistIdx;
    return {
      id: 'c' + hashString(seed + '|' + choice + '|' + lengthId).toString(36),
      seed: String(seed),
      choice: choice,
      mode: mode,
      worlds: B ? [A.id, B.id] : [A.id],
      length: lengthId,
      title: mission.title,
      subtitle: B ? A.short + ' + ' + B.short : A.short,
      emoji: B ? '🌀' : A.emoji,
      missionId: mission.id,
      openingIdx: openingIdx,
      signature: signature,
      decisions: decisions,
      start: 'r',
      nodes: nodes
    };
  }

  function parseSignature(sig) {
    var p = String(sig || '').split('|');
    return { worlds: p[0], mission: p[1], opening: p[2], object: p[3], twist: p[4] };
  }

  /* Evita repetir: nunca la misma firma reciente, ni la misma misión del mismo
   * mundo en los últimos dos cuentos, ni el mismo comienzo que los dos anteriores. */
  function collides(story, recent) {
    if (!recent || !recent.length) return false;
    if (recent.indexOf(story.signature) !== -1) return true;
    var me = parseSignature(story.signature);
    var lastTwo = recent.slice(0, 2).map(parseSignature);
    for (var i = 0; i < lastTwo.length; i++) {
      var o = lastTwo[i];
      if (o.worlds.split('+')[0] === me.worlds.split('+')[0] && o.mission === me.mission) return true;
      if (o.opening === me.opening) return true;
    }
    return false;
  }

  function generateStory(opts) {
    opts = opts || {};
    var choice = opts.worldId || 'sorpresa';
    var length = opts.length || 'mediano';
    var seed = opts.seed != null ? String(opts.seed) : randomSeed();
    var recent = opts.recent || [];
    var story = null;
    for (var i = 0; i < 80; i++) {
      var s = i === 0 ? seed : seed + '~' + i;
      story = build(choice, length, s);
      if (!collides(story, recent)) return story;
    }
    return story;
  }

  /* Recorre todos los caminos posibles (útil para tests). */
  function allPaths(story) {
    var out = [];
    (function walk(id, trail) {
      var node = story.nodes[id];
      var t = trail.concat([id]);
      if (!node.choices.length) { out.push(t); return; }
      node.choices.forEach(function (c) { walk(c.next, t); });
    })(story.start, []);
    return out;
  }

  function nodeSpeech(node) {
    var parts = [];
    if (node.chapter) parts.push({ text: 'Capítulo ' + node.chapter + '. ' + node.chapterTitle + '.', heading: true });
    parts = parts.concat(node.paragraphs);
    if (node.choices.length) {
      parts.push({ text: node.prompt, heading: true });
      node.choices.forEach(function (c, i) { parts.push('Opción ' + (i + 1) + ': ' + c.label + '.'); });
    } else if (node.ending) {
      parts.push({ text: 'Fin.', heading: true });
      parts.push(node.ending.title + '. Ganaste la insignia ' + node.ending.badge + '.');
    }
    return parts;
  }

  return {
    generateStory: generateStory,
    fill: fill,
    contract: contract,
    makeRng: makeRng,
    hashString: hashString,
    allPaths: allPaths,
    nodeSpeech: nodeSpeech,
    collides: collides,
    worldById: worldById,
    data: D
  };
});
