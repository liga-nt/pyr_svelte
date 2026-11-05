export default {
	id: 'references',
	label: 'References',
	description: 'A numbered list of citations, usually the last slide.',
	order: 90,
	fields: [
		{ key: 'heading', label: 'Heading', type: 'text' },
		{ key: 'citations', label: 'Citations', type: 'lines', required: true, hint: 'One citation per line' },
		{ key: 'note', label: 'Note', type: 'text', hint: 'For example an approval or disclosure line' }
	],
	sample: { heading: 'References', citations: ['Author, A. (2020). Title of the work. Journal, 1(2), 3-4.'] },
	validate(data) {
		const out = [];
		if (!(data.citations ?? []).some((c) => c?.trim())) out.push({ level: 'error', field: 'citations', message: 'Add at least one citation.' });
		return out;
	}
};
