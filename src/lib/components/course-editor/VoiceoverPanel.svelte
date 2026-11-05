<script>
	// Record, review, save and re-record a slide's voiceover. Talk through the slide in your own
	// words from your notes below; you don't read anything verbatim. Once a take is saved, use
	// "Create transcript" (next to the transcript field) to turn it into what learners read.
	import { onDestroy } from 'svelte';
	import { openMic, createRecorder, toMp3 } from './recorder.js';
	import { saveRecording, removeRecording } from './voiceover.js';

	let { slide, courseId, moduleId, blockedReason = '', onchange } = $props();

	let phase = $state('idle'); // idle | countdown | recording | processing | review | saving
	let count = $state(3);
	let elapsed = $state(0);
	let level = $state(0);
	let take = $state(null); // { blob, url, durationSec }
	let error = $state('');
	let confirmRemove = $state(false);

	let stream;
	let recorder;
	let timer;
	let stopped = false;

	const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
	const hasAudio = $derived(Boolean(slide?.audioUrl));
	const busy = $derived(phase !== 'idle');

	function cleanupMic() {
		clearInterval(timer);
		stream?.getTracks().forEach((t) => t.stop());
		stream = null;
		recorder = null;
	}

	function discard() {
		if (take?.url) URL.revokeObjectURL(take.url);
		take = null;
		phase = 'idle';
		error = '';
	}

	async function start() {
		error = '';
		stopped = false;
		try {
			stream = await openMic();
		} catch (err) {
			error = err.message;
			return;
		}
		phase = 'countdown';
		for (count = 3; count > 0; count--) {
			await new Promise((r) => setTimeout(r, 800));
			if (phase !== 'countdown') return; // cancelled
		}
		recorder = createRecorder(stream, { onLevel: (l) => (level = l), onLimit: stop });
		recorder.start();
		elapsed = 0;
		const t0 = performance.now();
		timer = setInterval(() => (elapsed = (performance.now() - t0) / 1000), 200);
		phase = 'recording';
	}

	async function stop() {
		if (stopped || !recorder) return;
		stopped = true;
		phase = 'processing';
		const rec = recorder;
		clearInterval(timer);
		try {
			const raw = await rec.stop();
			cleanupMic();
			await makeTake(raw);
		} catch (err) {
			cleanupMic();
			error = err.message;
			phase = 'idle';
		}
	}

	function cancel() {
		stopped = true;
		cleanupMic();
		phase = 'idle';
	}

	async function makeTake(input) {
		phase = 'processing';
		try {
			const { blob, durationSec } = await toMp3(input);
			take = { blob, durationSec, url: URL.createObjectURL(blob) };
			phase = 'review';
		} catch (err) {
			error = err.message;
			phase = 'idle';
		}
	}

	async function onFile(e) {
		const file = e.currentTarget.files?.[0];
		e.currentTarget.value = '';
		if (!file) return;
		error = '';
		await makeTake(file);
	}

	async function useTake() {
		phase = 'saving';
		error = '';
		try {
			const slides = await saveRecording({ courseId, moduleId, slide, mp3: take.blob, durationSec: take.durationSec });
			discard();
			onchange(slides);
		} catch (err) {
			error = err.message;
			phase = 'review';
		}
	}

	async function remove() {
		confirmRemove = false;
		error = '';
		try {
			onchange(await removeRecording({ courseId, moduleId, slide }));
		} catch (err) {
			error = err.message;
		}
	}

	onDestroy(() => {
		cleanupMic();
		if (take?.url) URL.revokeObjectURL(take.url);
	});
</script>

<section class="voice" aria-label="Voiceover">
	<h3>Voiceover</h3>

	{#if hasAudio && phase === 'idle'}
		<div class="current">
			<span class="label">
				Current recording
				{#if slide.audioDurationSec}({fmt(slide.audioDurationSec)}){/if}
			</span>
			<audio controls src={slide.audioUrl} preload="none"></audio>
		</div>
	{:else if !hasAudio && phase === 'idle'}
		<p class="hint">No recording yet. Until there is one, this slide plays on a reading timer.</p>
	{/if}

	{#if phase === 'idle'}
		{#if blockedReason}
			<p class="hint" role="status">{blockedReason}</p>
		{/if}
		<div class="row">
			<button type="button" class="primary" disabled={Boolean(blockedReason)} onclick={start}>
				{hasAudio ? 'Re-record' : 'Record voiceover'}
			</button>
			<label class="upload" class:disabled={Boolean(blockedReason)}>
				<span>Upload an audio file instead</span>
				<input type="file" accept="audio/*" disabled={Boolean(blockedReason)} onchange={onFile} />
			</label>
			{#if hasAudio}
				{#if confirmRemove}
					<button type="button" class="danger" onclick={remove}>Remove recording?</button>
					<button type="button" onclick={() => (confirmRemove = false)}>Keep</button>
				{:else}
					<button type="button" disabled={Boolean(blockedReason)} onclick={() => (confirmRemove = true)}>Remove recording</button>
				{/if}
			{/if}
		</div>
	{/if}

	{#if phase === 'countdown' || phase === 'recording'}
		<div class="stage" role="status" aria-live="polite">
			{#if phase === 'countdown'}
				<div class="count">{count}</div>
				<p class="hint">Get ready to talk through this slide in your own words.</p>
				<button type="button" onclick={cancel}>Cancel</button>
			{:else}
				<div class="live">
					<span class="dot" aria-hidden="true"></span>
					<strong>Recording {fmt(elapsed)}</strong>
					<span class="meter" aria-hidden="true"><span style="width: {Math.round(level * 100)}%"></span></span>
				</div>
				<div class="row">
					<button type="button" class="primary" onclick={stop}>Stop</button>
					<button type="button" onclick={cancel}>Cancel</button>
				</div>
			{/if}
			{#if (slide.notes ?? '').trim()}
				<div class="script" aria-label="Your notes">
					{#each slide.notes.split(/\n{2,}/) as para}<p>{para}</p>{/each}
				</div>
			{/if}
		</div>
	{/if}

	{#if phase === 'processing'}
		<p class="hint" role="status">Preparing the recording…</p>
	{/if}

	{#if phase === 'review' || phase === 'saving'}
		<div class="review">
			<span class="label">Listen back ({fmt(take.durationSec)})</span>
			<audio controls src={take.url}></audio>
			<div class="row">
				<button type="button" class="primary" disabled={phase === 'saving'} onclick={useTake}>{phase === 'saving' ? 'Saving…' : 'Use this take'}</button>
				<button type="button" disabled={phase === 'saving'} onclick={() => { discard(); start(); }}>Record again</button>
				<button type="button" disabled={phase === 'saving'} onclick={discard}>Discard</button>
			</div>
		</div>
	{/if}

	{#if error}<p class="error" role="alert">{error}</p>{/if}
</section>

<style>
	.voice { border: 1px solid #e8e4ee; border-radius: 8px; padding: 1rem 1.1rem; background: #fafafa; display: flex; flex-direction: column; gap: 0.75rem; }
	h3 { margin: 0; font-size: 1.05rem; }
	.current, .review { display: flex; flex-direction: column; gap: 0.5rem; }
	audio { width: 100%; }
	.label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--c-text-muted, #666); }
	.hint { margin: 0; font-size: 0.875rem; color: var(--c-text-muted, #666); }
	.error { margin: 0; color: #8a1f1f; font-size: 0.9rem; }
	.row { display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center; }
	.primary { min-height: 44px; }
	.danger { border-color: #b25050; color: #8a1f1f; }
	.upload { font-size: 0.875rem; display: flex; flex-direction: column; gap: 0.2rem; }
	.upload.disabled { opacity: 0.5; }
	.stage { display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-start; }
	.count { font-family: orpheuspro, serif; font-weight: 700; font-size: 4rem; line-height: 1; }
	.live { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
	.dot { width: 12px; height: 12px; border-radius: 50%; background: #c0392b; animation: pulse 1s ease-in-out infinite; }
	@keyframes pulse { 50% { opacity: 0.35; } }
	@media (prefers-reduced-motion: reduce) { .dot { animation: none; } }
	.meter { width: 140px; height: 8px; border-radius: 4px; background: #e6e6e6; overflow: hidden; }
	.meter span { display: block; height: 100%; background: var(--c-green); transition: width 0.08s; }
	.script { max-height: 260px; overflow-y: auto; background: #fff; border: 1px solid #e8e4ee; border-radius: 8px; padding: 1rem 1.25rem; align-self: stretch; }
	.script p { font-size: 1.3rem; line-height: 1.7; margin: 0 0 0.9rem; }
	.script p:last-child { margin-bottom: 0; }
	button:disabled { opacity: 0.55; cursor: default; }
	button:focus-visible { outline: 2px solid var(--c-dark); outline-offset: 2px; }
</style>
