<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
	import { db } from '$lib/firebase.js';
	import { authState } from '$lib/auth.svelte.js';

	const isNew = $derived(page.params.courseId === 'new');

	let saving = $state(false);
	let saveMsg = $state('');
	let loading = $state(!isNew);

	// Course fields
	let title = $state('');
	let slug = $state('');
	let description = $state('');
	let creditHours = $state(1);
	let creditType = $state('');
	let passingScore = $state(80);
	let published = $state(false);
	let modules = $state([]);

	const creditTypes = [
		'Clinical Social Work', 'Counseling', 'Marriage & Family Therapy',
		'Addiction Counseling', 'Psychology', 'Nursing', 'General Mental Health'
	];

	// Auto-generate slug from title
	function slugify(val) {
		return val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
	}

	$effect(() => {
		if (isNew) {
			slug = slugify(title);
		}
	});

	async function load() {
		const snap = await getDoc(doc(db, 'courses', page.params.courseId));
		if (!snap.exists()) { goto('/ce/admin'); return; }
		const d = snap.data();
		title = d.title ?? '';
		slug = d.slug ?? '';
		description = d.description ?? '';
		creditHours = d.creditHours ?? 1;
		creditType = d.creditType ?? '';
		passingScore = d.passingScore ?? 80;
		published = d.published ?? false;
		modules = d.modules ?? [];
		loading = false;
	}

	$effect(() => {
		if (!isNew && !authState.loading && authState.isAdmin) load();
	});

	async function save() {
		saving = true;
		saveMsg = '';
		const data = {
			title, slug, description, creditHours: Number(creditHours),
			creditType, passingScore: Number(passingScore), published, modules,
			updatedAt: serverTimestamp()
		};
		try {
			if (isNew) {
				const newRef = doc(db, 'courses', slug || crypto.randomUUID());
				await setDoc(newRef, { ...data, createdAt: serverTimestamp() });
				goto(`/ce/admin/courses/${newRef.id}`);
			} else {
				await updateDoc(doc(db, 'courses', page.params.courseId), data);
				saveMsg = 'Saved';
				setTimeout(() => saveMsg = '', 2000);
			}
		} finally {
			saving = false;
		}
	}

	// ── Module helpers ──────────────────────────────────────────────────────────

	function addModule(type) {
		const base = { id: crypto.randomUUID(), type, title: '', order: modules.length };
		if (type === 'video') modules = [...modules, { ...base, videoUrl: '' }];
		if (type === 'article') modules = [...modules, { ...base, articleMarkdown: '' }];
		if (type === 'exam') modules = [...modules, { ...base, questions: [] }];
	}

	function removeModule(id) {
		modules = modules.filter(m => m.id !== id);
	}

	function moveModule(index, dir) {
		const arr = [...modules];
		const swap = index + dir;
		if (swap < 0 || swap >= arr.length) return;
		[arr[index], arr[swap]] = [arr[swap], arr[index]];
		modules = arr.map((m, i) => ({ ...m, order: i }));
	}

	function updateModule(id, field, value) {
		modules = modules.map(m => m.id === id ? { ...m, [field]: value } : m);
	}

	// ── Question helpers ────────────────────────────────────────────────────────

	function addQuestion(moduleId) {
		modules = modules.map(m => {
			if (m.id !== moduleId) return m;
			return {
				...m,
				questions: [...(m.questions ?? []), {
					id: crypto.randomUUID(),
					prompt: '',
					choices: ['', '', '', ''],
					correctIndex: 0
				}]
			};
		});
	}

	function removeQuestion(moduleId, questionId) {
		modules = modules.map(m => {
			if (m.id !== moduleId) return m;
			return { ...m, questions: m.questions.filter(q => q.id !== questionId) };
		});
	}

	function updateQuestion(moduleId, questionId, field, value) {
		modules = modules.map(m => {
			if (m.id !== moduleId) return m;
			return {
				...m,
				questions: m.questions.map(q =>
					q.id === questionId ? { ...q, [field]: value } : q
				)
			};
		});
	}

	function updateChoice(moduleId, questionId, choiceIndex, value) {
		modules = modules.map(m => {
			if (m.id !== moduleId) return m;
			return {
				...m,
				questions: m.questions.map(q => {
					if (q.id !== questionId) return q;
					const choices = [...q.choices];
					choices[choiceIndex] = value;
					return { ...q, choices };
				})
			};
		});
	}

	let openModules = $state({});
	function toggleModule(id) {
		openModules = { ...openModules, [id]: !openModules[id] };
	}
</script>

<svelte:head>
	<title>{isNew ? 'New Course' : title || 'Edit Course'} | Admin</title>
</svelte:head>

<div class="editor-page">
	<header class="editor-header">
		<div class="editor-header-inner">
			<a href="/ce/admin" class="back-link">← All courses</a>
			<h1>{isNew ? 'New course' : (title || 'Edit course')}</h1>
			<div class="header-actions">
				{#if saveMsg}<span class="save-msg">{saveMsg} ✓</span>{/if}
				<button class="btn-save" onclick={save} disabled={saving}>
					{saving ? 'Saving…' : 'Save'}
				</button>
			</div>
		</div>
	</header>

	{#if loading}
		<div class="loading-state"><div class="spinner"></div></div>
	{:else}
		<div class="editor-body">
			<!-- ── Course settings ── -->
			<section class="card">
				<h2>Course settings</h2>
				<div class="fields">
					<div class="field field-wide">
						<label for="title">Title</label>
						<input id="title" type="text" bind:value={title} placeholder="e.g. Introduction to Motivational Interviewing" />
					</div>

					<div class="field">
						<label for="slug">URL slug <span class="hint">/ce/courses/{slug || '…'}</span></label>
						<input id="slug" type="text" bind:value={slug} placeholder="intro-motivational-interviewing" />
					</div>

					<div class="field field-wide">
						<label for="description">Description</label>
						<textarea id="description" bind:value={description} rows="3" placeholder="What will participants learn?"></textarea>
					</div>

					<div class="field">
						<label for="creditType">CE credit type</label>
						<select id="creditType" bind:value={creditType}>
							<option value="">Select…</option>
							{#each creditTypes as ct}
								<option value={ct}>{ct}</option>
							{/each}
						</select>
					</div>

					<div class="field field-narrow">
						<label for="creditHours">Credit hours</label>
						<input id="creditHours" type="number" min="0.5" max="20" step="0.5" bind:value={creditHours} />
					</div>

					<div class="field field-narrow">
						<label for="passingScore">Passing score (%)</label>
						<input id="passingScore" type="number" min="50" max="100" step="5" bind:value={passingScore} />
					</div>

					<div class="field field-wide">
						<label class="checkbox-label">
							<input type="checkbox" bind:checked={published} />
							Published (visible in course catalog)
						</label>
					</div>
				</div>
			</section>

			<!-- ── Modules ── -->
			<section class="card">
				<div class="modules-header">
					<h2>Modules <span class="module-count">({modules.length})</span></h2>
					<div class="add-module-btns">
						<button class="btn-add-module" onclick={() => addModule('video')}>+ Video</button>
						<button class="btn-add-module" onclick={() => addModule('article')}>+ Article</button>
						<button class="btn-add-module" onclick={() => addModule('exam')}>+ Exam</button>
					</div>
				</div>

				{#if modules.length === 0}
					<p class="no-modules">Add modules above to build your course. Students complete them in order.</p>
				{/if}

				<div class="module-list">
					{#each modules as mod, i (mod.id)}
						<div class="module-card">
							<div class="module-top">
								<div class="module-drag">
									<button class="reorder-btn" onclick={() => moveModule(i, -1)} disabled={i === 0} title="Move up">↑</button>
									<button class="reorder-btn" onclick={() => moveModule(i, 1)} disabled={i === modules.length - 1} title="Move down">↓</button>
								</div>
								<span class="module-type-tag" class:video={mod.type === 'video'} class:article={mod.type === 'article'} class:exam={mod.type === 'exam'}>
									{mod.type}
								</span>
								<input
									class="module-title-input"
									type="text"
									placeholder="Module title"
									value={mod.title}
									oninput={e => updateModule(mod.id, 'title', e.target.value)}
								/>
								<button class="toggle-btn" onclick={() => toggleModule(mod.id)}>
									{openModules[mod.id] ? '▲' : '▼'}
								</button>
								<button class="remove-btn" onclick={() => removeModule(mod.id)} title="Remove">✕</button>
							</div>

							{#if openModules[mod.id]}
								<div class="module-body">
									{#if mod.type === 'video'}
										<div class="field">
											<label>YouTube / Vimeo URL</label>
											<input
												type="url"
												placeholder="https://www.youtube.com/watch?v=..."
												value={mod.videoUrl}
												oninput={e => updateModule(mod.id, 'videoUrl', e.target.value)}
											/>
										</div>

									{:else if mod.type === 'article'}
										<div class="field">
											<label>Article content <span class="hint">(Markdown)</span></label>
											<textarea
												rows="10"
												placeholder="# Heading&#10;&#10;Paragraph text…"
												value={mod.articleMarkdown}
												oninput={e => updateModule(mod.id, 'articleMarkdown', e.target.value)}
											></textarea>
										</div>

									{:else if mod.type === 'exam'}
										<div class="exam-builder">
											<div class="exam-meta">
												<span>{mod.questions?.length ?? 0} question{mod.questions?.length !== 1 ? 's' : ''}</span>
												<span class="hint">· Passing score: {passingScore}%</span>
											</div>

											{#each mod.questions ?? [] as q, qi (q.id)}
												<div class="question-card">
													<div class="question-header">
														<span class="q-num">Q{qi + 1}</span>
														<button class="remove-btn small" onclick={() => removeQuestion(mod.id, q.id)}>✕</button>
													</div>
													<div class="field">
														<label>Question</label>
														<textarea
															rows="2"
															placeholder="What does MI stand for?"
															value={q.prompt}
															oninput={e => updateQuestion(mod.id, q.id, 'prompt', e.target.value)}
														></textarea>
													</div>
													<div class="choices">
														{#each q.choices as choice, ci}
															<label class="choice-label" class:correct={q.correctIndex === ci}>
																<input
																	type="radio"
																	name="correct-{q.id}"
																	checked={q.correctIndex === ci}
																	onchange={() => updateQuestion(mod.id, q.id, 'correctIndex', ci)}
																/>
																<input
																	class="choice-input"
																	type="text"
																	placeholder="Choice {ci + 1}"
																	value={choice}
																	oninput={e => updateChoice(mod.id, q.id, ci, e.target.value)}
																/>
															</label>
														{/each}
														<p class="choice-hint">Select the radio button next to the correct answer.</p>
													</div>
												</div>
											{/each}

											<button class="btn-add-question" onclick={() => addQuestion(mod.id)}>+ Add question</button>
										</div>
									{/if}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</section>

			<div class="bottom-save">
				{#if saveMsg}<span class="save-msg">{saveMsg} ✓</span>{/if}
				<button class="btn-save large" onclick={save} disabled={saving}>
					{saving ? 'Saving…' : 'Save course'}
				</button>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.editor-page { min-height: 80vh; background: #f7f7f7; }

	.editor-header {
		border-bottom: 1px solid #eee;
		background: white;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.editor-header-inner {
		max-width: 900px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
		height: 60px;
		display: flex;
		align-items: center;
		gap: 1rem;

		.back-link {
			font-size: 0.85rem;
			color: #888;
			box-shadow: none;
			white-space: nowrap;
			&:hover { color: var(--c-dark); box-shadow: none; }
		}

		h1 { font-size: 1rem; font-weight: 700; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.save-msg { font-size: 0.85rem; color: #2a7a3a; }

	.btn-save {
		padding: 0.5rem 1.25rem;
		background: var(--c-green);
		color: var(--c-dark);
		border: none;
		border-radius: var(--border-radius);
		font-size: 0.9rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		white-space: nowrap;
		transition: opacity 0.15s;

		&.large { padding: 0.75rem 2rem; font-size: 1rem; }
		&:hover:not(:disabled) { opacity: 0.85; }
		&:disabled { opacity: 0.5; cursor: default; }
	}

	.loading-state {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 40vh;
	}

	.spinner {
		width: 36px;
		height: 36px;
		border: 3px solid var(--c-gray);
		border-top-color: var(--c-green);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	@keyframes spin { to { transform: rotate(360deg); } }

	.editor-body {
		max-width: 900px;
		margin: 0 auto;
		padding: var(--space-small) var(--container-padding) var(--space-large);
		display: flex;
		flex-direction: column;
		gap: var(--space-small);
	}

	.card {
		background: white;
		border-radius: var(--border-radius);
		border: 1px solid #eee;
		padding: var(--space-small);

		h2 {
			font-size: 1rem;
			font-weight: 700;
			margin-bottom: 1.25rem;
		}
	}

	.fields {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		flex: 1;
		min-width: 200px;

		&.field-wide { flex-basis: 100%; }
		&.field-narrow { max-width: 150px; }

		label {
			font-size: 0.85rem;
			font-weight: 500;
			color: #555;
		}

		input[type="text"], input[type="url"], input[type="number"], select, textarea {
			padding: 0.6rem 0.85rem;
			border: 1.5px solid #ddd;
			border-radius: var(--border-radius);
			font-size: 0.95rem;
			font-family: inherit;
			background: white;
			-webkit-appearance: none;
			transition: border-color 0.15s;
			width: 100%;

			&:focus { border-color: var(--c-green); outline: none; }
		}

		textarea { resize: vertical; line-height: 1.5; }

		.hint { font-size: 0.78rem; color: #aaa; font-weight: 400; margin-left: 0.25rem; }
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		cursor: pointer;

		input[type="checkbox"] { width: 16px; height: 16px; cursor: pointer; }
	}

	/* Modules */

	.modules-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.25rem;

		h2 { margin-bottom: 0; }
		.module-count { font-weight: 400; color: #aaa; }
	}

	.add-module-btns {
		display: flex;
		gap: 0.5rem;
	}

	.btn-add-module {
		padding: 0.4rem 0.85rem;
		background: none;
		border: 1.5px solid #ddd;
		border-radius: 20px;
		font-size: 0.82rem;
		font-weight: 500;
		font-family: inherit;
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;

		&:hover { border-color: var(--c-green); background: color-mix(in srgb, var(--c-green) 10%, white); }
	}

	.no-modules { color: #aaa; font-size: 0.9rem; }

	.module-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.module-card {
		border: 1.5px solid #eee;
		border-radius: var(--border-radius);
		overflow: hidden;
	}

	.module-top {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 0.75rem;
		background: #fafafa;
	}

	.module-drag {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.reorder-btn {
		background: none;
		border: none;
		font-size: 0.75rem;
		cursor: pointer;
		color: #bbb;
		padding: 0 2px;
		line-height: 1;
		transition: color 0.15s;

		&:hover:not(:disabled) { color: var(--c-dark); }
		&:disabled { opacity: 0.3; cursor: default; }
	}

	.module-type-tag {
		font-size: 0.72rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.2rem 0.6rem;
		border-radius: 20px;
		flex-shrink: 0;
		background: #eee;
		color: #666;

		&.video { background: color-mix(in srgb, var(--c-blue) 25%, white); color: #1a6a6a; }
		&.article { background: color-mix(in srgb, var(--c-purple) 25%, white); color: #5a3a8a; }
		&.exam { background: color-mix(in srgb, var(--c-yellow) 40%, white); color: #7a5a00; }
	}

	.module-title-input {
		flex: 1;
		border: none;
		background: transparent;
		font-size: 0.9rem;
		font-family: inherit;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		min-width: 0;

		&:focus { outline: 1px solid var(--c-green); background: white; }
	}

	.toggle-btn {
		background: none;
		border: none;
		font-size: 0.75rem;
		color: #bbb;
		cursor: pointer;
		padding: 0.2rem 0.4rem;
		&:hover { color: var(--c-dark); }
	}

	.remove-btn {
		background: none;
		border: none;
		color: #ccc;
		cursor: pointer;
		font-size: 0.85rem;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		transition: color 0.15s, background 0.15s;

		&:hover { color: #c0392b; background: #fdf2f2; }
		&.small { font-size: 0.75rem; }
	}

	.module-body {
		padding: 1rem;
		border-top: 1px solid #eee;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Exam / Quiz builder */

	.exam-builder {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.exam-meta {
		font-size: 0.85rem;
		color: #888;
	}

	.question-card {
		border: 1px solid #eee;
		border-radius: var(--border-radius);
		padding: 0.9rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background: #fafafa;
	}

	.question-header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.q-num { font-size: 0.8rem; font-weight: 700; color: #888; }
	}

	.choices {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.choice-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		padding: 0.3rem 0.5rem;
		border-radius: 4px;
		transition: background 0.1s;

		&.correct { background: color-mix(in srgb, var(--c-green) 15%, white); }

		input[type="radio"] { flex-shrink: 0; cursor: pointer; }
	}

	.choice-input {
		flex: 1;
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 0.4rem 0.6rem;
		font-size: 0.9rem;
		font-family: inherit;
		background: white;

		&:focus { outline: none; border-color: var(--c-green); }
	}

	.choice-hint { font-size: 0.78rem; color: #aaa; margin-top: 0.25rem; }

	.btn-add-question {
		align-self: flex-start;
		padding: 0.4rem 0.9rem;
		background: none;
		border: 1.5px dashed #ccc;
		border-radius: var(--border-radius);
		font-size: 0.85rem;
		font-family: inherit;
		cursor: pointer;
		color: #888;
		transition: border-color 0.15s, color 0.15s;

		&:hover { border-color: var(--c-green); color: var(--c-dark); }
	}

	.bottom-save {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 1rem;
		padding-bottom: var(--space-small);
	}
</style>
