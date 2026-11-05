<script>
	// Confirm-then-delete for a whole course. Deleting removes the course document (modules,
	// slides, scripts, exam questions) and, best effort, its audio and images in Storage. Learner
	// enrollments, progress and certificates live in their own collections and are not touched.
	import { deleteDoc, doc } from 'firebase/firestore';
	import { deleteObject, listAll, ref } from 'firebase/storage';
	import { db, storage } from '$lib/firebase.js';

	let { course, onclose = () => {}, ondeleted = () => {} } = $props();

	const WORD = 'delete';
	let typed = $state('');
	let busy = $state(false);
	let error = $state('');
	let dialog = $state();

	$effect(() => {
		if (dialog && !dialog.open) dialog.showModal();
	});

	const slideCount = $derived((course.modules ?? []).reduce((n, m) => n + (m.slides?.length ?? 0), 0));
	const ready = $derived(typed.trim().toLowerCase() === WORD);

	async function removeFiles(courseId) {
		let failed = 0;
		for (const folder of ['ce-audio', 'ce-images']) {
			try {
				const { items } = await listAll(ref(storage, `${folder}/${courseId}`));
				const results = await Promise.allSettled(items.map((i) => deleteObject(i)));
				failed += results.filter((r) => r.status === 'rejected').length;
			} catch {
				failed += 1;
			}
		}
		return failed;
	}

	async function confirmDelete() {
		if (!ready || busy) return;
		busy = true;
		error = '';
		try {
			await deleteDoc(doc(db, 'courses', course.id));
		} catch (err) {
			console.error('[delete course] failed:', err);
			error = 'Could not delete the course. Check that you are signed in as an admin and try again.';
			busy = false;
			return;
		}
		const failedFiles = await removeFiles(course.id);
		if (failedFiles) console.warn(`[delete course] ${failedFiles} file(s) or folder(s) in Storage could not be removed`);
		ondeleted();
	}
</script>

<dialog bind:this={dialog} class="dialog" onclose={onclose} oncancel={(e) => busy && e.preventDefault()}>
	<form onsubmit={(e) => { e.preventDefault(); confirmDelete(); }}>
		<h2>Delete this course?</h2>
		<p class="name">{course.title || 'Untitled course'}</p>

		<div class="warning" role="alert">
			<strong>This cannot be undone.</strong>
			<ul>
				<li>
					The course, its {course.modules?.length ?? 0} module{course.modules?.length === 1 ? '' : 's'}{#if slideCount}
						and {slideCount} slide{slideCount === 1 ? '' : 's'}{/if}, including scripts and exam questions, will be permanently deleted.
				</li>
				<li>Recorded audio and images for this course are deleted from storage.</li>
				{#if course.published}
					<li><strong>It is published.</strong> Learners will lose access immediately.</li>
				{/if}
				<li>Learner enrollments, progress and certificates are kept, but will point at a course that no longer exists.</li>
			</ul>
			<p>If you might want it back, export it first or leave it as a draft.</p>
		</div>

		<label class="confirm">
			Type <code>{WORD}</code> to confirm
			<input type="text" bind:value={typed} autocomplete="off" autocapitalize="off" spellcheck="false" disabled={busy} />
		</label>

		{#if error}<p class="error" role="alert">{error}</p>{/if}

		<div class="actions">
			<button type="button" class="cancel" onclick={() => dialog.close()} disabled={busy}>Cancel</button>
			<button type="submit" class="danger" disabled={!ready || busy}>{busy ? 'Deleting…' : 'Delete course'}</button>
		</div>
	</form>
</dialog>

<style lang="scss">
	.dialog {
		width: min(92vw, 30rem);
		padding: 1.5rem;
		border: 0;
		border-radius: 10px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
		color: var(--c-dark);
	}
	.dialog::backdrop { background: rgba(0, 0, 0, 0.5); }
	h2 { font-size: 1.25rem; margin: 0 0 0.25rem; }
	.name { margin: 0 0 1rem; font-weight: 600; color: #555; overflow-wrap: anywhere; }
	.warning {
		background: #fdf2f2;
		border: 1px solid #f5c6c6;
		border-radius: 8px;
		padding: 0.85rem 1rem;
		font-size: 0.9rem;
		line-height: 1.5;
		strong { color: #a93226; }
		ul { margin: 0.5rem 0; padding-left: 1.1rem; display: flex; flex-direction: column; gap: 0.35rem; }
		p { margin: 0; color: #555; }
	}
	.confirm { display: flex; flex-direction: column; gap: 0.35rem; margin-top: 1rem; font-size: 0.9rem; font-weight: 500; }
	.confirm code { background: #f3f3f3; padding: 0 0.3rem; border-radius: 4px; }
	.confirm input {
		padding: 0.6rem 0.8rem;
		border: 1.5px solid #ddd;
		border-radius: 6px;
		font: inherit;
		&:focus { border-color: #c0392b; outline: none; }
	}
	.error { color: #c0392b; font-size: 0.88rem; margin: 0.75rem 0 0; }
	.actions { display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 1.25rem; }
	/* The site styles every <button> as a loud uppercase label; these are plain. */
	.actions button {
		padding: 0.55rem 1.1rem;
		border-radius: 6px;
		font: inherit;
		font-size: 0.9rem;
		font-weight: 600;
		font-style: normal;
		text-transform: none;
		letter-spacing: normal;
		cursor: pointer;
	}
	.cancel { background: #fff; color: var(--c-dark); border: 1.5px solid #ddd; }
	.danger { background: #c0392b; color: #fff; border: 1.5px solid #c0392b; }
	.actions button:disabled { opacity: 0.45; cursor: default; }
</style>
