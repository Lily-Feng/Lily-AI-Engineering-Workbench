# The visual AI workbench

A dependency-free static website integrated with the existing 18-module syllabus. The first implemented topic is attention in Module 02; every other topic is explicitly planned. “Ready” refers to this topic, not completion of the whole module.

## Run and verify

Run `npm run dev` from the repository root, then open <http://127.0.0.1:4173/>. Run `npm run build` after editing source files while the server is running, or restart the server. `PORT=4174 npm run dev` selects a different port. Run `npm run check` before handing off changes.

Only `dist/` needs hosting. The site uses ordinary query-string links rather than path routing, so direct module/lesson links work on a plain static host, including a GitHub Pages project subdirectory. Publishing is separate from the local build.

## Structure

- `modules/01.md` … `18.md`: the existing syllabus remains the source for chapter structure and topic IDs.
- `scripts/build-site.mjs`: reads and validates those chapters, generates `assets/catalog.json`, and copies the website to `dist/`. No network access.
- `scripts/syllabus-english.json`: English translations keyed by the original section/topic ID. Already-English source labels are reused. Missing English translations for Chinese labels fail the build.
- `web/index.html`: shared page shell, theme initialization, and loading fallback.
- `web/assets/app.js`: gallery, combined search/layer filtering, module outlines, placeholder states, and direct lesson links.
- `web/lessons/attention.html`: the authored English explanation and accessible experiment containers.
- `web/assets/lesson.js`: attention UI and feedback. It derives displayed results from `attention.mjs`.
- `web/assets/attention.mjs`: pure, runnable mask, attention, and cache calculations, covered by `tests/attention.test.mjs`.
- `web/assets/i18n.js`: English/Chinese phrase translations, generated-result translations, and language-preserving local links. Both languages ship with the static files; there is no translation API.
- `web/assets/styles.css`: semantic colors for both themes, responsive layout, focus states, and reduced-motion support.

Language lives in the shareable `lang=en` / `lang=zh` URL parameter, with local storage as a fallback. Switching language retains the current module/lesson and anchor; the experiments reset to their initial values. Theme preference is stored separately. English titles of primary-source papers, acronyms, formulas, and example token strings retain their original forms. Original Chinese chapter titles remain visible as subtitles in the Chinese interface.

## Add a topic

1. Pick an existing topic ID, or first add the topic to its numbered Markdown chapter. Add its English translation when needed.
2. Follow this reusable structure: definition → manipulable mechanism → runnable math/code → bounded experiment → self-check → engineering pitfalls → dated primary sources. Keep estimates distinct from measured benchmarks.
3. Author the explanation in `web/lessons/`, add its interaction code as an ES module, and keep calculation functions independent of the DOM.
4. Register the lesson route and ready-topic links in `app.js`. Update the readiness counts in the catalog UI; do not mark the entire module complete for a single topic.
5. Add corresponding Chinese phrases to `i18n.js` and localize newly rendered outputs. Test both language URLs, each control, quiz feedback, reset actions, and module navigation.
6. Run `npm run check`, then inspect light/dark at desktop and 390px. Do not add a framework, plotting library, or animation package for diagrams that HTML/SVG and a small calculation can express.

## Efficient expansion

Keep the interaction pattern from the reinforcement learning simulations, while reusing one shell across all modules. Prefer live SVG/HTML diagrams to pre-rendered videos for the first implementation: they stay sharp, accessible, bilingual, and easy to revise. Use video later when continuous motion contributes to understanding.

Suggested next topics, without promising a schedule:

1. **02.02.03 RoPE** — rotate two vectors and inspect relative-position dot products.
2. **08.01.02 LoRA** — vary rank and compare update shapes and parameter counts.
3. **05 retrieval pipelines** — trace a small fixed document set through retrieval and reranking.
4. **10 distributed training** — step through gradient synchronization between workers.

These can reuse the existing controls, experiment frame, numbered explanation, and self-check styles. Avoid building all 18 projects independently; the learning roadmap already groups them into five integrated projects.

## Verification limits

The attention experiments use invented 2D vectors and a theoretical, uncompressed KV cache. They do not run an LLM, benchmark a GPU, predict model quality, or implement a complete Transformer. Reference papers are linked in both languages.
