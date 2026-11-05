<script>
	import SlideShell from '../_shared/SlideShell.svelte';

	let { stat, unit = '', caption = '', source = '', accent = 'green' } = $props();
</script>

<SlideShell blob="bottom-left">
	<span class="bar" style="background: var(--c-{accent})"></span>
	<div class="stat">{stat}</div>
	{#if unit}<div class="unit">{unit.trim()}</div>{/if}
	{#if caption}<p class="caption">{caption}</p>{/if}
	{#if source}<p class="source">{source}</p>{/if}
</SlideShell>

<style lang="scss">
	.bar { display: block; width: 45%; height: 12px; border-radius: 6px; }
	.stat {
		font-family: orpheuspro, serif;
		font-weight: 700;
		font-size: clamp(3.25rem, 18cqi, 8rem);
		line-height: 1;
		letter-spacing: -0.01em;
		color: #444;
	}
	.unit {
		font-family: orpheuspro, serif;
		font-weight: 700;
		font-size: clamp(1.25rem, 5cqi, 2.4rem);
		line-height: 1.2;
		margin-top: -0.25rem;
		color: #444;
	}
	.caption { max-width: 36rem; }
</style>
