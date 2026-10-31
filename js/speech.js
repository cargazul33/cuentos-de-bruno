/*
 * Los Multiversos de Bruno — lectura en voz alta con la voz del navegador.
 * Lee en fragmentos cortos (algunos navegadores cortan las frases largas).
 * Pausar = detener y recordar el fragmento; seguir = continuar desde ahí
 * (más confiable que speechSynthesis.pause() en Chrome y Android).
 */
(function (root) {
  'use strict';

  var PREFERRED = ['es-AR', 'es-419', 'es-US', 'es-MX', 'es-CL', 'es-CO', 'es-UY', 'es-ES'];

  function stripForSpeech(text) {
    return text
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{1F1E6}-\u{1F1FF}]/gu, '')
      .replace(/—/g, ', ')
      .replace(/[«»]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function chunk(parts) {
    var out = [];
    parts.forEach(function (p) {
      var clean = stripForSpeech(p);
      if (!clean) return;
      var sentences = clean.match(/[^.!?…]+[.!?…]+["»)]?\s*|[^.!?…]+$/g) || [clean];
      var buf = '';
      sentences.forEach(function (s) {
        if ((buf + s).length > 200 && buf) { out.push(buf.trim()); buf = ''; }
        buf += s;
      });
      if (buf.trim()) out.push(buf.trim());
    });
    return out;
  }

  function createSpeech(onChange) {
    var synth = root.speechSynthesis;
    var supported = !!synth && typeof root.SpeechSynthesisUtterance === 'function';
    var voice = null;
    var voicesChecked = false;
    var queue = [];
    var index = 0;
    var token = 0;
    var status = 'idle'; // idle | playing | paused
    var rate = 1;

    function emit() { if (onChange) onChange({ status: status, supported: supported, hasSpanish: !!voice, checked: voicesChecked }); }

    function pickVoice() {
      if (!supported) return null;
      var voices = synth.getVoices() || [];
      var es = voices.filter(function (v) { return /^es([-_]|$)/i.test(v.lang || ''); });
      if (!es.length) { voice = null; return null; }
      var norm = function (l) { return (l || '').replace('_', '-'); };
      var best = null;
      for (var i = 0; i < PREFERRED.length && !best; i++) {
        for (var j = 0; j < es.length; j++) {
          if (norm(es[j].lang).toLowerCase() === PREFERRED[i].toLowerCase()) { best = es[j]; break; }
        }
      }
      voice = best || es[0];
      return voice;
    }

    if (supported) {
      pickVoice();
      if (voice) voicesChecked = true;
      if ('onvoiceschanged' in synth) {
        synth.addEventListener ? synth.addEventListener('voiceschanged', function () { pickVoice(); voicesChecked = true; emit(); })
          : (synth.onvoiceschanged = function () { pickVoice(); voicesChecked = true; emit(); });
      }
      // Algunos navegadores nunca avisan: después de un rato damos por terminada la búsqueda.
      setTimeout(function () { pickVoice(); voicesChecked = true; emit(); }, 1500);
    } else {
      voicesChecked = true;
    }

    function speakFrom(i) {
      var my = ++token;
      if (i >= queue.length) { status = 'idle'; index = 0; emit(); return; }
      index = i;
      var u = new root.SpeechSynthesisUtterance(queue[i]);
      u.lang = voice ? voice.lang : 'es-ES';
      if (voice) u.voice = voice;
      u.rate = rate;
      u.pitch = 1.05;
      u.onend = function () { if (my === token && status === 'playing') speakFrom(i + 1); };
      u.onerror = function () { if (my === token && status === 'playing') speakFrom(i + 1); };
      synth.speak(u);
    }

    return {
      get supported() { return supported; },
      get hasSpanish() { return !!voice; },
      get status() { return status; },
      setRate: function (r) { rate = r; },
      play: function (parts) {
        if (!supported || !voice) return false;
        token++;
        synth.cancel();
        queue = chunk(parts);
        status = 'playing';
        emit();
        speakFrom(0);
        return true;
      },
      pause: function () {
        if (status !== 'playing') return;
        status = 'paused';
        token++;
        synth.cancel();
        emit();
      },
      resume: function () {
        if (status !== 'paused') return;
        status = 'playing';
        emit();
        speakFrom(index);
      },
      stop: function () {
        token++;
        status = 'idle';
        index = 0;
        if (supported) synth.cancel();
        emit();
      }
    };
  }

  var api = { createSpeech: createSpeech, chunk: chunk, stripForSpeech: stripForSpeech };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BrunoSpeech = api;
})(typeof self !== 'undefined' ? self : this);
