export default {
	id: 'quote',
	label: 'Quote or vignette',
	description: 'A short quotation or a case vignette on a green rule.',
	order: 40,
	fields: [
		{ key: 'quote', label: 'Text', type: 'textarea', required: true },
		{ key: 'eyebrow', label: 'Label', type: 'text', hint: 'Label an invented vignette "Illustrative example"' },
		{ key: 'attribution', label: 'Attribution', type: 'text' }
	],
	sample: { eyebrow: 'Illustrative example', quote: 'A short quotation or case vignette goes here.', attribution: 'Source or speaker' },
	validate(data) {
		const out = [];
		if (!data.quote?.trim()) out.push({ level: 'error', field: 'quote', message: 'The text is required.' });
		return out;
	}
};
