export default {
	id: 'comparison',
	label: 'Comparison',
	description: 'Two short columns: the approach to move away from, and the preferred one.',
	order: 60,
	fields: [
		{ key: 'heading', label: 'Heading', type: 'text' },
		{
			key: 'left',
			label: 'Left column (the approach being moved away from)',
			type: 'group',
			fields: [
				{ key: 'title', label: 'Title', type: 'text', required: true },
				{ key: 'items', label: 'Items', type: 'lines', min: 2, max: 4, hint: 'One per line' }
			]
		},
		{
			key: 'right',
			label: 'Right column (the preferred approach)',
			type: 'group',
			fields: [
				{ key: 'title', label: 'Title', type: 'text', required: true },
				{ key: 'items', label: 'Items', type: 'lines', min: 2, max: 4, hint: 'One per line' }
			]
		}
	],
	sample: {
		heading: 'Two ways to respond',
		left: { title: 'Instead of', items: ['The habit to move away from', 'Another common habit'] },
		right: { title: 'Try', items: ['The preferred approach', 'A specific alternative'] }
	},
	validate(data) {
		const out = [];
		for (const side of ['left', 'right']) {
			const col = data[side] ?? {};
			if (!col.title?.trim()) out.push({ level: 'error', field: side, message: `The ${side} column needs a title.` });
			const n = (col.items ?? []).filter((i) => i?.trim()).length;
			if (n < 2 || n > 4) out.push({ level: 'warning', field: side, message: `The ${side} column reads best with 2 to 4 items (it has ${n}).` });
		}
		return out;
	}
};
