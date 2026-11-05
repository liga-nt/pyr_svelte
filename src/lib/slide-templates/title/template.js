// Pure data: no Svelte or $lib imports, so other tools (CE-builder) can import this file.
export default {
	id: 'title',
	label: 'Title',
	description: 'Opens a module: title, subtitle and credit line.',
	order: 10,
	fields: [
		{ key: 'title', label: 'Title', type: 'text', required: true },
		{ key: 'eyebrow', label: 'Small label above the title', type: 'text', hint: 'For example "Module 1"' },
		{ key: 'subtitle', label: 'Subtitle', type: 'text' },
		{ key: 'credits', label: 'Credit line', type: 'text', hint: 'For example "1.5 CE contact hours"' },
		{ key: 'accent', label: 'Accent color', type: 'select', options: ['green', 'purple', 'yellow', 'blue', 'gray'] }
	],
	sample: { eyebrow: 'Module 1', title: 'A clear title for the module', subtitle: 'One line on what it covers', credits: '1 CE contact hour' },
	validate(data) {
		const out = [];
		if (!data.title?.trim()) out.push({ level: 'error', field: 'title', message: 'A title is required.' });
		return out;
	}
};
