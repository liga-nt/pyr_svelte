<script>
	import SlideShell from '../_shared/SlideShell.svelte';

	let { left, right, heading = '' } = $props();
</script>

<SlideShell>
	{#if heading}<h2>{heading}</h2>{/if}
	<div class="columns">
		{#each [[left, 'gray'], [right, 'green']] as [col, accent]}
			{#if col}
				<div class="col" style="border-left-color: var(--c-{accent})">
					<h3>{col.title}</h3>
					<ul>
						{#each col.items ?? [] as item}<li>{item}</li>{/each}
					</ul>
				</div>
			{/if}
		{/each}
	</div>
</SlideShell>

<style lang="scss">
	.columns { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-top: 0.25rem; }
	.col { border-left: 3px solid; padding-left: 1rem; display: flex; flex-direction: column; gap: 0.6rem; }
	ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; }
	li { font-size: clamp(1rem, 3.3cqi, 1.35rem); line-height: 1.55; color: #444; }
	@container slides (min-width: 700px) {
		.columns { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
	}
</style>
