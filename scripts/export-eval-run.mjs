// Runs every Groundwork eval suite and writes web/evaluation/run.json for the walkthrough.
// Run deliberately (npm run export:evals) and commit the result; the site build only copies it.
import { execFileSync, spawnSync } from 'node:child_process';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { root } from './build-site.mjs';
import { suites, categories, parseSuite } from './eval-run.mjs';

const project = join(root, 'projects/groundwork');
const python = process.env.PYTHON ?? 'python3';
const git = (...args) => { try { return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim(); } catch { return null; } };
// Read before running: the audit suite appends to runs/, which says nothing about the code under test.
const uncommittedChanges = Boolean(git('status', '--porcelain', '--', 'projects/groundwork', ':(exclude)projects/groundwork/runs'));
const checks = [];
for (const [suite] of suites) {
  const result = spawnSync(python, ['-m', `evals.test_${suite}`], { cwd: project, encoding: 'utf8' });
  if (result.error) throw result.error;
  checks.push(...parseSuite(suite, result.stdout));
}

const run = {
  ranAt: new Date().toISOString(),
  commit: git('log', '-1', '--format=%h', '--', 'projects/groundwork'),
  uncommittedChanges,
  python: execFileSync(python, ['--version'], { encoding: 'utf8' }).trim(),
  suites: suites.map(([id, title, description]) => ({ id, title, description })),
  categories: categories.map(([id, title, why]) => ({ id, title, why })),
  checks,
};
await mkdir(join(root, 'web/evaluation'), { recursive: true });
await writeFile(join(root, 'web/evaluation/run.json'), `${JSON.stringify(run, null, 1)}\n`);
const failed = checks.filter((check) => !check.passed).length;
console.log(`Exported ${checks.length} checks across ${suites.length} suites; ${failed} failing.`);
