import test from 'node:test';
import assert from 'node:assert/strict';
import { canAttend, attentionRow, kvCacheBytes, values } from '../web/assets/attention.mjs';
import { readCatalog } from '../scripts/build-site.mjs';

test('causal, bidirectional, and prefix masks preserve their boundaries', () => {
  for (let q = 0; q < 6; q++) for (let k = 0; k < 6; k++) {
    assert.equal(canAttend('causal', q, k), k <= q);
    assert.equal(canAttend('bidirectional', q, k), true);
    assert.equal(canAttend('prefix', q, k), q < 3 ? k < 3 : k <= q);
  }
});

test('masked weights are zero and all rows normalize across query values', () => {
  for (const mode of ['causal', 'bidirectional', 'prefix']) for (let q = 0; q < 6; q++) for (const x of [-2, 0, 1, 2]) {
    const { weights, output } = attentionRow(mode, q, x);
    assert.ok(Math.abs(weights.reduce((a, b) => a + b, 0) - 1) < 1e-12);
    weights.forEach((w, k) => { if (!canAttend(mode, q, k)) assert.equal(w, 0); });
    assert.ok(output.every(Number.isFinite));
  }
});

test('first causal token returns its own value regardless of query', () => {
  for (const x of [-2, 0, 1, 2]) assert.deepEqual(attentionRow('causal', 0, x).output, values[0]);
});

test('a symmetric two-token example matches a hand calculation', () => {
  const { scores, weights, output } = attentionRow('causal', 1, 1);
  assert.equal(scores[0], 1 / Math.sqrt(2));
  assert.equal(scores[1], 1 / Math.sqrt(2));
  assert.deepEqual(weights, [0.5, 0.5, 0, 0, 0, 0]);
  assert.deepEqual(output, [0.5, 1]);
});

test('cache baseline is 0.5 GiB; context, batch, and KV heads scale linearly', () => {
  const baseline = kvCacheBytes(1, 4096, 8);
  assert.equal(baseline, 2 ** 29);
  assert.equal(kvCacheBytes(1, 4096, 2), baseline / 4);
  assert.equal(kvCacheBytes(1, 4096, 1), baseline / 8);
  assert.equal(kvCacheBytes(4, 8192, 8), baseline * 8);
});

test('catalog comes from all 18 chapters and preserves topic IDs without duplicates', async () => {
  const catalog = await readCatalog();
  assert.equal(catalog.length, 18);
  const ids = catalog.flatMap((m) => m.sections.flatMap((s) => s.topics.map((t) => t.id)));
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.includes('02.03.01'));
  assert.deepEqual([...new Set(catalog.map((m) => m.layer))], [1, 2, 3, 4, 5]);
});
