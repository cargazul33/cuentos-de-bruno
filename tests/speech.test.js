'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const Speech = require('../js/speech.js');

const V = (name, lang, voiceURI) => ({ name, lang, voiceURI: voiceURI || name });

test('elige primero las voces naturales/neurales en español', () => {
  const voices = [
    V('Microsoft Sabina - Spanish (Mexico)', 'es-MX'),
    V('English US', 'en-US'),
    V('eSpeak Spanish', 'es'),
    V('Google español de Estados Unidos', 'es-US'),
    V('Microsoft Dalia Online (Natural) - Spanish (Mexico)', 'es-MX'),
    V('Mónica', 'es-ES')
  ];
  const ranked = Speech.rankVoices(voices).map((v) => v.name);
  assert.equal(ranked[0], 'Microsoft Dalia Online (Natural) - Spanish (Mexico)');
  assert.equal(ranked[1], 'Google español de Estados Unidos');
  assert.ok(!ranked.includes('English US'), 'solo voces en español');
  assert.equal(ranked[ranked.length - 1], 'eSpeak Spanish', 'las voces robóticas al final');
});

test('voces mejoradas de Apple y regiones: es-419/es-MX antes que es-ES a igual calidad', () => {
  const ranked = Speech.rankVoices([
    V('Mónica (Enhanced)', 'es-ES', 'com.apple.voice.enhanced.es-ES.Monica'),
    V('Paulina (Enhanced)', 'es-MX', 'com.apple.voice.enhanced.es-MX.Paulina'),
    V('Paulina', 'es-MX', 'com.apple.voice.compact.es-MX.Paulina')
  ]).map((v) => v.voiceURI);
  assert.deepEqual(ranked, ['com.apple.voice.enhanced.es-MX.Paulina', 'com.apple.voice.enhanced.es-ES.Monica', 'com.apple.voice.compact.es-MX.Paulina']);
  assert.ok(Speech.isNaturalVoice(V('Google español', 'es-ES')));
  assert.ok(!Speech.isNaturalVoice(V('Paulina', 'es-MX', 'com.apple.voice.compact.es-MX.Paulina')));
  assert.ok(Speech.rankVoices([V('Spanish', 'es_ES')]).length === 1, 'acepta es_ES con guion bajo (Android)');
});

test('parte el texto en oraciones con pausas de narrador', () => {
  const chunks = Speech.chunk([
    { text: 'Capítulo 1. El llamado de las perlas.', heading: true },
    'Bruno miró el portal. Era enorme y brillaba. —¡Vamos! —gritó Amy.',
    'Perlita sonrió.'
  ]);
  assert.equal(chunks[0].pause, Speech.PAUSE.heading);
  const texts = chunks.map((c) => c.text);
  assert.ok(texts.includes('Bruno miró el portal.'));
  assert.ok(texts.some((t) => /Amy/.test(t)));
  // Fin de párrafo = pausa más larga que entre oraciones.
  const amy = chunks.find((c) => /Amy/.test(c.text));
  assert.equal(amy.pause, Speech.PAUSE.paragraph);
  assert.equal(chunks.find((c) => c.text === 'Bruno miró el portal.').pause, Speech.PAUSE.sentence);
  assert.ok(Speech.PAUSE.sentence < Speech.PAUSE.paragraph && Speech.PAUSE.paragraph < Speech.PAUSE.heading);
});

test('no lee emojis ni rayas de diálogo y corta oraciones larguísimas', () => {
  assert.equal(Speech.stripForSpeech('🦁 —Hola —dijo Bruno—. ¿Vamos?'), 'Hola, dijo Bruno. ¿Vamos?');
  const long = 'Bruno corrió, ' + 'saltó una piedra, '.repeat(30) + 'y llegó.';
  const chunks = Speech.chunk([long]);
  assert.ok(chunks.length > 1);
  chunks.forEach((c) => assert.ok(c.text.length <= 221, c.text.length));
});

test('ritmo de cuento: velocidad apenas más lenta y entonación expresiva', () => {
  assert.ok(Speech.BASE_RATE >= 0.92 && Speech.BASE_RATE <= 0.95);
  assert.ok(Speech.SPEEDS.lenta.factor < 1 && Speech.SPEEDS.rapida.factor > 1 && Speech.SPEEDS.normal.factor === 1);
  assert.ok(Speech.pitchFor('¿Qué hacés?') > Speech.pitchFor('Bruno caminó.'));
  assert.ok(Speech.pitchFor('¡Ahora!') > Speech.pitchFor('Bruno caminó.'));
});

test('el ajuste de velocidad se guarda', () => {
  const Store = require('../js/storage.js');
  const backend = Store.memoryBackend();
  const st = Store.createStore(backend);
  assert.equal(st.getSettings().voiceSpeed, 'normal');
  st.setSetting('voiceSpeed', 'lenta');
  assert.equal(Store.createStore(backend).getSettings().voiceSpeed, 'lenta');
  backend.setItem(Store.KEY, JSON.stringify({ settings: { voiceSpeed: 'turbo' } }));
  assert.equal(Store.createStore(backend).getSettings().voiceSpeed, 'normal');
});
