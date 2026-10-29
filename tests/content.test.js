const test = require('node:test');
const assert = require('node:assert/strict');

require('../data/tracks.js');
require('../data/sessions.es.js');
const sessions = globalThis.DataLab.content.es;

const OFFICIAL_HOSTS = ['docs.databricks.com', 'learn.microsoft.com', 'spark.apache.org', 'docs.delta.io', 'www.databricks.com'];

test('the course has exactly 16 sessions numbered 1 to 16', () => {
  assert.equal(sessions.length, 16);
  assert.deepEqual(sessions.map((s) => s.number), Array.from({ length: 16 }, (_, i) => i + 1));
  assert.equal(new Set(sessions.map((s) => s.id)).size, 16);
});

test('session titles follow the brochure syllabus order', () => {
  const expected = [
    'Conceptos Básicos de Cloud y Databricks',
    'Procesamiento con Spark SQL',
    'Procesamiento con PySpark',
    'ETL con Spark SQL y PySpark',
    'Optimizaciones en Delta Lake con PySpark',
    'Incremental Data Processing',
    'Workflows en Azure Databricks',
    'Dataflows y pipelines con Data Factory',
    'Delta Live Tables (DLT)',
    'Gobernanza con Unity Catalog',
    'Seguridad y administración de Databricks',
    'Real time streaming con Event Hubs',
    'Dashboards con Databricks y Power BI',
    'CI/CD con Databricks',
    'IA Generativa con Databricks',
    'Desarrollo de Agentes de IA',
  ];
  assert.deepEqual(sessions.map((s) => s.title), expected);
});

test('every session belongs to a colored thematic track', () => {
  const { tracks } = globalThis.DataLab;
  for (const s of sessions) {
    const track = tracks[s.track];
    assert.ok(track, `session ${s.number} track ${s.track}`);
    assert.match(track.color, /^#[0-9a-f]{6}$/);
    assert.match(track.tint, /^#[0-9a-f]{6}$/);
    assert.ok(track.label.es && track.label.en);
  }
  assert.ok(new Set(sessions.map((s) => s.track)).size >= 6, 'colors should vary across the course');
});

for (const s of sessions) {
  test(`session ${s.number} has complete study material`, () => {
    for (const field of ['summary', 'whyItMatters']) {
      assert.equal(typeof s[field], 'string', field);
      assert.ok(s[field].length > 40, `${field} is too short`);
    }
    assert.ok(s.objectives.length >= 3, 'objectives');
    assert.ok(s.review.length >= 2, 'review');
    assert.ok(s.concepts.length >= 3, 'concepts');
    s.concepts.forEach((c) => assert.ok(c.title && c.body.length > 60, `concept ${c.title}`));
    assert.ok(s.example.code.trim().length > 0 && s.example.explanation, 'example');
    assert.ok(s.exercise.prompt && s.exercise.hint && s.exercise.solution.code, 'exercise');
    assert.ok(s.classQuestions.length >= 2, 'class questions');
    assert.ok(s.glossary.length >= 3, 'glossary');
  });

  test(`session ${s.number} quiz is answerable and explained`, () => {
    assert.ok(s.quiz.length >= 4, 'at least four questions');
    for (const q of s.quiz) {
      assert.ok(q.options.length >= 3, q.question);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, q.question);
      assert.equal(new Set(q.options).size, q.options.length, `duplicate options: ${q.question}`);
      assert.ok(q.explanation.length > 20, q.question);
    }
  });

  test(`session ${s.number} references point to official documentation`, () => {
    assert.ok(s.references.length >= 1);
    for (const r of s.references) {
      const url = new URL(r.url);
      assert.equal(url.protocol, 'https:');
      assert.ok(OFFICIAL_HOSTS.includes(url.host), r.url);
    }
  });
}
