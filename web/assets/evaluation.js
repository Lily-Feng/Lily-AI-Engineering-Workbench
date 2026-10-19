// The Groundwork evaluation walkthrough. Every count and result on the page comes from
// evaluation/run.json, which scripts/export-eval-run.mjs writes from a real run.
const escape = (text) => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const source = 'https://github.com/Lily-Feng/Lily-AI-Engineering-Workbench/blob/main/projects/groundwork/';
const contact = 'https://lily-feng.github.io/about';

// Hand-picked cases, quoted from the eval source. Each must name a check present in the run.
const featured = [
  { check: 'blocks advisory language', title: 'The model answers the question it was asked.',
    input: 'decision brief · consequences\n“For a consultant at this revenue level you should elect S-corp status, which is the best option for most solo owners.”',
    expect: 'The gate refuses the kit with an advisory-language finding.',
    why: 'This is the most likely output of a naive build: confident, plausible, and unlicensed advice. The check reads every field a founder sees, not only this one.', file: 'evals/test_gate.py' },
  { check: 'quoted evidence absent from the retrieved page is blocked', title: 'The model writes its own evidence.',
    input: 'fee · $999,999\nsource · tier-1 .gov page\nquote · “the filing fee is $999,999”',
    expect: 'Blocked: the quote does not appear on the retrieved page.',
    why: 'The citation is well formed, the source is official, and the quote matches the claim. It is still invented. The gate checks the quote against the page that was actually fetched.', file: 'evals/test_gate.py' },
  { check: 'an unknown tax year yields no date, not a guessed one', title: 'A missing fact quietly becomes a default.',
    input: 'profile · unknowns = [tax_year_end]\nForm 2553 election window → ?',
    expect: 'No date. The deadline names the fact it is waiting on, and resolves once that fact is known.',
    why: 'Assuming a calendar year would produce a specific, official-looking, wrong deadline for a tax election.', file: 'evals/test_scenarios.py' },
  { check: 'a loop that cannot converge terminates', title: 'A repair that never succeeds.',
    input: 'task · why\n“You should file this immediately; it is the best option.”\nrepairer · returns the same object every round',
    expect: 'The loop stops within its round budget, escalates, and never returns the kit as passed.',
    why: 'A model that cannot fix something hands back what it was given. The loop has to notice and stop anyway.', file: 'evals/test_repair.py' },
];

const unproven = [
  ['Whether a correct quote is applied correctly', 'Nothing checks that a correctly quoted page is being applied to the right situation. Human review found two errors of exactly this kind; they are shown below.'],
  ['Resistance to hostile sources', 'No filing-mill page or injected instruction text is in the corpus, so nothing shows the system would resist one.'],
  ['Whether the generated kit runs', 'There is no kit compiler yet, so “does the kit run” is unmeasured.'],
  ['Breadth', 'One hand-authored kit, for one state. Other states are tested only negatively: their guidance must not leak into a Texas answer.'],
  ['Model cost and latency', 'The agent loop is not built yet. The repair tests use stand-in generators, so there is no model call to time or price.'],
];

const humanCatches = [
  ['“Texas LLCs owe an annual franchise tax report even in years when no tax is due.”', 'For report years 2024 and later the separate No Tax Due Report was discontinued. An entity at or below the threshold files a Public Information Report or Ownership Report.'],
  ['A missed Form 2553 window “costs a full year.”', 'The IRS documents conditional relief for late elections. The window still matters; the consequence is not automatic.'],
];

const next = [
  ['Poison the corpus on purpose.', 'Add a filing-mill page and a page carrying injected instructions. The kit must neither cite nor obey them.'],
  ['Turn the human catches into cases.', 'Have a practitioner grade how quoted rules are applied, so both errors above become regression tests instead of review notes.'],
  ['Add a second state.', 'A California fixture tests cross-jurisdiction behaviour directly, rather than only by absence.'],
  ['Measure the loop once it exists.', 'Cost, latency, repair rounds, and escalation rate per run, read from the audit trail the suite already protects.'],
];

function template(run) {
  const date = run.ranAt.slice(0, 10);
  const questions = {
    baseline: 'Does a known-good output pass? Keep one, and run it first.',
    advice: 'What must the system never say or promise? Write a case with that phrasing in every user-visible field.',
    evidence: 'Is each factual claim tied to a source, and is the quoted text actually on the page you retrieved?',
    scope: 'Which users or requests should get a referral instead of an answer? Write one case per risk flag.',
    structure: 'Which steps only work in a particular order? Write the broken order as a case.',
    certainty: 'When an input is unknown, does it stay unknown, or become a default?',
    repair: 'When you retry a failure, do you retry only what failed? Does the loop stop and escalate?',
    record: 'Months from now, can you reconstruct what the system saw when it answered?',
    drift: 'When a source changes, can you name the answers that rest on the changed line?',
  };
  return `# Evaluation checklist for an AI system

Adapted from the Groundwork evaluation walkthrough (${run.checks.length} checks, run ${date}).
${location.origin}${location.pathname}?view=evaluation

For each failure mode, write at least one case: the bad output itself, what should happen, and why the case exists.

${run.categories.map((category) => `## ${category.title}

${questions[category.id]}

- [ ] Case:
- [ ] Expected:
- [ ] Why it exists:
`).join('\n')}
## What a green suite will not tell you

- Which failures has only a human caught so far? Turn each one into a case.
- Which inputs or sources has the suite never seen?
- What is not measured yet (cost, latency, real users), and when will it be?
`;
}

export function mountEvaluation(main, run) {
  const byName = new Map(run.checks.map((check) => [check.name, check]));
  for (const item of featured) if (!byName.has(item.check)) throw new Error(`Featured case “${item.check}” is not in the exported run.`);
  const passed = run.checks.filter((check) => check.passed).length;
  const date = new Date(run.ranAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const count = (id) => run.checks.filter((check) => check.category === id).length;
  const suiteTitle = Object.fromEntries(run.suites.map((suite) => [suite.id, suite.title]));
  const categoryTitle = Object.fromEntries(run.categories.map((category) => [category.id, category.title]));
  document.title = 'Evaluation, made visible — Lily Feng';

  main.innerHTML = `<a class="back-link" href="./">← Home</a><article class="evaluation">
  <header class="lesson-header"><span class="eyebrow">Demo · Groundwork</span><h1>Evaluation,<br><em>made visible.</em></h1>
    <p>Groundwork is an agent that gives a first-time founder a runnable starter kit: ordered filings, cited fees, and the tax elections that apply to them. Its evals were written before its agent loop. Here is what they check, and what a green suite still does not prove.</p>
    <div class="lesson-meta"><span>${passed}/${run.checks.length} checks passing</span><span>${run.suites.length} suites</span><span>Run ${escape(date)}</span><span>Commit ${escape(run.commit ?? 'unknown')}${run.uncommittedChanges ? ' + local changes' : ''}</span></div></header>
  <nav class="lesson-steps" aria-label="On this page"><a href="#system"><span>01</span> The system</a><a href="#failures"><span>02</span> Failure modes</a><a href="#cases"><span>03</span> Inside a case</a><a href="#run"><span>04</span> Every check</a><a href="#limits"><span>05</span> What it doesn’t prove</a><a href="#next"><span>06</span> Next</a><a href="#adapt"><span>07</span> Use it</a></nav>

  <section class="lesson-section" id="system"><div class="section-number">01 / THE SYSTEM UNDER TEST</div><h2>Routes, cites, computes. Never advises.</h2>
    <p class="lesson-lead">“LLC or S-corp?” has no answer as posed. An LLC is a state legal entity; an S-corp is a federal tax election made on top of one. Groundwork’s first job is to untangle the question, not answer it.</p>
    <div class="explanation-grid"><div><h3>What “correct” means here</h3><p>Every fee, form, and deadline rests on quoted text from an official page that was actually fetched. Steps arrive in an order that works. A founder outside its scope gets a referral, not a kit. Nothing in the output recommends, and nothing files.</p></div><div><h3>What is being evaluated</h3><p>The gate that any generated kit must pass, the bounded repair loop that sends failures back, the audit trail, and retrieval. These are deterministic, code-graded checks. They run before a model is in the loop, so every later change has something to be measured against.</p></div></div>
  </section>

  <section class="lesson-section" id="failures"><div class="section-number">02 / FAILURE MODES</div><h2>Nine ways a plausible kit is wrong.</h2>
    <p class="lesson-lead">Each check is a bad output written down, not a description of one. Grouped by what goes wrong, the ${run.checks.length} checks cover nine failure modes. Select one to filter the full list.</p>
    <div class="failure-grid">${run.categories.map((category) => `<button class="failure-card" data-category="${category.id}" aria-pressed="false"><span class="failure-count">${count(category.id)}</span><strong>${escape(category.title)}</strong><span>${escape(category.why)}</span></button>`).join('')}</div>
  </section>

  <section class="lesson-section" id="cases"><div class="section-number">03 / INSIDE A CASE</div><h2>The bad output, written down.</h2>
    <p class="lesson-lead">Four cases from the suite, quoted from the eval source.</p>
    <div class="case-list">${featured.map((item) => { const check = byName.get(item.check); return `<div class="experiment case-card"><div class="experiment-toolbar"><span class="experiment-label">${escape(item.title)}</span><span class="status ${check.passed ? 'ready' : 'failing'}">${check.passed ? 'Passing' : 'Failing'}</span></div>
      <div class="case-body"><div><span class="eyebrow">The output</span><pre>${escape(item.input)}</pre></div><div><span class="eyebrow">Must happen</span><p>${escape(item.expect)}</p><span class="eyebrow">Why the case exists</span><p>${escape(item.why)}</p></div></div>
      <div class="experiment-footer"><code>${escape(check.name)}</code><a class="text-link" href="${source}${item.file}">${escape(item.file)} ↗</a></div></div>`; }).join('')}</div>
  </section>

  <section class="lesson-section" id="run"><div class="section-number">04 / EVERY CHECK</div><h2>All ${run.checks.length}, as they ran.</h2>
    <div class="catalog-tools"><div class="layer-filters" role="group" aria-label="Filter by suite"><button class="filter active" data-suite="all" aria-pressed="true">All suites</button>${run.suites.map((suite) => `<button class="filter" data-suite="${suite.id}" aria-pressed="false">${escape(suite.title)}</button>`).join('')}</div><label class="search"><span aria-hidden="true">⌕</span><span class="sr-only">Search checks</span><input id="check-search" type="search" placeholder="Find a check…" autocomplete="off"></label></div>
    <p class="results-count" id="check-count" role="status"></p>
    <ul class="check-list" id="check-list">${run.checks.map((check) => `<li data-suite="${check.suite}" data-category="${check.category}" data-search="${escape(check.name.toLowerCase())}"><span class="check-mark ${check.passed ? 'pass' : 'fail'}" aria-label="${check.passed ? 'Passed' : 'Failed'}">${check.passed ? '✓' : '✕'}</span><span class="check-name">${escape(check.name)}${check.detail ? `<small>${escape(check.detail)}</small>` : ''}</span><span class="check-meta">${escape(suiteTitle[check.suite])} · ${escape(categoryTitle[check.category])}</span></li>`).join('')}</ul>
    <button class="text-link show-all" id="show-all" aria-controls="check-list">Show all ${run.checks.length} checks ↓</button>
    <p class="scope-note">Exported by <code>scripts/export-eval-run.mjs</code> from ${escape(run.python)}. The export fails if a suite’s reported count disagrees with the checks it printed, or if a check has no failure mode.</p>
  </section>

  <section class="lesson-section" id="limits"><div class="section-number">05 / WHAT A GREEN SUITE DOESN’T PROVE</div><h2>${passed} of ${run.checks.length} passing is not “correct.”</h2>
    <p class="lesson-lead">A suite shows what it was written to catch. These are the things this one was not written to catch.</p>
    <dl class="limit-list">${unproven.map(([title, text]) => `<div><dt>${escape(title)}</dt><dd>${escape(text)}</dd></div>`).join('')}</dl>
    <div class="experiment"><div class="experiment-toolbar"><span class="experiment-label">Caught by human review, not by the suite</span><span class="status">2 errors</span></div>
      <div class="table-wrap"><table class="math-table human-table"><thead><tr><th scope="col">The kit said</th><th scope="col">The rule actually is</th></tr></thead><tbody>${humanCatches.map(([was, is]) => `<tr><td>${escape(was)}</td><td>${escape(is)}</td></tr>`).join('')}</tbody></table></div>
      <div class="experiment-footer"><span>Both claims carried valid, verified, official citations. The page was right; its application was not.</span><a class="text-link" href="${source}fixtures/golden/tx-solo-consultant/REVIEW.md">REVIEW.md ↗</a></div></div>
  </section>

  <section class="lesson-section practical" id="next"><div class="section-number">06 / WHAT I WOULD TEST NEXT</div><h2>Close the gaps in order.</h2>
    <ol>${next.map(([title, text]) => `<li><strong>${escape(title)}</strong> ${escape(text)}</li>`).join('')}</ol>
  </section>

  <section class="lesson-section" id="adapt"><div class="section-number">07 / USE IT ON YOUR SYSTEM</div><h2>Take the failure modes with you.</h2>
    <p class="lesson-lead">The nine failure modes, rewritten as questions you can ask of your own pilot, with space for a case under each. It is a Markdown file generated on this page; nothing is sent anywhere.</p>
    <button class="button primary" id="download-template">Download the checklist (.md) <span aria-hidden="true">↓</span></button>
  </section>

  <aside class="learning-note availability"><span class="note-symbol" aria-hidden="true">↳</span><div><h2>Building something that needs this?</h2><p>I’m open to Staff/Principal roles and selected AI evaluation projects. Nineteen years of enterprise data and AI delivery, most recently agent and evaluation systems at Visa.</p></div><a class="button" href="${contact}">Get in touch <span aria-hidden="true">↗</span></a></aside>
  <nav class="lesson-end" aria-label="Related"><a class="text-link" href="${source}README.md">Groundwork source ↗</a><a class="text-link" href="?module=12">Module 12 · Evals & measurement →</a></nav>
</article>`;

  let suite = 'all';
  let category = null;
  let expanded = false;
  const preview = 12;
  const search = main.querySelector('#check-search');
  function filter() {
    const query = search.value.trim().toLowerCase();
    let shown = 0;
    // Unfiltered, the list previews a few rows; any filter or search shows every match.
    const collapsed = !expanded && suite === 'all' && !category && !query;
    main.querySelectorAll('#check-list li').forEach((row) => {
      const match = (suite === 'all' || row.dataset.suite === suite) && (!category || row.dataset.category === category) && row.dataset.search.includes(query);
      if (match) shown++;
      row.hidden = !match || (collapsed && shown > preview);
    });
    main.querySelector('#show-all').hidden = !collapsed;
    const scope = [category && categoryTitle[category], suite !== 'all' && suiteTitle[suite], query && `“${search.value.trim()}”`].filter(Boolean).join(' · ');
    main.querySelector('#check-count').textContent = collapsed ? `Showing ${preview} of ${run.checks.length} checks` : `${shown} of ${run.checks.length} checks${scope ? ` · ${scope}` : ''}`;
  }
  main.querySelectorAll('[data-suite].filter').forEach((button) => button.addEventListener('click', () => {
    suite = button.dataset.suite;
    main.querySelectorAll('[data-suite].filter').forEach((item) => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    filter();
  }));
  main.querySelectorAll('.failure-card').forEach((button) => button.addEventListener('click', () => {
    category = category === button.dataset.category ? null : button.dataset.category;
    main.querySelectorAll('.failure-card').forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.category === category)));
    filter();
    if (category) main.querySelector('#run').scrollIntoView();
  }));
  search.addEventListener('input', filter);
  main.querySelector('#show-all').addEventListener('click', () => { expanded = true; filter(); });
  filter();

  main.querySelector('#download-template').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([template(run)], { type: 'text/markdown' }));
    const link = Object.assign(document.createElement('a'), { href: url, download: 'ai-evaluation-checklist.md' });
    link.click();
    URL.revokeObjectURL(url);
  });
}
