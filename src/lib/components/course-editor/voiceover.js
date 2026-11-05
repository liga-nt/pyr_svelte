// Saving and removing a slide's recording: the MP3 goes to Firebase Storage, and the slide
// in Firestore gets a fresh audioVersion so the editor can tell when a transcript no longer
// matches the current recording (audioVersion !== transcribedVersion).
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '$lib/firebase.js';
import { uploadToStorage } from './storage-upload.js';
import { updateSlides } from './data.js';

const AUDIO_FIELDS = ['audioUrl', 'audioPath', 'audioDurationSec', 'audioVersion', 'transcribedVersion'];

/** Uploads `mp3` and points the slide at it. Returns the updated slides. */
export async function saveRecording({ courseId, moduleId, slide, mp3, durationSec }) {
	const audioVersion = crypto.randomUUID();
	const path = `ce-audio/${courseId}/${slide.id}.${audioVersion.slice(0, 8)}-${Date.now().toString(36)}.mp3`;
	const { url: audioUrl } = await uploadToStorage(path, mp3, 'audio/mpeg');
	const previous = slide.audioPath;
	const slides = await updateSlides(courseId, moduleId, (all) =>
		all.map((s) =>
			s.id === slide.id
				? { ...s, audioUrl, audioPath: path, audioDurationSec: Math.round(durationSec * 10) / 10, audioVersion }
				: s
		)
	);
	if (previous && previous !== path) deleteObject(ref(storage, previous)).catch(() => {});
	return slides;
}

/** Clears a slide's recording and deletes the stored file. */
export async function removeRecording({ courseId, moduleId, slide }) {
	const slides = await updateSlides(courseId, moduleId, (all) =>
		all.map((s) => {
			if (s.id !== slide.id) return s;
			const clean = { ...s };
			for (const k of AUDIO_FIELDS) delete clean[k];
			return clean;
		})
	);
	if (slide.audioPath) deleteObject(ref(storage, slide.audioPath)).catch(() => {});
	return slides;
}
