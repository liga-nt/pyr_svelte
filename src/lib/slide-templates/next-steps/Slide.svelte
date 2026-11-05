<script>
	import SlideShell from '../_shared/SlideShell.svelte';

	let { heading, prompt = '', steps = [] } = $props();
</script>

<SlideShell>
	<h2>{heading}</h2>
	{#if prompt}<p class="prompt">{prompt}</p>{/if}
	<ol>
		{#each steps as step, i}
			<li>
				<span class="num">{i + 1}</span>
				<div class="text">
					<strong>Step {i + 1}</strong>
					<p>{step}</p>
				</div>
			</li>
		{/each}
	</ol>
</SlideShell>

<style lang="scss">
	.prompt { margin: 0; }
	ol { list-style: none; margin: 0.5rem 0 0; padding: 0; display: flex; flex-direction: column; gap: 0.9rem; }
	li { display: flex; gap: 0.75rem; align-items: flex-start; }
	.num {
		flex-shrink: 0;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 50%;
		background: var(--c-green);
		color: #1e3a24;
		font-family: ibm-plex-sans-condensed, sans-serif;
		font-weight: 800;
		display: grid;
		place-items: center;
		font-size: 0.9rem;
	}
	.text { display: flex; flex-direction: column; gap: 0.1rem; }
	.text strong { font-size: 0.95rem; }
	.text p { margin: 0; }
</style>
