export default {
	id: 'key-points',
	label: 'Key points',
	description: 'A heading with three to five short points.',
	order: 20,
	fields: [
		{ key: 'heading', label: 'Heading', type: 'text', required: true },
		{ key: 'points', label: 'Points', type: 'lines', required: true, min: 3, max: 5, hint: 'One per line. Keep each to one idea.' }
	],
	sample: { heading: 'The main ideas', points: ['One idea per point', 'Short enough to read while listening', 'Three to five points'] },
	validate(data) {
		const out = [];
		const n = (data.points ?? []).filter((p) => p?.trim()).length;
		if (!data.heading?.trim()) out.push({ level: 'error', field: 'heading', message: 'A heading is required.' });
		if (n < 3 || n > 5) out.push({ level: 'error', field: 'points', message: `Use 3 to 5 points (there ${n === 1 ? 'is' : 'are'} ${n}).` });
		return out;
	}
};
