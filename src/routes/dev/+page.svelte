<script>
	import { dev } from '$app/environment';
	import FieldEditor from '$lib/components/dev/FieldEditor.svelte';

	let files = $state([]);
	let selected = $state('');
	let content = $state(null);
	let unusedKeys = $state([]);
	let status = $state('');
	let loading = $state(false);

	let reviewed = $state({});

	async function loadReviewed() {
		try {
			const res = await fetch('/dev/api/reviewed');
			if (res.ok) reviewed = await res.json();
		} catch {}
	}

	async function toggleReviewed() {
		if (!selected || !content) return;
		const newValue = !reviewed[selected];
		reviewed[selected] = newValue;
		content._reviewed = newValue;
		await fetch(`/dev/api/content?file=${encodeURIComponent(selected)}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify($state.snapshot(content))
		});
	}

	const grouped = $derived(
		files.reduce((acc, f) => {
			const dir = f.includes('/') ? f.split('/')[0] : '__root';
			(acc[dir] ??= []).push(f);
			return acc;
		}, {})
	);

	const dirOrder = $derived(
		Object.keys(grouped).sort((a, b) =>
			a === '__root' ? -1 : b === '__root' ? 1 : a.localeCompare(b)
		)
	);

	async function loadFiles() {
		const res = await fetch('/dev/api/files');
		if (res.ok) files = await res.json();
	}

	async function selectFile(file) {
		selected = file;
		content = null;
		unusedKeys = [];
		loading = true;
		status = '';
		const enc = encodeURIComponent(file);
		const [contentRes, analysisRes] = await Promise.all([
			fetch(`/dev/api/content?file=${enc}`),
			fetch(`/dev/api/analysis?file=${enc}`)
		]);
		content = await contentRes.json();
		reviewed[file] = content._reviewed === true;
		const analysis = await analysisRes.json();
		unusedKeys = analysis.unusedKeys ?? [];
		loading = false;
	}

	async function save() {
		if (!selected || !content) return;
		status = 'saving';
		try {
			const res = await fetch(`/dev/api/content?file=${encodeURIComponent(selected)}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify($state.snapshot(content))
			});
			status = res.ok ? 'saved' : 'error';
			if (res.ok) setTimeout(() => { if (status === 'saved') status = ''; }, 2000);
		} catch {
			status = 'error';
		}
	}

	function handleKeydown(e) {
		if ((e.metaKey || e.ctrlKey) && e.key === 's') {
			e.preventDefault();
			save();
		}
	}

	if (dev) {
		loadFiles();
		loadReviewed();
	}
</script>

<svelte:head>
	<title>Content Editor</title>
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

{#if !dev}
	<div class="not-dev">Content editor is only available in development mode.</div>
{:else}
	<div class="layout">
		<!-- Sidebar -->
		<aside class="sidebar">
			<div class="sidebar-header">Content Files</div>
			<nav class="file-list">
				{#each dirOrder as dir}
					<div class="dir-group">
						{#if dir !== '__root'}
							<p class="dir-label">{dir}/</p>
						{/if}
						{#each grouped[dir] as file}
							<button
								class="file-btn"
								class:active={selected === file}
								onclick={() => selectFile(file)}
							>
								<span class="dot" class:visible={reviewed[file]}>✓</span>
								{file.includes('/') ? file.split('/').slice(1).join('/') : file}
							</button>
						{/each}
					</div>
				{/each}
			</nav>
		</aside>

		<!-- Editor -->
		<div class="editor-panel">
			{#if !selected}
				<div class="empty-state">← Select a file to edit</div>
			{:else if loading}
				<div class="empty-state">Loading…</div>
			{:else if content}
				<div class="editor-header">
					<span class="file-path">{selected}</span>
					<div class="actions">
						{#if status === 'saved'}
							<span class="status-saved">Saved ✓</span>
						{:else if status === 'saving'}
							<span class="status-saving">Saving…</span>
						{:else if status === 'error'}
							<span class="status-error">Error</span>
						{/if}
						<button
							class="review-btn"
							class:is-reviewed={reviewed[selected]}
							onclick={toggleReviewed}
						>
							{reviewed[selected] ? '✓ Reviewed' : 'Mark reviewed'}
						</button>
						<button class="save-btn" onclick={save} disabled={status === 'saving'}>
							Save
						</button>
					</div>
				</div>
				<div class="editor-body">
					<FieldEditor bind:value={content} {unusedKeys} />
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	.not-dev {
		padding: 2rem;
		color: #666;
	}

	.layout {
		display: flex;
		height: 100vh;
		overflow: hidden;
		font-family: system-ui, sans-serif;
		background: #f8f8f8;
	}

	/* Sidebar */
	.sidebar {
		width: 220px;
		flex-shrink: 0;
		background: #fff;
		border-right: 1px solid #e8e8e8;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.sidebar-header {
		padding: 0.875rem 1rem;
		border-bottom: 1px solid #e8e8e8;
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #999;
	}

	.file-list {
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem 0;
	}

	.dir-group {
		margin-bottom: 0.25rem;
	}

	.dir-label {
		padding: 0.5rem 1rem 0.2rem;
		font-size: 0.62rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #ccc;
	}

	.file-btn {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		width: 100%;
		text-align: left;
		padding: 0.3rem 1rem 0.3rem 1rem;
		background: none;
		border: none;
		cursor: pointer;
		font-size: 0.8rem;
		color: #555;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		box-shadow: none;

		&:hover {
			background: #f5f5f5;
			box-shadow: none;
			color: #222;
		}

		&.active {
			background: #eef2ff;
			color: #4f6ef7;
			font-weight: 600;
		}
	}

	.dot {
		font-size: 0.65rem;
		color: transparent;
		flex-shrink: 0;
		line-height: 1;
		transition: color 0.15s;

		&.visible {
			color: #16a34a;
		}
	}

	/* Editor panel */
	.editor-panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-width: 0;
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #bbb;
		font-size: 0.9rem;
	}

	.editor-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1.5rem;
		background: white;
		border-bottom: 1px solid #e8e8e8;
		flex-shrink: 0;
		gap: 1rem;
	}

	.file-path {
		font-family: monospace;
		font-size: 0.82rem;
		color: #999;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-shrink: 0;
	}

	.status-saved { font-size: 0.78rem; color: #16a34a; }
	.status-saving { font-size: 0.78rem; color: #aaa; }
	.status-error { font-size: 0.78rem; color: #dc2626; }

	.review-btn {
		padding: 0.3rem 0.75rem;
		border-radius: 20px;
		border: 1px solid #ddd;
		background: none;
		cursor: pointer;
		font-size: 0.78rem;
		color: #888;
		box-shadow: none;
		transition: all 0.15s;

		&:hover {
			border-color: #16a34a;
			color: #16a34a;
			box-shadow: none;
		}

		&.is-reviewed {
			background: #f0fdf4;
			border-color: #16a34a;
			color: #16a34a;
			font-weight: 500;
		}
	}

	.save-btn {
		background: #4f6ef7;
		color: white;
		border: none;
		padding: 0.35rem 0.9rem;
		border-radius: 5px;
		cursor: pointer;
		font-size: 0.82rem;
		font-weight: 500;
		box-shadow: none;

		&:hover:not(:disabled) {
			background: #3b55d4;
			box-shadow: none;
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	.editor-body {
		flex: 1;
		overflow-y: auto;
		padding: 2rem 2.5rem;
	}
</style>
