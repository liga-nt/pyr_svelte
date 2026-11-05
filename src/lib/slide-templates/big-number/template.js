export default {
	id: 'big-number',
	label: 'Big number',
	description: 'One statistic, large, with a caption and a source.',
	order: 30,
	fields: [
		{ key: 'stat', label: 'The figure', type: 'text', required: true, hint: 'Just the figure, for example "1 in 5" or "68"' },
		{ key: 'unit', label: 'Unit', type: 'text', hint: 'For example "percent"' },
		{ key: 'caption', label: 'What it means', type: 'textarea' },
		{ key: 'source', label: 'Source', type: 'text', required: true, hint: 'Every statistic needs a citation, for example "Author and Author, 2014"' },
		{ key: 'accent', label: 'Accent color', type: 'select', options: ['green', 'purple', 'yellow', 'blue', 'gray'] }
	],
	sample: { stat: '68', unit: 'percent', caption: 'What the number means, in a sentence.', source: 'Author, 2020' },
	validate(data) {
		const out = [];
		if (!data.stat?.trim()) out.push({ level: 'error', field: 'stat', message: 'The figure is required.' });
		if (!data.source?.trim()) out.push({ level: 'error', field: 'source', message: 'A source is required for any statistic.' });
		return out;
	}
};
