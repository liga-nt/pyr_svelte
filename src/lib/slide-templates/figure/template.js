export default {
	id: 'figure',
	label: 'Figure',
	description: 'An image with a caption. Alt text is required.',
	order: 50,
	fields: [
		{ key: 'heading', label: 'Heading', type: 'text' },
		{ key: 'src', label: 'Image', type: 'image', hint: 'Upload a picture, or leave empty until it is made.' },
		{ key: 'alt', label: 'Alt text', type: 'textarea', required: true, hint: 'Describe the figure so a listener who cannot see it understands it.' },
		{ key: 'caption', label: 'Caption', type: 'text' }
	],
	sample: { heading: 'A figure', alt: 'Description of the figure for someone who cannot see it.', caption: 'What the figure shows.' },
	validate(data) {
		const out = [];
		if (!data.alt?.trim()) out.push({ level: 'error', field: 'alt', message: 'Alt text is required.' });
		if (!data.src) out.push({ level: 'warning', field: 'src', message: 'No image yet. Learners will see an empty placeholder.' });
		return out;
	}
};
