<script>
	import SlideShell from '../_shared/SlideShell.svelte';

	let { heading, prompt = '', takeaway, source = '' } = $props();
</script>

<SlideShell>
	<h2>{heading}</h2>
	{#if prompt}<p class="prompt">{prompt}</p>{/if}
	<blockquote>
		<p>{takeaway}</p>
		{#if source}<footer>{source}</footer>{/if}
	</blockquote>
</SlideShell>

<style lang="scss">
	.prompt { margin: 0; }

	/* The site's blockquote: 4px green rule, italic, no quote marks. Matches "quote". */
	blockquote { border-left: 4px solid var(--c-green); padding-left: 1.25rem; margin: 0.5rem 0 0; }
	blockquote p { font-style: italic; font-size: clamp(1.1rem, 4.2cqi, 1.75rem); line-height: 1.5; margin: 0; color: #333; }
	footer { margin-top: 0.75rem; font-size: 0.85rem; color: var(--c-text-muted, #666); }
</style>
