/* Los Multiversos de Bruno — interfaz */
(function () {
  'use strict';

  var D = window.BrunoData;
  var Gen = window.BrunoGen;
  var store = window.BrunoStore.createStore();
  var speech = window.BrunoSpeech.createSpeech(updateVoiceUI);

  var settings = store.getSettings();
  speech.setSpeed(settings.voiceSpeed || 'normal');
  var selected = { world: settings.lastWorld || 'sorpresa', length: settings.lastLength || 'mediano' };
  var current = null; // { story, path: [nodeId...] }
  var libraryFilter = 'todos';
  var deferredInstall = null;

  var $ = function (id) { return document.getElementById(id); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === 'text') node.textContent = v;
        else if (k === 'class') node.className = v;
        else if (k.slice(0, 2) === 'on') node.addEventListener(k.slice(2), v);
        else if (k === 'style') node.setAttribute('style', v);
        else node.setAttribute(k, v === true ? '' : v);
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  var toastTimer = null;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  }

  function worldInfo(id) {
    return Gen.worldById(id) || D.MODES.filter(function (m) { return m.id === id; })[0];
  }

  /* ---------- Tema y letra ---------- */
  function applyTheme() {
    var theme = settings.theme === 'claro' ? 'claro' : 'oscuro';
    document.documentElement.setAttribute('data-theme', theme);
    var btn = $('btn-theme');
    btn.textContent = theme === 'claro' ? '🌙' : '☀️';
    btn.setAttribute('aria-label', theme === 'claro' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'claro' ? '#fff6e9' : '#120e33');
  }
  function applyFont() {
    document.documentElement.style.setProperty('--font-scale', String(settings.fontScale || 1));
  }

  /* ---------- Inicio ---------- */
  function renderHome() {
    var grid = $('world-grid');
    clear(grid);
    var order = ['sorpresa'].concat(D.WORLDS.map(function (w) { return w.id; })).concat(['multiverso']);
    order.forEach(function (id) {
      var w = worldInfo(id);
      var wide = id === 'sorpresa' || id === 'multiverso';
      var name = w.short || w.name;
      if (id === 'veloz') name = 'Mundo de Sonic';
      var btn = el('button', {
        class: 'world-card' + (wide ? ' wide' : ''),
        role: 'radio',
        'aria-checked': selected.world === id ? 'true' : 'false',
        style: '--c1:' + w.colors[0] + ';--c2:' + w.colors[1],
        'data-world': id,
        onclick: function () {
          selected.world = id;
          store.setSetting('lastWorld', id);
          renderHome();
        }
      }, [
        el('span', { class: 'w-emoji', 'aria-hidden': 'true', text: w.emoji }),
        el('span', {}, [
          el('span', { class: 'w-name', text: name }),
          el('br'),
          el('span', { class: 'w-tag', text: w.tagline })
        ])
      ]);
      grid.appendChild(btn);
    });

    var row = $('length-row');
    clear(row);
    Object.keys(D.LENGTHS).forEach(function (id) {
      var L = D.LENGTHS[id];
      row.appendChild(el('button', {
        class: 'len-btn', role: 'radio', 'aria-checked': selected.length === id ? 'true' : 'false', 'data-length': id,
        onclick: function () { selected.length = id; store.setSetting('lastLength', id); renderHome(); }
      }, [
        el('span', { class: 'l-emoji', 'aria-hidden': 'true', text: L.emoji }),
        el('span', { class: 'l-name', text: L.label }),
        el('span', { class: 'l-desc', text: L.desc })
      ]));
    });

    var st = store.state.stats;
    var visited = store.worldsVisited().length;
    $('hero-stats').textContent = st.finished
      ? '📖 ' + st.finished + (st.finished === 1 ? ' cuento leído' : ' cuentos leídos') + ' · 🌍 ' + visited + ' de 5 mundos visitados'
      : '¿Listo para tu primera aventura?';
  }

  function createStory(worldId, length) {
    var story = Gen.generateStory({ worldId: worldId, length: length, recent: store.recent() });
    openStory(story, [story.start]);
  }

  function openStory(story, path) {
    speech.stop();
    store.addStory(story);
    current = { story: story, path: path.slice() };
    store.setCurrent(story.id, current.path);
    if (location.hash !== '#/cuento') location.hash = '#/cuento';
    else showView('cuento');
    renderStory();
    window.scrollTo(0, 0);
  }

  /* ---------- Cuento ---------- */
  function renderStory() {
    if (!current) return;
    var story = current.story;
    var entry = store.get(story.id);
    var head = $('story-head');
    clear(head);
    var L = D.LENGTHS[story.length];
    head.appendChild(el('span', { class: 's-emoji', 'aria-hidden': 'true', text: story.emoji }));
    head.appendChild(el('div', {}, [
      el('h1', { text: story.title }),
      el('div', { class: 'pills' }, [
        el('span', { class: 'pill', text: (story.mode === 'multiverso' ? '🌀 ' : '') + story.subtitle }),
        el('span', { class: 'pill', text: L.emoji + ' ' + L.label })
      ])
    ]));

    var fav = $('btn-fav');
    var isFav = !!(entry && entry.favorite);
    fav.textContent = isFav ? '⭐' : '☆';
    fav.setAttribute('aria-pressed', isFav ? 'true' : 'false');
    fav.setAttribute('aria-label', isFav ? 'Quitar de favoritos' : 'Guardar en favoritos');

    var pages = $('story-pages');
    clear(pages);
    current.path.forEach(function (nodeId, i) {
      var node = story.nodes[nodeId];
      var isLast = i === current.path.length - 1;
      var page = el('article', { class: 'page card', id: 'page-' + nodeId });
      if (node.chapter) {
        page.appendChild(el('h2', { class: 'chapter' }, ['Capítulo ' + node.chapter, el('span', { text: node.chapterTitle })]));
      }
      node.paragraphs.forEach(function (p) { page.appendChild(el('p', { text: p })); });

      if (node.choices.length) {
        if (isLast) {
          page.appendChild(el('p', { class: 'prompt', text: node.prompt }));
          var box = el('div', { class: 'choices' });
          node.choices.forEach(function (c, idx) {
            box.appendChild(el('button', {
              class: 'choice-btn', 'data-choice': String(idx),
              onclick: function () { choose(idx); }
            }, [
              el('span', { class: 'c-emoji', 'aria-hidden': 'true', text: c.emoji }),
              el('span', { text: c.label }),
              el('span', { class: 'c-num', 'aria-hidden': 'true', text: String(idx + 1) })
            ]));
          });
          page.appendChild(box);
        } else {
          var nextId = current.path[i + 1];
          var picked = node.choices.filter(function (c) { return c.next === nextId; })[0];
          if (picked) page.appendChild(el('div', { class: 'chosen' }, [picked.emoji + ' Bruno eligió: ' + picked.label]));
        }
      }
      pages.appendChild(page);

      if (!node.choices.length && node.ending) pages.appendChild(renderEnding(node.ending));
    });
    updateVoiceUI();
  }

  function renderEnding(ending, unlocked) {
    var box = el('section', { class: 'ending card', id: 'ending' }, [
      el('div', { class: 'fin', text: '✦ FIN ✦' }),
      el('div', { class: 'badge-big', 'aria-hidden': 'true', text: ending.badgeEmoji }),
      el('h2', { text: ending.title }),
      el('p', {}, ['Insignia ganada: ', el('strong', { text: ending.badge })]),
      el('p', { text: 'Lo que más brilló hoy: ' + ending.lessonLabel + '.' })
    ]);
    if (unlocked && unlocked.length) {
      box.appendChild(el('p', { class: 'new-achv', text: '🏆 ¡Logro nuevo! ' + unlocked.map(function (a) { return a.emoji + ' ' + a.title; }).join(' · ') }));
    }
    box.appendChild(el('div', { class: 'actions' }, [
      el('button', { class: 'action-btn', id: 'btn-new', onclick: function () { createStory(current.story.choice, current.story.length); } }, ['✨ Otro cuento nuevo']),
      el('button', { class: 'action-btn alt', id: 'btn-restart', onclick: restart }, ['🔁 Elegir otro camino']),
      el('button', { class: 'action-btn alt', onclick: function () { location.hash = '#/inicio'; } }, ['🏠 Inicio'])
    ]));
    return box;
  }

  function choose(idx) {
    if (!current) return;
    var node = current.story.nodes[current.path[current.path.length - 1]];
    var choice = node.choices[idx];
    if (!choice) return;
    speech.stop();
    current.path.push(choice.next);
    store.recordChoice();
    store.setCurrent(current.story.id, current.path);
    renderStory();
    var next = current.story.nodes[choice.next];
    if (next.ending) {
      var before = doneIds();
      var first = store.finishStory(current.story.id, next.ending, current.story.worlds);
      var unlocked = store.achievements().filter(function (a) { return a.done && before.indexOf(a.id) === -1; });
      var old = $('ending');
      if (old) old.parentNode.replaceChild(renderEnding(next.ending, unlocked), old);
      if (first) toast(next.ending.badgeEmoji + ' ¡Ganaste la insignia ' + next.ending.badge + '!');
      renderStoryFav();
    }
    var page = $('page-' + choice.next);
    if (page) page.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function renderStoryFav() {
    var entry = current && store.get(current.story.id);
    var fav = $('btn-fav');
    var isFav = !!(entry && entry.favorite);
    fav.textContent = isFav ? '⭐' : '☆';
    fav.setAttribute('aria-pressed', isFav ? 'true' : 'false');
  }

  function doneIds() {
    return store.achievements().filter(function (a) { return a.done; }).map(function (a) { return a.id; });
  }

  function restart() {
    if (!current) return;
    speech.stop();
    current.path = [current.story.start];
    store.setCurrent(current.story.id, current.path);
    renderStory();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    toast('🔁 ¡Mismo cuento, otro camino! Elegí distinto esta vez.');
  }

  /* ---------- Voz ---------- */
  function updateVoiceUI() {
    var play = $('btn-play'), pause = $('btn-pause'), stop = $('btn-stop'), note = $('voice-note');
    if (!play) return;
    var status = speech.status;
    if (!speech.supported) {
      play.disabled = true; pause.disabled = true; stop.disabled = true;
      setSpeedButtons(true);
      note.hidden = false;
      note.textContent = '🔇 Este dispositivo no puede leer en voz alta, pero el cuento se lee igual de bien con los ojos.';
      return;
    }
    if (!speech.hasSpanish) {
      play.disabled = true; pause.disabled = true; stop.disabled = true;
      note.hidden = false;
      note.textContent = '🔇 No encontramos una voz en español en este dispositivo, así que la lectura en voz alta no está disponible. ¡Podés seguir leyendo el texto!';
      setSpeedButtons(true);
      return;
    }
    setSpeedButtons(false);
    if (speech.natural) {
      note.hidden = true;
    } else {
      // Hay voz en español, pero es la básica del dispositivo: se puede usar igual.
      note.hidden = false;
      note.textContent = '🗣️ Este dispositivo solo tiene una voz básica en español y puede sonar un poco robótica. Se puede escuchar igual; en Chrome o Edge suele haber voces más naturales.';
    }
    play.disabled = status === 'playing';
    play.textContent = status === 'paused' ? '▶️ Seguir' : '▶️ Escuchar';
    play.classList.toggle('on', status === 'playing');
    pause.disabled = status !== 'playing';
    stop.disabled = status === 'idle';
  }

  function setSpeedButtons(disabled) {
    $('speed-row').hidden = disabled;
    Array.prototype.forEach.call(document.querySelectorAll('.speed-btn'), function (b) {
      b.disabled = disabled;
      b.setAttribute('aria-checked', b.getAttribute('data-speed') === speech.speed ? 'true' : 'false');
    });
  }

  function playCurrent() {
    if (!current) return;
    if (speech.status === 'paused') { speech.resume(); return; }
    var node = current.story.nodes[current.path[current.path.length - 1]];
    speech.play(Gen.nodeSpeech(node));
  }

  /* ---------- Mis cuentos ---------- */
  function renderLibrary() {
    var list = $('library');
    clear(list);
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (t) {
      t.setAttribute('aria-selected', t.getAttribute('data-filter') === libraryFilter ? 'true' : 'false');
    });
    var items = store.list(libraryFilter);
    if (!items.length) {
      list.appendChild(el('li', { class: 'empty card' }, [
        el('span', { class: 'e-emoji', 'aria-hidden': 'true', text: libraryFilter === 'favoritos' ? '⭐' : '📖' }),
        libraryFilter === 'favoritos'
          ? 'Todavía no tenés favoritos. Tocá la estrella ☆ mientras leés un cuento para guardarlo acá.'
          : 'Todavía no hay cuentos. ¡Creá el primero desde Inicio!'
      ]));
      return;
    }
    items.forEach(function (e) {
      var date = new Date(e.openedAt || e.createdAt);
      var when = date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
      var L = D.LENGTHS[e.length];
      var status = e.finished ? (e.badgeEmoji || '✅') + ' ' + e.endingTitle : '⏳ Sin terminar';
      list.appendChild(el('li', { class: 'lib-item card' }, [
        el('button', { class: 'lib-open', onclick: function () { reopen(e); } }, [
          el('span', { class: 'li-emoji', 'aria-hidden': 'true', text: e.emoji }),
          el('span', {}, [
            el('strong', { text: e.title }),
            el('small', { text: e.subtitle + ' · ' + (L ? L.label : '') + ' · ' + when }),
            el('small', { text: status })
          ])
        ]),
        el('div', { class: 'lib-actions' }, [
          el('button', {
            class: 'icon-btn', 'aria-label': e.favorite ? 'Quitar de favoritos' : 'Marcar como favorito', 'aria-pressed': e.favorite ? 'true' : 'false',
            onclick: function () { store.toggleFavorite(e.id); renderLibrary(); }
          }, [e.favorite ? '⭐' : '☆']),
          el('button', {
            class: 'icon-btn', 'aria-label': 'Borrar cuento',
            onclick: function () {
              if (window.confirm('¿Borrar «' + e.title + '» de Mis cuentos?')) { store.remove(e.id); renderLibrary(); }
            }
          }, ['🗑️'])
        ])
      ]));
    });
  }

  function reopen(entry) {
    var story = Gen.generateStory({ worldId: entry.choice, length: entry.length, seed: entry.seed });
    var cur = store.getCurrent();
    var path = [story.start];
    if (cur && cur.id === story.id && validPath(story, cur.path)) path = cur.path;
    openStory(story, path);
  }

  function validPath(story, path) {
    if (!path.length || path[0] !== story.start) return false;
    for (var i = 0; i < path.length; i++) {
      var n = story.nodes[path[i]];
      if (!n) return false;
      if (i < path.length - 1 && !n.choices.some(function (c) { return c.next === path[i + 1]; })) return false;
    }
    return true;
  }

  /* ---------- Logros ---------- */
  function renderAchievements() {
    var st = store.state.stats;
    var row = $('stat-row');
    clear(row);
    [[st.finished, 'cuentos leídos'], [st.choices, 'decisiones'], [store.worldsVisited().length + '/5', 'mundos']].forEach(function (s) {
      row.appendChild(el('div', { class: 'stat card' }, [el('b', { text: String(s[0]) }), el('span', { text: s[1] })]));
    });

    var vis = $('visited');
    clear(vis);
    D.WORLDS.forEach(function (w) {
      var n = st.worlds[w.id] || 0;
      vis.appendChild(el('div', { class: 'v-world' + (n ? '' : ' off'), title: w.short }, [
        el('span', { class: 'v-emoji', 'aria-hidden': 'true', text: w.emoji }),
        n ? '×' + n : '—'
      ]));
    });

    var badges = $('badges');
    clear(badges);
    Object.keys(D.TRAITS).forEach(function (k) {
      var T = D.TRAITS[k];
      var n = st.traits[k] || 0;
      badges.appendChild(el('div', { class: 'badge card' + (n ? '' : ' off') }, [
        el('span', { class: 'b-emoji', 'aria-hidden': 'true', text: T.emoji }),
        el('strong', { text: T.badge }),
        el('small', { text: n ? 'Ganada ×' + n : T.label })
      ]));
    });

    var ul = $('achievements');
    clear(ul);
    store.achievements().forEach(function (a) {
      var info = [el('strong', { text: a.title }), el('small', { text: a.desc })];
      if (a.progress && !a.done) {
        info.push(el('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(a.progress[1]), 'aria-valuenow': String(a.progress[0]) },
          [el('i', { style: 'width:' + Math.round(100 * a.progress[0] / a.progress[1]) + '%' })]));
      }
      ul.appendChild(el('li', { class: 'achv card' + (a.done ? '' : ' off') }, [
        el('span', { class: 'a-emoji', 'aria-hidden': 'true', text: a.emoji }),
        el('div', {}, info),
        el('span', { class: 'check', 'aria-label': a.done ? 'Conseguido' : 'Pendiente', text: a.done ? '✅' : '' })
      ]));
    });
  }

  /* ---------- Navegación ---------- */
  var VIEWS = ['inicio', 'cuento', 'mis-cuentos', 'logros'];
  function showView(name) {
    if (VIEWS.indexOf(name) === -1) name = 'inicio';
    if (name !== 'cuento') speech.stop();
    VIEWS.forEach(function (v) { $('view-' + v).hidden = v !== name; });
    Array.prototype.forEach.call(document.querySelectorAll('.bottom-nav a'), function (a) {
      var on = a.getAttribute('data-view') === name;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (name === 'inicio') renderHome();
    if (name === 'mis-cuentos') renderLibrary();
    if (name === 'logros') renderAchievements();
  }

  function route() {
    var name = (location.hash || '#/inicio').replace(/^#\/?/, '') || 'inicio';
    if (name === 'cuento' && !current) {
      var cur = store.getCurrent();
      var entry = cur && store.get(cur.id);
      if (entry) {
        var story = Gen.generateStory({ worldId: entry.choice, length: entry.length, seed: entry.seed });
        if (story.id === entry.id) current = { story: story, path: validPath(story, cur.path) ? cur.path.slice() : [story.start] };
      }
      if (!current) { location.replace('#/inicio'); return; }
    }
    showView(name);
    if (name === 'cuento') renderStory();
    if (name !== 'cuento') window.scrollTo(0, 0);
  }

  /* ---------- Eventos ---------- */
  function bind() {
    $('btn-create').addEventListener('click', function () { createStory(selected.world, selected.length); });
    $('btn-back').addEventListener('click', function () { location.hash = '#/inicio'; });
    $('btn-fav').addEventListener('click', function () {
      if (!current) return;
      var on = store.toggleFavorite(current.story.id);
      renderStoryFav();
      toast(on ? '⭐ Guardado en favoritos' : 'Quitado de favoritos');
    });
    $('btn-font-up').addEventListener('click', function () {
      settings.fontScale = Math.min(1.6, Math.round(((settings.fontScale || 1) + 0.1) * 10) / 10);
      store.setSetting('fontScale', settings.fontScale); applyFont();
    });
    $('btn-font-down').addEventListener('click', function () {
      settings.fontScale = Math.max(0.85, Math.round(((settings.fontScale || 1) - 0.1) * 100) / 100);
      store.setSetting('fontScale', settings.fontScale); applyFont();
    });
    $('btn-theme').addEventListener('click', function () {
      settings.theme = settings.theme === 'claro' ? 'oscuro' : 'claro';
      store.setSetting('theme', settings.theme); applyTheme();
    });
    $('btn-play').addEventListener('click', playCurrent);
    $('btn-pause').addEventListener('click', function () { speech.pause(); });
    $('btn-stop').addEventListener('click', function () { speech.stop(); });
    Array.prototype.forEach.call(document.querySelectorAll('.speed-btn'), function (b) {
      b.addEventListener('click', function () {
        var s = b.getAttribute('data-speed');
        speech.setSpeed(s);
        settings.voiceSpeed = s;
        store.setSetting('voiceSpeed', s);
        updateVoiceUI();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (t) {
      t.addEventListener('click', function () { libraryFilter = t.getAttribute('data-filter'); renderLibrary(); });
    });
    document.addEventListener('keydown', function (ev) {
      if ($('view-cuento').hidden || ev.altKey || ev.ctrlKey || ev.metaKey) return;
      var n = parseInt(ev.key, 10);
      if (n >= 1 && n <= 3) {
        var btn = document.querySelector('.choice-btn[data-choice="' + (n - 1) + '"]');
        if (btn) btn.click();
      }
    });
    window.addEventListener('hashchange', route);

    window.addEventListener('beforeinstallprompt', function (ev) {
      ev.preventDefault();
      deferredInstall = ev;
      $('btn-install').hidden = false;
    });
    $('btn-install').addEventListener('click', function () {
      if (!deferredInstall) return;
      deferredInstall.prompt();
      deferredInstall.userChoice.then(function () { deferredInstall = null; $('btn-install').hidden = true; });
    });
    window.addEventListener('appinstalled', function () { $('btn-install').hidden = true; toast('📲 ¡App instalada!'); });
  }

  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    var secure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    if (!secure) return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(function () { /* sin conexión o sin permiso: la app sigue funcionando */ });
    });
  }

  applyTheme();
  applyFont();
  bind();
  route();
  registerSW();
})();
