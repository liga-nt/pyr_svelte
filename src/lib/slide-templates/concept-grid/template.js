// Pure data: no Svelte or $lib imports, so other tools (CE-builder) can import this file.
export default {
	id: 'concept-grid',
	label: 'Concept grid',
	description: 'A heading with 2 to 6 labeled items, each with a short description. For frameworks, domains, or risk/protective factors.',
	order: 40,
	fields: [
		{ key: 'heading', label: 'Heading', type: 'text', required: true },
		{
			key: 'items',
			label: 'Items',
			type: 'list',
			min: 2,
			max: 6,
			itemLabel: 'Item',
			fields: [
				{ key: 'label', label: 'Label', type: 'text', required: true },
				{ key: 'description', label: 'Description', type: 'textarea', required: true },
				{ key: 'source', label: 'Source', type: 'text', hint: 'Optional, if this item draws on a specific finding' }
			]
		},
		{ key: 'footer', label: 'Closing line', type: 'text', hint: 'Optional one-line synthesis' }
	],
	sample: {
		heading: 'The parts of the framework',
		items: [
			{ label: 'First part', description: 'What it covers, in one or two sentences.' },
			{ label: 'Second part', description: 'What it covers, in one or two sentences.' },
			{ label: 'Third part', description: 'What it covers, in one or two sentences.' }
		],
		footer: ''
	},
	validate(data) {
		const out = [];
		if (!data.heading?.trim()) out.push({ level: 'error', field: 'heading', message: 'A heading is required.' });
		const items = data.items ?? [];
		if (items.length < 2 || items.length > 6) {
			out.push({ level: 'error', field: 'items', message: `Needs 2 to 6 items (has ${items.length}).` });
		}
		items.forEach((it, i) => {
			if (!it?.label?.trim()) out.push({ level: 'error', field: 'items', message: `Item ${i + 1} needs a label.` });
			if (!it?.description?.trim()) out.push({ level: 'error', field: 'items', message: `Item ${i + 1} needs a description.` });
		});
		return out;
	}
};
