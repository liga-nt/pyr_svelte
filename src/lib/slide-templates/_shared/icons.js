// A small shared icon library for the "icon" field available on templates that want one (for
// example takeaway, next-steps). Each icon is a list of shape descriptors (SVG tag + its
// attributes) rendered by IconBadge.svelte as real, static SVG elements. Coordinates are on a
// 24x24 grid, thin-stroke line-art in the site's own style, so it always matches
// --c-green-text exactly and stays crisp at any size, unlike a raster image.
//
// Straight segments (lightbulb's stem and base, every progress bar, calendar's header/tabs) are
// written as `path d="M x1 y1L x2 y2"` rather than `<line>` — purely a style choice, both work.
// The real, now-fixed bug that made them invisible was IconBadge's gradient using
// objectBoundingBox units (the SVG default), which is undefined/unpainted for a shape whose own
// bounding box has zero width or height, exactly what a perfectly horizontal or vertical
// straight line has. See the comment on the <linearGradient> in IconBadge.svelte.
export const icons = {
	lightbulb: {
		label: 'Idea',
		shapes: [
			{ tag: 'circle', cx: 12, cy: 10, r: 5.5 },
			{ tag: 'path', d: 'M12 15.5L12 18' },
			{ tag: 'path', d: 'M9.5 20L14.5 20' },
			{ tag: 'path', d: 'M9.5 22L14.5 22' }
		]
	},
	compass: {
		label: 'Direction',
		shapes: [
			{ tag: 'circle', cx: 12, cy: 12, r: 8.5 },
			{ tag: 'polygon', points: '14.5,9.5 13,13 9.5,14.5 11,11', fill: 'currentColor', stroke: 'currentColor', 'stroke-width': 0.5 }
		]
	},
	target: {
		label: 'Goal',
		shapes: [
			{ tag: 'circle', cx: 12, cy: 12, r: 8.5 },
			{ tag: 'circle', cx: 12, cy: 12, r: 5 },
			{ tag: 'circle', cx: 12, cy: 12, r: 1.5, fill: 'currentColor', stroke: 'none' }
		]
	},
	heart: {
		label: 'Care',
		shapes: [
			{ tag: 'path', d: 'M12 19.5C8 16.5 4 13 4 8.8 4 6.1 6.1 4 8.7 4c1.4 0 2.7.7 3.3 1.8.6-1.1 1.9-1.8 3.3-1.8C17.9 4 20 6.1 20 8.8c0 4.2-4 7.7-8 10.7Z' }
		]
	},
	spark: {
		label: 'Highlight',
		shapes: [
			{ tag: 'circle', cx: 12, cy: 12, r: 2.25 },
			{ tag: 'path', d: 'M12 3L12 7' },
			{ tag: 'path', d: 'M12 17L12 21' },
			{ tag: 'path', d: 'M3 12L7 12' },
			{ tag: 'path', d: 'M17 12L21 12' },
			{ tag: 'path', d: 'M5.6 5.6L8.4 8.4' },
			{ tag: 'path', d: 'M15.6 15.6L18.4 18.4' },
			{ tag: 'path', d: 'M18.4 5.6L15.6 8.4' },
			{ tag: 'path', d: 'M8.4 15.6L5.6 18.4' }
		]
	},
	milestone: {
		label: 'Milestone',
		shapes: [
			{ tag: 'path', d: 'M3 19h18' },
			{ tag: 'path', d: 'M5 19l5-9 3 5 2-3 4 7' },
			{ tag: 'path', d: 'M10 10V5' }
		]
	},
	progress: {
		label: 'Progress',
		shapes: [
			{ tag: 'path', d: 'M6 20L6 15' },
			{ tag: 'path', d: 'M12 20L12 10' },
			{ tag: 'path', d: 'M18 20L18 6' }
		]
	},
	shield: {
		label: 'Safety',
		shapes: [
			{ tag: 'path', d: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z' },
			{ tag: 'path', d: 'M9 12l2 2 4-4' }
		]
	},
	calendar: {
		label: 'Schedule',
		shapes: [
			{ tag: 'rect', x: 4, y: 5, width: 16, height: 15, rx: 2 },
			{ tag: 'path', d: 'M4 10L20 10' },
			{ tag: 'path', d: 'M8 3L8 7' },
			{ tag: 'path', d: 'M16 3L16 7' }
		]
	},
	leaf: {
		label: 'Growth',
		shapes: [
			{ tag: 'path', d: 'M6 20c0-7 4-13 12-14-1 8-5 14-12 14Z' },
			{ tag: 'path', d: 'M7.5 18.5c2.5-2.5 5-6 7-10' }
		]
	}
};

export const iconIds = Object.keys(icons);

/** {value, label} pairs, the shape FieldForm's "select" field type expects. */
export const iconOptions = iconIds.map((id) => ({ value: id, label: icons[id].label }));
