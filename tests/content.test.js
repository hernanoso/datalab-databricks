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

for (const lang of ['es', 'en']) {
  require('../data/sessions.' + lang + '.js');
  const s12 = globalThis.DataLab.content[lang].find(s => s.id === 's12');
  const s13 = globalThis.DataLab.content[lang].find(s => s.id === 's13');
  test(lang + ' B6 streaming uses bounded triggers and qualified recovery/event time', () => {
    assert.match(s12.example.code, /trigger\(availableNow=True\)/);
    assert.match(s12.exercise.solution.code, /trigger\(availableNow=True\)/);
    assert.doesNotMatch(s12.example.code, /processingTime=/);
    assert.match(s12.example.explanation, /opcional|optional/i);
    for (const pattern of [/Azure/, /Standard/, /serverless/, /autenticación|authentication/, /red|network/]) assert.match(s12.concepts[4].body, pattern);
    assert.match(s12.concepts[2].body, /origen.*sink|source.*sink/);
    assert.match(s12.concepts[3].body, /observad|observed/);
    assert.match(s12.exercise.hint, /event_time/);
    assert.match(s12.exercise.solution.code, /from_json/);
    assert.match(s12.exercise.solution.code, /withWatermark\("event_time"/);
    assert.match(s12.quiz[2].explanation, /observad|observed/);
    assert.deepEqual(s12.quiz.map(q => q.answer), [0, 0, 0, 0, 0]);
    assert.equal(s12.quiz[0].options[0], 'Consumer groups');
  });
  test(lang + ' B6 BI distinguishes connector scope, freshness and publishing permissions', () => {
    assert.match(s13.concepts[2].body, /Get data → Databricks → Connect/);
    assert.match(s13.concepts[2].body, /NO VERIFICADA|UNVERIFIED/);
    assert.match(s13.concepts[2].body, /XMLA/);
    assert.match(s13.concepts[3].body, /caché|cach/);
    assert.doesNotMatch(s13.concepts[3].body, /siempre está al día|always up to date/);
    assert.match(s13.concepts[0].body, /Share with data permissions/);
    assert.match(s13.quiz[3].question, /Share with data permissions/);
    assert.match(s13.quiz[1].explanation, /caché|cach/);
    assert.deepEqual(s13.quiz.map(q => q.answer), [0, 0, 0, 0, 0]);
    assert.match(s13.example.code, /samples\.nyctaxi\.trips/);
  });
}

// Free Edition does not guarantee a catalog named "workspace": learners find
// theirs with current_catalog() and replace a placeholder.
test('base sessions never hardcode the workspace catalog', () => {
  require('../data/sessions.en.js');
  for (const lang of ['es', 'en']) {
    const text = JSON.stringify(globalThis.DataLab.content[lang]);
    assert.doesNotMatch(text, /workspace\.default|\/Volumes\/workspace\//, `${lang} hardcodes the workspace catalog`);
  }
});

for (const lang of ['es', 'en']) {
  require('../data/sessions.' + lang + '.js');
  const s10 = globalThis.DataLab.content[lang].find(s => s.id === 's10');
  const s11 = globalThis.DataLab.content[lang].find(s => s.id === 's11');
  test(lang + ' B5 base governance qualifies inheritance, lifecycle and effective access', () => {
    assert.match(s10.concepts[0].body, /catálogo|catalog/);
    assert.match(s10.concepts[0].body, /propiedad no se hereda|ownership is not inherited/);
    assert.match(s10.concepts[0].body, /metastore.*no |metastore.*not /);
    assert.match(s10.concepts[2].body, /recuperación|recovery/);
    assert.match(s10.concepts[2].body, /gobernad|governed/);
    assert.match(s10.concepts[4].body, /compatibles|supported/);
    assert.match(s10.concepts[4].body, /permisos|permissions/);
    assert.match(s10.example.explanation, /no garantiza|does not guarantee/);
    assert.match(s10.exercise.prompt, /opcional|optional/i);
    assert.match(s10.exercise.prompt, /Azure/);
    assert.match(s10.exercise.hint, /Access Connector/);
    assert.deepEqual(s10.quiz.map(q => q.answer), [1, 1, 0, 1, 0]);
  });
  test(lang + ' B5 base administration qualifies identity, policies, audits and masking', () => {
    assert.match(s11.concepts[1].body, /Entra ID/);
    assert.match(s11.concepts[1].body, /automática|Automatic/);
    assert.match(s11.concepts[1].body, /SCIM.*alternativ/);
    assert.match(s11.concepts[2].body, /Premium/);
    assert.match(s11.concepts[2].body, /clásico|classic/);
    assert.match(s11.concepts[2].body, /retroactiv/);
    assert.match(s11.concepts[2].body, /no garantiza|not guarantee/);
    for (const pattern of [/365/, /región|regional/, /latencia|latency/, /permisos|permissions/, /Free Edition/]) assert.match(s11.concepts[4].body, pattern);
    assert.match(s11.example.explanation, /opcional|optional/i);
    assert.match(s11.example.explanation, /CREATE FUNCTION/);
    assert.match(s11.example.explanation, /EXECUTE/);
    assert.match(s11.exercise.prompt, /s11_audit_demo/);
    assert.match(s11.quiz[4].explanation, /instantánea|instant/);
    assert.deepEqual(s11.quiz.map(q => q.answer), [0, 1, 0, 0, 0]);
  });
}
