import { readFile, readdir, mkdir, cp, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

export const root = fileURLToPath(new URL('../', import.meta.url));
const layers = [
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

export async function readCatalog() {
  const english = JSON.parse(await readFile(join(root, 'scripts/syllabus-english.json'), 'utf8'));
  const bilingual = (id, title) => {
    const translated = english[id] ?? title;
    if (/[\u3400-\u9fff]/.test(translated)) throw new Error(`English translation missing for ${id}`);
    return translated;
  };
  const files = (await readdir(join(root, 'modules'))).filter((file) => /^\d{2}\.md$/.test(file)).sort();
  if (files.length !== 18) throw new Error('Expected the 18 numbered framework chapters.');
  return Promise.all(files.map(async (file, index) => {
    const text = await readFile(join(root, 'modules', file), 'utf8');
    const id = file.slice(0, 2);
    const chinese = text.match(/^# \d+\. (.+)/m)?.[1];
    const priority = text.match(/优先级：(P[012])/)?.[1];
    const sections = [...text.matchAll(/^(\d{2}\.\d{2}) (.+)$/gm)].map((match) => ({ id: match[1], title: match[2], english: bilingual(match[1], match[2]), topics: [] }));
    for (const match of text.matchAll(/^- `(\d{2}\.\d{2}\.\d{2})` (.+)$/gm)) {
      const section = sections.find((item) => match[1].startsWith(`${item.id}.`));
      if (!section) throw new Error(`Unmatched topic ${match[1]}`);
      section.topics.push({ id: match[1], title: match[2], english: bilingual(match[1], match[2]) });
    }
    if (!chinese || !priority || !sections.length || sections.some((section) => !section.topics.length)) throw new Error(`Invalid chapter: ${file}`);
    const layer = layers.findIndex((item) => index + 1 <= item[2]);
    return { id, title: titles[index], chinese, priority, layer: layer + 1, layerTitle: layers[layer][0], layerChinese: layers[layer][1], sections,
      topicCount: sections.reduce((sum, section) => sum + section.topics.length, 0) };
  }));
}

export async function build() {
  const catalog = await readCatalog();
  await mkdir(join(root, 'dist'), { recursive: true });
  await cp(join(root, 'web'), join(root, 'dist'), { recursive: true });
  await writeFile(join(root, 'dist/assets/catalog.json'), JSON.stringify(catalog));
  console.log(`Built static workbench: ${catalog.length} modules, 1 interactive topic. No dependencies or network required.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await build();
