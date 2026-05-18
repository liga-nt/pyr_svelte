<script>
	import { form } from '../store.svelte.js';

	const MOTHERS_SIDE = [
		{ key: 'h1', label: 'Grandmother' },
		{ key: 'h2', label: 'Grandfather' },
		{ key: 'h3', label: 'Mother' },
		{ key: 'h4', label: 'Aunt' },
		{ key: 'h5', label: 'Uncle' },
	];
	const FATHERS_SIDE = [
		{ key: 'h6', label: 'Grandmother' },
		{ key: 'h7', label: 'Grandfather' },
		{ key: 'h8', label: 'Father' },
		{ key: 'h9', label: 'Aunt' },
		{ key: 'h10', label: 'Uncle' },
	];
	const SIBLINGS = [
		{ key: 'h11', label: 'Brother' },
		{ key: 'h12', label: 'Sister' },
	];

	/** @type {[string, typeof MOTHERS_SIDE][]} */
	const GROUPS = [
		['Mother\'s Side', MOTHERS_SIDE],
		['Father\'s Side', FATHERS_SIDE],
		['Siblings', SIBLINGS],
	];

	const DIMS = [
		{ suffix: 'alc', label: 'Alc' },
		{ suffix: 'drug', label: 'Drug' },
		{ suffix: 'psych', label: 'Psych' },
	];

	const OPTS = [
		{ value: 0, label: '0' },
		{ value: 1, label: '1' },
		{ value: -9, label: '?' },
		{ value: -8, label: 'N/R' },
	];

	/** @param {number | null} current */
	function cycleVal(current) {
		const vals = [null, 0, 1, -9, -8];
		const idx = vals.indexOf(current);
		return vals[(idx + 1) % vals.length];
	}

	/** @param {number | null} v */
	function displayVal(v) {
		if (v === null) return '—';
		if (v === -9) return '?';
		if (v === -8) return 'N/R';
		return String(v);
	}

	/** @param {number | null} v */
	/** @param {number | null} v */
	function cellClass(v) {
		if (v === 1) return 'val-yes';
		if (v === 0) return 'val-no';
		if (v === -9) return 'val-unk';
		if (v === -8) return 'val-nr';
		return 'val-empty';
	}

	/** @param {string} key @returns {number | null} */
	const hget = (key) => /** @type {any} */ (form.h)[key];
	/** @param {string} key @param {number | null} val */
	const hset = (key, val) => { /** @type {any} */ (form.h)[key] = val; };
</script>

<div class="section-body">
	<div class="form-grid">
		<div class="questions">
			<div class="instructions">
				<p>Have any of your blood-related relatives had what you would call a significant drinking, drug use, or psychiatric problem? Specifically, was there a problem that did or should have led to treatment?</p>
				<div class="legend">
					<span class="leg-item val-no">0 — Clearly NO</span>
					<span class="leg-item val-yes">1 — Clearly YES</span>
					<span class="leg-item val-unk">? — Uncertain / don't know</span>
					<span class="leg-item val-nr">N/R — Never was a relative</span>
				</div>
				<p class="click-hint">Click a cell to cycle through values. In cases where more than one person exists for a category, record the occurrence of problems for <em>any</em> in that group.</p>
			</div>

			<div class="h-grid-wrap">
				{#each GROUPS as [groupLabel, relatives]}
					<div class="h-group">
						<div class="h-group-header">{groupLabel}</div>
						<table class="h-table">
							<thead>
								<tr>
									<th class="rel-col">Relative</th>
									{#each DIMS as d}<th class="dim-col">{d.label}</th>{/each}
								</tr>
							</thead>
							<tbody>
								{#each relatives as rel}
									<tr>
										<td class="rel-label">{rel.label}</td>
										{#each DIMS as dim}
											{@const fieldKey = `${rel.key}${dim.suffix}`}
											<td>
												<button
													type="button"
													class="cell-btn {cellClass(hget(fieldKey))}"
													onclick={() => hset(fieldKey, cycleVal(hget(fieldKey)))}
												>{displayVal(hget(fieldKey))}</button>
											</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/each}
			</div>
		</div>

		<div class="comments-col">
			<div class="comments-label">Family History Comments</div>
			<p class="comments-hint">Include the question number with your notes.</p>
			<textarea bind:value={form.h.comments} class="comments-area" rows="20"></textarea>
		</div>
	</div>
</div>

<style lang="scss">
	@use './section-shared' as *;

	.instructions {
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		padding: 0.85rem;
		background: #fafafa;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		p { font-size: 0.88rem; color: var(--c-dark); line-height: 1.6; margin: 0; }
		.click-hint { font-size: 0.78rem; color: #888; font-style: italic; }
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.leg-item {
		font-size: 0.75rem;
		font-family: ibm-plex-mono, monospace;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		border: 1px solid #ddd;
	}

	.h-grid-wrap { display: flex; flex-direction: column; gap: 1rem; }

	.h-group-header {
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #666;
		padding: 0.3rem 0;
		border-bottom: 2px solid #e0e0e0;
		margin-bottom: 0.25rem;
	}

	.h-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.85rem;

		th {
			text-align: center;
			padding: 0.35rem 0.5rem;
			background: #f5f5f5;
			border-bottom: 2px solid #e0e0e0;
			font-weight: 600;
			color: #555;
		}

		td {
			padding: 0.25rem 0.4rem;
			border-bottom: 1px solid #f0f0f0;
			text-align: center;
		}

		tr:last-child td { border-bottom: none; }
	}

	.rel-col { text-align: left !important; width: 45%; }
	.dim-col { width: 18%; }
	.rel-label { text-align: left; font-size: 0.85rem; color: var(--c-dark); padding-left: 0.2rem !important; }

	.cell-btn {
		width: 44px;
		height: 30px;
		border-radius: 4px;
		border: 1px solid #d0d0d0;
		font-size: 0.8rem;
		font-family: ibm-plex-mono, monospace;
		font-weight: 600;
		cursor: pointer;
		box-shadow: none;
		transition: background 0.1s;

		&:hover { opacity: 0.85; box-shadow: none; }
	}

	.val-empty { background: white; color: #bbb; border-color: #e0e0e0; }
	.val-no    { background: #f0f0f0; color: #555; border-color: #ccc; }
	.val-yes   { background: var(--c-green); color: var(--c-dark); border-color: var(--c-green); }
	.val-unk   { background: var(--c-yellow); color: var(--c-dark); border-color: var(--c-yellow); }
	.val-nr    { background: #e8e8e8; color: #888; border-color: #ccc; font-style: italic; }
</style>
