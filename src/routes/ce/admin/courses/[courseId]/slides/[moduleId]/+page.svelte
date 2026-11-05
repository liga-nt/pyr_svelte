<script>
	// Edits one slideshow module of a course: choose a template per slide, fill its fields,
	// see it live, then record the narration. Slides live inside the course document in
	// Firestore. Published courses are read-only.
	import { page } from '$app/state';
	import { uploadToStorage } from '$lib/components/course-editor/storage-upload.js';
	import { authState } from '$lib/auth.svelte.js';
	import SlideView from '$lib/slide-templates/SlideView.svelte';
	import { fitToStage } from '$lib/slide-templates/fit-to-stage.js';
	import {
		getTemplate, emptyData, hydrateData, cleanData, lostFields, switchData, validateSlide
	} from '$lib/slide-templates/index.js';
	import SlideList from '$lib/components/course-editor/SlideList.svelte';
	import TemplatePicker from '$lib/components/course-editor/TemplatePicker.svelte';
	import FieldForm from '$lib/components/course-editor/FieldForm.svelte';
	import VoiceoverPanel from '$lib/components/course-editor/VoiceoverPanel.svelte';
	import { transcribeAudio } from '$lib/components/course-editor/transcribe.js';
	import {
		loadModule, saveSlide, addSlide, deleteSlide, moveSlide, nextSlideId
	} from '$lib/components/course-editor/data.js';

	/* Reactive objects cannot go through structuredClone, so copy them as plain JSON. */
	const plain = (v) => JSON.parse(JSON.stringify(v));

	// Matches the learner player: slides never render wider than 980px (SlideStage.svelte),
	// and the templates' own @container breakpoint switches to the wide layout at 700px, so a
	// phone (390px) and this width are the two views worth previewing. A phone turned on its
	// side (844 x 390) is the tight case: the player's own padding and controls leave the slide
	// only about 250px of height, so it scrolls.
	const PREVIEW_SIZES = {
		mobile: { w: 390 },
		'phone-landscape': { w: 844, h: 390 },
		desktop: { w: 980 }
	};

	const courseId = $derived(page.params.courseId);
	const moduleId = $derived(page.params.moduleId);

	let loading = $state(true);
	let loadError = $state('');
	let course = $state(null);
	let moduleTitle = $state('');
	let slides = $state([]); // as saved in Firestore
	let selectedId = $state('');
	let draft = $state(null); // editable copy of the selected slide
	let picker = $state(''); // '' | 'switch' | 'add'
	let pendingSwitch = $state(null); // { to, lost }
	let pendingAction = $state(null); // an action waiting on the unsaved-changes choice
	let busy = $state(false);
	let transcribing = $state(false);
	let message = $state('');
	let error = $state('');
	let uploading = $state('');
	let previewWidth = $state('mobile'); // 'mobile' | 'phone-landscape' | 'desktop'

	const readonly = $derived(Boolean(course?.published));
	const saved = $derived(slides.find((s) => s.id === selectedId));
	const template = $derived(draft ? getTemplate(draft.layout) : null);
	const issues = $derived(draft ? validateSlide({ ...draft, data: cleanData(draft.layout, draft.data) }) : []);
	const fieldIssues = $derived(issues.filter((i) => i.field && i.field !== 'script'));
	const scriptIssues = $derived(issues.filter((i) => i.field === 'script'));

	const normalized = (s) => JSON.stringify({
		layout: s.layout,
		data: cleanData(s.layout, s.data),
		notes: (s.notes ?? '').trim(),
		script: (s.script ?? '').trim(),
		transcribedVersion: s.transcribedVersion ?? ''
	});
	const dirty = $derived(Boolean(draft && saved && normalized(draft) !== normalized({ ...saved, data: hydrateData(saved.layout, saved.data) })));

	// A slide's transcript is "stale" once its recording has been replaced (a fresh
	// audioVersion) without a matching transcribedVersion, so the saved script text may no
	// longer be what the current recording actually says.
	const audioStatus = $derived(
		Object.fromEntries(
			slides.map((s) => {
				if (!s.audioUrl) return [s.id, 'none'];
				const stale = s.audioVersion && s.transcribedVersion !== s.audioVersion;
				return [s.id, stale ? 'stale' : 'current'];
			})
		)
	);
	const withCurrentAudio = $derived(slides.filter((s) => audioStatus[s.id] === 'current').length);
	// Draft-aware, unlike audioStatus: flips as soon as "Create transcript" runs, not only
	// after the slide is saved, so the button and warning update immediately.
	const transcriptStale = $derived(Boolean(saved?.audioUrl && draft && draft.transcribedVersion !== saved.audioVersion));
	const voiceBlocked = $derived(
		readonly ? 'This course is published, so recordings can not be changed.'
		: dirty ? 'Save this slide first, so the recording matches what is saved.'
		: ''
	);
	const minutes = $derived(((draft?.script ?? '').split(/\s+/).filter(Boolean).length / 150).toFixed(1));

	async function createTranscript() {
		transcribing = true;
		error = '';
		try {
			draft.script = await transcribeAudio(saved.audioPath);
			draft.transcribedVersion = saved.audioVersion;
		} catch (err) {
			error = err.message;
		} finally {
			transcribing = false;
		}
	}

	$effect(() => {
		if (authState.loading || !authState.isAdmin) return;
		load();
	});

	async function load() {
		loading = true;
		try {
			const { course: c, module } = await loadModule(courseId, moduleId);
			course = c;
			moduleTitle = module.title;
			slides = module.slides ?? [];
			select(slides[0]?.id ?? '');
		} catch (err) {
			loadError = err.message;
		} finally {
			loading = false;
		}
	}

	function select(id) {
		selectedId = id;
		const s = slides.find((x) => x.id === id);
		draft = s ? { ...plain(s), data: hydrateData(s.layout, plain(s.data ?? {})) } : null;
		picker = '';
		pendingSwitch = null;
		message = '';
		error = '';
	}

	/** Runs `action`, but first asks what to do with unsaved edits. */
	function guard(action) {
		if (dirty) pendingAction = action;
		else action();
	}

	async function run(fn) {
		busy = true;
		error = '';
		try {
			return await fn();
		} catch (err) {
			error = err.message;
		} finally {
			busy = false;
		}
	}

	async function save() {
		return run(async () => {
			const toSave = { ...draft, data: cleanData(draft.layout, draft.data), notes: (draft.notes ?? '').trim(), script: (draft.script ?? '').trim() };
			slides = await saveSlide(courseId, moduleId, toSave);
			select(selectedId);
			message = 'Saved';
			setTimeout(() => (message = ''), 2000);
			return true;
		});
	}

	async function choose(then, saveFirst) {
		const action = pendingAction;
		pendingAction = null;
		if (saveFirst && !(await save())) return;
		action?.();
	}

	function pick(id) {
		if (picker === 'add') return createSlide(id);
		if (id === draft.layout) return (picker = '');
		const lost = lostFields(draft.data, draft.layout, id);
		if (lost.length) pendingSwitch = { to: id, lost };
		else applySwitch(id);
	}

	function applySwitch(id) {
		draft.data = hydrateData(id, switchData(draft.data, draft.layout, id));
		draft.layout = id;
		pendingSwitch = null;
		picker = '';
	}

	async function createSlide(layout) {
		picker = '';
		const slide = { id: nextSlideId(slides), layout, data: emptyData(layout), notes: '', script: '' };
		await run(async () => {
			slides = await addSlide(courseId, moduleId, slide, selectedId);
			select(slide.id);
		});
	}

	const remove = (id) =>
		run(async () => {
			const i = slides.findIndex((s) => s.id === id);
			slides = await deleteSlide(courseId, moduleId, id);
			select(slides[Math.min(i, slides.length - 1)]?.id ?? '');
		});

	const move = (id, dir) =>
		run(async () => {
			slides = await moveSlide(courseId, moduleId, id, dir);
		});

	async function uploadImage(file) {
		if (!file.type.startsWith('image/')) return void (error = 'Choose an image file.');
		if (file.size > 5 * 1024 * 1024) return void (error = 'That image is over 5 MB. Please use a smaller one.');
		uploading = 'Uploading…';
		error = '';
		try {
			const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
			const { url } = await uploadToStorage(`ce-images/${courseId}/${draft.id}-${Date.now()}.${ext}`, file, file.type);
			return url;
		} catch (err) {
			error = err.message;
			return draft.data.src;
		} finally {
			uploading = '';
		}
	}
</script>

<svelte:head><title>Edit slides | PYR CE</title></svelte:head>
<svelte:window onbeforeunload={(e) => { if (dirty) e.preventDefault(); }} />

<div class="page">
	<header>
		<a class="back" href="/ce/admin/courses/{courseId}">← Course editor</a>
		<div class="titles">
			<h1>{moduleTitle || 'Slides'}</h1>
			{#if course}<p class="sub">{course.title} · {slides.length} slides · {withCurrentAudio} with current audio</p>{/if}
		</div>
		{#if course}
			<a class="btn" href="/ce/courses/{courseId}" target="_blank" rel="noopener">Preview as learner ↗</a>
		{/if}
	</header>

	{#if loading}
		<p class="note">Loading…</p>
	{:else if loadError}
		<p class="error" role="alert">{loadError}</p>
	{:else}
		{#if readonly}
			<p class="banner" role="status">
				This course is published, so its slides can't be changed. Unpublish it in the
				<a href="/ce/admin/courses/{courseId}">course editor</a> to edit them.
			</p>
		{/if}

		<div class="layout">
			<aside>
				<SlideList
					{slides}
					{selectedId}
					audio={audioStatus}
					{readonly}
					onselect={(id) => guard(() => select(id))}
					onadd={() => guard(() => (picker = 'add'))}
					onmove={(id, dir) => guard(() => move(id, dir))}
					ondelete={(id) => guard(() => remove(id))}
				/>
			</aside>

			<main>
				{#if pendingAction}
					<div class="unsaved" role="alert">
						<strong>This slide has unsaved changes.</strong>
						<div class="row">
							<button type="button" class="primary" disabled={busy} onclick={() => choose(null, true)}>Save and continue</button>
							<button type="button" onclick={() => { const a = pendingAction; pendingAction = null; select(selectedId); a(); }}>Discard changes</button>
							<button type="button" onclick={() => (pendingAction = null)}>Stay here</button>
						</div>
					</div>
				{/if}

				{#if error}<p class="error" role="alert">{error}</p>{/if}

				{#if picker === 'add'}
					<TemplatePicker title="Which template for the new slide?" onpick={pick} oncancel={() => (picker = '')} />
				{:else if draft}
					<div class="toolbar">
						<div class="tpl">
							<span class="label">Template</span>
							<strong>{template?.label ?? draft.layout}</strong>
							{#if !readonly}<button type="button" class="quiet" onclick={() => (picker = picker ? '' : 'switch')}>Change</button>{/if}
						</div>
						<div class="save">
							{#if message}<span class="ok" role="status">{message}</span>{:else if dirty}<span class="dirty">Unsaved changes</span>{/if}
							<button type="button" class="primary" disabled={readonly || busy || !dirty} onclick={save}>{busy ? 'Saving…' : 'Save slide'}</button>
						</div>
					</div>

					{#if picker === 'switch'}
						<TemplatePicker current={draft.layout} title="Change this slide's template" onpick={pick} oncancel={() => { picker = ''; pendingSwitch = null; }} />
						{#if pendingSwitch}
							<div class="warn" role="alert">
								<strong>Switching to {getTemplate(pendingSwitch.to)?.label} will remove:</strong>
								<ul>{#each pendingSwitch.lost as l}<li>{l}</li>{/each}</ul>
								<p>Fields that exist in both templates are kept. You can still change your mind by not saving.</p>
								<div class="row">
									<button type="button" class="primary" onclick={() => applySwitch(pendingSwitch.to)}>Switch and lose these</button>
									<button type="button" onclick={() => (pendingSwitch = null)}>Keep current template</button>
								</div>
							</div>
						{/if}
					{/if}

					<div class="workarea">
						<div class="editor">
							{#if template}
								<FieldForm fields={template.fields} data={draft.data} issues={fieldIssues} {readonly} onupload={uploadImage} {uploading} />
							{:else}
								<p class="error">The template "{draft.layout}" no longer exists. Choose another with Change.</p>
							{/if}

							<div class="field narration">
								<label for="notes">Speaking notes <span class="hint">(an outline for you to record from; never shown to learners)</span></label>
								<textarea id="notes" rows="4" bind:value={draft.notes} disabled={readonly}></textarea>
							</div>

							<VoiceoverPanel
								slide={saved}
								{courseId}
								{moduleId}
								blockedReason={voiceBlocked}
								onchange={(next) => { slides = next; select(selectedId); }}
							/>

							<div class="field narration">
								<div class="toolbar">
									<label for="script">Transcript <span class="hint">(what learners read and hear)</span></label>
									{#if saved?.audioUrl}
										<button type="button" class="quiet" disabled={readonly || transcribing} onclick={createTranscript}>
											{transcribing ? 'Transcribing…' : transcriptStale ? 'Create transcript' : 'Re-create transcript'}
										</button>
									{/if}
								</div>
								<textarea id="script" rows="9" bind:value={draft.script} disabled={readonly}></textarea>
								<span class="hint">{(draft.script ?? '').split(/\s+/).filter(Boolean).length} words, about {minutes} min</span>
								{#each scriptIssues as e}<span class="msg warn">{e.message}</span>{/each}
								{#if transcriptStale}
									<span class="msg warn" role="alert">The recording has changed since this was transcribed. Create a new transcript, or edit the text by hand to match.</span>
								{/if}
							</div>
						</div>

						<div class="preview" class:wide={previewWidth !== 'mobile'} aria-label="Live preview">
							<div class="preview-head">
								<span class="label">Preview</span>
								<div class="viewport" role="group" aria-label="Preview width">
									<button type="button" class="vbtn" class:active={previewWidth === 'mobile'} onclick={() => (previewWidth = 'mobile')}>Mobile</button>
									<button type="button" class="vbtn" class:active={previewWidth === 'phone-landscape'} onclick={() => (previewWidth = 'phone-landscape')}>Mobile landscape</button>
									<button type="button" class="vbtn" class:active={previewWidth === 'desktop'} onclick={() => (previewWidth = 'desktop')}>Desktop</button>
								</div>
								<span class="dim">{PREVIEW_SIZES[previewWidth].w}{PREVIEW_SIZES[previewWidth].h ? ` × ${PREVIEW_SIZES[previewWidth].h}` : ''}px</span>
							</div>
							<div class="frame-outer">
								<div
									class="frame"
									class:device={previewWidth === 'phone-landscape'}
									style="width: {PREVIEW_SIZES[previewWidth].w}px; {PREVIEW_SIZES[previewWidth].h ? `height: ${PREVIEW_SIZES[previewWidth].h}px` : ''}"
								>
									<div class="fitwrap" use:fitToStage={previewWidth === 'phone-landscape'}>
										<SlideView slide={{ layout: draft.layout, data: cleanData(draft.layout, draft.data) }} showAlt />
									</div>
								</div>
							</div>
						</div>
					</div>
				{:else}
					<p class="note">This module has no slides yet. Use “Add slide”.</p>
				{/if}
			</main>
		</div>
	{/if}
</div>

<style>
	.page { max-width: 1400px; margin: 0 auto; padding: 1.25rem var(--container-padding) 4rem; }
	header { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-bottom: 1rem; }
	.back { font-size: 0.85rem; color: var(--c-text-muted, #666); box-shadow: none; white-space: nowrap; }
	.titles { flex: 1; min-width: 12rem; }
	h1 { margin: 0; font-size: 1.4rem; }
	.sub { margin: 0.15rem 0 0; font-size: 0.85rem; color: var(--c-text-muted, #666); }
	.btn { font-size: 0.85rem; box-shadow: none; border: 1px solid #ddd; border-radius: 6px; padding: 0.55rem 0.9rem; }
	.banner { background: color-mix(in srgb, var(--c-yellow) 30%, white); border: 1px solid color-mix(in srgb, var(--c-yellow) 60%, white); border-radius: 6px; padding: 0.7rem 1rem; margin: 0 0 1rem; }
	.layout { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
	@media (min-width: 900px) { .layout { grid-template-columns: 280px minmax(0, 1fr); } aside { position: sticky; top: 1rem; align-self: start; max-height: calc(100vh - 2rem); overflow-y: auto; } }
	main { display: flex; flex-direction: column; gap: 1rem; min-width: 0; }
	.toolbar { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
	.tpl { display: flex; align-items: center; gap: 0.6rem; }
	.label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--c-text-muted, #666); }
	.save { display: flex; align-items: center; gap: 0.75rem; }
	.ok { color: var(--c-green-text, #1e7a3c); font-size: 0.875rem; }
	.dirty { color: #7a5b00; font-size: 0.875rem; }
	.workarea { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
	/* Landscape (980px) needs more room than the right-hand column alone, so it spans the full
	   width of the workarea and moves above the editor instead of sitting beside or below it. */
	.preview.wide { grid-column: 1 / -1; order: -1; }
	@media (min-width: 1250px) {
		.workarea { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: start; }
		.preview { position: sticky; top: 1rem; }
		.preview.wide { position: static; }
	}
	.editor { display: flex; flex-direction: column; gap: 1.25rem; min-width: 0; }
	.preview { display: flex; flex-direction: column; gap: 0.4rem; min-width: 0; }
	.preview-head { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
	.viewport { display: inline-flex; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; }
	.vbtn { min-height: 30px; padding: 0.25rem 0.7rem; font-size: 0.8125rem; font-weight: 500; text-transform: none; letter-spacing: normal; background: #fff; color: var(--c-dark); border-radius: 0; }
	.vbtn + .vbtn { border-left: 1px solid #ddd; }
	.vbtn.active { background: var(--c-dark); color: #fff; }
	.dim { font-size: 0.75rem; color: var(--c-text-muted, #666); font-variant-numeric: tabular-nums; }
	/* Landscape (980px) is usually wider than this column, so it scrolls horizontally rather
	   than being scaled or squeezed, which would misrepresent what a learner actually sees. */
	.frame-outer { overflow-x: auto; padding: 0.25rem; margin: -0.25rem; }
	.fitwrap { container-type: inline-size; container-name: slides; }
	.frame { border: 1px solid #e8e4ee; border-radius: 8px; padding: 1rem 1.25rem; background: #fff; --slide-rule: none; }
	/* Phone on its side: the same viewport and padding as the learner player (SlideStage.svelte),
	   so what scrolls here does in the real thing. The 88px at the bottom is where the player's
	   playback bar sits. The bezel is a shadow so the 844 x 390 viewport stays exact. */
	.frame.device { box-sizing: border-box; overflow-y: auto; padding: 56px 42px 88px; border: 0; border-radius: 14px; box-shadow: 0 0 0 6px #333; margin: 6px; }
	.field { display: flex; flex-direction: column; gap: 0.3rem; }
	.field label { font-size: 0.9rem; font-weight: 500; }
	textarea { width: 100%; font: inherit; font-size: 0.95rem; padding: 0.55rem 0.7rem; border: 1.5px solid #ddd; border-radius: 6px; line-height: 1.55; resize: vertical; }
	textarea:focus-visible { outline: none; border-color: var(--c-green); }
	.hint { font-size: 0.8125rem; color: var(--c-text-muted, #666); }
	.msg { font-size: 0.8125rem; color: #8a1f1f; }
	.msg.warn { color: #7a5b00; }
	.error { color: #8a1f1f; margin: 0; }
	.note { color: var(--c-text-muted, #666); }
	.unsaved, .warn { border: 1px solid color-mix(in srgb, var(--c-yellow) 60%, white); background: color-mix(in srgb, var(--c-yellow) 25%, white); border-radius: 8px; padding: 0.8rem 1rem; display: flex; flex-direction: column; gap: 0.6rem; }
	.warn ul { margin: 0; padding-left: 1.2rem; }
	.warn p { margin: 0; font-size: 0.875rem; }
	.row { display: flex; gap: 0.6rem; flex-wrap: wrap; }
	.primary { min-height: 44px; }
	.quiet { min-height: 36px; }
	button:disabled { opacity: 0.55; cursor: default; }
	button:focus-visible, a:focus-visible { outline: 2px solid var(--c-dark); outline-offset: 2px; }
</style>
