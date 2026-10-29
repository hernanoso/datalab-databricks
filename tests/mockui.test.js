const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

require('../lib/mockui.js');
const root = path.join(__dirname, '..');
for (const lang of ['es', 'en']) {
  fs.readdirSync(path.join(root, 'data', 'deep', lang)).filter((f) => f.endsWith('.js')).forEach((f) => require(path.join(root, 'data', 'deep', lang, f)));
}
const { mockui, deep } = globalThis.DataLab;
const label = (value, lang) => (typeof value === 'string' ? value : value && value[lang]);

test('every mock screen is titled in both languages and has unique, labeled targets', () => {
  const screens = Object.entries(mockui.screens);
  assert.ok(screens.length >= 4, 'home, New menu, Catalog and notebook screens');
  for (const [id, screen] of screens) {
    assert.ok(screen.title.es && screen.title.en, `${id} title`);
    assert.ok(screen.regions.length >= 1, `${id} regions`);
    const targets = screen.regions.flatMap((region) => region.targets);
    assert.equal(new Set(targets.map((t) => t.id)).size, targets.length, `${id} duplicate target ids`);
    for (const target of targets) for (const lang of ['es', 'en']) assert.ok(label(target.label, lang), `${id}.${target.id} label (${lang})`);
    for (const region of screen.regions) assert.ok(['sidebar', 'menu', 'tree', 'toolbar', 'main'].includes(region.kind), `${id} region kind ${region.kind}`);
  }
});

test('mockui.target finds targets and reports unknown ones', () => {
  assert.equal(mockui.target('home', 'catalog').label, 'Catalog');
  assert.equal(mockui.target('home', 'nope'), null);
  assert.equal(mockui.target('nope', 'catalog'), null);
});

for (const lang of ['es', 'en']) {
  for (const [id, d] of Object.entries(deep[lang] || {})) {
    test(`${lang}/${id} hotspot questions point at existing targets`, () => {
      const hotspots = d.certification.questions.filter((q) => q.type === 'hotspot');
      assert.ok(hotspots.length >= 4, 'at least four "where do you click?" questions');
      for (const q of hotspots) {
        assert.ok(!q.options, `${q.question}: hotspots have no options`);
        assert.ok(mockui.target(q.screen, q.answer), `${q.question}: ${q.screen}.${q.answer} does not exist`);
        assert.ok(q.explanation.length > 30 && q.domain, q.question);
      }
    });

    test(`${lang}/${id} lab screens highlight existing targets`, () => {
      const shown = d.lab.steps.filter((step) => step.screen);
      assert.ok(shown.length >= 4, 'at least four lab steps show the interface');
      for (const step of shown) {
        assert.ok(step.screen.highlight.length >= 1, step.title);
        step.screen.highlight.forEach((target) => assert.ok(mockui.target(step.screen.id, target), `${step.title}: ${step.screen.id}.${target}`));
      }
    });
  }
}
