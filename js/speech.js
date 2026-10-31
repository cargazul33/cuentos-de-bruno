/*
 * Los Multiversos de Bruno — lectura en voz alta con la voz del navegador.
 *
 * - Elige la mejor voz en español disponible: primero las naturales/neurales
 *   (Google, Microsoft «Natural»/«Online», Apple «Mejorada»/«Premium»), y entre
 *   ellas prefiere es-419 / es-MX / es-US / es-AR y luego es-ES.
 * - Ritmo de cuento: algo más lento que lo normal, entonación levemente expresiva
 *   y pausas reales entre oraciones, párrafos y capítulos.
 * - Habla oración por oración (no se corta en textos largos).
 * - Pausar = detener y recordar la oración; seguir = continuar desde ahí
 *   (más confiable que speechSynthesis.pause() en Chrome y Android).
 */
(function (root) {
  'use strict';

  // Velocidad base de narrador y multiplicador según el ajuste de Bruno.
  var BASE_RATE = 0.93;
  var SPEEDS = {
    lenta: { label: 'Lenta', emoji: '🐢', factor: 0.86 },
    normal: { label: 'Normal', emoji: '🙂', factor: 1 },
    rapida: { label: 'Rápida', emoji: '🐇', factor: 1.14 }
  };

  // Pausas (en milisegundos) después de cada tipo de fragmento.
  var PAUSE = { sentence: 260, paragraph: 650, heading: 900 };

  var REGION_SCORE = { 'es-419': 30, 'es-mx': 28, 'es-us': 26, 'es-ar': 26, 'es-co': 22, 'es-cl': 20, 'es-uy': 20, 'es-es': 18 };

  function normLang(l) { return String(l || '').replace('_', '-').toLowerCase(); }

  function isSpanish(v) { return /^es(-|$)/.test(normLang(v.lang)); }

  /* Puntaje de calidad de una voz (más alto = suena más natural). */
  function voiceScore(v) {
    var name = String(v.name || '') + ' ' + String(v.voiceURI || '');
    var score = 0;
    if (/natural|neural/i.test(name)) score += 300;            // Microsoft/Edge «Natural», voces neurales
    if (/premium|enhanced|mejorada|siri/i.test(name)) score += 260; // Apple mejoradas/premium
    if (/google/i.test(name)) score += 220;                    // Voces de Google (Chrome / Android)
    if (/online/i.test(name)) score += 120;                    // Microsoft «Online»
    if (/-network|network/i.test(name)) score += 100;          // Android: voces por red (de mejor calidad)
    if (/espeak|compact|eloquence|robot|novelty/i.test(name)) score -= 200;
    var region = REGION_SCORE[normLang(v.lang)];
    score += region != null ? region : 10;
    return score;
  }

  /* Ordena las voces en español de mejor a peor. */
  function rankVoices(voices) {
    return (voices || []).filter(isSpanish).map(function (v, i) { return { v: v, s: voiceScore(v), i: i }; })
      .sort(function (a, b) { return b.s - a.s || a.i - b.i; })
      .map(function (x) { return x.v; });
  }

  /* ¿Es una voz «buena» (natural/neural/mejorada)? */
  function isNaturalVoice(v) { return !!v && voiceScore(v) >= 150; }

  function stripForSpeech(text) {
    return String(text)
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{1F1E6}-\u{1F1FF}]/gu, '')
      .replace(/\s*—\s*/g, ', ')
      .replace(/[«»"]/g, '')
      .replace(/\(([^)]*)\)/g, ', $1,')
      .replace(/^\s*[,.]\s*/, '')
      .replace(/\s*,\s*([.!?…,:;])/g, '$1')
      .replace(/,\s*,/g, ',')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* Parte cada párrafo en oraciones. Cada fragmento lleva la pausa que va después.
   * parts puede tener strings o { text, heading: true } para títulos. */
  function chunk(parts) {
    var out = [];
    (parts || []).forEach(function (part) {
      var heading = typeof part === 'object' && part && part.heading;
      var raw = typeof part === 'object' && part ? part.text : part;
      var clean = stripForSpeech(raw || '');
      if (!clean) return;
      var sentences = clean.match(/[^.!?…]+(?:[.!?…]+|$)/g) || [clean];
      var pieces = [];
      sentences.forEach(function (s) {
        s = s.trim().replace(/^[,;:]\s*/, '');
        if (!s) return;
        // Une oraciones muy cortas («¡Ahora!») con la anterior para que no suene entrecortado.
        if (pieces.length && (s.length < 18 || pieces[pieces.length - 1].length < 18) && (pieces[pieces.length - 1] + ' ' + s).length < 160) {
          pieces[pieces.length - 1] += ' ' + s;
        } else {
          pieces.push(s);
        }
      });
      // Oraciones larguísimas: cortar en comas para no superar el límite de algunos navegadores.
      var final = [];
      pieces.forEach(function (p) {
        while (p.length > 220) {
          var cut = p.lastIndexOf(',', 200);
          if (cut < 60) cut = p.lastIndexOf(' ', 200);
          if (cut < 60) cut = 200;
          final.push(p.slice(0, cut + 1).trim());
          p = p.slice(cut + 1).trim();
        }
        if (p) final.push(p);
      });
      final.forEach(function (text, i) {
        var last = i === final.length - 1;
        out.push({ text: text, pause: heading ? PAUSE.heading : last ? PAUSE.paragraph : PAUSE.sentence });
      });
    });
    return out;
  }

  /* Entonación levemente expresiva según el tipo de oración. */
  function pitchFor(text) {
    if (/[?¿]/.test(text)) return 1.1;
    if (/[!¡]/.test(text)) return 1.08;
    return 1.02;
  }

  function createSpeech(onChange) {
    var synth = root.speechSynthesis;
    var supported = !!synth && typeof root.SpeechSynthesisUtterance === 'function';
    var voice = null;
    var voicesChecked = false;
    var queue = [];
    var index = 0;
    var token = 0;
    var timer = null;
    var status = 'idle'; // idle | playing | paused
    var speed = 'normal';

    function emit() {
      if (onChange) onChange({ status: status, supported: supported, hasSpanish: !!voice, natural: isNaturalVoice(voice), checked: voicesChecked });
    }

    function pickVoice() {
      if (!supported) return null;
      var ranked = rankVoices(synth.getVoices() || []);
      voice = ranked[0] || null;
      return voice;
    }

    if (supported) {
      pickVoice();
      if (voice) voicesChecked = true;
      var onVoices = function () { pickVoice(); voicesChecked = true; emit(); };
      if (synth.addEventListener) synth.addEventListener('voiceschanged', onVoices);
      else synth.onvoiceschanged = onVoices;
      // Algunos navegadores nunca avisan: después de un rato damos por terminada la búsqueda.
      setTimeout(onVoices, 1500);
    } else {
      voicesChecked = true;
    }

    function rate() { return BASE_RATE * (SPEEDS[speed] || SPEEDS.normal).factor; }

    function speakFrom(i) {
      var my = ++token;
      clearTimeout(timer);
      if (i >= queue.length) { status = 'idle'; index = 0; emit(); return; }
      index = i;
      var item = queue[i];
      var u = new root.SpeechSynthesisUtterance(item.text);
      u.lang = voice ? voice.lang : 'es-ES';
      if (voice) u.voice = voice;
      u.rate = rate();
      u.pitch = pitchFor(item.text);
      var next = function () {
        if (my !== token || status !== 'playing') return;
        timer = setTimeout(function () { if (my === token && status === 'playing') speakFrom(i + 1); }, item.pause);
      };
      u.onend = next;
      u.onerror = next;
      synth.speak(u);
    }

    function halt() {
      token++;
      clearTimeout(timer);
      if (supported) synth.cancel();
    }

    return {
      get supported() { return supported; },
      get hasSpanish() { return !!voice; },
      get natural() { return isNaturalVoice(voice); },
      get voiceName() { return voice ? voice.name : null; },
      get status() { return status; },
      get speed() { return speed; },
      setSpeed: function (s) {
        if (!SPEEDS[s] || s === speed) return;
        speed = s;
        // Si está hablando, sigue desde la misma oración con la nueva velocidad.
        if (status === 'playing') { halt(); speakFrom(index); }
      },
      play: function (parts) {
        if (!supported || !voice) return false;
        halt();
        queue = chunk(parts);
        status = 'playing';
        emit();
        speakFrom(0);
        return true;
      },
      pause: function () {
        if (status !== 'playing') return;
        status = 'paused';
        halt();
        emit();
      },
      resume: function () {
        if (status !== 'paused') return;
        status = 'playing';
        emit();
        speakFrom(index);
      },
      stop: function () {
        halt();
        status = 'idle';
        index = 0;
        emit();
      }
    };
  }

  var api = {
    createSpeech: createSpeech, chunk: chunk, stripForSpeech: stripForSpeech,
    rankVoices: rankVoices, voiceScore: voiceScore, isNaturalVoice: isNaturalVoice, pitchFor: pitchFor,
    SPEEDS: SPEEDS, BASE_RATE: BASE_RATE, PAUSE: PAUSE
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BrunoSpeech = api;
})(typeof self !== 'undefined' ? self : this);
