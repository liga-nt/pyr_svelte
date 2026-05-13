<script>
	import { dev } from '$app/environment';

	// All static routes. Dynamic routes are marked with placeholder examples.
	const ROUTES = [
		{ path: '/', label: 'Home' },
		{ path: '/therapy/', label: 'Therapy' },
		{ path: '/psychiatry/', label: 'Psychiatry' },
		{ path: '/conditions/', label: 'Conditions' },
		{ path: '/team/', label: 'Team' },
		{ path: '/adults/', label: 'Adults' },
		{ path: '/teens/', label: 'Teens' },
		{ path: '/children/', label: 'Children' },
		{ path: '/students/', label: 'Students' },
		{ path: '/anxiety/', label: 'Anxiety' },
		{ path: '/depression/', label: 'Depression' },
		{ path: '/ptsd/', label: 'PTSD' },
		{ path: '/ocd/', label: 'OCD' },
		{ path: '/adhd/', label: 'ADHD' },
		{ path: '/gambling-disorder/', label: 'Gambling Disorder' },
		{ path: '/alcohol-use-disorder/', label: 'Alcohol Use Disorder' },
		{ path: '/opioid-use-disorder/', label: 'Opioid Use Disorder' },
		{ path: '/stimulant-use-disorder/', label: 'Stimulant Use Disorder' },
		{ path: '/cbt/', label: 'CBT' },
		{ path: '/family-therapy/', label: 'Family Therapy' },
		{ path: '/motivational-interviewing/', label: 'Motivational Interviewing' },
		{ path: '/contingency-management/', label: 'Contingency Management' },
		{ path: '/mat/', label: 'MAT' },
		{ path: '/medication/opioid/', label: 'Opioid Medication' },
		{ path: '/psychiatric-evaluation/', label: 'Psychiatric Evaluation' },
		{ path: '/outpatient-detox/', label: 'Outpatient Detox' },
		{ path: '/ce/', label: 'Continuing Ed' },
		{ path: '/videos/', label: 'Videos' },
		{ path: '/booking/', label: 'Booking' },
		{ path: '/beyond-recovery/', label: 'Beyond Recovery' },
		{ path: '/michelle/', label: 'Michelle' },
		{ path: '/privacy/', label: 'Privacy Policy' },
	];

	const GROUPS = [
		{ label: 'Core', paths: ['/', '/therapy/', '/psychiatry/', '/conditions/', '/team/'] },
		{ label: 'Who We Treat', paths: ['/adults/', '/teens/', '/children/', '/students/'] },
		{ label: 'Conditions', paths: ['/anxiety/', '/depression/', '/ptsd/', '/ocd/', '/adhd/', '/gambling-disorder/', '/alcohol-use-disorder/', '/opioid-use-disorder/', '/stimulant-use-disorder/'] },
		{ label: 'Approaches', paths: ['/cbt/', '/family-therapy/', '/motivational-interviewing/', '/contingency-management/'] },
		{ label: 'Psychiatry', paths: ['/mat/', '/medication/opioid/', '/psychiatric-evaluation/', '/outpatient-detox/'] },
		{ label: 'Other', paths: ['/ce/', '/videos/', '/booking/', '/beyond-recovery/', '/michelle/', '/privacy/'] },
	];

	const routeMap = Object.fromEntries(ROUTES.map(r => [r.path, r]));

	// State
	let selected = $state('');
	let tab = $state('meta');
	let loading = $state(false);
	let seoData = $state(null);
	let port = $state('5173');
	let cache = $state({});

	async function select(path) {
		if (selected === path) return;
		selected = path;
		tab = 'meta';
		if (cache[path]) { seoData = cache[path]; return; }
		loading = true;
		seoData = null;
		try {
			const res = await fetch(`/dev/api/seo?route=${encodeURIComponent(path)}&port=${port}`);
			const data = await res.json();
			cache[path] = data;
			seoData = data;
		} catch (e) {
			seoData = { error: e.message };
		}
		loading = false;
	}

	function clearCache() {
		cache = {};
		seoData = null;
	}

	// Validation helpers
	function titleStatus(t) {
		if (!t) return 'missing';
		const l = t.length;
		if (l < 30) return 'short';
		if (l > 60) return 'long';
		return 'ok';
	}

	function descStatus(d) {
		if (!d) return 'missing';
		const l = d.length;
		if (l < 120) return 'short';
		if (l > 160) return 'long';
		return 'ok';
	}

	const statusColor = { ok: '#16a34a', short: '#d97706', long: '#d97706', missing: '#dc2626' };
	const statusLabel = { ok: '✓', short: '⚠ short', long: '⚠ long', missing: '✗ missing' };

	// Per-route icon in sidebar based on what we know
	function routeIcon(path) {
		if (!cache[path]) return '';
		const d = cache[path];
		if (d.error) return '✗';
		const ts = titleStatus(d.title);
		const ds = descStatus(d.meta?.['description']);
		const hasSchema = d.structuredData?.length > 0;
		if (ts === 'ok' && ds === 'ok' && hasSchema) return '✓';
		if (ts === 'missing' || ds === 'missing') return '✗';
		return '⚠';
	}

	function routeIconColor(path) {
		const icon = routeIcon(path);
		if (icon === '✓') return '#16a34a';
		if (icon === '✗') return '#dc2626';
		if (icon === '⚠') return '#d97706';
		return 'transparent';
	}

	// OG/Twitter fields to display
	const OG_FIELDS = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:site_name'];
	const TW_FIELDS = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
</script>

<svelte:head>
	<title>SEO Audit — Dev</title>
</svelte:head>

{#if !dev}
	<div class="not-dev">SEO audit is only available in development mode.</div>
{:else}
	<div class="layout">
		<!-- Sidebar -->
		<aside class="sidebar">
			<div class="sidebar-header">
				<span>SEO Audit</span>
				<a href="/dev/" class="back-link">← Editor</a>
			</div>
			<div class="port-row">
				<label class="port-label" for="port-input">Port</label>
				<input
					id="port-input"
					class="port-input"
					bind:value={port}
					oninput={clearCache}
					placeholder="5173"
				/>
			</div>
			<nav class="route-list">
				{#each GROUPS as group}
					<div class="route-group">
						<p class="group-label">{group.label}</p>
						{#each group.paths as path}
							{@const route = routeMap[path]}
							<button
								class="route-btn"
								class:active={selected === path}
								onclick={() => select(path)}
							>
								<span class="route-icon" style="color: {routeIconColor(path)}">
									{routeIcon(path) || '·'}
								</span>
								{route?.label ?? path}
							</button>
						{/each}
					</div>
				{/each}
			</nav>
		</aside>

		<!-- Main panel -->
		<div class="main">
			{#if !selected}
				<div class="empty">← Select a route to inspect</div>
			{:else if loading}
				<div class="empty">Fetching {selected}…</div>
			{:else if seoData?.error}
				<div class="empty error">Error: {seoData.error}</div>
			{:else if seoData}
				<!-- Header -->
				<div class="panel-header">
					<code class="route-path">{selected}</code>
					<div class="tabs">
						<button class="tab" class:active={tab === 'meta'} onclick={() => (tab = 'meta')}>Meta Tags</button>
						<button class="tab" class:active={tab === 'schema'} onclick={() => (tab = 'schema')}>Structured Data</button>
						<button class="tab" class:active={tab === 'social'} onclick={() => (tab = 'social')}>Social / OG</button>
					</div>
				</div>

				<!-- Tab content -->
				<div class="panel-body">
					{#if tab === 'meta'}
						<!-- Title -->
						<div class="field-block">
							<div class="field-label">
								Title
								{#if seoData.title}
									<span class="char-count" style="color: {statusColor[titleStatus(seoData.title)]}">
										{seoData.title.length} chars — {statusLabel[titleStatus(seoData.title)]}
									</span>
								{:else}
									<span class="char-count" style="color: {statusColor.missing}">{statusLabel.missing}</span>
								{/if}
							</div>
							<div class="field-value" class:missing={!seoData.title}>
								{seoData.title ?? '(no title)'}
							</div>
							<div class="field-hint">Ideal: 30–60 characters</div>
						</div>

						<!-- Description -->
						{@const desc = seoData.meta?.['description']}
						<div class="field-block">
							<div class="field-label">
								Meta Description
								{#if desc}
									<span class="char-count" style="color: {statusColor[descStatus(desc)]}">
										{desc.length} chars — {statusLabel[descStatus(desc)]}
									</span>
								{:else}
									<span class="char-count" style="color: {statusColor.missing}">{statusLabel.missing}</span>
								{/if}
							</div>
							<div class="field-value" class:missing={!desc}>
								{desc ?? '(no description)'}
							</div>
							<div class="field-hint">Ideal: 120–160 characters</div>
						</div>

						<!-- Keywords -->
						{@const kw = seoData.meta?.['keywords']}
						<div class="field-block">
							<div class="field-label">Keywords</div>
							<div class="field-value" class:missing={!kw}>
								{kw ?? '(none)'}
							</div>
						</div>

						<!-- Canonical -->
						<div class="field-block">
							<div class="field-label">Canonical URL</div>
							<div class="field-value" class:missing={!seoData.canonical}>
								{seoData.canonical ?? '(not set)'}
							</div>
						</div>

						<!-- Robots -->
						{@const robots = seoData.meta?.['robots']}
						<div class="field-block">
							<div class="field-label">Robots</div>
							<div class="field-value" class:missing={!robots}>
								{robots ?? '(not set — defaults to index, follow)'}
							</div>
						</div>

					{:else if tab === 'schema'}
						{#if seoData.structuredData?.length}
							{#each seoData.structuredData as schema, i}
								<div class="schema-block">
									<div class="schema-type-badge">
										{schema['@type'] ?? (schema['@graph'] ? '@graph' : 'Unknown')}
									</div>
									<pre class="json-viewer">{JSON.stringify(schema, null, 2)}</pre>
								</div>
							{/each}
						{:else}
							<div class="schema-empty">
								<p class="schema-missing-label">No structured data found on this page.</p>
								<p class="schema-hint">Add a <code>&lt;script type="application/ld+json"&gt;</code> block inside <code>&lt;svelte:head&gt;</code> using <code>{'@html'}</code>.</p>
							</div>
						{/if}

					{:else if tab === 'social'}
						<div class="section-title">Open Graph</div>
						{#each OG_FIELDS as field}
							{@const val = seoData.meta?.[field]}
							<div class="field-block compact">
								<div class="field-label">{field}</div>
								<div class="field-value" class:missing={!val}>{val ?? '(not set)'}</div>
							</div>
						{/each}

						<div class="section-title" style="margin-top: 2rem">Twitter Card</div>
						{#each TW_FIELDS as field}
							{@const val = seoData.meta?.[field]}
							<div class="field-block compact">
								<div class="field-label">{field}</div>
								<div class="field-value" class:missing={!val}>{val ?? '(not set)'}</div>
							</div>
						{/each}
					{/if}
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
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.back-link {
		font-size: 0.65rem;
		color: #aaa;
		text-decoration: none;
		text-transform: none;
		letter-spacing: 0;
		font-weight: 400;

		&:hover { color: #555; }
	}

	.port-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-bottom: 1px solid #f0f0f0;
	}

	.port-label {
		font-size: 0.65rem;
		color: #aaa;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		flex-shrink: 0;
	}

	.port-input {
		width: 60px;
		font-size: 0.78rem;
		font-family: monospace;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		padding: 0.15rem 0.4rem;
		outline: none;
		color: #444;

		&:focus { border-color: #4f6ef7; }
	}

	.route-list {
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem 0;
	}

	.route-group {
		margin-bottom: 0.25rem;
	}

	.group-label {
		padding: 0.5rem 1rem 0.2rem;
		font-size: 0.62rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #ccc;
		margin: 0;
	}

	.route-btn {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		width: 100%;
		text-align: left;
		padding: 0.3rem 1rem;
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

	.route-icon {
		font-size: 0.65rem;
		flex-shrink: 0;
		font-style: normal;
		min-width: 10px;
	}

	/* Main panel */
	.main {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-width: 0;
	}

	.empty {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #bbb;
		font-size: 0.9rem;

		&.error { color: #dc2626; }
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.6rem 1.5rem;
		background: white;
		border-bottom: 1px solid #e8e8e8;
		flex-shrink: 0;
		gap: 1rem;
	}

	.route-path {
		font-family: monospace;
		font-size: 0.82rem;
		color: #999;
	}

	.tabs {
		display: flex;
		gap: 0.25rem;
	}

	.tab {
		padding: 0.3rem 0.8rem;
		border-radius: 20px;
		border: 1px solid #e0e0e0;
		background: none;
		cursor: pointer;
		font-size: 0.78rem;
		color: #888;
		box-shadow: none;
		transition: all 0.15s;

		&:hover {
			border-color: #aaa;
			color: #444;
			box-shadow: none;
		}

		&.active {
			background: #4f6ef7;
			border-color: #4f6ef7;
			color: white;
			font-weight: 500;
		}
	}

	.panel-body {
		flex: 1;
		overflow-y: auto;
		padding: 2rem 2.5rem;
	}

	/* Fields */
	.field-block {
		margin-bottom: 1.75rem;

		&.compact { margin-bottom: 1rem; }
	}

	.field-label {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: #aaa;
		margin-bottom: 0.4rem;
	}

	.char-count {
		font-size: 0.7rem;
		font-weight: 500;
		text-transform: none;
		letter-spacing: 0;
	}

	.field-value {
		font-size: 0.92rem;
		color: #222;
		line-height: 1.55;
		padding: 0.6rem 0.85rem;
		background: white;
		border: 1px solid #e8e8e8;
		border-radius: 6px;

		&.missing {
			color: #bbb;
			font-style: italic;
		}
	}

	.field-hint {
		font-size: 0.7rem;
		color: #ccc;
		margin-top: 0.3rem;
	}

	/* Schema tab */
	.schema-block {
		margin-bottom: 2rem;
	}

	.schema-type-badge {
		display: inline-block;
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: #4f6ef7;
		background: #eef2ff;
		border-radius: 4px;
		padding: 0.2rem 0.6rem;
		margin-bottom: 0.6rem;
	}

	.json-viewer {
		font-family: 'SF Mono', 'Fira Code', monospace;
		font-size: 0.78rem;
		line-height: 1.6;
		background: #1e1e1e;
		color: #d4d4d4;
		padding: 1.25rem 1.5rem;
		border-radius: 8px;
		overflow-x: auto;
		white-space: pre;
		margin: 0;
	}

	.schema-empty {
		padding: 3rem 2rem;
		text-align: center;
		border: 2px dashed #e8e8e8;
		border-radius: 10px;
	}

	.schema-missing-label {
		font-size: 1rem;
		color: #dc2626;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}

	.schema-hint {
		font-size: 0.85rem;
		color: #888;
		line-height: 1.6;

		code {
			background: #f0f0f0;
			padding: 0.1rem 0.35rem;
			border-radius: 3px;
			font-family: monospace;
			font-size: 0.82rem;
		}
	}

	/* Social tab */
	.section-title {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: #aaa;
		margin-bottom: 0.75rem;
	}
</style>
