export default {
	id: 'next-steps',
	label: 'Next steps',
	description: '2 to 4 concrete actions the learner can commit to, numbered.',
	order: 75,
	fields: [
		{ key: 'heading', label: 'Heading', type: 'text', required: true },
		{
			key: 'prompt',
			label: 'Lead-in sentence',
			type: 'text',
			required: true,
			hint: 'For example "My next steps are…"'
		},
		{ key: 'steps', label: 'Steps', type: 'lines', min: 2, max: 4, hint: 'One short, concrete action per line' }
	],
	sample: {
		heading: 'What I want to do next',
		prompt: 'My next steps are…',
		steps: ['What I will do or focus on.', 'What I will do or focus on.', 'What I will do or focus on.']
	},
	validate(data) {
		const out = [];
		if (!data.heading?.trim()) out.push({ level: 'error', field: 'heading', message: 'A heading is required.' });
		if (!data.prompt?.trim()) out.push({ level: 'error', field: 'prompt', message: 'A lead-in sentence is required.' });
		const n = (data.steps ?? []).filter((s) => s?.trim()).length;
		if (n < 2 || n > 4) out.push({ level: 'warning', field: 'steps', message: `Needs 2 to 4 steps (has ${n}).` });
		return out;
	}
};
