const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

require('../data/tracks.js');
require('../data/sessions.es.js');
require('../data/sessions.en.js');

const root = path.join(__dirname, '..');
const files = (lang) => fs.readdirSync(path.join(root, 'data', 'deep', lang)).filter((f) => f.endsWith('.js')).sort();
for (const lang of ['es', 'en']) files(lang).forEach((f) => require(path.join(root, 'data', 'deep', lang, f)));
const deep = globalThis.DataLab.deep || {};
const { es, en } = globalThis.DataLab.content;

const OFFICIAL_HOSTS = ['docs.databricks.com', 'learn.microsoft.com', 'spark.apache.org', 'docs.delta.io', 'www.databricks.com', 'login.databricks.com'];
const official = (url) => {
  const u = new URL(url);
  return u.protocol === 'https:' && OFFICIAL_HOSTS.includes(u.host);
};

test('every deep file is loaded by index.html and named after its session', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const lang of ['es', 'en']) {
    for (const f of files(lang)) {
      assert.ok(html.includes(`src="data/deep/${lang}/${f}"`), `index.html misses data/deep/${lang}/${f}`);
      const id = f.replace('.js', '');
      assert.ok(deep[lang] && deep[lang][id], `${lang}/${f} must define DataLab.deep.${lang}.${id}`);
    }
  }
  // Deep scripts must load after the session data and before the app.
  const order = ['data/sessions.en.js', 'data/deep/', 'app.js'].map((s) => html.indexOf(s));
  if (files('es').length) assert.ok(order[0] < order[1] && order[1] < order[2], 'deep scripts are misplaced in index.html');
});

test('Spanish and English cover the same deep sessions', () => {
  assert.deepEqual(files('en'), files('es'));
  assert.ok(files('es').length >= 1, 'at least the session 1 sample exists');
});

for (const id of Object.keys(deep.es || {})) {
  const d = deep.es[id];
  const session = es.find((s) => s.id === id);

  test(`${id} deep dive is substantial and sourced`, () => {
    assert.ok(session, `${id} matches a session`);
    assert.ok(d.deepDive.length >= 6, 'at least six deep-dive topics');
    for (const item of d.deepDive) {
      assert.ok(item.title, 'title');
      assert.ok(item.body.length >= 1 && item.body.every((p) => p.length > 80), `${item.title}: paragraphs`);
      assert.ok(item.source && item.source.label && official(item.source.url), `${item.title}: official source`);
    }
  });

  test(`${id} diagram and comparison are well formed`, () => {
    assert.ok(d.diagram.title && d.diagram.caption.length > 40);
    assert.ok(d.diagram.layers.length >= 3, 'three or more layers');
    d.diagram.layers.forEach((layer) => assert.ok(layer.label && layer.nodes.length >= 2 && layer.nodes.every(Boolean), layer.label));
    const c = d.comparison;
    assert.ok(c.title && c.headers.length >= 3 && c.rows.length >= 4);
    c.rows.forEach((row) => assert.equal(row.length, c.headers.length, `row ${row[0]}`));
    assert.ok(c.sources.length >= 1 && c.sources.every((s) => official(s.url)));
  });

  test(`${id} guided lab is step by step`, () => {
    const lab = d.lab;
    assert.ok(lab.title && lab.goal && lab.minutes > 0);
    assert.ok(lab.requirements.length >= 1 && lab.steps.length >= 6);
    lab.steps.forEach((step, i) => {
      assert.ok(step.title && step.body.length > 40 && step.check, `step ${i + 1}`);
      if (step.code) assert.ok(step.code.language && step.code.code.trim(), `step ${i + 1} code`);
    });
    assert.ok(lab.wrapUp.length > 40);
    assert.ok(lab.sources.length >= 1 && lab.sources.every((s) => official(s.url)));
  });

  test(`${id} certification practice has about ten exam-style questions`, () => {
    const cert = d.certification;
    assert.ok(cert.exams.length >= 1 && cert.exams.every((e) => e.name && official(e.url) && e.domains.length >= 1));
    assert.ok(cert.questions.length >= 10, 'ten questions or more');
    cert.questions.forEach((q) => {
      assert.ok(q.question && q.domain, q.question);
      assert.ok(q.options.length >= 4, `${q.question}: four options`);
      assert.equal(new Set(q.options).size, q.options.length, `${q.question}: duplicate options`);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, q.question);
      assert.ok(q.explanation.length > 30, q.question);
    });
    // Answers should not always sit in the same position.
    assert.ok(new Set(cert.questions.map((q) => q.answer)).size >= 3, 'vary the position of correct answers');
  });

  test(`${id} English deep content mirrors Spanish`, () => {
    const e = (deep.en || {})[id];
    assert.ok(e, `${id} has English deep content`);
    assert.ok(en.find((s) => s.id === id));
    assert.equal(e.deepDive.length, d.deepDive.length);
    assert.deepEqual(e.deepDive.map((x) => [x.body.length, x.source.url]), d.deepDive.map((x) => [x.body.length, x.source.url]));
    assert.deepEqual(e.diagram.layers.map((l) => l.nodes.length), d.diagram.layers.map((l) => l.nodes.length));
    assert.deepEqual([e.comparison.headers.length, e.comparison.rows.length], [d.comparison.headers.length, d.comparison.rows.length]);
    assert.deepEqual(e.comparison.sources.map((s) => s.url), d.comparison.sources.map((s) => s.url));
    assert.equal(e.lab.minutes, d.lab.minutes);
    assert.equal(e.lab.requirements.length, d.lab.requirements.length);
    assert.deepEqual(e.lab.steps.map((s) => s.code ? s.code.language : null), d.lab.steps.map((s) => s.code ? s.code.language : null));
    assert.deepEqual(e.lab.sources.map((s) => s.url), d.lab.sources.map((s) => s.url));
    assert.deepEqual(e.certification.exams.map((x) => [x.url, x.domains.length]), d.certification.exams.map((x) => [x.url, x.domains.length]));
    assert.deepEqual(e.certification.questions.map((q) => [q.options.length, q.answer]), d.certification.questions.map((q) => [q.options.length, q.answer]));
    const prose = e.deepDive.flatMap((x) => x.body).join(' ') + e.lab.goal + e.lab.wrapUp;
    assert.doesNotMatch(prose, /\b(los|las|para|cuando|también|puedes)\b/i, 'Spanish words left in English prose');
  });

  test(`${id} Spanish deep content uses neutral Spanish`, () => {
    const text = JSON.stringify(d);
    assert.doesNotMatch(text, /\b(podés|tenés|querés|sabés|hacé|mirá|elegí|entendé|creá|abrí|usá)\b/i);
  });
}
