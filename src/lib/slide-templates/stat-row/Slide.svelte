<script>
	import SlideShell from '../_shared/SlideShell.svelte';

	let { heading, stats = [], source = '' } = $props();
</script>

<SlideShell>
	<h2>{heading}</h2>
	<div class="stats">
		{#each stats as s}
			<div class="stat">
				<div class="value">{s.value}</div>
				<p class="caption">{s.caption}</p>
			</div>
		{/each}
	</div>
	{#if source}<p class="source">{source}</p>{/if}
</SlideShell>

<style lang="scss">
	.stats {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		margin-top: 0.25rem;
	}
	.stat {
		padding-left: 1rem;
		border-left: 3px solid var(--c-green);
	}
	.value {
		font-family: orpheuspro, serif;
		font-weight: 700;
		font-size: clamp(2rem, 9cqi, 3.25rem);
		line-height: 1;
		letter-spacing: -0.01em;
		color: #444;
	}
	.caption { margin-top: 0.35rem; max-width: 22rem; }

	@container slides (min-width: 700px) {
		.stats { flex-direction: row; gap: 0; }
		.stat {
			flex: 1;
			padding: 0 1.5rem;
			border-left: 1px solid var(--c-gray);
		}
		.stat:first-child { padding-left: 0; border-left: none; }
	}
</style>
