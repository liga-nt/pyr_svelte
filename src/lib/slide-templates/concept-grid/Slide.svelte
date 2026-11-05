<script>
	import SlideShell from '../_shared/SlideShell.svelte';

	let { heading, items = [], footer = '' } = $props();
</script>

<SlideShell>
	<h2>{heading}</h2>
	<div class="grid">
		{#each items as item}
			<div class="item">
				<h3>{item.label}</h3>
				<p>{item.description}</p>
				{#if item.source}<p class="source">{item.source}</p>{/if}
			</div>
		{/each}
	</div>
	{#if footer}<p class="footer">{footer}</p>{/if}
</SlideShell>

<style lang="scss">
	.grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.25rem;
		margin-top: 0.25rem;
	}
	.item {
		border-left: 3px solid var(--c-green);
		padding-left: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.item h3 { font-size: clamp(1.05rem, 3.8cqi, 1.4rem); }
	.item p { font-size: clamp(0.95rem, 3.2cqi, 1.15rem); }
	.footer {
		font-style: italic;
		color: var(--c-text-muted, #666);
		margin-top: 0.25rem;
	}
	@container slides (min-width: 700px) {
		.grid { grid-template-columns: 1fr 1fr; gap: 1.5rem 2.5rem; }
	}
</style>
