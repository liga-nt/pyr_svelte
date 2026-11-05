<script>
	// A grid of every icon in the shared library (_shared/icons.js), rendered through the real
	// IconBadge component, so this is what any template using it will actually show — not a
	// reimplementation of it. Not wired into any slide template right now; this page exists so
	// the icon system can be checked on its own before it's used anywhere.
	import { dev } from '$app/environment';
	import IconBadge from '$lib/slide-templates/_shared/IconBadge.svelte';
	import { iconIds, icons } from '$lib/slide-templates/_shared/icons.js';
</script>

<svelte:head><title>Icon library | dev</title></svelte:head>

{#if !dev}
	<div class="not-dev">This page is only available in development mode.</div>
{:else}
	<div class="page">
		<h1>Icon library</h1>
		<p class="lead">Every icon in <code>_shared/icons.js</code>, rendered through the real <code>IconBadge</code> component.</p>
		<div class="grid">
			{#each iconIds as id}
				<div class="cell">
					<IconBadge icon={id} />
					<span class="label">{icons[id].label}</span>
					<span class="id">{id}</span>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style lang="scss">
	.not-dev { padding: 2rem; color: #666; font-family: system-ui, sans-serif; }
	.page { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem 4rem; font-family: system-ui, sans-serif; }
	h1 { margin: 0 0 0.25rem; font-size: 1.5rem; }
	.lead { margin: 0 0 2rem; color: #666; font-size: 0.9rem; }
	.lead code { background: #f0f0f0; padding: 0.1rem 0.35rem; border-radius: 3px; font-size: 0.85em; }
	.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1.5rem; }
	.cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1.5rem 1rem;
		border: 1px solid #e8e4ee;
		border-radius: 10px;
		background: #fff;
	}
	.label { font-size: 0.9rem; font-weight: 600; color: #222; }
	.id { font-size: 0.75rem; color: #999; font-family: monospace; }
</style>
