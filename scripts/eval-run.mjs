// Pure helpers for turning Groundwork eval output into the walkthrough's run data.
// Kept free of process and file access so tests can feed them malformed input.

export const suites = [
  ['gate', 'The gate', 'What the gate must refuse'],
  ['repair', 'Repair loop', 'Scoping and termination'],
  ['audit', 'Audit trail', 'The record survives'],
  ['corpus', 'Retrieval corpus', 'Chunk identity and filters'],
  ['scenarios', 'Scenarios', 'Whole founder profiles, end to end'],
];

export const categories = [
  ['baseline', 'The known-good kit passes', 'Without a passing baseline, every refusal below could be a gate that refuses everything.'],
  ['advice', 'Gives advice or promises to act', 'Groundwork routes and cites. A confident recommendation is unlicensed advice, and filing is a capability it does not have.'],
  ['evidence', 'Claims without evidence', 'A citation proves a page was consulted, not that it says what the claim says.'],
  ['scope', 'Answers outside its scope', 'A founder it cannot serve gets a referral, not a kit. Another state’s rule must never answer a Texas question.'],
  ['structure', 'Steps in an order that fails', 'An EIN application filed before the entity exists fails at the IRS. Order is not cosmetic.'],
  ['certainty', 'Invents certainty', 'An unknown stays unknown. A guessed deadline is worse than no deadline.'],
  ['repair', 'Repair that spreads or never stops', 'Fix only what failed, stop when it passes, and escalate rather than return a bad kit.'],
  ['record', 'Loses the record', 'Months later the question is what the system saw on the day it answered.'],
  ['drift', 'Rests on stale or shifted sources', 'Agencies edit their pages. The specific line a claim rests on is tracked, not the page.'],
];

// First match wins. Repair and audit suites are categorized whole; the rest by check name.
const rules = [
  ['baseline', /^golden kit clears|^every claim kind/],
  ['advice', /advisory language|promising to file/],
  ['scope', /scope|escalated, not answered|jurisdiction|other state/],
  ['evidence', /cited|evidence|unfetched|top hit|reaches the IRS/],
  ['structure', /cycle|does not follow|kit contains|required role|tax inventory|presupposing/],
  ['certainty', /confidence|knowable|deadline|ready|resolves|2553|tax year|dates|names the fact/],
  ['drift', /key|retained|deduped|effective_date|as_of|stale/],
];

export function categorize(suite, name) {
  if (suite === 'repair') return 'repair';
  if (suite === 'audit') return 'record';
  const match = rules.find(([, pattern]) => pattern.test(name));
  if (!match) throw new Error(`Uncategorized check in ${suite}: “${name}”. Add a rule in scripts/eval-run.mjs.`);
  return match[0];
}

// Each suite prints `  pass  <name>` or `  FAIL  <name>  [detail]`, then `  n/m passed`.
export function parseSuite(suite, output) {
  const checks = [];
  for (const line of output.split('\n')) {
    const match = line.match(/^\s{2}(pass|FAIL)\s{2}(.+?)(?:\s{2}\[(.*)\])?\s*$/);
    if (match) checks.push({ suite, name: match[2], passed: match[1] === 'pass', detail: match[3] ?? null, category: categorize(suite, match[2]) });
  }
  const summary = output.match(/^\s*(\d+)\/(\d+) passed\s*$/m);
  if (!summary) throw new Error(`No “n/m passed” summary in ${suite} output; the run log is incomplete.`);
  const [passed, total] = [Number(summary[1]), Number(summary[2])];
  if (total !== checks.length) throw new Error(`${suite} reports ${total} checks but ${checks.length} were parsed.`);
  if (passed !== checks.filter((check) => check.passed).length) throw new Error(`${suite} pass count does not match its checks.`);
  return checks;
}
