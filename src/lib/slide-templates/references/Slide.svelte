<script>
	import SlideShell from '../_shared/SlideShell.svelte';

	let { citations = [], heading = 'References', note = '' } = $props();
</script>

<SlideShell blob="none">
	<h2>{heading}</h2>
	<ol>
		{#each citations as citation}<li>{citation}</li>{/each}
	</ol>
	{#if note}<p class="source">{note}</p>{/if}
</SlideShell>

<style lang="scss">
	ol { margin: 0; padding-left: 1.35rem; display: flex; flex-direction: column; gap: 0.625rem; }
	li { font-size: 0.875rem; line-height: 1.55; color: #555; }
</style>
