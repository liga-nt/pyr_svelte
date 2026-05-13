import { json, error } from '@sveltejs/kit';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { dev } from '$app/environment';

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
	const files = await collectJsonFiles('src/lib/content');
	return json(files.sort());
}
