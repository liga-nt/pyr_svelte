/**
 * One-time script: converts Nuxt markdown articles to JSON for the SvelteKit site.
 * Run: node scripts/convert-articles.js
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, basename } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const NUXT_ARTICLES = '/Users/npresnall/PYR/pyr-nuxt/content/articles';
const OUTPUT_DIR = './src/lib/content/articles';

// Topic → readable label mapping
const topicLabels = {
  'Counseling Approaches': 'Counseling Approaches',
  'Psychiatry': 'Psychiatry',
  'Addiction Treatment': 'Addiction Treatment',
  'Mental Health': 'Mental Health',
  'Mutual Support': 'Mutual Support',
  'Teens': 'Teens',
  'Young Adults': 'Young Adults'
};

mkdirSync(OUTPUT_DIR, { recursive: true });

const files = readdirSync(NUXT_ARTICLES).filter(f => f.endsWith('.md'));

for (const file of files) {
  const slug = basename(file, '.md');
  const raw = readFileSync(join(NUXT_ARTICLES, file), 'utf-8');
  const { data, content } = matter(raw);

  // Strip HTML comments from body
  const cleanContent = content
    .replace(/<!--StartFragment-->/g, '')
    .replace(/<!--EndFragment-->/g, '')
    .trim();

  // Convert to HTML
  const body = marked.parse(cleanContent);

  // Generate SEO from title if placeholders
  const seoTitle = (data.seo?.metaTitle && data.seo.metaTitle !== '1')
    ? data.seo.metaTitle
    : `${data.title} | Plan Your Recovery`;

  const seoDesc = (data.seo?.metaDesc && data.seo.metaDesc !== '2')
    ? data.seo.metaDesc
    : `${data.title}. Evidence-based information on addiction and mental health from Plan Your Recovery, St. Louis.`;

  const article = {
    slug,
    title: data.title || slug,
    subtitle: data.subtitle || null,
    author: data.author || 'Plan Your Recovery',
    date: data.date ? new Date(data.date).toISOString().split('T')[0] : null,
    topics: Array.isArray(data.topic) ? data.topic : (data.topic ? [data.topic] : []),
    seo: {
      title: seoTitle,
      description: seoDesc
    },
    body
  };

  const outPath = join(OUTPUT_DIR, `${slug}.json`);
  writeFileSync(outPath, JSON.stringify(article, null, 2));
  console.log(`✓ ${slug}`);
}

console.log(`\nConverted ${files.length} articles to ${OUTPUT_DIR}`);
