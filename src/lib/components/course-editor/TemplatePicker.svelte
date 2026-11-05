<script>
	// A grid of every registered template, each shown live from its own sample data. Templates
	// added to the registry appear here on their own.
	import { templateList } from '$lib/slide-templates/index.js';

	let { current = '', onpick, oncancel = null, title = 'Choose a template' } = $props();
</script>

<div class="picker" role="group" aria-label={title}>
	<div class="head">
		<h3>{title}</h3>
		{#if oncancel}<button type="button" class="quiet" onclick={oncancel}>Cancel</button>{/if}
	</div>
	<div class="grid">
		{#each templateList as t (t.id)}
			<button type="button" class="card" class:current={t.id === current} onclick={() => onpick(t.id)}>
				<span class="thumb" aria-hidden="true">
					<span class="frame"><t.component {...t.sample} /></span>
				</span>
				<span class="name">{t.label}{#if t.id === current} (current){/if}</span>
				<span class="desc">{t.description}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.picker { border: 1px solid #e8e4ee; border-radius: 8px; padding: 1rem; background: #fafafa; display: flex; flex-direction: column; gap: 0.75rem; }
	.head { display: flex; justify-content: space-between; align-items: center; }
	h3 { margin: 0; font-size: 1.05rem; }
	.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 0.75rem; }
	.card {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		text-align: left;
		background: #fff;
		border: 1.5px solid #e8e4ee;
		border-radius: 8px;
		padding: 0.6rem;
		cursor: pointer;
		font-family: ibm-plex-sans, sans-serif;
		font-style: normal;
		font-weight: 400;
		text-transform: none;
		letter-spacing: normal;
		color: var(--c-dark);
	}
	.card:hover { border-color: var(--c-green); }
	.card.current { border-color: var(--c-green); background: color-mix(in srgb, var(--c-green) 8%, white); }
	.thumb { display: block; height: 110px; overflow: hidden; border-radius: 6px; background: #fff; border: 1px solid #eee; position: relative; }
	/* The slide is drawn at a real width and scaled down, so it looks like it will in the player. */
	.frame { display: block; width: 640px; container-type: inline-size; container-name: slides; transform: scale(0.27); transform-origin: top left; --slide-rule: none; pointer-events: none; }
	.name { font-weight: 600; font-size: 0.95rem; }
	.desc { font-size: 0.8125rem; color: var(--c-text-muted, #666); line-height: 1.4; }
	.quiet { min-height: 36px; }
</style>
