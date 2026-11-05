export default {
	id: 'takeaway',
	label: 'Key takeaway',
	description: 'A reflection prompt and its answer: the single biggest insight to take forward.',
	order: 70,
	fields: [
		{ key: 'heading', label: 'Heading', type: 'text', required: true },
		{
			key: 'prompt',
			label: 'Lead-in sentence',
			type: 'text',
			required: true,
			hint: 'For example "One key insight I’m taking forward from this experience is…"'
		},
		{ key: 'takeaway', label: 'The takeaway', type: 'textarea', required: true },
		{ key: 'source', label: 'Source', type: 'text', hint: 'Optional, if this insight draws on a specific finding' }
	],
	sample: {
		heading: 'My biggest learning',
		prompt: 'One key insight I’m taking forward from this experience is…',
		takeaway: 'Insert your key takeaway or lesson here.',
		source: 'Author, 2020'
	},
	validate(data) {
		const out = [];
		if (!data.heading?.trim()) out.push({ level: 'error', field: 'heading', message: 'A heading is required.' });
		if (!data.prompt?.trim()) out.push({ level: 'error', field: 'prompt', message: 'A lead-in sentence is required.' });
		if (!data.takeaway?.trim()) out.push({ level: 'error', field: 'takeaway', message: 'The takeaway is required.' });
		return out;
	}
};
