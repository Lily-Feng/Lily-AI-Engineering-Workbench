// Reads the 18 framework chapters in modules/*.md into the library catalog.
// modules/ stays the single source: the sidebar, the library grid, and every
// module outline page are generated from it, so a syllabus edit there is the
// whole change.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

// Resolved from the working directory, not import.meta.url: Astro bundles this
// file into its build output, which moves it. Astro, npm scripts, and the
// tests all run from the repository root.
const root = process.cwd();

/** @typedef {{ id: string, title: string, english: string }} Topic */
/** @typedef {{ id: string, title: string, english: string, topics: Topic[] }} Section */
/**
 * @typedef {{ id: string, title: string, chinese: string, description: string, priority: string,
 *   layer: number, layerTitle: string, layerChinese: string, sections: Section[], topicCount: number,
 *   ready: boolean }} Module
 */

/** @type {[title: string, chinese: string, lastModule: number][]} */
export const layers = [
  ['Model principles', '模型原理', 3],
  ['Application intelligence', '应用智能', 7],
  ['Model systems', '模型系统', 11],
  ['Production engineering', '生产工程', 15],
  ['Enterprise delivery', '企业交付', 18],
];

const titles = [
  'LLM foundations', 'Transformers & modern architectures', 'Models & selection',
  'Prompt & context engineering', 'RAG & knowledge engineering', 'Agent systems', 'MCP, A2A & tool protocols',
  'Fine-tuning & post-training', 'Inference & serving', 'Distributed training & GPUs', 'Multimodal & realtime AI',
  'Evals & measurement', 'LLMOps & AgentOps', 'Safety & governance', 'AI full-stack engineering',
  'Enterprise integration', 'FDE & delivery', 'AI system design',
];

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

/**
 * Topics with an interactive explanation, keyed by topic ID, valued by the lesson's slug under /library/.
 * @type {Record<string, string>}
 */
export const readyTopics = {
  '02.01.01': 'attention', '02.01.02': 'attention', '02.01.04': 'attention', '02.02.04': 'attention', '02.03.01': 'attention',
};

/** @type {Promise<Module[]> | undefined} */
let cached;

/** @returns {Promise<Module[]>} */
export function readCatalog() {
  cached ??= load();
  return cached;
}

/** @returns {Promise<Module[]>} */
async function load() {
  /** @type {Record<string, string>} */
  const english = JSON.parse(await readFile(join(root, 'src/data/syllabus-english.json'), 'utf8'));
  /** @param {string} id @param {string} title */
  const bilingual = (id, title) => {
    const translated = english[id] ?? title;
    if (/[㐀-鿿]/.test(translated)) throw new Error(`English translation missing for ${id} in src/data/syllabus-english.json`);
    return translated;
  };
  const files = (await readdir(join(root, 'modules'))).filter((file) => /^\d{2}\.md$/.test(file)).sort();
  if (files.length !== 18) throw new Error('Expected the 18 numbered framework chapters in modules/.');
  return Promise.all(files.map(async (file, index) => {
    const text = await readFile(join(root, 'modules', file), 'utf8');
    const id = file.slice(0, 2);
    const chinese = text.match(/^# \d+\. (.+)/m)?.[1];
    const priority = text.match(/优先级：(P[012])/)?.[1];
    /** @type {Section[]} */
    const sections = [...text.matchAll(/^(\d{2}\.\d{2}) (.+)$/gm)].map((match) => ({ id: match[1], title: match[2], english: bilingual(match[1], match[2]), topics: [] }));
    for (const match of text.matchAll(/^- `(\d{2}\.\d{2}\.\d{2})` (.+)$/gm)) {
      const section = sections.find((item) => match[1].startsWith(`${item.id}.`));
      if (!section) throw new Error(`Unmatched topic ${match[1]} in modules/${file}`);
      section.topics.push({ id: match[1], title: match[2], english: bilingual(match[1], match[2]) });
    }
    if (!chinese || !priority || !sections.length || sections.some((section) => !section.topics.length)) throw new Error(`Invalid chapter: modules/${file}`);
    const layer = layers.findIndex((item) => index + 1 <= item[2]);
    return {
      id, title: titles[index], chinese, description: descriptions[index], priority,
      layer: layer + 1, layerTitle: layers[layer][0], layerChinese: layers[layer][1], sections,
      topicCount: sections.reduce((sum, section) => sum + section.topics.length, 0),
      ready: sections.some((section) => section.topics.some((topic) => readyTopics[topic.id])),
    };
  }));
}
