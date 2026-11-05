<script>
	import SlideShell from '../_shared/SlideShell.svelte';

	let { heading, points = [] } = $props();
</script>

<SlideShell>
	<h2>{heading}</h2>
	<ul>
		{#each points as point}
			<li>{point}</li>
		{/each}
	</ul>
</SlideShell>

<style lang="scss">
	ul {
		list-style: none;
		padding: 0;
		margin: 0.25rem 0 0;
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}
	/* The home page's callout: a 3px green rule and space, not a bullet. */
	li {
		border-left: 3px solid var(--c-green);
		padding-left: 1rem;
		font-size: clamp(1.05rem, 3.6cqi, 1.55rem);
		line-height: 1.55;
		color: #444;
	}
</style>
