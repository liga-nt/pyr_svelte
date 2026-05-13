import { json, error } from '@sveltejs/kit';
import { readdir, readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { dev } from '$app/environment';

const CONTENT_ROOT = resolve('src/lib/content');

async function collectJsonFiles(dir, rel = '') {
	const results = [];
	const entries = await readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const relPath = rel ? `${rel}/${entry.name}` : entry.name;
		if (entry.isDirectory()) {
			results.push(...(await collectJsonFiles(join(dir, entry.name), relPath)));
		} else if (entry.name.endsWith('.json')) {
			results.push(relPath);
		}
	}
	return results;
}

export async function GET() {
	if (!dev) error(403, 'Dev only');
	const files = await collectJsonFiles(CONTENT_ROOT);
	const result = {};
	await Promise.all(
		files.map(async (file) => {
			try {
				const raw = await readFile(join(CONTENT_ROOT, file), 'utf-8');
				const data = JSON.parse(raw);
				result[file] = data._reviewed === true;
			} catch {
				result[file] = false;
			}
		})
	);
	return json(result);
}
