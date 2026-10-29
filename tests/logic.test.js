const test = require('node:test');
const assert = require('node:assert/strict');

require('../lib/router.js');
require('../lib/quiz.js');
require('../lib/progress.js');
const { router, quiz, progress } = globalThis.DataLab;

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
  };
}

test('router resolves home, sessions and unknown routes', () => {
  assert.deepEqual(router.parse(''), { view: 'home' });
  assert.deepEqual(router.parse('#/'), { view: 'home' });
  assert.deepEqual(router.parse('#/sesion/7'), { view: 'session', number: 7 });
  assert.deepEqual(router.parse('#/sesion/16'), { view: 'session', number: 16 });
  assert.deepEqual(router.parse('#/sesion/0'), { view: 'notfound' });
  assert.deepEqual(router.parse('#/sesion/17'), { view: 'notfound' });
  assert.deepEqual(router.parse('#/sesion/abc'), { view: 'notfound' });
  assert.deepEqual(router.parse('#/otra'), { view: 'notfound' });
  assert.equal(router.sessionHref(3), '#/sesion/3');
});

test('quiz grading counts correct answers and treats unanswered as wrong', () => {
  const questions = [
    { answer: 1, options: ['a', 'b', 'c'] },
    { answer: 0, options: ['a', 'b', 'c'] },
    { answer: 2, options: ['a', 'b', 'c'] },
  ];
  const result = quiz.grade(questions, [1, 2, undefined]);
  assert.equal(result.score, 1);
  assert.equal(result.total, 3);
  assert.equal(result.passed, false);
  assert.deepEqual(result.results.map((r) => r.correct), [true, false, false]);
  assert.deepEqual(result.results.map((r) => r.chosen), [1, 2, null]);
  assert.equal(quiz.grade(questions, [1, 0, 2]).passed, true);
});

test('quiz passes at 70 percent or more', () => {
  const qs = Array.from({ length: 10 }, () => ({ answer: 0, options: ['a', 'b', 'c'] }));
  assert.equal(quiz.grade(qs, [0, 0, 0, 0, 0, 0, 0, 1, 1, 1]).passed, true);
  assert.equal(quiz.grade(qs, [0, 0, 0, 0, 0, 0, 1, 1, 1, 1]).passed, false);
});

test('progress starts empty and survives corrupt storage without overwriting it', () => {
  const storage = memoryStorage({ [progress.STORAGE_KEY]: '{not json' });
  assert.deepEqual(progress.load(storage), { version: 1, sessions: {} });
  assert.equal(storage.data[progress.STORAGE_KEY], '{not json');
  assert.deepEqual(progress.load(memoryStorage()), { version: 1, sessions: {} });
});

test('progress ignores stored data with an unknown shape', () => {
  const storage = memoryStorage({ [progress.STORAGE_KEY]: JSON.stringify({ version: 99, sessions: 'x' }) });
  assert.deepEqual(progress.load(storage), { version: 1, sessions: {} });
});

test('marking a session studied persists and can be undone', () => {
  const storage = memoryStorage();
  let p = progress.load(storage);
  p = progress.setStudied(p, 's03', true);
  progress.save(storage, p);
  assert.equal(progress.load(storage).sessions.s03.studied, true);
  p = progress.setStudied(progress.load(storage), 's03', false);
  assert.equal(p.sessions.s03.studied, false);
});

test('quiz attempts keep the best score and count attempts without mutating input', () => {
  const start = progress.load(memoryStorage());
  const first = progress.recordQuiz(start, 's01', 2, 5);
  const second = progress.recordQuiz(first, 's01', 4, 5);
  const third = progress.recordQuiz(second, 's01', 1, 5);
  assert.deepEqual(start.sessions, {});
  assert.deepEqual(third.sessions.s01.quiz, { best: 4, total: 5, attempts: 3 });
});

test('summary counts studied sessions over the course total', () => {
  let p = progress.load(memoryStorage());
  p = progress.setStudied(p, 's01', true);
  p = progress.setStudied(p, 's02', true);
  p = progress.setStudied(p, 's05', false);
  const ids = Array.from({ length: 16 }, (_, i) => `s${String(i + 1).padStart(2, '0')}`);
  assert.deepEqual(progress.summary(p, ids), { studied: 2, total: 16, percent: 13 });
});

test('saving reports failure instead of throwing when storage is unavailable', () => {
  const broken = { getItem: () => null, setItem: () => { throw new Error('QuotaExceeded'); } };
  assert.equal(progress.save(broken, { version: 1, sessions: {} }), false);
  assert.equal(progress.save(memoryStorage(), { version: 1, sessions: {} }), true);
});
