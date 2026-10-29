const test = require('node:test');
const assert = require('node:assert/strict');

require('../data/tracks.js');
require('../data/sessions.es.js');
require('../data/sessions.en.js');
const { es, en } = globalThis.DataLab.content;

const LIST_FIELDS = ['objectives', 'review', 'concepts', 'quiz', 'classQuestions', 'glossary', 'references'];

test('English content has the same 16 sessions as Spanish', () => {
  assert.equal(en.length, 16);
  assert.deepEqual(en.map((s) => [s.id, s.number, s.track]), es.map((s) => [s.id, s.number, s.track]));
});

for (const [i, s] of en.entries()) {
  const base = es[i];
  test(`English session ${s.number} mirrors the Spanish structure`, () => {
    for (const field of LIST_FIELDS) assert.equal(s[field].length, base[field].length, field);
    assert.deepEqual(s.quiz.map((q) => [q.options.length, q.answer]), base.quiz.map((q) => [q.options.length, q.answer]));
    assert.deepEqual(s.references.map((r) => r.url), base.references.map((r) => r.url));
    assert.equal(s.example.language, base.example.language);
    assert.equal(s.exercise.solution.language, base.exercise.solution.language);
    assert.equal(Boolean(s.brochureNote), Boolean(base.brochureNote));
    assert.equal(s.minutes, base.minutes);
  });

  test(`English session ${s.number} is complete and translated`, () => {
    for (const field of ['title', 'summary', 'whyItMatters']) assert.ok(s[field] && s[field] !== base[field] || field === 'title', field);
    assert.ok(s.summary.length > 40 && s.whyItMatters.length > 40);
    s.concepts.forEach((c) => assert.ok(c.title && c.body.length > 60, c.title));
    s.quiz.forEach((q) => {
      assert.equal(new Set(q.options).size, q.options.length, q.question);
      assert.ok(q.question && q.explanation.length > 20, q.question);
    });
    assert.ok(s.example.code.trim() && s.example.explanation && s.exercise.prompt && s.exercise.hint && s.exercise.solution.code);
    assert.doesNotMatch(s.summary + s.whyItMatters + s.concepts.map((c) => c.body).join(' '), /\b(los|las|para|cuando|también)\b/i, 'Spanish words left in English prose');
  });
}
