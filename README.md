# Lily's AI Engineering Workbench

An open, practical knowledge base for becoming a well-rounded AI engineer: understand models, build applications and agents, run them in production, and deliver them in an enterprise setting. This is a companion to [Lily's Workbench](https://lily-feng.github.io/) and [Calm Data and AI](https://github.com/Lily-Feng/Calm.Data.and.AI).

The [2026 knowledge framework](modules/) has **18 modules in five layers**, with numbered topics, interview questions, and a hands-on project for each module. `P0` means core practice, `P1` means deeper systems work, and `P2` marks optional source-level or specialized infrastructure depth. The supplied 18 chapters are classified P0 or P1. These priorities guide learning order, not importance. The chapters are a syllabus and question bank; they do not claim that every project has been built.

## Website · 网站

**https://lily-feng.github.io/Lily-AI-Engineering-Workbench/** — demos and notes on testing whether an AI system is ready, with the 18-module library behind them, in English and 中文. Built with [Astro Starlight](https://starlight.astro.build/), like the [Reinforcement Learning](https://lily-feng.github.io/Reinforcement-Learning/) site; every push to `main` is checked and deployed by [GitHub Actions](.github/workflows/pages.yml).

### Editing without a local setup

Most changes are text, and text lives in Markdown. Edit the file on github.com (or press `.` in the repository for the web editor) and commit; the site updates a few minutes later. A pull request is built and link-checked but not deployed.

| To change | Edit |
| --- | --- |
| Where the root URL goes | `redirects` in `astro.config.mjs` (there is no homepage yet; `/` opens the library) |
| Evaluation walkthrough | `src/content/docs/demos/evaluation.mdx` |
| Library introduction | `src/content/docs/library/index.mdx` |
| A module's syllabus, sidebar entry, or outline page | `modules/NN.md` — pages are generated from it; new Chinese topic titles need an English entry in `src/data/syllabus-english.json` |
| Sidebar groups | `astro.config.mjs` |

A Chinese page is a file at the same path under `src/content/docs/zh/`. Without one, the Chinese site shows the English page with a “not yet translated” notice.

### Running it locally

Needed for layout, components, or interactive demos. Requires Node.js 24 (`.nvmrc`).

```bash
npm ci
npm run dev             # http://localhost:4321/Lily-AI-Engineering-Workbench/
npm run check           # unit tests + astro check (types and components)
npm run build           # static site in dist/; fails on a broken internal link
npm run export:evals    # re-run Groundwork's evals into src/data/evaluation-run.json (needs Python); commit the result
```

The build fails rather than shipping a wrong page when a chapter in `modules/` is malformed, an internal link is broken, or the walkthrough cites a check the committed eval run does not contain. Every count on the evaluation pages is read from `src/data/evaluation-run.json`.

## 知识目录

| Layer | Modules | Priority |
| --- | --- | --- |
| L1 模型原理 | [01 大模型基础](modules/01.md) · [02 Transformer 与现代架构](modules/02.md) · [03 模型生态与选型](modules/03.md) | P0 |
| L2 应用智能 | [04 Prompt 与 Context](modules/04.md) · [05 RAG](modules/05.md) · [06 Agent](modules/06.md) · [07 MCP 与 A2A](modules/07.md) | P0 |
| L3 模型系统 | [08 微调与后训练](modules/08.md) · [09 推理与 Serving](modules/09.md) · [10 分布式训练与 GPU](modules/10.md) · [11 多模态与实时 AI](modules/11.md) | P1 |
| L4 生产工程 | [12 Evals](modules/12.md) · [13 LLMOps 与 AgentOps](modules/13.md) · [14 安全与治理](modules/14.md) · [15 AI 全栈](modules/15.md) | P0 |
| L5 企业交付 | [16 企业集成](modules/16.md) · [17 FDE 交付](modules/17.md) · [18 系统设计](modules/18.md) | P0 |

Read the [learning roadmap](LEARNING-ROADMAP.md) for the suggested integrated projects, note template, tracking topics, and ten outcome checks. The supplied 32-week plan describes only its first six weeks; later weeks remain to be designed.

## Existing work mapped to the framework

| Material | Why it stays | Modules |
| --- | --- | --- |
| [GPU systems notes](references/gpu-systems/README.md) | Memory, interconnect, parallelism, and placement tradeoffs | 09, 10 |
| [AI operations notes and LogAI paper](references/ai-operations/README.md) | Cost-aware log intelligence and cross-signal observability | 12, 13 |
| [Groundwork](projects/groundwork/README.md) | A working, partly implemented agent case study with source validation, bounded repair, and evals | 05, 06, 12, 14, 17 |
| [Claude architect study guide](references/claude-architect/README.md) | Vendor-specific supplementary reading on solution design and enterprise delivery | 03, 06, 14, 16, 17, 18 |

This repository contains Markdown, source code, and the website. The old cross-connect taxonomy, unrelated cloud/data-platform notes, and stale glossary have been removed. For notes on cloud and data platforms, see [Calm Data and AI](https://github.com/Lily-Feng/Calm.Data.and.AI).

## Contribute a note

Use the seven-part template in the [roadmap](LEARNING-ROADMAP.md#五每一份知识笔记都采用统一模板): definition, mechanism, runnable code, experiment, interview questions, engineering pitfalls, and primary sources with a verification date. Give the note a module and topic number, distinguish measured results from estimates, and keep changing product details dated.

[Apache License 2.0](LICENSE).
