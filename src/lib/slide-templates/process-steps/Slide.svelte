<script>
	import SlideShell from '../_shared/SlideShell.svelte';

	let { heading, prompt = '', steps = [], flow = [] } = $props();
</script>

<SlideShell>
	<h2>{heading}</h2>
	{#if prompt}<p class="prompt">{prompt}</p>{/if}
	<ol>
		{#each steps as step, i}
			<li>
				<span class="num">{i + 1}</span>
				<div class="text">
					<strong>{step.label}</strong>
					<p>{step.description}</p>
				</div>
			</li>
		{/each}
	</ol>
	{#if flow.length}
		<p class="flow">{flow.join(' → ')}</p>
	{/if}
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
	.text strong { font-size: clamp(1rem, 3.6cqi, 1.2rem); }
	.text p { margin: 0; }
	.flow {
		font-family: ibm-plex-sans-condensed, sans-serif;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--c-green-text, #1e7a3c);
		margin-top: 0.25rem;
	}
</style>
