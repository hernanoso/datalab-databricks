const { test } = require('node:test');
const assert = require('node:assert/strict');
require('../lib/i18n.js');
const { strings, t, resolveLanguage, LANGUAGE_KEY } = globalThis.DataLab.i18n;

test('locales have identical, nonempty key sets and neutral Spanish', () => {
  assert.deepEqual(Object.keys(strings.es).sort(), Object.keys(strings.en).sort());
  for (const locale of Object.values(strings)) {
    for (const value of Object.values(locale)) assert.ok(typeof value === 'string' && value.trim());
  }
  const voseo = /(?<!\p{L})(entendé|llegá|podés|tenés|hacé|marcá|elegí|revisá|copiá|vos)(?!\p{L})/iu;
  for (const value of Object.values(strings.es)) assert.doesNotMatch(value, voseo);
  assert.equal(LANGUAGE_KEY, 'datalab.language');
});

test('the course opens in Spanish unless the student chose English', () => {
  for (const [stored, expected] of [
    ['es', 'es'], ['en', 'en'], [null, 'es'], [undefined, 'es'], ['fr', 'es'], ['EN', 'es'], ['', 'es'],
  ]) assert.equal(resolveLanguage(stored), expected);
  // An English-configured browser must not override the course language.
  assert.equal(resolveLanguage(null, 'en-US'), 'es');
  assert.equal(resolveLanguage('en', 'es-CO'), 'en');
});

test('translations interpolate parameters and fall back to the missing key', () => {
  assert.equal(t('es', 'sessionNumber', { number: 3 }), 'Sesión 3');
  assert.equal(t('en', 'sessionNumber', { number: 3 }), 'Session 3');
  assert.equal(t('es', 'missing.key'), 'missing.key');
  assert.equal(t('en', 'sessionNumber'), 'Session {number}');
});
