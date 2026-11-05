// Speech-to-text on a slide's recorded voiceover, via the transcribeVoiceover Cloud Function
// (the OpenAI key stays server-side). Returns the transcript text; the caller decides whether
// and how to save it.
import { httpsCallable } from 'firebase/functions';
import { functions } from '$lib/firebase.js';

const call = httpsCallable(functions, 'transcribeVoiceover');

export async function transcribeAudio(audioPath) {
	const { data } = await call({ audioPath });
	return data.text;
}
