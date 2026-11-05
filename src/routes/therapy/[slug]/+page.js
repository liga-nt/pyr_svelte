import suburbs from '$lib/content/locations/suburbs.json';

export const prerender = true;

export function entries() {
	return suburbs.map((s) => ({ slug: s.slug }));
}
