import { json, error } from '@sveltejs/kit';
import { readFile, writeFile } from 'fs/promises';
import { join, resolve, normalize } from 'path';
import { dev } from '$app/environment';

const CONTENT_ROOT = resolve('src/lib/content');

function safePath(file) {
	if (!file) error(400, 'Missing file parameter');
	const abs = resolve(join(CONTENT_ROOT, normalize(file)));
	if (!abs.startsWith(CONTENT_ROOT + '/') && abs !== CONTENT_ROOT) error(400, 'Invalid path');
	if (!abs.endsWith('.json')) error(400, 'Must be a JSON file');
	return abs;
}

export async function GET({ url }) {
	if (!dev) error(403, 'Dev only');
	const path = safePath(url.searchParams.get('file'));
	const raw = await readFile(path, 'utf-8');
	return json(JSON.parse(raw));
}

export async function PUT({ request, url }) {
	if (!dev) error(403, 'Dev only');
	const path = safePath(url.searchParams.get('file'));
	const body = await request.json();
	await writeFile(path, JSON.stringify(body, null, 2) + '\n');
	return json({ ok: true });
}
