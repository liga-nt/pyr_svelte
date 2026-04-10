export const prerender = true;

const articles = import.meta.glob('/src/lib/content/articles/*.json', { eager: true });

export function entries() {
	return Object.keys(articles).map((path) => ({
		slug: path.split('/').pop().replace('.json', '')
	}));
}

export function load({ params }) {
	const mod = articles[`/src/lib/content/articles/${params.slug}.json`];
	if (!mod) return { article: null };
	return { article: mod.default };
}
