/**
 * The committed Groundwork eval run, written by `npm run export:evals`
 * (scripts/export-eval-run.mjs). Every count on the site is derived from it.
 */
import data from '../../data/evaluation-run.json';

export const run = data;
export const passed = run.checks.filter((check) => check.passed).length;
export const total = run.checks.length;
export const runDate = new Date(run.ranAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
export const suiteTitle: Record<string, string> = Object.fromEntries(run.suites.map((suite) => [suite.id, suite.title]));
export const categoryTitle: Record<string, string> = Object.fromEntries(run.categories.map((category) => [category.id, category.title]));
export const countIn = (category: string) => run.checks.filter((check) => check.category === category).length;

/** Fails the build if a page cites a check the run does not contain. */
export function findCheck(name: string) {
  const check = run.checks.find((item) => item.name === name);
  if (!check) throw new Error(`Check “${name}” is not in src/data/evaluation-run.json. Re-run npm run export:evals or fix the name.`);
  return check;
}
