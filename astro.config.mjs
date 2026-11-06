// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import { readCatalog, layers } from './src/lib/catalog.mjs';

const base = '/Lily-AI-Engineering-Workbench';
const catalog = await readCatalog();

/**
 * The library sidebar is generated from modules/*.md, one group per layer.
 * Module pages live at /library/<id>/; the two-digit IDs are their published
 * URLs, so they must not be renumbered.
 */
const library = layers.map(([title, chinese], index) => ({
  label: `L${index + 1} · ${title}`,
  translations: { 'zh-CN': `L${index + 1} · ${chinese}` },
  collapsed: true,
  items: catalog.filter((module) => module.layer === index + 1).map((module) => ({
    label: `${module.id} · ${module.title}`,
    translations: { 'zh-CN': `${module.id} · ${module.chinese}` },
    link: `/library/${module.id}/`,
  })),
}));

export default defineConfig({
  site: 'https://lily-feng.github.io',
  base,

  // No homepage for now: the root opens the library. Replace these with
  // src/content/docs/index.mdx (and zh/index.mdx) when the site gets a front page.
  // Astro does not prefix redirect targets with `base`, so they carry it.
  redirects: {
    '/': `${base}/library/`,
    '/zh/': `${base}/zh/library/`,
  },

  integrations: [
    starlight({
      title: 'Lily’s AI Workbench',
      description: 'Lily Feng’s AI engineering demos and notes: how to test whether an AI system is ready, shown on a real evaluation suite, with an 18-module engineering library behind it.',
      // Expressive Code (code-block highlighting) embeds the project path in
      // generated JS without escaping it, so the apostrophe in the local folder
      // name "Lily's AI workbench" breaks every build. No page has a code block
      // yet; re-enable once the folder is renamed to match the repository.
      expressiveCode: false,
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        zh: { label: '简体中文', lang: 'zh-CN' },
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/Lily-Feng/Lily-AI-Engineering-Workbench' },
      ],
      plugins: [
        // Fails the build on a broken internal link. Module outline pages are
        // generated (src/pages/library/[module].astro), which the validator
        // cannot see, so links to them are excluded rather than flagged. Chinese
        // pages may link to pages that are still English-only.
        starlightLinksValidator({
          exclude: [`${base}/library/[0-9][0-9]/`, `${base}/zh/library/[0-9][0-9]/`],
          errorOnFallbackPages: false,
        }),
      ],
      customCss: ['./src/styles/custom.css', './src/styles/workbench.css'],
      sidebar: [
        {
          label: 'Demos',
          translations: { 'zh-CN': '演示' },
          items: [
            { label: 'Evaluation, made visible', translations: { 'zh-CN': '看得见的评估' }, link: '/demos/evaluation/' },
            { label: 'Attention, made visible', translations: { 'zh-CN': '看得见的注意力' }, link: '/library/attention/' },
          ],
        },
        {
          label: 'Library',
          translations: { 'zh-CN': '知识库' },
          items: [{ label: 'Overview', translations: { 'zh-CN': '总览' }, link: '/library/' }, ...library],
        },
        {
          label: 'Elsewhere',
          translations: { 'zh-CN': '更多' },
          items: [
            { label: 'Writing ↗', translations: { 'zh-CN': '博客 ↗' }, link: 'https://lily-feng.github.io/blogs' },
            { label: 'About Lily ↗', translations: { 'zh-CN': '关于 Lily ↗' }, link: 'https://lily-feng.github.io/about' },
          ],
        },
      ],
    }),
  ],
});
