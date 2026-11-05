<script>
	import { getTemplate, slideLabel } from '$lib/slide-templates/index.js';

	let {
		slides = [],
		selectedId = '',
		audio = {}, // slide id -> 'none' | 'current' | 'stale'
		readonly = false,
		onselect,
		onadd,
		onmove,
		ondelete
	} = $props();

	let confirming = $state('');
	const labels = { none: 'No audio', current: 'Recorded', stale: 'Re-record' };
</script>

<div class="list">
	<ol>
		{#each slides as s, i (s.id)}
			<li class:selected={s.id === selectedId}>
				<button type="button" class="pick" onclick={() => onselect(s.id)} aria-current={s.id === selectedId ? 'true' : undefined}>
					<span class="num">{i + 1}</span>
					<span class="text">
						<span class="title">{slideLabel(s)}</span>
						<span class="meta">
							{getTemplate(s.layout)?.label ?? s.layout}
							<span class="chip {audio[s.id] ?? 'none'}">{labels[audio[s.id] ?? 'none']}</span>
						</span>
					</span>
				</button>
				{#if s.id === selectedId && !readonly}
					<div class="tools">
						<button type="button" class="tool" aria-label="Move up" disabled={i === 0} onclick={() => onmove(s.id, -1)}>↑</button>
						<button type="button" class="tool" aria-label="Move down" disabled={i === slides.length - 1} onclick={() => onmove(s.id, 1)}>↓</button>
						{#if confirming === s.id}
							<button type="button" class="tool danger" onclick={() => { confirming = ''; ondelete(s.id); }}>Delete slide?</button>
							<button type="button" class="tool" onclick={() => (confirming = '')}>Keep</button>
						{:else}
							<button type="button" class="tool" onclick={() => (confirming = s.id)}>Delete</button>
						{/if}
					</div>
				{/if}
			</li>
		{/each}
	</ol>
	{#if !readonly}<button type="button" class="add" onclick={onadd}>+ Add slide</button>{/if}
</div>

<style>
	.list { display: flex; flex-direction: column; gap: 0.75rem; }
	ol { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; border-top: 1px solid #eee; }
	li { border-bottom: 1px solid #eee; }
	li.selected { background: color-mix(in srgb, var(--c-green) 9%, white); }
	.pick, .tool, .add {
		font-family: ibm-plex-sans, sans-serif;
		font-style: normal;
		font-weight: 400;
		text-transform: none;
		letter-spacing: normal;
		color: var(--c-dark);
	}
	.pick { display: flex; gap: 0.7rem; align-items: flex-start; width: 100%; text-align: left; padding: 0.65rem 0.5rem; min-height: 48px; }
	.num { flex: 0 0 1.6rem; color: var(--c-text-muted, #666); font-size: 0.85rem; padding-top: 0.1rem; }
	.text { display: flex; flex-direction: column; min-width: 0; gap: 0.15rem; }
	.title { font-size: 0.95rem; line-height: 1.3; overflow-wrap: anywhere; }
	.meta { font-size: 0.75rem; color: var(--c-text-muted, #666); display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
	.chip { padding: 0.05rem 0.45rem; border-radius: 10px; background: #f0f0f0; }
	.chip.current { background: color-mix(in srgb, var(--c-green) 25%, white); }
	.chip.stale { background: color-mix(in srgb, var(--c-yellow) 45%, white); }
	.tools { display: flex; gap: 0.35rem; padding: 0 0.5rem 0.6rem 2.6rem; flex-wrap: wrap; }
	.tool { min-height: 36px; padding: 0 0.7rem; border: 1px solid #ddd; border-radius: 6px; background: #fff; font-size: 0.8125rem; }
	.tool:disabled { opacity: 0.4; }
	.tool.danger { border-color: #b25050; color: #8a1f1f; }
	.add { min-height: 44px; border: 1.5px dashed #bbb; border-radius: 8px; background: transparent; }
	.add:hover { border-color: var(--c-green); }
	button:focus-visible { outline: 2px solid var(--c-dark); outline-offset: 2px; }
</style>
