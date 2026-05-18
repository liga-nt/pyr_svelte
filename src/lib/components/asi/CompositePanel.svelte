<script>
	import { getComposites } from './store.svelte.js';
	const composites = $derived(getComposites());

	const DOMAINS = [
		{ key: 'medcomp', abbr: 'MED', label: 'Medical' },
		{ key: 'empcomp', abbr: 'EMP', label: 'Employment' },
		{ key: 'alccomp', abbr: 'ALC', label: 'Alcohol' },
		{ key: 'drgcomp', abbr: 'DRG', label: 'Drug' },
		{ key: 'legcomp', abbr: 'LEG', label: 'Legal' },
		{ key: 'famcomp', abbr: 'FAM', label: 'Family' },
		{ key: 'psycomp', abbr: 'PSY', label: 'Psychiatric' },
	];

	/** @param {number | null | undefined} v */
	function fmt(v) {
		if (v === null || v === undefined) return '—';
		return Math.min(v, 1).toFixed(2);
	}

	/** @param {number | null | undefined} v */
	function pct(v) {
		if (v === null || v === undefined) return 0;
		return Math.min(Math.max(v, 0), 1) * 100;
	}
</script>

<aside class="composite-panel no-print">
	<div class="panel-title">Live Composite Scores</div>
	<div class="panel-scores">
		{#each DOMAINS as d}
			{@const val = (/** @type {any} */ (composites))[d.key]}
			<div class="panel-row">
				<span class="panel-abbr">{d.abbr}</span>
				<div class="mini-bar">
					<div class="mini-fill" style="width: {pct(val)}%"></div>
				</div>
				<span class="panel-val">{fmt(val)}</span>
			</div>
		{/each}
	</div>
	<div class="panel-note">Updates as you enter data</div>
</aside>

<style lang="scss">
	.composite-panel {
		position: sticky;
		top: 1rem;
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		padding: 0.85rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.panel-title {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: #666;
	}

	.panel-scores {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.panel-row {
		display: grid;
		grid-template-columns: 36px 1fr 36px;
		align-items: center;
		gap: 0.4rem;
	}

	.panel-abbr {
		font-size: 0.68rem;
		font-family: ibm-plex-mono, monospace;
		font-weight: 700;
		color: #888;
	}

	.mini-bar {
		height: 6px;
		background: #f0f0f0;
		border-radius: 3px;
		overflow: hidden;
	}

	.mini-fill {
		height: 100%;
		background: var(--c-blue);
		border-radius: 3px;
		transition: width 0.25s ease;
		min-width: 0;
	}

	.panel-val {
		font-size: 0.72rem;
		font-family: ibm-plex-mono, monospace;
		color: var(--c-dark);
		text-align: right;
	}

	.panel-note {
		font-size: 0.68rem;
		color: #bbb;
		font-style: italic;
	}

	@media print { .no-print { display: none !important; } }
</style>
