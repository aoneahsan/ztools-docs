/**
 * Generates one MDX file per enriched ZTools tool by reading the existing
 * `src/data/toolContent/batch*.ts` from the sibling ztools project.
 *
 * Single source of truth: the ZTools app data files. This script consumes
 * them and emits Docusaurus MDX so we never duplicate content between
 * the two projects.
 *
 * Edit `TOOLS_TO_PUBLISH` below to control which tools appear on the docs
 * site. We keep the cadence at 15-20 tools per batch for quality control.
 */

import {readFileSync, writeFileSync, mkdirSync, existsSync, rmSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DOCS_ROOT = join(__dirname, '..', 'docs');
const ZTOOLS_REPO = join(__dirname, '..', '..', 'ztools');
const ZTOOLS_DATA = join(ZTOOLS_REPO, 'src', 'data', 'toolContent');
const ZTOOLS_TOOLS_DATA = join(ZTOOLS_REPO, 'src', 'data', 'toolsData.ts');
const APP_URL = 'https://ztools.zaions.com';

// ---------------------------------------------------------------------------
// Cohort: top 20 tools to publish in the first wave.
// Mirrors batch-01 / batch-02 from the SEO content sequence — they're the
// foundation tools, highest search demand, broadest appeal.
// ---------------------------------------------------------------------------
const TOOLS_TO_PUBLISH = [
  // Batch 1 (init): foundation — 20 tools
  'json-formatter','password-generator','base64','url-encoder','qr-generator',
  'lorem-ipsum','color-picker','regex-tester','hash-generator','jwt-decoder',
  'uuid-generator','word-counter','markdown-html','image-compressor','merge-pdf',
  'json-minifier','diff-checker','image-resizer','favicon-generator','cron-expression',

  // Batch 2: generator category — 58 tools
  'api-documentation-generator','barcode-generator-advanced','bio-generator','border-radius','box-shadow',
  'color-mixer','color-palette','color-palette-generator-advanced','color-shades-generator','credit-card-generator',
  'css-background-pattern-generator','css-border-radius-generator','css-box-shadow-generator','css-checkbox-generator',
  'css-clip-path-generator','css-cubic-bezier-generator','css-glassmorphism-generator','css-gradient-generator',
  'css-loader-generator','css-switch-generator','css-text-glitch-generator','css-triangle-generator',
  'dendrite-fractal','dummy-data','email-template-generator','fake-data','fake-iban-generator','fractal-tree',
  'gradient-generator','hashtag-generator','hilbert-curve','htaccess-generator','invoice-generator',
  'mac-address-generator','meta-tag-generator','mock-api','number-sequence','open-graph-meta-generator',
  'pythagoras-fractal','random-color-generator','random-number','random-string','react-native-shadow-generator',
  'regex-builder','robots-txt-generator','safe-app-identifier-generator','safe-file-name-generator',
  'safe-folder-name-generator','schema-markup-generator','sierpinski-triangle','sitemap-generator',
  'sql-query-generator','string-generator','svg-blob-generator','svg-pattern-generator','table-generator',
  'twitter-card-generator','url-slug-generator',

  // Batch 3: image category — 56 tools
  'add-border-jpg','add-text-to-gif','background-remover','base64-image','blur-image','cartoon-effect-generator',
  'change-gif-speed','change-jpg-quality','change-png-colors','convert-png-to-webp','convert-webp-to-png',
  'crop-webp','duplicate-image-finder','extract-gif-frames','grayscale-jpg','heic-converter',
  'image-average-color-finder','image-base64','image-border-tool','image-color-extractor','image-compress-tool',
  'image-crop-tool','image-cropper','image-filters','image-filters-effect','image-format-batch-converter',
  'image-rotate-flip','image-upscaler','image-watermark','instagram-filters-advanced','instagram-post-generator',
  'passport-photo-maker','photo-censor','photo-collage-maker-advanced','pixelate-image','pixelate-jpg',
  'pixelate-webp','remove-gif-background','remove-webp-background','replace-webp-colors','reverse-gif',
  'reverse-image-search','rotate-png','sharpen-image','smart-image-optimizer','social-media-image-resizer',
  'svg-optimizer','svg-png','transparent-jpg','transparent-png-maker','transparent-webp','tweet-generator',
  'tweet-to-image-converter','universal-image-converter','vimeo-thumbnail-grabber','youtube-thumbnail-grabber',
];

// ---------------------------------------------------------------------------
// Types mirror the ToolContent shape from the ztools app data files.
// ---------------------------------------------------------------------------
type UseCase = {title: string; body: string};
type Step = {step: string; detail: string};
type Example = {input: string; output: string};
type Faq = {q: string; a: string};

interface ToolContent {
  distinctTitle: string;
  distinctDescription: string;
  intro: string;
  useCases: UseCase[];
  howItWorks: Step[];
  examples: Example[];
  faq: Faq[];
  tips: string[];
  keywords: string[];
  lastUpdated: string;
  author: string;
}

type ToolMeta = {id: string; name: string; category: string; description?: string};

// ---------------------------------------------------------------------------
// Load all enriched content via dynamic ESM imports.
// ---------------------------------------------------------------------------
async function loadContent(): Promise<Record<string, ToolContent>> {
  const merged: Record<string, ToolContent> = {};
  const files = Array.from({length: 35}, (_, i) => `batch${String(i + 1).padStart(2, '0')}.ts`);

  for (const file of files) {
    const path = join(ZTOOLS_DATA, file);
    if (!existsSync(path)) continue;
    const mod = await import(path);
    const exportKey = Object.keys(mod).find((k) => k.endsWith('_CONTENT'));
    if (!exportKey) continue;
    Object.assign(merged, mod[exportKey]);
  }
  return merged;
}

// ---------------------------------------------------------------------------
// Read tool metadata (name, category) from toolsData.ts via regex parsing.
// We don't need the full module — just per-id name and category.
// ---------------------------------------------------------------------------
function loadToolMeta(): Record<string, ToolMeta> {
  const src = readFileSync(ZTOOLS_TOOLS_DATA, 'utf-8');
  const meta: Record<string, ToolMeta> = {};
  // Match { ... id: 'foo' ... name: 'Foo' ... category: 'data' ... description: '...' }
  const blockRegex = /\{[^{}]*?id:\s*'([^']+)'[^{}]*?\}/gs;
  for (const match of src.matchAll(blockRegex)) {
    const block = match[0];
    const id = match[1];
    const name = /name:\s*'([^']+)'/.exec(block)?.[1] ?? id;
    const category = /category:\s*'([^']+)'/.exec(block)?.[1] ?? 'misc';
    const desc = /description:\s*'([^']+)'/.exec(block)?.[1];
    meta[id] = {id, name, category, description: desc};
  }
  return meta;
}

// ---------------------------------------------------------------------------
// MDX-safe escaping. MDX is parsed as Markdown + JSX so:
//   - braces { } need escaping to avoid JSX interpretation
//   - quotes inside front-matter strings need escaping
// ---------------------------------------------------------------------------
// Escape characters MDX-3 interprets as JSX or Markdown structures:
//   { } start expressions; < starts a tag; > ends a tag;
//   ![alt](url) is Markdown image — escape the `!` so syntax-illustration
//   text stays literal.
const escapeMdx = (s: string) =>
  s
    .replace(/\\/g, '\\\\')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/!\[/g, '\\![');
const yamlString = (s: string) => `"${s.replace(/"/g, '\\"')}"`;

// ---------------------------------------------------------------------------
// Render one tool as MDX.
// ---------------------------------------------------------------------------
function renderToolMdx(id: string, content: ToolContent, meta: ToolMeta): string {
  const url = `${APP_URL}/${id}`;
  const ghEdit = `https://github.com/aoneahsan/ztools-docs/edit/main/docs/tools/${meta.category}/${id}.mdx`;

  const useCases = content.useCases
    .map((uc) => `### ${escapeMdx(uc.title)}\n\n${escapeMdx(uc.body)}`)
    .join('\n\n');

  const steps = content.howItWorks
    .map((s, i) => `${i + 1}. **${escapeMdx(s.step)}** — ${escapeMdx(s.detail)}`)
    .join('\n');

  const examples = content.examples
    .map(
      (ex) =>
        `**Input:** ${escapeMdx(ex.input)}\n\n**Output:** ${escapeMdx(ex.output)}`,
    )
    .join('\n\n---\n\n');

  const faqs = content.faq
    .map((f) => `<details>\n<summary>**${escapeMdx(f.q)}**</summary>\n\n${escapeMdx(f.a)}\n\n</details>`)
    .join('\n\n');

  const tips = content.tips.map((t) => `- ${escapeMdx(t)}`).join('\n');

  return `---
id: ${id}
title: ${yamlString(content.distinctTitle)}
description: ${yamlString(content.distinctDescription)}
sidebar_label: ${yamlString(meta.name)}
keywords:
${content.keywords.map((k) => `  - ${yamlString(k)}`).join('\n')}
last_update:
  date: ${content.lastUpdated}
  author: ${content.author}
---

import ToolCTA from '@site/src/components/ToolCTA';

# ${meta.name}

${escapeMdx(content.intro)}

<ToolCTA toolId="${id}" toolName=${yamlString(meta.name)} />

## Use cases

${useCases}

## How it works

${steps}

## Examples

${examples}

## Frequently asked questions

${faqs}

## Tips

${tips}

## Try it now

The full ${meta.name} runs in your browser at **[${url}](${url})** — no signup, no upload, no data leaves your device.

[Open the tool ↗](${url})

---

*Last updated: ${content.lastUpdated} · Author: ${content.author} · [Edit this page on GitHub](${ghEdit})*
`;
}

// ---------------------------------------------------------------------------
// Render the tools/index.mdx hub.
// ---------------------------------------------------------------------------
function renderHub(byCategory: Map<string, Array<{id: string; meta: ToolMeta}>>): string {
  const sections = Array.from(byCategory.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([cat, tools]) => {
      const items = tools
        .map(
          (t) =>
            `- [**${t.meta.name}**](/docs/tools/${cat}/${t.id}) — ${(t.meta.description ?? '').replace(/\n/g, ' ')}`,
        )
        .join('\n');
      return `## ${cat[0].toUpperCase()}${cat.slice(1)}\n\n${items}`;
    })
    .join('\n\n');

  return `---
id: index
title: All ZTools — 520+ Free Browser-Only Tools
description: Browse the full ZTools catalog. Every tool runs in your browser — no signup, no upload, no data leaves your device.
sidebar_label: All tools
sidebar_position: 0
slug: /tools
---

# All ZTools

ZTools is a free, browser-only collection of **520+ developer & creator tools**. Every tool listed here is documented with use cases, examples, and FAQs.

This index is the **first wave** — top 20 highest-demand tools. The rest land in subsequent batches; track progress on the [GitHub repo](https://github.com/aoneahsan-ztools-docs).

${sections}

---

*Last updated: ${new Date().toISOString().slice(0, 10)} · [Open the app](${APP_URL}) · [GitHub](https://github.com/aoneahsan/ztools-docs)*
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('▸ Loading content from ztools project...');
  const allContent = await loadContent();
  const meta = loadToolMeta();
  console.log(`  ${Object.keys(allContent).length} enriched tools available`);
  console.log(`  ${Object.keys(meta).length} tools with metadata\n`);

  const toolsDir = join(DOCS_ROOT, 'tools');
  if (existsSync(toolsDir)) rmSync(toolsDir, {recursive: true, force: true});
  mkdirSync(toolsDir, {recursive: true});

  const byCategory = new Map<string, Array<{id: string; meta: ToolMeta}>>();
  let written = 0;
  let skipped = 0;

  for (const id of TOOLS_TO_PUBLISH) {
    const content = allContent[id];
    const m = meta[id];
    if (!content) {
      console.warn(`  ⚠ Skipping ${id}: no enriched content found`);
      skipped++;
      continue;
    }
    if (!m) {
      console.warn(`  ⚠ Skipping ${id}: no metadata found`);
      skipped++;
      continue;
    }

    const dir = join(toolsDir, m.category);
    mkdirSync(dir, {recursive: true});
    const file = join(dir, `${id}.mdx`);
    writeFileSync(file, renderToolMdx(id, content, m), 'utf-8');

    const list = byCategory.get(m.category) ?? [];
    list.push({id, meta: m});
    byCategory.set(m.category, list);
    written++;
  }

  // Per-category index pages
  for (const [cat, tools] of byCategory) {
    const items = tools.map((t) => `- [${t.meta.name}](./${t.id}) — ${(t.meta.description ?? '').slice(0, 100)}`).join('\n');
    const indexFile = join(toolsDir, cat, 'index.mdx');
    writeFileSync(
      indexFile,
      `---
id: index
title: ${yamlString(`${cat[0].toUpperCase()}${cat.slice(1)} tools — ZTools`)}
sidebar_label: ${yamlString(`${cat[0].toUpperCase()}${cat.slice(1)} tools`)}
sidebar_position: 0
slug: /tools/${cat}
---

# ${cat[0].toUpperCase()}${cat.slice(1)} tools

${tools.length} tool${tools.length === 1 ? '' : 's'} in this category.

${items}
`,
      'utf-8',
    );
  }

  // Top-level tools/index.mdx
  writeFileSync(join(toolsDir, 'index.mdx'), renderHub(byCategory), 'utf-8');

  console.log(`\n✓ Wrote ${written} tool MDX files across ${byCategory.size} categories.`);
  if (skipped > 0) console.log(`  (${skipped} skipped — see warnings above)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
