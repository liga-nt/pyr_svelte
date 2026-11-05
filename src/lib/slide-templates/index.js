// The slide template registry. Every folder here with a template.js and a Slide.svelte is
// picked up automatically at build time: it renders in the player, appears in the editor's
// template picker, and gets its form and validation from the definition in template.js.
// Adding a template means adding a folder. Nothing else needs to change.
const definitions = import.meta.glob('./*/template.js', { eager: true });
const components = import.meta.glob('./*/Slide.svelte', { eager: true });

export const templates = {};

for (const [path, mod] of Object.entries(definitions)) {
	const folder = path.split('/')[1];
	const component = components[`./${folder}/Slide.svelte`]?.default;
	const meta = mod.default;
	if (!component) {
		console.warn(`slide-templates/${folder} has a template.js but no Slide.svelte, so it is skipped.`);
		continue;
	}
	templates[meta.id ?? folder] = { ...meta, id: meta.id ?? folder, component };
}

export const templateList = Object.values(templates).sort(
	(a, b) => (a.order ?? 100) - (b.order ?? 100) || a.label.localeCompare(b.label)
);

export const getTemplate = (id) => templates[id];

/** A blank data object for a template: text becomes "", lines becomes [], groups nest. */
export function emptyData(id) {
	const t = templates[id];
	return t ? emptyFor(t.fields) : {};
}

function emptyFor(fields) {
	const out = {};
	for (const f of fields) {
		if (f.type === 'group') out[f.key] = emptyFor(f.fields);
		else if (f.type === 'lines' || f.type === 'list') out[f.key] = [];
		else out[f.key] = '';
	}
	return out;
}

export function isFilled(v) {
	if (v == null) return false;
	if (typeof v === 'string') return v.trim() !== '';
	if (Array.isArray(v)) return v.some(isFilled);
	if (typeof v === 'object') return Object.values(v).some(isFilled);
	return Boolean(v);
}

/**
 * Fields that hold content in `data` and do not exist (with the same type) in the target
 * template. These are what would be lost by switching. Returns their labels.
 */
export function lostFields(data, fromId, toId) {
	const from = templates[fromId];
	const to = templates[toId];
	if (!from || !to) return [];
	return from.fields
		.filter((f) => isFilled(data?.[f.key]))
		.filter((f) => !to.fields.some((tf) => tf.key === f.key && tf.type === f.type))
		.map((f) => f.label);
}

/** Data for the new template, carrying over every field whose key and type match. */
export function switchData(data, fromId, toId) {
	const to = templates[toId];
	const next = emptyData(toId);
	if (!to) return next;
	for (const f of to.fields) {
		const old = data?.[f.key];
		const oldField = templates[fromId]?.fields.find((x) => x.key === f.key);
		if (old !== undefined && oldField?.type === f.type) next[f.key] = JSON.parse(JSON.stringify(old)); /* JSON copy: `old` may be reactive state */
	}
	return next;
}

/** Trims text and drops empty optional fields, so what is saved to Firestore is tidy. */
export function cleanData(id, data) {
	const t = templates[id];
	if (!t) return data;
	const out = {};
	for (const f of t.fields) {
		const c = cleanField(f, data?.[f.key]);
		if (c !== undefined) out[f.key] = c;
	}
	return out;
}

function cleanField(f, v) {
	if (f.type === 'group') {
		const o = {};
		for (const sf of f.fields) {
			const c = cleanField(sf, v?.[sf.key]);
			if (c !== undefined) o[sf.key] = c;
		}
		return Object.keys(o).length ? o : undefined;
	}
	if (f.type === 'lines') {
		const list = (Array.isArray(v) ? v : []).map((s) => String(s).trim()).filter(Boolean);
		return list.length || f.required ? list : undefined;
	}
	if (f.type === 'list') {
		const items = (Array.isArray(v) ? v : [])
			.map((item) => {
				const o = {};
				for (const sf of f.fields) {
					const c = cleanField(sf, item?.[sf.key]);
					if (c !== undefined) o[sf.key] = c;
				}
				return o;
			})
			.filter((o) => Object.keys(o).length);
		return items.length || f.required ? items : undefined;
	}
	if (typeof v === 'string') return v.trim() || undefined;
	return v || undefined;
}

/** Errors and warnings for a whole slide: its template's rules plus the narration. */
export function validateSlide(slide) {
	const t = templates[slide?.layout];
	if (!t) return [{ level: 'error', message: `Unknown template "${slide?.layout}".` }];
	const out = [...t.validate(cleanData(slide.layout, slide.data))];
	const words = (slide.script ?? '').split(/\s+/).filter(Boolean).length;
	if (words === 0) out.push({ level: 'warning', field: 'script', message: 'No transcript yet.' });
	else if (words > 180) out.push({ level: 'warning', field: 'script', message: `Transcript is ${words} words, about ${(words / 150).toFixed(1)} minutes. Consider splitting the slide.` });
	return out;
}

/** A short label for a slide in lists. */
export function slideLabel(slide) {
	const d = slide?.data ?? {};
	return d.title || d.heading || d.stat || d.quote?.slice(0, 50) || d.alt?.slice(0, 50) || d.left?.title || 'Untitled';
}

/** Fills in any fields missing from `data`, so a form can bind to every field of the template. */
export function hydrateData(id, data) {
	const t = templates[id];
	if (!t) return data ?? {};
	return hydrateFor(t.fields, data ?? {});
}

function hydrateFor(fields, data) {
	const out = {};
	for (const f of fields) {
		const v = data[f.key];
		if (f.type === 'group') out[f.key] = hydrateFor(f.fields, v ?? {});
		else if (f.type === 'lines') out[f.key] = Array.isArray(v) ? [...v] : [];
		else if (f.type === 'list') out[f.key] = (Array.isArray(v) ? v : []).map((item) => hydrateFor(f.fields, item ?? {}));
		else out[f.key] = v ?? '';
	}
	return out;
}
