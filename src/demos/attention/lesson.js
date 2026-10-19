import { localize } from './i18n.js';
import { tokens, keys, values, canAttend, attentionRow, kvCacheBytes } from './attention.mjs';

const architectures = [
  { id: 'mha', label: 'MHA', heads: 8, text: 'Eight query heads, eight independent key/value pairs. Every head keeps its own KV cache.' },
  { id: 'gqa', label: 'GQA', heads: 2, text: 'Eight query heads, two key/value pairs. Every group of four query heads shares one KV pair.' },
  { id: 'mqa', label: 'MQA', heads: 1, text: 'Eight query heads, one shared key/value pair. All query heads read the same cached keys and values.' },
];
const maskDescriptions = {
  causal: 'Read the past and the present. Future positions are blocked.',
  bidirectional: 'Read every position. Information can flow in both directions.',
  prefix: 'The first 3 tokens form a bidirectional prefix. Later positions have causal visibility.',
};
const vector = (v) => `[${v.map((n) => Number.isInteger(n) ? n : n.toFixed(2)).join(', ')}]`;
const number = (n) => n.toLocaleString('en-US');
const $ = (selector) => document.querySelector(selector);

export function mountAttention() {
  let mode = 'causal';
  let queryIndex = 2;
  let queryX = 1;
  let architecture = 'mha';
  let context = 4096;
  let batch = 1;

  function renderMask() {
    $('[data-mask][aria-pressed="true"]')?.setAttribute('aria-pressed', 'false');
    $(`[data-mask="${mode}"]`).setAttribute('aria-pressed', 'true');
    $('#mask-description').textContent = maskDescriptions[mode];
    $('#query-position').value = String(queryIndex);
    const allowed = tokens.map((_, index) => canAttend(mode, queryIndex, index));
    $('#visible-count').innerHTML = `<strong>${tokens[queryIndex]}</strong> can read <strong>${allowed.filter(Boolean).length} of 6</strong> positions.`;
    $('#visible-tokens').innerHTML = tokens.map((token, index) => `<span class="token ${allowed[index] ? 'visible' : 'masked'}"><small>${index + 1}</small>${token}${!allowed[index] ? '<span class="sr-only"> (blocked)</span>' : ''}</span>`).join('');
    $('#mask-matrix').innerHTML = `<span class="matrix-corner">Q ↓</span>${tokens.map((token, index) => `<span class="matrix-col-label">${token}<small>${index + 1}</small></span>`).join('')}${tokens.map((token, query) => `<button class="matrix-row-label ${query === queryIndex ? 'selected' : ''}" data-query="${query}" aria-pressed="${query === queryIndex}" aria-label="Inspect query ${query + 1}, ${token}">${token}<small>${query + 1}</small></button>${tokens.map((key, index) => `<button class="matrix-cell ${canAttend(mode, query, index) ? 'allowed' : 'blocked'} ${query === queryIndex ? 'selected' : ''}" data-query="${query}" aria-label="Query ${query + 1} ${token}, key ${index + 1} ${key}: ${canAttend(mode, query, index) ? 'allowed' : 'blocked'}. Inspect this query row." aria-pressed="${query === queryIndex}">${canAttend(mode, query, index) ? '·' : '×'}</button>`).join('')}`).join('')}`;
    renderMath();
    localize($('.attention-lesson'));
  }

  function renderMath() {
    const { scores, weights, output } = attentionRow(mode, queryIndex, queryX);
    $('#math-mask-label').textContent = `${mode} · query ${queryIndex + 1}: ${tokens[queryIndex]}`;
    $('#math-caption').textContent = `Q = ${vector([queryX, 1])}. Same mask and query position as experiment 01.`;
    $('#query-vector').textContent = vector([queryX, 1]);
    $('#math-rows').innerHTML = tokens.map((token, index) => `<tr class="${weights[index] === 0 ? 'is-blocked' : ''}"><th scope="row"><span class="position">${index + 1}</span>${token}</th><td>${vector(keys[index])}</td><td>${vector(values[index])}</td><td>${Number.isFinite(scores[index]) ? scores[index].toFixed(3) : '−∞'}</td><td><div class="weight-value"><span>${(weights[index] * 100).toFixed(1)}%</span><div class="weight-track"><i style="width:${weights[index] * 100}%"></i></div></div></td></tr>`).join('');
    $('#attention-output').textContent = vector(output);
    $('#output-formula').textContent = weights.map((weight, index) => weight > 0 ? `${weight.toFixed(3)} × V${index + 1}` : '').filter(Boolean).join(' + ');
    $('#weight-total').textContent = `Visible weights sum to ${weights.reduce((a, b) => a + b, 0).toFixed(3)} (before display rounding).`;
    localize($('#mixing'));
  }

  function renderCache() {
    const current = architectures.find((item) => item.id === architecture);
    document.querySelectorAll('[data-architecture]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.architecture === architecture)));
    $('#architecture-description').textContent = current.text;
    const headMarkup = Array.from({ length: 8 }, (_, i) => {
      const group = Math.floor(i / (8 / current.heads));
      return `<div class="head-column group-${group % 2}"><span class="query-head">Q${i + 1}</span><span class="head-wire" aria-hidden="true">↓</span><span class="kv-membership">KV ${group + 1}</span></div>`;
    }).join('');
    $('#head-diagram').innerHTML = `<div class="head-labels"><span>QUERY HEADS</span><span>KV PAIR READ BY EACH HEAD</span></div><div class="heads">${headMarkup}</div><div class="kv-pairs">${Array.from({ length: current.heads }, (_, i) => `<div class="kv-pair group-${i % 2}" style="grid-column:span ${8 / current.heads}"><strong>K${i + 1} / V${i + 1}</strong><small>${8 / current.heads} query ${current.heads === 8 ? 'head' : 'heads'} sharing</small></div>`).join('')}</div><p class="diagram-note">${current.heads} distinct KV ${current.heads === 1 ? 'pair' : 'pairs'} stored. Repeated KV labels above indicate the same shared pair.</p>`;
    $('#context-output').textContent = number(context);
    $('#context-length').value = String(context);
    $('#batch-size').value = String(batch);
    const baseline = kvCacheBytes(batch, context, 8);
    $('#cache-comparison').innerHTML = architectures.map((item) => {
      const bytes = kvCacheBytes(batch, context, item.heads);
      return `<div class="cache-row ${item.id === architecture ? 'active' : ''}"><span><strong>${item.label}</strong><small>${item.heads} KV ${item.heads === 1 ? 'head' : 'heads'}</small></span><div class="cache-track"><i style="width:${bytes / baseline * 100}%"></i></div><strong>${(bytes / 2 ** 30).toFixed(2)} GiB</strong></div>`;
    }).join('');
    $('#cache-saving').textContent = current.heads === 8 ? 'The baseline: a separate KV pair per query head.' : `${8 / current.heads}× smaller KV cache than MHA · ${(100 * (1 - current.heads / 8)).toFixed(1)}% less storage.`;
    $('#cache-configuration').textContent = `${number(context)} tokens × ${batch} ${batch === 1 ? 'sequence' : 'sequences'} · ${current.heads} KV ${current.heads === 1 ? 'head' : 'heads'}`;
    localize($('#sharing'));
  }

  document.querySelectorAll('[data-mask]').forEach((button) => button.addEventListener('click', () => { mode = button.dataset.mask; renderMask(); }));
  $('#mask-matrix').addEventListener('click', (event) => {
    const button = event.target.closest('[data-query]');
    if (!button) return;
    // Keep the clicked control focused when rebuilding the matrix.
    const index = [...$('#mask-matrix').children].indexOf(button);
    queryIndex = Number(button.dataset.query);
    renderMask();
    $('#mask-matrix').children[index]?.focus({ preventScroll: true });
  });
  $('#query-position').addEventListener('change', (event) => { queryIndex = Number(event.target.value); renderMask(); });
  $('#query-x').addEventListener('input', (event) => { queryX = Number(event.target.value); renderMath(); });
  $('#reset-mask').addEventListener('click', () => { mode = 'causal'; queryIndex = 2; renderMask(); });
  $('#reset-query').addEventListener('click', () => { queryX = 1; $('#query-x').value = '1'; renderMath(); });
  document.querySelectorAll('[data-architecture]').forEach((button) => button.addEventListener('click', () => { architecture = button.dataset.architecture; renderCache(); }));
  $('#context-length').addEventListener('input', (event) => { context = Number(event.target.value); renderCache(); });
  $('#batch-size').addEventListener('change', (event) => { batch = Number(event.target.value); renderCache(); });
  $('#reset-cache').addEventListener('click', () => { architecture = 'mha'; context = 4096; batch = 1; renderCache(); });

  const questions = [
    { question: 'With a causal mask, what is the output at the first token?', choices: ['Its own value vector', 'The average of every value', 'Always the zero vector'], correct: 0, reason: 'Only the first token is visible. Softmax over one allowed score is 1, so the output is exactly V₁.' },
    { question: 'Keep the batch and context fixed. Going from 8 KV heads to 2 makes this cache…', choices: ['2× smaller', '4× smaller', '8× smaller'], correct: 1, reason: 'Cache storage is linear in the number of KV heads. 8 ÷ 2 = 4. This does not predict a 4× runtime improvement.' },
  ];
  $('#quiz').innerHTML = questions.map((q, index) => `<fieldset class="quiz-card"><legend><span>0${index + 1}</span>${q.question}</legend><div class="quiz-choices">${q.choices.map((choice, choiceIndex) => `<button data-question="${index}" data-choice="${choiceIndex}" aria-pressed="false">${choice}</button>`).join('')}</div><p class="quiz-feedback" id="feedback-${index}" role="status">Choose an answer to check your intuition.</p></fieldset>`).join('');
  $('#quiz').addEventListener('click', (event) => {
    const button = event.target.closest('[data-question]');
    if (!button) return;
    const index = Number(button.dataset.question);
    const question = questions[index];
    const correct = Number(button.dataset.choice) === question.correct;
    document.querySelectorAll(`[data-question="${index}"]`).forEach((item) => { item.setAttribute('aria-pressed', String(item === button)); item.classList.remove('correct', 'incorrect'); });
    button.classList.add(correct ? 'correct' : 'incorrect');
    $(`#feedback-${index}`).textContent = `${correct ? 'Correct.' : 'Try again.'} ${question.reason}`;
    localize($('#quiz'));
  });
  renderMask();
  renderCache();
}
