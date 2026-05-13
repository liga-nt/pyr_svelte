import { json, error } from '@sveltejs/kit';
import { readFile, readdir } from 'fs/promises';
import { join, resolve, normalize, basename } from 'path';
import { dev } from '$app/environment';

const CONTENT_ROOT = resolve('src/lib/content');
const SRC_ROOT = resolve('src');

function esc(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function getAllSourceFiles(dir) {
	const results = [];
	try {
		const entries = await readdir(dir, { withFileTypes: true });
		for (const entry of entries) {
			const full = join(dir, entry.name);
			if (entry.isDirectory()) results.push(...(await getAllSourceFiles(full)));
			else if (/\.(svelte|js)$/.test(entry.name)) results.push(full);
		}
	} catch {}
	return results;
}

export async function GET({ url }) {
	if (!dev) error(403, 'Dev only');

	const file = url.searchParams.get('file');
	if (!file) error(400, 'file required');

	const jsonPath = resolve(join(CONTENT_ROOT, normalize(file)));
	const jsonContent = JSON.parse(await readFile(jsonPath, 'utf-8'));
	const topLevelKeys = Object.keys(jsonContent);

	// For direct imports: search all source files for the importer
	const fname = basename(file); // e.g. 'home.json'
	const needle = `/${fname}`; // ensures '/home.json' not 'old-home.json'

	const sourceFiles = await getAllSourceFiles(SRC_ROOT);
	const importers = [];

	for (const srcFile of sourceFiles) {
		const content = await readFile(srcFile, 'utf-8');
		if (!content.includes(needle)) continue;
		const match = content.match(
			new RegExp(`import\\s+(\\w+)\\s+from\\s+['"][^'"]*${esc(needle)}['"]`)
		);
		if (match) importers.push({ content, varName: match[1] });
	}

	// Can't find any importer — show all as used (no false positives)
	if (importers.length === 0) return json({ unusedKeys: [] });

	const unusedKeys = topLevelKeys.filter(
		(k) =>
			!importers.some(({ content, varName }) =>
				new RegExp(`\\b${esc(varName)}\\.${esc(k)}\\b`).test(content)
			)
	);

	return json({ unusedKeys });
}
