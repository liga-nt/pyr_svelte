export default {
	id: 'stat-row',
	label: 'Stat row',
	description: 'Three to five short statistics side by side, with one source shared by all of them.',
	order: 35,
	fields: [
		{ key: 'heading', label: 'Heading', type: 'text', required: true },
		{
			key: 'stats',
			label: 'Stats',
			type: 'list',
			min: 3,
			max: 5,
			itemLabel: 'Stat',
			fields: [
				{ key: 'value', label: 'Figure', type: 'text', required: true, hint: 'Just the figure, for example "50%" or "1 in 5"' },
				{ key: 'caption', label: 'What it means', type: 'textarea', required: true }
			]
		},
		{
			key: 'source',
			label: 'Source',
			type: 'text',
			required: true,
			hint: 'One citation for every stat on this slide, for example "Miller and Rollnick, 2014, as cited in SAMHSA, 2019"'
		}
	],
	sample: {
		heading: 'The difference this makes',
		stats: [
			{ value: '50%', caption: 'greater likelihood of treatment entry' },
			{ value: '60%', caption: 'higher retention in treatment' },
			{ value: '40%', caption: 'fewer days of substance use' }
		],
		source: 'Author and Author, 2020'
	},
	validate(data) {
		const out = [];
		if (!data.heading?.trim()) out.push({ level: 'error', field: 'heading', message: 'A heading is required.' });
		const stats = data.stats ?? [];
		if (stats.length < 3 || stats.length > 5) {
			out.push({ level: 'error', field: 'stats', message: `Needs 3 to 5 stats (has ${stats.length}).` });
		}
		stats.forEach((s, i) => {
			if (!s?.value?.trim()) out.push({ level: 'error', field: 'stats', message: `Stat ${i + 1} needs a figure.` });
			if (!s?.caption?.trim()) out.push({ level: 'error', field: 'stats', message: `Stat ${i + 1} needs a caption.` });
		});
		if (!data.source?.trim()) out.push({ level: 'error', field: 'source', message: 'A source is required for any statistic.' });
		return out;
	}
};
