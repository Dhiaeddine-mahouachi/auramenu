import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// config.apiBase is a relative path ("/api/auramenu"). new URL() with a relative path and no base
// throws, which made every live menu show "not published" (broken 2 Oct - 26 Nov 2026).
test('live menu builds its API URL with a base so relative apiBase works', async () => {
  const source = await readFile(new URL('../menu.js', import.meta.url), 'utf8');
  const calls = source.match(/new URL\(`\$\{config\.apiBase\}[^;]*;/g) || [];
  assert.ok(calls.length > 0, 'menu.js should build the sites endpoint from config.apiBase');
  for (const call of calls) assert.match(call, /,\s*location\.origin\s*\)/, call);
});

test('relative apiBase resolves to the same-origin API', () => {
  const origin = 'https://auramenu.space';
  const apiBase = '/api/auramenu';
  assert.throws(() => new URL(`${apiBase}/sites/moka`));
  assert.equal(new URL(`${apiBase}/sites/moka`, origin).href, 'https://auramenu.space/api/auramenu/sites/moka');
});
