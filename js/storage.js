/*
 * Los Multiversos de Bruno — guardado local.
 * Guarda solo los datos para regenerar cada cuento (semilla, mundo, largo),
 * más historial, favoritos, estadísticas y ajustes.
 * Si el navegador no deja usar localStorage (modo privado, etc.), funciona en memoria.
 */
(function (root, factory) {
  var mod = factory();
  if (typeof module === 'object' && module.exports) module.exports = mod;
  else root.BrunoStore = mod;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var KEY = 'multiversos-de-bruno:v1';
  var MAX_HISTORY = 120;
  var MAX_RECENT = 12;
  var WORLD_IDS = ['hongos', 'veloz', 'taller', 'vecindad', 'puerto'];

  function memoryBackend() {
    var m = {};
    return {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; },
      setItem: function (k, v) { m[k] = String(v); },
      removeItem: function (k) { delete m[k]; }
    };
  }

  function emptyState() {
    return {
      version: 1,
      history: [],
      recent: [],
      stats: { started: 0, finished: 0, choices: 0, worlds: {}, traits: {}, endings: {}, multiverses: 0 },
      settings: { theme: 'oscuro', fontScale: 1, rate: 1 },
      current: null
    };
  }

  function sanitize(raw) {
    var s = emptyState();
    if (!raw || typeof raw !== 'object') return s;
    if (Array.isArray(raw.history)) s.history = raw.history.filter(function (e) { return e && e.id && e.seed; });
    if (Array.isArray(raw.recent)) s.recent = raw.recent.filter(function (x) { return typeof x === 'string'; }).slice(0, MAX_RECENT);
    if (raw.stats && typeof raw.stats === 'object') {
      ['started', 'finished', 'choices', 'multiverses'].forEach(function (k) {
        if (typeof raw.stats[k] === 'number' && raw.stats[k] >= 0) s.stats[k] = raw.stats[k];
      });
      ['worlds', 'traits', 'endings'].forEach(function (k) {
        if (raw.stats[k] && typeof raw.stats[k] === 'object') s.stats[k] = raw.stats[k];
      });
    }
    if (raw.settings && typeof raw.settings === 'object') {
      if (raw.settings.theme === 'claro' || raw.settings.theme === 'oscuro') s.settings.theme = raw.settings.theme;
      if (typeof raw.settings.fontScale === 'number') s.settings.fontScale = Math.min(1.6, Math.max(0.85, raw.settings.fontScale));
      if (typeof raw.settings.lastWorld === 'string') s.settings.lastWorld = raw.settings.lastWorld;
      if (typeof raw.settings.lastLength === 'string') s.settings.lastLength = raw.settings.lastLength;
      if (typeof raw.settings.rate === 'number') s.settings.rate = Math.min(1.4, Math.max(0.7, raw.settings.rate));
    }
    if (raw.current && raw.current.id && Array.isArray(raw.current.path)) s.current = raw.current;
    return s;
  }

  function createStore(backend) {
    var store = backend;
    if (!store) {
      try {
        store = typeof localStorage !== 'undefined' ? localStorage : null;
        if (!store) throw new Error('sin localStorage');
        var probe = KEY + ':probe';
        store.setItem(probe, '1');
        store.removeItem(probe);
      } catch (e) {
        store = memoryBackend();
      }
    }
    if (!store) store = memoryBackend();

    var state;
    try {
      var txt = store.getItem(KEY);
      state = sanitize(txt ? JSON.parse(txt) : null);
    } catch (e) {
      state = emptyState();
    }

    function save() {
      try { store.setItem(KEY, JSON.stringify(state)); return true; } catch (e) { return false; }
    }

    function find(id) {
      for (var i = 0; i < state.history.length; i++) if (state.history[i].id === id) return state.history[i];
      return null;
    }

    function trim() {
      if (state.history.length <= MAX_HISTORY) return;
      // Se borran primero los más viejos que no sean favoritos.
      for (var i = state.history.length - 1; i >= 0 && state.history.length > MAX_HISTORY; i--) {
        if (!state.history[i].favorite) state.history.splice(i, 1);
      }
    }

    var api = {
      KEY: KEY,
      get state() { return state; },

      /* Registra un cuento nuevo (o lo sube al principio si ya existía). */
      addStory: function (story) {
        var entry = find(story.id);
        if (entry) {
          state.history.splice(state.history.indexOf(entry), 1);
        } else {
          entry = {
            id: story.id, seed: story.seed, choice: story.choice, length: story.length,
            worlds: story.worlds.slice(), title: story.title, subtitle: story.subtitle,
            emoji: story.emoji, createdAt: Date.now(), favorite: false, finished: false,
            endingTitle: null, badge: null
          };
          state.stats.started += 1;
        }
        entry.openedAt = Date.now();
        state.history.unshift(entry);
        state.recent = [story.signature].concat(state.recent.filter(function (s) { return s !== story.signature; })).slice(0, MAX_RECENT);
        trim();
        save();
        return entry;
      },

      recordChoice: function () { state.stats.choices += 1; save(); },

      /* Marca un cuento como terminado y actualiza logros. Devuelve true si es la primera vez. */
      finishStory: function (id, ending, worlds) {
        var entry = find(id);
        var first = !!entry && !entry.finished;
        if (entry) {
          entry.finished = true;
          entry.endingTitle = ending.title;
          entry.badge = ending.badge;
          entry.badgeEmoji = ending.badgeEmoji;
        }
        var w = worlds || (entry ? entry.worlds : []);
        if (first || !entry) {
          state.stats.finished += 1;
          w.forEach(function (wid) { state.stats.worlds[wid] = (state.stats.worlds[wid] || 0) + 1; });
          if (w.length > 1) state.stats.multiverses += 1;
          state.stats.traits[ending.lessonTrait] = (state.stats.traits[ending.lessonTrait] || 0) + 1;
        }
        state.stats.endings[ending.title] = (state.stats.endings[ending.title] || 0) + 1;
        save();
        return first;
      },

      toggleFavorite: function (id) {
        var entry = find(id);
        if (!entry) return false;
        entry.favorite = !entry.favorite;
        save();
        return entry.favorite;
      },

      remove: function (id) {
        var entry = find(id);
        if (!entry) return false;
        state.history.splice(state.history.indexOf(entry), 1);
        if (state.current && state.current.id === id) state.current = null;
        save();
        return true;
      },

      get: find,

      list: function (filter) {
        if (filter === 'favoritos') return state.history.filter(function (e) { return e.favorite; });
        return state.history.slice();
      },

      recent: function () { return state.recent.slice(); },

      setCurrent: function (id, path) {
        state.current = id ? { id: id, path: path.slice() } : null;
        save();
      },
      getCurrent: function () { return state.current; },

      getSettings: function () { return state.settings; },
      setSetting: function (k, v) { state.settings[k] = v; save(); },

      worldsVisited: function () {
        return WORLD_IDS.filter(function (w) { return state.stats.worlds[w] > 0; });
      },

      achievements: function () {
        var st = state.stats;
        var favs = state.history.filter(function (e) { return e.favorite; }).length;
        var visited = api.worldsVisited().length;
        var endings = Object.keys(st.endings).length;
        var list = [
          { id: 'primer', emoji: '📖', title: 'Primer cuento', desc: 'Terminaste tu primera aventura.', done: st.finished >= 1 },
          { id: 'lector5', emoji: '📚', title: 'Lector de mundos', desc: 'Terminaste 5 cuentos.', done: st.finished >= 5, progress: [Math.min(st.finished, 5), 5] },
          { id: 'lector15', emoji: '🏰', title: 'Biblioteca andante', desc: 'Terminaste 15 cuentos.', done: st.finished >= 15, progress: [Math.min(st.finished, 15), 15] },
          { id: 'explorador', emoji: '🧭', title: 'Explorador', desc: 'Visitaste 3 mundos distintos.', done: visited >= 3, progress: [Math.min(visited, 3), 3] },
          { id: 'viajero', emoji: '🌍', title: 'Viajero total', desc: 'Visitaste los 5 mundos.', done: visited >= 5, progress: [visited, 5] },
          { id: 'multiversal', emoji: '🌀', title: 'Héroe multiversal', desc: 'Terminaste una aventura en el multiverso.', done: st.multiverses >= 1 },
          { id: 'finales', emoji: '🎬', title: 'Cazador de finales', desc: 'Descubriste 5 finales distintos.', done: endings >= 5, progress: [Math.min(endings, 5), 5] },
          { id: 'decisiones', emoji: '🔀', title: 'Gran decisor', desc: 'Tomaste 25 decisiones.', done: st.choices >= 25, progress: [Math.min(st.choices, 25), 25] },
          { id: 'favoritos', emoji: '⭐', title: 'Coleccionista', desc: 'Guardaste 3 cuentos favoritos.', done: favs >= 3, progress: [Math.min(favs, 3), 3] }
        ];
        return list;
      },

      reset: function () { state = emptyState(); save(); }
    };
    return api;
  }

  return { createStore: createStore, memoryBackend: memoryBackend, KEY: KEY, WORLD_IDS: WORLD_IDS };
});
