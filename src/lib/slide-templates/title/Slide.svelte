<script>
	import ColorBar from '../../components/ColorBar.svelte';
	import SlideShell from '../_shared/SlideShell.svelte';

	let { title, eyebrow = '', subtitle = '', credits = '', accent = 'green' } = $props();
</script>

<SlideShell blob="none">
	<div class="title">
		<div class="text">
			<ColorBar color={accent} position="left" />
			{#if eyebrow}<div class="eyebrow">{eyebrow}</div>{/if}
			<h1>{title}</h1>
			{#if subtitle}<p class="subtitle">{subtitle}</p>{/if}
			{#if credits}<p class="meta">{credits}</p>{/if}
		</div>
		<div class="art" aria-hidden="true">
			<img class="shape" src="/img/illustration/shape-home.svg" alt="" />
			<img class="people" src="/img/illustration/pyr-home.png" alt="" />
		</div>
	</div>
</SlideShell>

<style lang="scss">
	.title { display: grid; grid-template-columns: 1fr; gap: 1.5rem; align-items: center; }
	.text { display: flex; flex-direction: column; gap: 1rem; min-width: 0; }
	.text :global(.color-bar) { margin-bottom: 0; }
	.subtitle { max-width: 34rem; }

	/* Phone: the hero illustration sits under the text. Wider: alongside it. */
	.art { position: relative; display: block; width: min(100%, 15rem); margin: 0.5rem auto 0; }
	.shape { position: absolute; width: 112%; left: -6%; top: 50%; transform: translateY(-50%); }
	.people { position: relative; z-index: 1; width: 100%; height: auto; display: block; }

	@container slides (min-width: 700px) {
		.title { grid-template-columns: 1fr 15rem; gap: 2rem; }
		.art { width: auto; margin: 0; }
	}
</style>
