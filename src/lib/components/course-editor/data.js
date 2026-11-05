// Firestore operations for editing a slideshow module. Every change is a transaction that
// re-reads the course and changes only the target module, so it cannot overwrite a save made
// elsewhere (for example from the main course editor) in the meantime.
import { doc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '$lib/firebase.js';

/** Firestore rejects `undefined`; a JSON round trip strips it. */
const plain = (v) => JSON.parse(JSON.stringify(v));

export async function loadModule(courseId, moduleId) {
	const snap = await getDoc(doc(db, 'courses', courseId));
	if (!snap.exists()) throw new Error('That course does not exist.');
	const course = { id: snap.id, ...snap.data() };
	const module = (course.modules ?? []).find((m) => m.id === moduleId && m.type === 'slideshow');
	if (!module) throw new Error('That slideshow module was not found in the course.');
	return { course, module };
}

/**
 * Applies `change(slides)` to one module's slides inside a transaction and returns the new
 * slides. Refuses if the course has been published, since a live CE course must not change.
 */
export async function updateSlides(courseId, moduleId, change) {
	return runTransaction(db, async (tx) => {
		const ref = doc(db, 'courses', courseId);
		const snap = await tx.get(ref);
		if (!snap.exists()) throw new Error('That course does not exist.');
		const course = snap.data();
		if (course.published) throw new Error('This course is published. Unpublish it before changing slides.');
		let updated;
		const modules = (course.modules ?? []).map((m) => {
			if (m.id !== moduleId) return m;
			updated = plain(change(structuredClone(m.slides ?? [])));
			return { ...m, slides: updated };
		});
		if (!updated) throw new Error('That slideshow module was not found in the course.');
		tx.update(ref, { modules, updatedAt: serverTimestamp() });
		return updated;
	});
}

export const saveSlide = (courseId, moduleId, slide) =>
	updateSlides(courseId, moduleId, (slides) => slides.map((s) => (s.id === slide.id ? slide : s)));

export const addSlide = (courseId, moduleId, slide, afterId) =>
	updateSlides(courseId, moduleId, (slides) => {
		const at = afterId ? slides.findIndex((s) => s.id === afterId) + 1 : slides.length;
		slides.splice(at, 0, slide);
		return slides;
	});

export const deleteSlide = (courseId, moduleId, id) =>
	updateSlides(courseId, moduleId, (slides) => slides.filter((s) => s.id !== id));

export const moveSlide = (courseId, moduleId, id, dir) =>
	updateSlides(courseId, moduleId, (slides) => {
		const i = slides.findIndex((s) => s.id === id);
		const j = i + dir;
		if (i < 0 || j < 0 || j >= slides.length) return slides;
		[slides[i], slides[j]] = [slides[j], slides[i]];
		return slides;
	});

/** The next free slide id, "s17" style. */
export function nextSlideId(slides) {
	const nums = slides.map((s) => Number(/^s(\d+)$/.exec(s.id)?.[1] ?? 0));
	return `s${Math.max(0, ...nums) + 1}`;
}
