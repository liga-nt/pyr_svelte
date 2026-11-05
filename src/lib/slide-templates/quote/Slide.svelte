<script>
	import SlideShell from '../_shared/SlideShell.svelte';

	let { quote, eyebrow = '', attribution = '' } = $props();
</script>

<SlideShell>
	{#if eyebrow}<div class="eyebrow">{eyebrow}</div>{/if}
	<blockquote>
		<p>{quote}</p>
		{#if attribution}<footer>{attribution}</footer>{/if}
	</blockquote>
</SlideShell>

<style lang="scss">
	/* The site's blockquote: 4px green rule, italic, no quote marks. */
	blockquote {
		border-left: 4px solid var(--c-green);
		padding-left: 1.25rem;
		margin: 0.25rem 0 0;
	}
	blockquote p {
		font-style: italic;
		font-size: clamp(1.2rem, 4.6cqi, 2.1rem);
		line-height: 1.5;
	}
	footer {
		margin-top: 1rem;
		font-size: 0.9rem;
		color: var(--c-text-muted, #666);
	}
</style>
