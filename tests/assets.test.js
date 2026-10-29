const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css)(?:\?[^"]*)?)"/g)].map((m) => m[1]);

// GitHub Pages lets browsers reuse files for 10 minutes; a shared version
// query makes every publication fetch index.html's scripts and styles together.
test('every local script and stylesheet carries the same cache-busting version', () => {
  assert.ok(assets.length >= 10, `found ${assets.length} assets`);
  const versions = assets.map((url) => {
    const match = /\?v=([\w.-]+)$/.exec(url);
    assert.ok(match, `${url} has no ?v= version`);
    return match[1];
  });
  assert.equal(new Set(versions).size, 1, `mixed versions: ${[...new Set(versions)].join(', ')}`);
});

test('versioned assets exist on disk', () => {
  for (const url of assets) {
    const file = url.split('?')[0];
    assert.ok(fs.existsSync(path.join(__dirname, '..', file)), `${file} is missing`);
  }
});
