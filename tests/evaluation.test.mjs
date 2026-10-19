import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { categorize, parseSuite } from '../scripts/eval-run.mjs';

test('parses passing and failing checks with their detail', () => {
  const checks = parseSuite('gate', '  pass  blocks a dependency cycle\n  FAIL  blocks advisory language  [nothing raised]\n\n  1/2 passed\n');
  assert.equal(checks.length, 2);
  assert.deepEqual(checks[1], { suite: 'gate', name: 'blocks advisory language', passed: false, detail: 'nothing raised', category: 'advice' });
});

test('a run log without its summary is rejected', () => {
  assert.throws(() => parseSuite('gate', '  pass  blocks a dependency cycle\n'), /summary/);
});

test('a summary that disagrees with the parsed checks is rejected', () => {
  assert.throws(() => parseSuite('gate', '  pass  blocks a dependency cycle\n\n  2/2 passed\n'), /reports 2 checks/);
  assert.throws(() => parseSuite('gate', '  pass  blocks a dependency cycle\n\n  0/1 passed\n'), /pass count/);
});

test('an unknown check name fails loudly instead of landing in a default bucket', () => {
  assert.throws(() => categorize('gate', 'something nobody wrote a rule for'), /Uncategorized/);
  assert.equal(categorize('repair', 'anything at all'), 'repair');
});

test('the committed run covers every suite and every category', async () => {
  const run = JSON.parse(await readFile(new URL('../web/evaluation/run.json', import.meta.url), 'utf8'));
  for (const suite of run.suites) assert.ok(run.checks.some((check) => check.suite === suite.id), suite.id);
  for (const category of run.categories) assert.ok(run.checks.some((check) => check.category === category.id), category.id);
});
