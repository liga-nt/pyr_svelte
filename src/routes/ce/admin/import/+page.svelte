<script>
	// Saves a course made by CE-builder as a DRAFT. Drafts are only visible to admins until
	// you publish them in the course editor. Audio clips and figure images are uploaded to
	// Firebase Storage.
	import { goto } from '$app/navigation';
	import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
	import { db } from '$lib/firebase.js';
	import { uploadToStorage } from '$lib/components/course-editor/storage-upload.js';

	let course = $state(null);
	let fileName = $state('');
	let audioFiles = $state([]);
	let imageFiles = $state([]);
	let busy = $state(false);
	let message = $state('');
	let error = $state('');
	let savedSlug = $state('');
	let existing = $state(null); // { published } when a course with this slug already exists
	let confirmReplace = $state(false);

	const slideshows = $derived((course?.modules ?? []).filter((m) => m.type === 'slideshow'));
	const slides = $derived(slideshows.flatMap((m) => m.slides));
	const matched = $derived(slides.filter((s) => audioFor(s)).length);
	const figureSlides = $derived(slides.filter((s) => s.layout === 'figure'));
	const matchedImages = $derived(figureSlides.filter((s) => imageFor(s)).length);

	function audioFor(slide) {
		return audioFiles.find((f) => f.name.startsWith(`${slide.id}.`));
	}

	function imageFor(slide) {
		return imageFiles.find((f) => f.name.startsWith(`${slide.id}.`));
	}

	async function onCourse(e) {
		const file = e.currentTarget.files?.[0];
		if (!file) return;
		error = '';
		savedSlug = '';
		try {
			const data = JSON.parse(await file.text());
			if (!data.title || !data.slug || !Array.isArray(data.modules)) {
				throw new Error('This does not look like a course file (needs title, slug and modules).');
			}
			if (!/^[a-z0-9-]+$/.test(data.slug)) throw new Error(`Bad slug "${data.slug}".`);
			course = data;
			fileName = file.name;
			confirmReplace = false;
			const snap = await getDoc(doc(db, 'courses', data.slug));
			existing = snap.exists() ? { published: Boolean(snap.data().published) } : null;
		} catch (err) {
			course = null;
			error = `Could not read that file: ${err.message}`;
		}
	}

	function onAudio(e) {
		audioFiles = [...(e.currentTarget.files ?? [])];
	}

	function onImages(e) {
		imageFiles = [...(e.currentTarget.files ?? [])];
	}

	async function save() {
		busy = true;
		error = '';
		message = '';
		try {
			const id = course.slug;
			const existing = await getDoc(doc(db, 'courses', id));
			if (existing.exists() && existing.data().published) {
				throw new Error('That course is already published. Unpublish it in the editor before importing over it.');
			}

			const modules = [];
			for (const m of course.modules) {
				if (m.type !== 'slideshow') {
					modules.push(m);
					continue;
				}
				const outSlides = [];
				for (const s of m.slides) {
					const { audioUrl: _old, ...rest } = s;
					let slide = rest;

					const audio = audioFor(s);
					if (audio) {
						message = `Uploading ${audio.name}…`;
						const { url, path } = await uploadToStorage(`ce-audio/${id}/${audio.name}`, audio, audio.type || 'audio/mpeg');
						// CE-builder's script for a matched clip is already the transcript for that
						// exact recording, so treat it as up to date rather than needing re-transcription.
						const audioVersion = crypto.randomUUID();
						slide = { ...slide, audioUrl: url, audioPath: path, audioVersion, transcribedVersion: audioVersion };
					}

					const image = s.layout === 'figure' ? imageFor(s) : null;
					if (image) {
						message = `Uploading ${image.name}…`;
						const { url } = await uploadToStorage(`ce-images/${id}/${image.name}`, image, image.type || 'image/jpeg');
						slide = { ...slide, data: { ...slide.data, src: url } };
					}

					outSlides.push(slide);
				}
				modules.push({ ...m, slides: outSlides });
			}

			message = 'Saving the draft…';
			await setDoc(doc(db, 'courses', id), {
				title: course.title,
				slug: id,
				description: course.description ?? '',
				creditHours: course.creditHours ?? 1,
				creditType: course.creditType ?? '',
				passingScore: course.passingScore ?? 80,
				published: false,
				modules,
				createdAt: existing.exists() ? (existing.data().createdAt ?? serverTimestamp()) : serverTimestamp(),
				updatedAt: serverTimestamp()
			});
			savedSlug = id;
			message = '';
		} catch (err) {
			error = err.message;
			message = '';
		} finally {
			busy = false;
		}
	}
</script>

<svelte:head><title>Import course | PYR CE</title></svelte:head>

<div class="page">
	<a href="/ce/admin" class="back">← Course admin</a>
	<h1>Import a course</h1>
	<p class="lead">
		Choose the <code>course.json</code> made by CE-builder. It is saved as a draft that only admins can see. You can
		preview it the way a learner sees it, then publish it from the editor.
	</p>

	<div class="card">
		<label class="field">
			<span>Course file (course.json)</span>
			<input type="file" accept="application/json,.json" onchange={onCourse} />
		</label>
		<label class="field">
			<span>Audio clips (optional, the mp3 files from CE-builder's audio folder)</span>
			<input type="file" accept="audio/*" multiple onchange={onAudio} />
		</label>
		<label class="field">
			<span>Figure images (optional, from CE-builder's figures folder)</span>
			<input type="file" accept="image/*" multiple onchange={onImages} />
		</label>
	</div>

	{#if course}
		<div class="card summary">
			<h2>{course.title}</h2>
			<p>{fileName} · slug <code>{course.slug}</code></p>
			<ul>
				<li>{course.modules.length} module{course.modules.length === 1 ? '' : 's'}: {course.modules.map((m) => m.type).join(', ')}</li>
				<li>{slides.length} slides, {matched} with audio chosen{slides.length && matched < slides.length ? '. Slides without audio play on a reading timer.' : ''}</li>
				{#if figureSlides.length}
					<li>{figureSlides.length} figure slide{figureSlides.length === 1 ? '' : 's'}, {matchedImages} with an image chosen{matchedImages < figureSlides.length ? '. The rest keep their existing src, or show no image.' : ''}</li>
				{/if}
				<li>{course.creditHours} credit hour(s){course.creditType ? `, ${course.creditType}` : ''}</li>
			</ul>
			{#if existing?.published}
				<p class="error" role="alert">A published course with this slug already exists. Unpublish it in the editor first.</p>
			{:else if existing}
				<label class="confirm">
					<input type="checkbox" bind:checked={confirmReplace} />
					<span>A draft with this slug already exists. Importing <strong>replaces its slides</strong>, including any edits made here in the admin. Replace it.</span>
				</label>
			{/if}
			<button type="button" class="primary" disabled={busy || existing?.published || (existing && !confirmReplace)} onclick={save}>{busy ? 'Saving…' : existing ? 'Replace the draft' : 'Save as draft'}</button>
		</div>
	{/if}

	{#if message}<p class="note" role="status">{message}</p>{/if}
	{#if error}<p class="error" role="alert">{error}</p>{/if}
	{#if savedSlug}
		<div class="card done" role="status">
			<h2>Saved as a draft</h2>
			<p>It is hidden from learners until you publish it.</p>
			<div class="row">
				<button type="button" class="primary" onclick={() => goto(`/ce/courses/${savedSlug}`)}>Preview as a learner</button>
				<button type="button" onclick={() => goto('/ce/admin')}>Back to the dashboard</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.page { max-width: 720px; margin: 0 auto; padding: var(--space-medium) var(--container-padding); display: flex; flex-direction: column; gap: 1rem; }
	.back { font-size: 0.85rem; color: var(--c-text-muted, #666); box-shadow: none; }
	h1 { margin: 0; font-size: 1.75rem; }
	h2 { margin: 0; font-size: 1.25rem; }
	.lead { margin: 0; }
	.card { background: #fafafa; border: 1px solid #e8e4ee; border-radius: 8px; padding: 1rem 1.1rem; display: flex; flex-direction: column; gap: 0.75rem; }
	.field { display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.9375rem; }
	.summary ul { margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.25rem; }
	.summary p { margin: 0; color: var(--c-text-muted, #666); font-size: 0.9rem; }
	.row { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }
	.note { color: var(--c-text-muted, #666); margin: 0; }
	.error { color: #8a1f1f; margin: 0; }
	.confirm { display: flex; gap: 0.6rem; align-items: flex-start; font-size: 0.9rem; background: color-mix(in srgb, var(--c-yellow) 25%, white); border: 1px solid color-mix(in srgb, var(--c-yellow) 60%, white); border-radius: 6px; padding: 0.6rem 0.8rem; }
	.confirm input { margin-top: 0.25rem; }
	.done { border-color: var(--c-green); }
	.done p { margin: 0; }
	.primary { align-self: flex-start; min-height: 44px; }
	button:disabled { opacity: 0.6; cursor: default; }
	code { background: #f0f0f0; padding: 0.05rem 0.35rem; border-radius: 4px; font-size: 0.875em; }
</style>
