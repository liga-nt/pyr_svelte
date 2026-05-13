import { json, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { request } from 'node:http';

function fetchPage(pageUrl) {
	return new Promise((resolve, reject) => {
		const parsed = new URL(pageUrl);
		const req = request(
			{ hostname: parsed.hostname, port: parsed.port, path: parsed.pathname + parsed.search, method: 'GET' },
			(res) => {
				// Follow one level of redirect
				if ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) && res.headers.location) {
					const redirectUrl = new URL(res.headers.location, pageUrl).href;
					return fetchPage(redirectUrl).then(resolve, reject);
				}
				if (res.statusCode !== 200) {
					res.resume();
					return reject(new Error(`HTTP ${res.statusCode}`));
				}
				let body = '';
				res.setEncoding('utf8');
				res.on('data', chunk => (body += chunk));
				res.on('end', () => resolve(body));
			}
		);
		req.on('error', reject);
		req.end();
	});
}

export async function GET({ url }) {
	if (!dev) error(403, 'Dev only');

	const route = url.searchParams.get('route') ?? '/';
	const port = url.searchParams.get('port') ?? '5173';
	const pageUrl = `http://localhost:${port}${route}`;

	try {
		const html = await fetchPage(pageUrl);
		return json(parseHtml(html, route));
	} catch (e) {
		return json({ error: e.message });
	}
}

function parseHtml(html, route) {
	const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? null;

	const meta = {};
	const metaRegex = /<meta\s+([^>]+?)(?:\s*\/)?>/gi;
	let m;
	while ((m = metaRegex.exec(html)) !== null) {
		const attrs = parseAttrs(m[1]);
		const key = attrs.name || attrs.property;
		if (key && attrs.content !== undefined) meta[key] = attrs.content;
	}

	const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
		?? html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
	const canonical = canonicalMatch?.[1] ?? null;

	const structuredData = [];
	const ldRegex = /<script\s[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
	while ((m = ldRegex.exec(html)) !== null) {
		try { structuredData.push(JSON.parse(m[1].trim())); } catch { /* malformed */ }
	}

	return { route, title, meta, canonical, structuredData };
}

function parseAttrs(str) {
	const attrs = {};
	const re = /(\w[\w:-]*)=["']([^"']*)["']/g;
	let m;
	while ((m = re.exec(str)) !== null) attrs[m[1]] = m[2];
	return attrs;
}
