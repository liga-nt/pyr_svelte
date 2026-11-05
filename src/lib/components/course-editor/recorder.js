// Browser voiceover: capture the microphone, then turn whatever the browser recorded
// (WebM/Opus in Chrome and Firefox, MP4/AAC in Safari) into a small mono MP3 that plays
// on every phone. `createRecorder` takes any MediaStream, so it can be tested without a mic.
import { Mp3Encoder } from '@breezystack/lamejs';

const RATE = 44100;

/** The best recording format this browser offers. MP4/AAC first: it plays everywhere. */
export function supportedMimeType() {
	const candidates = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];
	return candidates.find((t) => globalThis.MediaRecorder?.isTypeSupported?.(t)) ?? '';
}

/** Asks for the microphone. Throws an Error with a message fit to show the user. */
export async function openMic() {
	if (!navigator.mediaDevices?.getUserMedia) {
		throw new Error('This browser cannot record audio. Try a current version of Chrome, Edge, Firefox or Safari.');
	}
	try {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: { channelCount: 1, echoCancellation: false, noiseSuppression: true, autoGainControl: false }
		});
		// Diagnostic for "recording came back silent": shows which device the browser actually
		// grabbed and whether it thinks the track is live, separate from the OS input meter.
		const track = stream.getAudioTracks()[0];
		console.log('[voiceover] mic track:', {
			label: track?.label,
			enabled: track?.enabled,
			muted: track?.muted,
			readyState: track?.readyState,
			settings: track?.getSettings?.()
		});
		return stream;
	} catch (err) {
		if (err.name === 'NotAllowedError') throw new Error('Microphone access was blocked. Allow it in the browser address bar, then try again.');
		if (err.name === 'NotFoundError') throw new Error('No microphone was found.');
		throw new Error(`Could not open the microphone: ${err.message}`);
	}
}

/**
 * Records a stream. `onLevel(0..1)` reports loudness for a meter. `stop()` resolves to the raw
 * recording as a Blob. The caller stops the stream's tracks.
 */
export function createRecorder(stream, { maxSeconds = 600, onLevel = () => {}, onLimit = () => {} } = {}) {
	const mimeType = supportedMimeType();
	const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
	const chunks = [];
	rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);

	const ctx = new AudioContext();
	console.log('[voiceover] AudioContext state:', ctx.state, 'mimeType:', rec.mimeType);
	const analyser = ctx.createAnalyser();
	analyser.fftSize = 1024;
	ctx.createMediaStreamSource(stream).connect(analyser);
	const buf = new Float32Array(analyser.fftSize);
	let raf = 0;
	let limit = 0;
	const tick = () => {
		analyser.getFloatTimeDomainData(buf);
		let sum = 0;
		for (const v of buf) sum += v * v;
		onLevel(Math.min(1, Math.sqrt(sum / buf.length) * 4));
		raf = requestAnimationFrame(tick);
	};

	return {
		mimeType: rec.mimeType,
		start() {
			rec.start(250);
			raf = requestAnimationFrame(tick);
			limit = setTimeout(() => {
				onLimit();
			}, maxSeconds * 1000);
		},
		stop() {
			return new Promise((resolve) => {
				clearTimeout(limit);
				cancelAnimationFrame(raf);
				rec.onstop = () => {
					ctx.close();
					resolve(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }));
				};
				if (rec.state !== 'inactive') rec.stop();
				else rec.onstop();
			});
		}
	};
}

/**
 * Decodes any browser-readable audio and encodes it as a mono, 96 kbps, 44.1 kHz MP3. Trims long
 * silences at each end and lifts quiet takes (never more than 4x) toward a consistent peak.
 * Returns { blob, durationSec }.
 */
export async function toMp3(input, { kbps = 96 } = {}) {
	const ctx = new AudioContext({ sampleRate: RATE });
	let decoded;
	try {
		decoded = await ctx.decodeAudioData(await input.arrayBuffer());
	} catch {
		throw new Error('That audio could not be read. Try a different file or record again.');
	} finally {
		ctx.close();
	}

	// Mono downmix
	const n = decoded.length;
	const mono = new Float32Array(n);
	for (let c = 0; c < decoded.numberOfChannels; c++) {
		const d = decoded.getChannelData(c);
		for (let i = 0; i < n; i++) mono[i] += d[i] / decoded.numberOfChannels;
	}

	// Trim silence at both ends, keeping a short pad
	const gate = 0.012;
	const pad = Math.round(0.15 * RATE);
	let first = 0;
	let last = n - 1;
	while (first < n && Math.abs(mono[first]) < gate) first++;
	while (last > first && Math.abs(mono[last]) < gate) last--;
	if (first >= last) throw new Error('That recording is silent. Check your microphone and try again.');
	const from = Math.max(0, first - pad);
	const to = Math.min(n, last + pad);

	let peak = 0;
	for (let i = from; i < to; i++) peak = Math.max(peak, Math.abs(mono[i]));
	const gain = Math.min(4, 0.89 / peak);

	const pcm = new Int16Array(to - from);
	for (let i = 0; i < pcm.length; i++) {
		pcm[i] = Math.max(-1, Math.min(1, mono[from + i] * gain)) * 0x7fff;
	}

	const encoder = new Mp3Encoder(1, RATE, kbps);
	const parts = [];
	const block = 1152 * 8;
	for (let i = 0, b = 0; i < pcm.length; i += block, b++) {
		const out = encoder.encodeBuffer(pcm.subarray(i, i + block));
		if (out.length) parts.push(out);
		if (b % 150 === 149) await new Promise((r) => setTimeout(r)); // let the page breathe on long takes
	}
	const tail = encoder.flush();
	if (tail.length) parts.push(tail);

	return { blob: new Blob(parts, { type: 'audio/mpeg' }), durationSec: pcm.length / RATE };
}
