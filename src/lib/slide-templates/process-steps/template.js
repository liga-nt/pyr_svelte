// Pure data: no Svelte or $lib imports, so other tools (CE-builder) can import this file.
export default {
	id: 'process-steps',
	label: 'Process steps',
	description: 'A heading with 2 to 6 numbered steps, each with a short description. For clinical protocols or assessment sequences.',
	order: 65,
	fields: [
		{ key: 'heading', label: 'Heading', type: 'text', required: true },
		{
			key: 'prompt',
			label: 'Lead-in sentence',
			type: 'text',
			hint: 'Optional, for example a caveat about the framework'
		},
		{
			key: 'steps',
			label: 'Steps',
			type: 'list',
			min: 2,
			max: 6,
			itemLabel: 'Step',
			fields: [
				{ key: 'label', label: 'Label', type: 'text', required: true },
				{ key: 'description', label: 'Description', type: 'text', required: true }
			]
		},
		{
			key: 'flow',
			label: 'Flow summary',
			type: 'lines',
			hint: 'Optional short chain summarizing the progression, one stage per line, for example "Impulse", "Awareness", "Intention"'
		}
	],
	sample: {
		heading: 'The steps',
		prompt: '',
		steps: [
			{ label: 'First', description: 'What to do first.' },
			{ label: 'Second', description: 'What to do next.' },
			{ label: 'Third', description: 'What to do last.' }
		],
		flow: []
	},
	validate(data) {
		const out = [];
		if (!data.heading?.trim()) out.push({ level: 'error', field: 'heading', message: 'A heading is required.' });
		const steps = data.steps ?? [];
		if (steps.length < 2 || steps.length > 6) {
			out.push({ level: 'error', field: 'steps', message: `Needs 2 to 6 steps (has ${steps.length}).` });
		}
		steps.forEach((s, i) => {
			if (!s?.label?.trim()) out.push({ level: 'error', field: 'steps', message: `Step ${i + 1} needs a label.` });
			if (!s?.description?.trim()) out.push({ level: 'error', field: 'steps', message: `Step ${i + 1} needs a description.` });
		});
		return out;
	}
};
