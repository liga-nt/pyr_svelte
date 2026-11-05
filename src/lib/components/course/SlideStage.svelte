<script>
	// Full-screen slideshow. It plays itself: each slide's narration starts automatically and
	// the next slide follows when it ends. Slides with no recording are shown for a reading
	// time instead. Controls are small and fade away while playing.
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import SlideView from '$lib/slide-templates/SlideView.svelte';
	import { fitToStage } from '$lib/slide-templates/fit-to-stage.js';

	let { slides = [], canSkip = false, onfinish = () => {}, onexit = () => {} } = $props();

	let index = $state(0);
	let playing = $state(true);
	let blocked = $state(false); // the browser refused to start audio
	let showText = $state(false);
	let frac = $state(0); // progress through the current slide, 0 to 1
	let controlsShown = $state(true);
	let fullscreen = $state(false);
	let device = $state(''); // admin preview: '' | 'portrait' (390 x 844) | 'landscape' (844 x 390)
	let audioEl = $state();

	const slide = $derived(slides[index]);
	const last = $derived(index === slides.length - 1);
	const hasAudio = $derived(Boolean(slide?.audioUrl));
	const paragraphs = $derived((slide?.script ?? '').split(/\n{2,}/).filter(Boolean));
	const words = $derived((slide?.script ?? '').split(/\s+/).filter(Boolean).length);
	const readMs = $derived(Math.max(5, Math.round(words / 2.5)) * 1000);
	const overall = $derived(slides.length ? (index + frac) / slides.length : 0);
	const reduceMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	let hideTimer;
	let advanceTimer;
	let elapsed = 0;

	function go(i) {
		clearTimeout(advanceTimer);
		index = i;
		frac = 0;
		elapsed = 0;
		blocked = false;
	}

	function advance() {
		if (last) onfinish();
		else go(index + 1);
	}

	function wake() {
		controlsShown = true;
		clearTimeout(hideTimer);
		hideTimer = setTimeout(() => (controlsShown = false), 2800);
	}

	async function startAudio() {
		if (!audioEl || !playing) return;
		try {
			await audioEl.play();
			blocked = false;
		} catch {
			blocked = true; /* autoplay was refused; the learner taps to continue */
		}
	}

	function toggle() {
		playing = !playing;
		if (hasAudio && audioEl) {
			if (playing) startAudio();
			else audioEl.pause();
		}
		wake();
	}

	function resumeFromTap() {
		playing = true;
		startAudio();
	}

	function onEnded() {
		frac = 1;
		// A short beat between slides, so the change is not abrupt.
		advanceTimer = setTimeout(advance, 700);
	}

	// Slides without audio advance on a reading-time timer.
	$effect(() => {
		index;
		if (hasAudio || !playing || blocked) return;
		// Real elapsed time, not a tick count, so a throttled or background tab stays on schedule.
		let last = performance.now();
		const id = setInterval(() => {
			const now = performance.now();
			elapsed += now - last;
			last = now;
			frac = Math.min(1, elapsed / readMs);
			if (elapsed >= readMs) {
				clearInterval(id);
				advanceTimer = setTimeout(advance, 400);
			}
		}, 100);
		return () => clearInterval(id);
	});

	function toggleFullscreen() {
		if (document.fullscreenElement) document.exitFullscreen();
		else document.documentElement.requestFullscreen?.().catch(() => {});
	}

	function onKey(e) {
		if (e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
		if (e.key === ' ' && e.target === document.body) { e.preventDefault(); toggle(); }
		else if (e.key === 'ArrowLeft' && index > 0) go(index - 1);
		else if (e.key === 'ArrowRight' && canSkip && !last) go(index + 1);
		wake();
	}

	onMount(() => {
		wake();
		const onFs = () => (fullscreen = Boolean(document.fullscreenElement));
		document.addEventListener('fullscreenchange', onFs);
		return () => {
			document.removeEventListener('fullscreenchange', onFs);
			clearTimeout(hideTimer);
			clearTimeout(advanceTimer);
		};
	});
</script>

<svelte:window onkeydown={onKey} />

<div
	class="stage"
	class:device={device !== ''}
	class:portrait={device === 'portrait'}
	role="region"
	aria-label="Course slides"
	onpointermove={wake}
	onpointerdown={wake}
	onfocusin={wake}
>
	<div class="progress" role="progressbar" aria-label="Progress through this module" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(overall * 100)}>
		<div class="fill" style="width: {overall * 100}%"></div>
	</div>

	<div class="content" class:withText={showText && paragraphs.length > 0}>
		{#key index}
			<div class="slidewrap" use:fitToStage in:fade={{ duration: reduceMotion ? 0 : 300 }}>
				<SlideView {slide} />
			</div>
		{/key}
	</div>

	{#if hasAudio}
		{#key index}
			<audio
				bind:this={audioEl}
				src={slide.audioUrl}
				preload="auto"
				oncanplay={startAudio}
				ontimeupdate={() => audioEl?.duration && (frac = audioEl.currentTime / audioEl.duration)}
				onended={onEnded}
			></audio>
		{/key}
	{/if}

	{#if blocked}
		<button type="button" class="tap" onclick={resumeFromTap}>
			<span>Tap to continue</span>
		</button>
	{/if}

	{#if showText && paragraphs.length}
		<div class="captions" role="region" aria-label="Transcript of this slide">
			{#each paragraphs as para}<p>{para}</p>{/each}
		</div>
	{/if}

	<div class="chrome" class:hidden={!controlsShown && playing && !showText}>
		<button type="button" class="icon exit" aria-label="Leave the course" onclick={onexit}>
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
		</button>

		<div class="bar" role="group" aria-label="Playback">
			<button type="button" class="icon" aria-label="Previous slide" disabled={index === 0} onclick={() => go(index - 1)}>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
			</button>
			<button type="button" class="icon main" aria-label={playing ? 'Pause' : 'Play'} onclick={toggle}>
				{#if playing}
					<svg viewBox="0 0 24 24" aria-hidden="true" class="solid"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
				{:else}
					<svg viewBox="0 0 24 24" aria-hidden="true" class="solid"><path d="M8 5v14l11-7z" /></svg>
				{/if}
			</button>
			{#if canSkip}
				<button type="button" class="icon" aria-label="Next slide (admin preview only)" disabled={last} onclick={() => go(index + 1)}>
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
				</button>
			{/if}
			{#if canSkip}
				<button type="button" class="icon" aria-pressed={device === 'portrait'} aria-label="Preview as a phone, portrait (admin only)" title="Mobile portrait preview" onclick={() => (device = device === 'portrait' ? '' : 'portrait')}>
					<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2" /><path d="M12 18.5h.01" /></svg>
				</button>
				<button type="button" class="icon" aria-pressed={device === 'landscape'} aria-label="Preview as a phone, landscape (admin only)" title="Mobile landscape preview" onclick={() => (device = device === 'landscape' ? '' : 'landscape')}>
					<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="7" width="19" height="10" rx="2" /><path d="M18.5 12h.01" /></svg>
				</button>
			{/if}
			<button type="button" class="icon text" aria-pressed={showText} aria-label="Show transcript" onclick={() => (showText = !showText)}>CC</button>
			<button type="button" class="icon" aria-label={fullscreen ? 'Exit full screen' : 'Full screen'} onclick={toggleFullscreen}>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d={fullscreen ? 'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5' : 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'} /></svg>
			</button>
		</div>

		<span class="count" aria-live="off">{index + 1} / {slides.length}</span>
	</div>
</div>

<style>
	.stage {
		position: fixed;
		inset: 0;
		background: #fff;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.progress { position: absolute; top: 0; left: 0; right: 0; height: 4px; background: #eee; z-index: 3; }
	.fill { height: 100%; background: var(--c-green); transition: width 0.2s linear; }

	.content {
		flex: 1;
		display: grid;
		place-items: center;
		overflow-y: auto;
		padding: clamp(3.5rem, 8vh, 5rem) clamp(1.25rem, 5vw, 4rem) clamp(5.5rem, 12vh, 7rem);
	}
	/* With the transcript open, leave room so it never covers the slide. */
	.content.withText { padding-bottom: calc(38vh + 6.5rem); place-items: start center; }
	.slidewrap {
		container-type: inline-size;
		container-name: slides;
		width: min(100%, 980px);
		/* Full screen has no hairline under the slide. */
		--slide-rule: none;
	}

	.tap {
		position: absolute;
		inset: 0;
		z-index: 4;
		background: color-mix(in srgb, #fff 82%, transparent);
		display: grid;
		place-items: center;
		cursor: pointer;
	}
	.tap span {
		background: var(--c-green);
		color: #fff;
		padding: 0.9em 1.6em;
		border-radius: 6px;
		box-shadow: 0 2px 10px rgba(115, 223, 145, 0.5);
		font-family: ibm-plex-sans-condensed, sans-serif;
		font-weight: 800;
		font-style: italic;
		text-transform: uppercase;
		letter-spacing: 0.075em;
	}

	.captions {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 5.25rem;
		z-index: 2;
		max-height: 38vh;
		overflow-y: auto;
		margin: 0 auto;
		width: min(92%, 760px);
		background: rgba(40, 40, 40, 0.92);
		color: #fff;
		border-radius: 8px;
		padding: 1rem 1.25rem;
	}
	.captions p { color: #fff; font-size: 1.05rem; line-height: 1.6; margin: 0 0 0.75rem; }
	.captions p:last-child { margin-bottom: 0; }

	.chrome { transition: opacity 0.3s; }
	.chrome.hidden { opacity: 0; }
	.chrome.hidden :global(button) { pointer-events: none; }
	.chrome:focus-within { opacity: 1; }
	.exit { position: absolute; top: 0.75rem; left: 0.75rem; z-index: 3; }
	.bar {
		position: absolute;
		left: 50%;
		bottom: 1.25rem;
		transform: translateX(-50%);
		z-index: 3;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.5rem;
		background: rgba(255, 255, 255, 0.94);
		border: 1px solid #e8e4ee;
		border-radius: 999px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
	}
	.count { position: absolute; right: 1rem; bottom: 1.9rem; z-index: 3; font-size: 0.8125rem; color: var(--c-text-muted, #666); font-variant-numeric: tabular-nums; }

	/* The site styles every <button> as a loud uppercase label. These are quiet. */
	.icon {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		display: inline-grid;
		place-items: center;
		background: transparent;
		color: var(--c-dark);
		font-family: ibm-plex-sans, sans-serif;
		font-style: normal;
		font-weight: 500;
		font-size: 0.8125rem;
		text-transform: none;
		letter-spacing: 0.04em;
		border: 0;
		padding: 0;
	}
	.icon:hover { background: #f5f5f5; }
	.icon:disabled { opacity: 0.35; cursor: default; }
	.icon[aria-pressed='true'] { background: color-mix(in srgb, var(--c-green) 25%, white); }
	.icon.main { background: var(--c-green); }
	.icon.exit { background: rgba(255, 255, 255, 0.94); border: 1px solid #e8e4ee; }
	.icon svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
	.icon svg.solid { fill: currentColor; stroke: none; width: 20px; height: 20px; }
	button:focus-visible { outline: 2px solid var(--c-dark); outline-offset: 2px; }

	/* Admin preview of a phone. The sizes that normally come from the viewport (vh/vw) are pinned
	   to what they would be on that phone, so the padding, the transcript and the controls behave
	   as they will on a real device. The shadow dims everything outside the frame. Landscape
	   (844 x 390) is a short stage, so the slide is fitted (fit-to-stage.js) rather than scrolled. */
	.stage.device {
		inset: auto;
		top: 50%;
		left: 50%;
		width: 844px;
		height: 390px;
		transform: translate(-50%, -50%);
		border-radius: 16px;
		box-shadow: 0 0 0 8px #333, 0 0 0 100vmax rgba(0, 0, 0, 0.55);
	}
	/* Short stages give the slide almost all of the height: the exit button sits in the left
	   margin and the playback bar keeps the bottom strip, so the top needs no padding. */
	.stage.device .content { padding: 0.5rem 3.5rem 4.5rem; }
	.stage.device .content.withText { padding-bottom: calc(148px + 5.5rem); }
	.stage.device .captions { max-height: 148px; }

	/* 390 wide; as tall as a phone (844) unless the window is shorter. */
	.stage.device.portrait { width: 390px; height: min(844px, calc(100vh - 2rem)); }
	.stage.device.portrait .content { padding: 4.2rem 1.25rem 6.3rem; }
	.stage.device.portrait .content.withText { padding-bottom: calc(320px + 6.5rem); }
	.stage.device.portrait .captions { max-height: 320px; }
	.stage.device.portrait .count { display: none; }
	.stage.device.portrait .icon { width: 40px; height: 40px; }

	@media (max-height: 500px) and (orientation: landscape) {
		.content { padding: 0.5rem 3.5rem 4.5rem; }
		.content.withText { padding-bottom: calc(38vh + 5.5rem); }
	}

	@media (max-width: 520px) {
		.count { display: none; }
	}
</style>
