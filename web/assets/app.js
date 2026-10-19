import { language, localize, translate } from './i18n.js';

const sourceRoot = 'https://github.com/Lily-Feng/Lily-AI-Engineering-Workbench/blob/main/';
const main = document.querySelector('#main');
const escape = (text) => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const params = new URLSearchParams(location.search);
const activeId = params.get('module');
const topicId = params.get('topic');
const moduleUrl = (id) => `?module=${id}`;
const lessonUrl = '?module=02&topic=attention';
const evaluationUrl = '?view=evaluation';
const blogUrl = 'https://lily-feng.github.io/blogs';
const contactUrl = 'https://lily-feng.github.io/about';
const view = params.get('view');
const descriptions = [
  'The mathematics, objectives, and lifecycle behind language models.',
  'Follow information through attention, position, and modern model blocks.',
  'Compare capabilities and make model choices against real constraints.',
  'Design the instructions and context a model actually receives.',
  'Turn documents into retrievable, grounded knowledge.',
  'Connect planning, tools, state, and bounded execution.',
  'Understand how agents discover tools and work across boundaries.',
  'Adapt model behavior with data, low-rank updates, and preferences.',
  'Explore the path from prefill to efficient token generation.',
  'Partition work, synchronize gradients, and account for GPU resources.',
  'Build across text, images, audio, and realtime interaction.',
  'Measure quality, expose failures, and catch regressions.',
  'Operate model and agent systems with observability and cost controls.',
  'Design for permissions, privacy, and adversarial inputs.',
  'Bring models into reliable, usable software.',
  'Connect AI to enterprise data, identity, and workflows.',
  'Turn ambiguous needs into a validated, maintainable delivery.',
  'Balance architecture, quality, latency, scale, and cost.',
];

function miniMask() {
  return `<div class="mini-mask" aria-hidden="true">${Array.from({ length: 36 }, (_, index) => `<i class="${index % 6 <= Math.floor(index / 6) ? 'open' : ''}"></i>`).join('')}</div>`;
}

function card(module) {
  const ready = module.id === '02';
  return `<a class="module-card ${ready ? 'module-card-ready' : ''}" href="${moduleUrl(module.id)}" data-layer="${module.layer}" data-search="${escape(`${module.id} ${module.title} ${module.chinese} ${module.sections.flatMap((s) => s.topics.map((t) => `${t.title} ${t.english}`)).join(' ')}`.toLowerCase())}">
    <div class="card-top"><span class="module-number">${module.id}</span><span class="status ${ready ? 'ready' : ''}">${ready ? '1 topic ready' : 'Planned'}</span></div>
    <span class="layer-label">L${module.layer} / ${module.layerTitle}</span><h3>${module.title}</h3><p class="chinese" lang="zh-CN">${escape(module.chinese)}</p>
    <p class="card-description">${descriptions[Number(module.id) - 1]}</p><div class="card-bottom"><span>${module.topicCount} syllabus topics · ${module.priority}</span><span aria-hidden="true">↗</span></div></a>`;
}

function evalFigure(run) {
  const passed = run.checks.filter((check) => check.passed).length;
  return `<a class="hero-figure eval-figure" href="${evaluationUrl}" aria-label="Open the evaluation walkthrough"><div class="figure-top"><span class="eyebrow">Inside the featured demo</span><span class="figure-symbol">Groundwork</span></div>
    <dl class="eval-stats"><div><dt>${passed}/${run.checks.length}</dt><dd>checks passing</dd></div><div><dt>${run.categories.length}</dt><dd>failure modes covered</dd></div><div><dt>2</dt><dd>errors only a human caught</dd></div></dl>
    <div class="figure-caption"><span><strong>What does a green suite prove?</strong><small>Less than it looks. The walkthrough shows both halves.</small></span><span class="circle-arrow" aria-hidden="true">↗</span></div></a>`;
}

function gallery(catalog, run) {
  document.title = 'Lily Feng — AI engineering demos and notes';
  main.innerHTML = `<section class="hero"><div><span class="eyebrow">Lily Feng · AI engineering demos & notes</span><h1>Evaluation,<br><em>made visible.</em></h1><p>How I test whether an AI system is ready: the cases, the failures, and what a green suite still doesn’t prove.</p><p class="hero-about">Nineteen years of enterprise data and AI delivery, most recently agent and evaluation systems at Visa.</p><div class="hero-actions"><a class="button primary" href="${evaluationUrl}">See the evaluation <span aria-hidden="true">↗</span></a><a class="text-link" href="#demos">All demos <span aria-hidden="true">↓</span></a></div></div>
    ${evalFigure(run)}</section>
    <section class="demos" id="demos"><div class="section-heading"><div><span class="eyebrow">Demos</span><h2>Working systems, with their limits stated.</h2></div><p>Each demo says what it measures<br>and what it does not.</p></div>
    <div class="demo-grid"><a class="demo-card demo-card-featured" href="${evaluationUrl}"><div class="card-top"><span class="status ready">Featured · Engineering demo</span><span aria-hidden="true">↗</span></div><h3>Evaluation, made visible</h3><p>${run.checks.length} checks around an agent that builds a founder’s starter kit: what the gate refuses, how repair stops, and the two errors human review caught that the suite did not.</p><span class="demo-meta">Groundwork · evals · RAG · agent guardrails</span></a>
    <a class="demo-card" href="${lessonUrl}"><div class="card-top"><span class="status">Engineering demo</span><span aria-hidden="true">↗</span></div><h3>Attention, made visible</h3><p>Change a mask, follow the Q/K/V arithmetic, and compare the KV cache behind MHA, GQA, and MQA. Toy vectors and theoretical cache sizes, not a benchmark.</p><span class="demo-meta">Module 02 · interactive lesson</span></a></div></section>
    <section class="featured writing" id="writing"><div><span class="eyebrow">Writing</span><h2>Notes from the demos.</h2><p>Short, practical posts on what each demo showed and what to test in your own system, published on my blog.</p></div><a class="button" href="${blogUrl}">Read the blog <span aria-hidden="true">↗</span></a></section>
    <section class="curriculum" id="library"><div class="section-heading"><div><span class="eyebrow">The library</span><h2>One framework. Eighteen ways in.</h2></div><p>The full 18-module syllabus, for going deeper.<br>Interactive explanations are built one topic at a time.</p></div>
    <div class="catalog-tools"><div class="layer-filters" role="group" aria-label="Filter by layer"><button class="filter active" data-filter="all" aria-pressed="true">All layers</button>${[...new Map(catalog.map((m) => [m.layer, m])).values()].map((m) => `<button class="filter" data-filter="${m.layer}" aria-pressed="false">L${m.layer} <span>${m.layerTitle}</span></button>`).join('')}</div><label class="search"><span aria-hidden="true">⌕</span><span class="sr-only">Search modules and syllabus topics</span><input id="module-search" type="search" placeholder="Find a concept…" autocomplete="off"></label></div>
    <p class="results-count" id="results-count" role="status">18 modules · 1 interactive topic</p><div class="module-grid">${catalog.map(card).join('')}</div><p id="empty-state" class="empty-state" hidden>No modules match. Try “attention”, “RAG”, or a different layer.</p></section>
    <aside class="learning-note availability"><span class="note-symbol" aria-hidden="true">↳</span><div><h2>Open to opportunities.</h2><p>Staff/Principal roles and selected AI evaluation projects. If your team has an AI system that demos well and you need to know whether it works, I’d like to hear about it.</p></div><a class="button" href="${contactUrl}">Get in touch <span aria-hidden="true">↗</span></a></aside>`;
  let layer = 'all';
  const search = document.querySelector('#module-search');
  function filter() {
    const query = search.value.trim().toLowerCase();
    let count = 0;
    document.querySelectorAll('.module-card').forEach((item) => {
      item.hidden = !((layer === 'all' || item.dataset.layer === layer) && item.dataset.search.includes(query));
      if (!item.hidden) count++;
    });
    document.querySelector('#results-count').textContent = `${count} ${count === 1 ? 'module' : 'modules'}${query ? ` matching “${search.value.trim()}”` : ''}`;
    document.querySelector('#empty-state').hidden = count > 0;
    localize(main);
  }
  document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
    layer = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((item) => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    filter();
  }));
  search.addEventListener('input', filter);
}

function moduleShell(module, catalog) {
  return `<a class="back-link" href="./">← All modules</a><div class="module-layout"><aside class="module-sidebar"><span class="eyebrow">The framework</span><nav aria-label="Framework modules">${catalog.map((m) => `<a href="${moduleUrl(m.id)}" ${m.id === module.id ? 'aria-current="page"' : ''}><span>${m.id}</span><span>${m.title}</span>${m.id === '02' ? '<i class="ready-dot" title="One interactive topic ready"></i>' : ''}</a>`).join('')}</nav></aside><div class="module-content${topicId === 'attention' ? ' lesson-view' : ''}"><header class="module-header"><div class="module-kicker"><span class="eyebrow">L${module.layer} · ${module.layerTitle}</span><span class="status ${module.id === '02' ? 'ready' : ''}">${module.id === '02' ? '1 interactive topic' : 'Interactive lessons planned'}</span></div><p class="module-id">MODULE ${module.id} / ${module.priority}</p><h1>${module.title}</h1><p class="chinese" lang="zh-CN">${escape(module.chinese)}</p><p>${descriptions[Number(module.id) - 1]}</p></header>`;
}

function syllabus(module) {
  return `<section class="syllabus"><div class="section-heading"><div><span class="eyebrow">Original chapter outline</span><h2>The topics ahead.</h2></div><a class="text-link" href="${sourceRoot}modules/${module.id}.md">Read chapter source ↗</a></div>${module.sections.map((section) => `<details class="syllabus-section" open><summary><span>${section.id}</span><strong lang="${language === 'zh' ? 'zh-CN' : 'en'}">${escape(language === 'zh' ? section.title : section.english)}</strong><span>${section.topics.length} topics</span></summary><ul>${section.topics.map((topic) => `<li><code>${topic.id}</code><span lang="${language === 'zh' ? 'zh-CN' : 'en'}">${escape(language === 'zh' ? topic.title : topic.english)}</span><small class="topic-status">${module.id === '02' && ['02.01.01', '02.01.02', '02.01.04', '02.02.04', '02.03.01'].includes(topic.id) ? '<a href="?module=02&topic=attention">Explore in attention ↗</a>' : 'Planned'}</small></li>`).join('')}</ul></details>`).join('')}</section>`;
}

async function showModule(module, catalog) {
  document.title = `${module.title} — AI Engineering Workbench`;
  main.innerHTML = moduleShell(module, catalog) + (module.id === '02' ? `<a class="lesson-feature" href="${lessonUrl}">${miniMask()}<div><span class="status ready">Interactive · Ready to explore</span><h2>Attention, made visible.</h2><p>Masks → Q/K/V → MHA, GQA & MQA.<br>Three connected experiments. One mental model.</p></div><span class="circle-arrow" aria-hidden="true">↗</span></a>` : `<section class="placeholder"><span class="placeholder-icon" aria-hidden="true">[ · · · ]</span><h2>This bench is ready for its first experiment.</h2><p>The chapter outline is available below. Its detailed visual lessons have not been built yet.</p><a class="button primary" href="${lessonUrl}">Try the first attention lesson ↗</a></section>`) + syllabus(module) + `<nav class="module-pagination" aria-label="Adjacent modules">${Number(module.id) > 1 ? `<a href="${moduleUrl(String(Number(module.id) - 1).padStart(2, '0'))}">← Previous module</a>` : '<span></span>'}${Number(module.id) < 18 ? `<a href="${moduleUrl(String(Number(module.id) + 1).padStart(2, '0'))}">Next module →</a>` : '<span></span>'}</nav></div></div>`;
}

async function showAttention(module, catalog) {
  const response = await fetch('./lessons/attention.html');
  if (!response.ok) throw new Error('The attention lesson could not be loaded.');
  const html = await response.text();
  main.innerHTML = moduleShell(module, catalog) + `<a class="back-link" href="?module=02">← Module 02 outline</a>` + html + '</div></div>';
  document.title = 'Attention, made visible — AI Engineering Workbench';
  const { mountAttention } = await import('./lesson.js');
  mountAttention();
}

const languageButton = document.querySelector('#language-toggle');
languageButton.textContent = language === 'zh' ? 'English' : '中文';
languageButton.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
languageButton.addEventListener('click', () => {
  const url = new URL(location.href);
  url.searchParams.set('lang', language === 'zh' ? 'en' : 'zh');
  location.assign(url);
});
const themeButton = document.querySelector('#theme-toggle');
function themeLabel() { themeButton.setAttribute('aria-label', translate(`Switch to ${document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'} theme`)); }
themeLabel();
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('workbench-theme', theme); } catch {}
  themeLabel();
});

try {
  const response = await fetch('./assets/catalog.json');
  if (!response.ok) throw new Error('The module catalog could not be loaded.');
  const catalog = await response.json();
  const module = catalog.find((item) => item.id === activeId);
  const loadRun = async () => {
    const runResponse = await fetch('./evaluation/run.json');
    if (!runResponse.ok) throw new Error('The evaluation run could not be loaded.');
    return runResponse.json();
  };
  if (activeId && !module || topicId && !(activeId === '02' && topicId === 'attention') || view && (view !== 'evaluation' || activeId)) {
    document.title = 'Topic not found — AI Engineering Workbench';
    main.innerHTML = '<section class="placeholder"><span class="eyebrow">404 · Unknown module or topic</span><h1>That topic isn’t on this bench.</h1><a class="button" href="./">Back to the workbench →</a></section>';
  } else if (topicId === 'attention') await showAttention(module, catalog);
  else if (module) await showModule(module, catalog);
  else if (view === 'evaluation') { const { mountEvaluation } = await import('./evaluation.js'); mountEvaluation(main, await loadRun()); }
  else gallery(catalog, await loadRun());
} catch (error) {
  main.innerHTML = `<section class="placeholder"><h1>The workbench couldn’t open.</h1><p>${escape(error.message)} Please reload, or read the source chapters.</p><a class="button" href="${sourceRoot}modules/README.md">Open the syllabus ↗</a></section>`;
}

localize(document.body);
if (language === 'zh') document.title = document.title.split(' — ').map(translate).join(' — ').replace('AI Engineering Workbench', 'AI 工程工作台').replace('Attention, made visible', '看得见的注意力');

if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' });
